import SlideContainer from "../SlideContainer";
import { AlertTriangle, Search, Shield, Zap } from "lucide-react";

const problems = [
  {
    icon: Search,
    title: "Fragmented Platforms",
    description: "People navigate dozens of disconnected platforms for jobs, gigs, shopping, and learning"
  },
  {
    icon: Shield,
    title: "Trust Deficit",
    description: "No unified verification system leads to scams, fraud, and unreliable service providers"
  },
  {
    icon: Zap,
    title: "No Smart Matching",
    description: "Manual searching wastes hours - no AI to intelligently connect supply and demand"
  },
  {
    icon: AlertTriangle,
    title: "Missed Opportunities",
    description: "Talented individuals and quality products remain invisible without proper discovery tools"
  }
];

const ProblemSlide = () => {
  return (
    <SlideContainer gradient="dark">
      <div className="space-y-12">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-primary font-medium tracking-widest text-sm">THE CHALLENGE</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
            The Problem
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            The digital services landscape is broken, scattered, and inefficient
          </p>
        </div>
        
        {/* Problem Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {problems.map((problem, index) => {
            const Icon = problem.icon;
            return (
              <div 
                key={index}
                className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-all duration-300 group"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-destructive/20 flex items-center justify-center shrink-0 group-hover:bg-destructive/30 transition-colors">
                    <Icon className="w-6 h-6 text-destructive" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-white">{problem.title}</h3>
                    <p className="text-white/60 text-sm leading-relaxed">{problem.description}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8">
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">5B+</div>
            <div className="text-white/50 text-sm">People Online</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">1.5B+</div>
            <div className="text-white/50 text-sm">Gig Workers Globally</div>
          </div>
          <div className="text-center">
            <div className="text-3xl md:text-4xl font-bold text-white">$455B+</div>
            <div className="text-white/50 text-sm">Gig Economy Size</div>
          </div>
        </div>
      </div>
    </SlideContainer>
  );
};

export default ProblemSlide;
