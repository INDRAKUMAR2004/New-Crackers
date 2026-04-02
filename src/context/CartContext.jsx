import { createContext, useContext, useEffect, useState } from 'react';
import { db } from '../firebaseConfig';
import { doc, setDoc, onSnapshot, updateDoc } from 'firebase/firestore';

const CartContext = createContext();

const CART_ID = 'guest-cart'; // later → userId

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const [openCart, setOpenCart] = useState(false);

  // 🔥 REALTIME CART LISTENER
  useEffect(() => {
    const cartRef = doc(db, 'carts', CART_ID);

    const unsub = onSnapshot(cartRef, (snap) => {
      if (snap.exists()) {
        setCart(snap.data().items || []);
      }
    });

    return () => unsub();
  }, []);

  // 🔥 SAVE CART TO FIREBASE
  const saveCart = async (items) => {
    const cartRef = doc(db, 'carts', CART_ID);
    await setDoc(
      cartRef,
      {
        items,
        updatedAt: new Date(),
      },
      { merge: true }
    );
  };

  // ✅ ADD TO CART
  const addToCart = async (product) => {
    const stock = Number(product?.stock) || 0;
    const isOutOfStock = Boolean(product?.outOfStock) || stock <= 0;

    if (isOutOfStock) {
      return { success: false, message: 'Product is out of stock' };
    }

    let updatedCart;

    const exists = cart.find((p) => p.id === product.id);

    if (exists) {
      updatedCart = cart.map((p) =>
        p.id === product.id ? { ...p, qty: p.qty + product.qty } : p
      );
    } else {
      updatedCart = [...cart, product];
    }

    await saveCart(updatedCart);
  };

  // ✅ UPDATE QTY
  const updateItemQty = async (id, qty) => {
    const updatedCart = cart.map((item) =>
      item.id === id ? { ...item, qty } : item
    );
    await saveCart(updatedCart);
  };

  // ✅ REMOVE ITEM
  const removeItem = async (id) => {
    const updatedCart = cart.filter((item) => item.id !== id);
    await saveCart(updatedCart);
  };

  // ✅ CLEAR CART
  const clearCart = async () => {
    await saveCart([]);
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
