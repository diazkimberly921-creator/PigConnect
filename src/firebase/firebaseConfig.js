// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC_4WsXJjHh7Q98Vye-EEtDjeSydmR2mqo",
  authDomain: "pigconnect-f578e.firebaseapp.com",
  projectId: "pigconnect-f578e",
  storageBucket: "pigconnect-f578e.appspot.com",
  messagingSenderId: "184003479168",
  appId: "1:184003479168:web:96db90683ec88e1d1a4865",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Fix: use different auth for web vs mobile
let auth;
if (typeof window !== "undefined") {
  // Web
  auth = getAuth(app);
} else {
  // React Native
  auth = initializeAuth(app, {
    persistence: getReactNativePersistence(AsyncStorage),
  });
}

// Firestore and Storage
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage };
