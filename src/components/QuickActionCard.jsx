import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const QuickActionCard = ({ to, icon: Icon, title, description, accent = "primary" }) => {
  const colorMap = {
    primary: "bg-primary-soft text-primary",
    info: "bg-info-soft text-info-text",
    safe: "bg-safe-soft text-safe-text",
    caution: "bg-caution-soft text-caution-text",
  };
  return (
    <Link
      to={to}
      className="group block bg-card rounded-xl border border-border p-4 hover:border-primary/40 hover:shadow-sm transition"
    >
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${colorMap[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-display font-bold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition mt-1 shrink-0" />
      </div>
    </Link>
  );
};

export default QuickActionCard;
