import { useState } from "react";
import { toast } from "sonner";
import ConditionCard from "../components/ConditionCard";
import { useCondition } from "../hooks/useCondition";
import { useHealth } from "../context/HealthContext";

const ConditionGuide = () => {
  const [query, setQuery] = useState("");
  const allResults = useCondition("");
  const filtered = useCondition(query);
  const { conditions: active, addCondition, removeCondition } = useHealth();

  const activeIds = new Set(active.map((c) => c.id));

  const handleAdd = async (c) => {
    try { await addCondition(c); toast.success(`${c.condition} added`); }
    catch (e) { toast.error(e.message); }
  };
  const handleRemove = async (id) => {
    try { await removeCondition(id); toast.success("Removed"); }
    catch (e) { toast.error(e.message); }
  };

  const selected = query
    ? allResults.find((c) => c.id === query || c.condition === query)
    : null;

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-display font-bold text-foreground">Condition Guide</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pick the conditions that apply to you for tailored dietary guidance.
        </p>
      </header>

      {active.length > 0 && (
        <section className="bg-primary-soft border border-primary/20 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-text mb-2">
            Active conditions
          </p>
          <div className="flex flex-wrap gap-2">
            {active.map((c) => (
              <span key={c.id}
                className="inline-flex items-center gap-1.5 bg-card border border-primary/30 text-primary-text text-sm font-medium px-3 py-1 rounded-full capitalize">
                {c.condition}
                <button type="button" onClick={() => handleRemove(c.id)}
                  className="text-slate-400 hover:text-avoid transition leading-none" aria-label="Remove">
                  ×
                </button>
              </span>
            ))}
          </div>
        </section>
      )}

      <div>
        <select
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full px-3.5 py-3 border border-input rounded-xl text-sm bg-card capitalize focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent"
        >
          <option value="">Select a condition…</option>
          {allResults.map((c) => (
            <option key={c.id} value={c.id} className="capitalize">{c.condition}</option>
          ))}
        </select>
      </div>

      {selected ? (
        <div className="grid gap-4 sm:grid-cols-2">
          <ConditionCard
            condition={selected}
            isActive={activeIds.has(selected.id)}
            onAdd={handleAdd}
            onRemove={handleRemove}
          />
        </div>
      ) : (
        <div className="bg-card rounded-xl border border-dashed border-input p-8 text-center">
          <div className="text-4xl mb-2" aria-hidden>🏥</div>
          <h3 className="font-display font-bold text-foreground">Select a condition above</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Get medicines, dietary guidance, and recovery tips.
          </p>
        </div>
      )}

      {!selected && filtered.length > 0 && (
        <section>
          <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            All conditions
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            {filtered.map((c) => (
              <ConditionCard
                key={c.id} condition={c}
                isActive={activeIds.has(c.id)}
                onAdd={handleAdd} onRemove={handleRemove}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default ConditionGuide;
