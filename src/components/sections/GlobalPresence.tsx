import { useState } from "react";
import { Globe, MapPin, Rocket, Calendar } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const regions = [
  {
    id: "africa",
    name: "Africa",
    status: "Active",
    statusColor: "bg-primary",
    countries: "Nigeria, Ghana, Kenya, South Africa, Egypt",
    icon: Globe,
    position: { x: 52, y: 45 },
  },
  {
    id: "europe",
    name: "Europe",
    status: "Launching 2025",
    statusColor: "bg-primary/70",
    countries: "UK, Germany, France, Netherlands",
    icon: Rocket,
    position: { x: 52, y: 28 },
  },
  {
    id: "americas",
    name: "Americas",
    status: "Coming 2026",
    statusColor: "bg-primary/50",
    countries: "USA, Canada, Brazil, Mexico",
    icon: Calendar,
    position: { x: 25, y: 40 },
  },
  {
    id: "asia",
    name: "Asia-Pacific",
    status: "Coming 2027",
    statusColor: "bg-primary/40",
    countries: "India, Singapore, Australia, Japan",
    icon: Calendar,
    position: { x: 75, y: 38 },
  },
];

const GlobalPresence = () => {
  const { ref, isInView } = useInView({ threshold: 0.2 });
  const [activeRegion, setActiveRegion] = useState<string | null>(null);

  return (
    <section
      id="global-presence"
      ref={ref}
      className="py-24 md:py-32 bg-background relative overflow-hidden"
    >
      {/* Animated Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-primary/5 rounded-full blur-3xl animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] bg-accent/5 rounded-full blur-3xl animate-float-delayed" />
        
        {/* Grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03] animate-grid-pulse"
          style={{
            backgroundImage: `
              linear-gradient(hsl(var(--primary) / 0.3) 1px, transparent 1px),
              linear-gradient(90deg, hsl(var(--primary) / 0.3) 1px, transparent 1px)
            `,
            backgroundSize: '60px 60px'
          }}
        />

        {/* Floating particles */}
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/30 rounded-full animate-particle"
            style={{
              left: `${15 + i * 10}%`,
              bottom: '0',
              animationDelay: `${i * 1.5}s`,
              animationDuration: `${12 + i * 2}s`
            }}
          />
        ))}
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        {/* Section Header */}
        <div
          className={`text-center space-y-4 mb-16 transition-all duration-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
            <Globe className="w-4 h-4" />
            Worldwide Expansion
          </div>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-foreground">
            Global Presence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Building digital infrastructure for the world. Our platforms are expanding 
            to serve communities across every continent.
          </p>
        </div>

        {/* Interactive World Map */}
        <div
          className={`relative max-w-5xl mx-auto mb-12 transition-all duration-1000 delay-200 ${
            isInView ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="relative aspect-[2/1] bg-gradient-to-br from-muted/50 to-muted/20 rounded-2xl border border-border/50 overflow-hidden">
            {/* Simplified World Map SVG */}
            <svg
              viewBox="0 0 100 50"
              className="w-full h-full"
              preserveAspectRatio="xMidYMid slice"
            >
              {/* Map background glow */}
              <defs>
                <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity="0" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="0.5" result="coloredBlur"/>
                  <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                  </feMerge>
                </filter>
              </defs>
              
              <rect fill="url(#mapGlow)" width="100" height="50" />
              
              {/* Simplified continent outlines */}
              {/* North America */}
              <path
                d="M10 15 Q15 10 25 12 Q30 14 28 20 Q25 25 20 28 Q15 30 12 25 Q10 20 10 15"
                fill="hsl(var(--muted-foreground))"
                fillOpacity={activeRegion === "americas" ? 0.3 : 0.15}
                className="transition-all duration-300"
              />
              {/* South America */}
              <path
                d="M22 32 Q25 30 27 33 Q28 38 26 42 Q24 45 22 44 Q20 42 20 38 Q20 34 22 32"
                fill="hsl(var(--muted-foreground))"
                fillOpacity={activeRegion === "americas" ? 0.3 : 0.15}
                className="transition-all duration-300"
              />
              {/* Europe */}
              <path
                d="M45 12 Q50 10 55 12 Q58 15 56 18 Q54 20 50 20 Q46 19 45 16 Q44 14 45 12"
                fill="hsl(var(--muted-foreground))"
                fillOpacity={activeRegion === "europe" ? 0.3 : 0.15}
                className="transition-all duration-300"
              />
              {/* Africa */}
              <path
                d="M48 22 Q52 20 56 22 Q58 26 58 32 Q56 38 52 40 Q48 38 46 34 Q45 28 48 22"
                fill="hsl(var(--primary))"
                fillOpacity={activeRegion === "africa" ? 0.4 : 0.25}
                className="transition-all duration-300"
              />
              {/* Asia */}
              <path
                d="M60 12 Q70 10 80 14 Q85 18 82 25 Q78 30 72 32 Q66 30 62 26 Q58 20 60 12"
                fill="hsl(var(--muted-foreground))"
                fillOpacity={activeRegion === "asia" ? 0.3 : 0.15}
                className="transition-all duration-300"
              />
              {/* Australia */}
              <path
                d="M78 36 Q82 34 85 36 Q87 39 85 42 Q82 44 79 42 Q77 40 78 36"
                fill="hsl(var(--muted-foreground))"
                fillOpacity={activeRegion === "asia" ? 0.3 : 0.15}
                className="transition-all duration-300"
              />

              {/* Connection lines from Africa */}
              {isInView && (
                <g className="animate-draw-line" style={{ animationDelay: '0.5s' }}>
                  {/* Africa to Europe */}
                  <line
                    x1="52" y1="30"
                    x2="52" y2="18"
                    stroke="hsl(var(--primary))"
                    strokeWidth="0.2"
                    strokeDasharray="2 1"
                    opacity="0.4"
                  />
                  {/* Africa to Americas */}
                  <line
                    x1="48" y1="30"
                    x2="25" y2="35"
                    stroke="hsl(var(--primary))"
                    strokeWidth="0.2"
                    strokeDasharray="2 1"
                    opacity="0.3"
                  />
                  {/* Africa to Asia */}
                  <line
                    x1="56" y1="28"
                    x2="75" y2="28"
                    stroke="hsl(var(--primary))"
                    strokeWidth="0.2"
                    strokeDasharray="2 1"
                    opacity="0.3"
                  />
                </g>
              )}

              {/* Region markers */}
              {regions.map((region, index) => (
                <g
                  key={region.id}
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveRegion(region.id)}
                  onMouseLeave={() => setActiveRegion(null)}
                >
                  {/* Pulse ring for active region */}
                  {region.id === "africa" && (
                    <circle
                      cx={region.position.x}
                      cy={region.position.y}
                      r="3"
                      fill="none"
                      stroke="hsl(var(--primary))"
                      strokeWidth="0.3"
                      className="animate-map-pulse"
                      opacity="0.5"
                    />
                  )}
                  
                  {/* Main marker */}
                  <circle
                    cx={region.position.x}
                    cy={region.position.y}
                    r={activeRegion === region.id ? 1.8 : 1.2}
                    fill={region.id === "africa" ? "hsl(var(--primary))" : "hsl(var(--primary))"}
                    fillOpacity={region.id === "africa" ? 1 : 0.4 + (index * 0.1)}
                    filter="url(#glow)"
                    className="transition-all duration-300"
                  />
                  
                  {/* Inner dot */}
                  <circle
                    cx={region.position.x}
                    cy={region.position.y}
                    r="0.4"
                    fill="white"
                    opacity="0.8"
                  />
                </g>
              ))}
            </svg>

            {/* Hover tooltip */}
            {activeRegion && (
              <div
                className="absolute bg-card/95 backdrop-blur-sm border border-border rounded-lg px-4 py-3 shadow-lg pointer-events-none transition-all duration-200 z-20"
                style={{
                  left: `${regions.find(r => r.id === activeRegion)?.position.x}%`,
                  top: `${regions.find(r => r.id === activeRegion)?.position.y}%`,
                  transform: 'translate(-50%, -120%)'
                }}
              >
                <div className="text-sm font-semibold text-foreground">
                  {regions.find(r => r.id === activeRegion)?.name}
                </div>
                <div className="text-xs text-primary">
                  {regions.find(r => r.id === activeRegion)?.status}
                </div>
              </div>
            )}
          </div>

          {/* Map Legend */}
          <div className="flex flex-wrap justify-center gap-4 md:gap-8 mt-6">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary animate-pulse" />
              <span className="text-sm text-muted-foreground">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary/60" />
              <span className="text-sm text-muted-foreground">Launching</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-primary/30" />
              <span className="text-sm text-muted-foreground">Coming Soon</span>
            </div>
          </div>
        </div>

        {/* Region Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {regions.map((region, index) => {
            const Icon = region.icon;
            return (
              <div
                key={region.id}
                className={`group relative bg-card/50 backdrop-blur-sm border border-border/50 rounded-xl p-6 transition-all duration-500 hover:border-primary/30 hover:bg-card/80 hover:shadow-lg hover:-translate-y-1 cursor-pointer ${
                  isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                }`}
                style={{ transitionDelay: `${400 + index * 100}ms` }}
                onMouseEnter={() => setActiveRegion(region.id)}
                onMouseLeave={() => setActiveRegion(null)}
              >
                {/* Status badge */}
                <div className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium mb-4 ${region.statusColor} text-primary-foreground`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${region.id === 'africa' ? 'bg-white animate-pulse' : 'bg-white/70'}`} />
                  {region.status}
                </div>

                {/* Region info */}
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-primary/10 text-primary group-hover:bg-primary/20 transition-colors">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground mb-1">
                      {region.name}
                    </h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                      {region.countries}
                    </p>
                  </div>
                </div>

                {/* Hover glow effect */}
                <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
              </div>
            );
          })}
        </div>

        {/* Bottom CTA */}
        <div
          className={`text-center mt-12 transition-all duration-700 delay-700 ${
            isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          }`}
        >
          <p className="text-muted-foreground">
            <MapPin className="w-4 h-4 inline-block mr-2 text-primary" />
            Headquartered globally, serving communities everywhere
          </p>
        </div>
      </div>
    </section>
  );
};

export default GlobalPresence;
