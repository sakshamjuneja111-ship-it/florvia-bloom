import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import mountainsHero from "@/assets/mountains-hero.jpg";
import mountainToGarden from "@/assets/mountain-to-garden.jpg";
import gardenPathway from "@/assets/garden-pathway.jpg";
import gardenGate from "@/assets/garden-gate.jpg";

/* ─── FIX 9: Heavy cinematic spring ─── */
const SPRING = { stiffness: 18, damping: 50, restDelta: 0.0003 };

const GPU: React.CSSProperties = {
  willChange: "transform, opacity",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  transform: "translateZ(0)",
};

/* ─── FIX 1: Shared text shadow styles ─── */
const HEADING_SHADOW = "0 0 120px rgba(0,0,0,0.95), 0 4px 60px rgba(0,0,0,0.85), 0 2px 12px rgba(0,0,0,1)";
const BODY_SHADOW = "0 0 30px rgba(0,0,0,0.9), 0 2px 8px rgba(0,0,0,1)";

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

/* ─── FIX 6: Dark overlay panel behind text ─── */
const TextBackdrop = () => (
  <div
    className="absolute w-[700px] h-[500px] md:w-[700px] md:h-[500px] max-md:w-full max-md:h-[400px] left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
    style={{
      background: "radial-gradient(ellipse at center, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 70%)",
      zIndex: -1,
    }}
  />
);

/* ═══════════════════════════════════════════
   SCROLL JOURNEY — 4 cinematic beats
   ═══════════════════════════════════════════ */

