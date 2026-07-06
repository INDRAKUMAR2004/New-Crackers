"use client";
// src/admin/ProductContext.jsx

import React, { createContext, useContext, useState, useEffect } from 'react';
import { db, collection, addDoc, getDocs } from '../firebaseConfig';
import {
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
  onSnapshot,
} from 'firebase/firestore';

const ProductContext = createContext<any>(null);

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const productsCollectionRef = collection(db, 'products');

  // 1. Real-time listener for products - ensures instant updates across entire app
  useEffect(() => {
    setLoading(true);
    const unsubscribe = onSnapshot(
      productsCollectionRef,
      (snapshot) => {
        const productList = snapshot.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setProducts(productList);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching products:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  // 2. Add Product (Create operation - AddProduct-லிருந்து அழைக்கப்படுகிறது)
  const addProduct = async (productData) => {
    try {
      // Price மற்றும் MRP-ஐ Number-ஆக மாற்றுதல் (optional but recommended)
      const dataToSave = {
        ...productData,
        price: Number(productData.price),
        mrp: Number(productData.mrp),
        sortOrder: Number(productData.sortOrder),
        createdAt: new Date(), // Timestamp
      };

      // 🚀 Add data to Firestore collection "products"
      await addDoc(productsCollectionRef, dataToSave);

      return {
        success: true,
        message: 'Product successfully saved to Firebase!',
      };
    } catch (error) {
      console.error('Error adding product to Firestore:', error);
      return {
        success: false,
        message: `Error adding product: ${error.message}`,
      };
    }
  };

  // 3. Update Product (used by AddProduct edit flow)
  const updateProduct = async (productId, productData) => {
    try {
      const dataToSave = {
        ...productData,
        price: Number(productData.price),
        mrp: Number(productData.mrp),
        sortOrder: Number(productData.sortOrder),
        updatedAt: new Date(),
      };

      await updateDoc(doc(db, 'products', productId), dataToSave);

      return {
        success: true,
        message: 'Product updated successfully!',
      };
    } catch (error) {
      console.error('Error updating product in Firestore:', error);
      return {
        success: false,
        message: `Error updating product: ${error.message}`,
      };
    }
  };

  // Real-time listener handles automatic updates, so fetchProducts is optional
  const fetchProducts = async () => {
    console.log('Using real-time updates via onSnapshot');
  };
  const updateStock = async (productId, stockToAdd) => {
    try {
      // Validate stock increment
      if (!Number.isInteger(stockToAdd) || stockToAdd < 0) {
        throw new Error('Stock must be a non-negative whole number');
      }

      const productRef = doc(db, 'products', productId);
      const productSnap = await getDoc(productRef);

      if (!productSnap.exists()) {
        throw new Error('Product not found');
      }

      const currentStock = Number(productSnap.data()?.stock) || 0;
      const nextStock = currentStock + stockToAdd;

      await updateDoc(productRef, {
        stock: nextStock,
        outOfStock: nextStock <= 0,
        updatedAt: new Date(),
      });

      return { success: true, stock: nextStock };
    } catch (error) {
      console.error('Error updating stock:', error);
      return {
        success: false,
        message: error.message || 'Failed to update stock',
      };
    }
  };

  // 5. Delete Product
  const deleteProduct = async (productId) => {
    try {
      await deleteDoc(doc(db, 'products', productId));

      return { success: true };
    } catch (error) {
      console.error('Error deleting product from Firestore:', error);
      return { success: false, message: error.message };
    }
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        updateStock,
        deleteProduct,
        loading,
        fetchProducts,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
