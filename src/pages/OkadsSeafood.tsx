import { Routes, Route } from 'react-router-dom';
import OkadsHeader from '@/components/okads/OkadsHeader';
import OkadsHero from '@/components/okads/OkadsHero';
import OkadsCategories from '@/components/okads/OkadsCategories';
import OkadsFeaturedProducts from '@/components/okads/OkadsFeaturedProducts';
import OkadsHowItWorks from '@/components/okads/OkadsHowItWorks';
import OkadsFooter from '@/components/okads/OkadsFooter';
import OkadsShop from '@/components/okads/OkadsShop';
import OkadsProductDetail from '@/components/okads/OkadsProductDetail';
import OkadsCart from '@/components/okads/OkadsCart';
import OkadsCheckout from '@/components/okads/OkadsCheckout';
import OkadsAuth from '@/components/okads/OkadsAuth';
import OkadsOrderHistory from '@/components/okads/OkadsOrderHistory';
import OkadsAdmin from '@/components/okads/OkadsAdmin';

function OkadsLanding() {
  return (
    <>
      <OkadsHero />
      <OkadsCategories />
      <OkadsFeaturedProducts />
      <OkadsHowItWorks />
    </>
  );
}

export default function OkadsSeafood() {
  return (
    <div className="min-h-screen bg-[#F0FDFA] flex flex-col">
      <OkadsHeader />
      <main className="flex-1">
        <Routes>
          <Route index element={<OkadsLanding />} />
          <Route path="shop" element={<OkadsShop />} />
          <Route path="shop/:category" element={<OkadsShop />} />
          <Route path="product/:slug" element={<OkadsProductDetail />} />
          <Route path="cart" element={<OkadsCart />} />
          <Route path="checkout" element={<OkadsCheckout />} />
          <Route path="auth" element={<OkadsAuth />} />
          <Route path="orders" element={<OkadsOrderHistory />} />
          <Route path="admin" element={<OkadsAdmin />} />
        </Routes>
      </main>
      <OkadsFooter />
    </div>
  );
}
