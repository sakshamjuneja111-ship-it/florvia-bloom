import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";
import productsHero from "@/assets/products-hero.jpg";

const products = [
  { img: product1, name: "Herbal Vitality Blend", price: "$38", tag: "Bestseller", desc: "Premium organic supplement for daily energy" },
  { img: product2, name: "Botanical Tea Collection", price: "$24", tag: "New", desc: "Hand-blended herbal teas for calm & clarity" },
  { img: product3, name: "Golden Radiance Serum", price: "$52", tag: "Popular", desc: "Nourishing skincare from nature's finest oils" },
  { img: product4, name: "Essential Oil Harmony", price: "$32", tag: "Organic", desc: "Therapeutic-grade essential oil blend" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const ProductsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const heroRef = useRef<HTMLDivElement>(null);
  const heroInView = useInView(heroRef, { once: true });

  return (
    <section id="products" className="relative bg-background overflow-hidden">
      {/* Intro text after gate */}
      <div className="py-32 md:py-44 text-center px-6">
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease }}
          viewport={{ once: true }}
          className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground mb-6"
        >
          Welcome to Florvia
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.15 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight"
        >
          Harvested for <span className="italic font-light text-forest-light">You</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.3 }}
          viewport={{ once: true }}
          className="font-body text-muted-foreground mt-6 text-lg max-w-lg mx-auto"
        >
          From our botanical garden to your wellness routine — pure, potent, and organic.
        </motion.p>
      </div>

      {/* Products hero banner */}
      <div ref={heroRef} className="relative h-[60vh] overflow-hidden mx-6 md:mx-12 rounded-2xl mb-24">
        <motion.img
          initial={{ scale: 1.15 }}
          animate={heroInView ? { scale: 1 } : {}}
          transition={{ duration: 2, ease }}
          src={productsHero}
          alt="Florvia organic wellness products"
          className="w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/20 to-transparent" />
      </div>

      {/* Product grid */}
      <div ref={ref} className="container mx-auto px-6 pb-32">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 50 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.9, ease, delay: i * 0.12 }}
              className="group cursor-pointer"
            >
              <div className="relative rounded-xl overflow-hidden aspect-square mb-5 bg-card">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-105"
                  loading="lazy"
                  width={800}
                  height={800}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary/90 text-primary-foreground px-3.5 py-1 rounded-full text-[10px] font-body font-medium tracking-[0.1em] uppercase">
                    {product.tag}
                  </span>
                </div>
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/5 transition-colors duration-700" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-forest-light transition-colors duration-500">
                {product.name}
              </h3>
              <p className="font-body text-sm text-muted-foreground mt-1.5 leading-relaxed">{product.desc}</p>
              <p className="font-body text-lg font-semibold text-accent mt-3">{product.price}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <a
            href="#"
            className="inline-block border border-primary text-primary px-12 py-4 rounded-full font-body font-medium tracking-[0.15em] text-sm uppercase hover:bg-primary hover:text-primary-foreground transition-all duration-500"
          >
            Explore All Products
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
