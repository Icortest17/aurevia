import "./site.css";

const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/* ---------- Cabecera ---------- */
const header = document.querySelector(".site-header");
const nav = document.getElementById("nav");
const menuBtn = document.querySelector(".menu-btn");
const onScrollHeader = () => header?.classList.toggle("solid", window.scrollY > 40);
onScrollHeader();
window.addEventListener("scroll", onScrollHeader, { passive: true });
menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("open");
  menuBtn.setAttribute("aria-expanded", String(open));
});
nav?.addEventListener("click", (e) => {
  if (e.target.closest("a")) {
    nav.classList.remove("open");
    menuBtn?.setAttribute("aria-expanded", "false");
  }
});

/* ---------- Revelado al hacer scroll ---------- */
const io = new IntersectionObserver(
  (entries) => entries.forEach((en) => en.isIntersecting && (en.target.classList.add("in"), io.unobserve(en.target))),
  { threshold: 0.12, rootMargin: "0px 0px -6% 0px" }
);
document.querySelectorAll(".reveal").forEach((el) => io.observe(el));

/* ---------- Chat del hero (bucle automático) ---------- */
document.querySelectorAll("[data-autochat]").forEach((box) => {
  const msgs = [...box.querySelectorAll(".msg")];
  if (reduce) return msgs.forEach((m) => m.classList.add("on"));
  const delays = [500, 1700, 3000, 4700, 6200];
  const run = () => {
    msgs.forEach((m) => m.classList.remove("on"));
    msgs.forEach((m, i) => setTimeout(() => m.classList.add("on"), delays[i] ?? 1500 * (i + 1)));
  };
  run();
  setInterval(run, 11500);
});

/* ---------- Historia: la casa se transforma con el scroll ---------- */
const story = document.getElementById("chat");
if (story && !reduce) {
  const canvas = story.querySelector("canvas");
  const ctx = canvas.getContext("2d");
  const total = Number(story.dataset.frames);
  const base = story.dataset.base;
  const frames = new Array(total);
  const load = (i) =>
    new Promise((res) => {
      if (frames[i]) return res();
      const img = new Image();
      img.decoding = "async";
      img.onload = () => ((frames[i] = img), res());
      img.onerror = () => res();
      img.src = `${base}${String(i + 1).padStart(3, "0")}.webp`;
    });

  let lastDrawn = -1;
  const fit = () => {
    const r = canvas.getBoundingClientRect();
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = Math.round(r.width * dpr);
    canvas.height = Math.round(r.height * dpr);
    lastDrawn = -1;
  };
  const draw = (i) => {
    const img = frames[i] || frames.slice(0, i).reverse().find(Boolean) || frames.find(Boolean);
    if (!img) return;
    const cw = canvas.width, ch = canvas.height;
    const s = Math.max(cw / img.width, ch / img.height);
    const w = img.width * s, h = img.height * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) * 0.3, w, h); // sesgo hacia arriba: que no se corte el tejado
    lastDrawn = i;
  };

  const msgs = [...story.querySelectorAll(".msg[data-at]")];
  const titles = [...story.querySelectorAll(".step-title > div")];
  const bar = story.querySelector(".story-bar i");
  const pct = story.querySelector("[data-pct]");
  const stateLbl = story.querySelector("[data-state]");
  const hint = story.querySelector(".scroll-hint");

  let target = 0, current = 0;
  const readProgress = () => {
    const r = story.getBoundingClientRect();
    const span = r.height - window.innerHeight;
    target = Math.min(1, Math.max(0, -r.top / span));
  };

  const tick = () => {
    current += (target - current) * 0.12;
    if (Math.abs(target - current) < 0.0005) current = target;
    // El vídeo ocupa el tramo 8%-92% del scroll; antes y después se queda en el primer/último fotograma.
    const vp = Math.min(1, Math.max(0, (current - 0.08) / 0.84));
    const idx = Math.round(vp * (total - 1));
    if (idx !== lastDrawn) draw(idx);
    if (bar) bar.style.width = `${(current * 100).toFixed(1)}%`;
    if (pct) pct.textContent = `${Math.round(vp * 100)}%`;
    if (stateLbl) stateLbl.textContent = vp < 0.5 ? "Antes" : "Después";
    msgs.forEach((m) => m.classList.toggle("on", current >= Number(m.dataset.at)));
    let active = 0;
    titles.forEach((t, i) => { if (current >= Number(t.dataset.from)) active = i; });
    titles.forEach((t, i) => t.classList.toggle("on", i === active));
    if (hint) hint.style.opacity = current > 0.03 ? "0" : "1";
    requestAnimationFrame(tick);
  };

  // Carga: primer fotograma ya; el resto en orden salteado para tener todo el recorrido pronto.
  const order = [0, total - 1];
  for (const step of [8, 4, 2, 1]) {
    for (let i = 0; i < total; i += step) if (!order.includes(i)) order.push(i);
  }
  load(0).then(() => { fit(); draw(0); });
  (async () => {
    for (let k = 0; k < order.length; k += 6) await Promise.all(order.slice(k, k + 6).map(load));
  })();

  window.addEventListener("resize", () => { fit(); draw(Math.max(0, lastDrawn)); });
  window.addEventListener("scroll", readProgress, { passive: true });
  readProgress(); current = target; fit(); requestAnimationFrame(tick);
} else if (story) {
  story.querySelector(".story-static")?.removeAttribute("hidden");
  story.querySelector("canvas")?.setAttribute("hidden", "");
  story.querySelectorAll(".msg").forEach((m) => m.classList.add("on"));
  story.querySelector(".step-title > div")?.classList.add("on");
}

