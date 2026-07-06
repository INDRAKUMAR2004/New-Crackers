"use client";
// src/Config/firebaseConfig.js

import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

const firebaseConfig = {
  apiKey: 'AIzaSyAN6g5QwCCfHOL7i9IlvOv5YcFhlS4bNJ8',
  authDomain: 'dheeran-crackers.firebaseapp.com',
  projectId: 'dheeran-crackers',
  storageBucket: 'dheeran-crackers.firebasestorage.app',
  messagingSenderId: '1046734008674',
  appId: '1:1046734008674:web:a17acd4429c58ae5753c3b',
  measurementId: 'G-S5DBVDNCF3',
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// export services
export const db = getFirestore(app);
export const storage = getStorage(app);
export const auth = getAuth(app);

export { collection, addDoc, getDocs, ref, uploadBytes, getDownloadURL };
