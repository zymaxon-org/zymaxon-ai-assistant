import { Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 bg-foreground text-background relative overflow-hidden">
      {/* Animated Dark Background */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Dark Gradient Mesh */}
        <div className="absolute inset-0 opacity-50">
          <div className="absolute top-0 left-[20%] w-[500px] h-[500px] rounded-full 
            bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.15)_0%,transparent_70%)] 
            animate-gradient-shift blur-3xl" />
          <div className="absolute bottom-0 right-[10%] w-[400px] h-[400px] rounded-full 
            bg-[radial-gradient(ellipse_at_center,hsl(var(--primary)/0.1)_0%,transparent_70%)] 
            animate-gradient-shift blur-3xl" style={{ animationDelay: "4s" }} />
        </div>
        
        {/* Aurora Glow at Top */}
        <div className="absolute top-0 left-0 right-0 h-32 
          bg-gradient-to-b from-primary/10 via-primary/5 to-transparent animate-aurora" />
        
        {/* Subtle Star Field */}
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-0.5 h-0.5 rounded-full bg-background/30 animate-twinkle"
            style={{
              left: `${5 + (i * 4.5)}%`,
              top: `${10 + ((i * 17) % 80)}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${3 + (i % 3)}s`
            }}
          />
        ))}
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center relative overflow-hidden">
                {/* Breathing glow */}
                <div className="absolute inset-0 bg-primary/20 animate-breathe rounded-lg" />
                <span className="text-lg font-display font-bold text-foreground relative z-10">Z</span>
              </div>
              <span className="text-xl font-display font-semibold relative">
                Zymaxon
                {/* Shimmer on text */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-background/20 to-transparent 
                  animate-shimmer" style={{ animationDuration: "3s" }} />
              </span>
            </div>
            <p className="text-background/70 text-sm">
              Building platforms powered by AI. Connecting people with opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Our Platforms</h4>
            <ul className="space-y-2 text-sm text-background/70">
              {["Vivesa", "Vivesa Stores", "Vivesa Jobs", "Vivesa Gigs", "Vivesa Mentorship", "Vivesa Newsroom"].map((platform) => (
                <li key={platform}>
                  <a 
                    href="#" 
                    className="relative inline-block transition-colors duration-300 hover:text-background
                      after:absolute after:bottom-0 after:left-0 after:w-full after:h-px 
                      after:bg-primary after:scale-x-0 after:origin-right
                      after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
                  >
                    {platform}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Contact</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2 group">
                <Mail className="w-4 h-4 transition-all duration-300 group-hover:text-primary group-hover:scale-110" />
                <a 
                  href="mailto:hello@zymaxon.com" 
                  className="transition-colors duration-300 hover:text-background
                    relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px 
                    after:bg-primary after:scale-x-0 after:origin-right
                    after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
                >
                  hello@zymaxon.com
                </a>
              </li>
              <li className="flex items-start gap-2 group">
                <MapPin className="w-4 h-4 mt-0.5 transition-all duration-300 group-hover:text-primary group-hover:scale-110" />
                <span className="transition-colors duration-300 group-hover:text-background">Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4 relative">
          {/* Animated border line */}
          <div className="absolute top-0 left-0 right-0 h-px overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-primary/50 to-transparent 
              animate-shimmer" />
          </div>
          
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} Zymaxon. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-background/50">
            <a 
              href="#" 
              className="transition-all duration-300 hover:text-background
                relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px 
                after:bg-primary after:scale-x-0 after:origin-right
                after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
            >
              Privacy Policy
            </a>
            <a 
              href="#" 
              className="transition-all duration-300 hover:text-background
                relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px 
                after:bg-primary after:scale-x-0 after:origin-right
                after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
            >
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
