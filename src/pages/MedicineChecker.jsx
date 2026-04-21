import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { toast } from "sonner";
import MedicineCard from "../components/MedicineCard";
import { useMedicine } from "../hooks/useMedicine";
import { useHealth } from "../context/HealthContext";

const MedicineChecker = () => {
  const [query, setQuery] = useState("");
  const inputRef = useRef(null);
  const results = useMedicine(query);
  const { medicines: active, addMedicine, removeMedicine } = useHealth();

  useEffect(() => { inputRef.current?.focus(); }, []);

  const activeIds = new Set(active.map((m) => m.id));

  const handleAdd = async (m) => {
    try { await addMedicine(m); toast.success(`${m.medicine} added`); }
    catch (e) { toast.error(e.message); }
  };
  const handleRemove = async (id) => {
    try { await removeMedicine(id); toast.success("Removed"); }
    catch (e) { toast.error(e.message); }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-display font-bold text-foreground">Medicine Checker</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search a medicine to see foods that are safe, to avoid, or to use with caution.
        </p>
      </header>

      {active.length > 0 && (
        <section className="bg-primary-soft border border-primary/20 rounded-xl px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-primary-text mb-2">
            Active medicines
          </p>
          <div className="flex flex-wrap gap-2">
            {active.map((m) => (
              <span key={m.id}
                className="inline-flex items-center gap-1.5 bg-card border border-primary/30 text-primary-text text-sm font-medium px-3 py-1 rounded-full capitalize">
                {m.medicine}
                <button type="button" onClick={() => handleRemove(m.id)}
                  className="text-slate-400 hover:text-avoid transition leading-none" aria-label="Remove">
                  ×
                </button>
              </span>
            ))}
          </div>
        </section>
      )}

      <div className="relative">
        <div className="absolute inset-y-0 left-3.5 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search e.g. Paracetamol, Metformin…"
          className="w-full pl-10 pr-4 py-3 border border-input rounded-xl text-sm bg-card focus:outline-none focus:ring-2 focus:ring-ring focus:border-transparent transition"
        />
      </div>

      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          {query ? `Results (${results.length})` : "All medicines"}
        </p>
        {results.length === 0 ? (
          <div className="bg-card rounded-xl border border-dashed border-input p-8 text-center">
            <div className="text-4xl mb-2" aria-hidden>💊</div>
            <h3 className="font-display font-bold text-foreground">Search for a medicine</h3>
            <p className="text-sm text-muted-foreground mt-1">Try: warfarin, metformin…</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {results.map((m) => (
              <MedicineCard
                key={m.id} medicine={m}
                isActive={activeIds.has(m.id)}
                onAdd={handleAdd} onRemove={handleRemove}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default MedicineChecker;
