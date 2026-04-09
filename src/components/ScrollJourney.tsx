import { useRef, useState } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import mountainsHero from "@/assets/mountains-hero.jpg";
import mountainToGarden from "@/assets/mountain-to-garden.jpg";
import gardenPathway from "@/assets/garden-pathway.jpg";
import gardenGate from "@/assets/garden-gate.jpg";

const SPRING = { stiffness: 22, damping: 45, restDelta: 0.0005 };

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

/* ═══════════════════════════════════════════
   SCROLL JOURNEY — 3 cinematic beats + closed gate
   ═══════════════════════════════════════════ */

const ScrollJourney = () => {
  const ref = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(raw, SPRING);

  /* ─── Beat 1: Mountains (0.00 → 0.35) ─── */
  const m_s = useTransform(p, [0, 0.35], [1, 1.15]);
  const m_o = useTransform(p, [0, 0.28, 0.35], [1, 1, 0]);
  const m_to = useTransform(p, [0, 0.03, 0.15, 0.25], [0, 1, 1, 0]);
  const m_ty = useTransform(p, [0, 0.25], [0, -30]);

  /* ─── Beat 2: Garden descent (0.28 → 0.65) ─── */
  const d_o = useTransform(p, [0.28, 0.35, 0.55, 0.62], [0, 1, 1, 0]);
  const d_s = useTransform(p, [0.28, 0.65], [1, 1.12]);
  const d_y = useTransform(p, [0.28, 0.65], [0, -30]);
  const d_to = useTransform(p, [0.33, 0.38, 0.48, 0.53], [0, 1, 1, 0]);
  const d_ty = useTransform(p, [0.33, 0.53], [20, -8]);

  // Pathway sub-layer
  const pw_o = useTransform(p, [0.42, 0.50, 0.58, 0.65], [0, 0.7, 1, 0]);
  const pw_s = useTransform(p, [0.42, 0.65], [1, 1.1]);
  const pw_y = useTransform(p, [0.42, 0.65], [8, -20]);

  /* ─── Beat 3: Gate — closed "coming soon" (0.58 → 1.00) ─── */
  const g_o = useTransform(p, [0.58, 0.65, 0.92, 1.0], [0, 1, 1, 0.6]);
  const g_s = useTransform(p, [0.58, 1.0], [1, 1.1]);
  const g_to = useTransform(p, [0.65, 0.70, 0.82, 0.88], [0, 1, 1, 0]);
  const g_ty = useTransform(p, [0.65, 0.88], [20, -8]);

  // "Coming soon" text
  const cs_to = useTransform(p, [0.82, 0.88, 0.95, 1.0], [0, 1, 1, 0.5]);
  const cs_ty = useTransform(p, [0.82, 1.0], [15, -5]);

  // Exit bloom
  const exitGlow = useTransform(p, [0.92, 1.0], [0, 0.7]);
  const exitScale = useTransform(p, [0.95, 1.0], [1, 1.05]);

  // Scroll hint
  const scrollHint = useTransform(p, [0, 0.04], [1, 0]);

  // Atmospheric haze
  const hazeOpacity = useTransform(p, [0, 0.15, 0.5, 0.85, 1.0], [0.06, 0.12, 0.18, 0.12, 0.25]);

  // Vignette
  const vig = useTransform(p, [0, 0.05, 0.90, 1], [0.35, 0.2, 0.2, 0]);

  // Progress
  const progressOpacity = useTransform(p, [0, 0.03, 0.92, 1.0], [0, 0.3, 0.3, 0]);

  const handleSubmit = () => {
    const input = document.querySelector<HTMLInputElement>('#waitlist-email');
    if (input && input.value && input.validity.valid) {
      setSubmitted(true);
      input.value = '';
      setTimeout(() => setSubmitted(false), 3000);
    }
  };

  return (
    <section ref={ref} className="relative h-[500vh]">
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: "hsl(var(--foreground))" }}
      >
        {/* Image Layers */}
        <div className="absolute inset-0">
          <Layer src={mountainsHero} alt="Emerald mountains at golden hour" scale={m_s} opacity={m_o} z={1} />
          <Layer src={mountainToGarden} alt="Descending into botanical garden" scale={d_s} opacity={d_o} y={d_y} z={2} />
          <Layer src={gardenPathway} alt="Garden pathway approaching gate" scale={pw_s} opacity={pw_o} y={pw_y} z={3} />
          <Layer src={gardenGate} alt="Ornate closed garden gate" scale={g_s} opacity={g_o} z={4} />
        </div>

        {/* Atmospheric haze */}
        <motion.div
          style={{ opacity: hazeOpacity, zIndex: 18, ...GPU }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 40%, rgba(200, 180, 140, 0.3) 0%, rgba(180, 160, 120, 0.08) 40%, transparent 70%)"
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 30% 70%, rgba(120, 160, 100, 0.12) 0%, transparent 50%)"
          }} />
        </motion.div>

        {/* Depth fog */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 17 }} aria-hidden>
          <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{
            background: "linear-gradient(to top, rgba(20, 35, 20, 0.2) 0%, transparent 100%)"
          }} />
        </div>

        {/* Vignette */}
        <motion.div style={{ opacity: vig, zIndex: 19 }} className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(15, 30, 15, 0.35) 100%)"
          }} />
        </motion.div>

        {/* ── Text ── */}
        {/* Hero */}
        <motion.div style={{ opacity: m_to, y: m_ty, zIndex: 20, ...GPU }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="font-body text-[10px] tracking-[0.5em] font-light uppercase text-cream/40 mb-5">Organic Health & Wellness</p>
          <div className="w-12 h-[1px] bg-cream/15 mx-auto mb-8" />
          <motion.h1
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.6, ease: "easeOut", delay: 0.4 }}
            className="font-display text-5xl md:text-7xl lg:text-[6rem] font-light text-cream leading-[1.05] drop-shadow-2xl"
          >
            From Nature,
            <br />
            <span className="italic font-extralight">For You</span>
          </motion.h1>
        </motion.div>

        {/* Garden entry */}
        <motion.div style={{ opacity: d_to, y: d_ty, zIndex: 20, ...GPU }} className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <p className="font-body text-[10px] tracking-[0.45em] font-light uppercase text-cream/40 mb-4">Into the garden</p>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-cream leading-tight drop-shadow-lg">
              Where Healing <span className="italic font-extralight">Grows</span>
            </h2>
          </div>
        </motion.div>

        {/* Gate text */}
        <motion.div style={{ opacity: g_to, y: g_ty, zIndex: 20, ...GPU }} className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-light text-cream leading-tight drop-shadow-lg">
              The Garden <span className="italic font-extralight">Awaits</span>
            </h2>
          </div>
        </motion.div>

        {/* Coming Soon overlay with waitlist */}
        <motion.div style={{ opacity: cs_to, y: cs_ty, zIndex: 21, ...GPU }} className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="max-w-lg w-full">
            <div className="w-16 h-[1px] bg-cream/20 mx-auto mb-8" />
            <p className="font-body text-[10px] tracking-[0.45em] font-light uppercase text-cream/50 mb-4">Coming Soon</p>
            <h2 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-cream leading-tight drop-shadow-lg mb-4">
              Something <span className="italic font-extralight">Beautiful</span>
            </h2>
            <p className="font-body text-cream/50 text-sm md:text-base mt-4 max-w-md mx-auto leading-relaxed tracking-wide">Our botanical wellness collection is being crafted with care.</p>

            {/* Waitlist signup */}
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 max-w-md mx-auto">
              <input
                id="waitlist-email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full sm:flex-1 bg-transparent border-b border-cream/25 border-t-0 border-l-0 border-r-0 rounded-none px-0 py-3 text-cream placeholder:text-cream/25 text-sm tracking-wider focus:outline-none focus:border-cream/60 transition-all duration-500 font-body"
              />
              <button
                onClick={handleSubmit}
                className="border-b border-cream/30 border-t-0 border-l-0 border-r-0 rounded-none bg-transparent text-cream/60 text-[10px] tracking-[0.3em] uppercase py-3 hover:text-cream hover:border-cream/60 transition-all duration-500 whitespace-nowrap font-body"
              >
                {submitted ? "You're on the list ✓" : "Join the Waitlist"}
              </button>
            </div>

            <div className="w-16 h-[1px] bg-cream/20 mx-auto mt-10" />
          </div>
        </motion.div>

        {/* Luminous exit */}
        <motion.div
          style={{ opacity: exitGlow, scale: exitScale, zIndex: 30, ...GPU }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 50%, hsl(40 33% 95%) 0%, hsl(40 33% 95% / 0.9) 25%, hsl(40 33% 95% / 0.5) 50%, hsl(150 30% 12% / 0.3) 80%)"
          }} />
        </motion.div>

        {/* Scroll hint */}
        <motion.div style={{ opacity: scrollHint, zIndex: 25 }} className="absolute bottom-12 left-1/2 -translate-x-1/2">
          <div className="flex flex-col items-center gap-3">
            <p className="font-body text-[10px] tracking-[0.3em] font-light uppercase text-cream/30">Scroll</p>
            <div className="w-[1px] h-10 bg-cream/15 relative overflow-hidden">
              <motion.div className="absolute top-0 left-0 w-full bg-cream/40" animate={{ height: ["0%", "100%"] }} transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }} />
            </div>
          </div>
        </motion.div>

        {/* Progress line */}
        <motion.div style={{ scaleX: p, opacity: progressOpacity, zIndex: 40 }} className="absolute top-0 left-0 right-0 h-[1px] origin-left">
          <div className="w-full h-full bg-gold/30" />
        </motion.div>
      </div>
    </section>
  );
};

export default ScrollJourney;
