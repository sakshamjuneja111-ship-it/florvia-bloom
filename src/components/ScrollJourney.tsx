import { useRef, useEffect, useCallback, useState } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import mountainsHero from "@/assets/mountains-hero.jpg";
import mountainToGarden from "@/assets/mountain-to-garden.jpg";
import gardenPathway from "@/assets/garden-pathway.jpg";
import gardenTunnel from "@/assets/garden-tunnel.jpg";
import gardenCloseup from "@/assets/garden-closeup.jpg";
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

/* ─── Text Overlay ─── */
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
   SCROLL JOURNEY — 3 cinematic beats + gate finale
   Total: 800vh
   Beat 1: Mountains hero (0.00–0.30)
   Beat 2: Descent into garden (0.22–0.55)
   Beat 3: Through the garden (0.48–0.78)
   Finale: Gate approach + luminous bloom (0.72–1.00)
   ═══════════════════════════════════════════ */

const ScrollJourney = () => {
  const ref = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const cursorGlowRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  
  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(raw, SPRING);

  // Interactive cursor glow — follows mouse with GSAP for buttery smoothness
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
    
    for (let i = 0; i < 20; i++) {
      const particle = document.createElement("div");
      particle.className = "journey-particle";
      particle.style.cssText = `
        position: absolute;
        width: ${2 + Math.random() * 4}px;
        height: ${2 + Math.random() * 4}px;
        border-radius: 50%;
        background: hsla(38, 50%, 70%, ${0.15 + Math.random() * 0.25});
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
        y: `-=${100 + Math.random() * 300}`,
        x: `+=${-50 + Math.random() * 100}`,
        scale: 1,
        opacity: 0,
        duration: 4 + Math.random() * 6,
        repeat: -1,
        delay: Math.random() * 5,
        ease: "none",
        onRepeat: function() {
          gsap.set(particle, {
            x: Math.random() * window.innerWidth,
            y: window.innerHeight + 20,
            scale: 0,
            opacity: 0.4,
          });
        },
      });
    }

    return () => {
      particles.forEach(p => p.remove());
    };
  }, []);

  /* ─── Beat 1: Mountains (0.00 → 0.30) ─── */
  const m_s = useTransform(p, [0, 0.30], [1, 1.6]);
  const m_o = useTransform(p, [0, 0.22, 0.30], [1, 1, 0]);
  const m_to = useTransform(p, [0, 0.02, 0.12, 0.20], [0, 1, 1, 0]);
  const m_ty = useTransform(p, [0, 0.20], [0, -40]);

  /* ─── Beat 2: Descent into garden (0.22 → 0.55) ─── */
  const d_o = useTransform(p, [0.22, 0.30, 0.48, 0.55], [0, 1, 1, 0]);
  const d_s = useTransform(p, [0.22, 0.55], [1, 1.4]);
  const d_y = useTransform(p, [0.22, 0.55], [0, -40]);
  const gp_o = useTransform(p, [0.35, 0.42, 0.48, 0.55], [0, 0.6, 1, 0]);
  const gp_s = useTransform(p, [0.35, 0.55], [1.05, 1.3]);
  const gp_y = useTransform(p, [0.35, 0.55], [10, -30]);
  const d_to = useTransform(p, [0.28, 0.33, 0.40, 0.45], [0, 1, 1, 0]);
  const d_ty = useTransform(p, [0.28, 0.45], [25, -10]);

  /* ─── Beat 3: Through the garden (0.48 → 0.78) ─── */
  const t_o = useTransform(p, [0.48, 0.55, 0.68, 0.75], [0, 1, 1, 0]);
  const t_s = useTransform(p, [0.48, 0.78], [1, 1.5]);
  const cl_o = useTransform(p, [0.58, 0.64, 0.72, 0.78], [0, 0.7, 1, 0]);
  const cl_s = useTransform(p, [0.58, 0.78], [1.02, 1.25]);
  const t_to = useTransform(p, [0.55, 0.59, 0.64, 0.68], [0, 1, 1, 0]);
  const t_ty = useTransform(p, [0.55, 0.68], [20, -8]);

  /* ─── Finale: Gate approach + bloom (0.72 → 1.00) ─── */
  const g_o = useTransform(p, [0.72, 0.78, 0.92, 1.0], [0, 1, 1, 0.3]);
  const g_s = useTransform(p, [0.72, 1.0], [1, 1.8]);
  const g_to = useTransform(p, [0.78, 0.82, 0.86, 0.90], [0, 1, 1, 0]);
  const g_ty = useTransform(p, [0.78, 0.90], [20, -8]);

  // Luminous exit — the gate zooms in and light blooms through
  const exitGlow = useTransform(p, [0.88, 1.0], [0, 0.95]);
  const exitScale = useTransform(p, [0.92, 1.0], [1, 1.1]);

  // Scroll hint
  const scrollHint = useTransform(p, [0, 0.04], [1, 0]);

  // Atmospheric haze
  const hazeOpacity = useTransform(p, [0, 0.15, 0.5, 0.85, 1.0], [0.08, 0.15, 0.2, 0.15, 0.35]);

  // Vignette
  const vig = useTransform(p, [0, 0.05, 0.90, 1], [0.4, 0.25, 0.25, 0]);

  // Progress
  const progressOpacity = useTransform(p, [0, 0.03, 0.92, 1.0], [0, 0.4, 0.4, 0]);

  // Interactive parallax based on mouse
  const parallaxX = useTransform(() => (mousePos.x - 0.5) * -15);
  const parallaxY = useTransform(() => (mousePos.y - 0.5) * -10);

  return (
    <section ref={ref} className="relative h-[800vh]">
      <div
        ref={stickyRef}
        className="sticky top-0 h-screen overflow-hidden"
        style={{ background: "hsl(var(--foreground))" }}
      >
        {/* Interactive cursor glow — follows mouse */}
        <div
          ref={cursorGlowRef}
          className="absolute pointer-events-none"
          style={{
            width: 400,
            height: 400,
            borderRadius: "50%",
            background: "radial-gradient(circle, hsla(38, 50%, 70%, 0.12) 0%, transparent 70%)",
            transform: "translate(-50%, -50%)",
            zIndex: 17,
            filter: "blur(30px)",
            ...GPU,
          }}
        />

        {/* ── Image Layers with interactive parallax ── */}
        <motion.div style={{ x: parallaxX, y: parallaxY, ...GPU }} className="absolute inset-[-20px]">
          {/* Beat 1: Mountains */}
          <Layer src={mountainsHero} alt="Emerald mountains at golden hour" scale={m_s} opacity={m_o} z={1} />
          
          {/* Beat 2: Descent */}
          <Layer src={mountainToGarden} alt="Descending into botanical garden" scale={d_s} opacity={d_o} y={d_y} z={2} />
          <Layer src={gardenPathway} alt="Garden pathway" scale={gp_s} opacity={gp_o} y={gp_y} z={3} />
          
          {/* Beat 3: Through the garden */}
          <Layer src={gardenTunnel} alt="Vine tunnel corridor" scale={t_s} opacity={t_o} z={4} />
          <Layer src={gardenCloseup} alt="Lavender and chamomile" scale={cl_s} opacity={cl_o} z={5} />
          
          {/* Finale: Gate — zooms through as light blooms */}
          <Layer src={gardenGate} alt="Ornate garden gate" scale={g_s} opacity={g_o} z={6} />
        </motion.div>

        {/* ── Atmospheric overlays ── */}
        {/* Warm bloom / haze */}
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

        {/* Depth fog */}
        <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 17 }} aria-hidden>
          <div className="absolute bottom-0 left-0 right-0 h-1/3" style={{
            background: "linear-gradient(to top, hsla(150, 30%, 12%, 0.25) 0%, transparent 100%)"
          }} />
        </div>

        {/* Film grain overlay for luxury texture */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03] mix-blend-overlay"
          style={{
            zIndex: 22,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
          }}
          aria-hidden
        />

        {/* Soft vignette */}
        <motion.div style={{ opacity: vig, zIndex: 19 }} className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 50%, hsla(150, 30%, 8%, 0.4) 100%)"
          }} />
        </motion.div>

        {/* Anamorphic lens flare — horizontal streak */}
        <motion.div
          style={{
            opacity: useTransform(p, [0, 0.1, 0.3, 0.5, 0.7, 0.9, 1.0], [0.15, 0.25, 0.1, 0.2, 0.1, 0.15, 0.3]),
            zIndex: 20,
            ...GPU,
          }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <div className="absolute top-1/3 left-0 right-0 h-[2px]" style={{
            background: "linear-gradient(90deg, transparent 10%, hsla(38, 60%, 75%, 0.4) 40%, hsla(38, 60%, 80%, 0.6) 50%, hsla(38, 60%, 75%, 0.4) 60%, transparent 90%)",
            filter: "blur(8px)",
          }} />
        </motion.div>

        {/* ── Text ── */}
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

        {/* ── Luminous exit — gate zooms in, warm light blooms through ── */}
        <motion.div
          style={{ opacity: exitGlow, scale: exitScale, zIndex: 30, ...GPU }}
          className="absolute inset-0 pointer-events-none"
        >
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at 50% 50%, hsl(var(--cream)) 0%, hsl(var(--cream) / 0.95) 25%, hsl(var(--cream) / 0.6) 50%, hsl(var(--background)) 80%)"
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

        {/* ── Progress line ── */}
        <motion.div style={{ scaleX: p, opacity: progressOpacity, zIndex: 40 }} className="absolute top-0 left-0 right-0 h-[1px] origin-left">
          <div className="w-full h-full bg-gold/40" />
        </motion.div>
      </div>
    </section>
  );
};

export default ScrollJourney;
