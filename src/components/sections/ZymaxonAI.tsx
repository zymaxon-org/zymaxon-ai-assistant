import { Brain, MessageSquare, Layers, Zap, Globe, Shield } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const capabilities = [
  {
    icon: Brain,
    title: "Smart Recommendations",
    description: "AI-powered suggestions tailored to your preferences and behavior across all platforms."
  },
  {
    icon: MessageSquare,
    title: "Natural Language Chat",
    description: "Communicate naturally with our AI assistant in multiple languages."
  },
  {
    icon: Layers,
    title: "Cross-Platform Intelligence",
    description: "One AI profile that learns and improves across all Vivesa products."
  },
  {
    icon: Zap,
    title: "Task Automation",
    description: "Automate repetitive tasks and let AI handle the heavy lifting."
  },
  {
    icon: Globe,
    title: "Contextual Understanding",
    description: "AI that understands context and provides relevant, timely assistance."
  },
  {
    icon: Shield,
    title: "Secure & Private",
    description: "Your data is protected with enterprise-grade security and privacy controls."
  }
];

const ZymaxonAI = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section id="zymaxon-ai" className="py-24 md:py-32 bg-secondary/30 relative overflow-hidden">
      {/* Animated Tech Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Circuit Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px"
          }} />
        
        {/* Animated grid pulse overlay */}
        <div className="absolute inset-0 animate-grid-pulse opacity-[0.02]"
          style={{
            backgroundImage: `
              radial-gradient(circle at center, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px"
          }} />
        
        {/* Data Flow Particles */}
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1.5 h-1.5 rounded-full bg-primary/40 animate-particle"
            style={{
              left: `${5 + (i * 6)}%`,
              bottom: "-10px",
              animationDelay: `${i * 0.6}s`,
              animationDuration: `${6 + (i % 3) * 2}s`
            }}
          />
        ))}
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-transparent to-background/50" />
        
        {/* Central Glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08)_0%,transparent_70%)] animate-breathe" />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div 
          ref={ref}
          className={`text-center space-y-4 mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium
            animate-glow-pulse">
            <Brain className="w-4 h-4" />
            Core Innovation
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground">
            Introducing Zymaxon AI
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            One intelligent assistant across all our platforms. Zymaxon AI learns from you, 
            helps you discover, and automates your tasks—everywhere you go.
          </p>
        </div>

        {/* Capabilities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {capabilities.map((capability, index) => (
            <div
              key={capability.title}
              className={`group p-6 rounded-xl bg-card/80 backdrop-blur-sm border border-border/50 shadow-card 
                transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1 
                hover:border-primary/30 relative overflow-hidden ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isInView ? `${index * 100}ms` : "0ms" }}
            >
              {/* Shimmer effect on hover */}
              <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/10 to-transparent 
                  -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </div>
              
              {/* Icon with glow */}
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 
                transition-all duration-300 group-hover:bg-primary/20 group-hover:shadow-lg group-hover:shadow-primary/20
                relative">
                <div className="absolute inset-0 rounded-lg bg-primary/20 opacity-0 group-hover:opacity-100 
                  animate-glow-pulse transition-opacity duration-300" />
                <capability.icon className="w-6 h-6 text-primary relative z-10 transition-transform duration-300 
                  group-hover:scale-110" />
              </div>
              
              <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                {capability.title}
              </h3>
              <p className="text-muted-foreground">
                {capability.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default ZymaxonAI;