const ScrollJourney = () => {
  const ref = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const [submitted, setSubmitted] = useState(false);

  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(raw, SPRING);

  /* ─── FIX 8: Cinematic page entrance ─── */
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

    // Set initial states
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

  /* ─── FIX 7: Redistributed scroll timings at 800vh ─── */

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
  const g_o = useTransform(p, [0.50, 0.58], [0, 1]); // stays 1 to end
  const g_s = useTransform(p, [0.50, 1.0], [1, 1.06]);

  // Coming Soon waitlist
  const cs_to = useTransform(p, [0.66, 0.74, 0.94, 1.0], [0, 1, 1, 0.5]);
  const cs_ty = useTransform(p, [0.66, 0.74], [15, 0]);

  // Exit bloom
  const exitGlow = useTransform(p, [0.94, 1.0], [0, 0.7]);
  const exitScale = useTransform(p, [0.94, 1.0], [1, 1.05]);

  // Scroll hint
  const scrollHint = useTransform(p, [0, 0.03], [1, 0]);

  // Atmospheric haze
  const hazeOpacity = useTransform(p, [0, 0.15, 0.5, 0.85, 1.0], [0.06, 0.12, 0.18, 0.12, 0.25]);

  // FIX 10: Vignette always >= 0.4
  const vig = useTransform(p, [0, 0.5, 0.58, 1.0], [0.4, 0.4, 0.6, 0.6]);

  // FIX 10: Color grading
  const colorGrade = useTransform(p, [0, 0.25, 0.45, 0.58, 1.0], [
    "rgba(20,35,25,0.08)",
    "rgba(15,30,20,0.10)",
    "rgba(25,30,15,0.08)",
    "rgba(40,30,10,0.12)",
    "rgba(40,30,10,0.12)",
  ]);

  // FIX 11: Light ray on gate
  const lightRayO = useTransform(p, [0.55, 0.65, 0.95, 1.0], [0, 1, 1, 0.85]);

  // FIX 13: Progress line
  const progressOpacity = useTransform(p, [0, 0.05, 0.90, 0.94], [0, 0.6, 0.6, 0]);

  const handleSubmit = () => {
    const input = document.querySelector<HTMLInputElement>('#waitlist-email');
    if (input && input.value && input.validity.valid) {
      setSubmitted(true);
      input.value = '';
    }
  };

  return (
    /* FIX 7: 800vh */
    <section ref={ref} className="relative h-[800vh]">
      <div className="sticky top-0 h-screen overflow-hidden" style={{ background: "hsl(var(--foreground))" }}>

        {/* FIX 8: Curtain */}
        <div ref={curtainRef} className="absolute inset-0 bg-black" style={{ zIndex: 200 }} />

        {/* Image Layers */}
        <div className="absolute inset-0">
          <Layer src={mountainsHero} alt="Emerald mountains at golden hour" scale={m_s} opacity={m_o} z={1} />
          <Layer src={mountainToGarden} alt="Descending into botanical garden" scale={d_s} opacity={d_o} y={d_y} z={2} />
          <Layer src={gardenPathway} alt="Garden pathway approaching gate" scale={pw_s} opacity={pw_o} y={pw_y} z={3} />
          <Layer src={gardenGate} alt="Ornate closed garden gate" scale={g_s} opacity={g_o} z={4} />
        </div>

        {/* FIX 11: Light rays on gate */}
        <motion.div
          style={{ opacity: lightRayO, zIndex: 12, ...GPU }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(255,235,150,0.22) 0%, transparent 65%)"
          }} />
        </motion.div>

        {/* FIX 10: Vignette */}
        <motion.div style={{ opacity: vig, zIndex: 15 }} className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(8,12,8,0.75) 100%)"
          }} />
        </motion.div>

        {/* FIX 10: Color grading */}
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
            <h2
              className="font-display font-extralight leading-[0.95]"
              style={{
                fontSize: "clamp(64px, 10vw, 130px)",
                color: "hsl(var(--cream))",
                textShadow: HEADING_SHADOW,
                letterSpacing: "-0.02em",
              }}
            >
              Where Healing
            </h2>
            <h2
              className="font-display italic font-extralight leading-[0.95]"
              style={{
                fontSize: "clamp(64px, 10vw, 130px)",
                color: "hsl(var(--gold))",
                textShadow: HEADING_SHADOW,
                letterSpacing: "-0.02em",
              }}
            >
              Grows
            </h2>
            <div className="w-12 h-[1px] mx-auto mt-6" style={{ background: "hsl(var(--gold) / 0.6)" }} />
          </div>
        </motion.div>

        {/* ─── BEAT 3: The Garden Awaits ─── */}
        <motion.div style={{ opacity: ga_to, y: ga_ty, zIndex: 20, ...GPU }} className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="relative">
            <h2
              className="font-display font-extralight leading-[0.95]"
              style={{
                fontSize: "clamp(60px, 9vw, 120px)",
                color: "hsl(var(--cream))",
                textShadow: HEADING_SHADOW,
                letterSpacing: "-0.02em",
              }}
            >
              The Garden
            </h2>
            <h2
              className="font-display italic font-extralight leading-[0.95]"
              style={{
                fontSize: "clamp(60px, 9vw, 120px)",
                color: "hsl(var(--gold))",
                textShadow: HEADING_SHADOW,
                letterSpacing: "-0.02em",
              }}
            >
              Awaits
            </h2>
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
            <div className="w-16 h-[1px] mx-auto mb-8" style={{ background: "hsl(var(--gold) / 0.65)" }} />
            <p
              className="tracking-[0.65em] max-md:tracking-[0.4em] font-light uppercase mb-4 text-3xl font-sans"
              style={{ color: "hsl(var(--gold))", textShadow: BODY_SHADOW }}
            >
              Coming Soon
            </p>
            <h2
              className="font-display font-extralight leading-[0.90]"
              style={{
                fontSize: "clamp(80px, 11vw, 150px)",
                color: "hsl(var(--cream))",
                textShadow: HEADING_SHADOW,
                letterSpacing: "-0.02em",
              }}
            >
              Something
            </h2>
            <h2
              className="font-display italic font-extralight leading-[0.90] mb-4"
              style={{
                fontSize: "clamp(80px, 11vw, 150px)",
                color: "hsl(var(--gold))",
                textShadow: HEADING_SHADOW,
                letterSpacing: "-0.02em",
              }}
            >
              Beautiful
            </h2>
            <p
              className="font-body text-[15px] max-md:text-[13px] mt-4 max-w-md mx-auto leading-relaxed tracking-wide"
              style={{ color: "hsl(var(--cream) / 0.85)", textShadow: "0 0 20px rgba(0,0,0,0.8)" }}
            >
              Our botanical wellness collection is being crafted with care.
            </p>

            {/* FIX 12: Waitlist signup */}
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.35, ease: "easeIn" } }}
                  className="mt-10 flex flex-col sm:flex-row max-md:flex-col items-center justify-center gap-6 max-md:gap-4 max-w-md mx-auto"
                >
                  <input
                    id="waitlist-email"
                    type="email"
                    required
                    placeholder="Enter your email"
                    className="waitlist-input w-full sm:flex-1 max-md:w-full bg-transparent border-b border-t-0 border-l-0 border-r-0 rounded-none px-0 py-3 text-sm tracking-wider font-body transition-all duration-300 ease-out focus:outline-none opacity-20 shadow-inner"
                    style={{
                      color: "hsl(var(--cream))",
                      borderColor: "hsl(var(--gold) / 0.4)",
                    }}
                    onFocus={(e) => {
                      e.target.style.borderColor = "hsl(var(--gold))";
                      e.target.style.borderWidth = "0 0 2px 0";
                      e.target.style.boxShadow = "0 4px 24px hsl(var(--gold) / 0.2)";
                      e.target.style.setProperty("--tw-placeholder-opacity", "0.1");
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = "hsl(var(--gold) / 0.4)";
                      e.target.style.borderWidth = "0 0 1px 0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                  <button
                    onClick={handleSubmit}
                    className="border-b border-t-0 border-l-0 border-r-0 rounded-none bg-transparent text-[10px] tracking-[0.35em] uppercase py-3 whitespace-nowrap font-body transition-all duration-300 opacity-20"
                    style={{
                      color: "hsl(var(--gold) / 0.85)",
                      borderColor: "hsl(var(--gold) / 0.4)",
                      transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.color = "hsl(var(--gold))";
                      e.currentTarget.style.borderColor = "hsl(var(--gold))";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.letterSpacing = "0.42em";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.color = "hsl(var(--gold) / 0.85)";
                      e.currentTarget.style.borderColor = "hsl(var(--gold) / 0.4)";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.letterSpacing = "0.35em";
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

        {/* FIX 13: Progress line at bottom */}
        <motion.div
          style={{ scaleX: p, opacity: progressOpacity, zIndex: 60 }}
          className="absolute bottom-0 left-0 right-0 h-[2px] origin-left"
        >
          <div className="w-full h-full" style={{
            background: "linear-gradient(90deg, transparent 0%, hsl(var(--gold) / 0.6) 50%, transparent 100%)"
          }} />
        </motion.div>
      </div>
    </section>
  );
};

export default ScrollJourney;
