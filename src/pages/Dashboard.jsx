import { Pill, HeartPulse, Salad, User, Coffee, UtensilsCrossed, Soup, Cookie } from "lucide-react";
import { Link } from "react-router-dom";
import QuickActionCard from "../components/QuickActionCard";
import AlertBanner from "../components/AlertBanner";
import { useAuth } from "../context/AuthContext";
import { useHealth } from "../context/HealthContext";

const Dashboard = () => {
  const { user } = useAuth();
  const { medicines, conditions, combinedRules, savedMeal } = useHealth();
  const name = user?.displayName || user?.email?.split("@")[0] || "there";

  const SLOTS = ["breakfast", "lunch", "dinner", "snacks"];
  const SLOT_ICONS = { breakfast: Coffee, lunch: UtensilsCrossed, dinner: Soup, snacks: Cookie };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-display font-bold text-foreground">
          Welcome back, <span className="capitalize">{name}</span>
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Smart diet guidance based on your medicines and conditions.
        </p>
      </header>

      {(combinedRules.avoid.length > 0 || combinedRules.caution.length > 0) && (
        <AlertBanner variant="warning" title="Watch out for these foods today">
          {[...combinedRules.avoid, ...combinedRules.caution].slice(0, 6).join(", ")}
          {combinedRules.avoid.length + combinedRules.caution.length > 6 ? "…" : ""}
        </AlertBanner>
      )}

      {/* Stats row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <StatCard label="Meal Plans" value={savedMeal ? "1" : "0"} />
        <PillStatCard
          label="Active Medicines"
          items={medicines.map((m) => m.medicine)}
          tagClass="bg-primary-soft text-primary-text"
        />
        <PillStatCard
          label="Active Conditions"
          items={conditions.map((c) => c.condition)}
          tagClass="bg-safe-soft text-safe-text"
        />
      </div>

      {/* Today's meal plan */}
      {savedMeal ? (
        <section className="space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              Today's Meal Plan
            </p>
            <Link to="/meals" className="text-xs text-primary font-semibold hover:underline">
              Edit →
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {SLOTS.map((slot) => {
              const data = savedMeal[slot];
              if (!data) return null;
              const Icon = SLOT_ICONS[slot];
              return (
                <div key={slot} className="bg-card rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-sm transition">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="w-9 h-9 rounded-lg bg-safe-soft text-safe-text grid place-items-center shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-wide text-muted-foreground font-semibold">{slot}</p>
                      <p className="font-display font-bold text-sm leading-tight text-foreground">{data.meal}</p>
                    </div>
                  </div>
                  {data.foods?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {data.foods.slice(0, 4).map((f) => (
                        <span key={f} className="text-xs px-2 py-0.5 rounded-full bg-safe-soft text-safe-text border border-safe/30 capitalize font-medium">
                          {f}
                        </span>
                      ))}
                      {data.foods.length > 4 && (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-secondary text-muted-foreground font-medium">
                          +{data.foods.length - 4}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="bg-card rounded-xl border border-dashed border-input p-8 text-center">
          <div className="text-4xl mb-2" aria-hidden>🍽️</div>
          <h3 className="font-display font-bold text-foreground">No meal plan for today</h3>
          <p className="text-sm text-muted-foreground mt-1 mb-4">
            Generate a personalised plan based on your active items.
          </p>
          <Link to="/meals" className="inline-flex btn-primary">Generate Meal Plan</Link>
        </section>
      )}

      {/* Quick actions */}
      <section>
        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Quick Actions
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <QuickActionCard to="/medicines" icon={Pill} accent="primary"
            title="Medicine Checker" description="Find safe foods for your meds." />
          <QuickActionCard to="/conditions" icon={HeartPulse} accent="safe"
            title="Condition Guide" description="Diet rules for 30+ conditions." />
          <QuickActionCard to="/meals" icon={Salad} accent="info"
            title="AI Meal Planner" description="Full-day plans, tailored to you." />
          <QuickActionCard to="/profile" icon={User} accent="caution"
            title="Profile" description="Allergies & medical history." />
        </div>
      </section>
    </div>
  );
};

const StatCard = ({ label, value }) => (
  <div className="bg-card rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-sm transition">
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
    <p className="font-display font-bold text-2xl text-foreground mt-1">{value}</p>
  </div>
);

const PillStatCard = ({ label, items, tagClass }) => (
  <div className="bg-card rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-sm transition">
    <div className="flex items-center justify-between mb-2">
      <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">{label}</p>
      <span className="text-xs text-muted-foreground">{items.length}</span>
    </div>
    {items.length === 0 ? (
      <p className="text-sm text-slate-400">None yet</p>
    ) : (
      <div className="flex flex-wrap gap-1.5">
        {items.slice(0, 3).map((i) => (
          <span key={i} className={`text-xs font-medium px-2 py-0.5 rounded-full capitalize truncate max-w-[110px] ${tagClass}`}>
            {i}
          </span>
        ))}
        {items.length > 3 && (
          <span className="bg-secondary text-muted-foreground text-xs font-medium px-2 py-0.5 rounded-full">
            +{items.length - 3}
          </span>
        )}
      </div>
    )}
  </div>
);

export default Dashboard;
