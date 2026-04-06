import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const navBg = useTransform(scrollYProgress, [0, 0.08], [0, 1]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-[100]"
    >
      <motion.div
        className="absolute inset-0 border-b transition-colors duration-700"
        style={{
          opacity: navBg,
          backgroundColor: "hsl(var(--background) / 0.85)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderColor: scrolled ? "hsl(var(--border) / 0.3)" : "transparent",
        }}
      />
      <div className="relative container mx-auto flex items-center justify-between px-8 py-5">
        <a href="#" className="font-display text-xl font-bold tracking-[0.15em] text-cream transition-colors duration-500"
          style={{ color: scrolled ? "hsl(var(--foreground))" : "" }}
        >
          FLORVIA
        </a>
        <div className="hidden md:flex items-center gap-10">
          {["About", "Garden", "Products", "Story"].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1, duration: 0.6 }}
              className="font-body text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-500"
              style={{ color: scrolled ? "hsl(var(--muted-foreground))" : "hsl(var(--cream) / 0.6)" }}
            >
              {item}
            </motion.a>
          ))}
        </div>
        <motion.a
          href="#products"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2, duration: 0.8 }}
          className="hidden md:block px-7 py-2.5 rounded-full font-body text-[11px] font-medium tracking-[0.15em] uppercase border transition-all duration-500"
          style={{
            borderColor: scrolled ? "hsl(var(--primary))" : "hsl(var(--cream) / 0.3)",
            color: scrolled ? "hsl(var(--primary))" : "hsl(var(--cream) / 0.8)",
          }}
        >
          Shop Now
        </motion.a>
      </div>
    </motion.nav>
  );
};

export default Navbar;
