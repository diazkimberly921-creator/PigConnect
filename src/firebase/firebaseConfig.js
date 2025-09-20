// src/firebase/firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// ✅ your Firebase config (replace with yours from Firebase Console)
const firebaseConfig = {
  apiKey: "AIzaSyC_4WsXJjHh7Q98Vye-EEtDjeSydmR2mqo",
  authDomain: "pigconnect-f578e.firebaseapp.com",
  projectId: "pigconnect-f578e",
  storageBucket: "pigconnect-f578e.appspot.com",
  messagingSenderId: "184003479168",
  appId: "1:184003479168:web:96db90683ec88e1d1a4865",
};

// ✅ Initialize Firebase
const app = initializeApp(firebaseConfig);

// ✅ Export Auth & Firestore so you can use them anywhere
export const auth = getAuth(app);
export const db = getFirestore(app);