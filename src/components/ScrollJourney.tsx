import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import mountainsHero from "@/assets/mountains-hero.jpg";
import mountainToGarden from "@/assets/mountain-to-garden.jpg";
import gardenPathway from "@/assets/garden-pathway.jpg";
import gardenTunnel from "@/assets/garden-tunnel.jpg";
import gardenCloseup from "@/assets/garden-closeup.jpg";
import gardenGate from "@/assets/garden-gate.jpg";
import gateOpen from "@/assets/gate-open.jpg";

// Ultra-smooth spring — low stiffness for silk-like feel
const SPRING = { stiffness: 50, damping: 28, restDelta: 0.0005 };

// GPU layer style
const GPU: React.CSSProperties = {
  willChange: "transform, opacity",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  transform: "translateZ(0)",
};

/* ─── Image Layer ─── */
interface LayerProps {
  src: string;
  alt: string;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  x?: MotionValue<number>;
  y?: MotionValue<number>;
  z: number;
  gradient?: string;
}

const Layer = ({ src, alt, scale, opacity, x, y, z, gradient }: LayerProps) => (
  <motion.div
    style={{ scale, opacity, x: x ?? 0, y: y ?? 0, zIndex: z, ...GPU }}
    className="absolute inset-0 origin-center"
  >
    <img src={src} alt={alt} className="w-full h-full object-cover" width={1920} height={1080} />
    {gradient && <div className="absolute inset-0" style={{ background: gradient }} />}
  </motion.div>
);

/* ─── Text Overlay ─── */
interface TextProps {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  sub: string;
  title: React.ReactNode;
  desc?: string;
  align?: "center" | "bottom" | "left";
  z?: number;
}

const alignClass = {
  center: "flex items-center justify-center text-center",
  bottom: "flex items-end justify-center pb-28 text-center",
  left: "flex items-end justify-start p-10 md:p-20 text-left",
};

const Text = ({ opacity, y, sub, title, desc, align = "center", z = 15 }: TextProps) => (
  <motion.div style={{ opacity, y, zIndex: z, ...GPU }} className={`absolute inset-0 ${alignClass[align]} px-6`}>
    <div>
      <p className="font-body text-xs md:text-sm tracking-[0.35em] uppercase text-cream/70 mb-4">{sub}</p>
      <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-cream leading-tight drop-shadow-lg">{title}</h2>
      {desc && <p className="font-body text-cream/60 mt-5 max-w-md text-base leading-relaxed">{desc}</p>}
    </div>
  </motion.div>
);

/* ─── Chapter Dots ─── */
const CHAPTERS = ["Mountains", "Descent", "Pathway", "Canopy", "Botanicals", "The Gate", "Beyond"];

const Dot = ({ i, active }: { i: number; active: MotionValue<number> }) => {
  const o = useTransform(active, (v) => (v === i ? 1 : 0.25));
  const s = useTransform(active, (v) => (v === i ? 1.6 : 1));
  return (
    <div className="flex items-center gap-3 relative">
      <motion.div style={{ opacity: o, scale: s, ...GPU }} className="w-1.5 h-1.5 rounded-full bg-cream" />
      <motion.span style={{ opacity: o }} className="absolute right-5 font-body text-[10px] tracking-[0.15em] uppercase text-cream whitespace-nowrap">
        {CHAPTERS[i]}
      </motion.span>
    </div>
  );
};

/* ═══════════════════════════════════════════
   SCROLL JOURNEY — 7 cinematic chapters
   Total height: 1400vh for generous pacing
   Each chapter ~20% with 6-8% overlap
   ═══════════════════════════════════════════ */

