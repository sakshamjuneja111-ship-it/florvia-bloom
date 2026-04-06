import Navbar from "@/components/Navbar";
import ScrollJourney from "@/components/ScrollJourney";
import ProductsSection from "@/components/ProductsSection";
import BrandStory from "@/components/BrandStory";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="bg-background">
      <Navbar />
      <ScrollJourney />
      <ProductsSection />
      <BrandStory />
      <Footer />
    </div>
  );
};

export default Index;
