import clsx from "clsx";

const ChatBubble = ({ role, content, feedback }) => {
  const isUser = role === "user";

  return (
    <div className={clsx("flex", isUser ? "justify-end" : "justify-start")}>
      <div
        className={clsx("max-w-[90%] rounded-2xl p-4 text-sm shadow-soft md:max-w-[75%]", {
          "bg-brand-600 text-white": isUser,
          "glass-card text-slate-700 dark:text-slate-100": !isUser
        })}
      >
        <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        {!isUser && feedback ? (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-800 dark:border-amber-600/40 dark:bg-amber-900/20 dark:text-amber-200">
            Feedback: {feedback}
          </p>
        ) : null}
      </div>
    </div>
  );
};

export default ChatBubble;
