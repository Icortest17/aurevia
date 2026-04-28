import React, { useEffect, useRef, useState } from "react";
import { createRoot } from "react-dom/client";
import { motion, useScroll, useTransform } from "framer-motion";
import * as THREE from "three";
import {
  ArrowRight,
  BadgeCheck,
  Building2,
  Camera,
  Check,
  ChevronRight,
  Clapperboard,
  Home,
  ImageUp,
  Menu,
  MessageCircle,
  Play,
  Send,
  Sparkles,
  Star,
  Target,
  UploadCloud,
  Wand2,
  X,
  Zap
} from "lucide-react";
import "./styles.css";

const navItems = [
  ["Cómo funciona", "#como-funciona"],
  ["Ejemplos", "#ejemplos"],
  ["Beneficios", "#beneficios"],
  ["Confianza", "#confianza"],
  ["Contacto", "#contacto"]
];

const styles = ["Moderno cálido", "Lujo sereno", "Mediterráneo", "Nórdico", "Industrial suave"];

const whatsappDemoHref =
  "https://wa.me/34654152831?text=Hola%2C%20quiero%20solicitar%20una%20demo%20del%20chatbot%20Aurevia%20AI%20para%20mi%20equipo%20inmobiliario.";
const whatsappExampleHref =
  "https://wa.me/34654152831?text=Hola%2C%20quiero%20ver%20un%20ejemplo%20de%20Aurevia%20AI%20por%20WhatsApp.";

const examples = [
  {
    title: "Salón antiguo",
    result: "Salón moderno cálido",
    style: "Moderno cálido",
    scene: "living",
    beforeSrc: "/media/ejemplos/salon-antes.webp",
    afterSrc: "/media/ejemplos/salon-despues.webp",
    value: "Convierte una estancia difícil en una imagen aspiracional para captar visitas."
  },
  {
    title: "Cocina básica",
    result: "Cocina premium",
    style: "Lujo funcional",
    scene: "kitchen",
    beforeSrc: "/media/ejemplos/cocina-antes.webp",
    afterSrc: "/media/ejemplos/cocina-despues.webp",
    value: "Muestra una reforma con materiales claros, orden visual y mayor valor percibido."
  },
  {
    title: "Dormitorio vacío",
    result: "Dormitorio decorado",
    style: "Nórdico",
    scene: "bedroom",
    beforeSrc: "/media/ejemplos/dormitorio-antes.webp",
    afterSrc: "/media/ejemplos/dormitorio-despues.webp",
    value: "Ayuda al comprador a imaginar uso, escala y calidez desde el primer anuncio."
  },
  {
    title: "Terraza descuidada",
    result: "Terraza mediterránea",
    style: "Mediterráneo",
    scene: "terrace",
    beforeSrc: "/media/ejemplos/terraza-antes.webp",
    afterSrc: "/media/ejemplos/terraza-despues.webp",
    value: "Transforma metros exteriores en un argumento visual de deseo y estilo de vida."
  }
];

function useMouseParallax(strength = 14) {
  const ref = useRef(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const onMouseMove = (event) => {
    const rect = ref.current?.getBoundingClientRect();
    if (!rect) return;
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * strength;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * strength;
    setOffset({ x, y });
  };

  return { ref, offset, onMouseMove, onMouseLeave: () => setOffset({ x: 0, y: 0 }) };
}

const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show: { opacity: 1, y: 0, transition: { duration: 0.72, ease: [0.22, 1, 0.36, 1] } }
};

const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.11 } }
};

