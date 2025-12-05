import { Linkedin, Twitter } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const Leadership = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });

  return (
    <section id="leadership" className="py-24 md:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div 
          ref={ref}
          className={`text-center space-y-4 mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-semibold text-foreground">
            Leadership
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Meet the visionary behind Zymaxon.
          </p>
        </div>

        {/* Leader Card */}
        <div 
          className={`max-w-md mx-auto transition-all duration-700 delay-200 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="group p-8 rounded-2xl bg-card border border-border/50 shadow-card 
            transition-all duration-500 hover:shadow-card-hover text-center">
            {/* Photo placeholder */}
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-primary/10 flex items-center justify-center 
              overflow-hidden border-4 border-primary/20 transition-all duration-300 group-hover:border-primary/40">
              <span className="text-4xl font-display font-bold text-primary">JC</span>
            </div>

            <h3 className="text-2xl font-display font-semibold text-foreground mb-1">
              John Charles
            </h3>
            <p className="text-primary font-medium mb-4">
              Founder & CEO
            </p>
            <p className="text-muted-foreground text-sm leading-relaxed mb-6">
              Visionary entrepreneur dedicated to building AI-powered platforms that connect people 
              with opportunities and transform how we work, shop, and grow.
            </p>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4">
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center 
                  text-muted-foreground transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center 
                  text-muted-foreground transition-colors duration-300 hover:bg-primary hover:text-primary-foreground"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Leadership;
