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
      {/* Dramatic Tech Grid Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large gradient orbs */}
        <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.12)_0%,transparent_60%)] 
          animate-float blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1)_0%,transparent_60%)] 
          animate-float-delayed blur-3xl" />

        {/* Circuit Grid Pattern */}
        <div className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "40px 40px"
          }} />
        
        {/* Animated circuit nodes */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `radial-gradient(circle at center, hsl(var(--primary)) 2px, transparent 2px)`,
            backgroundSize: "40px 40px"
          }} />
        
        {/* Data Flow Particles - more dense */}
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-particle ${i % 4 === 0 ? 'w-2 h-2 bg-primary/50' : 'w-1.5 h-1.5 bg-primary/35'}`}
            style={{
              left: `${2 + (i * 4)}%`,
              bottom: "-10px",
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${5 + (i % 3) * 2}s`
            }}
          />
        ))}

        {/* Flowing connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.06]">
          <defs>
            <linearGradient id="line-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.5" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d="M0,200 Q400,100 800,200 T1600,200" 
            stroke="url(#line-gradient)" 
            strokeWidth="2" 
            fill="none"
            className="animate-shimmer"
          />
          <path 
            d="M0,400 Q400,300 800,400 T1600,400" 
            stroke="url(#line-gradient)" 
            strokeWidth="2" 
            fill="none"
            className="animate-shimmer"
            style={{ animationDelay: '1s' }}
          />
        </svg>
        
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background/40" />
        
        {/* Central Glow - larger */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[500px] 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1)_0%,transparent_60%)] animate-breathe" />
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