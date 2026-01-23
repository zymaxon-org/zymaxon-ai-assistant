import SlideContainer from "../SlideContainer";
import { ShoppingBag, Briefcase, Users, GraduationCap, Newspaper, Sparkles } from "lucide-react";

const products = [
  {
    name: "Vivesa",
    subtitle: "Marketplace",
    icon: ShoppingBag,
    description: "AI-powered marketplace connecting buyers with verified sellers worldwide",
    aiFeature: "Smart product recommendations & price predictions"
  },
  {
    name: "Vivesa Jobs",
    subtitle: "Employment",
    icon: Briefcase,
    description: "Intelligent job matching platform for full-time employment opportunities",
    aiFeature: "Resume optimization & skill-gap analysis"
  },
  {
    name: "Vivesa Gigs",
    subtitle: "Freelancing",
    icon: Users,
    description: "Connect with skilled freelancers for short-term projects and tasks",
    aiFeature: "Smart matching & project scoping assistance"
  },
  {
    name: "Vivesa Mentorship",
    subtitle: "Career Development",
    icon: GraduationCap,
    description: "Learn from industry experts and accelerate your career growth",
    aiFeature: "Personalized learning paths & mentor matching"
  },
  {
    name: "Vivesa Newsroom",
    subtitle: "Media",
    icon: Newspaper,
    description: "Stay informed with curated news and insights for professionals everywhere",
    aiFeature: "Personalized news feed & trend analysis"
  }
];

const ProductsSlide = () => {
  return (
    <SlideContainer gradient="dark">
      <div className="space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <span className="text-primary font-medium tracking-widest text-sm">THE ECOSYSTEM</span>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
            Product Portfolio
          </h2>
        </div>
        
        {/* Products Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {products.map((product, index) => {
            const Icon = product.icon;
            return (
              <div 
                key={index}
                className="bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-sm border border-white/10 rounded-2xl p-5 hover:border-primary/40 transition-all duration-300 group"
              >
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center group-hover:bg-primary/30 transition-colors">
                      <Icon className="w-6 h-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{product.name}</h3>
                      <span className="text-primary text-sm">{product.subtitle}</span>
                    </div>
                  </div>
                  
                  <p className="text-white/60 text-sm leading-relaxed">
                    {product.description}
                  </p>
                  
                  <div className="flex items-center gap-2 text-xs text-primary/80 bg-primary/10 rounded-lg px-3 py-2">
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>{product.aiFeature}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Bottom Note */}
        <div className="text-center pt-4">
          <p className="text-white/50 text-sm">
            All platforms powered by <span className="text-primary font-medium">Zymaxon AI</span> for intelligent matching and recommendations
          </p>
        </div>
      </div>
    </SlideContainer>
  );
};

export default ProductsSlide;
