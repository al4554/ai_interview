const TestimonialCard = ({ quote, name, role }) => {
  return (
    <article className="glass-card rounded-2xl p-5 shadow-soft">
      <p className="text-sm leading-relaxed text-slate-700 dark:text-slate-200">"{quote}"</p>
      <div className="mt-4">
        <p className="font-semibold">{name}</p>
        <p className="text-xs text-slate-500 dark:text-slate-300">{role}</p>
      </div>
    </article>
  );
};

export default TestimonialCard;
