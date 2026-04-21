import { useState, useEffect } from "react";
import { Salad, Sparkles, Loader2, Droplets, AlertTriangle, RefreshCw } from "lucide-react";
import { doc, getDoc } from "firebase/firestore";
import { db, isFirebaseConfigured } from "../services/firebase";
import { useAuth } from "../context/AuthContext";
import { useHealth } from "../context/HealthContext";
import { useMealPlan } from "../hooks/useMealPlan";
import MealPlanCard from "../components/MealPlanCard";
import AlertBanner from "../components/AlertBanner";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";

const SLOTS = ["breakfast", "lunch", "dinner", "snacks"];

const AIMealPlanner = () => {
  const { user } = useAuth();
  const { medicines, conditions } = useHealth();
  const [allergies, setAllergies] = useState([]);

  // Pull allergies from profile so prompts are personalised.
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
      toast({
        title: "Generation failed",
        description: e.message,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <header className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold flex items-center gap-2">
            <Salad className="h-6 w-6 text-safe" /> AI Meal Planner
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Personalised, condition-aware full-day meal plans powered by Gemini.
          </p>
        </div>
        <Button onClick={handleGenerate} disabled={generating || loading} className="gap-2">
          {generating ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Generating…</>
          ) : plan ? (
            <><RefreshCw className="h-4 w-4" /> Regenerate</>
          ) : (
            <><Sparkles className="h-4 w-4" /> Generate plan</>
          )}
        </Button>
      </header>

      <section className="rounded-2xl border bg-card p-4 text-sm">
        <p className="text-muted-foreground">
          Using <span className="font-medium text-foreground">{medicines.length}</span> medicine
          {medicines.length === 1 ? "" : "s"},{" "}
          <span className="font-medium text-foreground">{conditions.length}</span> condition
          {conditions.length === 1 ? "" : "s"}, and{" "}
          <span className="font-medium text-foreground">{allergies.length}</span> allergy entr
          {allergies.length === 1 ? "y" : "ies"}.
        </p>
      </section>

      {error && (
        <AlertBanner variant="warning">
          <span className="font-medium">Couldn't generate plan:</span> {error}
        </AlertBanner>
      )}

      {loading && !plan && <SkeletonGrid />}

      {!loading && !plan && !generating && (
        <div className="rounded-2xl border bg-gradient-to-br from-safe-soft via-card to-accent p-10 text-center">
          <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
          <h2 className="text-lg font-semibold">No plan for today yet</h2>
          <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
            Tap <span className="font-medium">Generate plan</span> to get a full day of safe meals
            tailored to your active medicines and conditions.
          </p>
        </div>
      )}

      {plan && (
        <>
          {plan.warnings?.length > 0 && (
            <div className="rounded-2xl border border-avoid/30 bg-avoid-soft p-4">
              <div className="flex items-center gap-2 mb-2 text-avoid">
                <AlertTriangle className="h-4 w-4" />
                <h3 className="font-semibold text-sm uppercase tracking-wide">Warnings</h3>
              </div>
              <ul className="space-y-1 text-sm text-foreground">
                {plan.warnings.map((w, i) => <li key={i}>• {w}</li>)}
              </ul>
            </div>
          )}

          <div className="grid gap-4 md:grid-cols-2">
            {SLOTS.map((slot) => (
              <MealPlanCard key={slot} slot={slot} data={plan[slot]} />
            ))}
          </div>

          {plan.hydration && (
            <div className="rounded-2xl border bg-info-soft p-4 flex items-start gap-3">
              <Droplets className="h-5 w-5 text-info mt-0.5 shrink-0" />
              <div>
                <p className="text-xs uppercase tracking-wide text-info font-semibold mb-1">
                  Hydration
                </p>
                <p className="text-sm">{plan.hydration}</p>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

const SkeletonGrid = () => (
  <div className="grid gap-4 md:grid-cols-2">
    {SLOTS.map((s) => (
      <div key={s} className="rounded-2xl border bg-card p-5 animate-pulse">
        <div className="h-9 w-9 rounded-xl bg-muted mb-3" />
        <div className="h-4 w-32 bg-muted rounded mb-2" />
        <div className="h-3 w-full bg-muted rounded mb-1" />
        <div className="h-3 w-2/3 bg-muted rounded" />
      </div>
    ))}
  </div>
);

export default AIMealPlanner;
