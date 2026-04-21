/**
 * Color-coded food tag.
 * variant: "safe" | "avoid" | "caution" | "info"
 */
const styles = {
  safe: "bg-safe-soft text-safe border-safe/20",
  avoid: "bg-avoid-soft text-avoid border-avoid/20",
  caution: "bg-caution-soft text-caution border-caution/30",
  info: "bg-info-soft text-info border-info/20",
};

const FoodTag = ({ children, variant = "info" }) => (
  <span
    className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium border ${styles[variant]}`}
  >
    {children}
  </span>
);

export default FoodTag;
