import { useRef, useMemo } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import mountainsHero from "@/assets/mountains-hero.jpg";
import mountainToGarden from "@/assets/mountain-to-garden.jpg";
import gardenPathway from "@/assets/garden-pathway.jpg";
import gardenTunnel from "@/assets/garden-tunnel.jpg";
import gardenCloseup from "@/assets/garden-closeup.jpg";
import gardenGate from "@/assets/garden-gate.jpg";
import gateOpen from "@/assets/gate-open.jpg";

// Smooth spring config for buttery scroll
const SPRING_CONFIG = { stiffness: 100, damping: 30, restDelta: 0.001 };

// GPU-accelerated style helper
const gpuStyle = { willChange: "transform, opacity" as const, backfaceVisibility: "hidden" as const };

interface ChapterLayerProps {
  src: string;
  alt: string;
  scale: MotionValue<number>;
  opacity: MotionValue<number>;
  x?: MotionValue<number>;
  y?: MotionValue<number>;
  zIndex?: number;
  overlay?: "dark" | "bottom" | "top" | "subtle";
}

const ChapterLayer = ({ src, alt, scale, opacity, x, y, zIndex = 0, overlay = "dark" }: ChapterLayerProps) => {
  const overlayClasses = {
    dark: "bg-gradient-to-b from-foreground/25 via-foreground/5 to-foreground/40",
    bottom: "bg-gradient-to-b from-transparent via-transparent to-foreground/50",
    top: "bg-gradient-to-t from-foreground/30 via-transparent to-foreground/10",
    subtle: "bg-gradient-to-b from-foreground/10 via-transparent to-foreground/15",
  };

  return (
    <motion.div
      style={{ scale, opacity, x: x || 0, y: y || 0, ...gpuStyle, zIndex }}
      className="absolute inset-0 origin-center"
    >
      <img
        src={src}
        alt={alt}
        className="w-full h-full object-cover"
        width={1920}
        height={1080}
      />
      <div className={`absolute inset-0 ${overlayClasses[overlay]}`} />
    </motion.div>
  );
};

interface ChapterTextProps {
  opacity: MotionValue<number>;
  y: MotionValue<number>;
  subtitle: string;
  title: React.ReactNode;
  description?: string;
  position?: "center" | "bottom" | "left";
  zIndex?: number;
}

