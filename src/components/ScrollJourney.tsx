import { useRef } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import mountainsHero from "@/assets/mountains-hero.jpg";
import mountainToGarden from "@/assets/mountain-to-garden.jpg";
import gardenPathway from "@/assets/garden-pathway.jpg";
import gardenTunnel from "@/assets/garden-tunnel.jpg";
import gardenCloseup from "@/assets/garden-closeup.jpg";
import gardenGate from "@/assets/garden-gate.jpg";
import gateOpen from "@/assets/gate-open.jpg";

const SPRING = { stiffness: 40, damping: 30, restDelta: 0.0005 };

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
  y?: MotionValue<number>;
  z: number;
}

const Layer = ({ src, alt, scale, opacity, y, z }: LayerProps) => (
  <motion.div
    style={{ scale, opacity, y: y ?? 0, zIndex: z, ...GPU }}
    className="absolute inset-0 origin-center"
  >
    <img src={src} alt={alt} className="w-full h-full object-cover" width={1920} height={1080} />
  </motion.div>
);

/* ─── Minimal Text Overlay ─── */
interface TextProps {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  title: React.ReactNode;
  sub?: string;
}

const Text = ({ opacity, y, title, sub }: TextProps) => (
  <motion.div style={{ opacity, y, zIndex: 15, ...GPU }} className="absolute inset-0 flex items-center justify-center text-center px-6">
    <div>
      {sub && <p className="font-body text-[10px] md:text-xs tracking-[0.4em] uppercase text-cream/50 mb-4">{sub}</p>}
      <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-cream leading-tight drop-shadow-lg">{title}</h2>
    </div>
  </motion.div>
);

/* ═══════════════════════════════════════════
   SCROLL JOURNEY — 4 cinematic beats
   Total: 800vh for tighter, more natural pacing
   Beat 1: Mountains hero (0.00–0.30)
   Beat 2: Descent into garden (0.22–0.55)
   Beat 3: Through the garden (0.48–0.78)
   Beat 4: Gate approach & opening (0.72–1.00)
   ═══════════════════════════════════════════ */

