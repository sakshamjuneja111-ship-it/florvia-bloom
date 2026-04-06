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

const ProductsSection = () => {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="products" className="relative py-32 bg-background overflow-hidden">
      {/* Full-width products hero */}
      <div className="relative h-[50vh] mb-24 overflow-hidden">
        <motion.img
          initial={{ scale: 1.1 }}
          whileInView={{ scale: 1 }}
          transition={{ duration: 1.5 }}
          viewport={{ once: true }}
          src={productsHero}
          alt="Florvia organic wellness products"
          className="w-full h-full object-cover"
          loading="lazy"
          width={1920}
          height={1080}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background via-transparent to-background" />
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="font-display text-4xl md:text-6xl font-bold text-foreground text-center"
          >
            Harvested for <span className="italic font-normal text-forest-light">You</span>
          </motion.h2>
        </div>
      </div>

      <div ref={ref} className="container mx-auto px-6">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product, i) => (
            <motion.div
              key={product.name}
              initial={{ opacity: 0, y: 40 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: i * 0.15 }}
              className="group cursor-pointer"
            >
              <div className="relative rounded-2xl overflow-hidden aspect-square mb-4 bg-card">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  loading="lazy"
                  width={800}
                  height={800}
                />
                <div className="absolute top-4 left-4">
                  <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-body font-medium tracking-wide">
                    {product.tag}
                  </span>
                </div>
                <div className="absolute inset-0 bg-foreground/0 group-hover:bg-foreground/10 transition-colors duration-500" />
              </div>
              <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-forest-light transition-colors">
                {product.name}
              </h3>
              <p className="font-body text-sm text-muted-foreground mt-1">{product.desc}</p>
              <p className="font-body text-lg font-semibold text-accent mt-2">{product.price}</p>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mt-16"
        >
          <a
            href="#"
            className="inline-block bg-primary text-primary-foreground px-10 py-4 rounded-full font-body font-medium tracking-wide text-lg hover:bg-forest-light transition-colors"
          >
            Explore All Products
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
