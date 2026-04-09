import { useRef, useEffect, useCallback, useState } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import mountainsHero from "@/assets/mountains-hero.jpg";
import mountainToGarden from "@/assets/mountain-to-garden.jpg";
import gardenPathway from "@/assets/garden-pathway.jpg";
import gardenGate from "@/assets/garden-gate.jpg";

gsap.registerPlugin(ScrollTrigger);

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

/* ─── Split Text Animation ─── */
const SplitText = ({ text, className, delay = 0 }: { text: string; className?: string; delay?: number }) => {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const chars = el.querySelectorAll(".split-char");
    gsap.fromTo(chars,
      { opacity: 0, y: 30, rotateX: -40 },
      {
        opacity: 1, y: 0, rotateX: 0,
        duration: 0.8,
        stagger: 0.03,
        delay,
        ease: "power3.out",
        scrollTrigger: {
          trigger: el,
          start: "top 80%",
          toggleActions: "play none none none",
        },
      }
    );
  }, [delay]);

  return (
    <span ref={ref} className={className} style={{ perspective: "600px", display: "inline-block" }}>
      {text.split("").map((char, i) => (
        <span
          key={i}
          className="split-char"
          style={{ display: "inline-block", willChange: "transform, opacity" }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </span>
  );
};

/* ═══════════════════════════════════════════
   SCROLL JOURNEY — 3 cinematic beats + closed gate finale
   Total: 500vh (shorter, tighter)
   Beat 1: Mountains hero (0.00–0.35)
   Beat 2: Garden descent (0.28–0.65)
   Beat 3: Gate approach — closed "coming soon" (0.58–1.00)
   ═══════════════════════════════════════════ */

const ScrollJourney = () => {
  const ref = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });

  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(raw, SPRING);

  // Interactive cursor glow
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const rect = stickyRef.current?.getBoundingClientRect();
    if (!rect || !cursorGlowRef.current) return;
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
    gsap.to(cursorGlowRef.current, {
      left: `${x * 100}%`,
      top: `${y * 100}%`,
      duration: 0.8,
      ease: "power2.out",
    });
  }, []);

  useEffect(() => {
    const el = stickyRef.current;
    if (!el) return;
    el.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => el.removeEventListener("mousemove", handleMouseMove);
  }, [handleMouseMove]);

  // GSAP floating particles
  useEffect(() => {
    const container = stickyRef.current;
    if (!container) return;
    const particles: HTMLDivElement[] = [];

    for (let i = 0; i < 15; i++) {
      const particle = document.createElement("div");
      particle.style.cssText = `
        position: absolute;
        width: ${2 + Math.random() * 3}px;
        height: ${2 + Math.random() * 3}px;
        border-radius: 50%;
        background: rgba(200, 180, 140, ${0.15 + Math.random() * 0.2});
        pointer-events: none;
        z-index: 16;
        will-change: transform, opacity;
      `;
      container.appendChild(particle);
      particles.push(particle);

      gsap.set(particle, {
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        scale: 0,
      });

      gsap.to(particle, {
        y: `-=${80 + Math.random() * 200}`,
        x: `+=${-30 + Math.random() * 60}`,
        scale: 1,
        opacity: 0,
        duration: 5 + Math.random() * 6,
        repeat: -1,
        delay: Math.random() * 5,
        ease: "none",
        onRepeat: function () {
          gsap.set(particle, {
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            scale: 0,
            opacity: 0.3,
          });
        },
      });
    }

    return () => { particles.forEach(p => p.remove()); };
  }, []);

  /* ─── Beat 1: Mountains (0.00 → 0.35) ─── */
  const m_s = useTransform(p, [0, 0.35], [1, 1.5]);
  const m_o = useTransform(p, [0, 0.28, 0.35], [1, 1, 0]);
  const m_to = useTransform(p, [0, 0.03, 0.15, 0.25], [0, 1, 1, 0]);
  const m_ty = useTransform(p, [0, 0.25], [0, -30]);

  /* ─── Beat 2: Garden descent (0.28 → 0.65) ─── */
  const d_o = useTransform(p, [0.28, 0.35, 0.55, 0.62], [0, 1, 1, 0]);
  const d_s = useTransform(p, [0.28, 0.65], [1, 1.35]);
  const d_y = useTransform(p, [0.28, 0.65], [0, -30]);
  const d_to = useTransform(p, [0.33, 0.38, 0.48, 0.53], [0, 1, 1, 0]);
  const d_ty = useTransform(p, [0.33, 0.53], [20, -8]);

  // Pathway sub-layer for depth
  const pw_o = useTransform(p, [0.42, 0.50, 0.58, 0.65], [0, 0.7, 1, 0]);
  const pw_s = useTransform(p, [0.42, 0.65], [1.02, 1.25]);
  const pw_y = useTransform(p, [0.42, 0.65], [8, -20]);

  /* ─── Beat 3: Gate — closed "coming soon" (0.58 → 1.00) ─── */
  const g_o = useTransform(p, [0.58, 0.65, 0.92, 1.0], [0, 1, 1, 0.6]);
  const g_s = useTransform(p, [0.58, 1.0], [1, 1.3]);
  const g_to = useTransform(p, [0.65, 0.70, 0.82, 0.88], [0, 1, 1, 0]);
  const g_ty = useTransform(p, [0.65, 0.88], [20, -8]);
  
  // "Coming soon" text appears after gate text
  const cs_to = useTransform(p, [0.82, 0.88, 0.95, 1.0], [0, 1, 1, 0.5]);
  const cs_ty = useTransform(p, [0.82, 1.0], [15, -5]);

  // Exit bloom — softer, warmer
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

  // Interactive parallax
  const parallaxX = useTransform(() => (mousePos.x - 0.5) * -12);
  const parallaxY = useTransform(() => (mousePos.y - 0.5) * -8);

  return (
    <section ref={ref} className="relative h-[500vh]">
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: "hsl(var(--foreground))" }}
      >
        {/* Cursor glow */}
        <div
          ref={cursorGlowRef}
          className="absolute pointer-events-none"
          style={{
            width: 350,
            height: 350,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(200, 180, 140, 0.1) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            zIndex: 17,
            filter: "blur(25px)",
            ...GPU,
          }}
        />

        {/* Image Layers with parallax */}
        <motion.div style={{ x: parallaxX, y: parallaxY, ...GPU }} className="absolute inset-[-20px]">
          {/* Beat 1: Mountains */}
          <Layer src={mountainsHero} alt="Emerald mountains at golden hour" scale={m_s} opacity={m_o} z={1} />

          {/* Beat 2: Garden descent */}
          <Layer src={mountainToGarden} alt="Descending into botanical garden" scale={d_s} opacity={d_o} y={d_y} z={2} />
          <Layer src={gardenPathway} alt="Garden pathway approaching gate" scale={pw_s} opacity={pw_o} y={pw_y} z={3} />

          {/* Beat 3: Closed gate */}
          <Layer src={gardenGate} alt="Ornate closed garden gate" scale={g_s} opacity={g_o} z={4} />
        </motion.div>

        {/* ── Atmospheric overlays ── */}
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

        {/* Film grain */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.025] mix-blend-overlay"
          style={{
            zIndex: 22,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        {/* Vignette */}
        <motion.div style={{ opacity: vig, zIndex: 19 }} className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(15, 30, 15, 0.35) 100%)"
          }} />
        </motion.div>

        {/* Anamorphic lens flare */}
        <motion.div
          style={{
            opacity: useTransform(p, [0, 0.1, 0.3, 0.6, 0.9, 1.0], [0.12, 0.2, 0.1, 0.15, 0.12, 0.2]),
            zIndex: 20,
            ...GPU,
          }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <div className="absolute top-1/3 left-0 right-0 h-[2px]" style={{
            background: "linear-gradient(90deg, transparent 10%, rgba(200, 180, 140, 0.35) 40%, rgba(210, 190, 150, 0.5) 50%, rgba(200, 180, 140, 0.35) 60%, transparent 90%)",
            filter: "blur(6px)",
          }} />
        </motion.div>

        {/* ── Text ── */}
        {/* Hero — with split text animation */}
        <motion.div style={{ opacity: m_to, y: m_ty, zIndex: 20, ...GPU }} className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          <p className="font-body text-[10px] md:text-xs tracking-[0.4em] uppercase text-cream/50 mb-5">Organic Health & Wellness</p>
          <h1 className="font-display text-5xl md:text-7xl lg:text-[6rem] font-bold text-cream leading-[1.05] drop-shadow-2xl">
            <SplitText text="From Nature," delay={0.3} />
            <br />
            <span className="italic font-light">
              <SplitText text="For You" delay={0.6} />
            </span>
          </h1>
        </motion.div>

        {/* Garden entry */}
        <motion.div style={{ opacity: d_to, y: d_ty, zIndex: 20, ...GPU }} className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <p className="font-body text-[10px] md:text-xs tracking-[0.4em] uppercase text-cream/50 mb-4">Into the garden</p>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-cream leading-tight drop-shadow-lg">
              Where Healing <span className="italic font-light">Grows</span>
            </h2>
          </div>
        </motion.div>

        {/* Gate — closed "coming soon" */}
        <motion.div style={{ opacity: g_to, y: g_ty, zIndex: 20, ...GPU }} className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div>
            <h2 className="font-display text-3xl md:text-5xl lg:text-6xl font-bold text-cream leading-tight drop-shadow-lg">
              The Garden <span className="italic font-light">Awaits</span>
            </h2>
          </div>
        </motion.div>

        {/* Coming Soon overlay with waitlist */}
        <motion.div style={{ opacity: cs_to, y: cs_ty, zIndex: 21, ...GPU }} className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="max-w-lg w-full">
            <div className="w-16 h-[1px] bg-cream/20 mx-auto mb-8" />
            <p className="font-body text-sm md:text-base tracking-[0.5em] uppercase text-cream/60 mb-4">Coming Soon</p>
            <h2 className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-cream leading-tight drop-shadow-lg mb-4">
              Something <span className="italic font-light">Beautiful</span>
            </h2>
            <p className="font-body text-cream/50 text-base md:text-lg mt-4 max-w-md mx-auto leading-relaxed">Our botanical wellness collection is being crafted with care.</p>
            
            {/* Waitlist signup */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const email = (form.elements.namedItem('email') as HTMLInputElement).value;
                if (email) {
                  form.reset();
                  const btn = form.querySelector('button');
                  if (btn) { btn.textContent = 'You\'re on the list ✓'; setTimeout(() => { btn.textContent = 'Join the Waitlist'; }, 3000); }
                }
              }}
              className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-3 max-w-md mx-auto"
            >
              <input
                name="email"
                type="email"
                required
                placeholder="Enter your email"
                className="w-full sm:flex-1 px-5 py-3.5 rounded-full bg-cream/10 backdrop-blur-md border border-cream/15 text-cream placeholder:text-cream/30 font-body text-base focus:outline-none focus:border-cream/40 focus:ring-1 focus:ring-cream/20 transition-all duration-300"
              />
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-cream/15 backdrop-blur-md border border-cream/20 text-cream font-body text-base tracking-wider uppercase hover:bg-cream/25 hover:border-cream/35 transition-all duration-500 whitespace-nowrap"
              >
                Join the Waitlist
              </button>
            </form>
            
            <div className="w-16 h-[1px] bg-cream/20 mx-auto mt-10" />
          </div>
        </motion.div>

        {/* Luminous exit — soft warm bloom */}
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
            <p className="font-body text-[10px] tracking-[0.3em] uppercase text-cream/30">Scroll</p>
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
