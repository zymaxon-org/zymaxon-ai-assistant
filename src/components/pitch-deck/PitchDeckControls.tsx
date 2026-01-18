import { ChevronLeft, ChevronRight, Download, Maximize, Minimize, X } from "lucide-react";
import { Button } from "@/components/ui/button";

interface PitchDeckControlsProps {
  currentSlide: number;
  totalSlides: number;
  onPrevious: () => void;
  onNext: () => void;
  onGoToSlide: (index: number) => void;
  onDownload: () => void;
  onToggleFullscreen: () => void;
  onExit: () => void;
  isFullscreen: boolean;
  isGeneratingPDF: boolean;
}

const PitchDeckControls = ({
  currentSlide,
  totalSlides,
  onPrevious,
  onNext,
  onGoToSlide,
  onDownload,
  onToggleFullscreen,
  onExit,
  isFullscreen,
  isGeneratingPDF
}: PitchDeckControlsProps) => {
  return (
    <>
      {/* Top Bar */}
      <div className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-4 py-3 bg-black/40 backdrop-blur-sm">
        <Button
          variant="ghost"
          size="sm"
          onClick={onExit}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5 mr-2" />
          Exit
        </Button>
        
        <div className="text-white/70 text-sm">
          {currentSlide + 1} / {totalSlides}
        </div>
        
        <Button
          variant="ghost"
          size="sm"
          onClick={onToggleFullscreen}
          className="text-white/70 hover:text-white hover:bg-white/10"
        >
          {isFullscreen ? (
            <Minimize className="w-5 h-5" />
          ) : (
            <Maximize className="w-5 h-5" />
          )}
        </Button>
      </div>
      
      {/* Bottom Controls */}
      <div className="fixed bottom-0 left-0 right-0 z-50 flex items-center justify-center gap-4 px-4 py-4 bg-black/40 backdrop-blur-sm">
        {/* Previous */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onPrevious}
          disabled={currentSlide === 0}
          className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronLeft className="w-6 h-6" />
        </Button>
        
        {/* Slide Indicators */}
        <div className="flex items-center gap-2">
          {Array.from({ length: totalSlides }).map((_, index) => (
            <button
              key={index}
              onClick={() => onGoToSlide(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentSlide 
                  ? 'bg-primary w-6' 
                  : 'bg-white/30 hover:bg-white/50'
              }`}
            />
          ))}
        </div>
        
        {/* Next */}
        <Button
          variant="ghost"
          size="icon"
          onClick={onNext}
          disabled={currentSlide === totalSlides - 1}
          className="text-white/70 hover:text-white hover:bg-white/10 disabled:opacity-30"
        >
          <ChevronRight className="w-6 h-6" />
        </Button>
        
        {/* Divider */}
        <div className="w-px h-6 bg-white/20 mx-2" />
        
        {/* Download */}
        <Button
          variant="default"
          size="sm"
          onClick={onDownload}
          disabled={isGeneratingPDF}
          className="bg-primary hover:bg-primary/90"
        >
          <Download className="w-4 h-4 mr-2" />
          {isGeneratingPDF ? 'Generating...' : 'Download PDF'}
        </Button>
      </div>
    </>
  );
};

export default PitchDeckControls;
