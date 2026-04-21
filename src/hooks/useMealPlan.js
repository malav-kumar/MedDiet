import { useCallback, useEffect, useState } from "react";
import { getTodayMealPlan, saveMealPlan } from "../services/mealService";
import { generateMealPlan } from "../services/geminiService";
import { useAuth } from "../context/AuthContext";
import { useHealth } from "../context/HealthContext";

/**
 * Loads today's meal plan and exposes a `generate()` action that calls Gemini
 * and persists the result to Firestore.
 */
export const useMealPlan = (allergies = []) => {
  const { user } = useAuth();
  const { medicines, conditions } = useHealth();
  const [plan, setPlan] = useState(null);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState(null);

  const refresh = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    try {
      const existing = await getTodayMealPlan(user.uid);
      setPlan(existing);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const generate = useCallback(async () => {
    if (!user) return;
    setGenerating(true);
    setError(null);
    try {
      const fresh = await generateMealPlan({ medicines, conditions, allergies });
      await saveMealPlan(user.uid, fresh);
      setPlan({ ...fresh, generatedAt: new Date() });
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setGenerating(false);
    }
  }, [user, medicines, conditions, allergies]);

  return { plan, loading, generating, error, generate, refresh };
};
