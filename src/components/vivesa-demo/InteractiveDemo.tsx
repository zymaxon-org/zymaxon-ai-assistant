import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Store, Briefcase, Home, ArrowRight, RotateCcw, CheckCircle2, Clock, Shield } from "lucide-react";
import { useInView } from "@/hooks/useInView";

type EscrowState = "created" | "funded" | "in_progress" | "delivered" | "released";

const stateConfig: Record<EscrowState, { label: string; color: string; progress: number }> = {
  created: { label: "Created", color: "hsl(var(--muted-foreground))", progress: 0 },
  funded: { label: "Funded", color: "hsl(var(--primary))", progress: 25 },
  in_progress: { label: "In Progress", color: "hsl(45 90% 50%)", progress: 50 },
  delivered: { label: "Delivered", color: "hsl(280 70% 55%)", progress: 75 },
  released: { label: "Released", color: "hsl(142 70% 45%)", progress: 100 },
};

const stateOrder: EscrowState[] = ["created", "funded", "in_progress", "delivered", "released"];

interface Transaction {
  type: string;
  product: string;
  amount: number;
  buyer: string;
  seller: string;
  platformFee: number;
  agentFee?: number;
  milestones?: { name: string; amount: number }[];
}

const transactions: Record<string, Transaction> = {
  marketplace: {
    type: "Marketplace",
    product: "Samsung Galaxy S24 Ultra",
    amount: 250000,
    buyer: "Adaeze O.",
    seller: "TechHub Lagos",
    platformFee: 5,
  },
  services: {
    type: "Services",
    product: "Website Redesign Project",
    amount: 500000,
    buyer: "StartupNG Ltd",
    seller: "DevCraft Studio",
    platformFee: 5,
    milestones: [
      { name: "Design Mockups", amount: 150000 },
      { name: "Frontend Development", amount: 200000 },
      { name: "Final Delivery", amount: 150000 },
    ],
  },
  properties: {
    type: "Properties",
    product: "3-Bedroom Apartment, Lekki",
    amount: 45000000,
    buyer: "Chinedu M.",
    seller: "Pinnacle Realty",
    platformFee: 5,
    agentFee: 2.5,
  },
};

const formatNaira = (n: number) => `₦${n.toLocaleString()}`;

