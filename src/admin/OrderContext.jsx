import { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { db } from '../firebaseConfig';
import {
  collection,
  addDoc,
  Timestamp,
  query,
  orderBy,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';

const OrderContext = createContext();

const normalizePaymentStatus = (status) => {
  const value = String(status || '')
    .trim()
    .toLowerCase();

  if (!value || value === 'pending' || value === 'p') return 'Pending';
  if (value === 'paid') return 'Paid';
  if (value === 'online payment' || value === 'online') return 'Online Payment';
  if (value === 'cash payment' || value === 'cash') return 'Cash Payment';

  return status || 'Pending';
};

const normalizeOrder = (snapshotDoc) => {
  const data = snapshotDoc.data();

  return {
    id: snapshotDoc.id,
    ...data,
    paymentStatus: normalizePaymentStatus(data.paymentStatus),
  };
};

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    setLoading(true);

    const q = query(collection(db, 'orders'), orderBy('orderDate', 'desc'));
    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const ordersData = snapshot.docs.map(normalizeOrder);
        setOrders(ordersData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching orders:', error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, [refreshKey]);

  const fetchOrders = () => {
    setRefreshKey((value) => value + 1);
  };

  const addOrder = async (orderData) => {
    try {
      const docRef = await addDoc(collection(db, 'orders'), {
        ...orderData,
        orderDate: Timestamp.now(),
        paymentStatus: 'Pending',
        orderStatus: 'New WhatsApp',
        deliveryDate: null,
      });
      console.log('Order saved to Firestore with ID: ', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error saving order to Firestore:', error);
      return { success: false, error: error.message };
    }
  };

  const updateOrderStatus = async (orderId, paymentStatus) => {
    try {
      await updateDoc(doc(db, 'orders', orderId), {
        paymentStatus: normalizePaymentStatus(paymentStatus),
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating order status:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteOrder = async (orderId) => {
    try {
      await deleteDoc(doc(db, 'orders', orderId));
      return { success: true };
    } catch (error) {
      console.error('Error deleting order:', error);
      return { success: false, error: error.message };
    }
  };

  const value = useMemo(
    () => ({
      orders,
      loading,
      fetchOrders,
      addOrder,
      updateOrderStatus,
      deleteOrder,
    }),
    [orders, loading]
  );

  return (
    <OrderContext.Provider value={value}>{children}</OrderContext.Provider>
  );
};

export const useOrders = () => {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrders must be used within an OrderProvider');
  }
  return context;
};
