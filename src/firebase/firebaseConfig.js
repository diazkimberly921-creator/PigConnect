// src/firebase/firebaseConfig.js

import { initializeApp } from "firebase/app";
import {
  initializeAuth,
  getReactNativePersistence,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore } from "firebase/firestore";

// Your Firebase configuration
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

// ✅ Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

// Firestore
const db = getFirestore(app);

export { auth, db };
