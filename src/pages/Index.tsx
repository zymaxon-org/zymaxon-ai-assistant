import Header from "@/components/Header";
import Hero from "@/components/sections/Hero";
import About from "@/components/sections/About";
import ZymaxonAI from "@/components/sections/ZymaxonAI";
import Companies from "@/components/sections/Companies";
import HowItWorks from "@/components/sections/HowItWorks";
import Leadership from "@/components/sections/Leadership";
import Footer from "@/components/sections/Footer";

const Index = () => {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <About />
      <ZymaxonAI />
      <Companies />
      <HowItWorks />
      <Leadership />
      <Footer />
    </main>
  );
};

export default Index;
