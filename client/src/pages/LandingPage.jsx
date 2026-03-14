import { motion } from "framer-motion";
import {
  BadgeCheck,
  Bot,
  BrainCircuit,
  ChartColumn,
  ChevronRight,
  MessagesSquare,
  Rocket
} from "lucide-react";
import { Link } from "react-router-dom";
import FeatureCard from "../components/FeatureCard";
import TestimonialCard from "../components/TestimonialCard";
import ThemeToggle from "../components/ThemeToggle";

const features = [
  {
    icon: MessagesSquare,
    title: "Real AI Interviewer",
    description: "Conversational, adaptive interviews that mimic real-world recruiters and hiring panels."
  },
  {
    icon: BrainCircuit,
    title: "Smart Follow-ups",
    description: "The AI adapts difficulty and asks deeper follow-ups based on your latest answer quality."
  },
  {
    icon: ChartColumn,
    title: "Detailed Reports",
    description: "Track overall, communication, technical, and confidence scores with actionable insights."
  },
  {
    icon: BadgeCheck,
    title: "Role-tailored Sessions",
    description: "Practice for technical, behavioral, system design, or mixed rounds per target role."
  }
];

const testimonials = [
  {
    quote:
      "I improved from 62 to 84 in technical rounds in two weeks. The follow-up questions feel incredibly realistic.",
    name: "Aarav Patel",
    role: "Frontend Engineer Candidate"
  },
  {
    quote:
      "The confidence scoring and answer feedback gave me exact areas to improve before onsite interviews.",
    name: "Nisha Rao",
    role: "SDE-2 Candidate"
  },
  {
    quote: "The dashboard gives me coaching-like visibility into my growth. It is better than random mock practice.",
    name: "Rahul Mehta",
    role: "System Design Learner"
  }
];

const LandingPage = () => {
  return (
    <div className="min-h-screen px-4 pb-12 pt-4 md:px-8">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between rounded-2xl border border-white/40 bg-white/40 px-4 py-3 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/40">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white shadow-card">
            <Bot size={20} />
          </div>
          <div>
            <h1 className="font-display text-lg font-bold">InterviewIQ</h1>
            <p className="text-xs text-slate-500 dark:text-slate-300">AI Mock Interview Platform</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            to="/login"
            className="rounded-xl border border-brand-200 bg-white/80 px-4 py-2 text-sm font-semibold text-brand-700 transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
          >
            Login
          </Link>
        </div>
      </header>

      <section className="mx-auto mt-8 grid w-full max-w-6xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <motion.div initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <span className="inline-flex items-center rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.15em] text-brand-700 dark:border-brand-700/40 dark:bg-brand-900/30 dark:text-brand-200">
            Practice Like It Matters
          </span>
          <h2 className="section-title mt-4 text-4xl font-bold leading-tight md:text-5xl">
            Ace Your Next Job Interview with a Realistic AI Interview Coach
          </h2>
          <p className="mt-5 max-w-xl text-base text-slate-600 dark:text-slate-300 md:text-lg">
            Run role-specific mock interviews, get instant answer-level feedback, and improve with data-backed
            reports tailored for technical and behavioral hiring rounds.
          </p>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to="/signup"
              className="inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-3 text-sm font-bold text-white shadow-card transition hover:-translate-y-0.5 hover:bg-brand-700"
            >
              Start Mock Interview
              <ChevronRight size={16} />
            </Link>
            <a
              href="#how-it-works"
              className="rounded-xl border border-brand-200 bg-white/70 px-5 py-3 text-sm font-semibold text-brand-700 transition hover:-translate-y-0.5 dark:border-slate-700 dark:bg-slate-900/70 dark:text-slate-100"
            >
              How It Works
            </a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          className="glass-card animate-floaty rounded-3xl p-5 shadow-card"
        >
          <div className="rounded-2xl bg-gradient-to-br from-brand-600 to-brand-700 p-5 text-white">
            <p className="text-xs uppercase tracking-[0.2em] text-blue-100">Interview Snapshot</p>
            <h3 className="mt-2 font-display text-2xl font-bold">SDE-2 Technical Round</h3>
            <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
              <div className="rounded-xl bg-white/15 p-3">
                <p className="text-blue-100">Overall</p>
                <p className="text-xl font-bold">84%</p>
              </div>
              <div className="rounded-xl bg-white/15 p-3">
                <p className="text-blue-100">Confidence</p>
                <p className="text-xl font-bold">81%</p>
              </div>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-brand-100 bg-white/70 p-4 dark:border-slate-700 dark:bg-slate-900/70">
            <p className="text-sm font-semibold text-slate-700 dark:text-slate-100">AI Feedback</p>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
              Strong architecture explanation. Next, quantify trade-offs and mention failure handling patterns.
            </p>
          </div>
        </motion.div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl">
        <h3 className="section-title text-2xl font-bold md:text-3xl">Features</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-2">
          {features.map((feature, index) => (
            <FeatureCard key={feature.title} {...feature} index={index} />
          ))}
        </div>
      </section>

      <section id="how-it-works" className="mx-auto mt-16 w-full max-w-6xl">
        <h3 className="section-title text-2xl font-bold md:text-3xl">How It Works</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {["Pick role and interview type", "Chat with AI interviewer", "Review scores and tips"].map(
            (item, index) => (
              <article key={item} className="glass-card rounded-2xl p-5 shadow-soft">
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-brand-600 text-sm font-bold text-white">
                  {index + 1}
                </div>
                <p className="mt-3 font-semibold text-slate-800 dark:text-slate-100">{item}</p>
              </article>
            )
          )}
        </div>
      </section>

      <section className="mx-auto mt-16 w-full max-w-6xl">
        <h3 className="section-title text-2xl font-bold md:text-3xl">Testimonials</h3>
        <div className="mt-6 grid gap-4 md:grid-cols-3">
          {testimonials.map((testimonial) => (
            <TestimonialCard key={testimonial.name} {...testimonial} />
          ))}
        </div>
      </section>

      <footer className="mx-auto mt-16 w-full max-w-6xl rounded-2xl border border-white/40 bg-white/40 p-5 text-sm text-slate-600 backdrop-blur-xl dark:border-slate-700/50 dark:bg-slate-900/50 dark:text-slate-300">
        <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} InterviewIQ. Practice better. Interview smarter.</p>
          <div className="flex items-center gap-3">
            <Rocket size={16} />
            <span>Built with React, Node, MongoDB, Groq AI</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
