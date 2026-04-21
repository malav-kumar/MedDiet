import { Salad, Sparkles } from "lucide-react";

/** Phase 2 placeholder. */
const AIMealPlanner = () => (
  <div className="space-y-6">
    <header>
      <h1 className="text-2xl font-semibold flex items-center gap-2">
        <Salad className="h-6 w-6 text-safe" /> AI Meal Planner
      </h1>
      <p className="text-sm text-muted-foreground mt-1">
        Personalised, condition-aware full-day meal plans.
      </p>
    </header>

    <div className="rounded-2xl border bg-gradient-to-br from-safe-soft via-card to-accent p-10 text-center">
      <Sparkles className="h-10 w-10 text-primary mx-auto mb-3" />
      <h2 className="text-lg font-semibold">Coming in Phase 2</h2>
      <p className="text-sm text-muted-foreground mt-2 max-w-md mx-auto">
        We'll plug in Google Gemini to generate breakfast, lunch, dinner, snacks
        and warnings — based on your active medicines and conditions.
      </p>
    </div>
  </div>
);

export default AIMealPlanner;
