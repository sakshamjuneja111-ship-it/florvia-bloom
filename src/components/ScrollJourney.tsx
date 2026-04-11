import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import mountainsHero from "@/assets/mountains-hero.jpg";
import mountainToGarden from "@/assets/mountain-to-garden.jpg";
import gardenPathway from "@/assets/garden-pathway.jpg";
import gardenGate from "@/assets/garden-gate.jpg";

/* ─── Heavy cinematic spring ─── */
const SPRING = { stiffness: 18, damping: 50, restDelta: 0.0003 };

const GPU: React.CSSProperties = {
  willChange: "transform, opacity",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  transform: "translateZ(0)",
};

const HEADING_SHADOW = "0 0 120px rgba(0,0,0,0.95), 0 4px 60px rgba(0,0,0,0.85), 0 2px 12px rgba(0,0,0,1)";
const BODY_SHADOW = "0 0 30px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,1)";

const GOLD_COLORS = [
  (a: number) => `rgba(212,175,55,${a})`,
  (a: number) => `rgba(255,235,180,${a})`,
  (a: number) => `rgba(200,220,150,${a})`,
  (a: number) => `rgba(255,255,255,${a})`,
];
const GOLD_ALPHA_RANGES = [
  [0.4, 0.8],
  [0.3, 0.6],
  [0.2, 0.5],
  [0.15, 0.4],
];

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

/* ─── Dark overlay panel behind text ─── */
const TextBackdrop = () => (
  <div
    className="absolute w-[700px] h-[500px] md:w-[700px] md:h-[500px] max-md:w-full max-md:h-[400px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    style={{
      background: "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 70%)",
      zIndex: -1,
    }}
  />
);

/* ─── Foreground foliage parallax ─── */
const FoliageLayer = ({ scrollProgress }: { scrollProgress: MotionValue<number> }) => {
  const leftY = useTransform(scrollProgress, [0, 1], [0, -600]);
  const rightY = useTransform(scrollProgress, [0, 1], [0, -500]);
  const foliageOpacity = useTransform(scrollProgress, [0, 0.15, 0.5, 0.7], [0.6, 0.8, 0.5, 0]);

  return (
    <>
      <motion.div
        style={{ y: leftY, opacity: foliageOpacity, zIndex: 11, ...GPU }}
        className="absolute left-0 top-[20%] pointer-events-none"
      >
        <svg width="120" height="300" viewBox="0 0 120 300" fill="none" opacity="0.4">
          <path d="M80 0 Q20 80 60 160 Q30 200 50 280 Q70 220 90 160 Q120 80 80 0Z" fill="hsl(var(--forest))" />
          <path d="M40 40 Q10 120 30 200 Q50 140 40 40Z" fill="hsl(var(--forest-light))" opacity="0.5" />
        </svg>
      </motion.div>
      <motion.div
        style={{ y: rightY, opacity: foliageOpacity, zIndex: 11, ...GPU }}
        className="absolute right-0 top-[30%] pointer-events-none"
      >
        <svg width="100" height="260" viewBox="0 0 100 260" fill="none" opacity="0.35">
          <path d="M20 0 Q80 60 40 140 Q70 180 50 260 Q30 200 10 140 Q-20 60 20 0Z" fill="hsl(var(--forest))" />
        </svg>
      </motion.div>
    </>
  );
};

/* ─── Morphing F monogram ─── */
const MorphingMonogram = ({ progress }: { progress: MotionValue<number> }) => {
  const morph = useTransform(progress, [0.75, 0.85], [0, 1]);
  const morphOpacity = useTransform(progress, [0.60, 0.68], [0, 0.45]);

  return (
    <motion.svg
      width="80" height="80" viewBox="0 0 100 100"
      style={{ opacity: morphOpacity }}
      className="mx-auto mb-6"
    >
      <motion.path
        style={{ pathLength: morph }}
        d="M30 85 L30 25 Q30 15 40 15 L70 15 M30 48 L58 48"
        fill="none"
        stroke="hsl(var(--gold))"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      <motion.path
        style={{ pathLength: morph }}
        d="M62 15 Q72 8 75 18 Q68 14 62 15Z"
        fill="none"
        stroke="hsl(var(--gold))"
        strokeWidth="0.6"
      />
      <motion.path
        style={{ pathLength: morph }}
        d="M52 48 Q62 38 68 45 Q58 42 52 48Z"
        fill="none"
        stroke="hsl(var(--gold))"
        strokeWidth="0.6"
      />
    </motion.svg>
  );
};

