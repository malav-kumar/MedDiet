import { memo } from "react";
import { HeartPulse, Plus, Trash2 } from "lucide-react";
import FoodTag from "./FoodTag";

const Section = ({ title, items, variant }) =>
  items?.length ? (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
        {title}
      </p>
      <div className="flex flex-wrap gap-1.5">
        {items.map((f) => (
          <FoodTag key={f} variant={variant}>{f}</FoodTag>
        ))}
      </div>
    </div>
  ) : null;

const ConditionCard = ({ condition, isActive, onAdd, onRemove }) => (
  <article className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition">
    <header className="flex items-start justify-between gap-3 mb-4">
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-xl bg-info/10 text-info flex items-center justify-center">
          <HeartPulse className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-card-foreground">{condition.condition}</h3>
          {condition.medicines?.length > 0 && (
            <p className="text-xs text-muted-foreground">
              Common meds: {condition.medicines.join(", ")}
            </p>
          )}
        </div>
      </div>
      {isActive ? (
        <button
          type="button"
          onClick={() => onRemove?.(condition.id)}
          className="inline-flex items-center gap-1 rounded-full bg-avoid-soft text-avoid px-3 py-1.5 text-xs font-medium hover:bg-avoid hover:text-avoid-foreground transition"
        >
          <Trash2 className="h-3.5 w-3.5" /> Remove
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onAdd?.(condition)}
          className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-90 transition"
        >
          <Plus className="h-3.5 w-3.5" /> Set active
        </button>
      )}
    </header>

    <div className="space-y-3">
      <Section title="Recommended" items={condition.recommended} variant="safe" />
      <Section title="Avoid" items={condition.avoid} variant="avoid" />
    </div>

    {condition.dietaryNotes?.length > 0 && (
      <ul className="mt-4 border-t pt-3 space-y-1">
        {condition.dietaryNotes.map((n) => (
          <li key={n} className="text-xs text-muted-foreground leading-relaxed">• {n}</li>
        ))}
      </ul>
    )}
  </article>
);

export default memo(ConditionCard);
