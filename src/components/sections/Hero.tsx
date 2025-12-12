import { ArrowDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import zymaxonSymbol from "@/assets/zymaxon-symbol.jpg";

const Hero = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const scrollToCompanies = () => {
    document.getElementById("companies")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-accent/30" />
      
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] rounded-full opacity-30 blur-3xl animate-float"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute bottom-1/4 -right-1/4 w-[500px] h-[500px] rounded-full opacity-20 blur-3xl animate-float-delayed"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 70%)' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] rounded-full opacity-10 blur-3xl animate-breathe"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.5) 0%, transparent 60%)' }}
        />
      </div>

      {/* Animated grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03] animate-grid-pulse"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted && [...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/40 rounded-full animate-particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 4}s`,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Z Symbol Logo with glow effect */}
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative group cursor-pointer">
              {/* Outer glow pulse */}
              <div className="absolute -inset-4 rounded-full bg-primary/20 blur-2xl animate-glow-pulse" />
              {/* Rotating glow ring */}
              <div className="absolute -inset-3 rounded-full bg-gradient-to-r from-primary/40 via-transparent to-primary/40 animate-spin-slow" />
              {/* Inner breathing glow */}
              <div className="absolute -inset-1 rounded-full bg-primary/10 animate-breathe" />
              {/* Main logo image */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden shadow-card-hover transition-transform duration-500 group-hover:scale-110">
                <img 
                  src={zymaxonSymbol} 
                  alt="Zymaxon" 
                  className="w-full h-full object-cover"
                />
                {/* Shimmer effect */}
                <div className="absolute inset-0 overflow-hidden rounded-full">
                  <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />
                </div>
              </div>
            </div>
          </div>

          {/* Main headline with gradient text */}
          <div 
            className={`space-y-4 transition-all duration-1000 delay-200 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight">
              <span className="bg-gradient-to-r from-foreground via-foreground to-primary bg-clip-text text-transparent animate-gradient-shift bg-[length:200%_auto]">
                Zymaxon
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mx-auto">
              Building platforms powered by AI
            </p>
          </div>

          {/* CTA Button with shimmer */}
          <div 
            className={`pt-4 transition-all duration-1000 delay-400 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
          >
            <Button 
              size="lg" 
              onClick={scrollToCompanies}
              className="group relative px-8 py-6 text-lg font-medium overflow-hidden transition-all duration-300 hover:shadow-card-hover hover:scale-105"
            >
              {/* Button shimmer */}
              <div className="absolute inset-0 translate-x-[-100%] bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
              <span className="relative z-10 flex items-center">
                Explore Our Companies
                <ArrowDown className="ml-2 h-5 w-5 transition-transform duration-300 group-hover:translate-y-1" />
              </span>
            </Button>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div 
        className={`absolute bottom-8 left-1/2 -translate-x-1/2 transition-all duration-1000 delay-700 ${mounted ? 'opacity-100' : 'opacity-0'}`}
      >
        <div className="w-6 h-10 rounded-full border-2 border-muted-foreground/30 flex items-start justify-center p-2">
          <div className="w-1 h-2 bg-muted-foreground/50 rounded-full animate-bounce" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
