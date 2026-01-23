import { Mail, MapPin, Instagram, Facebook } from "lucide-react";
import zymaxonLogo from "@/assets/zymaxon-symbol.png";

// X (Twitter) icon component
const XIcon = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" className={className} fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
  </svg>
);

const socialLinks = [
  { 
    name: "Instagram", 
    url: "https://www.instagram.com/zymaxonai/",
    icon: Instagram 
  },
  { 
    name: "X", 
    url: "https://x.com/Zymaxon",
    icon: XIcon
  },
  { 
    name: "Facebook", 
    url: "https://www.facebook.com/profile.php?id=61585110053732",
    icon: Facebook 
  }
];

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
        <div className="grid md:grid-cols-4 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3 group">
              <div className="relative h-16 overflow-hidden">
                {/* Breathing glow */}
                <div className="absolute inset-0 bg-primary/30 animate-breathe blur-xl" />
                <img 
                  src={zymaxonLogo} 
                  alt="Zymaxon" 
                  className="h-full w-auto object-contain relative z-10"
                  style={{ filter: 'brightness(0) invert(1)' }}
                />
              </div>
            </div>
            <p className="text-background/70 text-sm">
              Building platforms powered by AI. Connecting people with opportunities.
            </p>
            
            {/* Social Links */}
            <div className="flex items-center gap-4 pt-2">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group/social relative p-2 rounded-lg bg-background/10 hover:bg-primary/20 transition-all duration-300 hover:scale-110"
                  aria-label={social.name}
                >
                  {/* Glow on hover */}
                  <div className="absolute inset-0 rounded-lg bg-primary/30 opacity-0 group-hover/social:opacity-100 blur-md transition-opacity duration-300" />
                  <social.icon className="w-5 h-5 text-background/70 group-hover/social:text-background relative z-10 transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Our Products</h4>
            <ul className="space-y-2 text-sm text-background/70">
              {["Vivesa", "Vivesa Jobs", "Vivesa Gigs", "Vivesa Mentorship", "Vivesa Newsroom"].map((platform) => (
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
                  href="mailto:zymaxon@yahoo.com" 
                  className="transition-colors duration-300 hover:text-background
                    relative after:absolute after:bottom-0 after:left-0 after:w-full after:h-px 
                    after:bg-primary after:scale-x-0 after:origin-right
                    after:transition-transform after:duration-300 hover:after:scale-x-100 hover:after:origin-left"
                >
                  zymaxon@yahoo.com
                </a>
              </li>
              <li className="flex items-start gap-2 group">
                <MapPin className="w-4 h-4 mt-0.5 transition-all duration-300 group-hover:text-primary group-hover:scale-110" />
                <span className="transition-colors duration-300 group-hover:text-background">Worldwide</span>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Follow Us</h4>
            <p className="text-sm text-background/70">
              Stay connected with Zymaxon for the latest updates and announcements.
            </p>
            <div className="flex flex-col gap-2 text-sm">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-background/70 hover:text-background transition-colors duration-300 flex items-center gap-2"
                >
                  <social.icon className="w-4 h-4" />
                  @{social.name === "X" ? "Zymaxon" : social.name === "Instagram" ? "zymaxonai" : "Zymaxon"}
                </a>
              ))}
            </div>
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
