import HeroSection from "../../components/business/HeroSection";
import WhyArrivioSection from "../../components/business/WhyArrivio";
import TrustedBySection from "../../components/business/TrustedBy";
import HowItWorksSection from "../../components/business/HowItWorks";
import Schedule from "../../components/business/Schedule";

const Business = () => {
    return (
        <div className="min-h-screen bg-[#EAE8E4]">
            <HeroSection />
            <WhyArrivioSection />
            <TrustedBySection />
            <HowItWorksSection />
            <Schedule />
        </div>
    );
};

export default Business;


