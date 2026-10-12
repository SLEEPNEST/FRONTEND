// SleepNest - Main App with React Router
import { BrowserRouter, Routes, Route, ScrollRestoration, useLocation } from 'react-router-dom';
import { useEffect } from 'react';
import { AppProvider } from './context/AppContext';
import Header from './components/Header';
import Footer from './components/Footer';
import ToastContainer from './components/ToastContainer';
import HomePage from './pages/HomePage';
import ProductListingPage from './pages/ProductListingPage';
import ProductDetailPage from './pages/ProductDetailPage';
import CartPage from './pages/CartPage';
import CheckoutPage from './pages/CheckoutPage';
import WishlistPage from './pages/WishlistPage';
import AccountPage from './pages/AccountPage';
import MyOrdersPage from './pages/MyOrdersPage';
import OrderDetailPage from './pages/OrderDetailPage';
import ProfilePage from './pages/ProfilePage';
import AdminPage from './pages/admin/AdminPage';


import MattressPage from './pages/MattressPage';
import BedsheetPage from "./pages/BedsheetPage";
import ProtectorPage from "./pages/ProtectorPage";
import ComforterPage from "./pages/ComforterPage";
import PillowPage from "./pages/PillowPage";
import StoresPage from "./pages/StoresPage";
import './index.css';

// Scroll to top on route change
function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [pathname]);
  return null;
}

// Placeholder for pages that just need a layout
function SimpleListingPage({ title }) {
  return (
    <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16 }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: 36, color: 'var(--primary)' }}>{title}</h1>
      <p style={{ color: 'var(--gray-500)' }}>Coming soon with amazing products!</p>
    </div>
  );
}

