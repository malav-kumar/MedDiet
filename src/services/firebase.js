/**
 * Firebase initialization.
 *
 * IMPORTANT: Replace the placeholder values below with your own Firebase
 * web-app config from Firebase Console → Project settings → Your apps.
 *
 * The app will run without these (Auth pages will show a friendly error)
 * so you can preview the UI immediately.
 */
import { initializeApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  authDomain: "REPLACE_WITH_YOUR_AUTH_DOMAIN",
  projectId: "REPLACE_WITH_YOUR_PROJECT_ID",
  storageBucket: "REPLACE_WITH_YOUR_BUCKET",
  messagingSenderId: "REPLACE_WITH_YOUR_SENDER_ID",
  appId: "REPLACE_WITH_YOUR_APP_ID",
};

export const isFirebaseConfigured =
  !firebaseConfig.apiKey.startsWith("REPLACE_");

const app = getApps().length ? getApps()[0] : initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;
