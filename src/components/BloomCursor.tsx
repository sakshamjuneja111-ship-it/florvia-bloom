import { useRef, useState, useEffect, useCallback } from "react";
import { motion, useSpring } from "framer-motion";

interface Particle {
  id: number;
  x: number;
  y: number;
  angle: number;
}

const BloomCursor = () => {
  const [hovered, setHovered] = useState(false);
  const [particles, setParticles] = useState<Particle[]>([]);
  const mouseX = useRef(0);
  const mouseY = useRef(0);
  const idCounter = useRef(0);

  const springX = useSpring(0, { stiffness: 120, damping: 28 });
  const springY = useSpring(0, { stiffness: 120, damping: 28 });

  useEffect(() => {
    const move = (e: MouseEvent) => {
      mouseX.current = e.clientX;
      mouseY.current = e.clientY;
      springX.set(e.clientX);
      springY.set(e.clientY);
    };

    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    const click = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 6; i++) {
        newParticles.push({
          id: idCounter.current++,
          x: mouseX.current,
          y: mouseY.current,
          angle: (Math.PI * 2 * i) / 6,
        });
      }
      setParticles((prev) => [...prev, ...newParticles]);
      setTimeout(() => {
        setParticles((prev) => prev.filter((p) => !newParticles.includes(p)));
      }, 500);
    };

    window.addEventListener("mousemove", move);
    window.addEventListener("click", click);

    const attachHover = () => {
      document.querySelectorAll("a, button, input").forEach((el) => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };
    attachHover();
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      window.removeEventListener("click", click);
      observer.disconnect();
    };
  }, [springX, springY]);

  const scale = hovered ? 1.8 : 1;
  const rotate = hovered ? 90 : 0;

  return (
    <>
      <motion.div
        className="fixed top-0 left-0 pointer-events-none hidden md:block"
        style={{
          x: springX,
          y: springY,
          zIndex: 9999,
          translateX: "-50%",
          translateY: "-50%",
        }}
      >
        <motion.svg
          width="28"
          height="28"
          viewBox="0 0 28 28"
          animate={{ scale, rotate }}
          transition={{ type: "spring", stiffness: 200, damping: 18 }}
        >
          {/* 4-petal flower */}
          <ellipse cx="14" cy="7" rx="3.5" ry="6" fill="none" stroke="hsl(var(--gold))" strokeWidth="1" opacity="0.8" />
          <ellipse cx="14" cy="21" rx="3.5" ry="6" fill="none" stroke="hsl(var(--gold))" strokeWidth="1" opacity="0.8" />
          <ellipse cx="7" cy="14" rx="6" ry="3.5" fill="none" stroke="hsl(var(--gold))" strokeWidth="1" opacity="0.8" />
          <ellipse cx="21" cy="14" rx="6" ry="3.5" fill="none" stroke="hsl(var(--gold))" strokeWidth="1" opacity="0.8" />
          <circle cx="14" cy="14" r="2" fill="hsl(var(--gold))" opacity="0.6" />
        </motion.svg>
      </motion.div>

      {/* Pollen burst particles */}
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="fixed top-0 left-0 pointer-events-none hidden md:block"
          initial={{
            x: p.x,
            y: p.y,
            scale: 1,
            opacity: 0.9,
          }}
          animate={{
            x: p.x + Math.cos(p.angle) * 30,
            y: p.y + Math.sin(p.angle) * 30,
            scale: 0,
            opacity: 0,
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          style={{ zIndex: 9998 }}
        >
          <div
            className="w-[4px] h-[4px] rounded-full"
            style={{ background: "hsl(var(--gold))" }}
          />
        </motion.div>
      ))}
    </>
  );
};

export default BloomCursor;
