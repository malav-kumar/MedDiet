import { useEffect, useMemo, useState } from "react";
import { searchConditions } from "../services/conditionService";

/** Debounced condition search hook. */
export const useCondition = (query, delay = 200) => {
  const [debounced, setDebounced] = useState(query);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(query), delay);
    return () => clearTimeout(id);
  }, [query, delay]);
  return useMemo(() => searchConditions(debounced), [debounced]);
};
