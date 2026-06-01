import { ReactNode, useEffect, useState } from 'react';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  ShieldCheck, LayoutDashboard, Package, AlertTriangle, ArrowLeftRight,
  Bell, Settings, LogOut, Menu, Search, Building2, Shield, X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useAuth } from './useAuth';
import { supabase } from '@/integrations/supabase/client';

export function TTBrand({ className = '' }: { className?: string }) {
  return (
    <Link to="/tracetag" className={`inline-flex items-center gap-2 ${className}`}>
      <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-tt-navy text-white">
        <ShieldCheck className="h-5 w-5" />
      </span>
      <span className="font-bold text-lg text-tt-navy tracking-tight">TraceTag</span>
      <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded bg-tt-navy/10 text-tt-navy">NG</span>
    </Link>
  );
}

const publicLinks = [
  { to: '/tracetag/search', label: 'Verify Item' },
  { to: '/tracetag/how-it-works', label: 'How it works' },
  { to: '/tracetag/pricing', label: 'Pricing' },
  { to: '/tracetag/about', label: 'About' },
];

export function PublicHeader() {
  const { user } = useAuth();
  const [open, setOpen] = useState(false);
  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur border-b border-tt-border">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center gap-4">
        <TTBrand />
        <nav className="hidden md:flex items-center gap-6 ml-6 flex-1">
          {publicLinks.map(l => (
            <NavLink key={l.to} to={l.to}
              className={({isActive}) => `text-sm font-medium ${isActive ? 'text-tt-navy' : 'text-slate-600 hover:text-tt-navy'}`}>
              {l.label}
            </NavLink>
          ))}
        </nav>
        <div className="hidden md:flex items-center gap-2 ml-auto">
          {user ? (
            <Button asChild className="bg-tt-navy hover:bg-tt-navy/90 text-white"><Link to="/tracetag/app">Dashboard</Link></Button>
          ) : (
            <>
              <Button asChild variant="ghost"><Link to="/tracetag/auth">Log in</Link></Button>
              <Button asChild className="bg-tt-navy hover:bg-tt-navy/90 text-white"><Link to="/tracetag/auth?tab=signup">Register Items</Link></Button>
            </>
          )}
        </div>
        <Button variant="ghost" size="icon" className="md:hidden ml-auto" onClick={() => setOpen(true)}>
          <Menu className="h-5 w-5" />
        </Button>
      </div>
      {open && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="h-16 px-4 flex items-center justify-between border-b">
            <TTBrand />
            <Button variant="ghost" size="icon" onClick={() => setOpen(false)}><X className="h-5 w-5" /></Button>
          </div>
          <nav className="p-4 flex flex-col gap-1">
            {publicLinks.map(l => (
              <Link key={l.to} to={l.to} onClick={() => setOpen(false)}
                className="px-3 py-3 rounded-lg text-base font-medium hover:bg-slate-100">{l.label}</Link>
            ))}
            <div className="h-px bg-slate-200 my-2" />
            {user ? (
              <Button asChild className="bg-tt-navy text-white w-full"><Link to="/tracetag/app">Dashboard</Link></Button>
            ) : (
              <>
                <Button asChild variant="outline" className="w-full"><Link to="/tracetag/auth">Log in</Link></Button>
                <Button asChild className="bg-tt-navy text-white w-full"><Link to="/tracetag/auth?tab=signup">Register Items</Link></Button>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}

export function PublicFooter() {
  return (
    <footer className="bg-tt-navy text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12 grid md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-3">
            <ShieldCheck className="h-6 w-6" />
            <span className="font-bold text-lg">TraceTag</span>
          </div>
          <p className="text-sm text-white/70">Nigeria's national item registry and stolen goods verification platform.</p>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Platform</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/tracetag/search" className="hover:text-white">Verify item</Link></li>
            <li><Link to="/tracetag/how-it-works" className="hover:text-white">How it works</Link></li>
            <li><Link to="/tracetag/pricing" className="hover:text-white">Pricing</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Company</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/tracetag/about" className="hover:text-white">About</Link></li>
            <li><Link to="/tracetag/contact" className="hover:text-white">Contact</Link></li>
          </ul>
        </div>
        <div>
          <h4 className="font-semibold mb-3 text-sm">Legal</h4>
          <ul className="space-y-2 text-sm text-white/70">
            <li><Link to="/tracetag/privacy" className="hover:text-white">Privacy Policy</Link></li>
            <li><Link to="/tracetag/terms" className="hover:text-white">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-white/10 py-4 text-center text-xs text-white/50">
        © {new Date().getFullYear()} TraceTag Nigeria. A Vivesa platform.
      </div>
    </footer>
  );
}

const userNav = [
  { to: '/tracetag/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/tracetag/app/items', icon: Package, label: 'My Items' },
  { to: '/tracetag/app/items/new', icon: Package, label: 'Register Item' },
  { to: '/tracetag/app/notifications', icon: Bell, label: 'Notifications' },
  { to: '/tracetag/app/settings', icon: Settings, label: 'Settings' },
];

export function AppLayout({ children, role = 'user' }: { children: ReactNode; role?: 'user'|'dealer'|'admin' }) {
  const { user, roles, signOut } = useAuth();
  const nav = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);

  let items = userNav;
  if (role === 'dealer') items = [
    { to: '/tracetag/dealer', icon: LayoutDashboard, label: 'Dashboard', end: true },
    { to: '/tracetag/dealer/verify', icon: Search, label: 'Bulk Verify' },
    { to: '/tracetag/dealer/history', icon: Package, label: 'History' },
    { to: '/tracetag/dealer/api', icon: Shield, label: 'API Keys' },
    { to: '/tracetag/dealer/billing', icon: Settings, label: 'Billing' },
  ];
  if (role === 'admin') items = [
    { to: '/tracetag/admin', icon: LayoutDashboard, label: 'Overview', end: true },
    { to: '/tracetag/admin/users', icon: Package, label: 'Users' },
    { to: '/tracetag/admin/items', icon: Package, label: 'Items' },
    { to: '/tracetag/admin/stolen', icon: AlertTriangle, label: 'Stolen Reports' },
    { to: '/tracetag/admin/tips', icon: Bell, label: 'Tips' },
    { to: '/tracetag/admin/dealers', icon: Building2, label: 'Dealers' },
    { to: '/tracetag/admin/logs', icon: Search, label: 'Search Logs' },
    { to: '/tracetag/admin/analytics', icon: LayoutDashboard, label: 'Analytics' },
  ];

  const NavList = ({ onPick }: { onPick?: () => void }) => (
    <nav className="flex flex-col gap-1">
      {items.map(it => {
        const active = it.end ? loc.pathname === it.to : loc.pathname.startsWith(it.to);
        return (
          <Link key={it.to} to={it.to} onClick={onPick}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition ${
              active ? 'bg-tt-navy text-white' : 'text-slate-700 hover:bg-slate-100'
            }`}>
            <it.icon className="h-4 w-4" />{it.label}
          </Link>
        );
      })}
      <div className="h-px bg-slate-200 my-2" />
      {roles.includes('dealer') && role !== 'dealer' &&
        <Link to="/tracetag/dealer" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100">
          <Building2 className="h-4 w-4" />Dealer portal</Link>}
      {roles.includes('admin') && role !== 'admin' &&
        <Link to="/tracetag/admin" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100">
          <Shield className="h-4 w-4" />Admin</Link>}
      {role !== 'user' &&
        <Link to="/tracetag/app" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-slate-700 hover:bg-slate-100">
          <LayoutDashboard className="h-4 w-4" />User dashboard</Link>}
    </nav>
  );

  return (
    <div className="tracetag min-h-screen bg-slate-50 text-slate-900">
      <header className="sticky top-0 z-40 bg-white border-b border-tt-border">
        <div className="h-14 px-4 flex items-center gap-3">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <TTBrand />
          <div className="flex-1" />
          <span className="text-xs text-slate-500 hidden sm:inline truncate max-w-[200px]">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={async () => { await signOut(); nav('/tracetag'); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden md:block w-64 shrink-0 border-r border-tt-border min-h-[calc(100vh-3.5rem)] p-4 bg-white">
          <NavList />
        </aside>
        {open && (
          <div className="md:hidden fixed inset-0 z-50 bg-black/40" onClick={() => setOpen(false)}>
            <div className="absolute left-0 top-0 bottom-0 w-72 bg-white p-4" onClick={e => e.stopPropagation()}>
              <div className="flex items-center justify-between mb-4">
                <TTBrand />
                <Button variant="ghost" size="icon" onClick={() => setOpen(false)}><X className="h-5 w-5" /></Button>
              </div>
              <NavList onPick={() => setOpen(false)} />
            </div>
          </div>
        )}
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!loading && !user) nav('/tracetag/auth'); }, [user, loading, nav]);
  if (loading || !user) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading…</div>;
  return <>{children}</>;
}

export function RoleGate({ role, children }: { role: 'dealer'|'admin'; children: ReactNode }) {
  const { roles, loading, user } = useAuth();
  const nav = useNavigate();
  useEffect(() => { if (!loading && !user) nav('/tracetag/auth'); }, [user, loading, nav]);
  if (loading || !user) return <div className="min-h-screen flex items-center justify-center text-slate-500">Loading…</div>;
  if (!roles.includes(role)) return (
    <AppLayout role="user">
      <div className="bg-white rounded-2xl p-12 text-center border">
        <Shield className="h-12 w-12 mx-auto text-slate-400 mb-4" />
        <h2 className="text-xl font-bold mb-2">Access restricted</h2>
        <p className="text-slate-600 mb-6">You need the <strong>{role}</strong> role for this area.</p>
        {role === 'dealer' && <Button asChild className="bg-tt-navy text-white"><Link to="/tracetag/auth?tab=dealer">Apply for dealer account</Link></Button>}
      </div>
    </AppLayout>
  );
  return <>{children}</>;
}
