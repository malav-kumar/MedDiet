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
    <article className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition-shadow">
      <header className="flex items-center gap-2 mb-3">
        <div className="h-9 w-9 rounded-xl bg-safe-soft text-safe grid place-items-center">
          <Icon className="h-4 w-4" />
        </div>
        <div>
          <p className="text-xs uppercase tracking-wide text-muted-foreground">{slot}</p>
          <h3 className="font-semibold leading-tight">{data.meal}</h3>
        </div>
      </header>
      {data.foods?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {data.foods.map((f) => (
            <FoodTag key={f} variant="safe">{f}</FoodTag>
          ))}
        </div>
      )}
      {data.notes && <p className="text-sm text-muted-foreground">{data.notes}</p>}
    </article>
  );
});

MealPlanCard.displayName = "MealPlanCard";
export default MealPlanCard;
