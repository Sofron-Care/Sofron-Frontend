import Nav from "../components/Nav";
import HeroSection from "./../components/HeroSection";
import ProblemSection from "./../components/ProblemSection";
import SolutionSection from "./../components/SolutionSection";
import HowItWorksSection from "./../components/HowItWorksSection";
import CTASection from "./../components/CTASection";
import Footer from "../components/Footer";

export default function Entry() {
  return (
    <div>
      <Nav />

      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <HowItWorksSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  );
}
