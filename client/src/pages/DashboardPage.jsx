import { motion } from "framer-motion";
import { ArrowUpRight, BotMessageSquare, Clock3, Trophy } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import ProgressChart from "../components/ProgressChart";
import ScoreCard from "../components/ScoreCard";
import { getInterviewHistoryApi } from "../api/interviewApi";
import { formatDate } from "../utils/formatters";

const DashboardPage = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getInterviewHistoryApi();
        setHistory(data);
      } catch (error) {
        setHistory([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const stats = useMemo(() => {
    const total = history.length;
    const completed = history.filter((item) => item.status === "completed");

    const avgOverall =
      completed.length > 0
        ? Math.round(completed.reduce((sum, item) => sum + (item.scores?.overall || 0), 0) / completed.length)
        : 0;

    return {
      total,
      completed: completed.length,
      avgOverall
    };
  }, [history]);

  const chartData = useMemo(() => {
    return history
      .slice(0, 6)
      .reverse()
      .map((item, index) => ({
        name: `#${index + 1}`,
        overall: item.scores?.overall || 0,
        technical: item.scores?.technical || 0
      }));
  }, [history]);

  return (
    <div className="space-y-5">
      <motion.section
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card rounded-2xl p-5 shadow-card"
      >
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-300">Your preparation cockpit</p>
            <h2 className="section-title text-2xl font-bold">Interview Performance Dashboard</h2>
          </div>
          <Link
            to="/setup"
            className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
          >
            Start New Interview
            <ArrowUpRight size={16} />
          </Link>
        </div>
      </motion.section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ScoreCard title="Average Score" value={stats.avgOverall} accent="brand" />
        <ScoreCard title="Completed Interviews" value={stats.completed * 10} accent="emerald" />
        <ScoreCard title="Total Interviews" value={stats.total * 10} accent="amber" />
        <ScoreCard title="Consistency" value={Math.min(100, stats.completed * 12)} accent="rose" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.35fr_0.65fr]">
        <ProgressChart data={chartData} />

        <div className="glass-card rounded-2xl p-4 shadow-soft">
          <h3 className="font-display text-lg font-bold">Recent Sessions</h3>
          {loading ? <p className="mt-4 text-sm">Loading...</p> : null}
          {!loading && history.length === 0 ? (
            <p className="mt-4 text-sm text-slate-600 dark:text-slate-300">No interviews yet. Start your first one.</p>
          ) : null}

          <div className="mt-4 space-y-3">
            {history.slice(0, 4).map((item) => (
              <article
                key={item._id}
                className="rounded-xl border border-brand-100 bg-white/70 p-3 dark:border-slate-700 dark:bg-slate-900/70"
              >
                <p className="font-semibold">{item.jobRole}</p>
                <p className="text-xs text-slate-500 dark:text-slate-300">{item.interviewType}</p>
                <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-300">
                  <span className="inline-flex items-center gap-1">
                    <Trophy size={12} />
                    {item.scores?.overall || 0}%
                  </span>
                  <span className="inline-flex items-center gap-1">
                    <Clock3 size={12} />
                    {formatDate(item.createdAt)}
                  </span>
                </div>
              </article>
            ))}
          </div>

          <Link
            to="/history"
            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 dark:text-brand-300"
          >
            <BotMessageSquare size={16} />
            View full history
          </Link>
        </div>
      </section>
    </div>
  );
};

export default DashboardPage;
