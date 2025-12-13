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
      {/* Dramatic Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large Gradient Blobs */}
        <div className="absolute top-0 left-[5%] w-[700px] h-[700px] rounded-full 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1)_0%,transparent_60%)] 
          animate-float blur-3xl" />
        <div className="absolute bottom-0 right-[5%] w-[600px] h-[600px] rounded-full 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12)_0%,transparent_60%)] 
          animate-float-delayed blur-3xl" style={{ animationDelay: "3s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[600px] rounded-full 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.06)_0%,transparent_70%)] 
          animate-breathe blur-2xl" />
        
        {/* Secondary accent orbs */}
        <div className="absolute top-[20%] right-[25%] w-[200px] h-[200px] rounded-full 
          bg-[radial-gradient(circle,hsl(227_90%_70%/0.08)_0%,transparent_70%)] 
          animate-float blur-xl" style={{ animationDelay: "1s" }} />
        <div className="absolute bottom-[30%] left-[20%] w-[150px] h-[150px] rounded-full 
          bg-[radial-gradient(circle,hsl(227_80%_65%/0.1)_0%,transparent_70%)] 
          animate-float-delayed blur-xl" style={{ animationDelay: "2s" }} />

        {/* Wave pattern overlay */}
        <div className="absolute inset-0 opacity-[0.02]">
          <svg className="w-full h-full" preserveAspectRatio="none" viewBox="0 0 1440 600">
            <path 
              d="M0,300 C360,200 720,400 1080,300 C1260,250 1350,350 1440,300 L1440,600 L0,600 Z" 
              fill="hsl(var(--primary))" 
              className="animate-breathe"
            />
          </svg>
        </div>
        
        {/* Floating Particles - more visible */}
        {[...Array(18)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-particle ${i % 3 === 0 ? 'w-1.5 h-1.5 bg-primary/40' : 'w-1 h-1 bg-primary/25'}`}
            style={{
              left: `${5 + (i * 5)}%`,
              bottom: "-10px",
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${7 + (i % 4) * 2}s`
            }}
          />
        ))}
        
        {/* Connection Grid with gradient fade */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px",
            maskImage: "radial-gradient(ellipse at center, black 30%, transparent 70%)"
          }} />

        {/* Floating geometric shapes */}
        {[...Array(4)].map((_, i) => (
          <div
            key={`geo-${i}`}
            className="absolute w-20 h-20 border border-primary/5 rounded-xl animate-float opacity-40"
            style={{
              left: `${10 + i * 25}%`,
              top: `${15 + (i % 2) * 50}%`,
              animationDelay: `${i * 2}s`,
              transform: `rotate(${i * 20}deg)`,
            }}
          />
        ))}
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