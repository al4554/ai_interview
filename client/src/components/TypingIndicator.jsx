const TypingIndicator = () => {
  return (
    <div className="glass-card inline-flex items-center gap-2 rounded-2xl px-4 py-3">
      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:0ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:150ms]" />
      <span className="h-2 w-2 animate-bounce rounded-full bg-brand-500 [animation-delay:300ms]" />
      <span className="ml-2 text-xs text-slate-500 dark:text-slate-300">AI is thinking...</span>
    </div>
  );
};

export default TypingIndicator;
