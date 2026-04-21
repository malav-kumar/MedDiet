import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { LayoutDashboard, Pill, HeartPulse, Salad, User, LogOut, Menu, X } from "lucide-react";
import { useAuth } from "../context/AuthContext";

const tabs = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard, end: true },
  { to: "/medicines", label: "Medicine Checker", icon: Pill },
  { to: "/conditions", label: "Condition Guide", icon: HeartPulse },
  { to: "/meals", label: "Meal Planner", icon: Salad },
  { to: "/profile", label: "Profile", icon: User },
];

const AppShell = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  const NavItem = ({ to, label, icon: Icon, end }) => (
    <NavLink
      to={to}
      end={end}
      onClick={() => setOpen(false)}
      className={({ isActive }) =>
        `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition ${
          isActive
            ? "bg-primary-soft text-primary-text"
            : "text-muted-foreground hover:bg-secondary hover:text-foreground"
        }`
      }
    >
      {({ isActive }) => (
        <>
          <Icon className={`h-5 w-5 ${isActive ? "text-primary" : "text-slate-400"}`} />
          <span>{label}</span>
        </>
      )}
    </NavLink>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-sidebar border-r border-sidebar-border
                    flex flex-col transform transition-transform duration-200
                    ${open ? "translate-x-0" : "-translate-x-full"} lg:translate-x-0`}
      >
        <div className="px-5 py-5 flex items-center gap-2.5 border-b border-sidebar-border">
          <div className="w-9 h-9 rounded-lg bg-primary text-primary-foreground grid place-items-center font-display font-bold">
            Md
          </div>
          <div className="leading-tight">
            <p className="font-display font-bold text-foreground">MedDiet</p>
            <p className="text-xs text-muted-foreground">Advisor</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          {tabs.map((t) => <NavItem key={t.to} {...t} />)}
        </nav>

        {user && (
          <div className="p-3 border-t border-sidebar-border">
            <button
              type="button"
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-muted-foreground hover:bg-avoid-soft hover:text-avoid-text transition"
            >
              <LogOut className="h-5 w-5" /> Sign Out
            </button>
          </div>
        )}
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Main */}
      <div className="lg:ml-64 flex flex-col min-h-screen">
        <header className="sticky top-0 z-20 bg-background/90 backdrop-blur border-b border-border px-4 lg:px-6 py-3 flex items-center gap-3">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-secondary text-muted-foreground"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <h2 className="font-display font-bold text-foreground">MedDiet Advisor</h2>
        </header>

        <main className="flex-1 p-4 lg:p-6">
          <div className="max-w-5xl mx-auto">{children}</div>
        </main>
      </div>
    </div>
  );
};

export default AppShell;
