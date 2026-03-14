import { ArrowRight, Search } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { getInterviewHistoryApi } from "../api/interviewApi";
import { formatDate, formatDuration } from "../utils/formatters";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const load = async () => {
      const data = await getInterviewHistoryApi();
      setHistory(data);
    };

    load();
  }, []);

  const filtered = useMemo(() => {
    return history.filter((item) =>
      `${item.jobRole} ${item.interviewType}`.toLowerCase().includes(search.toLowerCase())
    );
  }, [history, search]);

  return (
    <div className="space-y-4">
      <section className="glass-card rounded-2xl p-4 shadow-soft">
        <h2 className="section-title text-2xl font-bold">Interview History</h2>
        <div className="mt-4 flex items-center gap-2 rounded-xl border border-brand-200 bg-white/80 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/70">
          <Search size={16} className="text-slate-500" />
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by role or interview type"
            className="w-full bg-transparent text-sm outline-none"
          />
        </div>
      </section>

      <section className="space-y-3">
        {filtered.map((item) => (
          <article key={item._id} className="glass-card rounded-2xl p-4 shadow-soft">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h3 className="font-display text-lg font-bold">{item.jobRole}</h3>
                <p className="text-sm text-slate-600 dark:text-slate-300">
                  {item.interviewType} • {item.experienceLevel}
                </p>
              </div>

              <div className="text-right text-sm">
                <p className="font-semibold">{item.scores?.overall || 0}%</p>
                <p className="text-slate-500 dark:text-slate-300">{item.status}</p>
              </div>
            </div>

            <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-500 dark:text-slate-300">
              <span>{formatDate(item.createdAt)}</span>
              <span>{formatDuration(item.durationSeconds || 0)}</span>
              <span>{item.questionCount || 0} questions</span>
            </div>

            <div className="mt-3">
              {item.status === "completed" ? (
                <Link
                  to={`/report/${item._id}`}
                  className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-3 py-2 text-sm font-semibold text-white"
                >
                  View Report
                  <ArrowRight size={14} />
                </Link>
              ) : (
                <Link
                  to={`/interview/${item._id}`}
                  className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white/80 px-3 py-2 text-sm font-semibold text-brand-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
                >
                  Continue Interview
                  <ArrowRight size={14} />
                </Link>
              )}
            </div>
          </article>
        ))}

        {filtered.length === 0 ? (
          <p className="text-sm text-slate-600 dark:text-slate-300">No interviews found for this filter.</p>
        ) : null}
      </section>
    </div>
  );
};

export default HistoryPage;
