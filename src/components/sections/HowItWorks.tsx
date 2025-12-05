import { useInView } from "@/hooks/useInView";

const HowItWorks = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section className="py-24 md:py-32 bg-secondary/30">
      <div className="container px-4 md:px-6">
        <div 
          ref={ref}
          className={`text-center space-y-4 mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground">
            How It Works
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            One AI, infinite possibilities. Zymaxon AI connects and powers every platform in our ecosystem.
          </p>
        </div>

        {/* Visual Diagram */}
        <div 
          className={`relative max-w-4xl mx-auto transition-all duration-1000 delay-200 ${
            isInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          {/* Center Hub */}
          <div className="relative flex items-center justify-center">
            <div className="relative z-10 w-32 h-32 md:w-40 md:h-40 rounded-full bg-primary flex items-center justify-center shadow-lg">
              <div className="text-center">
                <span className="text-2xl md:text-3xl font-display font-bold text-primary-foreground">Z</span>
                <p className="text-xs md:text-sm text-primary-foreground/80 font-medium">AI</p>
              </div>
            </div>

            {/* Orbiting circles - representing platforms */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-72 h-72 md:w-96 md:h-96 rounded-full border-2 border-dashed border-primary/20" />
            </div>

            {/* Platform nodes */}
            {["Vivesa", "Stores", "Jobs", "Gigs", "Mentorship", "Newsroom"].map((platform, index) => {
              const angle = (index * 60 - 90) * (Math.PI / 180);
              const radius = 144; // half of the orbit circle size
              const mdRadius = 192;
              
              return (
                <div
                  key={platform}
                  className={`absolute w-16 h-16 md:w-20 md:h-20 rounded-full bg-card border-2 border-primary/30 
                    flex items-center justify-center shadow-card transition-all duration-500 hover:border-primary 
                    hover:shadow-card-hover ${isInView ? "opacity-100" : "opacity-0"}`}
                  style={{
                    transform: `translate(${Math.cos(angle) * radius}px, ${Math.sin(angle) * radius}px)`,
                    transitionDelay: `${300 + index * 100}ms`
                  }}
                >
                  <span className="text-xs md:text-sm font-medium text-foreground text-center px-1">
                    {platform}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Connection lines animation hint */}
          <div className="mt-16 text-center">
            <p className="text-muted-foreground">
              <span className="text-primary font-medium">Zymaxon AI</span> sits at the heart of our ecosystem, 
              providing intelligent capabilities to every platform while learning and improving from each interaction.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
