/**
 * Meal-plan persistence in Firestore. One document per user per day.
 */
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

const todayKey = () => new Date().toISOString().slice(0, 10);
const planRef = (uid) => doc(db, "meal_plans", `${uid}_${todayKey()}`);

export const getTodayMealPlan = async (uid) => {
  if (!isFirebaseConfigured || !uid) return null;
  const snap = await getDoc(planRef(uid));
  return snap.exists() ? snap.data() : null;
};

export const saveMealPlan = async (uid, plan) => {
  if (!isFirebaseConfigured || !uid) throw new Error("Sign in to save meal plans.");
  await setDoc(planRef(uid), { ...plan, generatedAt: serverTimestamp() });
};
