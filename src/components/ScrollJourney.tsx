import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import mountainsHero from "@/assets/mountains-hero.jpg";
import mountainToGarden from "@/assets/mountain-to-garden.jpg";
import gardenPathway from "@/assets/garden-pathway.jpg";
import gardenTunnel from "@/assets/garden-tunnel.jpg";
import gardenCloseup from "@/assets/garden-closeup.jpg";
import gardenGate from "@/assets/garden-gate.jpg";
import gateOpen from "@/assets/gate-open.jpg";

const ScrollJourney = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Chapter 1: Mountains (0 - 0.15)
  const mountainScale = useTransform(scrollYProgress, [0, 0.15], [1, 3]);
  const mountainOpacity = useTransform(scrollYProgress, [0.1, 0.18], [1, 0]);
  const heroTextOpacity = useTransform(scrollYProgress, [0, 0.06], [1, 0]);
  const heroTextY = useTransform(scrollYProgress, [0, 0.06], [0, -80]);

  // Chapter 2: Aerial zoom into garden (0.12 - 0.28)
  const aerialOpacity = useTransform(scrollYProgress, [0.12, 0.18, 0.25, 0.3], [0, 1, 1, 0]);
  const aerialScale = useTransform(scrollYProgress, [0.12, 0.28], [1.2, 2.5]);
  const aerialTextOpacity = useTransform(scrollYProgress, [0.16, 0.2, 0.24, 0.28], [0, 1, 1, 0]);

  // Chapter 3: Garden pathway walk (0.25 - 0.42)
  const pathwayOpacity = useTransform(scrollYProgress, [0.25, 0.3, 0.38, 0.44], [0, 1, 1, 0]);
  const pathwayScale = useTransform(scrollYProgress, [0.25, 0.42], [1, 1.8]);
  const pathwayY = useTransform(scrollYProgress, [0.25, 0.42], [0, -200]);
  const pathwayTextOpacity = useTransform(scrollYProgress, [0.3, 0.34, 0.37, 0.4], [0, 1, 1, 0]);

  // Chapter 4: Garden tunnel (0.38 - 0.55)
  const tunnelOpacity = useTransform(scrollYProgress, [0.38, 0.44, 0.52, 0.58], [0, 1, 1, 0]);
  const tunnelScale = useTransform(scrollYProgress, [0.38, 0.55], [1, 2]);
  const tunnelTextOpacity = useTransform(scrollYProgress, [0.44, 0.47, 0.5, 0.53], [0, 1, 1, 0]);

  // Chapter 5: Close-up herbs (0.52 - 0.65)
  const closeupOpacity = useTransform(scrollYProgress, [0.52, 0.57, 0.62, 0.68], [0, 1, 1, 0]);
  const closeupScale = useTransform(scrollYProgress, [0.52, 0.65], [1.1, 1.5]);
  const closeupTextOpacity = useTransform(scrollYProgress, [0.56, 0.59, 0.62, 0.65], [0, 1, 1, 0]);

  // Chapter 6: Gate appears (0.62 - 0.78)
  const gateOpacity = useTransform(scrollYProgress, [0.62, 0.68, 0.76, 0.82], [0, 1, 1, 0]);
  const gateScale = useTransform(scrollYProgress, [0.62, 0.78], [1, 2.2]);
  const gateTextOpacity = useTransform(scrollYProgress, [0.66, 0.69, 0.72, 0.75], [0, 1, 1, 0]);

  // Chapter 7: Gate opens - white flash transition (0.76 - 0.92)
  const gateOpenOpacity = useTransform(scrollYProgress, [0.76, 0.82, 0.88, 0.95], [0, 1, 1, 0]);
  const gateOpenScale = useTransform(scrollYProgress, [0.76, 0.92], [1, 2.5]);
  const whiteFlash = useTransform(scrollYProgress, [0.88, 0.95], [0, 1]);

  // Scroll indicator
  const scrollIndicatorOpacity = useTransform(scrollYProgress, [0, 0.03], [1, 0]);

  return (
    <section ref={containerRef} className="relative h-[800vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-foreground">
        
        {/* Chapter 1: Mountains */}
        <motion.div
          style={{ scale: mountainScale, opacity: mountainOpacity }}
          className="absolute inset-0"
        >
          <img
            src={mountainsHero}
            alt="Lush green mountains"
            className="w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/20 via-transparent to-foreground/30" />
        </motion.div>

        {/* Hero Text */}
        <motion.div
          style={{ opacity: heroTextOpacity, y: heroTextY }}
          className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10"
        >
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="font-body text-sm tracking-[0.3em] uppercase text-cream mb-4"
          >
            Organic Health & Wellness
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-cream leading-tight"
          >
            From Nature,
            <br />
            <span className="italic font-normal">For You</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="font-body text-cream/70 mt-6 text-lg max-w-md"
          >
            Scroll to begin your journey through our botanical garden
          </motion.p>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div
          style={{ opacity: scrollIndicatorOpacity }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 z-20"
        >
          <div className="flex flex-col items-center gap-3">
            <p className="font-body text-xs tracking-[0.2em] uppercase text-cream/50">Scroll to explore</p>
            <svg width="24" height="40" viewBox="0 0 24 40" fill="none" className="text-cream/40">
              <rect x="1" y="1" width="22" height="38" rx="11" stroke="currentColor" strokeWidth="2" />
              <motion.circle
                cx="12" r="3" fill="currentColor"
                animate={{ cy: [10, 20, 10] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
              />
            </svg>
          </div>
        </motion.div>

        {/* Chapter 2: Aerial view - mountains to garden */}
        <motion.div
          style={{ scale: aerialScale, opacity: aerialOpacity }}
          className="absolute inset-0"
        >
          <img
            src={mountainToGarden}
            alt="Aerial view descending into botanical garden"
            className="w-full h-full object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-transparent to-foreground/20" />
        </motion.div>
        <motion.div
          style={{ opacity: aerialTextOpacity }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="text-center">
            <p className="font-body text-sm tracking-[0.3em] uppercase text-cream/80 mb-3">Descending into</p>
            <h2 className="font-display text-4xl md:text-6xl font-bold text-cream">
              The Garden
            </h2>
          </div>
        </motion.div>

        {/* Chapter 3: Garden Pathway */}
        <motion.div
          style={{ scale: pathwayScale, opacity: pathwayOpacity, y: pathwayY }}
          className="absolute inset-0"
        >
          <img
            src={gardenPathway}
            alt="Walking the botanical garden pathway"
            className="w-full h-full object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-foreground/30" />
        </motion.div>
        <motion.div
          style={{ opacity: pathwayTextOpacity }}
          className="absolute inset-0 flex items-end justify-center pb-32 z-10"
        >
          <div className="text-center">
            <p className="font-body text-sm tracking-[0.3em] uppercase text-cream/80 mb-3">Walk with us</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-cream">
              Every Step, <span className="italic font-normal">Intentional</span>
            </h2>
          </div>
        </motion.div>

        {/* Chapter 4: Garden Tunnel */}
        <motion.div
          style={{ scale: tunnelScale, opacity: tunnelOpacity }}
          className="absolute inset-0"
        >
          <img
            src={gardenTunnel}
            alt="Garden tunnel archway"
            className="w-full h-full object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-transparent to-foreground/20" />
        </motion.div>
        <motion.div
          style={{ opacity: tunnelTextOpacity }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="text-center px-6">
            <p className="font-body text-sm tracking-[0.3em] uppercase text-cream/80 mb-3">Nature's corridor</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-cream">
              Where Healing <span className="italic font-normal">Grows</span>
            </h2>
          </div>
        </motion.div>

        {/* Chapter 5: Herb Close-up */}
        <motion.div
          style={{ scale: closeupScale, opacity: closeupOpacity }}
          className="absolute inset-0"
        >
          <img
            src={gardenCloseup}
            alt="Close-up of medicinal herbs and flowers"
            className="w-full h-full object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-transparent to-foreground/30" />
        </motion.div>
        <motion.div
          style={{ opacity: closeupTextOpacity }}
          className="absolute inset-0 flex items-end justify-start p-12 md:p-20 z-10"
        >
          <div>
            <p className="font-body text-sm tracking-[0.3em] uppercase text-cream/80 mb-3">Hand-picked</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-cream">
              Pure <span className="italic font-normal">Botanicals</span>
            </h2>
            <p className="font-body text-cream/70 mt-4 max-w-sm">
              Lavender, chamomile, rosemary — each ingredient selected for its healing power
            </p>
          </div>
        </motion.div>

        {/* Chapter 6: Gate (Closed) */}
        <motion.div
          style={{ scale: gateScale, opacity: gateOpacity }}
          className="absolute inset-0"
        >
          <img
            src={gardenGate}
            alt="Ornate garden gate ahead"
            className="w-full h-full object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/10 via-transparent to-foreground/20" />
        </motion.div>
        <motion.div
          style={{ opacity: gateTextOpacity }}
          className="absolute inset-0 flex items-center justify-center z-10"
        >
          <div className="text-center">
            <p className="font-body text-sm tracking-[0.3em] uppercase text-cream/80 mb-3">You've arrived</p>
            <h2 className="font-display text-3xl md:text-5xl font-bold text-cream">
              The Gate to <span className="italic font-normal">Wellness</span>
            </h2>
          </div>
        </motion.div>

        {/* Chapter 7: Gate Opens */}
        <motion.div
          style={{ scale: gateOpenScale, opacity: gateOpenOpacity }}
          className="absolute inset-0"
        >
          <img
            src={gateOpen}
            alt="Gate opening to reveal the world beyond"
            className="w-full h-full object-cover"
            loading="lazy"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 via-transparent to-transparent" />
        </motion.div>

        {/* White flash transition to products */}
        <motion.div
          style={{ opacity: whiteFlash }}
          className="absolute inset-0 bg-background z-30"
        />

        {/* Progress bar */}
        <motion.div
          style={{ scaleX: scrollYProgress }}
          className="absolute top-0 left-0 right-0 h-[2px] bg-gold origin-left z-40"
        />
      </div>
    </section>
  );
};

export default ScrollJourney;
