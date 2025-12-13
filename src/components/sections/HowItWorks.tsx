import { useInView } from "@/hooks/useInView";
import { useEffect, useState } from "react";
import zymaxonSymbol from "@/assets/zymaxon-symbol.jpg";

const platforms = ["Vivesa", "Jobs", "Gigs", "Mentorship", "Newsroom"];

const HowItWorks = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [showLines, setShowLines] = useState(false);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowLines(true), 400);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  // Calculate positions for 5 nodes around the center (72° spacing)
  const getNodePosition = (index: number, radius: number) => {
    const angle = (index * 72 - 90) * (Math.PI / 180);
    return {
      x: Math.cos(angle) * radius,
      y: Math.sin(angle) * radius,
    };
  };

  return (
    <section id="how-it-works" className="py-24 md:py-32 bg-secondary/30 overflow-hidden relative">
      {/* Dramatic Tech Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Large gradient orbs */}
        <div className="absolute top-[-5%] left-[10%] w-[500px] h-[500px] rounded-full 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1)_0%,transparent_60%)] 
          animate-float blur-3xl" />
        <div className="absolute bottom-[-10%] right-[5%] w-[600px] h-[600px] rounded-full 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.08)_0%,transparent_60%)] 
          animate-float-delayed blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full 
          bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.06)_0%,transparent_50%)] 
          animate-breathe blur-2xl" />

        {/* Tech grid pattern */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)
            `,
            backgroundSize: "50px 50px"
          }} />
        
        {/* Circuit nodes overlay */}
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `radial-gradient(circle at center, hsl(var(--primary)) 2px, transparent 2px)`,
            backgroundSize: "50px 50px"
          }} />

        {/* Gradient overlay for depth */}
        <div className="absolute inset-0 bg-gradient-to-b from-background/30 via-transparent to-background/30" />

        {/* Data particles */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className={`absolute rounded-full animate-particle ${i % 4 === 0 ? 'w-1.5 h-1.5 bg-primary/45' : 'w-1 h-1 bg-primary/30'}`}
            style={{
              left: `${3 + (i * 5)}%`,
              bottom: "-10px",
              animationDelay: `${i * 0.5}s`,
              animationDuration: `${6 + (i % 3) * 2}s`
            }}
          />
        ))}

        {/* Concentric rings at center */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-primary/5 animate-breathe" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-primary/3 animate-breathe" style={{ animationDelay: "0.5s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full border border-primary/2 animate-breathe" style={{ animationDelay: "1s" }} />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
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
          {/* Diagram Container with fixed aspect ratio */}
          <div className="relative mx-auto w-[280px] h-[280px] sm:w-[340px] sm:h-[340px] md:w-[420px] md:h-[420px]">
            
            {/* SVG Connection Lines */}
            <svg 
              className="absolute inset-0 w-full h-full"
              viewBox="0 0 420 420"
              fill="none"
            >
              {platforms.map((_, index) => {
                const pos = getNodePosition(index, 160);
                const centerX = 210;
                const centerY = 210;
                const endX = centerX + pos.x;
                const endY = centerY + pos.y;
                
                return (
                  <g key={index}>
                    {/* Glow effect line */}
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={endX}
                      y2={endY}
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      strokeOpacity="0.2"
                      className={`transition-all duration-1000 ${
                        showLines ? "opacity-100" : "opacity-0"
                      }`}
                      style={{ transitionDelay: `${index * 100}ms` }}
                    />
                    {/* Main animated line */}
                    <line
                      x1={centerX}
                      y1={centerY}
                      x2={endX}
                      y2={endY}
                      stroke="hsl(var(--primary))"
                      strokeWidth="2"
                      strokeLinecap="round"
                      className={`connection-line ${showLines ? "animate-draw-line" : ""}`}
                      style={{ 
                        animationDelay: `${index * 150}ms`,
                        strokeDasharray: "200",
                        strokeDashoffset: showLines ? "0" : "200"
                      }}
                    />
                    {/* Pulse dot traveling along line */}
                    <circle
                      r="4"
                      fill="hsl(var(--primary))"
                      className={`${showLines ? "animate-pulse-dot" : "opacity-0"}`}
                      style={{ animationDelay: `${800 + index * 200}ms` }}
                    >
                      <animateMotion
                        dur="2s"
                        repeatCount="indefinite"
                        begin={`${1 + index * 0.3}s`}
                        path={`M${centerX},${centerY} L${endX},${endY}`}
                      />
                    </circle>
                  </g>
                );
              })}
            </svg>

            {/* Orbital Ring */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-[220px] h-[220px] sm:w-[270px] sm:h-[270px] md:w-[320px] md:h-[320px] rounded-full border-2 border-dashed border-primary/20 animate-spin-slow" />
            </div>

            {/* Center Hub with Logo */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="relative z-10 w-20 h-20 sm:w-24 sm:h-24 md:w-28 md:h-28 rounded-full overflow-hidden animate-pulse-glow">
                {/* Rotating glow ring */}
                <div className="absolute -inset-2 rounded-full bg-gradient-to-r from-primary via-primary/50 to-primary animate-spin-slow opacity-50" />
                {/* Inner glow */}
                <div className="absolute inset-0 rounded-full bg-primary/20 animate-breathe" />
                {/* Logo Image */}
                <img 
                  src={zymaxonSymbol} 
                  alt="Zymaxon AI" 
                  className="w-full h-full object-cover relative z-10 rounded-full"
                />
              </div>
            </div>

            {/* Platform Nodes */}
            {platforms.map((platform, index) => {
              const pos = getNodePosition(index, 110);
              const smPos = getNodePosition(index, 135);
              const mdPos = getNodePosition(index, 160);
              
              return (
                <div
                  key={platform}
                  className={`absolute left-1/2 top-1/2 w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] -ml-7 -mt-7 sm:-ml-8 sm:-mt-8 md:-ml-9 md:-mt-9
                    rounded-full bg-card border-2 border-primary/30 flex items-center justify-center shadow-card 
                    transition-all duration-500 hover:border-primary hover:shadow-card-hover hover:scale-110 cursor-pointer
                    ${isInView ? "opacity-100" : "opacity-0"}`}
                  style={{
                    transform: `translate(${pos.x}px, ${pos.y}px)`,
                    transitionDelay: `${300 + index * 100}ms`
                  }}
                >
                  {/* Use CSS media queries for responsive positioning via custom properties */}
                  <style>
                    {`
                      @media (min-width: 640px) {
                        [data-platform="${platform}"] {
                          transform: translate(${smPos.x}px, ${smPos.y}px) !important;
                        }
                      }
                      @media (min-width: 768px) {
                        [data-platform="${platform}"] {
                          transform: translate(${mdPos.x}px, ${mdPos.y}px) !important;
                        }
                      }
                    `}
                  </style>
                  <div data-platform={platform} className="hidden" />
                  <span className="text-[10px] sm:text-xs md:text-sm font-medium text-foreground text-center px-1 leading-tight">
                    {platform}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Description */}
          <div className="mt-12 md:mt-16 text-center">
            <p className="text-muted-foreground max-w-xl mx-auto">
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