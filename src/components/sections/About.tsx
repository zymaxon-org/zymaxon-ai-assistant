import { useInView } from "@/hooks/useInView";

const About = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section id="about" className="py-24 md:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div 
          ref={ref}
          className={`max-w-4xl mx-auto text-center space-y-8 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground">
            About Zymaxon
          </h2>
          
          <div className="space-y-6 text-lg md:text-xl text-muted-foreground leading-relaxed">
            <p>
              Zymaxon builds technology companies powered by artificial intelligence. 
              We create platforms that help people connect, find opportunities, and grow—all 
              enhanced by our proprietary AI infrastructure.
            </p>
            <p>
              As a technology holding company, we develop and operate a portfolio of consumer 
              platforms under the Vivesa brand, each designed to solve real problems in 
              marketplaces, commerce, employment, and professional development.
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 pt-8 border-t border-border/50">
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-display font-bold text-primary">6</p>
              <p className="text-sm md:text-base text-muted-foreground">Platforms</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-display font-bold text-primary">1</p>
              <p className="text-sm md:text-base text-muted-foreground">AI Engine</p>
            </div>
            <div className="space-y-2">
              <p className="text-3xl md:text-4xl font-display font-bold text-primary">∞</p>
              <p className="text-sm md:text-base text-muted-foreground">Possibilities</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
