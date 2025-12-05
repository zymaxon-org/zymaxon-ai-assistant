import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const Hero = () => {
  const scrollToCompanies = () => {
    document.getElementById("companies")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-accent/30" />
      
      {/* Subtle pattern overlay */}
      <div 
        className="absolute inset-0 opacity-[0.015]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }}
      />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Logo placeholder - user will provide */}
          <div className="animate-fade-in-up opacity-0">
            <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-primary flex items-center justify-center shadow-card">
              <span className="text-4xl md:text-5xl font-display font-bold text-primary-foreground">Z</span>
            </div>
          </div>

          {/* Main headline */}
          <div className="space-y-4 animate-fade-in-up opacity-0 delay-100">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight text-foreground">
              Zymaxon
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
              Building platforms powered by AI
            </p>
          </div>

          {/* CTA Button */}
          <div className="animate-fade-in-up opacity-0 delay-200 pt-4">
            <Button 
              size="lg" 
              onClick={scrollToCompanies}
              className="group px-8 py-6 text-lg font-medium transition-all duration-300 hover:shadow-card-hover"
            >
              Explore Our Companies
              <ArrowDown className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-fade-in opacity-0 delay-500">
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
