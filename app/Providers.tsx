'use client';
import { AuthProvider } from '@/src/admin/AuthContext';
import { CartProvider } from '@/src/context/CartContext';
import { ProductProvider } from '@/src/admin/ProductContext';
import { OrderProvider } from '@/src/admin/OrderContext';
import { WishlistProvider } from '@/src/context/WishlistContext';
import { useEffect } from 'react';
import AOS from 'aos';
import 'aos/dist/aos.css';

export default function Providers({ children }) {
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
      <OrderProvider>
        <CartProvider>
          <WishlistProvider>
            <ProductProvider>
              {children}
            </ProductProvider>
          </WishlistProvider>
        </CartProvider>
      </OrderProvider>
    </AuthProvider>
  );
}
