import NavBar from "./home/NavBar";
import HeroSection from "./home/HeroSection";
import TrustStrip from "./home/TrustStrip";
import StatsSection from "./home/StatsSection";
import HowItWorksSection from "./home/HowItWorksSection";
import FeaturesSection from "./home/FeaturesSection";
import WhoForSection from "./home/WhoForSection";
import TestimonialsSection from "./home/TestimonialsSection";
import CTASection from "./home/CTASection";
import FooterSection from "./home/FooterSection";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden w-full">
      <NavBar />
      <HeroSection />
      <TrustStrip />
      <StatsSection />
      <HowItWorksSection />
      <FeaturesSection />
      <WhoForSection />
      <TestimonialsSection />
      {/* <GallerySection /> */}
      <CTASection />
      <FooterSection />
    </div>
  );
}
