import { Linkedin, Twitter } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const Leadership = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section id="leadership" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Radial Spotlight Gradient */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08)_0%,transparent_70%)] 
          animate-breathe" />
        
        {/* Floating Light Orbs */}
        <div className="absolute top-20 left-[20%] w-32 h-32 rounded-full 
          bg-[radial-gradient(circle,hsl(var(--primary)/0.1)_0%,transparent_70%)] 
          animate-float" style={{ animationDelay: "0s" }} />
        <div className="absolute bottom-32 right-[15%] w-48 h-48 rounded-full 
          bg-[radial-gradient(circle,hsl(var(--primary)/0.08)_0%,transparent_70%)] 
          animate-float" style={{ animationDelay: "2s" }} />
        <div className="absolute top-40 right-[25%] w-24 h-24 rounded-full 
          bg-[radial-gradient(circle,hsl(var(--primary)/0.06)_0%,transparent_70%)] 
          animate-float" style={{ animationDelay: "4s" }} />
        
        {/* Subtle Gradient Mesh */}
        <div className="absolute inset-0 opacity-30">
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
              
              {/* Inner circle */}
              <div className="absolute inset-2 rounded-full bg-primary/10 flex items-center justify-center 
                border-4 border-card transition-all duration-300 group-hover:border-primary/40">
                <span className="text-4xl font-display font-bold text-primary">JC</span>
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
                href="#" 
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center 
                  text-muted-foreground transition-all duration-300 
                  hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:-translate-y-1
                  hover:shadow-lg hover:shadow-primary/25"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center 
                  text-muted-foreground transition-all duration-300 
                  hover:bg-primary hover:text-primary-foreground hover:scale-110 hover:-translate-y-1
                  hover:shadow-lg hover:shadow-primary/25"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leadership;
