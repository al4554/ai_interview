import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const ProgressChart = ({ data }) => {
  return (
    <div className="glass-card h-72 rounded-2xl p-4 shadow-soft">
      <h3 className="font-display text-lg font-bold">Progress Trend</h3>
      <div className="mt-4 h-56 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="4 4" strokeOpacity={0.2} />
            <XAxis dataKey="name" tick={{ fill: "#6b7b95", fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fill: "#6b7b95", fontSize: 12 }} />
            <Tooltip />
            <Bar dataKey="overall" fill="#1b80f8" radius={[8, 8, 0, 0]} />
            <Bar dataKey="technical" fill="#34d399" radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ProgressChart;
