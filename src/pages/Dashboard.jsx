import { Pill, HeartPulse, Salad, User, Sun, Moon, Sunrise } from "lucide-react";
import { Link } from "react-router-dom";
import QuickActionCard from "../components/QuickActionCard";
import AlertBanner from "../components/AlertBanner";
import FoodTag from "../components/FoodTag";
import { useAuth } from "../context/AuthContext";
import { useHealth } from "../context/HealthContext";

const greeting = () => {
  const h = new Date().getHours();
  if (h < 12) return { text: "Good morning", Icon: Sunrise };
  if (h < 18) return { text: "Good afternoon", Icon: Sun };
  return { text: "Good evening", Icon: Moon };
};

const Dashboard = () => {
  const { user } = useAuth();
  const { medicines, conditions, combinedRules } = useHealth();
  const { text, Icon } = greeting();
  const today = new Date().toLocaleDateString(undefined, {
    weekday: "long", month: "long", day: "numeric",
  });
  const name = user?.displayName || user?.email?.split("@")[0] || "there";

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border bg-gradient-to-br from-primary/10 via-card to-accent p-6">
        <p className="text-sm text-muted-foreground">{today}</p>
        <h1 className="text-2xl md:text-3xl font-semibold mt-1 flex items-center gap-2">
          <Icon className="h-6 w-6 text-primary" /> {text}, {name}.
        </h1>
        <p className="text-muted-foreground mt-2 max-w-xl">
          Smart diet guidance based on your medicines and conditions — so every meal supports your treatment.
        </p>
      </section>

      {(combinedRules.avoid.length > 0 || combinedRules.caution.length > 0) && (
        <AlertBanner>
          Based on your active items, watch out for:{" "}
          <span className="font-medium">
            {[...combinedRules.avoid, ...combinedRules.caution].slice(0, 6).join(", ")}
            {combinedRules.avoid.length + combinedRules.caution.length > 6 ? "…" : ""}
          </span>
        </AlertBanner>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        <SummaryCard
          icon={Pill} title="Active medicines" count={medicines.length}
          linkTo="/medicines" linkLabel="Manage"
          empty="No medicines added yet."
          items={medicines.map((m) => m.medicine)}
        />
        <SummaryCard
          icon={HeartPulse} title="Active conditions" count={conditions.length}
          linkTo="/conditions" linkLabel="Manage"
          empty="No conditions added yet."
          items={conditions.map((c) => c.condition)}
        />
      </div>

      {(combinedRules.safe.length > 0 || combinedRules.avoid.length > 0) && (
        <section className="rounded-2xl border bg-card p-5">
          <h2 className="font-semibold mb-4">Combined food guidance</h2>
          <div className="grid gap-4 md:grid-cols-3">
            <TagGroup title="Safe" items={combinedRules.safe} variant="safe" />
            <TagGroup title="Avoid" items={combinedRules.avoid} variant="avoid" />
            <TagGroup title="Caution" items={combinedRules.caution} variant="caution" />
          </div>
        </section>
      )}

      <section>
        <h2 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground mb-3">
          Quick actions
        </h2>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <QuickActionCard to="/medicines" icon={Pill} accent="primary"
            title="Medicine checker" description="Find safe foods for your meds." />
          <QuickActionCard to="/conditions" icon={HeartPulse} accent="info"
            title="Condition guide" description="Diet rules for 30+ conditions." />
          <QuickActionCard to="/meals" icon={Salad} accent="safe"
            title="AI meal planner" description="Coming next: full-day plans." />
          <QuickActionCard to="/profile" icon={User} accent="caution"
            title="Profile" description="Allergies & medical history." />
        </div>
      </section>
    </div>
  );
};

const SummaryCard = ({ icon: Icon, title, count, items, linkTo, linkLabel, empty }) => (
  <article className="rounded-2xl border bg-card p-5 shadow-sm">
    <div className="flex items-center justify-between mb-3">
      <div className="flex items-center gap-2">
        <div className="h-9 w-9 rounded-xl bg-primary/10 text-primary grid place-items-center">
          <Icon className="h-4 w-4" />
        </div>
        <h3 className="font-semibold">{title}</h3>
      </div>
      <span className="text-sm text-muted-foreground">{count}</span>
    </div>
    {items.length === 0 ? (
      <p className="text-sm text-muted-foreground">{empty}</p>
    ) : (
      <ul className="space-y-1.5">
        {items.slice(0, 4).map((i) => (
          <li key={i} className="text-sm text-foreground">• {i}</li>
        ))}
        {items.length > 4 && (
          <li className="text-xs text-muted-foreground">+ {items.length - 4} more</li>
        )}
      </ul>
    )}
    <Link to={linkTo} className="mt-4 inline-block text-sm font-medium text-primary hover:underline">
      {linkLabel} →
    </Link>
  </article>
);

const TagGroup = ({ title, items, variant }) => (
  <div>
    <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">{title}</p>
    {items.length === 0 ? (
      <p className="text-sm text-muted-foreground">—</p>
    ) : (
      <div className="flex flex-wrap gap-1.5">
        {items.slice(0, 12).map((i) => (
          <FoodTag key={i} variant={variant}>{i}</FoodTag>
        ))}
      </div>
    )}
  </div>
);

export default Dashboard;
