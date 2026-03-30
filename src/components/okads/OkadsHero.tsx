import { Link } from 'react-router-dom';
import { MapPin, ArrowRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function OkadsHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#042F2E] via-[#134E4A] to-[#0D9488] text-white">
      {/* Wave decoration */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" className="w-full" preserveAspectRatio="none">
          <path d="M0,60 C360,120 720,0 1080,60 C1260,90 1380,80 1440,60 L1440,120 L0,120Z" fill="#F0FDFA" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-16 md:py-24 relative z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 text-sm">
              <MapPin className="w-4 h-4 text-orange-400" />
              <span>Delivering across Abuja, FCT</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-extrabold leading-tight">
              Fresh Seafood,{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-300 to-orange-400">
                Delivered
              </span>{' '}
              to Your Door
            </h1>

            <p className="text-lg md:text-xl text-teal-100 max-w-lg">
              Premium fish, prawns, crabs & more — straight from the water to your kitchen. 
              Next day delivery in Abuja. No wahala! 🐟
            </p>

            <div className="flex flex-col sm:flex-row gap-3">
              <Link to="/okads/shop">
                <Button size="lg" className="bg-orange-500 hover:bg-orange-600 text-white font-bold gap-2 w-full sm:w-auto">
                  Start Shopping
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <a href="https://wa.me/2347014366630" target="_blank" rel="noopener noreferrer">
              <Button size="lg" className="bg-white/10 border border-white/30 text-white hover:bg-white/20 gap-2 w-full sm:w-auto">
                  <MessageCircle className="w-5 h-5" />
                  Order via WhatsApp
                </Button>
              </a>
            </div>

            <div className="flex items-center gap-6 text-sm text-teal-200 pt-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                Fresh Daily
              </div>
              <div>🚚 Next Day Delivery</div>
              <div>💳 Pay Online</div>
            </div>
          </div>

          {/* Hero image placeholder */}
          <div className="hidden md:flex justify-center">
            <div className="relative w-80 h-80">
              <div className="absolute inset-0 bg-gradient-to-br from-teal-400/20 to-orange-400/20 rounded-full animate-pulse" />
              <div className="absolute inset-4 bg-gradient-to-br from-teal-500/30 to-teal-700/30 rounded-full backdrop-blur-sm border border-white/10 flex items-center justify-center">
                <div className="text-center space-y-2">
                  <span className="text-7xl">🦐</span>
                  <p className="text-sm font-medium text-teal-200">Premium Quality</p>
                </div>
              </div>
              {/* Floating food icons */}
              <div className="absolute -top-4 right-0 text-4xl animate-bounce" style={{ animationDelay: '0.5s' }}>🐟</div>
              <div className="absolute bottom-8 -left-4 text-3xl animate-bounce" style={{ animationDelay: '1s' }}>🦀</div>
              <div className="absolute top-16 -right-8 text-3xl animate-bounce" style={{ animationDelay: '1.5s' }}>🐙</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
