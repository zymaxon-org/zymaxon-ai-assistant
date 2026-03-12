import { Shield, Clock, AlertTriangle, Milestone, Split, RefreshCw } from "lucide-react";
import { useInView } from "@/hooks/useInView";

const features = [
  {
    icon: Shield,
    title: "Dedicated Virtual Accounts",
    description: "Each transaction gets a unique bank account via Paystack DVA. Funds are isolated and fully traceable.",
  },
  {
    icon: Clock,
    title: "Auto-Release Timer",
    description: "Funds are automatically released to sellers after a 3-day confirmation window if no dispute is raised.",
  },
  {
    icon: AlertTriangle,
    title: "Dispute Resolution",
    description: "Buyers can raise disputes within 7 days. Funds remain locked until resolution by Vivesa's support team.",
  },
  {
    icon: Milestone,
    title: "Milestone Payments",
    description: "Service-based transactions support partial releases tied to deliverable milestones.",
  },
  {
    icon: Split,
    title: "Commission Splits",
    description: "Automated percentage-based splits between sellers, agents, and the Vivesa platform on every transaction.",
  },
  {
    icon: RefreshCw,
    title: "Instant Refunds",
    description: "If a transaction is cancelled or disputed, funds are returned to the buyer's original payment method.",
  },
];

const FeaturesGrid = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section className="py-20 md:py-28 relative" style={{ background: 'hsl(234 50% 6%)' }}>
      <div className="container px-4 md:px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4">
            Escrow Capabilities
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Built-in protections for every transaction on the Vivesa platform.
          </p>
        </div>

        <div ref={ref} className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`p-6 rounded-xl bg-card border border-border/50 transition-all duration-500 hover:border-primary/30 hover:shadow-lg ${
                isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
              }`}
              style={{ transitionDelay: isInView ? `${i * 80}ms` : '0ms' }}
            >
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <f.icon className="w-5 h-5 text-primary" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{f.title}</h3>
              <p className="text-sm text-muted-foreground">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesGrid;
