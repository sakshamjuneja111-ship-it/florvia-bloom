import { useState, useCallback } from "react";
import { motion } from "framer-motion";
import Navbar from "@/components/Navbar";
import ScrollJourney from "@/components/ScrollJourney";
import ProductsSection from "@/components/ProductsSection";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";
import LoadingScreen from "@/components/LoadingScreen";
import BloomCursor from "@/components/BloomCursor";

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

const Index = () => {
  const [loaded, setLoaded] = useState(false);

  const handleLoadComplete = useCallback(() => {
    setLoaded(true);
  }, []);

  return (
    <div className="bg-background" style={{ cursor: "none" }}>
      {!loaded && <LoadingScreen onComplete={handleLoadComplete} />}
      <BloomCursor />
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
