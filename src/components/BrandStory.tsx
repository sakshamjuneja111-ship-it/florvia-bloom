import { motion } from "framer-motion";

const values = [
  { icon: "🌿", title: "100% Organic", desc: "Every ingredient certified organic and sustainably sourced" },
  { icon: "🔬", title: "Science-Backed", desc: "Formulated with research-driven botanical science" },
  { icon: "🌍", title: "Earth-Friendly", desc: "Zero-waste packaging and carbon-neutral operations" },
];

const BrandStory = () => {
  return (
    <section id="story" className="relative py-32 bg-card overflow-hidden">
      <div className="absolute inset-0 opacity-20" style={{
        background: "radial-gradient(circle at 80% 30%, hsl(var(--sage-light) / 0.4) 0%, transparent 50%)"
      }} />

      <div className="container mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-20">
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="font-body text-sm tracking-[0.3em] uppercase text-sage mb-4"
          >
            Our Philosophy
          </motion.p>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8"
          >
            Wellness Rooted in
            <br />
            <span className="italic font-normal text-forest-light">Authenticity</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="font-body text-lg text-muted-foreground leading-relaxed"
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
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              viewport={{ once: true }}
              className="bg-background rounded-2xl p-8 border border-border text-center hover:shadow-lg transition-shadow duration-500"
            >
              <span className="text-4xl mb-4 block">{value.icon}</span>
              <h3 className="font-display text-xl font-semibold text-foreground mb-3">{value.title}</h3>
              <p className="font-body text-muted-foreground">{value.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandStory;
