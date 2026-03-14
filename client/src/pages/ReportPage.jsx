import { Download, Sparkles } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { downloadReportApi, getReportApi } from "../api/reportApi";
import ProgressChart from "../components/ProgressChart";
import ScoreCard from "../components/ScoreCard";

const ReportPage = () => {
  const { id } = useParams();
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const data = await getReportApi(id);
        setReport(data);
      } catch (apiError) {
        setError(apiError?.response?.data?.message || "Unable to load report");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const chartData = useMemo(() => {
    if (!report) return [];
    return [
      {
        name: "Current Interview",
        overall: report.scores?.overall || 0,
        technical: report.scores?.technical || 0
      }
    ];
  }, [report]);

  if (loading) {
    return <p>Loading report...</p>;
  }

  if (error || !report) {
    return <p className="text-sm text-rose-600">{error || "Report unavailable"}</p>;
  }

  return (
    <div className="mx-auto w-full max-w-6xl space-y-5">
      <section className="glass-card rounded-2xl p-5 shadow-card">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-600 dark:text-slate-300">Interview completed</p>
            <h2 className="section-title text-2xl font-bold">Feedback Report</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">
              {report.jobRole} • {report.interviewType} • {report.experienceLevel}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => downloadReportApi(id)}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700"
            >
              <Download size={16} />
              Download PDF
            </button>
            <Link
              to="/setup"
              className="rounded-xl border border-brand-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-brand-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
            >
              New Interview
            </Link>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <ScoreCard title="Overall Score" value={report.scores?.overall} accent="brand" />
        <ScoreCard title="Communication" value={report.scores?.communication} accent="emerald" />
        <ScoreCard title="Technical" value={report.scores?.technical} accent="amber" />
        <ScoreCard title="Confidence" value={report.scores?.confidence} accent="rose" />
      </section>

      <section className="grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
        <ProgressChart data={chartData} />

        <div className="glass-card rounded-2xl p-4 shadow-soft">
          <h3 className="font-display text-lg font-bold">Improvement Snapshot</h3>
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="font-semibold text-emerald-700 dark:text-emerald-300">Strengths</p>
              <ul className="mt-1 list-inside list-disc text-slate-600 dark:text-slate-300">
                {(report.summary?.strengths || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-semibold text-rose-700 dark:text-rose-300">Weaknesses</p>
              <ul className="mt-1 list-inside list-disc text-slate-600 dark:text-slate-300">
                {(report.summary?.weaknesses || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>

            <div>
              <p className="font-semibold text-brand-700 dark:text-brand-300">Improvement Tips</p>
              <ul className="mt-1 list-inside list-disc text-slate-600 dark:text-slate-300">
                {(report.summary?.tips || []).map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="glass-card rounded-2xl p-4 shadow-soft">
        <p className="inline-flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
          <Sparkles size={16} />
          Repeat this interview type weekly to increase score consistency.
        </p>
      </section>
    </div>
  );
};

export default ReportPage;
