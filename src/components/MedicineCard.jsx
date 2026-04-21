import { memo } from "react";
import { Clock, Pill, Plus, Trash2 } from "lucide-react";
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

const MedicineCard = ({ medicine, isActive, onAdd, onRemove }) => (
  <article className="rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md transition">
    <header className="flex items-start justify-between gap-3 mb-4">
      <div className="flex gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
          <Pill className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-semibold text-card-foreground">{medicine.medicine}</h3>
          <p className="text-xs text-muted-foreground">{medicine.category}</p>
        </div>
      </div>
      {isActive ? (
        <button
          type="button"
          onClick={() => onRemove?.(medicine.id)}
          className="inline-flex items-center gap-1 rounded-full bg-avoid-soft text-avoid px-3 py-1.5 text-xs font-medium hover:bg-avoid hover:text-avoid-foreground transition"
        >
          <Trash2 className="h-3.5 w-3.5" /> Remove
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onAdd?.(medicine)}
          className="inline-flex items-center gap-1 rounded-full bg-primary text-primary-foreground px-3 py-1.5 text-xs font-medium hover:opacity-90 transition"
        >
          <Plus className="h-3.5 w-3.5" /> Set active
        </button>
      )}
    </header>

    <p className="flex items-center gap-2 text-xs text-muted-foreground mb-4">
      <Clock className="h-3.5 w-3.5" /> {medicine.timing}
    </p>

    <div className="space-y-3">
      <Section title="Safe with" items={medicine.safe} variant="safe" />
      <Section title="Avoid" items={medicine.avoid} variant="avoid" />
      <Section title="Caution" items={medicine.caution} variant="caution" />
    </div>

    {medicine.reason && (
      <p className="mt-4 text-xs text-muted-foreground border-t pt-3 leading-relaxed">
        <span className="font-medium text-foreground">Why: </span>{medicine.reason}
      </p>
    )}
  </article>
);

export default memo(MedicineCard);
