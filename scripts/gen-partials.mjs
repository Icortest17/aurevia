// Genera partials HTML estáticos (galería real, estilos, vídeos) desde src/real.json.
// Uso: node scripts/gen-partials.mjs (se ejecuta solo antes de dev/build)
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url"; const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const data = JSON.parse(readFileSync(resolve(root, "src/real.json"), "utf8"));
const out = resolve(root, "partials");
mkdirSync(out, { recursive: true }); const CATS = [ ["todos", "Todos"], ["salones", "Salones"], ["cocinas", "Cocinas"], ["banos", "Baños"], ["dormitorios", "Dormitorios"], ["exteriores", "Exteriores"]
];
const esc = (s) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;"); const item = (it, eager = false) => ` <article class="ba-item" data-cat="${it.cat}"> <div class="ba"> <img src="/media/real/${it.slug}-antes.webp" alt="Antes: ${esc(it.alt)} sin reformar" width="1200" height="800" ${eager ? "" : 'loading="lazy"'} decoding="async" /> <img class="after" src="/media/real/${it.slug}-despues.webp" alt="Después: ${esc(it.alt)} reformado con IA" width="1200" height="800" ${eager ? "" : 'loading="lazy"'} decoding="async" /> <span class="handle"></span><span class="lbl l">Antes</span><span class="lbl r">Después</span> <input type="range" min="0" max="100" value="50" aria-label="Comparar ${esc(it.title)}" /> </div> <h3>${it.title}</h3> <p>${it.desc}</p> <span class="zone"> ${it.zone}</span> </article>`; const tabs = (list) => { const present = new Set(list.map((i) => i.cat)); return `<div class="tabs" role="tablist" aria-label="Filtrar por tipo de estancia">${CATS.filter(([k]) => k === "todos" || present.has(k)) .map(([k, l], n) => `<button type="button" role="tab" class="tab${n === 0 ? " on" : ""}" data-filter="${k}" aria-selected="${n === 0}">${l}</button>`) .join("")}</div>`;
}; const homeSlugs = ["salon-chimenea", "bano-zaragoza", "cocina-isla", "buhardilla-dormitorio", "casa-piscina", "salon-granito", "bano-banera", "dormitorio-moderno", "vista-aerea"];
const home = homeSlugs.map((s) => data.items.find((i) => i.slug === s)).filter(Boolean); const gallery = (list) => `<div data-gallery> ${tabs(list)} <div class="ba-grid ba-grid-3">${list.map((it, n) => item(it, n < 2)).join("")} </div> </div>
`;
writeFileSync(resolve(out, "gallery-home.html"), gallery(home));
writeFileSync(resolve(out, "gallery-full.html"), gallery(data.items));
const pir = data.items.filter((i) => i.zone === "Pirineo aragonés");
writeFileSync(resolve(out, "gallery-pirineo.html"), gallery(pir)); // Estilos: mismo salón, varios resultados
writeFileSync( resolve(out, "styles.html"), `<div class="style-box" data-styles> <div class="style-stage"> <img class="on" data-style="antes" src="/media/real/estilo-antes.webp" alt="Salón sin reformar, punto de partida" width="1200" height="800" loading="lazy" />
${data.styles.map((s) => ` <img data-style="${s.slug}" src="/media/real/${s.slug}.webp" alt="El mismo salón reformado en estilo ${esc(s.name.toLowerCase())}" width="1200" height="800" loading="lazy" />`).join("\n")} <span class="style-badge" data-style-label>Punto de partida</span> </div> <div class="style-tabs" role="tablist" aria-label="Elegir estilo"> <button type="button" class="tab on" data-style-btn="antes">Original</button>
${data.styles.map((s) => ` <button type="button" class="tab" data-style-btn="${s.slug}" data-label="${esc(s.name)}">${s.name}</button>`).join("\n")} </div> </div>
`
); // Vídeos reales
writeFileSync( resolve(out, "videos.html"), `<div class="video-box" data-videos> <div class="video-frame"> <video muted playsinline loop preload="none" poster="/media/real/${data.videos[0].slug}-poster.webp" data-src="/media/real/${data.videos[0].slug}.mp4" aria-label="Vídeo real antes y después de una reforma generado por el chatbot"></video> <span class="lbl-v">Vídeo real generado por el chatbot</span> </div> <div class="style-tabs" role="tablist" aria-label="Elegir vídeo">
${data.videos.map((v, n) => ` <button type="button" class="tab${n === 0 ? " on" : ""}" data-video-btn="${v.slug}">${v.name}</button>`).join("\n")} </div> </div>
`
);
console.log("partials ok:", data.items.length, "items,", pir.length, "pirineo");
