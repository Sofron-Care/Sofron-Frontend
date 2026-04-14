import Nav from "../components/Nav";
import HeroSection from "./../components/HeroSection";
import ProblemSection from "./../components/ProblemSection";
import SolutionSection from "./../components/SolutionSection";
import HowItWorksSection from "./../components/HowItWorksSection";
import CTASection from "./../components/CTASection";
import Footer from "../components/Footer";
import { useState } from "react";
import DemoEntryModal from "../../../demo/components/DemoEntryModal";
import { useDemo } from "../../../demo/useDemo";
import { useNavigate } from "react-router-dom";

export default function Entry() {
  const [open, setOpen] = useState(true);

  const { setMode, setRole, loginAs } = useDemo();
  const navigate = useNavigate();

  const startDemo = async (
    mode: "guided" | "free",
    role: "clinicAdmin" | "client",
  ) => {
    setMode(mode);
    setRole(role);

    await loginAs(role);

    setOpen(false);

    if (role === "client") {
      navigate("/demo");
    } else {
      navigate("/demo/app");
    }
  };

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

      <DemoEntryModal open={open} onSelect={startDemo} />
    </div>
  );
}
