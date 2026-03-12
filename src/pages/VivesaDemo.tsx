import DemoHero from "@/components/vivesa-demo/DemoHero";
import EscrowFlowAnimation from "@/components/vivesa-demo/EscrowFlowAnimation";
import InteractiveDemo from "@/components/vivesa-demo/InteractiveDemo";
import FeaturesGrid from "@/components/vivesa-demo/FeaturesGrid";
import DownloadSection, { generateWhitepaper } from "@/components/vivesa-demo/DownloadSection";
import Footer from "@/components/sections/Footer";

const VivesaDemo = () => {
  return (
    <main className="min-h-screen bg-background dark">
      <DemoHero onDownload={generateWhitepaper} />
      <EscrowFlowAnimation />
      <InteractiveDemo />
      <FeaturesGrid />
      <DownloadSection />
      <Footer />
    </main>
  );
};

export default VivesaDemo;
