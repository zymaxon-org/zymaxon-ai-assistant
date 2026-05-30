import { ReactNode } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck, LayoutDashboard, Package, AlertTriangle, ArrowLeftRight, MessageSquare, Bell, User, LogOut, Building2, Shield, Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useTTAuth } from './useTTAuth';

const userNav = [
  { to: '/trusttag/app', icon: LayoutDashboard, label: 'Dashboard', end: true },
  { to: '/trusttag/app/items', icon: Package, label: 'My Items' },
  { to: '/trusttag/app/lost', icon: AlertTriangle, label: 'Lost & Found' },
  { to: '/trusttag/app/transfers', icon: ArrowLeftRight, label: 'Transfers' },
  { to: '/trusttag/app/messages', icon: MessageSquare, label: 'Messages' },
  { to: '/trusttag/app/notifications', icon: Bell, label: 'Notifications' },
  { to: '/trusttag/app/profile', icon: User, label: 'Profile' },
];

export function TTLayout({ children }: { children: ReactNode }) {
  const { user, roles, signOut } = useTTAuth();
  const nav = useNavigate();
  const loc = useLocation();

  const items = [...userNav];
  if (roles.includes('manufacturer')) items.push({ to: '/trusttag/brand', icon: Building2, label: 'Brand Portal' });
  if (roles.includes('admin')) items.push({ to: '/trusttag/admin', icon: Shield, label: 'Admin' });

  const NavList = () => (
    <nav className="flex flex-col gap-1">
      {items.map((item) => {
        const active = item.end ? loc.pathname === item.to : loc.pathname.startsWith(item.to);
        return (
          <Link key={item.to} to={item.to}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all ${
              active ? 'bg-tt-primary/10 text-tt-primary font-medium' : 'text-tt-muted hover:bg-tt-glass hover:text-tt-fg'
            }`}>
            <item.icon className="h-4 w-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );

  return (
    <div className="trusttag min-h-screen bg-tt-bg text-tt-fg">
      <header className="sticky top-0 z-40 border-b border-tt-border bg-tt-bg/80 backdrop-blur-xl">
        <div className="flex h-14 items-center gap-3 px-4">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden"><Menu className="h-5 w-5" /></Button>
            </SheetTrigger>
            <SheetContent side="left" className="trusttag bg-tt-bg border-tt-border w-72">
              <Link to="/trusttag" className="flex items-center gap-2 mb-6">
                <ShieldCheck className="h-6 w-6 text-tt-primary" />
                <span className="font-display font-bold text-lg">TrustTag</span>
              </Link>
              <NavList />
            </SheetContent>
          </Sheet>
          <Link to="/trusttag" className="flex items-center gap-2">
            <ShieldCheck className="h-6 w-6 text-tt-primary" />
            <span className="font-display font-bold text-lg hidden sm:inline">TrustTag</span>
          </Link>
          <div className="flex-1" />
          <span className="text-xs text-tt-muted hidden sm:inline truncate max-w-[200px]">{user?.email}</span>
          <Button variant="ghost" size="sm" onClick={async () => { await signOut(); nav('/trusttag'); }}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </header>
      <div className="flex">
        <aside className="hidden md:block w-64 shrink-0 border-r border-tt-border min-h-[calc(100vh-3.5rem)] p-4">
          <NavList />
        </aside>
        <main className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full">{children}</main>
      </div>
    </div>
  );
}

export function AuthGate({ children }: { children: ReactNode }) {
  const { user, loading } = useTTAuth();
  const nav = useNavigate();
  if (loading) return <div className="trusttag min-h-screen flex items-center justify-center bg-tt-bg text-tt-muted">Loading…</div>;
  if (!user) { nav('/trusttag/auth'); return null; }
  return <>{children}</>;
}

export function RoleGate({ role, children }: { role: 'manufacturer' | 'admin'; children: ReactNode }) {
  const { roles, loading, user } = useTTAuth();
  const nav = useNavigate();
  if (loading) return <div className="trusttag min-h-screen flex items-center justify-center bg-tt-bg text-tt-muted">Loading…</div>;
  if (!user) { nav('/trusttag/auth'); return null; }
  if (!roles.includes(role)) {
    return (
      <TTLayout>
        <div className="tt-glass rounded-2xl p-12 text-center">
          <Shield className="h-12 w-12 mx-auto text-tt-muted mb-4" />
          <h2 className="text-xl font-display font-bold mb-2">Access Restricted</h2>
          <p className="text-tt-muted mb-6">You need the <strong>{role}</strong> role to view this page.</p>
          {role === 'manufacturer' && (
            <Button onClick={() => nav('/trusttag/app/profile')}>Request Manufacturer Access</Button>
          )}
        </div>
      </TTLayout>
    );
  }
  return <>{children}</>;
}
