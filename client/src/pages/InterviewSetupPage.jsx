import { BriefcaseBusiness, LoaderCircle, Upload } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { startInterviewApi, uploadResumeApi } from "../api/interviewApi";

const roleOptions = ["Frontend Developer", "Backend Developer", "Full Stack Engineer", "Data Engineer", "DevOps Engineer"];
const levelOptions = ["Intern", "Junior", "Mid", "Senior", "Lead"];
const interviewTypeOptions = ["Technical", "Behavioral", "System Design", "Mixed"];

const InterviewSetupPage = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    jobRole: "Full Stack Engineer",
    experienceLevel: "Mid",
    interviewType: "Mixed",
    resumeText: ""
  });
  const [uploadingResume, setUploadingResume] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const onResumeUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploadingResume(true);
    setError("");

    try {
      const result = await uploadResumeApi(file);
      setForm((prev) => ({ ...prev, resumeText: result.resumeText }));
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to upload resume");
    } finally {
      setUploadingResume(false);
    }
  };

  const onSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      const data = await startInterviewApi(form);
      navigate(`/interview/${data.interview._id}`);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to start interview");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl">
      <form onSubmit={onSubmit} className="glass-card rounded-2xl p-6 shadow-card">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-brand-600 text-white">
            <BriefcaseBusiness size={20} />
          </div>
          <div>
            <h2 className="section-title text-2xl font-bold">Interview Setup</h2>
            <p className="text-sm text-slate-600 dark:text-slate-300">Configure your next AI interview session.</p>
          </div>
        </div>

        {error ? (
          <p className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-700/40 dark:bg-rose-900/20 dark:text-rose-200">
            {error}
          </p>
        ) : null}

        <div className="mt-6 grid gap-4 md:grid-cols-2">
          <label className="text-sm font-semibold">
            Job Role
            <select
              value={form.jobRole}
              onChange={(event) => setForm((prev) => ({ ...prev, jobRole: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-brand-200 bg-white/90 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/80"
            >
              {roleOptions.map((role) => (
                <option key={role} value={role}>
                  {role}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-semibold">
            Experience Level
            <select
              value={form.experienceLevel}
              onChange={(event) => setForm((prev) => ({ ...prev, experienceLevel: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-brand-200 bg-white/90 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/80"
            >
              {levelOptions.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm font-semibold md:col-span-2">
            Interview Type
            <div className="mt-2 grid gap-2 sm:grid-cols-2 md:grid-cols-4">
              {interviewTypeOptions.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, interviewType: type }))}
                  className={`rounded-xl border px-3 py-2 text-sm transition ${
                    form.interviewType === type
                      ? "border-brand-600 bg-brand-600 text-white"
                      : "border-brand-200 bg-white/70 text-slate-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-200"
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </label>

          <label className="text-sm font-semibold md:col-span-2">
            Resume Text (optional)
            <textarea
              rows={5}
              value={form.resumeText}
              onChange={(event) => setForm((prev) => ({ ...prev, resumeText: event.target.value }))}
              className="mt-1 w-full rounded-xl border border-brand-200 bg-white/90 px-3 py-2 dark:border-slate-700 dark:bg-slate-900/80"
              placeholder="Paste resume highlights or upload a text resume"
            />
            <label className="mt-2 inline-flex cursor-pointer items-center gap-2 rounded-xl border border-brand-200 bg-white/80 px-3 py-2 text-sm font-semibold text-brand-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100">
              <Upload size={15} />
              {uploadingResume ? "Uploading..." : "Upload Resume File"}
              <input type="file" accept=".txt,.md,.json,.rtf,.doc,.docx,.pdf" className="hidden" onChange={onResumeUpload} />
            </label>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-600 px-4 py-3 font-semibold text-white transition hover:bg-brand-700 disabled:opacity-70"
        >
          {loading ? <LoaderCircle size={16} className="animate-spin" /> : null}
          {loading ? "Starting Interview..." : "Start Mock Interview"}
        </button>
      </form>
    </div>
  );
};

export default InterviewSetupPage;
