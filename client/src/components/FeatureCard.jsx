import { motion } from "framer-motion";

const FeatureCard = ({ icon: Icon, title, description, index = 0 }) => {
  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      className="glass-card rounded-2xl p-5 shadow-soft"
    >
      <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl bg-brand-600 text-white">
        <Icon size={18} />
      </div>
      <h3 className="font-display text-lg font-bold">{title}</h3>
      <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{description}</p>
    </motion.article>
  );
};

export default FeatureCard;
