import React, { useEffect, useState, useCallback } from "react";
import { useAgency } from "../context/AgencyContext";
import { Notification, Reservation, NotificationStatus } from "../types";
import { Bell, CalendarCheck, CheckCircle, Clock } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import SimulationPanel from "../components/SimulationPanel";

const DashboardPage: React.FC = () => {
  const { service } = useAgency();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState({
    totalNotifs: 0,
    pendingNotifs: 0,
    totalReservations: 0,
    recentActivity: [] as string[],
  });
  const [chartData, setChartData] = useState<any[]>([]);
  const [pieData, setPieData] = useState<any[]>([]);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      console.log("🔄 Chargement des données...");

      const [notifs, res] = await Promise.all([
        service.getNotifications(),
        service.getReservations(),
      ]);

      console.log("✅ Notifications reçues:", notifs);
      console.log("✅ Réservations reçues:", res);

      const pending = notifs.filter(
        (n) => n.status === NotificationStatus.RECEIVED,
      ).length;

      setStats({
        totalNotifs: notifs.length,
        pendingNotifs: pending,
        totalReservations: res.length,
        recentActivity: notifs
          .slice(0, 5)
          .map((n) => `Notification ${n.id} received`),
      });

      // Prepare Chart Data (Reservations by Type)
      const typeCounts = res.reduce(
        (acc, curr) => {
          acc[curr.typeVoyage] = (acc[curr.typeVoyage] || 0) + 1;
          return acc;
        },
        {} as Record<string, number>,
      );

      const pData = Object.keys(typeCounts).map((key) => ({
        name: key,
        value: typeCounts[key],
      }));
      setPieData(pData);

      // Simple Activity Mock Chart
      setChartData([
        { name: "Mon", notifs: 0, bookings: 2 },
        { name: "Tue", notifs: 3, bookings: 1 },
        { name: "Wed", notifs: 8, bookings: 5 },
        {
          name: "Thu",
          notifs: notifs.length > 5 ? 6 : notifs.length,
          bookings: res.length > 3 ? 4 : res.length,
        },
        { name: "Fri", notifs: 2, bookings: 1 },
        { name: "Sat", notifs: 2, bookings: 1 },
        { name: "Sun", notifs: 3, bookings: 1 },
      ]);

      setLoading(false);
    } catch (err) {
      console.error("❌ Dashboard load failed:", err);
      setError(
        err instanceof Error ? err.message : "Erreur de chargement des données",
      );
      setLoading(false);

      // Initialiser avec des valeurs par défaut en cas d'erreur
      setStats({
        totalNotifs: 0,
        pendingNotifs: 0,
        totalReservations: 0,
        recentActivity: [],
      });
    }
  }, [service]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // Colors for Pie Chart
  const COLORS = ["#3b82f6", "#10b981", "#f59e0b"];

  return (
    <div className="space-y-6">
      <SimulationPanel onDataChanged={loadData} />

      {/* État de chargement */}
      {loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-blue-800">
          🔄 Chargement des données...
        </div>
      )}

      {/* Erreur */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-800">
          <div className="font-semibold">❌ Erreur de chargement</div>
          <div className="text-sm mt-1">{error}</div>
          <button
            onClick={loadData}
            className="mt-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 text-sm"
          >
            Réessayer
          </button>
        </div>
      )}

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Notifications"
          value={stats.totalNotifs}
          icon={<Bell className="text-amber-500" />}
          trend={stats.totalNotifs > 0 ? "Action Required" : "All Clear"}
          trendColor={
            stats.totalNotifs > 0 ? "text-amber-600" : "text-emerald-600"
          }
        />
        <StatCard
          title="Pending Notifications"
          value={stats.pendingNotifs}
          icon={<Bell className="text-amber-500" />}
          trend={stats.pendingNotifs > 0 ? "Action Required" : "All Clear"}
          trendColor={
            stats.pendingNotifs > 0 ? "text-amber-600" : "text-emerald-600"
          }
        />
        <StatCard
          title="Total Reservations"
          value={stats.totalReservations}
          icon={<CalendarCheck className="text-blue-500" />}
          trend="+12% vs last week"
          trendColor="text-blue-600"
        />
        <StatCard
          title="Processed"
          value={stats.totalNotifs - stats.pendingNotifs}
          icon={<CheckCircle className="text-emerald-500" />}
          trend="Automated"
          trendColor="text-slate-500"
        />
      </div>

      {/* Charts Section */}
      {!loading && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Activity Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Weekly Activity
            </h3>
            <ResponsiveContainer width="100%" height={256}>
              <BarChart data={chartData}>
                <CartesianGrid
                  strokeDasharray="3 3"
                  vertical={false}
                  stroke="#e2e8f0"
                />
                <XAxis
                  dataKey="name"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b" }}
                />
                <YAxis
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: "#64748b" }}
                />
                <Tooltip
                  contentStyle={{
                    borderRadius: "8px",
                    border: "none",
                    boxShadow: "0 4px 6px -1px rgb(0 0 0 / 0.1)",
                  }}
                  cursor={{ fill: "#f1f5f9" }}
                />
                <Bar
                  dataKey="notifs"
                  name="Notifications"
                  fill="#94a3b8"
                  radius={[4, 4, 0, 0]}
                />
                <Bar
                  dataKey="bookings"
                  name="Bookings"
                  fill="#3b82f6"
                  radius={[4, 4, 0, 0]}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Breakdown Chart */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
            <h3 className="text-lg font-bold text-slate-800 mb-4">
              Bookings by Type
            </h3>
            {pieData.length > 0 ? (
              <>
                <ResponsiveContainer width="100%" height={256}>
                  <PieChart>
                    <Pie
                      data={pieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      fill="#8884d8"
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="flex justify-center gap-4 mt-2">
                  {pieData.map((entry, index) => (
                    <div
                      key={index}
                      className="flex items-center gap-2 text-sm text-slate-600"
                    >
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></div>
                      <span>{entry.name}</span>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <div className="h-64 flex items-center justify-center text-slate-400 text-sm">
                No data available
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// Simple Stat Card Component
const StatCard = ({ title, value, icon, trend, trendColor }: any) => (
  <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
    <div className="flex justify-between items-start mb-4">
      <div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-800 mt-1">{value}</h3>
      </div>
      <div className="p-3 bg-slate-50 rounded-lg">{icon}</div>
    </div>
    <p className={`text-xs font-medium ${trendColor}`}>{trend}</p>
  </div>
);

export default DashboardPage;