const ScrollJourney = () => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(raw, SPRING);

  /* ─── Beat 1: Mountains (0.00 → 0.30) ─── */
  // Main mountain image — slow push-in, long fade
  const m_s = useTransform(p, [0, 0.30], [1, 1.6]);
  const m_o = useTransform(p, [0, 0.22, 0.30], [1, 1, 0]);
  // Hero text
  const m_to = useTransform(p, [0, 0.02, 0.12, 0.20], [0, 1, 1, 0]);
  const m_ty = useTransform(p, [0, 0.20], [0, -40]);

  /* ─── Beat 2: Descent into garden (0.22 → 0.55) ─── */
  // Mountain-to-garden crossfade — overlaps with beat 1
  const d_o = useTransform(p, [0.22, 0.30, 0.48, 0.55], [0, 1, 1, 0]);
  const d_s = useTransform(p, [0.22, 0.55], [1, 1.4]);
  const d_y = useTransform(p, [0.22, 0.55], [0, -40]);
  // Garden pathway layers in during descent
  const gp_o = useTransform(p, [0.35, 0.42, 0.48, 0.55], [0, 0.6, 1, 0]);
  const gp_s = useTransform(p, [0.35, 0.55], [1.05, 1.3]);
  const gp_y = useTransform(p, [0.35, 0.55], [10, -30]);
  // Text
  const d_to = useTransform(p, [0.28, 0.33, 0.40, 0.45], [0, 1, 1, 0]);
  const d_ty = useTransform(p, [0.28, 0.45], [25, -10]);

  /* ─── Beat 3: Through the garden (0.48 → 0.78) ─── */
  // Tunnel + closeup blend together as one continuous garden walk
  const t_o = useTransform(p, [0.48, 0.55, 0.68, 0.75], [0, 1, 1, 0]);
  const t_s = useTransform(p, [0.48, 0.78], [1, 1.5]);
  const cl_o = useTransform(p, [0.58, 0.64, 0.72, 0.78], [0, 0.7, 1, 0]);
  const cl_s = useTransform(p, [0.58, 0.78], [1.02, 1.25]);
  // Text
  const t_to = useTransform(p, [0.55, 0.59, 0.64, 0.68], [0, 1, 1, 0]);
  const t_ty = useTransform(p, [0.55, 0.68], [20, -8]);

  /* ─── Beat 4: Gate approach & opening (0.72 → 1.00) ─── */
  const g_o = useTransform(p, [0.72, 0.78, 0.86, 0.92], [0, 1, 1, 0]);
  const g_s = useTransform(p, [0.72, 0.92], [1, 1.5]);
  // Gate opens
  const go_o = useTransform(p, [0.86, 0.92, 1.0], [0, 1, 1]);
  const go_s = useTransform(p, [0.86, 1.0], [1, 1.3]);
  // Text
  const g_to = useTransform(p, [0.78, 0.82, 0.86, 0.90], [0, 1, 1, 0]);
  const g_ty = useTransform(p, [0.78, 0.90], [20, -8]);

  // Luminous exit — soft warm bloom instead of harsh white flash
  const exitGlow = useTransform(p, [0.92, 1.0], [0, 0.85]);

  // Scroll hint
  const scrollHint = useTransform(p, [0, 0.04], [1, 0]);

  // Atmospheric haze — warm golden bloom throughout the journey
  const hazeOpacity = useTransform(p, [0, 0.15, 0.5, 0.85, 1.0], [0.08, 0.15, 0.2, 0.15, 0.3]);

  // Soft vignette — less aggressive
  const vig = useTransform(p, [0, 0.05, 0.90, 1], [0.4, 0.25, 0.25, 0]);

  // Subtle progress
  const progressOpacity = useTransform(p, [0, 0.03, 0.92, 1.0], [0, 0.4, 0.4, 0]);

  return (
    <section ref={ref} className="relative h-[800vh]">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "hsl(var(--foreground))" }}>

        {/* ── Image Layers ── */}
        {/* Beat 1: Mountains */}
        <Layer src={mountainsHero} alt="Emerald mountains at golden hour" scale={m_s} opacity={m_o} z={1} />
        
        {/* Beat 2: Descent — two images blend together */}
        <Layer src={mountainToGarden} alt="Descending into botanical garden" scale={d_s} opacity={d_o} y={d_y} z={2} />
        <Layer src={gardenPathway} alt="Garden pathway" scale={gp_s} opacity={gp_o} y={gp_y} z={3} />
        
        {/* Beat 3: Through the garden — tunnel and closeup overlap */}
        <Layer src={gardenTunnel} alt="Vine tunnel corridor" scale={t_s} opacity={t_o} z={4} />
        <Layer src={gardenCloseup} alt="Lavender and chamomile" scale={cl_s} opacity={cl_o} z={5} />
        
        {/* Beat 4: Gate */}
        <Layer src={gardenGate} alt="Ornate garden gate" scale={g_s} opacity={g_o} z={6} />
        <Layer src={gateOpen} alt="Gate opening to golden light" scale={go_s} opacity={go_o} z={7} />

        {/* ── Atmospheric overlays ── */}
        {/* Warm bloom / haze — golden light spill across entire journey */}
        <motion.div
          style={{ opacity: hazeOpacity, zIndex: 18, ...GPU }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 40%, hsla(38, 50%, 70%, 0.35) 0%, hsla(38, 40%, 55%, 0.1) 40%, transparent 70%)"
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 30% 70%, hsla(100, 25%, 55%, 0.15) 0%, transparent 50%)"
          }} />
        </motion.div>

        {/* Depth fog — bottom haze for depth */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 17 }} aria-hidden>
          <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{
            background: "linear-gradient(to top, hsla(150, 30%, 12%, 0.25) 0%, transparent 100%)"
          }} />
        </div>

        {/* Soft vignette */}
        <motion.div style={{ opacity: vig, zIndex: 19 }} className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 50%, hsla(150, 30%, 8%, 0.4) 100%)"
          }} />
        </motion.div>

        {/* ── Text — minimal, only 3 moments ── */}
        {/* Hero */}
        <motion.div style={{ opacity: m_to, y: m_ty, zIndex: 20, ...GPU }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="font-body text-[10px] md:text-xs tracking-[0.4em] uppercase text-cream/50 mb-5">Organic Health & Wellness</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[6rem] font-bold text-cream leading-[1.05] drop-shadow-2xl">
            From Nature,<br /><span className="italic font-light">For You</span>
          </h1>
        </motion.div>

        {/* Garden entry */}
        <Text opacity={d_to} y={d_ty} sub="Into the garden" title={<>Where Healing <span className="italic font-light">Grows</span></>} />

        {/* Deep garden */}
        <Text opacity={t_to} y={t_ty} title={<>Pure <span className="italic font-light">Botanicals</span></>} />

        {/* Gate */}
        <Text opacity={g_to} y={g_ty} title={<>Welcome <span className="italic font-light">Beyond</span></>} />

        {/* ── Luminous exit glow — warm threshold into products ── */}
        <motion.div
          style={{ opacity: exitGlow, zIndex: 30, ...GPU }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 50%, hsl(var(--cream)) 0%, hsl(var(--cream) / 0.95) 30%, hsl(var(--background)) 70%)"
          }} />
        </motion.div>

        {/* ── Scroll hint ── */}
        <motion.div style={{ opacity: scrollHint, zIndex: 25 }} className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-3">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/30">Scroll</p>
            <div className="w-[1px] h-10 bg-cream/15 relative overflow-hidden">
              <motion.div className="absolute top-0 left-0 w-full bg-cream/40" animate={{ height: ["0%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
            </div>
          </div>
        </motion.div>

        {/* ── Subtle progress line ── */}
        <motion.div style={{ scaleX: p, opacity: progressOpacity, zIndex: 40 }} className="absolute top-0 left-0 right-0 h-[1px] origin-left">
          <div className="w-full h-full bg-gold/40" />
        </motion.div>
      </div>
    </section>
  );
};

export default ScrollJourney;
