import { useCallback, useEffect, useState } from "react";
import { getTodayMealPlan } from "../services/mealService";
import { useAuth } from "../context/AuthContext";

/** Phase 1: read-only access to today's meal plan if one exists. */
export const useMealPlan = () => {
  const { user } = useAuth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      setPlan(await getTodayMealPlan(user.uid));
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  return { plan, loading, refresh };
};
