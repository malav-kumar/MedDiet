/**
 * Condition service mirrors medicineService.
 */
import {
  collection, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { CONDITIONS } from "../data/conditions";

export const searchConditions = (query) => {
  const q = (query || "").trim().toLowerCase();
  if (!q) return CONDITIONS;
  return CONDITIONS.filter((c) => c.condition.toLowerCase().includes(q));
};

export const getConditionById = (id) => CONDITIONS.find((c) => c.id === id);

export const subscribeActiveConditions = (uid, cb) => {
  if (!isFirebaseConfigured || !uid) {
    cb([]);
    return () => {};
  }
  const ref = collection(db, "users", uid, "activeConditions");
  return onSnapshot(ref, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

export const setActiveCondition = async (uid, condition) => {
  if (!isFirebaseConfigured || !uid) throw new Error("Sign in to save conditions.");
  const ref = doc(db, "users", uid, "activeConditions", condition.id);
  await setDoc(ref, { ...condition, addedAt: serverTimestamp() });
};

export const removeActiveCondition = async (uid, id) => {
  if (!isFirebaseConfigured || !uid) throw new Error("Sign in to manage conditions.");
  await deleteDoc(doc(db, "users", uid, "activeConditions", id));
};
