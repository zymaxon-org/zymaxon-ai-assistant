import SlideContainer from "../SlideContainer";
import { TrendingUp, Users, Globe, Smartphone } from "lucide-react";

const stats = [
  {
    value: "200M+",
    label: "Population",
    description: "Largest market in Africa",
    icon: Users
  },
  {
    value: "70%",
    label: "Under 30",
    description: "Young, tech-savvy demographic",
    icon: TrendingUp
  },
  {
    value: "100M+",
    label: "Internet Users",
    description: "Rapidly growing connectivity",
    icon: Globe
  },
  {
    value: "80%",
    label: "Mobile-First",
    description: "Primary access via smartphones",
    icon: Smartphone
  }
];

const marketSizes = [
  { segment: "E-commerce", value: "$12B", growth: "+25% YoY" },
  { segment: "Gig Economy", value: "$4B", growth: "+35% YoY" },
  { segment: "EdTech", value: "$1.5B", growth: "+40% YoY" },
  { segment: "Recruitment", value: "$800M", growth: "+20% YoY" },
];

const MarketSlide = () => {
  return (
    <SlideContainer gradient="primary">
      <div className="space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-primary font-medium tracking-widest text-sm">THE OPPORTUNITY</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
            Market Opportunity
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Nigeria represents Africa's largest digital economy opportunity
          </p>
        </div>
        
        {/* Key Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl mx-auto">
          {stats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <div 
                key={index}
                className="bg-white/5 border border-white/10 rounded-2xl p-5 text-center hover:bg-white/10 transition-all duration-300"
              >
                <Icon className="w-8 h-8 text-primary mx-auto mb-3" />
                <div className="text-3xl md:text-4xl font-bold text-white">{stat.value}</div>
                <div className="text-white font-medium mt-1">{stat.label}</div>
                <div className="text-white/50 text-xs mt-1">{stat.description}</div>
              </div>
            );
          })}
        </div>
        
        {/* Market Segments */}
        <div className="max-w-4xl mx-auto">
          <h3 className="text-xl font-semibold text-white text-center mb-6">Target Market Segments</h3>
          <div className="grid md:grid-cols-2 gap-4">
            {marketSizes.map((market, index) => (
              <div 
                key={index}
                className="flex items-center justify-between bg-white/5 border border-white/10 rounded-xl px-5 py-4 hover:bg-white/10 transition-all duration-300"
              >
                <div>
                  <div className="text-white font-medium">{market.segment}</div>
                  <div className="text-primary text-sm">{market.growth}</div>
                </div>
                <div className="text-2xl md:text-3xl font-bold text-white">{market.value}</div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Total Addressable Market */}
        <div className="text-center pt-4">
          <div className="inline-block bg-primary/20 border border-primary/30 rounded-2xl px-8 py-4">
            <div className="text-white/60 text-sm mb-1">Total Addressable Market</div>
            <div className="text-4xl md:text-5xl font-bold text-white">$18B+</div>
          </div>
        </div>
      </div>
    </SlideContainer>
  );
};

export default MarketSlide;
