import { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import gsap from "gsap";
import Navbar from "@/components/Navbar";
import ScrollJourney from "@/components/ScrollJourney";
import ProductsSection from "@/components/ProductsSection";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";

/* ─── Luxury Marquee Strip ─── */
const MarqueeStrip = () => (
  <div className="overflow-hidden py-6 border-y border-border/20" style={{ background: "hsl(var(--background))" }}>
    <motion.div
      className="flex whitespace-nowrap"
      animate={{ x: ["0%", "-50%"] }}
      transition={{ duration: 30, ease: "linear", repeat: Infinity }}
    >
      {Array(8).fill(null).map((_, i) => (
        <span key={i} className="font-body text-[10px] tracking-[0.45em] font-light uppercase text-muted-foreground/30 mx-8">
          Organic  ·  Botanical  ·  Sustainable  ·  Science-Backed  ·  Earth-Grown
        </span>
      ))}
    </motion.div>
  </div>
);

/* ─── Custom Cursor ─── */
const CustomCursor = () => {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  useEffect(() => {
    const move = (e: MouseEvent) => {
      if (!cursorRef.current) return;
      gsap.to(cursorRef.current, { x: e.clientX, y: e.clientY, duration: 0.5, ease: "power2.out" });
    };
    const onEnter = () => setHovered(true);
    const onLeave = () => setHovered(false);

    window.addEventListener("mousemove", move);

    const attachHover = () => {
      document.querySelectorAll("a, button").forEach(el => {
        el.addEventListener("mouseenter", onEnter);
        el.addEventListener("mouseleave", onLeave);
      });
    };

    attachHover();
    const observer = new MutationObserver(attachHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener("mousemove", move);
      observer.disconnect();
    };
  }, []);

  return (
    <div
      ref={cursorRef}
      className="fixed top-0 left-0 pointer-events-none z-[9999] -translate-x-1/2 -translate-y-1/2 rounded-full border transition-all duration-300 hidden md:block"
      style={{
        width: hovered ? 48 : 14,
        height: hovered ? 48 : 14,
        borderColor: hovered ? "hsl(var(--gold) / 0.5)" : "hsl(var(--cream) / 0.4)",
        backgroundColor: hovered ? "hsl(var(--gold) / 0.08)" : "transparent",
        mixBlendMode: "difference",
      }}
    />
  );
};

const Index = () => {
  return (
    <div className="bg-background" style={{ cursor: "none" }}>
      <CustomCursor />
      <Navbar />
      <ScrollJourney />
      <MarqueeStrip />
      <ProductsSection />
      <BrandStory />
      <Footer />
    </div>
  );
};

export default Index;
