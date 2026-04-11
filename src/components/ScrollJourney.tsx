import { useRef, useState, useEffect, useCallback, useMemo, Suspense } from "react";
import { motion, useScroll, useTransform, useSpring, MotionValue, AnimatePresence } from "framer-motion";
import gsap from "gsap";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import mountainsHero from "@/assets/mountains-hero.jpg";
import mountainToGarden from "@/assets/mountain-to-garden.jpg";
import gardenPathway from "@/assets/garden-pathway.jpg";
import gardenGate from "@/assets/garden-gate.jpg";

/* ─── TASK 4: Lighter spring ─── */
const SPRING = { stiffness: 45, damping: 28, restDelta: 0.001 };

const GPU: React.CSSProperties = {
  willChange: "transform, opacity",
  backfaceVisibility: "hidden",
  WebkitBackfaceVisibility: "hidden",
  transform: "translateZ(0)",
};

/* ─── TASK 2: Lightened shadows ─── */
const HEADING_SHADOW = "0 0 60px rgba(0,0,0,0.55), 0 2px 20px rgba(0,0,0,0.45)";
const BODY_SHADOW = "0 0 25px rgba(0,0,0,0.60), 0 1px 8px rgba(0,0,0,0.50)";

/* ─── TASK 16: Reduced motion check ─── */
const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const isMobileWidth = () => typeof window !== "undefined" && window.innerWidth < 768;

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
              ? `${HEADING_SHADOW}, 0 0 40px rgba(212,175,55,0.3)`
              : HEADING_SHADOW,
          }}
        >
          {word}
        </motion.span>
      ))}
    </span>
  );
};

/* ─── Glint heading word ─── */
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
      // Glint: color sweep to gold and back
      gsap.to(el, {
        keyframes: [
          { color: "#D4AF37", duration: 0.15 },
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

/* ─── TASK 12: Three.js Gold Dust Particles ─── */
const GoldDustScene = ({ scrollProgressRef }: { scrollProgressRef: React.MutableRefObject<number> }) => {
  const pointsRef = useRef<THREE.Points>(null);
  const count = isMobileWidth() ? 0 : 2000; // Task 16: disabled on mobile

  const positions = useMemo(() => {
    const arr = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      arr[i * 3] = (Math.random() - 0.5) * 10;
      arr[i * 3 + 1] = Math.random() * 7 - 3;
      arr[i * 3 + 2] = Math.random() * 2.5 - 2;
    }
    return arr;
  }, [count]);

  useFrame(() => {
    if (!pointsRef.current || count === 0) return;
    const geo = pointsRef.current.geometry;
    const posAttr = geo.attributes.position as THREE.BufferAttribute;
    const arr = posAttr.array as Float32Array;
    const progress = scrollProgressRef.current;
    const gateActive = progress > 0.58;
    const gateStrength = gateActive ? (progress - 0.58) / 0.42 : 0;

    for (let i = 0; i < count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      arr[iy] += 0.0003;

      if (gateActive) {
        arr[ix] += (0 - arr[ix]) * gateStrength * 0.0008;
      }

      if (arr[iy] > 4) {
        arr[ix] = (Math.random() - 0.5) * 10;
        arr[iy] = -3;
        arr[iz] = Math.random() * 2.5 - 2;
      }
    }

    pointsRef.current.rotation.y += 0.00008;
    posAttr.needsUpdate = true;
  });

  if (count === 0) return null;

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[positions, 3]}
          count={count}
        />
      </bufferGeometry>
      <pointsMaterial
        size={0.008}
        color="#C9A84C"
        transparent
        opacity={0.7}
        sizeAttenuation
        depthWrite={false}
      />
    </points>
  );
};

