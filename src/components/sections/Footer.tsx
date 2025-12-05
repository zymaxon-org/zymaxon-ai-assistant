import { Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="py-16 bg-foreground text-background">
      <div className="container px-4 md:px-6">
        <div className="grid md:grid-cols-3 gap-12 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-background flex items-center justify-center">
                <span className="text-lg font-display font-bold text-foreground">Z</span>
              </div>
              <span className="text-xl font-display font-semibold">Zymaxon</span>
            </div>
            <p className="text-background/70 text-sm">
              Building platforms powered by AI. Connecting people with opportunities.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Our Platforms</h4>
            <ul className="space-y-2 text-sm text-background/70">
              <li><a href="#" className="hover:text-background transition-colors">Vivesa</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Vivesa Stores</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Vivesa Jobs</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Vivesa Gigs</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Vivesa Mentorship</a></li>
              <li><a href="#" className="hover:text-background transition-colors">Vivesa Newsroom</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display font-semibold">Contact</h4>
            <ul className="space-y-3 text-sm text-background/70">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <a href="mailto:hello@zymaxon.com" className="hover:text-background transition-colors">
                  hello@zymaxon.com
                </a>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Lagos, Nigeria</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-background/10 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-background/50">
            © {new Date().getFullYear()} Zymaxon. All rights reserved.
          </p>
          <div className="flex items-center gap-6 text-sm text-background/50">
            <a href="#" className="hover:text-background transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-background transition-colors">Terms of Service</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
