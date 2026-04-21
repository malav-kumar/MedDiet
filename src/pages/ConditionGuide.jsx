import { useEffect, useRef, useState } from "react";
import { HeartPulse, Search } from "lucide-react";
import { toast } from "sonner";
import ConditionCard from "../components/ConditionCard";
import { useCondition } from "../hooks/useCondition";
import { useHealth } from "../context/HealthContext";

const ConditionGuide = () => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const results = useCondition(query);
  const { conditions: active, addCondition, removeCondition } = useHealth();

  useEffect(() => { inputRef.current?.focus(); }, []);
  const activeIds = new Set(active.map((c) => c.id));

  const handleAdd = async (c) => {
    try { await addCondition(c); toast.success(`${c.condition} added`); }
    catch (e) { toast.error(e.message); }
  };
  const handleRemove = async (id) => {
    try { await removeCondition(id); toast.success("Removed"); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <HeartPulse className="h-6 w-6 text-info" /> Condition Guide
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Pick the conditions that apply to you for tailored dietary guidance.
        </p>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef} value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search e.g. Diabetes, Hypertension…"
          className="w-full rounded-2xl border bg-card pl-11 pr-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {active.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Your active conditions
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {active.map((c) => (
              <ConditionCard key={c.id} condition={c} isActive onRemove={handleRemove} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          {query ? `Results (${results.length})` : "All conditions"}
        </h2>
        {results.length === 0 ? (
          <div className="rounded-2xl border bg-card p-10 text-center">
            <p className="text-muted-foreground">No conditions match "{query}".</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {results.map((c) => (
              <ConditionCard
                key={c.id} condition={c}
                isActive={activeIds.has(c.id)}
                onAdd={handleAdd} onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default ConditionGuide;
