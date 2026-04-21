/**
 * Firebase initialization for MedDiet Advisor.
 */
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAknuLE0gFdEGLJ1ISbY5AuOPJsakLbFmI",
  authDomain: "meddiet-e3d55.firebaseapp.com",
  projectId: "meddiet-e3d55",
  storageBucket: "meddiet-e3d55.firebasestorage.app",
  messagingSenderId: "439186844255",
  appId: "1:439186844255:web:2db65ab0d97ba03a3789ea",
  measurementId: "G-TWY2HRCDFR",
};

export const isFirebaseConfigured = !firebaseConfig.apiKey.startsWith("REPLACE_");

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
