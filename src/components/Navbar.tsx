import { useState, useEffect } from "react";
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const navBg = useTransform(scrollYProgress, [0, 0.12], [0, 1]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 100);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Lock body scroll when menu is open
  useEffect(() => {
    document.body.style.overflow = menuOpen ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [menuOpen]);

  const navItems = ["About", "Garden", "Products", "Story"];

  return (
    <>
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
          <a
            href="#"
            className="font-display transition-colors duration-700"
            style={{
              color: scrolled ? "hsl(var(--foreground))" : "hsl(var(--cream) / 0.85)",
              fontWeight: 300,
              letterSpacing: "0.4em",
              fontSize: "13px",
            }}
          >
            FLORVIA
          </a>
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item, i) => (
              <motion.a
                key={item}
                href={`#${item.toLowerCase()}`}
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1 + i * 0.08, duration: 0.6 }}
                className="font-body uppercase transition-colors duration-700"
                style={{
                  color: scrolled ? "hsl(var(--muted-foreground))" : "hsl(var(--cream) / 0.5)",
                  fontWeight: 300,
                  letterSpacing: "0.25em",
                  fontSize: "10px",
                }}
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
            className="hidden md:block rounded-full border transition-all duration-700"
            style={{
              borderColor: scrolled ? "hsl(var(--primary) / 0.4)" : "hsl(var(--cream) / 0.2)",
              color: scrolled ? "hsl(var(--primary))" : "hsl(var(--cream) / 0.6)",
              fontWeight: 300,
              letterSpacing: "0.2em",
              fontSize: "10px",
              padding: "10px 28px",
              textTransform: "uppercase",
              fontFamily: "var(--font-body)",
            }}
          >
            Shop Now
          </motion.a>

          {/* Mobile hamburger */}
          <button
            onClick={() => setMenuOpen(true)}
            className="md:hidden flex flex-col gap-[6px] p-2"
            aria-label="Open menu"
          >
            {[0, 1, 2].map((i) => (
              <span
                key={i}
                className="block w-6 transition-colors duration-500"
                style={{
                  height: "1px",
                  backgroundColor: scrolled ? "hsl(var(--foreground))" : "hsl(var(--cream) / 0.6)",
                }}
              />
            ))}
          </button>
        </div>
      </motion.nav>

      {/* Full-screen mobile menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[200] flex flex-col items-center justify-center"
            style={{ backgroundColor: "hsl(var(--primary))" }}
          >
            <button
              onClick={() => setMenuOpen(false)}
              className="absolute top-6 right-8 font-display text-cream/60 hover:text-cream transition-colors duration-300"
              style={{ fontSize: "32px", fontWeight: 300 }}
              aria-label="Close menu"
            >
              ×
            </button>
            <nav className="flex flex-col items-center gap-8">
              {navItems.map((item, i) => (
                <motion.a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  onClick={() => setMenuOpen(false)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.15 + i * 0.08, duration: 0.6 }}
                  className="font-display italic text-cream"
                  style={{ fontSize: "40px", fontWeight: 300 }}
                >
                  {item}
                </motion.a>
              ))}
            </nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default Navbar;
