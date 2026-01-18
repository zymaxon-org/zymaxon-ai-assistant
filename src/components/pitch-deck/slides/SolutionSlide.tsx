import SlideContainer from "../SlideContainer";
import { Brain, Link, Sparkles, Users } from "lucide-react";

const features = [
  {
    icon: Link,
    title: "Unified Ecosystem",
    description: "Five integrated platforms under one intelligent umbrella"
  },
  {
    icon: Brain,
    title: "Zymaxon AI",
    description: "Shared intelligence layer powering smart matching and recommendations"
  },
  {
    icon: Users,
    title: "Trust Network",
    description: "Cross-platform verification and reputation building"
  },
  {
    icon: Sparkles,
    title: "Seamless Experience",
    description: "One profile, one wallet, endless opportunities"
  }
];

const SolutionSlide = () => {
  return (
    <SlideContainer gradient="primary">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-primary font-medium tracking-widest text-sm">OUR ANSWER</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
            The Solution
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-3xl mx-auto">
            Vivesa: A unified ecosystem of five integrated platforms, powered by Zymaxon AI
          </p>
        </div>
        
        {/* Central Visual */}
        <div className="relative flex justify-center py-8">
          <div className="relative">
            {/* Central Circle */}
            <div className="w-32 h-32 md:w-40 md:h-40 rounded-full bg-gradient-to-br from-primary to-primary/60 flex items-center justify-center shadow-2xl shadow-primary/30">
              <Brain className="w-16 h-16 md:w-20 md:h-20 text-white" />
            </div>
            
            {/* Orbiting elements */}
            <div className="absolute -inset-16 md:-inset-20 animate-spin" style={{ animationDuration: '20s' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-4 h-4 bg-primary rounded-full" />
            </div>
            <div className="absolute -inset-24 md:-inset-32 animate-spin" style={{ animationDuration: '30s', animationDirection: 'reverse' }}>
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3 h-3 bg-primary/60 rounded-full" />
            </div>
          </div>
        </div>
        
        {/* Feature Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <div 
                key={index}
                className="text-center space-y-3 p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-xl bg-primary/20 flex items-center justify-center mx-auto">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
                <p className="text-white/60 text-sm">{feature.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </SlideContainer>
  );
};

export default SolutionSlide;
