import { memo } from "react";
import { Coffee, UtensilsCrossed, Soup, Cookie } from "lucide-react";
import FoodTag from "./FoodTag";

const ICONS = {
  breakfast: Coffee,
  lunch: UtensilsCrossed,
  dinner: Soup,
  snacks: Cookie,
};

/** Single meal-slot card (Breakfast / Lunch / Dinner / Snacks). */
const MealPlanCard = memo(({ slot, data }) => {
  const Icon = ICONS[slot] || UtensilsCrossed;
  if (!data) return null;
  return (
    <article className="bg-card rounded-xl border border-border p-5 hover:border-primary/40 hover:shadow-sm transition">
      <header className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-lg bg-safe-soft text-safe-text grid place-items-center">
          <Icon className="h-5 w-5" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{slot}</p>
          <h3 className="font-display font-bold leading-tight text-foreground">{data.meal}</h3>
        </div>
      </header>
      {data.foods?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-3">
          {data.foods.map((f) => (
            <span key={f} className="text-xs px-2.5 py-1 rounded-full bg-safe-soft text-safe-text border border-safe/30 capitalize font-medium">
              {f}
            </span>
          ))}
        </div>
      )}
      {data.notes && <p className="text-sm text-muted-foreground">{data.notes}</p>}
    </article>
  );
});

MealPlanCard.displayName = "MealPlanCard";
export default MealPlanCard;
