import HeroSection from "../components/business/sections/HeroSection";
import WhyArrivioSection from "../components/business/sections/WhyArrivioSection";
import TrustedBySection from "../components/business/sections/TrustedBySection";
import HowItWorksSection from "../components/business/sections/HowItWorksSection";
import Schedule from "../components/business/sections/Schedule";
import Footer from "../components/layout/Footer";

const Business = () => {
  return (
    <div className="min-h-screen bg-[#EAE8E4]">
      <HeroSection />
      <WhyArrivioSection />
      <TrustedBySection />
      <HowItWorksSection />
      <Schedule />
      <Footer />
    </div>
  );
};

export default Business;

