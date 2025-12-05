import { Store, ShoppingBag, Briefcase, Users, BookOpen, Newspaper, Sparkles } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const companies = [
  {
    name: "Vivesa",
    category: "Marketplace",
    description: "A marketplace for properties, services, and bookings. Connect with verified providers and find exactly what you need.",
    icon: Store,
    aiFeatures: ["Smart search & discovery", "Personalized recommendations", "Fraud detection"]
  },
  {
    name: "Vivesa Stores",
    category: "E-commerce",
    description: "Shop from thousands of verified sellers. Experience seamless online shopping with AI-powered personalization.",
    icon: ShoppingBag,
    aiFeatures: ["Visual search", "Size prediction", "Dynamic pricing"]
  },
  {
    name: "Vivesa Jobs",
    category: "Employment",
    description: "Find your dream job or the perfect candidate. Our AI matches skills with opportunities for better outcomes.",
    icon: Briefcase,
    aiFeatures: ["Resume optimization", "Job matching", "Career insights"]
  },
  {
    name: "Vivesa Gigs",
    category: "Freelancing",
    description: "Connect freelancers with clients. Get matched based on skills, availability, and project requirements.",
    icon: Users,
    aiFeatures: ["Skill matching", "Bid assistance", "Project estimation"]
  },
  {
    name: "Vivesa Mentorship",
    category: "Career Development",
    description: "Learn from industry experts. Our AI pairs you with mentors who can accelerate your professional growth.",
    icon: BookOpen,
    aiFeatures: ["Mentor matching", "Learning paths", "Goal tracking"]
  },
  {
    name: "Vivesa Newsroom",
    category: "Media & Press",
    description: "Stay informed with the latest updates. AI-curated content keeps you ahead of industry trends.",
    icon: Newspaper,
    aiFeatures: ["Content curation", "Trend analysis", "SEO optimization"]
  }
];

const Companies = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section id="companies" className="py-24 md:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div 
          ref={ref}
          className={`text-center space-y-4 mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground">
            Our Companies
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            A portfolio of consumer platforms designed to solve real problems, 
            all powered by Zymaxon AI.
          </p>
        </div>

        {/* Companies Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <div
              key={company.name}
              className={`group relative p-6 rounded-xl bg-card border border-border/50 shadow-card 
                transition-all duration-500 hover:shadow-card-hover hover:-translate-y-1 ${
                isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
              }`}
              style={{ transitionDelay: isInView ? `${index * 100}ms` : "0ms" }}
            >
              {/* AI Badge */}
              <div className="absolute top-4 right-4">
                <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                  <Sparkles className="w-3 h-3" />
                  AI Powered
                </div>
              </div>

              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 
                transition-colors duration-300 group-hover:bg-primary/20">
                <company.icon className="w-6 h-6 text-primary" />
              </div>

              <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1">
                {company.category}
              </p>
              <h3 className="text-xl font-display font-semibold text-foreground mb-2">
                {company.name}
              </h3>
              <p className="text-muted-foreground text-sm mb-4">
                {company.description}
              </p>

              {/* AI Features */}
              <div className="pt-4 border-t border-border/50">
                <p className="text-xs text-muted-foreground mb-2">AI Capabilities:</p>
                <div className="flex flex-wrap gap-2">
                  {company.aiFeatures.map((feature) => (
                    <span 
                      key={feature}
                      className="text-xs px-2 py-1 rounded-md bg-secondary text-secondary-foreground"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Companies;