function AppInner() {
  return (
    <>
      <ScrollToTop />
      <Header />
      <main style={{ minHeight: '70vh' }}>
        <Routes>
          {/* Home */}
          <Route path="/" element={<HomePage />} />

          {/* 5 Clean Categories */}
          <Route path="/mattress" element={<MattressPage />} />
          <Route path="/bedsheet" element={<BedsheetPage />} />
          <Route path="/bedsheets" element={<BedsheetPage />} />
          <Route path="/protector" element={<ProtectorPage />} />
          <Route path="/protectors" element={<ProtectorPage />} />
          <Route path="/mattress-protector" element={<ProtectorPage />} />
          <Route path="/comforter" element={<ComforterPage />} />
          <Route path="/comforters" element={<ComforterPage />} />
          <Route path="/pillow" element={<PillowPage />} />
          <Route path="/pillows" element={<PillowPage />} />
          <Route path="/furnishing" element={<ProductListingPage />} />
          <Route path="/kitchen" element={<ProductListingPage />} />
          <Route path="/search" element={<ProductListingPage />} />

          {/* Specific product categories */}
          <Route path="/blankets" element={<ProductListingPage />} />
          <Route path="/wardrobes" element={<ProductListingPage />} />
          <Route path="/wardrobes/:sub" element={<ProductListingPage />} />
          <Route path="/cushions" element={<ProductListingPage />} />
          <Route path="/rugs" element={<ProductListingPage />} />
          <Route path="/curtains" element={<ProductListingPage />} />
          <Route path="/curtains/:sub" element={<ProductListingPage />} />
          <Route path="/tv-units" element={<ProductListingPage />} />
          <Route path="/bookshelves" element={<ProductListingPage />} />
          <Route path="/chairs" element={<ProductListingPage />} />
          <Route path="/chairs/:sub" element={<ProductListingPage />} />
          <Route path="/coffee-tables" element={<ProductListingPage />} />
          <Route path="/lamps" element={<ProductListingPage />} />
          <Route path="/lamps/:sub" element={<ProductListingPage />} />
          <Route path="/cookware" element={<ProductListingPage />} />
          <Route path="/cookware/:sub" element={<ProductListingPage />} />
          <Route path="/bean-bags" element={<ProductListingPage />} />
          <Route path="/yoga-mats" element={<ProductListingPage />} />
          <Route path="/wall-art" element={<ProductListingPage />} />
          <Route path="/wall-mirrors" element={<ProductListingPage />} />
          <Route path="/kids-mattress" element={<ProductListingPage />} />
          <Route path="/kids/:sub" element={<ProductListingPage />} />
          <Route path="/study-tables" element={<ProductListingPage />} />
          <Route path="/study-tables/:sub" element={<ProductListingPage />} />
          <Route path="/dining/:sub" element={<ProductListingPage />} />
          <Route path="/deals" element={<ProductListingPage />} />

          {/* Product Detail */}
          <Route path="/product/:id" element={<ProductDetailPage />} />

          {/* Cart & Checkout */}
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />

          {/* User Account */}
          <Route path="/account" element={<AccountPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/admin" element={<AdminPage />} />
          <Route path="/my-orders" element={<MyOrdersPage />} />
          <Route path="/my-orders/:orderId" element={<OrderDetailPage />} />


          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Static Pages */}
          <Route path="/about" element={<SimpleListingPage title="About SleepNest" />} />
          <Route path="/blog" element={<SimpleListingPage title="Sleep Blog" />} />
          <Route path="/help" element={<SimpleListingPage title="Help Center" />} />
          <Route path="/track-order" element={<SimpleListingPage title="Track Your Order" />} />
          <Route path="/returns" element={<SimpleListingPage title="Returns & Refunds" />} />
          <Route path="/interiors" element={<SimpleListingPage title="SleepNest Interiors" />} />
          <Route path="/sleep-quiz" element={<SimpleListingPage title="Sleep Quiz" />} />
          <Route path="/stores" element={<StoresPage />} />
          <Route path="/careers" element={<SimpleListingPage title="Careers at SleepNest" />} />
          <Route path="/privacy" element={<SimpleListingPage title="Privacy Policy" />} />
          <Route path="/terms" element={<SimpleListingPage title="Terms of Service" />} />
          <Route path="/pillow-covers" element={<ProductListingPage />} />
          <Route path="/center-tables" element={<ProductListingPage />} />
          <Route path="/side-tables" element={<ProductListingPage />} />
          <Route path="/paintings" element={<ProductListingPage />} />
          <Route path="/wall-clocks" element={<ProductListingPage />} />
          <Route path="/emi" element={<SimpleListingPage title="EMI Options" />} />
          <Route path="/sleep-trial" element={<SimpleListingPage title="100-Night Sleep Trial" />} />
          <Route path="/warranty" element={<SimpleListingPage title="Warranty Claims" />} />
          <Route path="/inspiration" element={<SimpleListingPage title="Design Inspiration" />} />
          <Route path="/collections" element={<ProductListingPage />} />
          <Route path="/materials" element={<SimpleListingPage title="Our Materials" />} />
          <Route path="/dinnerware" element={<ProductListingPage />} />
          <Route path="/dinnerware/:sub" element={<ProductListingPage />} />
          <Route path="/cups-mugs" element={<ProductListingPage />} />
          <Route path="/kitchen-storage" element={<ProductListingPage />} />
          <Route path="/kitchen-storage/:sub" element={<ProductListingPage />} />
          <Route path="/runners" element={<ProductListingPage />} />
          <Route path="/wall-shelves" element={<ProductListingPage />} />
          <Route path="/press" element={<SimpleListingPage title="Press & Media" />} />
          <Route path="/accessibility" element={<SimpleListingPage title="Accessibility" />} />
          <Route path="/cookies" element={<SimpleListingPage title="Cookie Policy" />} />
          <Route path="/sitemap" element={<SimpleListingPage title="Sitemap" />} />

          {/* 404 */}
          <Route path="*" element={<SimpleListingPage title="Page Not Found" />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer />
    </>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppProvider>
        <AppInner />
      </AppProvider>
    </BrowserRouter>
  );
}
