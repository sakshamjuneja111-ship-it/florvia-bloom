import { useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "framer-motion";
import gardenPathway from "@/assets/garden-pathway.jpg";
import gardenCloseup from "@/assets/garden-closeup.jpg";

const GardenSection = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(titleRef, { once: true, margin: "-100px" });

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start end", "end start"],
  });

  const pathwayY = useTransform(scrollYProgress, [0, 1], [100, -100]);
  const closeupY = useTransform(scrollYProgress, [0, 1], [200, -50]);
  const pathwayScale = useTransform(scrollYProgress, [0, 0.5], [1.1, 1]);
  const closeupScale = useTransform(scrollYProgress, [0.3, 0.8], [1.2, 1]);

  return (
    <section id="garden" ref={sectionRef} className="relative py-32 overflow-hidden bg-background">
      <div className="absolute inset-0 opacity-30" style={{
        background: "radial-gradient(ellipse at 30% 20%, hsl(var(--sage-light) / 0.3) 0%, transparent 60%), radial-gradient(ellipse at 70% 80%, hsl(var(--gold-light) / 0.2) 0%, transparent 50%)"
      }} />

      <div ref={titleRef} className="container mx-auto px-6 text-center mb-20">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="font-body text-sm tracking-[0.3em] uppercase text-sage mb-4"
        >
          Enter the Garden
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-display text-4xl md:text-6xl font-bold text-foreground"
        >
          Where Wellness
          <br />
          <span className="italic font-normal text-forest-light">Begins</span>
        </motion.h2>
      </div>

      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-2 gap-8 items-center">
          <motion.div
            style={{ y: pathwayY, scale: pathwayScale }}
            className="relative rounded-2xl overflow-hidden aspect-[3/4]"
          >
            <img
              src={gardenPathway}
              alt="Botanical garden pathway"
              className="w-full h-full object-cover"
              loading="lazy"
              width={1920}
              height={1080}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-foreground/30 to-transparent" />
            <div className="absolute bottom-8 left-8 right-8">
              <p className="font-display text-2xl text-cream font-semibold">
                Walk the Path
              </p>
              <p className="font-body text-cream/80 text-sm mt-2">
                Every ingredient tells a story of purity and purpose
              </p>
            </div>
          </motion.div>

          <div className="space-y-8">
            <motion.div
              style={{ y: closeupY, scale: closeupScale }}
              className="relative rounded-2xl overflow-hidden aspect-[4/3]"
            >
              <img
                src={gardenCloseup}
                alt="Medicinal herbs and flowers in the garden"
                className="w-full h-full object-cover"
                loading="lazy"
                width={1920}
                height={1080}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-foreground/20 to-transparent" />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bg-card rounded-2xl p-8 border border-border"
            >
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">
                Rooted in Nature
              </h3>
              <p className="font-body text-muted-foreground leading-relaxed">
                Our botanical garden is where science meets nature. Every herb, every flower, 
                every leaf is cultivated with intention — to bring you wellness that's pure, 
                potent, and truly organic.
              </p>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default GardenSection;
