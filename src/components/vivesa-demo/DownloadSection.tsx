import { Download, FileText, Presentation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import jsPDF from "jspdf";

const generateWhitepaper = () => {
  const doc = new jsPDF();
  const w = doc.internal.pageSize.getWidth();
  const margin = 20;
  const textW = w - margin * 2;

  // Page 1 - Cover
  doc.setFillColor(13, 13, 43);
  doc.rect(0, 0, w, 297, "F");
  doc.setTextColor(255);
  doc.setFontSize(32);
  doc.text("Vivesa Escrow System", w / 2, 100, { align: "center" });
  doc.setFontSize(14);
  doc.setTextColor(180);
  doc.text("Technical Whitepaper", w / 2, 115, { align: "center" });
  doc.setFontSize(11);
  doc.text("Powered by Zymaxon AI + Paystack DVA", w / 2, 130, { align: "center" });
  doc.setFontSize(9);
  doc.text("Confidential | " + new Date().toLocaleDateString(), w / 2, 250, { align: "center" });

  // Page 2 - Overview
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, w, 297, "F");
  doc.setTextColor(20);
  doc.setFontSize(22);
  doc.text("1. System Overview", margin, 30);
  doc.setFontSize(11);
  doc.setTextColor(60);
  const overview = [
    "Vivesa's escrow system provides secure, transparent financial transactions across",
    "three product verticals: Marketplace, Services, and Properties.",
    "",
    "Core Technology:",
    "• Paystack Dedicated Virtual Accounts (DVA) for fund isolation",
    "• Automated release timers with configurable hold periods",
    "• Milestone-based partial releases for service contracts",
    "• Real-time webhook notifications for all state changes",
    "",
    "Each transaction generates a unique virtual bank account. Buyers transfer funds",
    "to this account, which are held until delivery is confirmed or the auto-release",
    "timer expires. The system supports dispute resolution and instant refunds.",
  ];
  overview.forEach((line, i) => doc.text(line, margin, 50 + i * 7));

  // Page 3 - Transaction Flow
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, w, 297, "F");
  doc.setTextColor(20);
  doc.setFontSize(22);
  doc.text("2. Transaction Flow", margin, 30);
  doc.setFontSize(11);
  doc.setTextColor(60);
  const flow = [
    "Step 1: ESCROW CREATED",
    "   → DVA generated via Paystack API",
    "   → Unique account number assigned to transaction",
    "",
    "Step 2: FUNDS RECEIVED",
    "   → Buyer transfers to DVA",
    "   → Paystack webhook confirms payment",
    "   → Seller notified to proceed",
    "",
    "Step 3: DELIVERY / MILESTONES",
    "   → Marketplace: Single delivery confirmation",
    "   → Services: Milestone-based partial releases",
    "   → Properties: Agent-coordinated verification",
    "",
    "Step 4: CONFIRMATION & RELEASE",
    "   → Buyer confirms delivery (or 3-day auto-release)",
    "   → 7-day dispute window opens",
    "   → Funds transferred via Paystack Transfers API",
    "",
    "Step 5: COMMISSION SPLIT",
    "   → Platform fee: 5% (configurable)",
    "   → Agent fee: 2.5% (properties only)",
    "   → Remaining funds to seller",
  ];
  flow.forEach((line, i) => doc.text(line, margin, 50 + i * 7));

  // Page 4 - Security
  doc.addPage();
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 0, w, 297, "F");
  doc.setTextColor(20);
  doc.setFontSize(22);
  doc.text("3. Security & Compliance", margin, 30);
  doc.setFontSize(11);
  doc.setTextColor(60);
  const security = [
    "Fund Safety:",
    "• All funds held in Paystack-managed virtual accounts",
    "• No direct access to funds by Vivesa platform code",
    "• Bank-grade encryption on all financial data",
    "",
    "Dispute Resolution:",
    "• Automated evidence collection from both parties",
    "• 7-day resolution SLA with escalation procedures",
    "• Full transaction audit trail stored in database",
    "",
    "Compliance:",
    "• CBN-compliant payment processing via Paystack",
    "• KYC verification for high-value transactions",
    "• Anti-money laundering (AML) screening",
    "",
    "",
    "For more information, contact: partnerships@zymaxon.com",
  ];
  security.forEach((line, i) => doc.text(line, margin, 50 + i * 7));

  doc.save("Vivesa-Escrow-Whitepaper.pdf");
};

interface DownloadSectionProps {
  onDownload?: () => void;
}

const DownloadSection = ({ onDownload }: DownloadSectionProps) => {
  const handleDownload = () => {
    generateWhitepaper();
    onDownload?.();
  };

  return (
    <section className="py-20 md:py-28 relative" style={{ background: 'linear-gradient(180deg, hsl(234 50% 5%) 0%, hsl(234 50% 8%) 100%)' }}>
      <div className="container px-4 md:px-6">
        <div className="max-w-2xl mx-auto text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-display font-semibold text-foreground">
            Get the Full Documentation
          </h2>
          <p className="text-muted-foreground">
            Download the technical whitepaper or explore the Vivesa pitch deck for the complete business case.
          </p>

          <div className="grid sm:grid-cols-2 gap-4">
            <button
              onClick={handleDownload}
              className="group p-6 rounded-xl bg-card border border-border/50 hover:border-primary/40 transition-all text-left"
            >
              <FileText className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Technical Whitepaper</h3>
              <p className="text-sm text-muted-foreground mb-4">4-page PDF covering escrow architecture, flow, and security.</p>
              <span className="inline-flex items-center gap-2 text-sm text-primary font-medium">
                <Download className="w-4 h-4" /> Download PDF
              </span>
            </button>

            <Link
              to="/pitch-deck"
              className="group p-6 rounded-xl bg-card border border-border/50 hover:border-primary/40 transition-all text-left"
            >
              <Presentation className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-semibold text-foreground mb-1">Vivesa Pitch Deck</h3>
              <p className="text-sm text-muted-foreground mb-4">Interactive 6-slide presentation with full business overview.</p>
              <span className="inline-flex items-center gap-2 text-sm text-primary font-medium">
                <Presentation className="w-4 h-4" /> View Deck
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export { generateWhitepaper };
export default DownloadSection;