function Button({ children, variant = "primary", href = "#contacto", icon = true }) {
  const classes =
    variant === "primary"
      ? "premium-button-primary bg-[#1F3D3A] shadow-[0_18px_40px_rgba(31,61,58,0.22)] hover:bg-[#17312e]"
      : "premium-button-secondary bg-white/82 ring-1 ring-black/10 hover:bg-white shadow-[0_14px_34px_rgba(23,23,23,0.08)]";

  return (
    <motion.a
      whileHover={{ y: -2, scale: 1.01 }}
      whileTap={{ scale: 0.98 }}
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full px-5 text-sm font-semibold transition ${classes}`}
    >
      {children}
      {icon && <ArrowRight className="h-4 w-4" aria-hidden="true" />}
    </motion.a>
  );
}

function Header() {
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const bg = useTransform(scrollY, [0, 80], ["rgba(250,247,242,0.62)", "rgba(255,255,255,0.92)"]);
  const shadow = useTransform(scrollY, [0, 80], ["0 0 0 rgba(0,0,0,0)", "0 16px 40px rgba(23,23,23,0.08)"]);

  return (
    <motion.header style={{ backgroundColor: bg, boxShadow: shadow }} className="fixed inset-x-0 top-0 z-50 border-b border-black/5 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-5 sm:px-8">
        <a href="#inicio" className="flex items-center gap-3" aria-label="Aurevia AI inicio">
          <span className="grid h-10 w-10 place-items-center rounded-2xl bg-[#1F3D3A] text-white shadow-lg shadow-[#1F3D3A]/20">
            <img src="/brand/favicon.svg" alt="" className="h-6 w-6" aria-hidden="true" />
          </span>
          <span className="text-base font-semibold tracking-tight text-[#171717]">Aurevia AI</span>
        </a>
        <nav className="hidden items-center gap-7 lg:flex" aria-label="Navegación principal">
          {navItems.map(([label, href]) => (
            <a key={label} href={href} className="text-sm font-medium text-[#6B6B6B] transition hover:text-[#171717]">
              {label}
            </a>
          ))}
        </nav>
        <div className="hidden lg:block">
          <Button href={whatsappDemoHref}>Solicitar demo del chatbot</Button>
        </div>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="grid h-11 w-11 place-items-center rounded-full bg-white text-[#171717] shadow-sm ring-1 ring-black/10 lg:hidden"
          aria-label="Abrir menú"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mx-5 mb-4 rounded-[28px] bg-white p-4 shadow-2xl ring-1 ring-black/8 lg:hidden">
          {navItems.map(([label, href]) => (
            <a key={label} href={href} onClick={() => setOpen(false)} className="block rounded-2xl px-4 py-3 text-sm font-medium text-[#171717]">
              {label}
            </a>
          ))}
          <div className="px-2 pt-2">
            <Button href={whatsappDemoHref}>Solicitar demo del chatbot</Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}

function InteriorPlaceholder({ variant = "before", scene = "living", className = "" }) {
  const after = variant === "after";
  return (
    <div className={`interior-scene ${scene} ${after ? "after" : "before"} ${className}`} role="img" aria-label={after ? "Interior reformado generado por IA" : "Interior original antes de reformar"}>
      {/* Sustituir por imagen real cuando esté disponible:
          <img src="/imagenes/ejemplo.jpg" alt="Salón reformado con IA" className="h-full w-full object-cover" />
      */}
      <span className="scene-wall" />
      <span className="scene-floor" />
      <span className="scene-window" />
      <span className="scene-art" />
      <span className="scene-sofa" />
      <span className="scene-table" />
      <span className="scene-plant" />
      <span className="scene-light" />
    </div>
  );
}

function ExampleImage({ src, alt, variant, scene }) {
  if (src) {
    return (
      <img
        src={src}
        alt={alt}
        className="h-64 w-full rounded-[26px] object-cover"
        loading="lazy"
      />
    );
  }

  return <InteriorPlaceholder variant={variant} scene={scene} className="h-64" />;
}

function ArchitecturalHouse3D({ compact = false, focus = false }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new THREE.Scene();
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 100);
    camera.position.set(focus ? 7.4 : 6.1, focus ? 4.7 : 4.0, focus ? 8.2 : 7.0);
    camera.lookAt(0, 1, 0);

    const group = new THREE.Group();
    group.rotation.y = -0.55;
    group.scale.setScalar(focus ? 0.9 : compact ? 0.86 : 1);
    scene.add(group);

    const white = new THREE.MeshStandardMaterial({ color: "#d6d2c9", roughness: 0.56, metalness: 0.05 });
    const warmWhite = new THREE.MeshStandardMaterial({ color: "#eee5d6", roughness: 0.52, metalness: 0.04 });
    const graphite = new THREE.MeshStandardMaterial({ color: "#3f423d", roughness: 0.62, metalness: 0.1 });
    const dark = new THREE.MeshStandardMaterial({ color: "#171717", roughness: 0.5, metalness: 0.12 });
    const wood = new THREE.MeshStandardMaterial({ color: "#b58b62", roughness: 0.48, metalness: 0.03 });
    const plinth = new THREE.MeshStandardMaterial({ color: "#e8ddcb", roughness: 0.62, metalness: 0.02 });
    const glass = new THREE.MeshPhysicalMaterial({
      color: "#83918d",
      roughness: 0.08,
      metalness: 0,
      transmission: 0.35,
      transparent: true,
      opacity: 0.58,
      thickness: 0.22
    });
    const rail = new THREE.MeshPhysicalMaterial({
      color: "#ffffff",
      roughness: 0.12,
      transparent: true,
      opacity: 0.48,
      transmission: 0.25
    });

    const box = (name, size, position, material, cast = true, receive = true) => {
      const mesh = new THREE.Mesh(new THREE.BoxGeometry(...size), material);
      mesh.name = name;
      mesh.position.set(...position);
      mesh.castShadow = cast;
      mesh.receiveShadow = receive;
      group.add(mesh);
      return mesh;
    };

    const pedestal = new THREE.Mesh(new THREE.CylinderGeometry(3.35, 3.55, 0.16, 96), plinth);
    pedestal.name = "stone plinth";
    pedestal.position.set(0.15, -0.16, 0.1);
    pedestal.scale.set(1.18, 1, 0.72);
    pedestal.castShadow = false;
    pedestal.receiveShadow = true;
    group.add(pedestal);

    box("left lower volume", [2.6, 1.65, 2.9], [-2.15, 0.78, 0.15], white);
    box("central lower volume", [2.55, 1.7, 2.8], [0.45, 0.82, 0.08], graphite);
    box("garage volume", [2.4, 1.45, 2.45], [2.75, 0.66, 0.25], white);
    box("left frame top", [2.95, 0.34, 3.05], [-2.18, 1.86, 0.08], white);
    box("left frame side", [0.34, 2.5, 3.05], [-3.48, 1.07, 0.08], white);
    box("upper tower", [1.65, 1.78, 1.9], [0.72, 2.5, -0.45], white);
    box("upper right mass", [2.05, 2.25, 2.35], [2.0, 2.0, -0.35], white);
    box("upper roof cap", [2.85, 0.34, 2.35], [0.65, 3.48, -0.52], white);
    box("balcony slab", [3.15, 0.22, 1.55], [0.98, 1.78, 1.35], warmWhite);
    box("balcony dark trim", [3.3, 0.12, 0.18], [0.98, 1.62, 2.14], dark);
    box("entry stone step", [2.1, 0.12, 0.58], [0.4, 0.02, 1.82], plinth, false, true);

    box("garage door", [1.65, 0.9, 0.08], [2.78, 0.58, 1.5], dark);
    for (let i = 0; i < 5; i += 1) {
      box(`garage line ${i}`, [1.58, 0.018, 0.09], [2.78, 0.27 + i * 0.16, 1.55], graphite, false, false);
    }

    const windowSpecs = [
      [[0.66, 1.18, 0.08], [-2.86, 0.78, 1.62]],
      [[0.66, 1.18, 0.08], [-2.08, 0.78, 1.62]],
      [[0.68, 1.18, 0.08], [-1.28, 0.78, 1.62]],
      [[0.68, 1.2, 0.08], [-0.25, 0.78, 1.55]],
      [[0.68, 1.2, 0.08], [0.55, 0.78, 1.55]],
      [[0.68, 1.2, 0.08], [1.35, 0.78, 1.55]],
      [[0.76, 1.1, 0.08], [0.75, 2.35, 0.62]],
      [[0.78, 1.12, 0.08], [1.78, 2.28, 0.78]]
    ];
    windowSpecs.forEach(([size, position], index) => box(`glass ${index}`, size, position, glass, false, false));

    box("wood entry", [0.42, 1.08, 0.1], [0.0, 1.0, 1.62], wood);
    box("balcony rail front", [3.28, 0.62, 0.06], [0.98, 2.16, 2.12], rail, false, false);
    box("balcony rail left", [0.06, 0.62, 1.34], [-0.64, 2.16, 1.45], rail, false, false);
    box("balcony rail right", [0.06, 0.62, 1.34], [2.6, 2.16, 1.45], rail, false, false);

    for (let i = 0; i < 7; i += 1) {
      box(`panel front ${i}`, [0.015, 1.1, 0.05], [-3.15 + i * 0.86, 1.32, 1.64], graphite, false, false);
    }
    for (let i = 0; i < 4; i += 1) {
      box(`facade groove ${i}`, [0.02, 0.018, 2.1], [2.02, 0.68 + i * 0.42, -1.52], graphite, false, false);
    }

    const planter = box("planter", [0.28, 0.22, 0.28], [-2.82, 1.72, 0.95], dark);
    planter.castShadow = true;
    const tree = new THREE.Mesh(new THREE.SphereGeometry(0.28, 24, 16), new THREE.MeshStandardMaterial({ color: "#1f3d3a", roughness: 0.7 }));
    tree.position.set(-2.82, 2.1, 0.95);
    tree.scale.set(0.85, 1.15, 0.85);
    tree.castShadow = true;
    group.add(tree);

    const ambient = new THREE.HemisphereLight("#ffffff", "#b9aa96", 2.0);
    scene.add(ambient);
    const key = new THREE.DirectionalLight("#ffffff", 4.2);
    key.position.set(4, 7, 5);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    scene.add(key);
    const fill = new THREE.DirectionalLight("#c8a96a", 1.25);
    fill.position.set(-5, 3, -4);
    scene.add(fill);

    const ground = new THREE.Mesh(
      new THREE.CircleGeometry(4.8, 72),
      new THREE.ShadowMaterial({ opacity: 0.18 })
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = -0.2;
    ground.receiveShadow = true;
    scene.add(ground);

    const resize = () => {
      const rect = canvas.parentElement.getBoundingClientRect();
      renderer.setSize(rect.width, rect.height, false);
      camera.aspect = rect.width / rect.height;
      camera.updateProjectionMatrix();
    };

    let frame = 0;
    const clock = new THREE.Clock();
    const animate = () => {
      const elapsed = clock.getElapsedTime();
      group.rotation.y += compact ? 0.0026 : 0.002;
      group.position.y = Math.sin(elapsed * 0.7) * 0.045;
      renderer.render(scene, camera);
      frame = requestAnimationFrame(animate);
    };

    resize();
    animate();
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("resize", resize);
      renderer.dispose();
      scene.traverse((object) => {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) object.material.forEach((material) => material.dispose());
          else object.material.dispose();
        }
      });
    };
  }, [compact, focus]);

  return (
    <div className={`villa-scene ${compact ? "compact" : ""} ${focus ? "focus" : ""}`} aria-label="Maqueta 3D de vivienda moderna girando">
      <canvas ref={canvasRef} className="villa-canvas" />
      <img src="/media/3d/residential-building.webp" alt="" className="villa-fallback" aria-hidden="true" />
      <motion.div className="villa-light" animate={{ opacity: [0.45, 0.72, 0.45] }} transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }} />
      <div className="villa-image-shadow" />
    </div>
  );
}

function ChatMessage({ children, side = "bot", delay = 0, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      className={`${side === "user" ? "ml-auto bg-[#1F3D3A] text-white" : "mr-auto bg-white text-[#171717] ring-1 ring-black/8"} max-w-[86%] rounded-[26px] p-4 shadow-[0_14px_40px_rgba(23,23,23,0.08)] ${className}`}
    >
      {children}
    </motion.div>
  );
}

function ChatMockup({ hero = false }) {
  return (
    <div className={`rounded-[38px] bg-white/92 shadow-[0_30px_100px_rgba(23,23,23,0.16)] ring-1 ring-black/8 backdrop-blur ${hero ? "max-w-[500px] p-3" : "p-4"}`}>
      <div className={`flex items-center justify-between border-b border-black/6 px-2 ${hero ? "pb-3" : "pb-4"}`}>
        <div className="flex items-center gap-3">
          <div className={`${hero ? "h-10 w-10" : "h-11 w-11"} grid place-items-center rounded-2xl bg-[#1F3D3A] text-white`}>
            <MessageCircle className={hero ? "h-[18px] w-[18px]" : "h-5 w-5"} />
          </div>
          <div>
            <p className="font-semibold text-[#171717]">Bot Aurevia</p>
            <p className="text-sm text-[#6B6B6B]">WhatsApp · Telegram</p>
          </div>
        </div>
        <span className="rounded-full bg-[#E8F3EF] px-3 py-1 text-xs font-semibold text-[#1F3D3A]">Activo</span>
      </div>
      <div className={`${hero ? "space-y-3 p-2 pt-4 sm:p-3" : "space-y-4 p-1 pt-5 sm:p-4"}`}>
        <ChatMessage side="bot" delay={0.1} className={hero ? "p-3 text-sm leading-6" : ""}>
          Envíame una foto del inmueble y dime cómo quieres reformarlo.
        </ChatMessage>
        <ChatMessage side="user" delay={0.32} className="p-3">
          <div className="mb-2 flex items-center gap-2 text-sm font-semibold">
            <UploadCloud className="h-4 w-4" />
            Salón_actual.jpg
          </div>
          <img
            src="/media/chatbot/chat-foto-enviada.webp"
            alt="Salón original enviado al chatbot"
            className={`${hero ? "h-28" : "h-36"} w-full rounded-[20px] object-cover`}
            loading={hero ? "eager" : "lazy"}
          />
        </ChatMessage>
        <ChatMessage side="user" delay={0.52} className={hero ? "p-3 text-sm leading-6" : ""}>
          Quiero reformarlo en estilo moderno cálido para vender mejor.
        </ChatMessage>
        <ChatMessage side="bot" delay={0.72} className="p-3">
          <p className="mb-3 text-sm font-semibold text-[#171717]">Propuesta generada para anuncio</p>
          <img
            src="/media/chatbot/chat-reforma-generada.webp"
            alt="Salón reformado generado por el chatbot"
            className={`${hero ? "h-[7.5rem]" : "h-44"} w-full rounded-[22px] object-cover`}
            loading={hero ? "eager" : "lazy"}
          />
          <div className={`shimmer-pill mt-3 flex items-center gap-2 rounded-full bg-[#FAF7F2] px-4 ${hero ? "py-2.5 text-xs" : "py-3 text-sm"} font-semibold text-[#1F3D3A]`}>
            <span className="typing-dots"><i /><i /><i /></span>
            Generando vídeo antes/después...
          </div>
        </ChatMessage>
      </div>
    </div>
  );
}

function HeroVisual() {
  const { ref, offset, onMouseMove, onMouseLeave } = useMouseParallax(18);
  return (
    <motion.div ref={ref} onMouseMove={onMouseMove} onMouseLeave={onMouseLeave} variants={fadeUp} className="relative min-h-[590px] lg:min-h-[640px]">
      <div className="absolute inset-y-3 left-[9%] right-[4%] rounded-[52px] bg-[linear-gradient(145deg,rgba(246,239,231,0.82),rgba(255,255,255,0.42))] shadow-[0_36px_120px_rgba(23,23,23,0.08)] ring-1 ring-black/5" />
      <div className="absolute right-[10%] top-[11%] hidden rounded-full bg-white/86 px-4 py-2 text-sm font-semibold text-[#1F3D3A] shadow-lg ring-1 ring-black/8 backdrop-blur sm:block">
        WhatsApp · Telegram
      </div>
      <motion.div style={{ x: offset.x * -0.18, y: offset.y * -0.18 }} className="absolute left-1/2 top-4 z-20 w-[88%] max-w-[540px] -translate-x-1/2">
        <div className="rounded-[44px] bg-white/50 p-3 shadow-[0_34px_110px_rgba(23,23,23,0.10)] ring-1 ring-white/70 backdrop-blur">
          <ChatMockup hero />
        </div>
      </motion.div>
    </motion.div>
  );
}

function Hero() {
  return (
    <section id="inicio" className="relative overflow-hidden bg-[linear-gradient(135deg,#FAF7F2_0%,#FFFFFF_58%,#F6EFE7_100%)] pt-32">
      <div className="absolute inset-x-0 top-0 h-40 bg-white/40" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 pb-20 sm:px-8 lg:grid-cols-[0.92fr_1.08fr] lg:pb-28">
        <motion.div variants={stagger} initial="hidden" animate="show" className="relative z-10">
          <motion.div variants={fadeUp} className="mb-6 inline-flex items-center gap-2 rounded-full bg-white/74 px-4 py-2 text-sm font-semibold text-[#1F3D3A] shadow-sm ring-1 ring-black/8">
            <Sparkles className="h-4 w-4 text-[#C8A96A]" />
            Chatbot visual para WhatsApp y Telegram
          </motion.div>
          <motion.h1 variants={fadeUp} className="max-w-4xl text-5xl font-semibold leading-[0.98] tracking-tight text-[#171717] sm:text-6xl lg:text-7xl">
            Reformas visuales hiperrealistas desde WhatsApp o Telegram
          </motion.h1>
          <motion.p variants={fadeUp} className="mt-6 max-w-2xl text-lg leading-8 text-[#5f5f5f]">
            Envía una foto de cualquier inmueble a nuestro chatbot, elige el estilo de reforma y recibe imágenes y vídeos antes/después listos para vender mejor.
          </motion.p>
          <motion.p variants={fadeUp} className="mt-4 max-w-xl text-sm font-semibold text-[#1F3D3A]">
            Usado por equipos comerciales para captar propietarios, explicar potencial y acelerar decisiones sin salir del chat.
          </motion.p>
          <motion.div variants={fadeUp} className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Button href={whatsappDemoHref}>Solicitar demo del chatbot</Button>
            <Button href={whatsappExampleHref} variant="secondary">
              Ver ejemplo en WhatsApp
            </Button>
          </motion.div>
          <motion.div variants={fadeUp} className="mt-9 flex flex-wrap gap-5 text-sm text-[#6B6B6B]">
            {["Envía una foto", "Recibe una transformación", "Publica en portales y redes"].map((item) => (
              <span key={item} className="inline-flex items-center gap-2">
                <Check className="h-4 w-4 text-[#C8A96A]" />
                {item}
              </span>
            ))}
          </motion.div>
        </motion.div>
        <HeroVisual />
      </div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, text, center = true }) {
  return (
    <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.3 }} className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="mb-3 text-sm font-semibold uppercase tracking-[0.22em] text-[#C8A96A]">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-[#171717] sm:text-5xl">{title}</h2>
      {text && <p className="mt-5 text-lg leading-8 text-[#6B6B6B]">{text}</p>}
    </motion.div>
  );
}

