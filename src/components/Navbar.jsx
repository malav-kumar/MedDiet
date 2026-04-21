import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Pill, HeartPulse, Salad, User, LogOut, Leaf } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const tabs = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/medicines", label: "Medicines", icon: Pill },
  { to: "/conditions", label: "Conditions", icon: HeartPulse },
  { to: "/meals", label: "Meals", icon: Salad },
  { to: "/profile", label: "Profile", icon: User },
];

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <header className="sticky top-0 z-30 backdrop-blur bg-background/80 border-b">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <NavLink to="/" className="flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl bg-primary text-primary-foreground grid place-items-center">
            <Leaf className="h-5 w-5" />
          </div>
          <span className="font-semibold text-foreground">MedDiet</span>
        </NavLink>

        <nav className="hidden md:flex items-center gap-1">
          {tabs.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm transition ${
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </nav>

        {user && (
          <button
            type="button"
            onClick={handleLogout}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-2 text-sm text-muted-foreground hover:text-foreground hover:bg-muted transition"
          >
            <LogOut className="h-4 w-4" /> <span className="hidden sm:inline">Logout</span>
          </button>
        )}
      </div>

      {/* mobile tabs */}
      <nav className="md:hidden border-t bg-background/95">
        <div className="max-w-6xl mx-auto px-2 flex justify-between">
          {tabs.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/"}
              className={({ isActive }) =>
                `flex-1 flex flex-col items-center gap-0.5 py-2 text-[11px] transition ${
                  isActive ? "text-primary" : "text-muted-foreground"
                }`
              }
            >
              <Icon className="h-4 w-4" />
              {label}
            </NavLink>
          ))}
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
