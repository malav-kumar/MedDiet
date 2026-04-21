import { memo } from "react";
import { Plus, X } from "lucide-react";
import FoodTag from "./FoodTag";

const Section = ({ title, items, variant, dotClass }) =>
  items?.length ? (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2 flex items-center gap-1.5">
        <span className={`inline-block w-1.5 h-1.5 rounded-full ${dotClass}`} />
        {title}
      </p>
      <div className="flex flex-wrap gap-2">
        {items.map((f) => <FoodTag key={f} variant={variant}>{f}</FoodTag>)}
      </div>
    </div>
  ) : null;

const ConditionCard = ({ condition, isActive, onAdd, onRemove }) => (
  <article className="bg-card rounded-xl border border-border overflow-hidden">
    {/* Teal header */}
    <header className="bg-primary px-5 py-4 flex items-center justify-between gap-3">
      <h3 className="font-display font-bold text-primary-foreground capitalize">{condition.condition}</h3>
      {isActive ? (
        <button
          type="button"
          onClick={() => onRemove?.(condition.id)}
          className="text-primary-text bg-card hover:bg-primary-soft px-3 py-1.5 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
        >
          <X className="h-3.5 w-3.5" /> Remove
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onAdd?.(condition)}
          className="text-primary-text bg-card hover:bg-primary-soft px-3 py-1.5 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      )}
    </header>

    <div className="p-5 space-y-4">
      {condition.medicines?.length > 0 && (
        <p className="text-xs text-muted-foreground">
          <span className="font-semibold text-foreground">Common meds: </span>
          <span className="capitalize">{condition.medicines.join(", ")}</span>
        </p>
      )}

      <Section title="Recommended" items={condition.recommended} variant="safe" dotClass="bg-safe" />
      <Section title="Avoid" items={condition.avoid} variant="avoid" dotClass="bg-avoid" />

      {condition.dietaryNotes?.length > 0 && (
        <>
          <hr className="border-slate-100" />
          <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
              Recovery Tips
            </p>
            <ul className="space-y-2">
              {condition.dietaryNotes.map((n, i) => (
                <li key={n} className="flex items-start gap-2.5">
                  <span className="w-5 h-5 rounded-full bg-primary-soft text-primary-text text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-muted-foreground leading-relaxed">{n}</span>
                </li>
              ))}
            </ul>
          </div>
        </>
      )}
    </div>
  </article>
);

export default memo(ConditionCard);