const TransactionSimulator = ({ tx }: { tx: Transaction }) => {
  const [state, setState] = useState<EscrowState>("created");
  const currentIndex = stateOrder.indexOf(state);
  const config = stateConfig[state];

  const nextStep = () => {
    if (currentIndex < stateOrder.length - 1) {
      setState(stateOrder[currentIndex + 1]);
    }
  };

  const reset = () => setState("created");

  const platformAmount = (tx.amount * tx.platformFee) / 100;
  const agentAmount = tx.agentFee ? (tx.amount * tx.agentFee) / 100 : 0;
  const sellerAmount = tx.amount - platformAmount - agentAmount;

  return (
    <div className="space-y-6">
      {/* Transaction info */}
      <div className="p-5 rounded-xl bg-card border border-border/50">
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-sm text-muted-foreground">Product</p>
            <p className="font-semibold text-foreground">{tx.product}</p>
          </div>
          <p className="text-xl font-bold text-primary">{formatNaira(tx.amount)}</p>
        </div>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <p className="text-muted-foreground">Buyer</p>
            <p className="text-foreground">{tx.buyer}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Seller</p>
            <p className="text-foreground">{tx.seller}</p>
          </div>
        </div>
      </div>

      {/* State progress */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <Badge variant="outline" className="border-primary/30 text-primary">
            {config.label}
          </Badge>
          <span className="text-xs text-muted-foreground">{config.progress}%</span>
        </div>
        <Progress value={config.progress} className="h-2" />

        {/* State steps */}
        <div className="flex justify-between">
          {stateOrder.map((s, i) => (
            <div key={s} className={`flex flex-col items-center ${i <= currentIndex ? 'text-primary' : 'text-muted-foreground/40'}`}>
              {i <= currentIndex ? (
                <CheckCircle2 className="w-4 h-4" />
              ) : (
                <Clock className="w-4 h-4" />
              )}
              <span className="text-[10px] mt-1 hidden sm:block">{stateConfig[s].label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* State-specific info */}
      <div className="p-4 rounded-lg bg-muted/30 border border-border/30 text-sm space-y-2">
        {state === "created" && (
          <p className="text-muted-foreground">
            <Shield className="w-4 h-4 inline mr-1 text-primary" />
            Escrow created. A Dedicated Virtual Account has been generated. Awaiting buyer payment.
          </p>
        )}
        {state === "funded" && (
          <p className="text-muted-foreground">
            <Shield className="w-4 h-4 inline mr-1 text-primary" />
            Payment of {formatNaira(tx.amount)} received and held in DVA. Seller has been notified.
          </p>
        )}
        {state === "in_progress" && tx.milestones && (
          <div>
            <p className="text-muted-foreground mb-2">Milestone progress:</p>
            {tx.milestones.map((m, i) => (
              <div key={m.name} className="flex justify-between py-1">
                <span className={i === 0 ? 'text-primary' : 'text-muted-foreground'}>{m.name}</span>
                <span>{formatNaira(m.amount)}</span>
              </div>
            ))}
          </div>
        )}
        {state === "in_progress" && !tx.milestones && (
          <p className="text-muted-foreground">
            <Clock className="w-4 h-4 inline mr-1" />
            {tx.type === "Properties" ? "Property inspection in progress. Agent coordinating with both parties." : "Order is being processed. Auto-release in 3 days after delivery."}
          </p>
        )}
        {state === "delivered" && (
          <p className="text-muted-foreground">
            <CheckCircle2 className="w-4 h-4 inline mr-1 text-green-500" />
            Delivery confirmed. Buyer has 3 days to raise a dispute before auto-release.
          </p>
        )}
        {state === "released" && (
          <div className="space-y-2">
            <p className="text-foreground font-medium">Commission Breakdown:</p>
            <div className="space-y-1">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Seller receives</span>
                <span className="text-foreground font-medium">{formatNaira(sellerAmount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Platform fee ({tx.platformFee}%)</span>
                <span className="text-primary">{formatNaira(platformAmount)}</span>
              </div>
              {tx.agentFee && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Agent fee ({tx.agentFee}%)</span>
                  <span className="text-muted-foreground">{formatNaira(agentAmount)}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Actions */}
      <div className="flex gap-3">
        {state !== "released" ? (
          <Button onClick={nextStep} className="flex-1 gap-2">
            Next Step <ArrowRight className="w-4 h-4" />
          </Button>
        ) : (
          <Button onClick={reset} variant="outline" className="flex-1 gap-2">
            <RotateCcw className="w-4 h-4" /> Reset Demo
          </Button>
        )}
      </div>
    </div>
  );
};

const InteractiveDemo = () => {
  const { ref, isInView } = useInView({ threshold: 0.1 });

  return (
    <section className="py-20 md:py-28 relative" style={{ background: 'hsl(234 50% 7%)' }}>
      <div className="container px-4 md:px-6">
        <div ref={ref} className={`text-center mb-12 transition-all duration-700 ${isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground mb-4">
            Try the Escrow Simulator
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Step through a mock transaction to see how funds flow at each stage.
          </p>
        </div>

        <div className="max-w-lg mx-auto">
          <Tabs defaultValue="marketplace" className="w-full">
            <TabsList className="w-full grid grid-cols-3 bg-card border border-border/50">
              <TabsTrigger value="marketplace" className="gap-1.5 text-xs sm:text-sm">
                <Store className="w-4 h-4" /> Marketplace
              </TabsTrigger>
              <TabsTrigger value="services" className="gap-1.5 text-xs sm:text-sm">
                <Briefcase className="w-4 h-4" /> Services
              </TabsTrigger>
              <TabsTrigger value="properties" className="gap-1.5 text-xs sm:text-sm">
                <Home className="w-4 h-4" /> Properties
              </TabsTrigger>
            </TabsList>

            {Object.entries(transactions).map(([key, tx]) => (
              <TabsContent key={key} value={key} className="mt-6">
                <TransactionSimulator tx={tx} />
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
    </section>
  );
};

export default InteractiveDemo;
