import { useInView } from "@/hooks/useInView";
import { useEffect, useState } from "react";

const About = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [countersStarted, setCountersStarted] = useState(false);

  useEffect(() => {
    if (isInView && !countersStarted) {
      setCountersStarted(true);
    }
  }, [isInView, countersStarted]);

  return (
    <section id="about" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient Blobs */}
        <div className="absolute top-10 left-[10%] w-[500px] h-[500px] rounded-full 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.06)_0%,transparent_70%)] 
          animate-gradient-shift blur-3xl" />
        <div className="absolute bottom-10 right-[10%] w-[400px] h-[400px] rounded-full 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08)_0%,transparent_70%)] 
          animate-gradient-shift blur-3xl" style={{ animationDelay: "4s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.04)_0%,transparent_70%)] 
          animate-breathe blur-2xl" />
        
        {/* Floating Particles */}
        {[...Array(12)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/30 animate-particle"
            style={{
              left: `${10 + (i * 7)}%`,
              bottom: "-10px",
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${8 + (i % 4) * 2}s`
            }}
          />
        ))}
        
        {/* Subtle Connection Grid */}
        <div className="absolute inset-0 opacity-[0.03] animate-grid-pulse"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "60px 60px"
          }} />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div 
          ref={ref}
          className={`max-w-4xl mx-auto text-center space-y-8 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground">
            About Zymaxon
          </h2>
          
          <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
            <p>
              Zymaxon builds technology companies powered by artificial intelligence. 
              We create platforms that help people connect, find opportunities, and grow—all 
              enhanced by our proprietary AI infrastructure.
            </p>
            <p>
              As a technology holding company, we develop and operate a portfolio of consumer 
              platforms under the Vivesa brand, each designed to solve real problems in 
              marketplaces, commerce, employment, and professional development.
            </p>
          </div>

          {/* Animated Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50 relative">
            {/* Animated border gradient */}
            <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent 
              animate-shimmer" />
            
            <div className="space-y-2 group">
              <p className={`text-3xl md:text-4xl font-display font-bold text-primary transition-all duration-300 
                ${countersStarted ? "animate-glow-pulse" : ""} group-hover:scale-110`}>
                <AnimatedCounter target={6} started={countersStarted} />
              </p>
              <p className="text-sm md:text-base text-muted-foreground">Platforms</p>
            </div>
            <div className="space-y-2 group">
              <p className={`text-3xl md:text-4xl font-display font-bold text-primary transition-all duration-300 
                ${countersStarted ? "animate-glow-pulse" : ""} group-hover:scale-110`}
                style={{ animationDelay: "0.2s" }}>
                <AnimatedCounter target={1} started={countersStarted} />
              </p>
              <p className="text-sm md:text-base text-muted-foreground">AI Engine</p>
            </div>
            <div className="space-y-2 group">
              <p className={`text-3xl md:text-4xl font-display font-bold text-primary transition-all duration-300 
                ${countersStarted ? "animate-glow-pulse" : ""} group-hover:scale-110`}
                style={{ animationDelay: "0.4s" }}>
                ∞
              </p>
              <p className="text-sm md:text-base text-muted-foreground">Possibilities</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

// Animated counter component
const AnimatedCounter = ({ target, started }: { target: number; started: boolean }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!started) return;
    
    let current = 0;
    const duration = 1500;
    const increment = target / (duration / 50);
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(current));
      }
    }, 50);

    return () => clearInterval(timer);
  }, [started, target]);

  return <>{count}</>;
};

export default About;
