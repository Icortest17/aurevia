import { defineConfig } from "vite";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { execFileSync } from "node:child_process";

// Páginas estáticas (cada una es un HTML real, indexable sin JavaScript).
const pages = [
  "index.html",
  "ejemplos-reformas-ia-antes-despues/index.html",
  "reformas-con-ia-inmobiliarias-zaragoza/index.html",
  "home-staging-virtual-zaragoza/index.html",
  "chatbot-whatsapp-inmobiliarias-zaragoza/index.html",
  "captacion-propietarios-inmobiliarias-zaragoza/index.html",
  "reformas-con-ia-reformistas-constructoras-zaragoza/index.html",
  "reformas-con-ia-pirineo-aragones/index.html",
  "aviso-legal/index.html",
  "privacidad/index.html",
  "cookies/index.html",
  "404.html"
];

// Regenera las galerías (partials) desde src/real.json antes de cada arranque/build.
function genPartials() {
  execFileSync(process.execPath, [resolve(import.meta.dirname, "scripts/gen-partials.mjs")], { stdio: "inherit" });
}

// Sustituye <!--@include nombre--> por partials/nombre.html y activa analítica solo en producción.
function includes() {
  return {
    name: "html-includes",
    buildStart: genPartials,
    configureServer: genPartials,
    transformIndexHtml: {
      order: "pre",
      handler(html) {
        // Dos pasadas (un partial puede incluir a otro).
        const inc = (s) => s.replace(/<!--@include ([\w-]+)-->/g, (_, name) => readFileSync(resolve(import.meta.dirname, "partials", `${name}.html`), "utf8"));
        return inc(inc(html));
      }
    }
  };
}

// Analítica sin cookies (Vercel Analytics): solo en producción y después del empaquetado.
function analytics() {
  return {
    name: "analytics",
    transformIndexHtml: {
      order: "post",
      handler(html, ctx) {
        const tag = ctx.server ? "" : '<script>window.va=window.va||function(){(window.vaq=window.vaq||[]).push(arguments)}</script><script defer src="/_vercel/insights/script.js"></script>';
        return html.replace(/<!--@analytics-->/g, tag);
      }
    }
  };
}

export default defineConfig({
  plugins: [includes(), analytics()],
  server: { watch: { ignored: ["**/_work/**", "**/dist/**"] } },
  build: {
    rollupOptions: {
      input: Object.fromEntries(pages.map((p) => [p.replace(/\/?index\.html$/, "").replace(/\.html$/, "") || "index", resolve(import.meta.dirname, p)]))
    }
  }
});