const ScrollJourney = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(raw, SPRING);

  // Shared gradient strings
  const G = {
    dark: "linear-gradient(to bottom, rgba(0,0,0,0.2) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.35) 100%)",
    soft: "linear-gradient(to bottom, rgba(0,0,0,0.08) 0%, transparent 50%, rgba(0,0,0,0.12) 100%)",
    bot: "linear-gradient(to bottom, transparent 0%, transparent 50%, rgba(0,0,0,0.4) 100%)",
    top: "linear-gradient(to top, rgba(0,0,0,0.25) 0%, transparent 40%, rgba(0,0,0,0.08) 100%)",
  };

  // ─── Ch1: Mountains (0.00 → 0.20) ───
  const m_s = useTransform(p, [0, 0.20], [1, 2.5]);
  const m_o = useTransform(p, [0, 0.14, 0.20], [1, 1, 0]);
  const m_to = useTransform(p, [0, 0.015, 0.09, 0.14], [0, 1, 1, 0]);
  const m_ty = useTransform(p, [0, 0.14], [0, -50]);

  // ─── Ch2: Descent (0.13 → 0.32) ───
  const a_o = useTransform(p, [0.13, 0.18, 0.26, 0.32], [0, 1, 1, 0]);
  const a_s = useTransform(p, [0.13, 0.32], [1.02, 2.0]);
  const a_y = useTransform(p, [0.13, 0.32], [0, -60]);
  const a_to = useTransform(p, [0.17, 0.21, 0.25, 0.29], [0, 1, 1, 0]);
  const a_ty = useTransform(p, [0.17, 0.29], [35, -15]);

  // ─── Ch3: Pathway (0.26 → 0.46) ───
  const p_o = useTransform(p, [0.26, 0.32, 0.40, 0.46], [0, 1, 1, 0]);
  const p_s = useTransform(p, [0.26, 0.46], [1, 1.5]);
  const p_y = useTransform(p, [0.26, 0.46], [20, -80]);
  const p_to = useTransform(p, [0.31, 0.35, 0.39, 0.43], [0, 1, 1, 0]);
  const p_ty = useTransform(p, [0.31, 0.43], [30, -10]);

  // ─── Ch4: Tunnel (0.40 → 0.58) ───
  const t_o = useTransform(p, [0.40, 0.46, 0.52, 0.58], [0, 1, 1, 0]);
  const t_s = useTransform(p, [0.40, 0.58], [1, 1.7]);
  const t_to = useTransform(p, [0.45, 0.49, 0.52, 0.56], [0, 1, 1, 0]);
  const t_ty = useTransform(p, [0.45, 0.56], [30, -10]);

  // ─── Ch5: Closeup (0.53 → 0.70) ───
  const c_o = useTransform(p, [0.53, 0.58, 0.64, 0.70], [0, 1, 1, 0]);
  const c_s = useTransform(p, [0.53, 0.70], [1.03, 1.35]);
  const c_x = useTransform(p, [0.53, 0.70], [20, -20]);
  const c_to = useTransform(p, [0.57, 0.60, 0.64, 0.68], [0, 1, 1, 0]);
  const c_ty = useTransform(p, [0.57, 0.68], [25, -8]);

  // ─── Ch6: Gate closed (0.65 → 0.82) ───
  const g_o = useTransform(p, [0.65, 0.70, 0.76, 0.82], [0, 1, 1, 0]);
  const g_s = useTransform(p, [0.65, 0.82], [1, 1.8]);
  const g_to = useTransform(p, [0.69, 0.73, 0.76, 0.79], [0, 1, 1, 0]);
  const g_ty = useTransform(p, [0.69, 0.79], [25, -8]);

  // ─── Ch7: Gate opens (0.78 → 0.96) ───
  const go_o = useTransform(p, [0.78, 0.83, 0.90, 0.96], [0, 1, 1, 0.6]);
  const go_s = useTransform(p, [0.78, 0.96], [1, 2.0]);
  const flash = useTransform(p, [0.91, 1.0], [0, 1]);

  // UI
  const active = useTransform(p, (v) => {
    if (v < 0.13) return 0;
    if (v < 0.26) return 1;
    if (v < 0.40) return 2;
    if (v < 0.53) return 3;
    if (v < 0.65) return 4;
    if (v < 0.78) return 5;
    return 6;
  });

  const scrollHint = useTransform(p, [0, 0.03], [1, 0]);
  const vig = useTransform(p, [0, 0.04, 0.92, 1], [0.55, 0.35, 0.35, 0]);

  return (
    <section ref={ref} className="relative h-[1400vh]">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "hsl(var(--foreground))" }}>

        {/* Layers */}
        <Layer src={mountainsHero} alt="Emerald mountains at golden hour" scale={m_s} opacity={m_o} z={1} gradient={G.dark} />
        <Layer src={mountainToGarden} alt="Descending into botanical garden" scale={a_s} opacity={a_o} y={a_y} z={2} gradient={G.soft} />
        <Layer src={gardenPathway} alt="Stone pathway through garden" scale={p_s} opacity={p_o} y={p_y} z={3} gradient={G.bot} />
        <Layer src={gardenTunnel} alt="Vine tunnel corridor" scale={t_s} opacity={t_o} z={4} gradient={G.soft} />
        <Layer src={gardenCloseup} alt="Lavender and chamomile close-up" scale={c_s} opacity={c_o} x={c_x} z={5} gradient={G.dark} />
        <Layer src={gardenGate} alt="Ornate garden gate" scale={g_s} opacity={g_o} z={6} gradient={G.soft} />
        <Layer src={gateOpen} alt="Gate opening to golden light" scale={go_s} opacity={go_o} z={7} gradient={G.top} />

        {/* Hero text */}
        <motion.div style={{ opacity: m_to, y: m_ty, zIndex: 15, ...GPU }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="font-body text-xs md:text-sm tracking-[0.4em] uppercase text-cream/60 mb-5">Organic Health & Wellness</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[6.5rem] font-bold text-cream leading-[1.05] drop-shadow-2xl">
            From Nature,<br /><span className="italic font-light">For You</span>
          </h1>
          <p className="font-body text-cream/50 mt-8 text-base md:text-lg max-w-lg tracking-wide">Scroll to begin your journey through our botanical garden</p>
        </motion.div>

        {/* Chapter text */}
        <Text opacity={a_to} y={a_ty} sub="Descending into" title={<>The <span className="italic font-light">Garden</span></>} />
        <Text opacity={p_to} y={p_ty} sub="Walk with us" title={<>Every Step, <span className="italic font-light">Intentional</span></>} align="bottom" />
        <Text opacity={t_to} y={t_ty} sub="Nature's corridor" title={<>Where Healing <span className="italic font-light">Grows</span></>} />
        <Text opacity={c_to} y={c_ty} sub="Hand-picked ingredients" title={<>Pure <span className="italic font-light">Botanicals</span></>} desc="Lavender, chamomile, rosemary — each selected for its healing power" align="left" />
        <Text opacity={g_to} y={g_ty} sub="You've arrived" title={<>The Gate to <span className="italic font-light">Wellness</span></>} />

        {/* Vignette */}
        <motion.div style={{ opacity: vig, zIndex: 20 }} className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(0,0,0,0.55) 100%)" }} />
        </motion.div>

        {/* White flash exit */}
        <motion.div style={{ opacity: flash, zIndex: 30 }} className="absolute inset-0 pointer-events-none bg-background" />

        {/* Scroll hint */}
        <motion.div style={{ opacity: scrollHint, zIndex: 25 }} className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-4">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/40">Scroll to explore</p>
            <div className="w-[1px] h-12 bg-cream/20 relative overflow-hidden">
              <motion.div className="absolute top-0 left-0 w-full bg-cream/60" animate={{ height: ["0%", "100%"] }} transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }} />
            </div>
          </div>
        </motion.div>

        {/* Chapter dots */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-4" style={{ zIndex: 25 }}>
          {CHAPTERS.map((_, i) => <Dot key={i} i={i} active={active} />)}
        </div>

        {/* Progress bar */}
        <motion.div style={{ scaleX: p, zIndex: 40 }} className="absolute top-0 left-0 right-0 h-[1px] origin-left">
          <div className="w-full h-full" style={{ background: "linear-gradient(90deg, hsl(var(--gold)), hsl(var(--gold-light)))" }} />
        </motion.div>
      </div>
    </section>
  );
};

export default ScrollJourney;
