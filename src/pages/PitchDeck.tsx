import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

import PitchDeckControls from "@/components/pitch-deck/PitchDeckControls";
import TitleSlide from "@/components/pitch-deck/slides/TitleSlide";
import ProblemSlide from "@/components/pitch-deck/slides/ProblemSlide";
import SolutionSlide from "@/components/pitch-deck/slides/SolutionSlide";
import ProductsSlide from "@/components/pitch-deck/slides/ProductsSlide";
import MarketSlide from "@/components/pitch-deck/slides/MarketSlide";
import ContactSlide from "@/components/pitch-deck/slides/ContactSlide";

const slides = [
  { id: "title", component: TitleSlide },
  { id: "problem", component: ProblemSlide },
  { id: "solution", component: SolutionSlide },
  { id: "products", component: ProductsSlide },
  { id: "market", component: MarketSlide },
  { id: "contact", component: ContactSlide },
];

const PitchDeck = () => {
  const navigate = useNavigate();
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);
  const slideRefs = useRef<(HTMLDivElement | null)[]>([]);

  const goToSlide = useCallback((index: number) => {
    if (index >= 0 && index < slides.length) {
      setCurrentSlide(index);
    }
  }, []);

  const nextSlide = useCallback(() => {
    goToSlide(currentSlide + 1);
  }, [currentSlide, goToSlide]);

  const previousSlide = useCallback(() => {
    goToSlide(currentSlide - 1);
  }, [currentSlide, goToSlide]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "ArrowRight":
        case " ":
          e.preventDefault();
          nextSlide();
          break;
        case "ArrowLeft":
          e.preventDefault();
          previousSlide();
          break;
        case "Escape":
          e.preventDefault();
          navigate("/");
          break;
        case "f":
        case "F":
          e.preventDefault();
          toggleFullscreen();
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [nextSlide, previousSlide, navigate]);

  const toggleFullscreen = async () => {
    if (!document.fullscreenElement) {
      await document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      await document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    return () => document.removeEventListener("fullscreenchange", handleFullscreenChange);
  }, []);

  const generatePDF = async () => {
    setIsGeneratingPDF(true);
    
    try {
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "px",
        format: [1920, 1080],
      });

      for (let i = 0; i < slides.length; i++) {
        // Temporarily show the slide we want to capture
        const originalSlide = currentSlide;
        setCurrentSlide(i);
        
        // Wait for render
        await new Promise(resolve => setTimeout(resolve, 500));
        
        const slideElement = slideRefs.current[i];
        if (slideElement) {
          const canvas = await html2canvas(slideElement, {
            scale: 2,
            useCORS: true,
            allowTaint: true,
            backgroundColor: "#0D0D2B",
            width: 1920,
            height: 1080,
          });
          
          const imgData = canvas.toDataURL("image/png");
          
          if (i > 0) {
            pdf.addPage([1920, 1080], "landscape");
          }
          
          pdf.addImage(imgData, "PNG", 0, 0, 1920, 1080);
        }
        
        setCurrentSlide(originalSlide);
      }
      
      pdf.save("Vivesa-Pitch-Deck.pdf");
    } catch (error) {
      console.error("Error generating PDF:", error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const CurrentSlideComponent = slides[currentSlide].component;

  return (
    <div className="fixed inset-0 bg-[#0D0D2B] overflow-hidden">
      {/* Hidden slides for PDF generation */}
      <div className="fixed left-[-9999px] top-0">
        {slides.map((slide, index) => {
          const SlideComponent = slide.component;
          return (
            <div 
              key={slide.id}
              ref={(el) => (slideRefs.current[index] = el)}
              style={{ width: 1920, height: 1080 }}
            >
              <SlideComponent />
            </div>
          );
        })}
      </div>
      
      {/* Current visible slide */}
      <div className="w-full h-full transition-opacity duration-500">
        <CurrentSlideComponent />
      </div>
      
      {/* Controls */}
      <PitchDeckControls
        currentSlide={currentSlide}
        totalSlides={slides.length}
        onPrevious={previousSlide}
        onNext={nextSlide}
        onGoToSlide={goToSlide}
        onDownload={generatePDF}
        onToggleFullscreen={toggleFullscreen}
        onExit={() => navigate("/")}
        isFullscreen={isFullscreen}
        isGeneratingPDF={isGeneratingPDF}
      />
    </div>
  );
};

export default PitchDeck;
