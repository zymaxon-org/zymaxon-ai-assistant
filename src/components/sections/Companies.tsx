import { Store, Briefcase, Users, BookOpen, Newspaper, Sparkles } from "lucide-react";
import { useInView } from "@/hooks/useInView";
import { useState, useRef } from "react";
import zymaxonPowered from "@/assets/zymaxon-powered.jpg";

const companies = [
  {
    name: "Vivesa",
    category: "Marketplace",
    description: "A marketplace for properties, services, and bookings. Connect with verified providers and find exactly what you need.",
    icon: Store,
    aiFeatures: ["Smart search & discovery", "Personalized recommendations", "Fraud detection"]
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

interface CompanyCardProps {
  company: typeof companies[0];
  index: number;
  isInView: boolean;
}

const CompanyCard = ({ company, index, isInView }: CompanyCardProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tiltStyle, setTiltStyle] = useState({ transform: '' });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;
    
    setTiltStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setTiltStyle({ transform: '' });
  };

  return (
    <div
      ref={cardRef}
      onMouseEnter={() => setIsHovered(true)}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={`group relative p-6 rounded-xl bg-card border border-border/50 
        transition-all duration-500 ${
        isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
      }`}
      style={{ 
        transitionDelay: isInView ? `${index * 100}ms` : "0ms",
        ...tiltStyle,
        boxShadow: isHovered 
          ? '0 25px 50px -12px hsl(var(--primary) / 0.15), 0 0 0 1px hsl(var(--primary) / 0.3), inset 0 1px 0 hsl(var(--primary) / 0.1)'
          : 'var(--shadow-card)'
      }}
    >
      {/* Glow effect on hover */}
      <div 
        className={`absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 via-transparent to-primary/10 transition-opacity duration-500 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Powered by Badge */}
      <div className="absolute top-4 right-4 z-10">
        <div className={`relative flex items-center gap-1.5 px-2 py-1 rounded-full bg-primary/10 transition-all duration-300 overflow-hidden ${
          isHovered ? 'bg-primary/20 scale-105' : ''
        }`}>
          <img 
            src={zymaxonPowered} 
            alt="Powered by Zymaxon AI" 
            className="h-4 w-auto object-contain"
          />
          {/* Shimmer on hover */}
          <div className={`absolute inset-0 bg-gradient-to-r from-transparent via-primary/20 to-transparent transition-opacity ${
            isHovered ? 'opacity-100 animate-shimmer' : 'opacity-0'
          }`} />
        </div>
      </div>

      {/* Icon with glow effect */}
      <div className={`relative w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4 
        transition-all duration-500 ${isHovered ? 'bg-primary/20 scale-110' : ''}`}
      >
        {isHovered && (
          <div className="absolute inset-0 rounded-lg bg-primary/30 blur-md animate-pulse" />
        )}
        <company.icon className={`relative w-6 h-6 text-primary transition-transform duration-300 ${
          isHovered ? 'scale-110' : ''
        }`} />
      </div>

      <p className="text-xs font-medium text-primary uppercase tracking-wider mb-1 relative z-10">
        {company.category}
      </p>
      <h3 className="text-xl font-display font-semibold text-foreground mb-2 relative z-10">
        {company.name}
      </h3>
      <p className="text-muted-foreground text-sm mb-4 relative z-10">
        {company.description}
      </p>

      {/* AI Features - Hidden by default, revealed on hover */}
      <div 
        className={`overflow-hidden transition-all duration-500 ease-out ${
          isHovered ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground mb-2">AI Capabilities:</p>
          <div className="flex flex-wrap gap-2">
            {company.aiFeatures.map((feature, featureIndex) => (
              <span 
                key={feature}
                className="text-xs px-2 py-1 rounded-md bg-primary/10 text-primary border border-primary/20 transition-all duration-300"
                style={{ 
                  transitionDelay: isHovered ? `${featureIndex * 100}ms` : '0ms',
                  opacity: isHovered ? 1 : 0,
                  transform: isHovered ? 'translateY(0)' : 'translateY(8px)'
                }}
              >
                {feature}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Default AI Features hint when not hovered */}
      <div 
        className={`transition-all duration-300 ${
          isHovered ? 'opacity-0 max-h-0' : 'opacity-100 max-h-20'
        }`}
      >
        <div className="pt-4 border-t border-border/50">
          <p className="text-xs text-muted-foreground flex items-center gap-1">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
            Hover to see AI capabilities
          </p>
        </div>
      </div>
    </div>
  );
};

const Companies = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section id="companies" className="py-24 md:py-32 bg-background relative overflow-hidden">
      {/* Dramatic Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large Gradient Blobs */}
        <div className="absolute top-[10%] left-[5%] w-[600px] h-[600px] rounded-full 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08)_0%,transparent_60%)] 
          animate-float blur-3xl" />
        <div className="absolute bottom-[5%] right-[5%] w-[500px] h-[500px] rounded-full 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.07)_0%,transparent_60%)] 
          animate-float-delayed blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[500px] rounded-full 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.05)_0%,transparent_70%)] 
          animate-breathe blur-2xl" />
        
        {/* Secondary accent orbs */}
        <div className="absolute top-[30%] right-[20%] w-[200px] h-[200px] rounded-full 
          bg-[radial-gradient(circle,hsl(227_90%_70%/0.08)_0%,transparent_70%)] 
          animate-float blur-xl" style={{ animationDelay: "1.5s" }} />
        <div className="absolute bottom-[25%] left-[15%] w-[180px] h-[180px] rounded-full 
          bg-[radial-gradient(circle,hsl(227_80%_65%/0.1)_0%,transparent_70%)] 
          animate-float-delayed blur-xl" style={{ animationDelay: "2.5s" }} />
        
        {/* Grid with gradient mask */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '50px 50px',
            maskImage: 'radial-gradient(ellipse at center, black 30%, transparent 80%)'
          }}
        />

        {/* Flowing connection lines */}
        <svg className="absolute inset-0 w-full h-full opacity-[0.04]">
          <defs>
            <linearGradient id="companies-line-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0" />
              <stop offset="50%" stopColor="hsl(var(--primary))" stopOpacity="0.6" />
              <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
            </linearGradient>
          </defs>
          <path 
            d="M0,150 Q400,50 800,150 T1600,150" 
            stroke="url(#companies-line-gradient)" 
            strokeWidth="2" 
            fill="none"
            className="animate-shimmer"
          />
          <path 
            d="M0,350 Q400,250 800,350 T1600,350" 
            stroke="url(#companies-line-gradient)" 
            strokeWidth="2" 
            fill="none"
            className="animate-shimmer"
            style={{ animationDelay: '1.5s' }}
          />
          <path 
            d="M0,550 Q400,450 800,550 T1600,550" 
            stroke="url(#companies-line-gradient)" 
            strokeWidth="2" 
            fill="none"
            className="animate-shimmer"
            style={{ animationDelay: '3s' }}
          />
        </svg>
        
        {/* Floating Particles - more dense */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-particle ${i % 3 === 0 ? 'w-1.5 h-1.5 bg-primary/35' : 'w-1 h-1 bg-primary/20'}`}
            style={{
              left: `${5 + (i * 5)}%`,
              bottom: '-10px',
              animationDelay: `${i * 0.8}s`,
              animationDuration: `${10 + (i % 4) * 2}s`
            }}
          />
        ))}

        {/* Floating geometric shapes */}
        {[...Array(5)].map((_, i) => (
          <div
            key={`geo-${i}`}
            className="absolute w-16 h-16 border border-primary/5 rounded-xl animate-float opacity-40"
            style={{
              left: `${8 + i * 20}%`,
              top: `${15 + (i % 2) * 55}%`,
              animationDelay: `${i * 1.8}s`,
              transform: `rotate(${i * 25}deg)`,
            }}
          />
        ))}
      </div>

      <div className="container px-4 md:px-6 relative z-10">
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

        {/* Companies Grid - 5 items with special layout */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <CompanyCard
              key={company.name}
              company={company}
              index={index}
              isInView={isInView}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Companies;