import { useEffect, useMemo, useState } from "react";
import { searchMedicines } from "../services/medicineService";

/** Debounced medicine search hook. */
export const useMedicine = (query, delay = 200) => {
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), delay);
    return () => clearTimeout(id);
  }, [query, delay]);
  return useMemo(() => searchMedicines(debounced), [debounced]);
};
