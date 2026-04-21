/**
 * Medicine service: search the seed dataset and manage active medicines in Firestore.
 * Falls back gracefully if Firebase isn't configured (returns local-only behaviour).
 */
import {
  collection, doc, setDoc, deleteDoc, onSnapshot, serverTimestamp,
} from "firebase/firestore";
import { db, isFirebaseConfigured } from "./firebase";
import { MEDICINES } from "../data/medicines";

/** Case-insensitive search across name + category. */
export const searchMedicines = (query) => {
  const q = (query || "").trim().toLowerCase();
  if (!q) return MEDICINES;
  return MEDICINES.filter(
    (m) =>
      m.medicine.toLowerCase().includes(q) ||
      m.category.toLowerCase().includes(q)
  );
};

export const getMedicineById = (id) => MEDICINES.find((m) => m.id === id);

/** Subscribe to a user's active medicines. Returns an unsubscribe fn. */
export const subscribeActiveMedicines = (uid, cb) => {
  if (!isFirebaseConfigured || !uid) {
    cb([]);
    return () => {};
  }
  const ref = collection(db, "users", uid, "activeMedicines");
  return onSnapshot(ref, (snap) => {
    cb(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  });
};

export const setActiveMedicine = async (uid, medicine) => {
  if (!isFirebaseConfigured || !uid) throw new Error("Sign in to save medicines.");
  const ref = doc(db, "users", uid, "activeMedicines", medicine.id);
  await setDoc(ref, { ...medicine, addedAt: serverTimestamp() });
};

export const removeActiveMedicine = async (uid, id) => {
  if (!isFirebaseConfigured || !uid) throw new Error("Sign in to manage medicines.");
  await deleteDoc(doc(db, "users", uid, "activeMedicines", id));
};
