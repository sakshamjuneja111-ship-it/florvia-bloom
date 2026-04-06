import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import GardenSection from "@/components/GardenSection";
import ProductsSection from "@/components/ProductsSection";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="bg-background">
      <Navbar />
      <HeroSection />
      <GardenSection />
      <ProductsSection />
      <BrandStory />
      <Footer />
    </div>
  );
};

export default Index;
