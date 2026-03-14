import { Bell, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import ThemeToggle from "./ThemeToggle";

const Navbar = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const onLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="glass-card sticky top-0 z-20 flex h-16 items-center justify-between border-b border-white/30 px-4 md:px-6">
      <div>
        <p className="text-sm text-slate-600 dark:text-slate-300">Welcome back</p>
        <h1 className="font-display text-lg font-bold">{user?.name || "Candidate"}</h1>
      </div>

      <div className="flex items-center gap-2 md:gap-3">
        <button
          type="button"
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-brand-200 bg-white/80 text-brand-700 transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
        >
          <Bell size={18} />
        </button>
        <ThemeToggle />
        <button
          type="button"
          onClick={onLogout}
          className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100 dark:border-rose-700/40 dark:bg-rose-900/30 dark:text-rose-200"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