/* ---------- Comparadores antes/después ---------- */
document.querySelectorAll(".ba").forEach((ba) => {
  const input = ba.querySelector("input");
  const set = (v) => ba.style.setProperty("--pos", `${v}%`);
  input.addEventListener("input", () => set(input.value));
  set(input.value);
  if (!reduce) {
    const o = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      o.disconnect();
      const t0 = performance.now();
      const anim = (t) => {
        const k = Math.min(1, (t - t0) / 1400);
        const v = 50 + Math.sin(k * Math.PI * 2) * 28 * (1 - k);
        input.value = v; set(v);
        if (k < 1) requestAnimationFrame(anim);
      };
      requestAnimationFrame(anim);
    }, { threshold: 0.6 });
    o.observe(ba);
  }
});

/* ---------- Analítica de conversión (Vercel Analytics, sin cookies) ---------- */
const track = (name) => { try { window.va?.("event", { name }); } catch {} };
document.addEventListener("click", (e) => {
  const a = e.target.closest("[data-track]");
  if (a) track(a.dataset.track);
});

/* ---------- Galería con filtros ---------- */
document.querySelectorAll("[data-gallery]").forEach((g) => {
  const items = [...g.querySelectorAll(".ba-item")];
  g.querySelectorAll(".tab").forEach((t) =>
    t.addEventListener("click", () => {
      g.querySelectorAll(".tab").forEach((x) => { x.classList.toggle("on", x === t); x.setAttribute("aria-selected", String(x === t)); });
      items.forEach((it) => (it.hidden = t.dataset.filter !== "todos" && it.dataset.cat !== t.dataset.filter));
      track("gallery_filter_" + t.dataset.filter);
    })
  );
});

/* ---------- Mismo salón, varios estilos ---------- */
document.querySelectorAll("[data-styles]").forEach((box) => {
  const imgs = [...box.querySelectorAll(".style-stage img")];
  const label = box.querySelector("[data-style-label]");
  box.querySelectorAll("[data-style-btn]").forEach((b) =>
    b.addEventListener("click", () => {
      box.querySelectorAll("[data-style-btn]").forEach((x) => x.classList.toggle("on", x === b));
      imgs.forEach((i) => i.classList.toggle("on", i.dataset.style === b.dataset.styleBtn));
      label.textContent = b.dataset.label ?? "Punto de partida";
      track("style_" + b.dataset.styleBtn);
    })
  );
});

/* ---------- Vídeos reales ---------- */
document.querySelectorAll("[data-videos]").forEach((box) => {
  const v = box.querySelector("video");
  const load = (slug) => {
    v.poster = `/media/real/${slug}-poster.webp`;
    v.src = `/media/real/${slug}.mp4`;
    v.load();
    v.play().catch(() => {});
  };
  let started = false;
  const o = new IntersectionObserver(([e]) => {
    if (e.isIntersecting) {
      if (!started) { started = true; v.src = v.dataset.src; v.load(); }
      v.play().catch(() => {});
    } else v.pause();
  }, { threshold: 0.35 });
  if (!reduce) o.observe(v);
  box.querySelectorAll("[data-video-btn]").forEach((b) =>
    b.addEventListener("click", () => {
      box.querySelectorAll("[data-video-btn]").forEach((x) => x.classList.toggle("on", x === b));
      started = true; load(b.dataset.videoBtn);
      track("video_" + b.dataset.videoBtn);
    })
  );
  v.addEventListener("click", () => (v.paused ? v.play() : v.pause()));
});

/* ---------- Calculadora de retorno ---------- */
const roi = document.querySelector("[data-roi]");
if (roi) {
  const f = (n) => new Intl.NumberFormat("es-ES").format(Math.round(n));
  const inputs = [...roi.querySelectorAll("input[type=range]")];
  const upd = () => {
    const [n, m, d] = inputs.map((i) => Number(i.value));
    roi.querySelector("[data-n]").textContent = n;
    roi.querySelector("[data-m]").textContent = f(m) + " €";
    roi.querySelector("[data-d]").textContent = d + (d === 1 ? " día" : " días");
    roi.querySelector("[data-out]").textContent = f(n * 12 * m) + " €";
    roi.querySelector("[data-days]").textContent = f(n * 12 * d) + " días";
  };
  inputs.forEach((i) => i.addEventListener("input", upd));
  roi.addEventListener("input", () => track("roi_calc"), { once: true });
  upd();
}

/* ---------- Barra de contacto en móvil ---------- */
const sticky = document.getElementById("stickyCta");
if (sticky) {
  const contact = document.getElementById("contacto");
  const upd = () => {
    const past = window.scrollY > window.innerHeight * 0.8;
    const atContact = contact ? contact.getBoundingClientRect().top < window.innerHeight * 0.7 : false;
    sticky.classList.toggle("show", past && !atContact);
  };
  window.addEventListener("scroll", upd, { passive: true });
  upd();
}

/* ---------- Formulario (Formspree) ---------- */
document.querySelectorAll("form[data-form]").forEach((form) => {
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const btn = form.querySelector("button[type=submit]");
    btn.disabled = true; btn.textContent = "Enviando…";
    try {
      const res = await fetch(form.action, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      if (!res.ok) throw new Error();
      track("form_submit");
      form.querySelectorAll("label, button, small").forEach((x) => (x.style.display = "none"));
      form.querySelector(".ok").style.display = "block";
    } catch {
      btn.disabled = false; btn.textContent = "Reintentar envío";
      alert("No se ha podido enviar. Escríbenos por WhatsApp y te atendemos enseguida.");
    }
  });
});
