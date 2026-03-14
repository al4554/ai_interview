import { useEffect, useMemo, useState } from "react";

const AnswerTimer = ({ running, duration = 120, onTimeout }) => {
  const [secondsLeft, setSecondsLeft] = useState(duration);

  useEffect(() => {
    if (!running) return undefined;

    setSecondsLeft(duration);

    const interval = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          onTimeout?.();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [running, duration, onTimeout]);

  const percentage = useMemo(() => Math.round((secondsLeft / duration) * 100), [secondsLeft, duration]);

  return (
    <div className="glass-card rounded-xl p-3 text-sm shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-slate-600 dark:text-slate-300">Answer Timer</span>
        <span className="font-semibold">{secondsLeft}s</span>
      </div>
      <div className="mt-2 h-1.5 rounded-full bg-slate-200 dark:bg-slate-700">
        <div className="h-1.5 rounded-full bg-brand-600" style={{ width: `${percentage}%` }} />
      </div>
    </div>
  );
};

export default AnswerTimer;