/* ─── TASK 13: Volumetric Rays ─── */
const VolumetricRays = ({ gateOpacity }: { gateOpacity: MotionValue<number> }) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const container = containerRef.current;
    if (!container) return;

    const rays = container.querySelectorAll<HTMLDivElement>(".vol-ray");
    const tweens: gsap.core.Tween[] = [];

    rays.forEach((ray, i) => {
      const t = gsap.to(ray, {
        opacity: `random(0.6, 1.0)`,
        duration: 4 + Math.random() * 5,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
        delay: Math.random() * 4,
      });
      tweens.push(t);
    });

    const rotTween = gsap.to(container, {
      rotation: 1,
      duration: 20,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    tweens.push(rotTween);

    return () => tweens.forEach((t) => t.kill());
  }, []);

  const rays = useMemo(() => {
    const count = 8;
    const angleStep = 70 / (count - 1);
    return Array.from({ length: count }, (_, i) => {
      const angle = -35 + angleStep * i;
      const width = 60 + Math.random() * 120;
      const blur = 20 + (width / 180) * 25;
      const baseOpacity = 0.18 + Math.random() * 0.10;
      return { angle, width, blur, baseOpacity };
    });
  }, []);

  return (
    <motion.div
      ref={containerRef}
      style={{ opacity: gateOpacity, zIndex: 13, ...GPU }}
      className="absolute inset-0 pointer-events-none"
      aria-hidden
    >
      {rays.map((r, i) => (
        <div
          key={i}
          className="vol-ray absolute"
          style={{
            left: "50%",
            top: "8%",
            width: `${r.width}px`,
            height: "100%",
            transformOrigin: "top center",
            transform: `translateX(-50%) rotate(${r.angle}deg)`,
            background: `linear-gradient(to bottom, rgba(255,235,140,${r.baseOpacity}) 0%, rgba(255,220,100,0.06) 40%, transparent 85%)`,
            filter: `blur(${r.blur}px)`,
            opacity: r.baseOpacity,
          }}
        />
      ))}
    </motion.div>
  );
};

