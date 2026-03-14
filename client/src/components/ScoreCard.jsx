import { formatPercent } from "../utils/formatters";

const ScoreCard = ({ title, value, accent = "brand" }) => {
  const accentMap = {
    brand: "from-brand-500 to-brand-700",
    emerald: "from-emerald-500 to-emerald-700",
    amber: "from-amber-500 to-amber-700",
    rose: "from-rose-500 to-rose-700"
  };

  return (
    <article className="glass-card rounded-2xl p-4 shadow-soft">
      <p className="text-sm text-slate-500 dark:text-slate-300">{title}</p>
      <p className="mt-1 font-display text-2xl font-bold">{formatPercent(value)}</p>
      <div className="mt-3 h-2 rounded-full bg-slate-200 dark:bg-slate-700">
        <div
          className={`h-2 rounded-full bg-gradient-to-r ${accentMap[accent] || accentMap.brand}`}
          style={{ width: `${Math.min(100, Math.max(0, value || 0))}%` }}
        />
      </div>
    </article>
  );
};

export default ScoreCard;