function HowItWorks() {
  const steps = [
    [MessageCircle, "Abre el bot", "Tu equipo entra desde WhatsApp o Telegram, sin instalar ni aprender una plataforma nueva."],
    [ImageUp, "Envía una foto", "Carga una imagen real del inmueble, aunque esté vacío, antiguo o pendiente de reforma."],
    [Wand2, "Escribe el estilo", "Pide moderno cálido, lujo, nórdico, mediterráneo, industrial o la dirección visual que necesites."],
    [Clapperboard, "Recibe visuales", "Obtén imagen reformada y vídeo antes/después listos para anuncios, portales y redes."]
  ];

  return (
    <section id="como-funciona" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Cómo funciona" title="De chat cotidiano a contenido inmobiliario de alto impacto" text="Funciona desde el chat que tu equipo ya usa. Un flujo directo, rápido y comercial." />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {steps.map(([Icon, title, text], index) => (
            <motion.article key={title} variants={fadeUp} className="group rounded-[32px] border border-black/8 bg-[#FAF7F2] p-7 shadow-[0_18px_60px_rgba(23,23,23,0.06)] transition hover:-translate-y-1 hover:bg-white hover:shadow-[0_24px_70px_rgba(23,23,23,0.11)]">
              <div className="flex items-start justify-between">
                <div className="grid h-13 w-13 place-items-center rounded-2xl bg-white text-[#1F3D3A] shadow-sm ring-1 ring-black/5">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-5xl font-semibold text-[#D9C3A5]/70">0{index + 1}</span>
              </div>
              <h3 className="mt-8 text-xl font-semibold text-[#171717]">{title}</h3>
              <p className="mt-3 leading-7 text-[#6B6B6B]">{text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function TrustBadges() {
  const badges = ["Imágenes realistas", "Sin renders manuales", "Listo para anuncios", "Pensado para inmobiliarias"];
  return (
    <section className="bg-white py-10">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 px-5 sm:px-8">
        {badges.map((badge) => (
          <motion.span
            key={badge}
            variants={fadeUp}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.6 }}
            className="inline-flex items-center gap-2 rounded-full bg-[#FAF7F2] px-4 py-2 text-sm font-semibold text-[#1F3D3A] ring-1 ring-black/8"
          >
            <Check className="h-4 w-4 text-[#C8A96A]" />
            {badge}
          </motion.span>
        ))}
      </div>
    </section>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
      <path d="M12.04 2.1A9.86 9.86 0 0 0 3.53 16.9L2.3 21.4l4.6-1.2a9.85 9.85 0 0 0 5.14 1.43h.01A9.78 9.78 0 0 0 22 11.9a9.85 9.85 0 0 0-9.96-9.8Zm.01 17.86h-.01a8.2 8.2 0 0 1-4.18-1.14l-.3-.18-2.72.72.73-2.65-.2-.31a8.15 8.15 0 1 1 6.68 3.56Zm4.47-6.1c-.25-.12-1.45-.72-1.68-.8-.23-.08-.4-.12-.56.12-.17.25-.65.8-.8.97-.15.16-.3.18-.55.06-.25-.12-1.04-.38-1.98-1.22-.73-.65-1.22-1.45-1.36-1.7-.14-.25-.02-.38.1-.5.11-.1.25-.3.37-.44.12-.15.16-.25.25-.42.08-.16.04-.31-.02-.43-.06-.12-.56-1.36-.77-1.86-.2-.49-.4-.42-.56-.43h-.48c-.17 0-.43.06-.65.31-.23.25-.86.84-.86 2.05 0 1.2.88 2.37 1 2.53.12.17 1.73 2.64 4.2 3.7.59.25 1.05.4 1.4.52.59.19 1.13.16 1.55.1.47-.07 1.45-.59 1.66-1.16.2-.57.2-1.06.14-1.16-.06-.1-.22-.16-.47-.28Z" />
    </svg>
  );
}

function TelegramIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden="true" fill="currentColor">
      <path d="M21.86 4.48c.18-1.16-.92-2.08-1.96-1.63L2.93 10.18c-1.18.5-1.16 2.16.03 2.63l4.33 1.7 1.68 5.28c.37 1.16 1.84 1.5 2.68.62l2.42-2.55 4.39 3.24c1.02.75 2.48.18 2.69-1.07l2.71-15.55ZM8.1 13.34l8.44-5.2c.4-.25.82.3.48.62l-6.96 6.48-.27 3.03-1.13-3.57-.56-1.36Zm2.66 4.82.2-2.22 1.74 1.28-1.94.94Z" />
    </svg>
  );
}

