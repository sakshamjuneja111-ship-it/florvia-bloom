const Footer = () => {
  return (
    <footer className="relative overflow-hidden" style={{
      background: "linear-gradient(180deg, hsl(var(--background)) 0%, hsl(var(--primary)) 15%, hsl(var(--primary)) 100%)"
    }}>
      <div className="container mx-auto px-6 pt-24 pb-16">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl font-bold text-primary-foreground mb-4">FLORVIA</h3>
            <p className="font-body text-primary-foreground/60 max-w-sm leading-relaxed text-sm">
              Organic health & wellness, crafted from nature's finest botanicals. 
              From our garden to your wellness routine.
            </p>
          </div>
          <div>
            <h4 className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-primary-foreground/80 mb-4">Shop</h4>
            <ul className="space-y-3">
              {["All Products", "Supplements", "Teas", "Skincare"].map((item) => (
                <li key={item}>
                  <a href="#" className="font-body text-primary-foreground/50 hover:text-primary-foreground transition-colors duration-500 text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-body text-xs font-semibold tracking-[0.2em] uppercase text-primary-foreground/80 mb-4">Company</h4>
            <ul className="space-y-3">
              {["Our Story", "Garden", "Sustainability", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="font-body text-primary-foreground/50 hover:text-primary-foreground transition-colors duration-500 text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/10 pt-8 text-center">
          <p className="font-body text-primary-foreground/40 text-xs tracking-wider">
            © 2026 Florvia. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
