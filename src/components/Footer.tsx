const Footer = () => {
  return (
    <footer className="bg-primary py-16">
      <div className="container mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-2">
            <h3 className="font-display text-2xl font-bold text-primary-foreground mb-4">FLORVIA</h3>
            <p className="font-body text-primary-foreground/70 max-w-sm leading-relaxed">
              Organic health & wellness, crafted from nature's finest botanicals. 
              From our garden to your wellness routine.
            </p>
          </div>
          <div>
            <h4 className="font-body text-sm font-semibold tracking-widest uppercase text-primary-foreground mb-4">Shop</h4>
            <ul className="space-y-3">
              {["All Products", "Supplements", "Teas", "Skincare"].map((item) => (
                <li key={item}>
                  <a href="#" className="font-body text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-body text-sm font-semibold tracking-widest uppercase text-primary-foreground mb-4">Company</h4>
            <ul className="space-y-3">
              {["Our Story", "Garden", "Sustainability", "Contact"].map((item) => (
                <li key={item}>
                  <a href="#" className="font-body text-primary-foreground/60 hover:text-primary-foreground transition-colors text-sm">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="border-t border-primary-foreground/20 pt-8 text-center">
          <p className="font-body text-primary-foreground/50 text-sm">
            © 2026 Florvia. All rights reserved. Organic wellness from the garden.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
