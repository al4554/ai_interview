import { CircleGauge } from "lucide-react";

const QuestionCard = ({ questionCount, difficulty, questionType }) => {
  return (
    <section className="glass-card mb-4 rounded-2xl p-4 shadow-soft">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300">Current Question</p>
          <h2 className="font-display text-lg font-bold">Question #{questionCount}</h2>
        </div>

        <div className="flex items-center gap-3 text-sm">
          <span className="inline-flex items-center gap-1 rounded-full bg-brand-100 px-3 py-1 text-brand-700 dark:bg-brand-900/50 dark:text-brand-200">
            <CircleGauge size={14} />
            {difficulty}
          </span>
          <span className="rounded-full bg-emerald-100 px-3 py-1 font-semibold text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
            {questionType}
          </span>
        </div>
      </div>
    </section>
  );
};

export default QuestionCard;
