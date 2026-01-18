import SlideContainer from "../SlideContainer";
import zymaxonSymbol from "@/assets/zymaxon-symbol.png";

const TitleSlide = () => {
  return (
    <SlideContainer gradient="primary">
      <div className="flex flex-col items-center text-center space-y-8">
        {/* Logo */}
        <div className="relative">
          <div className="absolute inset-0 bg-primary/30 rounded-full blur-3xl scale-150" />
          <img 
            src={zymaxonSymbol} 
            alt="Zymaxon" 
            className="relative w-32 h-32 md:w-40 md:h-40 object-contain"
          />
        </div>
        
        {/* Brand */}
        <div className="space-y-2">
          <span className="text-primary font-medium tracking-widest text-sm md:text-base">
            A ZYMAXON PRODUCT PORTFOLIO
          </span>
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold text-white tracking-tight">
            VIVESA
          </h1>
        </div>
        
        {/* Tagline */}
        <p className="text-xl md:text-2xl lg:text-3xl text-white/80 font-light max-w-3xl">
          Powering Nigeria's Digital Economy
        </p>
        
        {/* Subtitle */}
        <div className="flex items-center gap-3 text-white/60">
          <div className="w-12 h-px bg-white/30" />
          <span className="text-sm md:text-base tracking-wide">
            One Intelligence. Five Platforms. Endless Possibilities.
          </span>
          <div className="w-12 h-px bg-white/30" />
        </div>
      </div>
    </SlideContainer>
  );
};

export default TitleSlide;
