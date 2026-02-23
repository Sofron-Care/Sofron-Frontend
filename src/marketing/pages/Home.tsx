import MarketingLayout from "../components/MarketingLayout";
import HeroSection from "../components/sections/HeroSection";
import ProblemSection from "../components/sections/ProblemSection";
import SolutionSection from "../components/sections/SolutionSection";
import HowItWorksSection from "../components/sections/HowItWorksSection";
import CTASection from "../components/sections/CTASection";

export default function Home() {
  return (
    <MarketingLayout>
      <HeroSection />
      <ProblemSection />
      <SolutionSection />
      <HowItWorksSection />
      <CTASection />
    </MarketingLayout>
  );
}
