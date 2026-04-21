import { useState, useEffect } from "react";
import { Sparkles, Loader2, Droplets, RefreshCw, BookmarkCheck } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useHealth } from "../context/HealthContext";
import { useMealPlan } from "../hooks/useMealPlan";
import MealPlanCard from "../components/MealPlanCard";
import AlertBanner from "../components/AlertBanner";
import { toast } from "@/hooks/use-toast";

const SLOTS = ["breakfast", "lunch", "dinner", "snacks"];

const AIMealPlanner = () => {
  const { user } = useAuth();
  const { medicines, conditions, saveMealToDashboard, savedMeal } = useHealth();
  const [allergies, setAllergies] = useState([]);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured || !user) return;
    (async () => {
      try {
        const snap = await getDoc(doc(db, "users", user.uid));
        if (snap.exists()) setAllergies(snap.data().allergies || []);
      } catch { /* non-fatal */ }
    })();
  }, [user]);

  const { plan, loading, generating, error, generate } = useMealPlan(allergies);

  const handleGenerate = async () => {
    try {
      await generate();
      toast({ title: "Meal plan ready", description: "Saved to today's plan." });
    } catch (e) {
      toast({ title: "Generation failed", description: e.message, variant: "destructive" });
    }
  };

  const handleSaveToDashboard = async () => {
    if (!plan) return;
    setSaving(true);
    try {
      await saveMealToDashboard(plan);
      toast({ title: "Saved to Dashboard", description: "Your meal plan is now visible on the Dashboard." });
    } catch (e) {
      toast({ title: "Save failed", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const isSaved = savedMeal && plan &&
    JSON.stringify(savedMeal.breakfast) === JSON.stringify(plan.breakfast);

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">AI Meal Planner</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Personalised, condition-aware full-day meal plans.
          </p>
        </div>
        <button onClick={handleGenerate} disabled={generating || loading}
          className="btn-primary inline-flex items-center gap-2">
          {generating ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
          ) : plan ? (
            <><RefreshCw className="h-4 w-4" /> Regenerate</>
          ) : (
            <><Sparkles className="h-4 w-4" /> Generate plan</>
          )}
        </button>
      </header>

      {/* Context banner */}
      <section className="bg-primary-soft border border-primary/20 rounded-xl px-4 py-3 text-sm text-primary-text">
        Using <span className="font-semibold">{medicines.length}</span> medicine{medicines.length === 1 ? "" : "s"},{" "}
        <span className="font-semibold">{conditions.length}</span> condition{conditions.length === 1 ? "" : "s"}, and{" "}
        <span className="font-semibold">{allergies.length}</span> allergy entr{allergies.length === 1 ? "y" : "ies"}.
      </section>

      {medicines.length === 0 && conditions.length === 0 && (
        <AlertBanner variant="info" title="Personalise your plan">
          Add at least one medicine or condition for safer, tailored meal suggestions.
        </AlertBanner>
      )}

      {error && (
        <AlertBanner variant="error" title="Couldn't generate plan">{error}</AlertBanner>
      )}

      {loading && !plan && <SkeletonGrid />}

      {!loading && !plan && !generating && (
        <div className="bg-card rounded-xl border border-dashed border-input p-8 text-center">
          <div className="text-4xl mb-2" aria-hidden>🍽️</div>
          <h2 className="font-display font-bold text-foreground">No meal plan for today</h2>
          <p className="text-sm text-muted-foreground mt-1 mb-4 max-w-md mx-auto">
            Tap <span className="font-semibold">Generate plan</span> to get a full day of safe meals
            tailored to your active items.
          </p>
        </div>
      )}

      {plan && (
        <>
          {plan.warnings?.length > 0 && (
            <AlertBanner variant="warning" title="Warnings">
              {plan.warnings.join(" · ")}
            </AlertBanner>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            {SLOTS.map((slot) => (
              <MealPlanCard key={slot} slot={slot} data={plan[slot]} />
            ))}
          </div>

          {plan.hydration && (
            <div className="bg-info-soft border border-info/40 rounded-xl p-4 flex items-start gap-3">
              <Droplets className="h-5 w-5 text-info-text mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wide text-info-text font-semibold mb-1">
                  Hydration
                </p>
                <p className="text-sm text-info-text">{plan.hydration}</p>
              </div>
            </div>
          )}

          <div className="flex justify-end">
            <button
              onClick={handleSaveToDashboard}
              disabled={saving || isSaved}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition
                ${isSaved
                  ? "bg-safe-soft text-safe-text border border-safe/30 cursor-default"
                  : "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                }`}
            >
              {saving ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Saving…</>
              ) : isSaved ? (
                <><BookmarkCheck className="h-4 w-4" /> Saved to Dashboard</>
              ) : (
                <><BookmarkCheck className="h-4 w-4" /> Save to Dashboard</>
              )}
            </button>
          </div>
        </>
      )}
    </div>
  );
};

const SkeletonGrid = () => (
  <div className="grid gap-4 sm:grid-cols-2">
    {SLOTS.map((s) => (
      <div key={s} className="bg-card rounded-xl border border-border p-5 animate-pulse">
        <div className="h-10 w-10 rounded-lg bg-secondary mb-3" />
        <div className="h-4 w-32 bg-secondary rounded mb-2" />
        <div className="h-3 w-full bg-secondary rounded mb-1" />
        <div className="h-3 w-2/3 bg-secondary rounded" />
      </div>
    ))}
  </div>
);

export default AIMealPlanner;