/* ─── Progressive word reveal ─── */
const ProgressiveHeading = ({
  words,
  className,
  style,
  triggerProgress,
  scrollProgress,
}: {
  words: string[];
  className?: string;
  style?: React.CSSProperties;
  triggerProgress: [number, number];
  scrollProgress: MotionValue<number>;
}) => {
  const [revealed, setRevealed] = useState<boolean[]>(words.map(() => false));

  useEffect(() => {
    const unsub = scrollProgress.on("change", (v) => {
      const [start, end] = triggerProgress;
      const range = end - start;
      const newRevealed = words.map((_, i) => {
        const wordTrigger = start + (range * i) / words.length;
        return v >= wordTrigger;
      });
      setRevealed(newRevealed);
    });
    return unsub;
  }, [scrollProgress, triggerProgress, words.length]);

  return (
    <span className={className} style={style}>
      {words.map((word, i) => (
        <motion.span
          key={i}
          initial={{ opacity: 0 }}
          animate={revealed[i] ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{
            display: "inline-block",
            marginRight: "0.3em",
            textShadow: revealed[i]
              ? `${HEADING_SHADOW}, 0 0 40px hsl(var(--gold) / 0.3)`
              : HEADING_SHADOW,
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

/* ─── FIX 8: Word-by-word glint heading for Something Beautiful ─── */
const GlintWord = ({
  word,
  delay,
  color,
  isVisible,
  style,
  className,
}: {
  word: string;
  delay: number;
  color: string;
  isVisible: boolean;
  style?: React.CSSProperties;
  className?: string;
}) => {
  const ref = useRef<HTMLSpanElement>(null);
  const [hasGlinted, setHasGlinted] = useState(false);

  useEffect(() => {
    if (isVisible && !hasGlinted && ref.current) {
      setHasGlinted(true);
      const el = ref.current;
      gsap.fromTo(
        el,
        { opacity: 0, y: 20 },
        { opacity: 1, y: 0, duration: 0.7, ease: "power3.out", delay }
      );
      // Glint: color sweep cream → gold → original
      gsap.to(el, {
        keyframes: [
          { color: "hsl(var(--gold))", duration: 0.15 },
          { color, duration: 0.25 },
        ],
        delay: delay + 0.1,
        ease: "power2.inOut",
      });
    }
  }, [isVisible, hasGlinted, delay, color]);

  useEffect(() => {
    if (!isVisible) setHasGlinted(false);
  }, [isVisible]);

  return (
    <span
      ref={ref}
      className={className}
      style={{
        ...style,
        opacity: 0,
        display: "inline-block",
        color,
        textShadow: HEADING_SHADOW,
      }}
    >
      {word}
    </span>
  );
};

/* ═══════════════════════════════════════════
   SCROLL JOURNEY — 4 cinematic beats
   ═══════════════════════════════════════════ */

const ScrollJourney = () => {
  const ref = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const waitlistBtnRef = useRef<HTMLButtonElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(raw, SPRING);

  /* ─── FIX 1: Organic pollen particles ─── */
  useEffect(() => {
    const container = stickyRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];
    const tweens: gsap.core.Tween[] = [];
    const timelines: gsap.core.Timeline[] = [];

    const rnd = (min: number, max: number) => Math.random() * (max - min) + min;

    for (let i = 0; i < 60; i++) {
      const el = document.createElement("div");
      const colorIdx = Math.floor(Math.random() * 4);
      const alpha = rnd(GOLD_ALPHA_RANGES[colorIdx][0], GOLD_ALPHA_RANGES[colorIdx][1]);
      const size = rnd(2, 5);
      const isOblong = Math.random() < 0.3;
      const w = size;
      const h = isOblong ? size * 1.6 : size;

      Object.assign(el.style, {
        position: "absolute",
        pointerEvents: "none",
        zIndex: "16",
        borderRadius: isOblong ? "40%" : "50%",
        willChange: "transform, opacity",
        width: `${w}px`,
        height: `${h}px`,
        background: GOLD_COLORS[colorIdx](alpha),
        left: `${rnd(0, 100)}%`,
        top: `${rnd(20, 100)}%`,
      });

      container.appendChild(el);
      particles.push(el);

      // Drift animation
      const tl = gsap.timeline({ repeat: -1 });
      const buildDrift = () => {
        const curX = parseFloat(el.style.left);
        const curY = parseFloat(el.style.top);
        const x1 = curX + rnd(-18, 18); // percentage-based drift
        const y1 = Math.max(-5, curY - rnd(12, 40));
        const d1 = rnd(8, 22);
        const x2 = x1 + rnd(-12, 12);
        const y2 = Math.max(-5, y1 - rnd(8, 20));
        const d2 = rnd(5, 14);

        tl.to(el, { left: `${x1}%`, top: `${y1}%`, duration: d1, ease: "none" });
        tl.to(el, { left: `${x2}%`, top: `${y2}%`, duration: d2, ease: "none" });
        tl.set(el, { left: `${rnd(0, 100)}%`, top: `${rnd(95, 105)}%` });
      };
      buildDrift();
      timelines.push(tl);

      // Breathing opacity
      const breathe = gsap.to(el, {
        opacity: alpha * 0.5,
        duration: rnd(3, 8),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      tweens.push(breathe);

      // Rotation
      const rot = gsap.to(el, {
        rotation: 360,
        duration: rnd(10, 30),
        repeat: -1,
        ease: "none",
      });
      tweens.push(rot);
    }

    return () => {
      timelines.forEach((t) => t.kill());
      tweens.forEach((t) => t.kill());
      particles.forEach((el) => el.remove());
    };
  }, []);

  /* ─── Cinematic page entrance ─── */
  useEffect(() => {
    const curtain = curtainRef.current;
    const hero = heroRef.current;
    if (!curtain || !hero) return;

    const eyebrow = hero.querySelector(".hero-eyebrow");
    const line = hero.querySelector(".hero-line");
    const line1 = hero.querySelector(".hero-line1");
    const line2 = hero.querySelector(".hero-line2");
    const body = hero.querySelector(".hero-body");
    const scrollInd = document.querySelector(".scroll-hint-el");

    gsap.set([eyebrow, line, line1, line2, body, scrollInd].filter(Boolean), { opacity: 0, y: 20 });
    if (line) gsap.set(line, { scaleX: 0, transformOrigin: "left center" });

    const tl = gsap.timeline();
    tl.to(curtain, { opacity: 0, duration: 1.8, ease: "power2.inOut", delay: 0.2, onComplete: () => { curtain.style.display = "none"; } });
    tl.set(curtain, { pointerEvents: "none" }, 0.2);
    tl.to(eyebrow, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 1.4);
    tl.to(line, { scaleX: 1, opacity: 1, duration: 0.5, ease: "power3.out" }, 1.7);
    tl.to(line1, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 1.9);
    tl.to(line2, { opacity: 1, y: 0, duration: 0.9, ease: "power3.out" }, 2.2);
    tl.to(body, { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" }, 2.7);
    if (scrollInd) tl.to(scrollInd, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, 3.0);

    return () => { tl.kill(); };
  }, []);

  /* ─── FIX 4: Magnetic pull for waitlist button ─── */
  useEffect(() => {
    const btn = waitlistBtnRef.current;
    if (!btn) return;

    const onMove = (e: MouseEvent) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 60) {
        const strength = (60 - dist) / 60;
        gsap.to(btn, {
          x: dx * strength * (8 / 60),
          y: dy * strength * (5 / 60),
          duration: 0.4,
          ease: "power2.out",
        });
      } else {
        gsap.to(btn, {
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "elastic.out(1, 0.4)",
        });
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ─── Redistributed scroll timings at 800vh ─── */

  // Beat 1: Mountains
  const m_s = useTransform(p, [0, 0.30], [1, 1.15]);
  const m_o = useTransform(p, [0, 0.22, 0.30], [1, 1, 0]);
  const m_to = useTransform(p, [0, 0.02, 0.15, 0.20], [0, 1, 1, 0]);
  const m_ty = useTransform(p, [0.02, 0.20], [0, -30]);

  // Beat 2: Garden descent
  const d_o = useTransform(p, [0.20, 0.26, 0.44, 0.52], [0, 1, 1, 0]);
  const d_s = useTransform(p, [0.20, 0.52], [1, 1.12]);
  const d_y = useTransform(p, [0.20, 0.52], [0, -30]);
  const d_to = useTransform(p, [0.24, 0.28, 0.38, 0.42], [0, 1, 1, 0]);
  const d_ty = useTransform(p, [0.24, 0.42], [20, -8]);

  // Beat 3: Pathway bridge
  const pw_o = useTransform(p, [0.42, 0.48, 0.52, 0.56], [0, 0.7, 1, 0]);
  const pw_s = useTransform(p, [0.42, 0.56], [1, 1.1]);
  const pw_y = useTransform(p, [0.42, 0.56], [8, -20]);

  // Gate Awaits text
  const ga_to = useTransform(p, [0.50, 0.54, 0.60, 0.64], [0, 1, 1, 0]);
  const ga_ty = useTransform(p, [0.50, 0.64], [20, -8]);

  // Beat 4: Gate
  const g_o = useTransform(p, [0.50, 0.58], [0, 1]);
  const g_s = useTransform(p, [0.50, 1.0], [1, 1.06]);

  // Coming Soon waitlist
  const cs_to = useTransform(p, [0.66, 0.74, 0.94, 1.0], [0, 1, 1, 0.5]);
  const cs_ty = useTransform(p, [0.66, 0.74], [15, 0]);

  // Track visibility for glint heading
  const [somethingVisible, setSomethingVisible] = useState(false);
  useEffect(() => {
    const unsub = p.on("change", (v) => {
      setSomethingVisible(v >= 0.68 && v <= 0.94);
    });
    return unsub;
  }, [p]);

  // Exit bloom
  const exitGlow = useTransform(p, [0.94, 1.0], [0, 0.7]);
  const exitScale = useTransform(p, [0.94, 1.0], [1, 1.05]);

  // Scroll hint
  const scrollHint = useTransform(p, [0, 0.03], [1, 0]);

  // Atmospheric haze
  const hazeOpacity = useTransform(p, [0, 0.15, 0.5, 0.85, 1.0], [0.06, 0.12, 0.18, 0.12, 0.25]);

  // Vignette always >= 0.4
  const vig = useTransform(p, [0, 0.5, 0.58, 1.0], [0.4, 0.4, 0.6, 0.6]);

  // Color grading
  const colorGrade = useTransform(p, [0, 0.25, 0.45, 0.58, 1.0], [
    "rgba(20,35,25,0.08)",
    "rgba(15,30,20,0.10)",
    "rgba(25,30,15,0.08)",
    "rgba(40,30,10,0.12)",
    "rgba(40,30,10,0.12)",
  ]);

  // Light ray on gate
  const lightRayO = useTransform(p, [0.55, 0.65, 0.95, 1.0], [0, 1, 1, 0.85]);

  // Progress line
  const progressOpacity = useTransform(p, [0, 0.05, 0.90, 0.94], [0, 0.6, 0.6, 0]);

  const handleSubmit = () => {
    const input = document.querySelector<HTMLInputElement>('#waitlist-email');
    if (input && input.value && input.validity.valid) {
      setSubmitted(true);
      input.value = '';
    }
  };

  return (
    <section ref={ref} className="relative h-[800vh]">
      <div ref={stickyRef} className="sticky top-0 h-screen overflow-hidden" style={{ background: "hsl(var(--foreground))" }}>

        {/* Curtain */}
        <div ref={curtainRef} className="absolute inset-0 bg-black" style={{ zIndex: 200 }} />

        {/* Image Layers */}
        <div className="absolute inset-0">
          <Layer src={mountainsHero} alt="Emerald mountains at golden hour" scale={m_s} opacity={m_o} z={1} />
          <Layer src={mountainToGarden} alt="Descending into botanical garden" scale={d_s} opacity={d_o} y={d_y} z={2} />
          <Layer src={gardenPathway} alt="Garden pathway approaching gate" scale={pw_s} opacity={pw_o} y={pw_y} z={3} />
          <Layer src={gardenGate} alt="Ornate closed garden gate" scale={g_s} opacity={g_o} z={4} />
        </div>

        {/* Foreground foliage parallax */}
        <FoliageLayer scrollProgress={p} />

        {/* Light rays on gate */}
        <motion.div
          style={{ opacity: lightRayO, zIndex: 12, ...GPU }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,235,150,0.22) 0%, transparent 65%)"
          }} />
        </motion.div>

        {/* Vignette */}
        <motion.div style={{ opacity: vig, zIndex: 15 }} className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(8,12,8,0.75) 100%)"
          }} />
        </motion.div>

        {/* Color grading */}
        <motion.div
          style={{ backgroundColor: colorGrade, zIndex: 16, mixBlendMode: "color", ...GPU }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        />

        {/* Atmospheric haze */}
        <motion.div style={{ opacity: hazeOpacity, zIndex: 18, ...GPU }} className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 40%, rgba(200,180,140,0.3) 0%, rgba(180,160,120,0.08) 40%, transparent 70%)"
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 30% 70%, rgba(120,160,100,0.12) 0%, transparent 50%)"
          }} />
        </motion.div>

        {/* Depth fog */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 17 }} aria-hidden>
          <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{
            background: "linear-gradient(to top, rgba(20,35,20,0.2) 0%, transparent 100%)"
          }} />
        </div>

        {/* ══════ TEXT BEATS ══════ */}

        {/* ─── BEAT 1: Hero ─── */}
        <motion.div
          ref={heroRef}
          style={{ opacity: m_to, y: m_ty, zIndex: 20, ...GPU }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6"
        >
          <div className="relative">
            <TextBackdrop />
            <p
              className="hero-eyebrow font-body text-[11px] max-md:text-[9px] tracking-[0.6em] max-md:tracking-[0.4em] font-light uppercase mb-5"
              style={{ color: "hsl(var(--gold))", textShadow: BODY_SHADOW }}
            >
              Organic Health &amp; Wellness
            </p>
            <div className="hero-line w-12 h-[1px] mx-auto mb-8" style={{ background: "hsl(var(--gold) / 0.7)" }} />
            <h1
              className="hero-line1 font-display font-extralight leading-[0.92] max-md:leading-[0.92]"
              style={{
                fontSize: "clamp(72px, 12vw, 160px)",
                color: "hsl(var(--cream))",
                textShadow: HEADING_SHADOW,
                letterSpacing: "-0.02em",
              }}
            >
              From Nature,
            </h1>
            <h1
              className="hero-line2 font-display italic font-extralight leading-[0.92]"
              style={{
                fontSize: "clamp(72px, 12vw, 160px)",
                color: "hsl(var(--gold))",
                textShadow: HEADING_SHADOW,
                letterSpacing: "-0.02em",
              }}
            >
              For You
            </h1>
            <p
              className="hero-body font-body font-light text-[14px] max-md:text-[13px] leading-[1.8] mt-6"
              style={{ color: "hsl(var(--cream) / 0.9)", textShadow: BODY_SHADOW }}
            >
              Pure botanical wellness. Grown with intention.
            </p>
          </div>
        </motion.div>

        {/* ─── BEAT 2: Garden entry ─── */}
        <motion.div style={{ opacity: d_to, y: d_ty, zIndex: 20, ...GPU }} className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="relative">
            <TextBackdrop />
            <p
              className="font-body text-[11px] max-md:text-[9px] tracking-[0.55em] max-md:tracking-[0.4em] font-light uppercase mb-4"
              style={{ color: "hsl(var(--gold))", textShadow: BODY_SHADOW }}
            >
              Into the garden
            </p>
            <ProgressiveHeading
              words={["Where", "Healing"]}
              className="font-display font-extralight leading-[0.95] block"
              style={{
                fontSize: "clamp(64px, 10vw, 130px)",
                color: "hsl(var(--cream))",
                textShadow: HEADING_SHADOW,
                letterSpacing: "-0.02em",
              }}
              triggerProgress={[0.25, 0.32]}
              scrollProgress={p}
            />
            <ProgressiveHeading
              words={["Grows"]}
              className="font-display italic font-extralight leading-[0.95] block"
              style={{
                fontSize: "clamp(64px, 10vw, 130px)",
                color: "hsl(var(--gold))",
                textShadow: HEADING_SHADOW,
                letterSpacing: "-0.02em",
              }}
              triggerProgress={[0.30, 0.34]}
              scrollProgress={p}
            />
            <div className="w-12 h-[1px] mx-auto mt-6" style={{ background: "hsl(var(--gold) / 0.65)" }} />
          </div>
        </motion.div>

        {/* ─── BEAT 3: The Garden Awaits ─── */}
        <motion.div style={{ opacity: ga_to, y: ga_ty, zIndex: 20, ...GPU }} className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="relative">
            <ProgressiveHeading
              words={["The", "Garden"]}
              className="font-display font-extralight leading-[0.95] block"
              style={{
                fontSize: "clamp(60px, 9vw, 120px)",
                color: "hsl(var(--cream))",
                textShadow: HEADING_SHADOW,
                letterSpacing: "-0.02em",
              }}
              triggerProgress={[0.51, 0.56]}
              scrollProgress={p}
            />
            <ProgressiveHeading
              words={["Awaits"]}
              className="font-display italic font-extralight leading-[0.95] block"
              style={{
                fontSize: "clamp(60px, 9vw, 120px)",
                color: "hsl(var(--gold))",
                textShadow: HEADING_SHADOW,
                letterSpacing: "-0.02em",
              }}
              triggerProgress={[0.55, 0.58]}
              scrollProgress={p}
            />
            <p
              className="font-body text-[11px] max-md:text-[9px] tracking-[0.5em] max-md:tracking-[0.4em] font-light uppercase mt-6"
              style={{ color: "hsl(var(--gold))", textShadow: BODY_SHADOW }}
            >
              Scroll to enter
            </p>
          </div>
        </motion.div>

        {/* ─── BEAT 4: Coming Soon + Waitlist ─── */}
        <motion.div style={{ opacity: cs_to, y: cs_ty, zIndex: 21, ...GPU }} className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="max-w-xl w-full">
            {/* Morphing monogram */}
            <MorphingMonogram progress={p} />

            {/* FIX 7: Divider line visible */}
            <div className="w-16 h-[1px] mx-auto mb-8" style={{ background: "hsl(var(--gold) / 0.65)" }} />

            {/* FIX 5: Coming Soon eyebrow */}
            <p
              className="font-body text-[11px] max-md:text-[9px] tracking-[0.65em] max-md:tracking-[0.4em] font-light uppercase mb-5"
              style={{
                color: "hsl(var(--gold))",
                textShadow: "0 0 40px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,1)",
              }}
            >
              Coming Soon
            </p>

            {/* FIX 8: Glint word reveal for Something Beautiful */}
            <div
              className="font-display font-extralight leading-[0.90]"
              style={{
                fontSize: "clamp(80px, 11vw, 150px)",
                letterSpacing: "-0.02em",
              }}
            >
              <GlintWord
                word="Something"
                delay={0}
                color="hsl(var(--cream))"
                isVisible={somethingVisible}
                className="block"
              />
              <GlintWord
                word="Beautiful"
                delay={0.3}
                color="hsl(var(--gold))"
                isVisible={somethingVisible}
                className="block italic"
                style={{ marginBottom: "16px" }}
              />
            </div>

            {/* FIX 6: Body text */}
            <p
              className="font-body text-[15px] max-md:text-[13px] font-light tracking-[0.05em] leading-[1.8] max-w-[420px] mx-auto mb-8"
              style={{
                color: "hsl(var(--cream) / 0.88)",
                textShadow: "0 0 30px rgba(0,0,0,0.85), 0 2px 6px rgba(0,0,0,0.95)",
              }}
            >
              Our botanical wellness collection is being crafted with care.
            </p>

            {/* FIX 2 + FIX 3: Waitlist signup */}
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.35, ease: "easeIn" } }}
                  className="mt-2 flex flex-row max-md:flex-col items-center justify-center gap-5 max-md:gap-4 max-w-md mx-auto"
                >
                  {/* FIX 3: Email input */}
                  <input
                    id="waitlist-email"
                    type="email"
                    required
                    placeholder="your@email.com"
                    className="font-body font-light text-[14px] tracking-[0.08em] text-center transition-all duration-300 ease-out focus:outline-none w-[280px] max-md:w-full"
                    style={{
                      color: "hsl(var(--cream) / 0.95)",
                      background: "rgba(255,255,255,0.06)",
                      border: "none",
                      borderBottom: "1px solid hsl(var(--gold) / 0.5)",
                      borderRadius: 0,
                      padding: "12px 16px",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderBottom = "2px solid hsl(var(--gold))";
                      e.target.style.background = "rgba(255,255,255,0.09)";
                      e.target.style.boxShadow = "0 4px 20px rgba(212,175,55,0.18)";
                    }}
                    onBlur={(e) => {
                      e.target.style.borderBottom = "1px solid hsl(var(--gold) / 0.5)";
                      e.target.style.background = "rgba(255,255,255,0.06)";
                      e.target.style.boxShadow = "none";
                    }}
                  />

                  {/* FIX 2: Luxury outline button */}
                  <button
                    ref={waitlistBtnRef}
                    onClick={handleSubmit}
                    data-cursor="expand"
                    className="font-body font-light text-[10px] tracking-[0.4em] uppercase whitespace-nowrap transition-all duration-300 max-md:w-full"
                    style={{
                      color: "hsl(var(--gold) / 0.9)",
                      background: "transparent",
                      border: "1px solid hsl(var(--gold) / 0.7)",
                      borderRadius: "2px",
                      padding: "16px 44px",
                      letterSpacing: "0.4em",
                    }}
                    onMouseEnter={(e) => {
                      const t = e.currentTarget;
                      t.style.borderColor = "hsl(var(--gold))";
                      t.style.background = "rgba(212,175,55,0.08)";
                      t.style.letterSpacing = "0.46em";
                      t.style.transform = "translateY(-2px)";
                      t.style.boxShadow = "0 0 30px rgba(212,175,55,0.15), 0 4px 20px rgba(212,175,55,0.10)";
                      t.style.transition = "all 400ms ease-out";
                    }}
                    onMouseLeave={(e) => {
                      const t = e.currentTarget;
                      t.style.borderColor = "hsl(var(--gold) / 0.7)";
                      t.style.background = "transparent";
                      t.style.letterSpacing = "0.4em";
                      t.style.transform = "translateY(0)";
                      t.style.boxShadow = "none";
                      t.style.transition = "all 500ms cubic-bezier(0.34, 1.56, 0.64, 1)";
                    }}
                  >
                    Join the Waitlist
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.94 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="mt-10"
                >
                  <p
                    className="font-display italic font-light text-[32px] max-md:text-[24px]"
                    style={{ color: "hsl(var(--cream))", textShadow: HEADING_SHADOW }}
                  >
                    You are part of something beautiful.
                  </p>
                  <p
                    className="font-body font-light text-[11px] tracking-[0.4em] uppercase mt-4"
                    style={{ color: "hsl(var(--gold))" }}
                  >
                    We will be in touch
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* FIX 7: Divider line visible */}
            <div className="w-16 h-[1px] mx-auto mt-10" style={{ background: "hsl(var(--gold) / 0.65)" }} />
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
        <motion.div style={{ opacity: scrollHint, zIndex: 25 }} className="absolute bottom-12 left-1/2 -translate-x-1/2 scroll-hint-el">
          <div className="flex flex-col items-center gap-3">
            <p className="font-body text-[10px] max-md:text-[9px] tracking-[0.3em] font-light uppercase" style={{ color: "hsl(var(--gold))", textShadow: BODY_SHADOW }}>
              Scroll
            </p>
            <div className="w-[1px] h-10 relative overflow-hidden" style={{ background: "hsl(var(--cream) / 0.15)" }}>
              <motion.div
                className="absolute top-0 left-0 w-full"
                style={{ background: "hsl(var(--cream) / 0.4)" }}
                animate={{ height: ["0%", "100%"] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </div>
        </motion.div>

        {/* FIX 9: Progress line at bottom */}
        <motion.div
          style={{ scaleX: p, opacity: progressOpacity, zIndex: 60 }}
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
        >
          <div className="w-full h-full" style={{
            background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.55) 50%, transparent 100%)"
          }} />
        </motion.div>
      </div>
    </section>
  );
};

export default ScrollJourney;
