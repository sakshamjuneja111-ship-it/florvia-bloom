import { useRef, useEffect } from "react";
import { motion, useInView } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import product1 from "@/assets/product-1.jpg";
import product2 from "@/assets/product-2.jpg";
import product3 from "@/assets/product-3.jpg";
import product4 from "@/assets/product-4.jpg";

gsap.registerPlugin(ScrollTrigger);

const products = [
  { img: product1, name: "Herbal Vitality Blend", price: "$38", tag: "Bestseller", desc: "Premium organic supplement for daily energy" },
  { img: product2, name: "Botanical Tea Collection", price: "$24", tag: "New", desc: "Hand-blended herbal teas for calm & clarity" },
  { img: product3, name: "Golden Radiance Serum", price: "$52", tag: "Popular", desc: "Nourishing skincare from nature's finest oils" },
  { img: product4, name: "Essential Oil Harmony", price: "$32", tag: "Organic", desc: "Therapeutic-grade essential oil blend" },
];

const ease = [0.16, 1, 0.3, 1] as const;

const ProductCard = ({ product, index }: { product: typeof products[0]; index: number }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);

  // GSAP magnetic hover effect
  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
      const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

      gsap.to(card, {
        rotateY: x * 8,
        rotateX: -y * 8,
        transformPerspective: 800,
        duration: 0.4,
        ease: "power2.out",
      });

      if (imgRef.current) {
        gsap.to(imgRef.current, {
          scale: 1.06,
          x: x * 8,
          y: y * 8,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    };

    const handleMouseLeave = () => {
      gsap.to(card, {
        rotateY: 0,
        rotateX: 0,
        duration: 0.6,
        ease: "elastic.out(1, 0.5)",
      });
      if (imgRef.current) {
        gsap.to(imgRef.current, {
          scale: 1,
          x: 0,
          y: 0,
          duration: 0.6,
          ease: "power2.out",
        });
      }
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);
    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease, delay: index * 0.12 }}
      viewport={{ once: true, margin: "-60px" }}
      className="group cursor-pointer"
    >
      <div
        ref={cardRef}
        className="relative rounded-2xl overflow-hidden aspect-square mb-5"
        style={{
          background: "linear-gradient(135deg, hsl(var(--cream-dark) / 0.3), hsl(var(--card)))",
          boxShadow: "0 8px 32px hsla(150, 30%, 12%, 0.08), 0 2px 8px hsla(150, 30%, 12%, 0.04)",
          transformStyle: "preserve-3d",
        }}
      >
        <img
          ref={imgRef}
          src={product.img}
          alt={product.name}
          className="w-full h-full object-cover"
          loading="lazy"
          width={800}
          height={800}
          style={{ willChange: "transform" }}
        />
        <div className="absolute top-4 left-4 z-10">
          <span
            className="px-3.5 py-1 rounded-full text-[10px] font-body font-medium tracking-[0.1em] uppercase"
            style={{
              background: "hsl(var(--primary) / 0.9)",
              color: "hsl(var(--primary-foreground))",
              backdropFilter: "blur(8px)",
            }}
          >
            {product.tag}
          </span>
        </div>
        {/* Hover shimmer overlay */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700"
          style={{
            background: "linear-gradient(135deg, hsla(38, 50%, 70%, 0.08) 0%, transparent 50%, hsla(38, 50%, 70%, 0.05) 100%)",
          }}
        />
      </div>
      <h3 className="font-display text-lg font-semibold text-foreground group-hover:text-forest-light transition-colors duration-500">
        {product.name}
      </h3>
      <p className="font-body text-sm text-muted-foreground mt-1.5 leading-relaxed">{product.desc}</p>
      <p className="font-body text-lg font-semibold text-accent mt-3">{product.price}</p>
    </motion.div>
  );
};

const ProductsSection = () => {
  return (
    <section id="products" className="relative overflow-hidden" style={{ background: "hsl(var(--background))" }}>
      {/* Soft atmospheric entry — continues the bloom from the gate */}
      <div className="absolute top-0 left-0 right-0 h-64 pointer-events-none" style={{
        background: "linear-gradient(to bottom, hsl(var(--cream)) 0%, hsl(var(--background)) 100%)"
      }} />
      <div className="absolute top-0 left-0 right-0 h-96 pointer-events-none opacity-30" style={{
        background: "radial-gradient(ellipse at 50% 0%, hsla(38, 50%, 70%, 0.4) 0%, transparent 60%)"
      }} />

      {/* Intro */}
      <div className="pt-40 pb-20 md:pt-52 md:pb-28 text-center px-6 relative">
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease }}
          viewport={{ once: true }}
          className="font-body text-xs tracking-[0.4em] uppercase text-muted-foreground/70 mb-5"
        >
          Welcome to Florvia
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease, delay: 0.1 }}
          viewport={{ once: true }}
          className="font-display text-4xl md:text-5xl lg:text-6xl font-bold text-foreground leading-tight"
        >
          Harvested for <span className="italic font-light text-forest-light">You</span>
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease, delay: 0.2 }}
          viewport={{ once: true }}
          className="font-body text-muted-foreground mt-5 text-base max-w-md mx-auto leading-relaxed"
        >
          From our botanical garden to your wellness routine — pure, potent, and organic.
        </motion.p>
      </div>

      {/* Product grid */}
      <div className="container mx-auto px-6 pb-32">
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {products.map((product, i) => (
            <ProductCard key={product.name} product={product} index={i} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease }}
          viewport={{ once: true }}
          className="text-center mt-20"
        >
          <a
            href="#"
            className="inline-block border px-12 py-4 rounded-full font-body font-medium tracking-[0.15em] text-sm uppercase transition-all duration-500 hover:shadow-lg"
            style={{
              borderColor: "hsl(var(--primary) / 0.4)",
              color: "hsl(var(--primary))",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget;
              const primary = getComputedStyle(el).getPropertyValue('--primary').trim();
              const primaryFg = getComputedStyle(el).getPropertyValue('--primary-foreground').trim();
              gsap.to(el, {
                backgroundColor: `hsl(${primary})`,
                color: `hsl(${primaryFg})`,
                duration: 0.4,
                ease: "power2.out",
              });
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget;
              const primary = getComputedStyle(el).getPropertyValue('--primary').trim();
              gsap.to(el, {
                backgroundColor: "transparent",
                color: `hsl(${primary})`,
                duration: 0.4,
                ease: "power2.out",
              });
            }}
          >
            Explore All Products
          </a>
        </motion.div>
      </div>
    </section>
  );
};

export default ProductsSection;
