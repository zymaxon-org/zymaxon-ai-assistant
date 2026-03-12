import { ArrowLeft, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface DemoHeroProps {
  onDownload: () => void;
}

const DemoHero = ({ onDownload }: DemoHeroProps) => {
  return (
    <section className="relative min-h-[60vh] flex items-center justify-center overflow-hidden"
      style={{ background: 'linear-gradient(135deg, hsl(234 50% 6%) 0%, hsl(227 80% 12%) 50%, hsl(234 50% 6%) 100%)' }}
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-primary/10 blur-[120px] animate-float" />
        <div className="absolute bottom-1/4 right-1/4 w-[400px] h-[400px] rounded-full bg-primary/8 blur-[100px] animate-float-delayed" />
        <div className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                              linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
            maskImage: 'radial-gradient(ellipse at center, black 20%, transparent 70%)'
          }}
        />
      </div>

      <div className="container px-4 md:px-6 relative z-10">
        {/* Back link */}
        <Link to="/" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-12">
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="max-w-3xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10 text-primary text-sm font-medium">
            <Play className="w-3.5 h-3.5" />
            Interactive Demo
          </div>

          <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground">
            Vivesa <span className="text-primary">Escrow</span> System
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
            Secure transactions powered by Paystack Dedicated Virtual Accounts. 
            See how funds are held, verified, and released automatically.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" onClick={onDownload} className="gap-2">
              <Download className="w-4 h-4" />
              Download Whitepaper
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/pitch-deck">View Pitch Deck</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DemoHero;
