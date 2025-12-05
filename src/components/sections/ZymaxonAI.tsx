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
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container px-4 md:px-6">
        <div 
          ref={ref}
          className={`text-center space-y-4 mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
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
              className={`group p-6 rounded-xl bg-card border border-border/50 shadow-card 
                transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isInView ? `${index * 100}ms` : "0ms" }}
            >
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 
                transition-colors duration-300 group-hover:bg-primary/20">
                <capability.icon className="w-6 h-6 text-primary" />
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
