"use client";
import { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { db } from '../firebaseConfig';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

const CartContext = createContext();

// 🔥 Generate or retrieve a unique cart ID for the user
const getCartId = () => {
  let id = (typeof window !== 'undefined' ? localStorage.getItem.bind(localStorage) : () => null)('cartId');
  if (!id) {
    id = 'cart-' + Math.random().toString(36).substring(2, 15);
    (typeof window !== 'undefined' ? localStorage.setItem.bind(localStorage) : () => null)('cartId', id);
  }
  return id;
};

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Stage 1: Load from localStorage for immediate UI
    try {
      const saved = (typeof window !== 'undefined' ? localStorage.getItem.bind(localStorage) : () => null)('localCart');
      return saved ? JSON.parse(saved) : [];
    } catch (e) {
      return [];
    }
  });
  
  const [openCart, setOpenCart] = useState(false);
  const cartId = useMemo(() => getCartId(), []);

  // Sync state to localStorage whenever it changes
  useEffect(() => {
    (typeof window !== 'undefined' ? localStorage.setItem.bind(localStorage) : () => null)('localCart', JSON.stringify(cart));
  }, [cart]);

  // 🔥 REALTIME CART LISTENER (From Firebase)
  useEffect(() => {
    const cartRef = doc(db, 'carts', cartId);

    const unsub = onSnapshot(cartRef, (snap) => {
      if (snap.exists()) {
        const remoteItems = snap.data().items || [];
        // Only update if remote is different to avoid unnecessary re-renders
        // or overwriting fresh local updates (though Firebase is source of truth)
        setCart(remoteItems);
      }
    });

    return () => unsub();
  }, [cartId]);

  // 🔥 SYNC TO FIREBASE ONLY
  const syncToFirebase = async (items) => {
    try {
      const cartRef = doc(db, 'carts', cartId);
      await setDoc(
        cartRef,
        {
          items,
          updatedAt: new Date(),
        },
        { merge: true }
      );
    } catch (error) {
      console.error("Error syncing cart to Firebase:", error);
    }
  };

  // ✅ ADD TO CART
  const addToCart = async (product) => {
    const stock = Number(product?.stock) || 0;
    const isOutOfStock = Boolean(product?.outOfStock) || stock <= 0;

    if (isOutOfStock) {
      return { success: false, message: 'Product is out of stock' };
    }

    setCart(prevCart => {
      const exists = prevCart.find((p) => p.id === product.id);
      let updatedCart;
      
      if (exists) {
        updatedCart = prevCart.map((p) =>
          p.id === product.id ? { ...p, qty: p.qty + (product.qty || 1) } : p
        );
      } else {
        updatedCart = [...prevCart, { ...product, qty: product.qty || 1 }];
      }
      
      syncToFirebase(updatedCart);
      return updatedCart;
    });
  };

  // ✅ UPDATE QTY
  const updateItemQty = async (id, qty) => {
    setCart(prevCart => {
      const updatedCart = prevCart.map((item) =>
        item.id === id ? { ...item, qty: Math.max(1, qty) } : item
      );
      syncToFirebase(updatedCart);
      return updatedCart;
    });
  };

  // ✅ REMOVE ITEM
  const removeItem = async (id) => {
    setCart(prevCart => {
      const updatedCart = prevCart.filter((item) => item.id !== id);
      syncToFirebase(updatedCart);
      return updatedCart;
    });
  };

  // ✅ CLEAR CART
  const clearCart = async () => {
    setCart([]);
    syncToFirebase([]);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        updateItemQty,
        removeItem,
        clearCart,
        openCart,
        setOpenCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
