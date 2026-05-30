import { Routes, Route } from 'react-router-dom';
import Landing from '@/components/trusttag/marketing/Landing';
import VerifyPage from '@/components/trusttag/verify/VerifyPage';
import ScanPage from '@/components/trusttag/verify/ScanPage';
import AuthPage from '@/components/trusttag/auth/AuthPage';
import ResetPage from '@/components/trusttag/auth/ResetPage';
import Dashboard from '@/components/trusttag/user/Dashboard';
import ItemsList from '@/components/trusttag/user/ItemsList';
import ItemForm from '@/components/trusttag/user/ItemForm';
import ItemDetail from '@/components/trusttag/user/ItemDetail';
import LostPage from '@/components/trusttag/user/LostPage';
import TransfersPage from '@/components/trusttag/user/TransfersPage';
import MessagesPage from '@/components/trusttag/user/MessagesPage';
import NotificationsPage from '@/components/trusttag/user/NotificationsPage';
import ProfilePage from '@/components/trusttag/user/ProfilePage';
import BrandDashboard from '@/components/trusttag/brand/BrandDashboard';
import BrandProducts from '@/components/trusttag/brand/BrandProducts';
import BrandQR from '@/components/trusttag/brand/BrandQR';
import BrandAnalytics from '@/components/trusttag/brand/BrandAnalytics';
import AdminDashboard from '@/components/trusttag/admin/AdminDashboard';
import AdminUsers from '@/components/trusttag/admin/AdminUsers';
import AdminManufacturers from '@/components/trusttag/admin/AdminManufacturers';
import AdminFraud from '@/components/trusttag/admin/AdminFraud';
import AdminAudit from '@/components/trusttag/admin/AdminAudit';

export default function TrustTag() {
  return (
    <Routes>
      <Route index element={<Landing />} />
      <Route path="verify/:token" element={<VerifyPage />} />
      <Route path="scan" element={<ScanPage />} />
      <Route path="auth" element={<AuthPage />} />
      <Route path="auth/reset" element={<ResetPage />} />
      <Route path="app" element={<Dashboard />} />
      <Route path="app/items" element={<ItemsList />} />
      <Route path="app/items/new" element={<ItemForm />} />
      <Route path="app/items/:id" element={<ItemDetail />} />
      <Route path="app/lost" element={<LostPage />} />
      <Route path="app/transfers" element={<TransfersPage />} />
      <Route path="app/messages" element={<MessagesPage />} />
      <Route path="app/notifications" element={<NotificationsPage />} />
      <Route path="app/profile" element={<ProfilePage />} />
      <Route path="brand" element={<BrandDashboard />} />
      <Route path="brand/products" element={<BrandProducts />} />
      <Route path="brand/qr" element={<BrandQR />} />
      <Route path="brand/analytics" element={<BrandAnalytics />} />
      <Route path="admin" element={<AdminDashboard />} />
      <Route path="admin/users" element={<AdminUsers />} />
      <Route path="admin/manufacturers" element={<AdminManufacturers />} />
      <Route path="admin/fraud" element={<AdminFraud />} />
      <Route path="admin/audit" element={<AdminAudit />} />
    </Routes>
  );
}
