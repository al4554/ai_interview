import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { getAdminAnalyticsApi, getAdminUsersApi } from "../api/adminApi";
import ScoreCard from "../components/ScoreCard";
import { useAuth } from "../hooks/useAuth";

const AdminPage = () => {
  const { isAdmin } = useAuth();
  const [analytics, setAnalytics] = useState(null);
  const [users, setUsers] = useState([]);

  useEffect(() => {
    if (!isAdmin) return;

    const load = async () => {
      try {
        const [analyticsData, usersData] = await Promise.all([getAdminAnalyticsApi(), getAdminUsersApi()]);
        setAnalytics(analyticsData);
        setUsers(usersData);
      } catch (error) {
        setAnalytics(null);
        setUsers([]);
      }
    };

    load();
  }, [isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <div className="space-y-4">
      <section className="glass-card rounded-2xl p-4 shadow-soft">
        <h2 className="section-title text-2xl font-bold">Admin Analytics</h2>
        <p className="text-sm text-slate-600 dark:text-slate-300">Overview of platform usage and interview quality.</p>
      </section>

      {analytics ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <ScoreCard title="Total Users" value={Math.min(100, analytics.totals.totalUsers)} accent="brand" />
          <ScoreCard title="Active Users" value={Math.min(100, analytics.totals.activeUsers)} accent="emerald" />
          <ScoreCard title="Total Interviews" value={Math.min(100, analytics.totals.totalInterviews)} accent="amber" />
          <ScoreCard title="Avg Overall" value={analytics.averageScores.overall || 0} accent="rose" />
        </section>
      ) : null}

      <section className="glass-card rounded-2xl p-4 shadow-soft">
        <h3 className="font-display text-lg font-bold">Users</h3>
        <div className="mt-4 overflow-x-auto">
          <table className="w-full min-w-[600px] text-left text-sm">
            <thead>
              <tr className="border-b border-brand-100 dark:border-slate-700">
                <th className="px-2 py-2">Name</th>
                <th className="px-2 py-2">Email</th>
                <th className="px-2 py-2">Role</th>
                <th className="px-2 py-2">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id} className="border-b border-brand-50 dark:border-slate-800">
                  <td className="px-2 py-2">{user.name}</td>
                  <td className="px-2 py-2">{user.email}</td>
                  <td className="px-2 py-2">{user.role}</td>
                  <td className="px-2 py-2">{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default AdminPage;
