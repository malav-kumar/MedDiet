import { useEffect, useRef, useState } from "react";
import { Pill, Search } from "lucide-react";
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
    <div className="space-y-8">
      <header>
        <h1 className="text-2xl font-semibold flex items-center gap-2">
          <Pill className="h-6 w-6 text-primary" /> Medicine Checker
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Search a medicine to see foods that are safe, to avoid, or to use with caution.
        </p>
      </header>

      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search e.g. Paracetamol, Metformin…"
          className="w-full rounded-2xl border bg-card pl-11 pr-4 py-3 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {active.length > 0 && (
        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
            Your active medicines
          </h2>
          <div className="grid gap-4 md:grid-cols-2">
            {active.map((m) => (
              <MedicineCard key={m.id} medicine={m} isActive onRemove={handleRemove} />
            ))}
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          {query ? `Results (${results.length})` : "All medicines"}
        </h2>
        {results.length === 0 ? (
          <div className="rounded-2xl border bg-card p-10 text-center">
            <p className="text-muted-foreground">No medicines match "{query}".</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
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