/* ─── TASK 14: Film Grain ─── */
const FilmGrain = ({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const mobile = isMobileWidth();
    let frameCount = 0;
    let rafId: number;

    const resize = () => {
      const w = Math.floor(container.clientWidth / 2);
      const h = Math.floor(container.clientHeight / 2);
      canvas.width = w;
      canvas.height = h;
    };
    resize();

    const render = () => {
      frameCount++;
      const skipInterval = mobile ? 3 : 2;
      if (frameCount % skipInterval === 0) {
        const w = canvas.width;
        const h = canvas.height;
        const imageData = ctx.createImageData(w, h);
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const v = Math.random() * 255;
          data[i] = v;
          data[i + 1] = v;
          data[i + 2] = v;
          data[i + 3] = Math.random() * 28;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      rafId = requestAnimationFrame(render);
    };

    rafId = requestAnimationFrame(render);
    return () => cancelAnimationFrame(rafId);
  }, [containerRef]);

  if (prefersReducedMotion()) return null;

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 22,
        pointerEvents: "none",
        mixBlendMode: "overlay",
        opacity: 0.032,
      }}
    />
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
  const scrollProgressRef = useRef(0);

  const { scrollYProgress: raw } = useScroll({ target: ref, offset: ["start start", "end end"] });
  const p = useSpring(raw, SPRING);

  // Keep ref in sync for Three.js
  useEffect(() => {
    const unsub = p.on("change", (v) => { scrollProgressRef.current = v; });
    return unsub;
  }, [p]);

  /* ─── TASK 1: 180 layered organic pollen ─── */
  useEffect(() => {
    const container = stickyRef.current;
    if (!container) return;

    const particles: HTMLDivElement[] = [];
    const tweens: gsap.core.Tween[] = [];
    const timelines: gsap.core.Timeline[] = [];

    const rnd = (min: number, max: number) => Math.random() * (max - min) + min;
    const goldColor = (a: number) => `rgba(212,175,55,${a})`;

    interface PollenLayer {
      count: number;
      zIndex: number;
      sizeMin: number;
      sizeMax: number;
      alphaMin: number;
      alphaMax: number;
      driftMin: number;
      driftMax: number;
    }

    const layers: PollenLayer[] = [
      { count: 60, zIndex: 18, sizeMin: 4, sizeMax: 7, alphaMin: 0.7, alphaMax: 0.9, driftMin: 6, driftMax: 14 },
      { count: 80, zIndex: 14, sizeMin: 2, sizeMax: 4, alphaMin: 0.4, alphaMax: 0.65, driftMin: 12, driftMax: 22 },
      { count: 40, zIndex: 10, sizeMin: 1, sizeMax: 2.5, alphaMin: 0.15, alphaMax: 0.35, driftMin: 20, driftMax: 35 },
    ];

    const createPollen = (
      size: number,
      alpha: number,
      zIndex: number,
      driftMin: number,
      driftMax: number,
      isOblong: boolean,
      isHero: boolean,
      isForeground: boolean,
    ) => {
      const el = document.createElement("div");
      const w = size;
      const h = isOblong ? size * 1.8 : size;

      Object.assign(el.style, {
        position: "absolute",
        pointerEvents: "none",
        zIndex: String(zIndex),
        borderRadius: isOblong ? "40%" : "50%",
        willChange: "transform, opacity",
        width: `${w}px`,
        height: `${h}px`,
        background: goldColor(alpha),
        left: `${rnd(0, 100)}%`,
        top: `${rnd(25, 100)}%`,
        opacity: String(alpha),
      });

      if (isHero) {
        el.style.boxShadow = `0 0 6px 2px rgba(212,175,55,0.4)`;
      }

      container.appendChild(el);
      particles.push(el);

      // Non-linear 2-tween drift path
      const buildDrift = () => {
        const tl = gsap.timeline({
          repeat: -1,
          onRepeat: () => {
            // Reset to bottom
            gsap.set(el, { left: `${rnd(0, 100)}%`, top: `${rnd(95, 110)}%` });
          },
        });

        const x1 = rnd(-250, 250);
        const y1 = -rnd(100, 300);
        const x2 = rnd(-250, 250);
        const y2 = -rnd(100, 200);
        const d1 = rnd(driftMin, driftMax) * 0.6;
        const d2 = rnd(driftMin, driftMax) * 0.4;

        tl.to(el, {
          x: `+=${x1}`,
          y: `+=${y1}`,
          duration: d1,
          ease: "power1.inOut",
        });
        tl.to(el, {
          x: `+=${x2}`,
          y: `+=${y2}`,
          duration: d2,
          ease: "power1.inOut",
        });

        timelines.push(tl);
      };
      buildDrift();

      // Breathing opacity
      const breathe = gsap.to(el, {
        opacity: alpha * 0.4,
        duration: rnd(2, 6),
        ease: "sine.inOut",
        repeat: -1,
        yoyo: true,
      });
      tweens.push(breathe);

      // Rotation for oblong
      if (isOblong) {
        const rot = gsap.to(el, {
          rotation: 360,
          duration: rnd(8, 20),
          repeat: -1,
          ease: "none",
        });
        tweens.push(rot);
      }
    };

    // Create 3 depth layers
    layers.forEach((layer) => {
      for (let i = 0; i < layer.count; i++) {
        const size = rnd(layer.sizeMin, layer.sizeMax);
        const alpha = rnd(layer.alphaMin, layer.alphaMax);
        const isOblong = Math.random() < 0.25;
        createPollen(size, alpha, layer.zIndex, layer.driftMin, layer.driftMax, isOblong, false, layer.zIndex === 18);
      }
    });

    // 12 hero pollen grains (foreground)
    for (let i = 0; i < 12; i++) {
      const size = rnd(8, 12);
      const alpha = rnd(0.5, 0.7);
      createPollen(size, alpha, 18, 25, 45, false, true, true);
    }

    // Gate beat centre bias for foreground particles (z-index 18)
    const gateInterval = setInterval(() => {
      const progress = scrollProgressRef.current;
      if (progress < 0.58) return;
      const strength = Math.min(1, (progress - 0.58) / 0.42);
      const bias = strength * 15;
      particles.forEach((el) => {
        if (el.style.zIndex === "18") {
          const rect = el.getBoundingClientRect();
          const containerRect = container.getBoundingClientRect();
          const centreDist = rect.left + rect.width / 2 - (containerRect.left + containerRect.width / 2);
          if (Math.abs(centreDist) > 50) {
            const adjust = centreDist > 0 ? -bias * 0.02 : bias * 0.02;
            gsap.to(el, { x: `+=${adjust}`, duration: 0.5, ease: "none", overwrite: "auto" });
          }
        }
      });
    }, 200);

    return () => {
      clearInterval(gateInterval);
      timelines.forEach((t) => t.kill());
      tweens.forEach((t) => t.kill());
      particles.forEach((el) => {
        gsap.killTweensOf(el);
        el.remove();
      });
    };
  }, []);

  /* ─── TASK 5: Light shafts ─── */
  useEffect(() => {
    const container = stickyRef.current;
    if (!container) return;

    const shaft1 = document.createElement("div");
    const shaft2 = document.createElement("div");

    const shaftBase: Partial<CSSStyleDeclaration> = {
      position: "absolute",
      top: "0",
      height: "60%",
      pointerEvents: "none",
      background: "linear-gradient(to bottom, transparent 0%, rgba(255,240,180,0.12) 50%, transparent 100%)",
    };

    Object.assign(shaft1.style, {
      ...shaftBase,
      width: "3px",
      left: "40%",
      transform: "rotate(-15deg)",
      zIndex: "11",
      opacity: "0.4",
    });

    Object.assign(shaft2.style, {
      ...shaftBase,
      width: "2px",
      left: "58%",
      transform: "rotate(-12deg)",
      zIndex: "11",
      opacity: "0.3",
    });

    container.appendChild(shaft1);
    container.appendChild(shaft2);

    const t1 = gsap.to(shaft1, { opacity: 0.9, duration: 8, ease: "sine.inOut", yoyo: true, repeat: -1 });
    const t2 = gsap.to(shaft2, { opacity: 0.75, duration: 11, ease: "sine.inOut", yoyo: true, repeat: -1, delay: 3 });

    // Visibility tied to scroll via polling
    const visInterval = setInterval(() => {
      const prog = scrollProgressRef.current;
      // Shaft 1 visible during Beat 1
      shaft1.style.display = prog < 0.30 ? "block" : "none";
      // Shaft 2 visible during Beat 1 and 2
      shaft2.style.display = prog < 0.52 ? "block" : "none";
    }, 100);

    return () => {
      clearInterval(visInterval);
      t1.kill();
      t2.kill();
      shaft1.remove();
      shaft2.remove();
    };
  }, []);

  /* ─── TASK 7: Dewdrop sparkles ─── */
  useEffect(() => {
    const container = stickyRef.current;
    if (!container) return;

    const sparkles: SVGSVGElement[] = [];
    const tweens: gsap.core.Tween[] = [];

    for (let i = 0; i < 20; i++) {
      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      const size = 8 + Math.random() * 6;
      svg.setAttribute("width", String(size));
      svg.setAttribute("height", String(size));
      svg.setAttribute("viewBox", "0 0 20 20");
      svg.innerHTML = `<path d="M10 0 L12 8 L20 10 L12 12 L10 20 L8 12 L0 10 L8 8 Z" fill="rgba(255,250,230,0.7)" />`;
      Object.assign(svg.style, {
        position: "absolute",
        pointerEvents: "none",
        zIndex: "17",
        left: `${Math.random() * 90 + 5}%`,
        top: `${Math.random() * 80 + 10}%`,
        opacity: "0",
      });
      container.appendChild(svg);
      sparkles.push(svg);

      const delay = Math.random() * 12 + 2;
      const sparkle = () => {
        gsap.to(svg, {
          keyframes: [
            { opacity: 0, duration: 0 },
            { opacity: 1, duration: 0.15 },
            { opacity: 1, duration: 0.08 },
            { opacity: 0, duration: 0.3 },
          ],
          delay: 4 + Math.random() * 8,
          onComplete: sparkle,
        });
      };
      // Stagger initial starts
      const initTween = gsap.delayedCall(delay, sparkle);
      tweens.push(initTween as any);
    }

    return () => {
      tweens.forEach((t) => t.kill());
      sparkles.forEach((s) => {
        gsap.killTweensOf(s);
        s.remove();
      });
    };
  }, []);

  /* ─── TASK 9: Hero breathing ─── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const container = stickyRef.current;
    if (!container) return;

    const breathDiv = document.createElement("div");
    Object.assign(breathDiv.style, {
      position: "absolute",
      inset: "0",
      pointerEvents: "none",
      zIndex: "8",
      background: "rgba(255,250,240,1)",
      opacity: "0",
    });
    container.appendChild(breathDiv);

    const tween = gsap.to(breathDiv, {
      opacity: 0.025,
      duration: 6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    return () => {
      tween.kill();
      breathDiv.remove();
    };
  }, []);

  /* ─── TASK 11: Bokeh leaves ─── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const container = stickyRef.current;
    if (!container) return;

    const mobile = isMobileWidth();
    const count = mobile ? 18 : 35;
    const bokehEls: HTMLDivElement[] = [];
    const tweens: gsap.core.Tween[] = [];

    for (let i = 0; i < count; i++) {
      const el = document.createElement("div");
      const size = Math.random() * Math.random() * 100 + 40;
      const colors = [
        `rgba(100,130,70,${0.04 + Math.random() * 0.08})`,
        `rgba(180,155,80,${0.05 + Math.random() * 0.09})`,
        `rgba(60,90,40,${0.03 + Math.random() * 0.06})`,
        `rgba(200,180,100,${0.04 + Math.random() * 0.06})`,
      ];
      const color = colors[Math.floor(Math.random() * 4)];
      const blur = 18 + (size / 140) * 37;

      // 60% near edges
      let left: number;
      if (Math.random() < 0.6) {
        left = Math.random() < 0.5 ? Math.random() * 200 : container.clientWidth - Math.random() * 200;
      } else {
        left = Math.random() * container.clientWidth;
      }

      Object.assign(el.style, {
        position: "absolute",
        pointerEvents: "none",
        zIndex: "19",
        borderRadius: "50%",
        width: `${size}px`,
        height: `${size}px`,
        background: color,
        filter: `blur(${blur}px)`,
        left: `${left}px`,
        top: `${Math.random() * container.clientHeight}px`,
        willChange: "transform, opacity",
      });

      container.appendChild(el);
      bokehEls.push(el);

      // Drift
      const drift = gsap.to(el, {
        x: `random(-30, 30)`,
        y: `random(-20, 20)`,
        duration: 18 + Math.random() * 22,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      tweens.push(drift);

      // Opacity breathe
      const breath = gsap.to(el, {
        opacity: 0.5,
        duration: 6 + Math.random() * 10,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      tweens.push(breath);
    }

    // Fade with beats
    const fadeInterval = setInterval(() => {
      const prog = scrollProgressRef.current;
      const targetOpacity = prog < 0.42 ? 1 : 0.6;
      bokehEls.forEach((el) => {
        el.style.opacity = String(targetOpacity);
      });
    }, 200);

    return () => {
      clearInterval(fadeInterval);
      tweens.forEach((t) => t.kill());
      bokehEls.forEach((el) => {
        gsap.killTweensOf(el);
        el.remove();
      });
    };
  }, []);

  /* ─── TASK 15: Atmospheric mist ─── */
  useEffect(() => {
    if (prefersReducedMotion()) return;
    const container = stickyRef.current;
    if (!container) return;

    const mistEls: HTMLDivElement[] = [];
    const tweens: gsap.core.Tween[] = [];

    for (let i = 0; i < 5; i++) {
      const el = document.createElement("div");
      const size = 400 + Math.random() * 400;
      const alpha = 0.04 + Math.random() * 0.04;

      Object.assign(el.style, {
        position: "absolute",
        pointerEvents: "none",
        zIndex: "9",
        width: `${size}px`,
        height: `${size}px`,
        borderRadius: "50%",
        background: `radial-gradient(circle, rgba(220,235,215,${alpha}) 0%, transparent 70%)`,
        left: `${Math.random() * 80}%`,
        top: `${50 + Math.random() * 40}%`,
        willChange: "transform",
      });

      container.appendChild(el);
      mistEls.push(el);

      const driftX = gsap.to(el, {
        x: `random(-60, 60)`,
        duration: 30 + Math.random() * 25,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      tweens.push(driftX);

      const driftY = gsap.to(el, {
        y: `random(-30, 30)`,
        duration: 35 + Math.random() * 20,
        ease: "sine.inOut",
        yoyo: true,
        repeat: -1,
      });
      tweens.push(driftY);
    }

    // Beat-dependent opacity
    const mistInterval = setInterval(() => {
      const prog = scrollProgressRef.current;
      let opacity = 0.5;
      if (prog < 0.22) opacity = 0.8;
      else if (prog < 0.52) opacity = 0.5;
      else opacity = 0.4 + Math.sin(Date.now() / 3000) * 0.125;
      mistEls.forEach((el) => { el.style.opacity = String(opacity); });
    }, 200);

    return () => {
      clearInterval(mistInterval);
      tweens.forEach((t) => t.kill());
      mistEls.forEach((el) => {
        gsap.killTweensOf(el);
        el.remove();
      });
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

  /* ─── Magnetic pull for waitlist button ─── */
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
        gsap.to(btn, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
      }
    };

    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  /* ─── Redistributed scroll timings ─── */

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

  // Glint heading visibility
  const [somethingVisible, setSomethingVisible] = useState(false);
  useEffect(() => {
    const unsub = p.on("change", (v) => { setSomethingVisible(v >= 0.68 && v <= 0.94); });
    return unsub;
  }, [p]);

  // Exit bloom
  const exitGlow = useTransform(p, [0.94, 1.0], [0, 0.7]);
  const exitScale = useTransform(p, [0.94, 1.0], [1, 1.05]);

  // Scroll hint
  const scrollHint = useTransform(p, [0, 0.04], [1, 0]);

  // Atmospheric haze
  const hazeOpacity = useTransform(p, [0, 0.15, 0.5, 0.85, 1.0], [0.06, 0.12, 0.18, 0.12, 0.25]);

  // TASK 2: Vignette reduced
  const vig = useTransform(p, [0, 0.5, 0.58, 1.0], [0.22, 0.22, 0.38, 0.38]);

  // TASK 2: Color grading reduced by 40%
  const colorGrade = useTransform(p, [0, 0.25, 0.45, 0.58, 1.0], [
    "rgba(20,35,25,0.048)",
    "rgba(15,30,20,0.060)",
    "rgba(25,30,15,0.048)",
    "rgba(40,30,10,0.072)",
    "rgba(40,30,10,0.072)",
  ]);

  // TASK 8: Enhanced gate light ray
  const gateLightO = useTransform(p, [0.58, 0.68], [0, 1]);

  // TASK 13: Volumetric rays opacity
  const volRayO = useTransform(p, [0.52, 0.65], [0, 1]);

  // Light ray on gate (old)
  const lightRayO = useTransform(p, [0.55, 0.65, 0.95, 1.0], [0, 1, 1, 0.85]);

  // Progress line
  const progressOpacity = useTransform(p, [0, 0.05, 0.90, 0.94], [0, 0.6, 0.6, 0]);

  // TASK 6: Botanical edge transforms
  const leftEdgeY = useTransform(p, [0, 1], [0, -60]);
  const rightEdgeY = useTransform(p, [0, 1], [0, -40]);

  const handleSubmit = () => {
    const input = document.querySelector<HTMLInputElement>('#waitlist-email');
    if (input && input.value && input.validity.valid) {
      setSubmitted(true);
      input.value = '';
    }
  };

  const mobile = typeof window !== "undefined" && window.innerWidth < 768;

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

        {/* TASK 9: Hero breathing */}
        {/* (created via DOM in useEffect above) */}

        {/* TASK 15: Mist (created via DOM) */}

        {/* TASK 8: Enhanced gate light overlay */}
        <motion.div
          style={{ opacity: gateLightO, zIndex: 12, ...GPU }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <div className="absolute inset-0" style={{
            background: "conic-gradient(from 0deg at 50% 15%, rgba(255,235,140,0.18) 0deg, rgba(255,220,100,0.09) 20deg, rgba(255,200,80,0.04) 45deg, transparent 90deg, transparent 270deg, rgba(255,200,80,0.04) 315deg, rgba(255,220,100,0.09) 340deg, rgba(255,235,140,0.18) 360deg)",
          }} />
          <div className="absolute inset-0" style={{
            background: "radial-gradient(circle at 50% 20%, rgba(255,240,160,0.14) 0%, transparent 55%)",
          }} />
        </motion.div>

        {/* TASK 13: Volumetric rays */}
        {!prefersReducedMotion() && <VolumetricRays gateOpacity={volRayO} />}

        {/* Vignette */}
        <motion.div style={{ opacity: vig, zIndex: 15 }} className="absolute inset-0 pointer-events-none" aria-hidden>
          <div className="absolute inset-0" style={{
            background: "radial-gradient(ellipse at center, transparent 50%, rgba(8,12,8,0.75) 100%)"
          }} />
        </motion.div>

        {/* Color grading */}
        <motion.div
          style={{ backgroundColor: colorGrade, zIndex: 10, mixBlendMode: "color", ...GPU }}
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        />

        {/* TASK 12: Three.js gold dust */}
        {!prefersReducedMotion() && !mobile && (
          <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 15 }}>
            <Canvas
              camera={{ position: [0, 0, 3] }}
              gl={{ alpha: true, antialias: false }}
              style={{ background: "transparent", width: "100%", height: "100%" }}
              frameloop="always"
            >
              <Suspense fallback={null}>
                <GoldDustScene scrollProgressRef={scrollProgressRef} />
              </Suspense>
            </Canvas>
          </div>
        )}

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

        {/* TASK 6: Botanical edge silhouettes */}
        <motion.div
          style={{ y: leftEdgeY, zIndex: 19, ...GPU }}
          className="absolute left-0 top-0 bottom-0 pointer-events-none"
        >
          <div style={{
            width: mobile ? "100px" : "220px",
            height: "100%",
            position: "relative",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: mobile
                ? "linear-gradient(to right, rgba(15,25,12,0.315) 0%, transparent 100%)"
                : "linear-gradient(to right, rgba(15,25,12,0.45) 0%, transparent 100%)",
            }} />
            <svg width={mobile ? "100" : "220"} height="100%" viewBox={mobile ? "0 0 100 800" : "0 0 220 800"} fill="none" style={{ position: "absolute", inset: 0, height: "100%" }} preserveAspectRatio="none">
              <path d="M0 100 Q30 150 15 250 Q5 300 20 400 Q35 350 25 280 Q15 200 0 100Z" stroke="rgba(100,130,80,0.35)" strokeWidth="0.6" fill="none" />
              <path d="M0 300 Q40 340 20 420 Q10 480 25 550 Q40 500 30 440 Q15 380 0 300Z" stroke="rgba(100,130,80,0.35)" strokeWidth="0.6" fill="none" />
              <path d="M5 500 Q50 520 30 600 Q15 660 5 720" stroke="rgba(100,130,80,0.35)" strokeWidth="0.6" fill="none" />
              <path d="M0 150 Q60 200 40 300" stroke="rgba(100,130,80,0.35)" strokeWidth="0.6" fill="none" />
              <path d="M10 400 Q55 430 35 520 Q20 570 10 630" stroke="rgba(100,130,80,0.35)" strokeWidth="0.6" fill="none" />
              <path d="M0 50 Q25 80 10 130 Q-5 180 15 230" stroke="rgba(100,130,80,0.35)" strokeWidth="0.6" fill="none" />
              <path d="M3 600 Q45 640 30 700 Q15 740 3 780" stroke="rgba(100,130,80,0.35)" strokeWidth="0.6" fill="none" />
              <path d="M0 200 Q35 220 25 280 Q10 330 0 370" stroke="rgba(100,130,80,0.35)" strokeWidth="0.6" fill="none" />
            </svg>
          </div>
        </motion.div>

        <motion.div
          style={{ y: rightEdgeY, zIndex: 19, ...GPU }}
          className="absolute right-0 top-0 bottom-0 pointer-events-none"
        >
          <div style={{
            width: mobile ? "100px" : "200px",
            height: "100%",
            position: "relative",
            marginLeft: "auto",
          }}>
            <div style={{
              position: "absolute", inset: 0,
              background: mobile
                ? "linear-gradient(to left, rgba(15,25,12,0.28) 0%, transparent 100%)"
                : "linear-gradient(to left, rgba(15,25,12,0.40) 0%, transparent 100%)",
            }} />
            <svg width={mobile ? "100" : "200"} height="100%" viewBox={mobile ? "0 0 100 800" : "0 0 200 800"} fill="none" style={{ position: "absolute", inset: 0, height: "100%" }} preserveAspectRatio="none">
              <path d="M200 120 Q170 170 185 270 Q195 320 180 420 Q165 370 175 300 Q185 220 200 120Z" stroke="rgba(100,130,80,0.30)" strokeWidth="0.6" fill="none" />
              <path d="M200 350 Q160 390 180 470 Q190 530 175 600 Q160 550 170 490 Q185 430 200 350Z" stroke="rgba(100,130,80,0.30)" strokeWidth="0.6" fill="none" />
              <path d="M195 550 Q150 580 170 660 Q185 720 195 780" stroke="rgba(100,130,80,0.30)" strokeWidth="0.6" fill="none" />
              <path d="M200 80 Q155 120 175 200" stroke="rgba(100,130,80,0.30)" strokeWidth="0.6" fill="none" />
              <path d="M198 250 Q160 280 178 360 Q192 410 198 470" stroke="rgba(100,130,80,0.30)" strokeWidth="0.6" fill="none" />
              <path d="M200 450 Q165 475 180 540 Q192 580 200 640" stroke="rgba(100,130,80,0.30)" strokeWidth="0.6" fill="none" />
            </svg>
          </div>
        </motion.div>

        {/* TASK 14: Film grain */}
        <FilmGrain containerRef={stickyRef} />

        {/* ══════ TEXT BEATS ══════ */}

        {/* ─── BEAT 1: Hero ─── */}
        <motion.div
          ref={heroRef}
          style={{ opacity: m_to, y: m_ty, zIndex: 23, ...GPU }}
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
            <div className="hero-line w-12 h-[1px] mx-auto mb-8" style={{ background: "hsl(var(--gold) / 0.65)" }} />
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
        <motion.div style={{ opacity: d_to, y: d_ty, zIndex: 23, ...GPU }} className="absolute inset-0 flex items-center justify-center text-center px-6">
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
        <motion.div style={{ opacity: ga_to, y: ga_ty, zIndex: 23, ...GPU }} className="absolute inset-0 flex items-center justify-center text-center px-6">
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
        <motion.div style={{ opacity: cs_to, y: cs_ty, zIndex: 23, ...GPU }} className="absolute inset-0 flex items-center justify-center text-center px-6">
          <div className="max-w-xl w-full">
            <MorphingMonogram progress={p} />

            <div className="w-16 h-[1px] mx-auto mb-8" style={{ background: "hsl(var(--gold) / 0.65)" }} />

            {/* TASK 2 applied: Coming Soon eyebrow */}
            <p
              className="font-body text-[11px] max-md:text-[9px] tracking-[0.65em] max-md:tracking-[0.4em] font-light uppercase mb-5"
              style={{
                color: "hsl(var(--gold))",
                textShadow: BODY_SHADOW,
              }}
            >
              Coming Soon
            </p>

            {/* Glint word reveal */}
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

            {/* Body text */}
            <p
              className="font-body text-[15px] max-md:text-[13px] font-light tracking-[0.05em] leading-[1.8] max-w-[420px] mx-auto mb-8"
              style={{
                color: "hsl(var(--cream) / 0.88)",
                textShadow: BODY_SHADOW,
              }}
            >
              Our botanical wellness collection is being crafted with care.
            </p>

            {/* TASK 3: Waitlist form with frosted container */}
            <AnimatePresence mode="wait">
              {!submitted ? (
                <motion.div
                  key="form"
                  initial={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94, transition: { duration: 0.35, ease: "easeIn" } }}
                  className="mt-2"
                >
                  {/* Frosted glass container */}
                  <div
                    className="mx-auto max-w-md"
                    style={{
                      background: "rgba(0,0,0,0.30)",
                      backdropFilter: "blur(16px)",
                      WebkitBackdropFilter: "blur(16px)",
                      borderRadius: "4px",
                      padding: "28px 32px",
                      border: "1px solid rgba(212,175,55,0.20)",
                    }}
                  >
                    <div className="flex flex-row max-md:flex-col items-center justify-center gap-5 max-md:gap-4">
                      <input
                        id="waitlist-email"
                        type="email"
                        required
                        placeholder="your@email.com"
                        className="font-body font-light text-[14px] tracking-[0.1em] text-center transition-all duration-300 ease-out focus:outline-none w-[260px] max-md:w-full"
                        style={{
                          color: "hsl(var(--cream))",
                          background: "rgba(10,8,5,0.55)",
                          border: "1px solid rgba(212,175,55,0.6)",
                          borderRadius: "2px",
                          padding: "14px 20px",
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = "rgba(212,175,55,0.9)";
                          e.target.style.background = "rgba(10,8,5,0.65)";
                          e.target.style.boxShadow = "0 0 0 3px rgba(212,175,55,0.15), 0 4px 24px rgba(212,175,55,0.20)";
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = "rgba(212,175,55,0.6)";
                          e.target.style.background = "rgba(10,8,5,0.55)";
                          e.target.style.boxShadow = "none";
                        }}
                      />

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
                    </div>
                  </div>
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

        {/* TASK 10: Redesigned scroll hint */}
        <motion.div style={{ opacity: scrollHint, zIndex: 25 }} className="absolute bottom-12 left-1/2 -translate-x-1/2 scroll-hint-el">
          <div className="flex flex-col items-center gap-2">
            <p
              className="font-body text-[9px] tracking-[0.5em] font-light uppercase"
              style={{ color: "hsl(var(--cream) / 0.30)" }}
            >
              Scroll
            </p>
            <svg width="8" height="14" viewBox="0 0 8 14" fill="none" className="scroll-seed">
              <path d="M4 0 Q8 4 4 14 Q0 4 4 0Z" fill="hsl(var(--gold) / 0.4)" />
            </svg>
            <div className="w-[1px] h-10" style={{
              background: "linear-gradient(to bottom, hsl(var(--gold) / 0.45), transparent)",
            }} />
          </div>
        </motion.div>

        {/* TASK 10: Seed rotation animation */}
        <SeedRotation />

        {/* Progress line at bottom */}
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

/* ─── Seed rotation animation (TASK 10) ─── */
const SeedRotation = () => {
  useEffect(() => {
    const seed = document.querySelector(".scroll-seed");
    if (!seed) return;
    gsap.set(seed, { rotation: -10 });
    const tween = gsap.to(seed, {
      rotation: 10,
      duration: 3,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });
    return () => { tween.kill(); };
  }, []);
  return null;
};
    });
    // Also animate from -10
    gsap.set(seed, { rotation: -10 });
    return () => tween.kill();
  }, []);
  return null;
};

export default ScrollJourney;
