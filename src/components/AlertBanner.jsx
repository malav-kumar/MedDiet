import { useState } from "react";
import { AlertTriangle, X } from "lucide-react";

/** Dismissible alert banner. variant: "warning" | "info" */
const AlertBanner = ({ children, variant = "warning" }) => {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  const palette =
    variant === "warning"
      ? "bg-caution-soft border-caution/30 text-caution-foreground"
      : "bg-info-soft border-info/20 text-info-foreground";
  return (
    <div className={`flex items-start gap-3 rounded-2xl border p-4 ${palette}`}>
      <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
      <div className="flex-1 text-sm">{children}</div>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="opacity-60 hover:opacity-100 transition"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AlertBanner;