const ChapterText = ({ opacity, y, subtitle, title, description, position = "center", zIndex = 10 }: ChapterTextProps) => {
  const posClasses = {
    center: "flex items-center justify-center text-center",
    bottom: "flex items-end justify-center pb-28 text-center",
    left: "flex items-end justify-start p-10 md:p-20 text-left",
  };

  return (
    <motion.div
      style={{ opacity, y, ...gpuStyle, zIndex }}
      className={`absolute inset-0 ${posClasses[position]} px-6`}
    >
      <div>
        <p className="font-body text-xs md:text-sm tracking-[0.35em] uppercase text-cream/70 mb-4">
          {subtitle}
        </p>
        <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-cream leading-tight drop-shadow-lg">
          {title}
        </h2>
        {description && (
          <p className="font-body text-cream/60 mt-5 max-w-md text-base leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </motion.div>
  );
};

const chapters = [
  { label: "Mountains" },
  { label: "Descent" },
  { label: "Pathway" },
  { label: "Canopy" },
  { label: "Botanicals" },
  { label: "The Gate" },
  { label: "Beyond" },
];

const ScrollJourney = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: rawProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring-based scroll progress for buttery feel
  const scrollYProgress = useSpring(rawProgress, SPRING_CONFIG);

  // ─── Chapter 1: Mountains (0.00 → 0.18) ───
  const m_scale = useTransform(scrollYProgress, [0, 0.18], [1, 2.8]);
  const m_opacity = useTransform(scrollYProgress, [0.12, 0.2], [1, 0]);
  const m_textOpacity = useTransform(scrollYProgress, [0, 0.02, 0.08, 0.12], [0, 1, 1, 0]);
  const m_textY = useTransform(scrollYProgress, [0, 0.12], [0, -60]);

  // ─── Chapter 2: Aerial descent (0.14 → 0.32) ───
  const a_opacity = useTransform(scrollYProgress, [0.14, 0.2, 0.28, 0.34], [0, 1, 1, 0]);
  const a_scale = useTransform(scrollYProgress, [0.14, 0.32], [1.05, 2.2]);
  const a_y = useTransform(scrollYProgress, [0.14, 0.32], [0, -80]);
  const a_textOpacity = useTransform(scrollYProgress, [0.18, 0.22, 0.26, 0.3], [0, 1, 1, 0]);
  const a_textY = useTransform(scrollYProgress, [0.18, 0.3], [40, -20]);

  // ─── Chapter 3: Garden pathway (0.28 → 0.46) ───
  const p_opacity = useTransform(scrollYProgress, [0.28, 0.34, 0.42, 0.48], [0, 1, 1, 0]);
  const p_scale = useTransform(scrollYProgress, [0.28, 0.46], [1, 1.6]);
  const p_y = useTransform(scrollYProgress, [0.28, 0.46], [30, -120]);
  const p_textOpacity = useTransform(scrollYProgress, [0.33, 0.36, 0.4, 0.44], [0, 1, 1, 0]);
  const p_textY = useTransform(scrollYProgress, [0.33, 0.44], [30, -15]);

  // ─── Chapter 4: Garden tunnel (0.42 → 0.58) ───
  const t_opacity = useTransform(scrollYProgress, [0.42, 0.48, 0.54, 0.6], [0, 1, 1, 0]);
  const t_scale = useTransform(scrollYProgress, [0.42, 0.58], [1, 1.8]);
  const t_textOpacity = useTransform(scrollYProgress, [0.47, 0.5, 0.53, 0.57], [0, 1, 1, 0]);
  const t_textY = useTransform(scrollYProgress, [0.47, 0.57], [30, -15]);

  // ─── Chapter 5: Herb close-up (0.55 → 0.7) ───
  const c_opacity = useTransform(scrollYProgress, [0.55, 0.6, 0.66, 0.72], [0, 1, 1, 0]);
  const c_scale = useTransform(scrollYProgress, [0.55, 0.7], [1.05, 1.4]);
  const c_x = useTransform(scrollYProgress, [0.55, 0.7], [30, -30]);
  const c_textOpacity = useTransform(scrollYProgress, [0.59, 0.62, 0.65, 0.69], [0, 1, 1, 0]);
  const c_textY = useTransform(scrollYProgress, [0.59, 0.69], [30, -10]);

  // ─── Chapter 6: Gate closed (0.67 → 0.82) ───
  const g_opacity = useTransform(scrollYProgress, [0.67, 0.72, 0.78, 0.84], [0, 1, 1, 0]);
  const g_scale = useTransform(scrollYProgress, [0.67, 0.82], [1, 2]);
  const g_textOpacity = useTransform(scrollYProgress, [0.71, 0.74, 0.76, 0.79], [0, 1, 1, 0]);
  const g_textY = useTransform(scrollYProgress, [0.71, 0.79], [30, -10]);

  // ─── Chapter 7: Gate opens (0.79 → 0.95) ───
  const go_opacity = useTransform(scrollYProgress, [0.79, 0.84, 0.9, 0.97], [0, 1, 1, 0]);
  const go_scale = useTransform(scrollYProgress, [0.79, 0.95], [1, 2.2]);
  const whiteFlash = useTransform(scrollYProgress, [0.9, 1.0], [0, 1]);

  // Chapter progress indicator
  const activeChapter = useTransform(scrollYProgress, (v) => {
    if (v < 0.14) return 0;
    if (v < 0.28) return 1;
    if (v < 0.42) return 2;
    if (v < 0.55) return 3;
    if (v < 0.67) return 4;
    if (v < 0.79) return 5;
    return 6;
  });

  // Scroll indicator
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.04], [1, 0]);

  // Vignette intensity
  const vignetteOpacity = useTransform(scrollYProgress, [0, 0.05, 0.9, 1], [0.6, 0.4, 0.4, 0]);

  return (
    <section ref={containerRef} className="relative h-[1200vh]">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "hsl(var(--foreground))" }}>

        {/* Chapter 1: Mountains */}
        <ChapterLayer
          src={mountainsHero}
          alt="Lush green mountains where Florvia sources ingredients"
          scale={m_scale}
          opacity={m_opacity}
          overlay="dark"
          zIndex={1}
        />

        {/* Chapter 2: Aerial descent */}
        <ChapterLayer
          src={mountainToGarden}
          alt="Aerial view descending into botanical garden"
          scale={a_scale}
          opacity={a_opacity}
          y={a_y}
          overlay="subtle"
          zIndex={2}
        />

        {/* Chapter 3: Garden pathway */}
        <ChapterLayer
          src={gardenPathway}
          alt="Stone pathway through botanical garden"
          scale={p_scale}
          opacity={p_opacity}
          y={p_y}
          overlay="bottom"
          zIndex={3}
        />

        {/* Chapter 4: Garden tunnel */}
        <ChapterLayer
          src={gardenTunnel}
          alt="Vine archway corridor in the garden"
          scale={t_scale}
          opacity={t_opacity}
          overlay="subtle"
          zIndex={4}
        />

        {/* Chapter 5: Herb close-up */}
        <ChapterLayer
          src={gardenCloseup}
          alt="Close-up of lavender, chamomile, and herbs"
          scale={c_scale}
          opacity={c_opacity}
          x={c_x}
          overlay="dark"
          zIndex={5}
        />

        {/* Chapter 6: Gate (closed) */}
        <ChapterLayer
          src={gardenGate}
          alt="Ornate botanical garden gate"
          scale={g_scale}
          opacity={g_opacity}
          overlay="subtle"
          zIndex={6}
        />

        {/* Chapter 7: Gate opens */}
        <ChapterLayer
          src={gateOpen}
          alt="Garden gate opening to golden light"
          scale={go_scale}
          opacity={go_opacity}
          overlay="top"
          zIndex={7}
        />

        {/* ─── Text Layers ─── */}
        {/* Hero text */}
        <motion.div
          style={{ opacity: m_textOpacity, y: m_textY, ...gpuStyle, zIndex: 15 }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <p className="font-body text-xs md:text-sm tracking-[0.4em] uppercase text-cream/60 mb-5">
            Organic Health & Wellness
          </p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[6.5rem] font-bold text-cream leading-[1.05] drop-shadow-2xl">
            From Nature,
            <br />
            <span className="italic font-light">For You</span>
          </h1>
          <p className="font-body text-cream/50 mt-8 text-base md:text-lg max-w-lg tracking-wide">
            Scroll to begin your journey through our botanical garden
          </p>
        </motion.div>

        <ChapterText
          opacity={a_textOpacity} y={a_textY}
          subtitle="Descending into"
          title={<>The <span className="italic font-light">Garden</span></>}
        />

        <ChapterText
          opacity={p_textOpacity} y={p_textY}
          subtitle="Walk with us"
          title={<>Every Step, <span className="italic font-light">Intentional</span></>}
          position="bottom"
        />

        <ChapterText
          opacity={t_textOpacity} y={t_textY}
          subtitle="Nature's corridor"
          title={<>Where Healing <span className="italic font-light">Grows</span></>}
        />

        <ChapterText
          opacity={c_textOpacity} y={c_textY}
          subtitle="Hand-picked ingredients"
          title={<>Pure <span className="italic font-light">Botanicals</span></>}
          description="Lavender, chamomile, rosemary — each selected for its healing power"
          position="left"
        />

        <ChapterText
          opacity={g_textOpacity} y={g_textY}
          subtitle="You've arrived"
          title={<>The Gate to <span className="italic font-light">Wellness</span></>}
        />

        {/* Cinematic vignette */}
        <motion.div
          style={{ opacity: vignetteOpacity, zIndex: 20 }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden="true"
        >
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(0,0,0,0.5) 100%)"
          }} />
        </motion.div>

        {/* White flash to products */}
        <motion.div
          style={{ opacity: whiteFlash, zIndex: 30 }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0 bg-background" />
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity, zIndex: 25 }}
          className="absolute bottom-12 left-1/2 -translate-x-1/2"
        >
          <div className="flex flex-col items-center gap-4">
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/40">
              Scroll to explore
            </p>
            <div className="w-[1px] h-12 bg-cream/20 relative overflow-hidden">
              <motion.div
                className="absolute top-0 left-0 w-full bg-cream/60"
                animate={{ height: ["0%", "100%"], top: ["0%", "0%"] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* Chapter dots - right side */}
        <div className="absolute right-6 top-1/2 -translate-y-1/2 z-25 hidden md:flex flex-col gap-4" style={{ zIndex: 25 }}>
          {chapters.map((ch, i) => (
            <ChapterDot key={ch.label} index={i} label={ch.label} activeChapter={activeChapter} />
          ))}
        </div>

        {/* Progress bar */}
        <motion.div
          style={{ scaleX: scrollYProgress, zIndex: 40 }}
          className="absolute top-0 left-0 right-0 h-[1px] origin-left"
        >
          <div className="w-full h-full" style={{ background: "linear-gradient(90deg, hsl(var(--gold)), hsl(var(--gold-light)))" }} />
        </motion.div>
      </div>
    </section>
  );
};

const ChapterDot = ({ index, label, activeChapter }: { index: number; label: string; activeChapter: MotionValue<number> }) => {
  const opacity = useTransform(activeChapter, (v) => v === index ? 1 : 0.3);
  const scale = useTransform(activeChapter, (v) => v === index ? 1.5 : 1);

  return (
    <div className="flex items-center gap-3 group relative">
      <motion.div
        style={{ opacity, scale, ...gpuStyle }}
        className="w-1.5 h-1.5 rounded-full bg-cream"
      />
      <motion.span
        style={{ opacity }}
        className="absolute right-5 font-body text-[10px] tracking-[0.15em] uppercase text-cream whitespace-nowrap"
      >
        {label}
      </motion.span>
    </div>
  );
};

export default ScrollJourney;
