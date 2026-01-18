import SlideContainer from "../SlideContainer";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import zymaxonSymbol from "@/assets/zymaxon-symbol.png";

const ContactSlide = () => {
  return (
    <SlideContainer gradient="dark">
      <div className="flex flex-col items-center text-center space-y-10">
        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl scale-150" />
          <img 
            src={zymaxonSymbol} 
            alt="Zymaxon" 
            className="relative w-24 h-24 md:w-32 md:h-32 object-contain"
          />
        </div>
        
        {/* CTA */}
        <div className="space-y-4">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-white">
            Let's Build Together
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Partner with Vivesa to shape the future of Nigeria's digital economy
          </p>
        </div>
        
        {/* Contact Info */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12">
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <Mail className="w-5 h-5 text-primary" />
            </div>
            <span>zymaxon@yahoo.com</span>
          </div>
          <div className="flex items-center gap-3 text-white/80">
            <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <span>Nigeria</span>
          </div>
        </div>
        
        {/* Leadership */}
        <div className="pt-6 border-t border-white/10 w-full max-w-md">
          <div className="text-white/50 text-sm mb-2">Presented by</div>
          <div className="text-xl font-semibold text-white">John Charles</div>
          <div className="text-primary">Founder, Zymaxon</div>
        </div>
        
        {/* Final CTA */}
        <div className="pt-4">
          <a 
            href="mailto:zymaxon@yahoo.com" 
            className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-4 rounded-xl font-semibold hover:bg-primary/90 transition-colors group"
          >
            Get in Touch
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </a>
        </div>
      </div>
    </SlideContainer>
  );
};

export default ContactSlide;
