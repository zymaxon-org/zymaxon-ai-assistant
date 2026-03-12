import { useInView } from "@/hooks/useInView";
import { useState, useEffect } from "react";
import { User, Building, CheckCircle, Banknote, PieChart } from "lucide-react";

const steps = [
  { label: "Buyer Pays", sublabel: "₦250,000", icon: User, color: "hsl(var(--primary))" },
  { label: "DVA Holds Funds", sublabel: "Virtual Account", icon: Building, color: "hsl(227 90% 60%)" },
  { label: "Delivery Confirmed", sublabel: "3-day window", icon: CheckCircle, color: "hsl(142 70% 45%)" },
  { label: "Funds Released", sublabel: "Auto / Manual", icon: Banknote, color: "hsl(45 90% 50%)" },
  { label: "Commission Split", sublabel: "Platform 5%", icon: PieChart, color: "hsl(280 70% 55%)" },
];

const EscrowFlowAnimation = () => {
  const { ref, isInView } = useInView({ threshold: 0.3 });
  const [activeStep, setActiveStep] = useState(-1);

  useEffect(() => {
    if (!isInView) return;
    let step = 0;
    const interval = setInterval(() => {
      setActiveStep(step);
      step++;
      if (step >= steps.length) {
        setTimeout(() => {
          step = 0;
          setActiveStep(-1);
          setTimeout(() => setActiveStep(0), 600);
        }, 2000);
      }
    }, 1200);
    setActiveStep(0);
    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section className="py-20 md:py-28 relative" style={{ background: 'hsl(234 50% 5%)' }}>
      <div className="container px-4 md:px-6">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4">
            Transaction Flow
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Watch how funds move through the escrow system — from payment to release.
          </p>
        </div>

        <div ref={ref} className="max-w-5xl mx-auto">
          {/* Desktop flow - horizontal */}
          <div className="hidden md:flex items-start justify-between relative">
            {/* Connection line */}
            <div className="absolute top-10 left-[10%] right-[10%] h-0.5 bg-border/30">
              <div
                className="h-full bg-primary transition-all duration-1000 ease-out"
                style={{ width: activeStep >= 0 ? `${Math.min((activeStep / (steps.length - 1)) * 100, 100)}%` : '0%' }}
              />
            </div>

            {steps.map((step, i) => {
              const isActive = i <= activeStep;
              const isCurrent = i === activeStep;
              return (
                <div key={step.label} className="flex flex-col items-center text-center w-1/5 relative z-10">
                  <div
                    className={`w-20 h-20 rounded-2xl flex items-center justify-center transition-all duration-500 ${
                      isCurrent ? 'scale-110 shadow-lg' : isActive ? 'scale-100' : 'scale-90 opacity-40'
                    }`}
                    style={{
                      background: isActive ? `${step.color}20` : 'hsl(234 45% 12%)',
                      border: `2px solid ${isActive ? step.color : 'hsl(234 30% 20%)'}`,
                      boxShadow: isCurrent ? `0 0 30px ${step.color}30` : 'none'
                    }}
                  >
                    <step.icon className="w-8 h-8 transition-colors duration-500"
                      style={{ color: isActive ? step.color : 'hsl(227 15% 35%)' }}
                    />
                  </div>
                  <p className={`mt-3 text-sm font-medium transition-colors duration-300 ${isActive ? 'text-foreground' : 'text-muted-foreground/50'}`}>
                    {step.label}
                  </p>
                  <p className={`text-xs mt-1 transition-colors duration-300 ${isActive ? 'text-muted-foreground' : 'text-muted-foreground/30'}`}>
                    {step.sublabel}
                  </p>
                </div>
              );
            })}
          </div>

          {/* Mobile flow - vertical */}
          <div className="md:hidden space-y-4">
            {steps.map((step, i) => {
              const isActive = i <= activeStep;
              const isCurrent = i === activeStep;
              return (
                <div key={step.label} className={`flex items-center gap-4 p-4 rounded-xl transition-all duration-500 ${
                  isCurrent ? 'bg-card border border-primary/30' : isActive ? 'bg-card/50 border border-border/30' : 'opacity-40'
                }`}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                    style={{
                      background: isActive ? `${step.color}20` : 'hsl(234 45% 12%)',
                      border: `2px solid ${isActive ? step.color : 'hsl(234 30% 20%)'}`
                    }}
                  >
                    <step.icon className="w-5 h-5" style={{ color: isActive ? step.color : 'hsl(227 15% 35%)' }} />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground">{step.label}</p>
                    <p className="text-xs text-muted-foreground">{step.sublabel}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

export default EscrowFlowAnimation;
