import { AlertCircle, ArrowRight } from "lucide-react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

const SignupPage = () => {
  const navigate = useNavigate();
  const { signup } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await signup(form);
      navigate("/dashboard", { replace: true });
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to create account");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form onSubmit={onSubmit} className="glass-card w-full max-w-md rounded-2xl p-6 shadow-card">
        <h1 className="section-title text-3xl font-bold">Create Account</h1>
        <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">Start your AI interview practice journey.</p>

        {error ? (
          <div className="mt-4 flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-700/40 dark:bg-rose-900/20 dark:text-rose-200">
            <AlertCircle size={16} />
            {error}
          </div>
        ) : null}

        <div className="mt-5 space-y-4">
          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Full Name
            <input
              type="text"
              required
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-brand-200 bg-white/90 px-3 py-2 outline-none ring-brand-300 transition focus:ring dark:border-slate-700 dark:bg-slate-900/80"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Email
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-brand-200 bg-white/90 px-3 py-2 outline-none ring-brand-300 transition focus:ring dark:border-slate-700 dark:bg-slate-900/80"
            />
          </label>

          <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
            Password
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-brand-200 bg-white/90 px-3 py-2 outline-none ring-brand-300 transition focus:ring dark:border-slate-700 dark:bg-slate-900/80"
            />
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {loading ? "Creating account..." : "Sign up"}
          <ArrowRight size={16} />
        </button>

        <p className="mt-4 text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account?{" "}
          <Link to="/login" className="font-semibold text-brand-700 dark:text-brand-300">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
};

export default SignupPage;
