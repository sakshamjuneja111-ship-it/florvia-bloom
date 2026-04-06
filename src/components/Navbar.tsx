import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled
          ? "bg-background/90 backdrop-blur-md shadow-sm py-3"
          : "bg-transparent py-6"
      }`}
    >
      <div className="container mx-auto flex items-center justify-between px-6">
        <a href="#" className="font-display text-2xl font-bold tracking-wide text-primary">
          FLORVIA
        </a>
        <div className="hidden md:flex items-center gap-8">
          {["About", "Garden", "Products", "Story"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-body text-sm font-medium tracking-widest uppercase text-foreground/70 hover:text-primary transition-colors"
            >
              {item}
            </a>
          ))}
        </div>
        <a
          href="#products"
          className="hidden md:block bg-primary text-primary-foreground px-6 py-2.5 rounded-full font-body text-sm font-medium tracking-wide hover:bg-forest-light transition-colors"
        >
          Shop Now
        </a>
      </div>
    </motion.nav>
  );
};

export default Navbar;