function IntegrationSection() {
  const items = [
    ["WhatsApp", "El canal que tu equipo comercial ya abre cada día.", WhatsAppIcon, "bg-[#25D366]"],
    ["Telegram", "Flujo rápido para equipos que necesitan compartir, probar y publicar.", TelegramIcon, "bg-[#229ED9]"],
    ["Sin plataforma nueva", "No hay curva de aprendizaje: foto, estilo y resultado en el chat.", BadgeCheck, "bg-[#1F3D3A]"]
  ];

  return (
    <section className="bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF7F2_100%)] py-20">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <SectionHeading
          eyebrow="Integración directa"
          title="Sin plataforma nueva. Sin onboarding complejo. Directo al chat."
          text="Aurevia AI vive en WhatsApp y Telegram para que los agentes puedan transformar imágenes mientras trabajan con propietarios, compradores y campañas."
          center={false}
        />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-4 sm:grid-cols-3">
          {items.map(([title, text, Icon, iconClass]) => (
            <motion.article key={title} variants={fadeUp} className="rounded-[30px] bg-white p-6 shadow-[0_18px_60px_rgba(23,23,23,0.07)] ring-1 ring-black/8">
              <div className={`mb-5 grid h-11 w-11 place-items-center rounded-2xl text-white shadow-lg ${iconClass}`}>
                <Icon />
              </div>
              <h3 className="font-semibold text-[#171717]">{title}</h3>
              <p className="mt-2 text-sm leading-6 text-[#6B6B6B]">{text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function ChatbotDemo() {
  return (
    <section id="demo-chatbot" className="bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF7F2_100%)] py-24">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.85fr_1.15fr]">
        <SectionHeading eyebrow="Demo del chatbot" title="Una conversación simple que genera material listo para vender" text="El agente solo envía una foto y una instrucción. El bot devuelve imagen reformada, vídeo antes/después y material visual preparado para campañas." center={false} />
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
          <ChatMockup />
        </motion.div>
      </div>
    </section>
  );
}

function TransformationExamples() {
  return (
    <section id="ejemplos" className="bg-white py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Ejemplos de transformación" title="De inmueble difícil de vender a anuncio visualmente irresistible" text="Antes/después diseñados para captar atención, explicar potencial y mejorar la conversación con compradores y propietarios." />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.12 }} className="mt-14 grid gap-6 lg:grid-cols-2">
          {examples.map((example) => (
            <motion.article key={example.title} variants={fadeUp} whileHover={{ y: -6 }} className="overflow-hidden rounded-[34px] bg-[#FAF7F2] p-4 shadow-[0_24px_80px_rgba(23,23,23,0.09)] ring-1 ring-black/8">
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="relative overflow-hidden rounded-[26px]">
                  <ExampleImage src={example.beforeSrc} alt={`${example.title} antes`} variant="before" scene={example.scene} />
                  <span className="absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1 text-xs font-semibold text-[#171717] shadow">Antes</span>
                </div>
                <div className="relative overflow-hidden rounded-[26px]">
                  <ExampleImage src={example.afterSrc} alt={`${example.result} después`} variant="after" scene={example.scene} />
                  <span className="absolute right-4 top-4 rounded-full bg-[#1F3D3A] px-3 py-1 text-xs font-semibold text-white shadow">Después</span>
                </div>
              </div>
              <div className="p-3 pt-5">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <h3 className="text-xl font-semibold text-[#171717]">{example.title} → {example.result}</h3>
                  <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1F3D3A] ring-1 ring-black/8">{example.style}</span>
                </div>
                <p className="mt-3 leading-7 text-[#6B6B6B]">{example.value}</p>
              </div>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function VideoTransformationSection() {
  return (
    <section className="bg-[linear-gradient(180deg,#FFFFFF_0%,#FAF7F2_100%)] py-24 sm:py-28">
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.78fr_1.22fr]">
        <SectionHeading
          eyebrow="Vídeo antes/después"
          title="Un ejemplo de transformación listo para anuncios y redes"
          text="Aquí puedes insertar el vídeo generado por el chatbot: primero la foto original, después la reforma visual y una transición suave para usar en portales, reels o campañas."
          center={false}
        />
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }} className="rounded-[38px] bg-white p-4 shadow-[0_30px_100px_rgba(23,23,23,0.12)] ring-1 ring-black/8">
          <div className="rounded-[32px] bg-[#1F3D3A] p-3 shadow-[inset_0_1px_0_rgba(255,255,255,0.16)]">
            <div className="mb-3 flex items-center justify-between px-2 text-white">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#E6D2B1]">Formato social</p>
                <p className="text-sm font-semibold">Ideal para reels, stories y portales</p>
              </div>
              <span className="rounded-full bg-white/12 px-3 py-1 text-xs font-semibold">00:18</span>
            </div>
            <div className="relative overflow-hidden rounded-[24px] bg-[#171717]">
            {/* Sube el vídeo a: public/media/video-transformacion/antes-despues.mp4
                Si quieres un poster específico, puedes añadirlo y cambiar la ruta de poster. */}
              <video
                className="aspect-video w-full bg-[#171717] object-cover"
                controls
                preload="metadata"
                poster="/media/ejemplos/premium-video-antes-despues.webp"
              >
                <source src="/media/video-transformacion/antes-despues-optimized.mp4" type="video/mp4" />
              </video>
              <div className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/88 px-3 py-1 text-xs font-semibold text-[#171717] shadow">
                Demo vídeo
              </div>
            </div>
          </div>
          <div className="grid gap-4 p-2 pt-5 sm:grid-cols-3 sm:p-5">
            {[
              ["01", "Foto original", "/media/ejemplos/salon-antes.webp"],
              ["02", "Reforma generada", "/media/ejemplos/salon-despues.webp"],
              ["03", "Vídeo final", "/media/video-transformacion/antes-despues-optimized.mp4"]
            ].map(([step, title, path]) => (
              <div key={title} className="rounded-[24px] bg-[#FAF7F2] p-4 ring-1 ring-black/8">
                <p className="text-xs font-semibold text-[#C8A96A]">{step}</p>
                <p className="mt-2 font-semibold text-[#171717]">{title}</p>
                <p className="mt-1 break-words text-xs leading-5 text-[#6B6B6B]">{path}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

function BenefitsGrid() {
  const benefits = [
    [Target, "Más leads cualificados", "Visuales que hacen que compradores y propietarios se detengan antes de seguir haciendo scroll."],
    [BadgeCheck, "Sin aprender nuevas herramientas", "Tu equipo comercial puede usarlo directamente desde WhatsApp o Telegram."],
    [Zap, "Más velocidad comercial", "Envía una foto. Recibe una transformación. Publica sin esperar renders complejos."],
    [Camera, "Contenido listo para campañas", "Genera material visual para portales, redes y captación de propietarios."],
    [Building2, "Mejor captación de propietarios", "Muestra el potencial de sus inmuebles con una propuesta visual clara y premium."],
    [Home, "Ideal para activos difíciles", "Viviendas vacías, antiguas o con mucho potencial que hoy cuesta explicar."]
  ];

  return (
    <section id="beneficios" className="bg-[linear-gradient(180deg,#FAF7F2_0%,#FFFFFF_100%)] py-24 sm:py-28">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <SectionHeading eyebrow="Beneficios" title="Marketing inmobiliario desde el chat que tu equipo ya usa" text="Menos fricción operativa, más impacto visual y más argumentos para vender la transformación." />
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }} className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map(([Icon, title, text]) => (
            <motion.article key={title} variants={fadeUp} className="rounded-[30px] bg-white p-7 shadow-[0_18px_60px_rgba(23,23,23,0.07)] ring-1 ring-black/8 transition hover:-translate-y-1 hover:shadow-[0_26px_80px_rgba(23,23,23,0.12)]">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-[#F6EFE7] text-[#1F3D3A]">
                <Icon className="h-6 w-6" />
              </div>
              <h3 className="mt-6 text-lg font-semibold text-[#171717]">{title}</h3>
              <p className="mt-3 leading-7 text-[#6B6B6B]">{text}</p>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}

function AudienceSection() {
  const audiences = [
    ["Agencias inmobiliarias", "Mejora anuncios, dossiers y conversaciones de captación sin añadir complejidad al equipo."],
    ["Promotores", "Presenta el potencial de activos y reformas antes de invertir en producción tradicional."],
    ["Asesores con viviendas antiguas o vacías", "Convierte espacios fríos o difíciles de imaginar en propuestas visuales vendibles."],
    ["Captación de propietarios", "Muestra cómo podría verse su inmueble y aumenta la percepción de valor del servicio."]
  ];
  return (
    <section className="bg-white py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="grid gap-10 lg:grid-cols-[0.78fr_1.22fr]">
          <SectionHeading eyebrow="Para quién es" title="Pensado para equipos inmobiliarios que quieren vender mejor" text="Un bot visual para captar, publicar y argumentar mejor cada inmueble." center={false} />
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="grid gap-4 sm:grid-cols-2">
            {audiences.map(([title, text]) => (
              <motion.div key={title} variants={fadeUp} className="rounded-[28px] border border-black/8 bg-[#FAF7F2] p-6">
                <div className="mb-5 flex h-10 w-10 items-center justify-center rounded-2xl bg-white text-[#C8A96A] shadow-sm">
                  <ChevronRight className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-[#171717]">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6B6B6B]">{text}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
        <div className="mt-10">
          <Button href={whatsappDemoHref}>Solicitar demo del chatbot</Button>
        </div>
      </div>
    </section>
  );
}

function PremiumVisualSection() {
  const cards = [
    ["Foto enviada", "WhatsApp / Telegram", "/media/ejemplos/premium-foto-enviada.webp"],
    ["Reforma hiperrealista", "Imagen lista", "/media/ejemplos/premium-reforma-hiperrealista.webp"],
    ["Vídeo antes/después", "Anuncio dinámico", "/media/ejemplos/premium-video-antes-despues.webp"],
    ["Publicación final", "Portales + redes", "/media/ejemplos/premium-publicacion-final.webp"]
  ];
  return (
    <section className="overflow-hidden bg-[linear-gradient(135deg,#F6EFE7_0%,#FFFFFF_100%)] py-24 sm:py-32">
      <div className="mx-auto grid max-w-7xl items-center gap-12 px-5 sm:px-8 lg:grid-cols-[0.78fr_1.22fr]">
        <SectionHeading eyebrow="Maqueta visual" title="Una experiencia premium detrás de un mensaje de chat" text="El bot convierte la foto original en capas comerciales: propuesta reformada, vídeo comparativo y contenido preparado para canales inmobiliarios." center={false} />
        <div className="relative min-h-[620px]">
          <div className="absolute left-1/2 top-1/2 h-[360px] w-[360px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#EFE5D7]/60 ring-1 ring-[#D9C3A5]/50" />
          <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2">
            <ArchitecturalHouse3D focus />
          </div>
          {cards.map(([title, label, imageSrc], index) => (
            <motion.div
              key={title}
              animate={{ y: [0, index % 2 ? -14 : 14, 0], rotate: [index - 2, index + 1, index - 2] }}
              transition={{ duration: 6 + index, repeat: Infinity, ease: "easeInOut" }}
              className={`absolute z-30 w-[230px] rounded-[30px] bg-white p-3 shadow-[0_28px_80px_rgba(23,23,23,0.13)] ring-1 ring-black/8 ${index === 0 ? "left-0 top-12" : index === 1 ? "right-0 top-0" : index === 2 ? "bottom-12 left-8" : "bottom-2 right-8"}`}
            >
              <img src={imageSrc} alt={title} className="h-32 w-full rounded-[22px] object-cover" loading="lazy" />
              <div className="p-3">
                <p className="text-sm font-semibold text-[#171717]">{title}</p>
                <p className="mt-1 text-xs text-[#6B6B6B]">{label}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Testimonials() {
  const logos = ["Nexo Habitat", "Altura Homes", "CasaNova", "Distrito Living", "Marés Studio"];
  const quotes = [
    ["Lo adoptó el equipo comercial porque no tenían que aprender otra herramienta. Lo usan desde WhatsApp y enseñan el potencial del inmueble al momento.", "Clara V.", "Dirección comercial"],
    ["Pasamos de explicar reformas a mostrarlas. Los antes/después nos funcionan muy bien en portales y campañas sociales.", "Mateo R.", "Marketing inmobiliario"],
    ["Para viviendas antiguas o vacías cambia totalmente la conversación con propietarios y compradores.", "Irene S.", "Home staging"]
  ];
  return (
    <section id="confianza" className="bg-[#FAF7F2] py-24">
      <div className="mx-auto max-w-7xl px-5 sm:px-8">
        <div className="flex flex-wrap items-center justify-center gap-4 border-b border-black/8 pb-12">
          {logos.map((logo) => (
            <span key={logo} className="rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#6B6B6B] shadow-sm ring-1 ring-black/8">
              {logo}
            </span>
          ))}
        </div>
        <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.2 }} className="mt-12 grid gap-5 lg:grid-cols-3">
          {quotes.map(([quote, name, role]) => (
            <motion.figure key={name} variants={fadeUp} className="rounded-[30px] bg-white p-7 shadow-[0_18px_60px_rgba(23,23,23,0.07)] ring-1 ring-black/8">
              <div className="flex gap-1 text-[#C8A96A]" aria-hidden="true">
                {[0, 1, 2, 3, 4].map((item) => <Star key={item} className="h-4 w-4 fill-current" />)}
              </div>
              <blockquote className="mt-5 leading-7 text-[#171717]">"{quote}"</blockquote>
              <figcaption className="mt-6 text-sm text-[#6B6B6B]">
                <span className="font-semibold text-[#171717]">{name}</span> · {role}
              </figcaption>
            </motion.figure>
          ))}
        </motion.div>
        <div className="mt-8 flex flex-wrap justify-center gap-3 text-sm font-semibold text-[#1F3D3A]">
          {["Resultados realistas", "Flujo rápido", "Desde WhatsApp o Telegram"].map((item) => (
            <span key={item} className="rounded-full bg-white px-4 py-2 ring-1 ring-black/8">{item}</span>
          ))}
        </div>
      </div>
    </section>
  );
}

function LeadForm() {
  return (
    <form action="https://formspree.io/f/mojyobyw" method="POST" className="rounded-[34px] bg-white p-5 text-left shadow-[0_28px_90px_rgba(23,23,23,0.12)] ring-1 ring-black/8 sm:p-7">
      <input type="hidden" name="_subject" value="Nueva solicitud de demo de Aurevia AI" />
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="block">
          <span className="text-sm font-semibold text-[#171717]">Nombre</span>
          <input name="nombre" required className="mt-2 w-full rounded-2xl border border-black/10 bg-[#FAF7F2] px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-[#C8A96A] focus:bg-white" placeholder="Tu nombre" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-[#171717]">Empresa</span>
          <input name="empresa" className="mt-2 w-full rounded-2xl border border-black/10 bg-[#FAF7F2] px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-[#C8A96A] focus:bg-white" placeholder="Inmobiliaria o equipo" />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-[#171717]">Teléfono</span>
          <input name="telefono" type="tel" required className="mt-2 w-full rounded-2xl border border-black/10 bg-[#FAF7F2] px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-[#C8A96A] focus:bg-white" placeholder="+34 ..." />
        </label>
        <label className="block">
          <span className="text-sm font-semibold text-[#171717]">Canal preferido</span>
          <select name="canal_preferido" className="mt-2 w-full rounded-2xl border border-black/10 bg-[#FAF7F2] px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-[#C8A96A] focus:bg-white">
            <option>WhatsApp</option>
            <option>Telegram</option>
            <option>Email</option>
          </select>
        </label>
      </div>
      <label className="mt-4 block">
        <span className="text-sm font-semibold text-[#171717]">Qué quieres transformar</span>
        <textarea name="mensaje" className="mt-2 min-h-24 w-full resize-none rounded-2xl border border-black/10 bg-[#FAF7F2] px-4 py-3 text-sm text-[#171717] outline-none transition focus:border-[#C8A96A] focus:bg-white" placeholder="Ej. viviendas antiguas, captación de propietarios, contenido para portales..." />
      </label>
      <button type="submit" className="premium-button-primary mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#1F3D3A] px-5 py-4 text-sm font-semibold shadow-[0_18px_40px_rgba(31,61,58,0.22)] transition hover:bg-[#17312e]">
        Enviar solicitud de demo
        <Send className="h-4 w-4" />
      </button>
      <p className="mt-3 text-center text-xs leading-5 text-[#6B6B6B]">Demo personalizada con un inmueble real de tu cartera.</p>
    </form>
  );
}

function FinalCTA() {
  return (
    <section id="contacto" className="relative overflow-hidden bg-[linear-gradient(135deg,#FFFFFF_0%,#F6EFE7_100%)] py-24 sm:py-32">
      <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }} className="absolute right-8 top-12 h-32 w-32 rounded-full border border-[#C8A96A]/40" />
      <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 sm:px-8 lg:grid-cols-[0.9fr_1.1fr]">
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.4 }}>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-[#C8A96A]">Demo personalizada</p>
          <h2 className="text-4xl font-semibold tracking-tight text-[#171717] sm:text-6xl">Haz que tus inmuebles se vean como una oportunidad, no como una reforma pendiente</h2>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[#6B6B6B]">Solicita una demo y descubre cómo tu equipo puede transformar fotos de inmuebles desde WhatsApp o Telegram.</p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <Button href={whatsappDemoHref}>Solicitar demo del chatbot</Button>
            <Button href={whatsappExampleHref} variant="secondary">
              Ver ejemplo por WhatsApp
            </Button>
          </div>
          <p className="mt-5 text-sm font-semibold text-[#1F3D3A]">Demo personalizada con un inmueble real de tu cartera.</p>
        </motion.div>
        <motion.div variants={fadeUp} initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.25 }}>
          <LeadForm />
        </motion.div>
      </div>
    </section>
  );
}

function MobileStickyCTA() {
  return (
    <div className="fixed inset-x-0 bottom-0 z-50 border-t border-black/8 bg-white/88 px-4 py-3 shadow-[0_-16px_40px_rgba(23,23,23,0.10)] backdrop-blur-xl lg:hidden">
      <a href={whatsappDemoHref} className="premium-button-primary flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#1F3D3A] px-5 text-sm font-semibold">
        Solicitar demo del chatbot
        <ArrowRight className="h-4 w-4" />
      </a>
    </div>
  );
}

const legalPages = {
  "/aviso-legal": {
    title: "Aviso legal",
    intro: "Información general sobre el titular y las condiciones de uso de este sitio web.",
    sections: [
      ["Titularidad", "Titular: Isaac Cortes Tello. NIF: 73443901W. Domicilio: C Lupercio N1, 50400 Cariñena, Zaragoza, España. Email de contacto: isaac.cortes@telkora.com."],
      ["Objeto", "La web tiene carácter informativo y comercial. Su finalidad es presentar un chatbot para generar material visual inmobiliario a partir de imágenes enviadas por WhatsApp o Telegram."],
      ["Uso del sitio", "La persona usuaria se compromete a utilizar la web de forma lícita, responsable y respetuosa, sin realizar acciones que puedan dañar el funcionamiento del sitio o los derechos de terceros."],
      ["Propiedad intelectual", "Los textos, diseño, imágenes, código, marcas y elementos visuales de la web pertenecen a sus titulares o se usan con autorización. No se permite su reproducción o explotación sin permiso expreso."],
      ["Responsabilidad", "Aurevia AI procura que la información sea correcta y actualizada, pero no garantiza la ausencia de errores. El uso de la información se realiza bajo responsabilidad de la persona usuaria."],
      ["Legislación aplicable", "Estas condiciones se interpretan conforme a la legislación española y europea aplicable."]
    ]
  },
  "/privacidad": {
    title: "Política de privacidad",
    intro: "Resumen de cómo se tratan los datos personales enviados a través del formulario o canales de contacto.",
    sections: [
      ["Responsable", "Responsable del tratamiento: Isaac Cortes Tello. NIF: 73443901W. Domicilio: C Lupercio N1, 50400 Cariñena, Zaragoza, España. Email de contacto: isaac.cortes@telkora.com."],
      ["Datos tratados", "Podemos tratar nombre, empresa, teléfono, canal preferido, mensaje y cualquier dato que la persona usuaria envíe voluntariamente al solicitar una demo."],
      ["Finalidad", "Los datos se usan para responder solicitudes, gestionar demos comerciales, contactar con la persona interesada y mejorar la comunicación del servicio."],
      ["Base jurídica", "La base jurídica es el consentimiento de la persona usuaria al enviar el formulario o contactar por WhatsApp/Telegram, así como el interés legítimo en responder comunicaciones comerciales solicitadas."],
      ["Conservación", "Los datos se conservarán durante el tiempo necesario para atender la solicitud y, posteriormente, durante los plazos legales aplicables o hasta que se solicite su supresión."],
      ["Encargados", "El formulario usa Formspree como proveedor técnico para recibir solicitudes. WhatsApp, Telegram u otros canales pueden tratar datos conforme a sus propias políticas."],
      ["Derechos", "Puedes solicitar acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a isaac.cortes@telkora.com. También puedes reclamar ante la Agencia Española de Protección de Datos."],
      ["Envío de imágenes", "No envíes imágenes que incluyan datos personales de terceros, matrículas, documentos, rostros u otra información sensible sin autorización suficiente."]
    ]
  },
  "/cookies": {
    title: "Política de cookies",
    intro: "Información sobre el uso de cookies y tecnologías similares en este sitio.",
    sections: [
      ["Uso actual", "Esta landing no instala cookies analíticas o publicitarias propias de forma intencionada en su versión actual. El reproductor de vídeo, el formulario o servicios externos podrían aplicar sus propias tecnologías si se integran proveedores adicionales."],
      ["Cookies técnicas", "Pueden existir cookies o almacenamiento técnico necesario para el funcionamiento básico del sitio, la seguridad o la prestación de servicios solicitados por la persona usuaria."],
      ["Servicios de terceros", "Formspree, WhatsApp, Telegram, LinkedIn o Telkora pueden aplicar sus propias políticas cuando se accede a sus enlaces o servicios externos."],
      ["Cambios futuros", "Si se añaden herramientas de analítica, publicidad, píxeles o sistemas de seguimiento, esta política deberá actualizarse y, si corresponde, incorporarse un banner de consentimiento."],
      ["Gestión", "Puedes bloquear o eliminar cookies desde la configuración de tu navegador."]
    ]
  }
};

function LegalPage({ page }) {
  return (
    <main className="min-h-screen bg-[linear-gradient(135deg,#FAF7F2_0%,#FFFFFF_62%,#F6EFE7_100%)] text-[#171717]">
      <Header />
      <section className="mx-auto max-w-4xl px-5 pb-20 pt-32 sm:px-8">
        <a href="/" className="premium-button-secondary inline-flex items-center gap-2 rounded-full bg-white/82 px-4 py-2 text-sm font-semibold shadow-sm ring-1 ring-black/10">
          ← Volver a Aurevia AI
        </a>
        <div className="mt-10 rounded-[34px] bg-white p-6 shadow-[0_28px_90px_rgba(23,23,23,0.10)] ring-1 ring-black/8 sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.22em] text-[#C8A96A]">Legal</p>
          <h1 className="mt-3 text-4xl font-semibold tracking-tight sm:text-5xl">{page.title}</h1>
          <p className="mt-5 text-lg leading-8 text-[#6B6B6B]">{page.intro}</p>
          <div className="mt-10 space-y-8">
            {page.sections.map(([title, text]) => (
              <section key={title}>
                <h2 className="text-xl font-semibold text-[#171717]">{title}</h2>
                <p className="mt-3 leading-7 text-[#6B6B6B]">{text}</p>
              </section>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}

function Footer() {
  const footerColumns = [
    {
      title: "Producto",
      links: [
        ["C?mo funciona", "#como-funciona"],
        ["Ejemplos", "#ejemplos"],
        ["Beneficios", "#beneficios"]
      ]
    },
    {
      title: "Empresa",
      links: [
        ["Demo", whatsappDemoHref],
        ["Contacto", "#contacto"],
        ["Telkora", "https://telkora.com"]
      ]
    },
    {
      title: "Canales",
      links: [
        ["WhatsApp", whatsappDemoHref],
        ["Telegram", whatsappExampleHref],
        ["LinkedIn", "https://www.linkedin.com/company/telkora"]
      ]
    },
    {
      title: "Legal",
      links: [
        ["Aviso legal", "/aviso-legal"],
        ["Privacidad", "/privacidad"],
        ["Cookies", "/cookies"]
      ]
    }
  ];

  return (
    <footer className="bg-[#171717] py-12 text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 sm:px-8 lg:grid-cols-[1.25fr_0.8fr_0.8fr_0.8fr_0.8fr]">
        <div>
          <div className="flex items-center gap-3">
            <span className="grid h-10 w-10 place-items-center rounded-2xl bg-white text-[#1F3D3A]">
              <img src="/brand/favicon.svg" alt="" className="h-6 w-6" aria-hidden="true" />
            </span>
            <span className="font-semibold">Aurevia AI</span>
          </div>
          <p className="mt-4 max-w-sm leading-7 text-white/60">Chatbot de WhatsApp y Telegram para transformar fotos de inmuebles en reformas visuales, v?deos antes/despu?s y contenido comercial.</p>
        </div>
        {footerColumns.map(({ title, links }) => (
          <div key={title}>
            <p className="font-semibold">{title}</p>
            <div className="mt-4 space-y-3">
              {links.map(([label, href]) => (
                <a key={label} href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noreferrer" : undefined} className="block text-sm text-white/56 transition hover:text-white">
                  {label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-10 max-w-7xl border-t border-white/10 px-5 pt-6 text-sm text-white/45 sm:px-8">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <span>? 2026 Aurevia AI. Todos los derechos reservados.</span>
          <a href="https://telkora.com" target="_blank" rel="noreferrer" className="text-white/56 transition hover:text-white">
            Web dise?ada por Telkora
          </a>
        </div>
      </div>
    </footer>
  );
}

function App() {
  useEffect(() => {
    document.documentElement.style.scrollBehavior = "smooth";
  }, []);

  const legalPage = legalPages[window.location.pathname];
  useEffect(() => {
    const description = document.querySelector('meta[name="description"]');
    const ogTitle = document.querySelector('meta[property="og:title"]');
    const ogDescription = document.querySelector('meta[property="og:description"]');
    const title = legalPage
      ? `${legalPage.title} | Aurevia AI`
      : "Aurevia AI | Reformas visuales hiperrealistas desde WhatsApp o Telegram";
    const desc = legalPage
      ? legalPage.intro
      : "Aurevia AI transforma fotos de inmuebles desde WhatsApp o Telegram en reformas visuales hiperrealistas, imágenes profesionales y vídeos antes/después para vender mejor.";

    document.title = title;
    if (description) description.setAttribute("content", desc);
    if (ogTitle) ogTitle.setAttribute("content", title);
    if (ogDescription) ogDescription.setAttribute("content", desc);
  }, [legalPage]);

  if (legalPage) {
    return <LegalPage page={legalPage} />;
  }

  return (
    <main className="min-h-screen bg-white font-sans text-[#171717]">
      <Header />
      <Hero />
      <TrustBadges />
      <HowItWorks />
      <IntegrationSection />
      <ChatbotDemo />
      <TransformationExamples />
      <VideoTransformationSection />
      <BenefitsGrid />
      <AudienceSection />
      <PremiumVisualSection />
      <Testimonials />
      <FinalCTA />
      <Footer />
      <MobileStickyCTA />
    </main>
  );
}

createRoot(document.getElementById("root")).render(<App />);

