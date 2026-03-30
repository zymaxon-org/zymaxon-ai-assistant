import { Phone, Mail, MapPin, MessageCircle, Fish } from 'lucide-react';

export default function OkadsFooter() {
  return (
    <footer className="bg-[#042F2E] text-teal-100">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
                <Fish className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">
                Okads<span className="text-teal-400">Seafood</span>
              </span>
            </div>
            <p className="text-sm text-teal-300">
              Premium seafood delivered fresh to your doorstep in Abuja. Quality you can trust.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/okads/shop" className="hover:text-teal-400 transition-colors">Shop All</a></li>
              <li><a href="/okads/shop/fresh-fish" className="hover:text-teal-400 transition-colors">Fresh Fish</a></li>
              <li><a href="/okads/shop/seafood-delights" className="hover:text-teal-400 transition-colors">Seafood Delights</a></li>
              <li><a href="/okads/shop/frozen-food" className="hover:text-teal-400 transition-colors">Frozen Food</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-teal-400" />
                +234 701 436 6630
              </li>
              <li className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-teal-400" />
                Abuja, FCT, Nigeria
              </li>
              <li>
                <a
                  href="https://wa.me/2347014366630"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-teal-400 transition-colors"
                >
                  <MessageCircle className="w-4 h-4 text-green-400" />
                  Chat on WhatsApp
                </a>
              </li>
            </ul>
          </div>

          {/* Hours */}
          <div>
            <h4 className="font-bold text-white mb-4">Opening Hours</h4>
            <ul className="space-y-2 text-sm">
              <li>Monday – Saturday: 8AM – 7PM</li>
              <li>Sunday: 10AM – 5PM</li>
              <li className="text-teal-400 font-medium mt-3">🚚 Next Day Delivery</li>
              <li className="text-orange-400 font-medium">💰 Delivery Fee: ₦2,000</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-teal-800 mt-8 pt-6 text-center text-sm text-teal-500">
          <p>© {new Date().getFullYear()} Okads Seafood & More. Built by <a href="/" className="text-teal-400 hover:underline">Zymaxon</a>.</p>
        </div>
      </div>
    </footer>
  );
}
