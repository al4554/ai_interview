import { Mic, Send, SquareTerminal, StopCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { answerInterviewApi, completeInterviewApi, getInterviewApi } from "../api/interviewApi";
import AnswerTimer from "../components/AnswerTimer";
import ChatBubble from "../components/ChatBubble";
import QuestionCard from "../components/QuestionCard";
import TypingIndicator from "../components/TypingIndicator";

const InterviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const transcriptRef = useRef(null);
  const chatScrollRef = useRef(null);

  const [interview, setInterview] = useState(null);
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [finalizing, setFinalizing] = useState(false);
  const [isListening, setListening] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [meta, setMeta] = useState({ difficulty: "Medium", questionType: "Mixed" });
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInterview = async () => {
      try {
        const data = await getInterviewApi(id);
        setInterview(data);
      } catch (apiError) {
        setError(apiError?.response?.data?.message || "Unable to load interview");
      } finally {
        setLoading(false);
      }
    };

    loadInterview();
  }, [id]);

  useEffect(() => {
    if (!chatScrollRef.current) return;
    chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
  }, [interview?.messages, sending]);

  const messages = useMemo(() => interview?.messages || [], [interview]);

  const onStartVoice = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setError("Voice input is not supported in this browser.");
      return;
    }

    if (transcriptRef.current) {
      transcriptRef.current.stop();
      transcriptRef.current = null;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.continuous = false;

    recognition.onstart = () => setListening(true);
    recognition.onend = () => setListening(false);
    recognition.onerror = () => {
      setListening(false);
      setError("Voice capture failed. Try again.");
    };

    recognition.onresult = (event) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0].transcript)
        .join(" ");

      setAnswer((prev) => `${prev} ${transcript}`.trim());
    };

    transcriptRef.current = recognition;
    recognition.start();
  };

  const onSubmitAnswer = async () => {
    if (!answer.trim() || sending || !interview) return;

    setSending(true);
    setError("");

    try {
      const payload = await answerInterviewApi(id, {
        answer: answer.trim(),
        maxQuestions: 10
      });

      const nextMessages = [
        ...messages,
        { role: "user", content: answer.trim(), feedback: "" },
        { role: "assistant", content: payload.aiMessage, feedback: payload.feedback }
      ];

      setInterview((prev) =>
        prev
          ? {
              ...prev,
              messages: nextMessages,
              questionCount: payload.questionCount,
              status: payload.status,
              scores: payload.scores
            }
          : prev
      );

      setMeta({
        difficulty: payload.difficulty || "Medium",
        questionType: payload.questionType || "Mixed"
      });

      setAnswer("");
      setTimerKey((prev) => prev + 1);

      if (payload.isInterviewComplete) {
        navigate(`/report/${id}`);
      }
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Could not send answer");
    } finally {
      setSending(false);
    }
  };

  const onCompleteInterview = async () => {
    if (!interview || finalizing) return;

    setFinalizing(true);
    setError("");

    try {
      await completeInterviewApi(id);
      navigate(`/report/${id}`);
    } catch (apiError) {
      setError(apiError?.response?.data?.message || "Failed to complete interview");
    } finally {
      setFinalizing(false);
    }
  };

  if (loading) {
    return <p>Loading interview...</p>;
  }

  if (!interview) {
    return <p className="text-sm text-rose-600">{error || "Interview not found."}</p>;
  }

  return (
    <div className="mx-auto grid w-full max-w-6xl gap-4 xl:grid-cols-[1fr_320px]">
      <section className="min-h-[75vh] rounded-2xl">
        <QuestionCard
          questionCount={interview.questionCount || 1}
          difficulty={meta.difficulty}
          questionType={meta.questionType}
        />

        <div
          ref={chatScrollRef}
          className="glass-card scrollbar-thin flex h-[58vh] flex-col gap-4 overflow-y-auto rounded-2xl p-4 shadow-soft"
        >
          {messages.map((message, index) => (
            <ChatBubble key={`${message.role}-${index}`} role={message.role} content={message.content} feedback={message.feedback} />
          ))}

          {sending ? <TypingIndicator /> : null}
        </div>

        <div className="mt-4 space-y-3">
          {error ? (
            <p className="rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-700 dark:border-rose-700/40 dark:bg-rose-900/20 dark:text-rose-200">
              {error}
            </p>
          ) : null}

          <textarea
            rows={4}
            value={answer}
            onChange={(event) => setAnswer(event.target.value)}
            placeholder="Write your answer with clear structure and examples..."
            className="w-full rounded-2xl border border-brand-200 bg-white/90 px-4 py-3 text-sm outline-none ring-brand-300 transition focus:ring dark:border-slate-700 dark:bg-slate-900/80"
          />

          <div className="flex flex-wrap items-center gap-2">
            <button
              type="button"
              onClick={onSubmitAnswer}
              disabled={sending || !answer.trim()}
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <Send size={16} />
              Send Answer
            </button>

            <button
              type="button"
              onClick={onStartVoice}
              className="inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white/80 px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-white dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
            >
              <Mic size={16} />
              {isListening ? "Listening..." : "Voice Input"}
            </button>

            <button
              type="button"
              onClick={onCompleteInterview}
              disabled={finalizing}
              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-100 dark:border-rose-700/40 dark:bg-rose-900/20 dark:text-rose-200"
            >
              <StopCircle size={16} />
              {finalizing ? "Finishing..." : "End Interview"}
            </button>
          </div>
        </div>
      </section>

      <section className="space-y-4">
        <AnswerTimer key={timerKey} running duration={120} onTimeout={() => setError("Timer ended. Submit your answer.")} />

        <div className="glass-card rounded-2xl p-4 shadow-soft">
          <h3 className="font-display text-lg font-bold">Session Context</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-600 dark:text-slate-300">
            <p>
              Role: <span className="font-semibold text-slate-800 dark:text-slate-100">{interview.jobRole}</span>
            </p>
            <p>
              Type: <span className="font-semibold text-slate-800 dark:text-slate-100">{interview.interviewType}</span>
            </p>
            <p>
              Experience: <span className="font-semibold text-slate-800 dark:text-slate-100">{interview.experienceLevel}</span>
            </p>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-4 shadow-soft">
          <h3 className="font-display text-lg font-bold">Coding Mode Tip</h3>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
            For coding rounds, answer using complexity trade-offs, edge cases, and clean pseudocode steps.
          </p>
          <button
            type="button"
            className="mt-3 inline-flex items-center gap-2 rounded-xl border border-brand-200 bg-white/80 px-3 py-2 text-sm font-semibold text-brand-700 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          >
            <SquareTerminal size={14} />
            Coding Practice Active
          </button>
        </div>
      </section>
    </div>
  );
};

export default InterviewPage;
