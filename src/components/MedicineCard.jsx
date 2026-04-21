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

const MedicineCard = ({ medicine, isActive, onAdd, onRemove }) => (
  <article className="bg-card rounded-xl border border-border p-5">
    <header className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h3 className="font-display font-bold text-foreground capitalize">{medicine.medicine}</h3>
        {medicine.category && (
          <span className="inline-block mt-1.5 text-xs bg-primary-soft text-primary-text border border-primary/20 px-2 py-0.5 rounded-full font-medium capitalize">
            {medicine.category}
          </span>
        )}
      </div>
      {isActive ? (
        <button
          type="button"
          onClick={() => onRemove?.(medicine.id)}
          className="text-avoid-text hover:bg-avoid-soft border border-avoid/30 px-3 py-1.5 rounded-lg text-xs font-semibold transition inline-flex items-center gap-1"
        >
          <X className="h-3.5 w-3.5" /> Remove
        </button>
      ) : (
        <button
          type="button"
          onClick={() => onAdd?.(medicine)}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold px-3 py-1.5 rounded-lg text-xs transition inline-flex items-center gap-1"
        >
          <Plus className="h-3.5 w-3.5" /> Add
        </button>
      )}
    </header>

    {medicine.timing && (
      <p className="text-sm text-foreground bg-secondary rounded-lg px-3 py-2 mb-4">
        <span className="font-semibold">Timing: </span>{medicine.timing}
      </p>
    )}

    <div className="space-y-3">
      <Section title="Safe with" items={medicine.safe} variant="safe" dotClass="bg-safe" />
      <Section title="Avoid" items={medicine.avoid} variant="avoid" dotClass="bg-avoid" />
      <Section title="Caution" items={medicine.caution} variant="caution" dotClass="bg-caution" />
    </div>

    {medicine.reason && (
      <>
        <hr className="border-slate-100 my-4" />
        <p className="text-xs text-muted-foreground leading-relaxed">
          <span className="font-semibold text-foreground">Why: </span>{medicine.reason}
        </p>
      </>
    )}
  </article>
);

export default memo(MedicineCard);
