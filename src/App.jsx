import { useState, useEffect } from 'react';
import './App.css';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import AOS from 'aos';
import 'aos/dist/aos.css';
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';

import Home from './pages/Home/Home';
import Aboutpage from './pages/About/Aboutpage';
import ContactPage from './pages/Contact/ContactPage';
import ProductPage from './pages/Product/ProductPage';

import Layout from './admin/Layout';
import Login from './admin/Login';
import ProtectedRoute from './admin/ProtectedRoute';
import SliderManagement from './admin/SliderManagement';
import AddProduct from './admin/AddProduct';
import ProductsList from './admin/ProductsList';
import Dashboard from './admin/Dashboard';
import { AuthProvider } from './admin/AuthContext';

import { CartProvider } from './context/CartContext';
import { ProductProvider } from './admin/ProductContext';
import { OrderProvider } from './admin/OrderContext';
import { WishlistProvider } from './context/WishlistContext';
import OrderManagement from './admin/OrderManagement';
import ProductDetails from './pages/Product/ProductDetails';
import CategoryManagement from './admin/CategoryManagement';
import InventoryManagement from './admin/InventoryManagement';

// Scroll To Top on Route Change
const ScrollToTopOnNavigate = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col min-h-screen">
      {!isAdminRoute && (
        <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      )}
      {!isAdminRoute && <Navbar />}

      <main className="grow">
        <Routes>
          {/* PUBLIC */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<Aboutpage />} />
          <Route path="/products" element={<ProductPage />} />
          <Route path="/products/:id" element={<ProductDetails />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/admin-login" element={<Login />} />

          {/* ADMIN */}
          <Route
            path="/admin-dashboard"
            element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/add-product"
            element={
              <ProtectedRoute>
                <Layout>
                  <AddProduct />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/slider-management"
            element={
              <ProtectedRoute>
                <Layout>
                  <SliderManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/products"
            element={
              <ProtectedRoute>
                <Layout>
                  <ProductsList />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/inventory"
            element={
              <ProtectedRoute>
                <Layout>
                  <InventoryManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute>
                <Layout>
                  <OrderManagement />
                </Layout>
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/category-management"
            element={
              <ProtectedRoute>
                <Layout>
                  <CategoryManagement />
                </Layout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isAdminRoute && <Footer />}
      <ScrollToTop />
    </div>
  );
};

function App() {
  // Init AOS
  useEffect(() => {
    AOS.init({
      offset: 100,
      duration: 800,
      easing: 'ease-out-cubic',
      once: true,
    });
  }, []);

  return (
    <AuthProvider>
      <BrowserRouter>
        <ScrollToTopOnNavigate />
        <OrderProvider>
          <CartProvider>
            <WishlistProvider>
              <ProductProvider>
                <AppContent />
              </ProductProvider>
            </WishlistProvider>
          </CartProvider>
        </OrderProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
