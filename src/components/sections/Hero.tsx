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
      {/* Multi-layer animated gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-secondary via-background to-accent/30" />
      
      {/* Animated mesh gradient overlay */}
      <div 
        className="absolute inset-0 opacity-60"
        style={{
          background: `
            radial-gradient(ellipse 80% 50% at 20% 40%, hsl(var(--primary) / 0.15) 0%, transparent 50%),
            radial-gradient(ellipse 60% 40% at 80% 60%, hsl(var(--primary) / 0.1) 0%, transparent 50%),
            radial-gradient(ellipse 50% 30% at 50% 80%, hsl(var(--primary) / 0.08) 0%, transparent 50%)
          `
        }}
      />
      
      {/* Large animated gradient blobs */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] rounded-full opacity-40 blur-3xl animate-float"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.25) 0%, transparent 60%)' }}
        />
        <div 
          className="absolute bottom-1/4 -right-1/4 w-[700px] h-[700px] rounded-full opacity-30 blur-3xl animate-float-delayed"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.3) 0%, transparent 60%)' }}
        />
        <div 
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] rounded-full opacity-15 blur-3xl animate-breathe"
          style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.4) 0%, transparent 50%)' }}
        />
        {/* Secondary accent blobs */}
        <div 
          className="absolute top-[10%] right-[20%] w-[300px] h-[300px] rounded-full opacity-20 blur-2xl animate-float"
          style={{ background: 'radial-gradient(circle, hsl(227 100% 70% / 0.4) 0%, transparent 70%)', animationDelay: '2s' }}
        />
        <div 
          className="absolute bottom-[20%] left-[15%] w-[250px] h-[250px] rounded-full opacity-25 blur-2xl animate-float-delayed"
          style={{ background: 'radial-gradient(circle, hsl(227 80% 65% / 0.3) 0%, transparent 70%)', animationDelay: '3s' }}
        />
      </div>

      {/* Animated wave patterns */}
      <div className="absolute inset-0 overflow-hidden opacity-[0.03]">
        <svg className="absolute w-full h-full" preserveAspectRatio="none">
          <defs>
            <pattern id="wave-pattern" x="0" y="0" width="100" height="20" patternUnits="userSpaceOnUse">
              <path d="M0 10 Q25 0 50 10 T100 10" fill="none" stroke="hsl(var(--primary))" strokeWidth="0.5"/>
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#wave-pattern)" className="animate-shimmer" />
        </svg>
      </div>

      {/* Animated grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.04] animate-grid-pulse"
        style={{
          backgroundImage: `
            linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
            linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
          `,
          backgroundSize: '60px 60px'
        }}
      />

      {/* Floating particles - more dense */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted && [...Array(35)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-particle ${i % 3 === 0 ? 'w-1.5 h-1.5 bg-primary/50' : 'w-1 h-1 bg-primary/30'}`}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${8 + Math.random() * 6}s`,
            }}
          />
        ))}
      </div>

      {/* Floating geometric shapes */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {mounted && [...Array(6)].map((_, i) => (
          <div
            key={`shape-${i}`}
            className="absolute w-16 h-16 border border-primary/10 rounded-lg animate-float opacity-30"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animationDelay: `${i * 1.5}s`,
              transform: `rotate(${i * 15}deg)`,
            }}
          />
        ))}
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        <div className="flex flex-col items-center text-center space-y-8">
          {/* Z Symbol Logo with enhanced glow effect */}
          <div className={`transition-all duration-1000 ${mounted ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <div className="relative group cursor-pointer">
              {/* Outer glow pulse - larger */}
              <div className="absolute -inset-8 rounded-full bg-primary/15 blur-3xl animate-glow-pulse" />
              {/* Secondary glow layer */}
              <div className="absolute -inset-6 rounded-full bg-primary/10 blur-2xl animate-breathe" />
              {/* Rotating glow ring */}
              <div className="absolute -inset-4 rounded-full bg-gradient-to-r from-primary/40 via-transparent to-primary/40 animate-spin-slow" />
              {/* Inner breathing glow */}
              <div className="absolute -inset-2 rounded-full bg-primary/10 animate-breathe" />
              {/* Main logo image */}
              <div className="relative w-28 h-28 md:w-36 md:h-36 lg:w-44 lg:h-44 rounded-full overflow-hidden shadow-card-hover transition-transform duration-500 group-hover:scale-110">
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
    </section>
  );
};

export default Hero;