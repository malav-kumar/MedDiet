import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import {
  subscribeActiveMedicines, setActiveMedicine, removeActiveMedicine,
} from "../services/medicineService";
import {
  subscribeActiveConditions, setActiveCondition, removeActiveCondition,
} from "../services/conditionService";

const HealthContext = createContext(null);

/** Aggregates a user's active medicines + conditions and exposes CRUD. */
export const HealthProvider = ({ children }) => {
  const { user } = useAuth();
  const [medicines, setMedicines] = useState([]);
  const [conditions, setConditions] = useState([]);

  useEffect(() => {
    if (!user) {
      setMedicines([]);
      setConditions([]);
      return;
    }
    const u1 = subscribeActiveMedicines(user.uid, setMedicines);
    const u2 = subscribeActiveConditions(user.uid, setConditions);
    return () => { u1 && u1(); u2 && u2(); };
  }, [user]);

  /** Combined food rules across all active items, deduplicated. */
  const combinedRules = useMemo(() => {
    const dedupe = (arr) => Array.from(new Set(arr.filter(Boolean)));
    const safe = dedupe([
      ...medicines.flatMap((m) => m.safe || []),
      ...conditions.flatMap((c) => c.recommended || []),
    ]);
    const avoid = dedupe([
      ...medicines.flatMap((m) => m.avoid || []),
      ...conditions.flatMap((c) => c.avoid || []),
    ]);
    const caution = dedupe(medicines.flatMap((m) => m.caution || []));
    return { safe, avoid, caution };
  }, [medicines, conditions]);

  const value = {
    medicines,
    conditions,
    combinedRules,
    addMedicine: (m) => setActiveMedicine(user?.uid, m),
    removeMedicine: (id) => removeActiveMedicine(user?.uid, id),
    addCondition: (c) => setActiveCondition(user?.uid, c),
    removeCondition: (id) => removeActiveCondition(user?.uid, id),
  };

  return <HealthContext.Provider value={value}>{children}</HealthContext.Provider>;
};

export const useHealth = () => {
  const ctx = useContext(HealthContext);
  if (!ctx) throw new Error("useHealth must be used within HealthProvider");
  return ctx;
};
