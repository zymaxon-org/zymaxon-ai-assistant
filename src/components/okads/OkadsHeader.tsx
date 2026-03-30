import { Link, useNavigate } from 'react-router-dom';
import { ShoppingCart, User, Search, Menu, X, Fish } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from './shared/useCart';
import { useOkadsAuth } from './shared/useOkadsAuth';
import { useState } from 'react';

export default function OkadsHeader() {
  const { totalItems } = useCart();
  const { user, signOut } = useOkadsAuth();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) navigate(`/okads/shop?q=${encodeURIComponent(search.trim())}`);
  };

  return (
    <header className="sticky top-0 z-50 bg-[#042F2E] text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center gap-4">
        {/* Logo */}
        <Link to="/okads" className="flex items-center gap-2 shrink-0">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-400 to-teal-600 flex items-center justify-center">
            <Fish className="w-6 h-6 text-white" />
          </div>
          <span className="text-xl font-bold tracking-tight hidden sm:block">
            Okads<span className="text-teal-400">Seafood</span>
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearch} className="flex-1 max-w-md hidden md:flex">
          <div className="relative w-full">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-teal-300" />
            <Input
              placeholder="Search for fish, prawns, crayfish..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-teal-900/50 border-teal-700 text-white placeholder:text-teal-400 focus-visible:ring-teal-500"
            />
          </div>
        </form>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link to="/okads/shop" className="hover:text-teal-300 transition-colors">Shop</Link>
          {user ? (
            <>
              <Link to="/okads/orders" className="hover:text-teal-300 transition-colors">Orders</Link>
              <button onClick={signOut} className="hover:text-teal-300 transition-colors">Logout</button>
            </>
          ) : (
            <Link to="/okads/auth" className="hover:text-teal-300 transition-colors">Login</Link>
          )}
        </nav>

        {/* Cart */}
        <Link to="/okads/cart" className="relative shrink-0">
          <ShoppingCart className="w-6 h-6 text-teal-300 hover:text-white transition-colors" />
          {totalItems > 0 && (
            <span className="absolute -top-2 -right-2 bg-orange-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center font-bold">
              {totalItems}
            </span>
          )}
        </Link>

        {/* Mobile menu */}
        <button className="md:hidden" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden bg-teal-900 px-4 py-4 space-y-3">
          <form onSubmit={handleSearch}>
            <Input
              placeholder="Search products..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="bg-teal-800 border-teal-600 text-white placeholder:text-teal-400"
            />
          </form>
          <Link to="/okads/shop" className="block py-2 hover:text-teal-300" onClick={() => setMenuOpen(false)}>Shop</Link>
          {user ? (
            <>
              <Link to="/okads/orders" className="block py-2 hover:text-teal-300" onClick={() => setMenuOpen(false)}>My Orders</Link>
              <button onClick={() => { signOut(); setMenuOpen(false); }} className="block py-2 hover:text-teal-300">Logout</button>
            </>
          ) : (
            <Link to="/okads/auth" className="block py-2 hover:text-teal-300" onClick={() => setMenuOpen(false)}>Login / Sign Up</Link>
          )}
        </div>
      )}
    </header>
  );
}
