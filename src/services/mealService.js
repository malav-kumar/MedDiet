/**
 * Meal-plan service stub for Phase 1. AI generation is implemented in Phase 2.
 */
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";

const todayKey = () => new Date().toISOString().slice(0, 10);

export const getTodayMealPlan = async (uid) => {
  if (!isFirebaseConfigured || !uid) return null;
  const ref = doc(db, "meal_plans", `${uid}_${todayKey()}`);
  const snap = await getDoc(ref);
  return snap.exists() ? snap.data() : null;
};

export const saveMealPlan = async (uid, plan) => {
  if (!isFirebaseConfigured || !uid) throw new Error("Sign in to save meal plans.");
  const ref = doc(db, "meal_plans", `${uid}_${todayKey()}`);
  await setDoc(ref, { ...plan, generatedAt: serverTimestamp() });
};
