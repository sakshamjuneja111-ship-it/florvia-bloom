import { useState, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();
  const navBg = useTransform(scrollYProgress, [0, 0.12], [0, 1]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.4, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
      className="fixed top-0 left-0 right-0 z-[100]"
    >
      <motion.div
        className="absolute inset-0 transition-colors duration-1000"
        style={{
          opacity: navBg,
          backgroundColor: "hsl(var(--background) / 0.9)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: scrolled ? "1px solid hsl(var(--border) / 0.2)" : "1px solid transparent",
        }}
      />
      <div className="relative container mx-auto flex items-center justify-between px-8 py-5">
        <a href="#" className="font-display text-lg font-bold tracking-[0.2em] transition-colors duration-700"
          style={{ color: scrolled ? "hsl(var(--foreground))" : "hsl(var(--cream) / 0.85)" }}
        >
          FLORVIA
        </a>
        <div className="hidden md:flex items-center gap-10">
          {["About", "Garden", "Products", "Story"].map((item, i) => (
            <motion.a
              key={item}
              href={`#${item.toLowerCase()}`}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 + i * 0.08, duration: 0.6 }}
              className="font-body text-[11px] font-medium tracking-[0.2em] uppercase transition-colors duration-700"
              style={{ color: scrolled ? "hsl(var(--muted-foreground))" : "hsl(var(--cream) / 0.5)" }}
            >
              {item}
            </motion.a>
          ))}
        </div>
        <motion.a
          href="#products"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.4, duration: 0.8 }}
          className="hidden md:block px-7 py-2.5 rounded-full font-body text-[11px] font-medium tracking-[0.15em] uppercase border transition-all duration-700"
          style={{
            borderColor: scrolled ? "hsl(var(--primary) / 0.4)" : "hsl(var(--cream) / 0.2)",
            color: scrolled ? "hsl(var(--primary))" : "hsl(var(--cream) / 0.6)",
          }}
        >
          Shop Now
        </motion.a>
      </div>
    </motion.nav>
  );
};

export default Navbar;
