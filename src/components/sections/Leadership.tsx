import { Facebook } from "lucide-react";

// X (formerly Twitter) icon
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);
import { useInView } from "@/hooks/useInView";
import johnCharlesPhoto from "@/assets/john-charles.png";

const Leadership = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section id="leadership" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Dramatic Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large Radial Spotlight Gradients */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1)_0%,transparent_60%)] 
          animate-breathe" />
        
        {/* Elegant spotlight beams */}
        <div className="absolute top-0 left-[30%] w-[300px] h-[600px] 
          bg-gradient-to-b from-primary/5 via-primary/3 to-transparent 
          rotate-12 blur-2xl animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute top-0 right-[25%] w-[250px] h-[500px] 
          bg-gradient-to-b from-primary/4 via-primary/2 to-transparent 
          -rotate-12 blur-2xl animate-float-delayed" style={{ animationDelay: "2s" }} />
        
        {/* Floating Light Orbs */}
        <div className="absolute top-20 left-[15%] w-48 h-48 rounded-full 
          bg-[radial-gradient(circle,hsl(var(--primary)/0.12)_0%,transparent_70%)] 
          animate-float blur-xl" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-24 right-[10%] w-64 h-64 rounded-full 
          bg-[radial-gradient(circle,hsl(var(--primary)/0.1)_0%,transparent_70%)] 
          animate-float-delayed blur-xl" style={{ animationDelay: "2s" }} />
        <div className="absolute top-40 right-[20%] w-36 h-36 rounded-full 
          bg-[radial-gradient(circle,hsl(var(--primary)/0.08)_0%,transparent_70%)] 
          animate-float blur-xl" style={{ animationDelay: "4s" }} />
        <div className="absolute bottom-40 left-[25%] w-40 h-40 rounded-full 
          bg-[radial-gradient(circle,hsl(227_80%_70%/0.1)_0%,transparent_70%)] 
          animate-float blur-xl" style={{ animationDelay: "1s" }} />
        
        {/* Subtle Grid */}
        <div className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "80px 80px",
            maskImage: "radial-gradient(ellipse at center, black 20%, transparent 70%)"
          }} />

        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-primary/20 animate-particle"
            style={{
              left: `${8 + (i * 6)}%`,
              bottom: "-10px",
              animationDelay: `${i * 0.7}s`,
              animationDuration: `${8 + (i % 4) * 2}s`
            }}
          />
        ))}
        
        {/* Subtle Gradient Mesh */}
        <div className="absolute inset-0 opacity-40">
          <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-gradient-to-br from-primary/5 to-transparent 
            animate-gradient-shift" />
          <div className="absolute bottom-0 right-0 w-1/2 h-1/2 bg-gradient-to-tl from-primary/5 to-transparent 
            animate-gradient-shift" style={{ animationDelay: "4s" }} />
        </div>
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div 
          ref={ref}
          className={`text-center space-y-4 mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground">
            Leadership
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the visionary behind Zymaxon.
          </p>
        </div>

        {/* Leader Card */}
        <div 
          className={`max-w-md mx-auto transition-all duration-700 delay-200 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="group p-8 rounded-2xl bg-card border border-border/50 shadow-card 
            transition-all duration-500 hover:shadow-card-hover text-center relative overflow-hidden">
            {/* Card shimmer effect on hover */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/5 to-transparent 
                -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            </div>
            
            {/* Photo with rotating ring */}
            <div className="relative w-32 h-32 mx-auto mb-6">
              {/* Rotating gradient ring */}
              <div className="absolute inset-0 rounded-full animate-spin-slow" 
                style={{ 
                  background: "conic-gradient(from 0deg, hsl(var(--primary)/0.4), transparent, hsl(var(--primary)/0.4))",
                  animationDuration: "8s"
                }} />
              
              {/* Pulsing glow */}
              <div className="absolute inset-1 rounded-full bg-primary/20 animate-glow-pulse" />
              
              {/* Inner circle with photo */}
              <div className="absolute inset-2 rounded-full overflow-hidden 
                border-4 border-card transition-all duration-300 group-hover:border-primary/40">
                <img 
                  src={johnCharlesPhoto} 
                  alt="John Charles - Founder & CEO of Zymaxon"
                  className="w-full h-full object-cover object-top"
                />
              </div>
            </div>

            <h3 className="text-2xl font-display font-semibold text-foreground mb-1">
              John Charles
            </h3>
            <p className="text-primary font-medium mb-4">
              Founder & CEO
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Visionary entrepreneur dedicated to building AI-powered platforms that connect people 
              with opportunities and transform how we work, shop, and grow.
            </p>

            {/* Social Links with bounce hover */}
            <div className="flex items-center justify-center gap-4">
              <a 
                href="https://x.com/Charles05234900"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center 
                  text-muted-foreground transition-all duration-300 
                  hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:-translate-y-1
                  hover:shadow-lg hover:shadow-primary/25"
                aria-label="X (Twitter)"
              >
                <XIcon className="w-5 h-5" />
              </a>
              <a 
                href="https://www.facebook.com/share/16poviq1NY/"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center 
                  text-muted-foreground transition-all duration-300 
                  hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:-translate-y-1
                  hover:shadow-lg hover:shadow-primary/25"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leadership;