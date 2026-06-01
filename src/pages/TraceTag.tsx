import { Routes, Route, Navigate, useParams } from 'react-router-dom';
import { AuthGate, RoleGate } from '@/components/tracetag/shared/Layout';

import Landing from '@/components/tracetag/public/Landing';
import SearchPage from '@/components/tracetag/public/SearchPage';
import ItemStatusPage from '@/components/tracetag/public/ItemStatusPage';
import AuthPage from '@/components/tracetag/public/AuthPage';
import Pricing from '@/components/tracetag/public/Pricing';
import About from '@/components/tracetag/public/About';
import HowItWorks from '@/components/tracetag/public/HowItWorks';
import Contact from '@/components/tracetag/public/Contact';
import Privacy from '@/components/tracetag/public/Privacy';
import Terms from '@/components/tracetag/public/Terms';

import Dashboard from '@/components/tracetag/app/Dashboard';
import MyItems from '@/components/tracetag/app/MyItems';
import RegisterItem from '@/components/tracetag/app/RegisterItem';
import ItemDetail from '@/components/tracetag/app/ItemDetail';
import ReportStolen from '@/components/tracetag/app/ReportStolen';
import TransferOwnership from '@/components/tracetag/app/TransferOwnership';
import NotificationsPage from '@/components/tracetag/app/NotificationsPage';
import SettingsPage from '@/components/tracetag/app/SettingsPage';
import TipPage from '@/components/tracetag/app/TipPage';

import DealerDashboard from '@/components/tracetag/dealer/DealerDashboard';
import BulkVerify from '@/components/tracetag/dealer/BulkVerify';
import VerifyHistory from '@/components/tracetag/dealer/VerifyHistory';
import ApiKeys from '@/components/tracetag/dealer/ApiKeys';
import Billing from '@/components/tracetag/dealer/Billing';

import AdminOverview from '@/components/tracetag/admin/AdminOverview';
import AdminUsers from '@/components/tracetag/admin/AdminUsers';
import AdminItems from '@/components/tracetag/admin/AdminItems';
import AdminStolen from '@/components/tracetag/admin/AdminStolen';
import AdminTips from '@/components/tracetag/admin/AdminTips';
import AdminDealers from '@/components/tracetag/admin/AdminDealers';
import AdminLogs from '@/components/tracetag/admin/AdminLogs';
import AdminAnalytics from '@/components/tracetag/admin/AdminAnalytics';

function LegacyTrustTagRedirect() {
  const { '*': rest } = useParams();
  return <Navigate to={`/tracetag/${rest ?? ''}`} replace />;
}

export default function TraceTag() {
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="search" element={<SearchPage />} />
      <Route path="item/:assetId" element={<ItemStatusPage />} />
      <Route path="auth" element={<AuthPage />} />
      <Route path="pricing" element={<Pricing />} />
      <Route path="about" element={<About />} />
      <Route path="how-it-works" element={<HowItWorks />} />
      <Route path="contact" element={<Contact />} />
      <Route path="privacy" element={<Privacy />} />
      <Route path="terms" element={<Terms />} />
      <Route path="tip" element={<TipPage />} />

      <Route path="app" element={<AuthGate><Dashboard /></AuthGate>} />
      <Route path="app/items" element={<AuthGate><MyItems /></AuthGate>} />
      <Route path="app/items/new" element={<AuthGate><RegisterItem /></AuthGate>} />
      <Route path="app/items/:id" element={<AuthGate><ItemDetail /></AuthGate>} />
      <Route path="app/items/:id/stolen" element={<AuthGate><ReportStolen /></AuthGate>} />
      <Route path="app/items/:id/transfer" element={<AuthGate><TransferOwnership /></AuthGate>} />
      <Route path="app/notifications" element={<AuthGate><NotificationsPage /></AuthGate>} />
      <Route path="app/settings" element={<AuthGate><SettingsPage /></AuthGate>} />

      <Route path="dealer" element={<RoleGate role="dealer"><DealerDashboard /></RoleGate>} />
      <Route path="dealer/verify" element={<RoleGate role="dealer"><BulkVerify /></RoleGate>} />
      <Route path="dealer/history" element={<RoleGate role="dealer"><VerifyHistory /></RoleGate>} />
      <Route path="dealer/api" element={<RoleGate role="dealer"><ApiKeys /></RoleGate>} />
      <Route path="dealer/billing" element={<RoleGate role="dealer"><Billing /></RoleGate>} />

      <Route path="admin" element={<RoleGate role="admin"><AdminOverview /></RoleGate>} />
      <Route path="admin/users" element={<RoleGate role="admin"><AdminUsers /></RoleGate>} />
      <Route path="admin/items" element={<RoleGate role="admin"><AdminItems /></RoleGate>} />
      <Route path="admin/stolen" element={<RoleGate role="admin"><AdminStolen /></RoleGate>} />
      <Route path="admin/tips" element={<RoleGate role="admin"><AdminTips /></RoleGate>} />
      <Route path="admin/dealers" element={<RoleGate role="admin"><AdminDealers /></RoleGate>} />
      <Route path="admin/logs" element={<RoleGate role="admin"><AdminLogs /></RoleGate>} />
      <Route path="admin/analytics" element={<RoleGate role="admin"><AdminAnalytics /></RoleGate>} />

      <Route path="*" element={<Navigate to="/tracetag" replace />} />
    </Routes>
  );
}

export { LegacyTrustTagRedirect };
