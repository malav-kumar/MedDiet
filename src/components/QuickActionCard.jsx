import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const QuickActionCard = ({ to, icon: Icon, title, description, accent = "primary" }) => {
  const colorMap = {
    primary: "bg-primary/10 text-primary",
    info: "bg-info/10 text-info",
    safe: "bg-safe/10 text-safe",
    caution: "bg-caution/10 text-caution",
  };
  return (
    <Link
      to={to}
      className="group block rounded-2xl border bg-card p-5 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition"
    >
      <div className={`h-11 w-11 rounded-xl flex items-center justify-center mb-4 ${colorMap[accent]}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="flex items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold text-card-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground mt-1">{description}</p>
        </div>
        <ArrowRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition mt-1" />
      </div>
    </Link>
  );
};

export default QuickActionCard;
