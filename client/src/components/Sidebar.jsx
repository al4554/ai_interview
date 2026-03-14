import { Bot, ChartNoAxesCombined, Clock3, LayoutDashboard, Settings } from "lucide-react";
import { NavLink } from "react-router-dom";
import clsx from "clsx";
import { useAuth } from "../hooks/useAuth";

const itemBaseClass =
  "flex items-center gap-3 rounded-xl px-3 py-2 text-sm font-semibold transition hover:-translate-y-0.5";

const Sidebar = ({ onNavigate }) => {
  const { isAdmin } = useAuth();

  const links = [
    { to: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
    { to: "/setup", icon: Bot, label: "New Interview" },
    { to: "/history", icon: Clock3, label: "History" }
  ];

  if (isAdmin) {
    links.push({ to: "/admin", icon: ChartNoAxesCombined, label: "Admin" });
  }

  return (
    <aside className="glass-card h-full w-full border-r border-white/30 p-4">
      <div className="mb-8 flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-card">
          <Bot size={20} />
        </div>
        <div>
          <h2 className="font-display text-lg font-bold">InterviewIQ</h2>
          <p className="text-xs text-slate-500 dark:text-slate-300">AI Coach Platform</p>
        </div>
      </div>

      <nav className="space-y-2">
        {links.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={onNavigate}
              className={({ isActive }) =>
                clsx(itemBaseClass, {
                  "bg-brand-600 text-white shadow-soft": isActive,
                  "text-slate-700 hover:bg-white dark:text-slate-200 dark:hover:bg-slate-800": !isActive
                })
              }
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      <div className="mt-10 rounded-2xl border border-brand-100 bg-gradient-to-br from-brand-600 to-brand-700 p-4 text-white shadow-card">
        <h3 className="font-display font-semibold">Need Better Scores?</h3>
        <p className="mt-2 text-sm text-blue-100">Practice 3 sessions weekly and track progress in your dashboard.</p>
        <button className="mt-4 inline-flex items-center gap-2 rounded-lg bg-white/20 px-3 py-2 text-xs font-bold backdrop-blur transition hover:bg-white/30">
          <Settings size={14} />
          Coaching Tips
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
