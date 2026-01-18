import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SlideContainerProps {
  children: ReactNode;
  className?: string;
  gradient?: "primary" | "dark" | "light" | "accent";
}

const gradients = {
  primary: "bg-gradient-to-br from-[#0D0D2B] via-[#1a1a3e] to-[#0D0D2B]",
  dark: "bg-[#0D0D2B]",
  light: "bg-gradient-to-br from-background to-muted/30",
  accent: "bg-gradient-to-br from-primary/10 via-background to-primary/5",
};

const SlideContainer = ({ children, className, gradient = "dark" }: SlideContainerProps) => {
  return (
    <div
      className={cn(
        "w-full h-full min-h-screen flex flex-col items-center justify-center p-8 md:p-16 relative overflow-hidden",
        gradients[gradient],
        className
      )}
    >
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.3) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}
        />
      </div>
      
      {/* Gradient orbs */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-primary/20 rounded-full blur-3xl" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-primary/10 rounded-full blur-3xl" />
      
      <div className="relative z-10 w-full max-w-6xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export default SlideContainer;
