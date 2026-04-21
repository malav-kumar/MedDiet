/**
 * Color-coded food tag.
 * variant: "safe" | "avoid" | "caution" | "info" | "neutral"
 */
const styles = {
  safe: "bg-safe-soft text-safe-text border-safe/30",
  avoid: "bg-avoid-soft text-avoid-text border-avoid/30",
  caution: "bg-caution-soft text-caution-text border-caution/40",
  info: "bg-info-soft text-info-text border-info/40",
  neutral: "bg-secondary text-muted-foreground border-border",
};

const FoodTag = ({ children, variant = "info" }) => (
  <span
    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border capitalize ${styles[variant]}`}
  >
    {children}
  </span>
);

export default FoodTag;
