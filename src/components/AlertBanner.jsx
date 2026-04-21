import { useState } from "react";
import { X } from "lucide-react";

/**
 * Dismissible alert banner.
 * variant: "error" | "warning" | "info" | "success"
 */
const VARIANTS = {
  error: { cls: "bg-avoid-soft border-avoid/30 text-avoid-text", icon: "⛔" },
  warning: { cls: "bg-caution-soft border-caution/40 text-caution-text", icon: "⚠️" },
  info: { cls: "bg-info-soft border-info/40 text-info-text", icon: "ℹ️" },
  success: { cls: "bg-safe-soft border-safe/30 text-safe-text", icon: "✅" },
};

const AlertBanner = ({ children, variant = "warning", title }) => {
  const [open, setOpen] = useState(true);
  if (!open) return null;
  const v = VARIANTS[variant] || VARIANTS.warning;
  return (
    <div className={`rounded-xl border px-4 py-3 flex items-start gap-3 ${v.cls}`}>
      <span className="text-base leading-none mt-0.5" aria-hidden>{v.icon}</span>
      <div className="flex-1">
        {title && <p className="text-sm font-semibold">{title}</p>}
        <p className={`text-xs ${title ? "mt-0.5 opacity-90" : ""}`}>{children}</p>
      </div>
      <button
        type="button"
        onClick={() => setOpen(false)}
        className="text-slate-400 hover:text-slate-600 transition"
        aria-label="Dismiss"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};

export default AlertBanner;
