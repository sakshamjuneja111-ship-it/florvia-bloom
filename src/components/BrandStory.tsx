import { motion } from "framer-motion";

const ease = [0.16, 1, 0.3, 1] as const;

const values = [
  { icon: "🌿", title: "100% Organic", desc: "Every ingredient certified organic and sustainably sourced" },
  { icon: "🔬", title: "Science-Backed", desc: "Formulated with research-driven botanical science" },
  { icon: "🌍", title: "Earth-Friendly", desc: "Zero-waste packaging and carbon-neutral operations" },
];

const BrandStory = () => {
  return (
    <section id="story" className="relative py-32 md:py-44 overflow-hidden" style={{
      background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--card)) 40%, hsl(var(--card)) 60%, hsl(var(--background)) 100%)"
    }}>
      {/* Soft ambient glow */}
      <div className="absolute inset-0 pointer-events-none opacity-20" style={{
        background: "radial-gradient(ellipse at 70% 20%, hsla(38, 45%, 65%, 0.3) 0%, transparent 50%), radial-gradient(ellipse at 30% 80%, hsla(100, 25%, 55%, 0.15) 0%, transparent 45%)"
      }} />

      <div className="container mx-auto px-6 relative">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease }}
            viewport={{ once: true }}
            className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground/70 mb-6"
          >
            Our Philosophy
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, ease, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground mb-10"
          >
            Wellness Rooted in
            <br />
            <span className="italic font-light text-forest-light">Authenticity</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease, delay: 0.2 }}
            viewport={{ once: true }}
            className="font-body text-base text-muted-foreground leading-relaxed"
          >
            At Florvia, we believe true wellness starts at the source. Our botanical garden 
            isn't just where we grow ingredients — it's where we nurture a philosophy. Every 
            product is a bridge between ancient herbal wisdom and modern science.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {values.map((value, i) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 35 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease, delay: i * 0.1 }}
              viewport={{ once: true }}
              className="rounded-2xl p-10 text-center border border-border/30 hover:border-border/50 transition-all duration-700"
              style={{
                background: "linear-gradient(180deg, hsl(var(--background) / 0.6) 0%, hsl(var(--background) / 0.3) 100%)",
                backdropFilter: "blur(8px)",
              }}
            >
              <span className="text-3xl mb-6 block">{value.icon}</span>
              <h3 className="font-display text-xl font-semibold text-foreground mb-4">{value.title}</h3>
              <p className="font-body text-sm text-muted-foreground leading-relaxed">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
