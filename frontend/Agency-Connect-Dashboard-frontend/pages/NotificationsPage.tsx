import React, { useEffect, useState, useCallback } from "react";
import { useAgency } from "../context/AgencyContext";
import { Notification, NotificationStatus } from "../types";
import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Code,
  AlertCircle,
} from "lucide-react";
import SimulationPanel from "../components/SimulationPanel";

const NotificationsPage: React.FC = () => {
  const { service } = useAgency();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchNotifications = useCallback(async () => {
    try {
      console.log("🔄 Fetching notifications...");
      setLoading(true);
      setError(null);

      const data = await service.getNotifications();

      console.log("✅ Notifications fetched:", data);
      setNotifications(data);
    } catch (error) {
      console.error("❌ Error fetching notifications:", error);

      const errorMessage =
        error instanceof Error ? error.message : "Unknown error occurred";

      setError(`Failed to load notifications: ${errorMessage}`);
    } finally {
      setLoading(false);
    }
  }, [service]);

  useEffect(() => {
    fetchNotifications();
  }, [fetchNotifications]);

  const handleProcess = async (id: string) => {
    console.log("🔄 Starting to process notification:", id);
    setProcessingId(id);
    setError(null);

    try {
      console.log("📤 Calling service.processNotification...");
      await service.processNotification(id);

      console.log("✅ Notification processed successfully");

      // Refresh list
      console.log("🔄 Refreshing notifications list...");
      await fetchNotifications();

      console.log("✅ Process completed successfully");
    } catch (error) {
      console.error("❌ Error processing notification:", error);

      // Extraire le message d'erreur détaillé
      let errorMessage = "Failed to process notification";

      if (error instanceof Error) {
        errorMessage = error.message;
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }

      // Si c'est une erreur fetch avec une réponse
      if (error instanceof Response) {
        try {
          const errorData = await error.json();
          console.error("Server error response:", errorData);
          errorMessage = errorData.error || errorData.message || errorMessage;
        } catch (e) {
          console.error("Could not parse error response");
        }
      }

      // Afficher l'erreur à l'utilisateur
      setError(errorMessage);
      alert(`❌ Error: ${errorMessage}`);
    } finally {
      console.log("🏁 Processing finished");
      setProcessingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">
            Incoming Webhooks
          </h2>
          <p className="text-slate-500">
            Raw event stream from external providers.
          </p>
        </div>
        <button
          onClick={fetchNotifications}
          disabled={loading}
          className="px-4 py-2 bg-white border border-slate-300 rounded-lg text-slate-600 hover:bg-slate-50 transition-colors font-medium text-sm shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Refreshing..." : "Refresh List"}
        </button>
      </div>

      <SimulationPanel onDataChanged={fetchNotifications} />

      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start gap-3">
          <AlertCircle
            className="text-red-600 flex-shrink-0 mt-0.5"
            size={20}
          />
          <div>
            <h3 className="font-semibold text-red-800">Error</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={() => setError(null)}
              className="text-xs text-red-600 hover:text-red-800 mt-2 underline"
            >
              Dismiss
            </button>
          </div>
        </div>
      )}

      {/* Loading State */}
      {loading && notifications.length === 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-12 text-center">
          <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4 animate-pulse">
            <Clock size={32} className="text-slate-400" />
          </div>
          <p className="text-slate-500">Loading notifications...</p>
        </div>
      )}

      {/* Notifications Table */}
      {!loading && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          {notifications.length === 0 ? (
            <div className="p-12 text-center text-slate-500">
              <div className="inline-flex p-4 bg-slate-100 rounded-full mb-4">
                <Clock size={32} className="text-slate-400" />
              </div>
              <p>No notifications received yet.</p>
              <p className="text-sm">
                Use the simulation panel to trigger one.
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-xs uppercase text-slate-500 font-semibold">
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Received At</th>
                    <th className="px-6 py-4">Payload Preview</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {notifications.map((notif) => (
                    <tr
                      key={notif.id}
                      className="hover:bg-slate-50/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        {notif.status === NotificationStatus.RECEIVED ? (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-700">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                            Pending
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-700">
                            <CheckCircle2 size={12} />
                            Processed
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <span className="font-medium text-slate-700">
                          {notif.eventName}
                        </span>
                        <div className="text-xs text-slate-400 font-mono mt-0.5">
                          {notif.id}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(notif.receivedAt).toLocaleString()}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Code size={14} className="text-slate-400" />
                          <span className="truncate max-w-[200px]">
                            {notif.payload.clientNom} -{" "}
                            {notif.payload.destination}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {notif.status === NotificationStatus.RECEIVED && (
                          <button
                            onClick={() => handleProcess(notif.id)}
                            disabled={processingId === notif.id}
                            className={`
                                  inline-flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all
                                  ${
                                    processingId === notif.id
                                      ? "bg-slate-100 text-slate-400 cursor-wait"
                                      : "bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow"
                                  }
                              `}
                          >
                            {processingId === notif.id
                              ? "Processing..."
                              : "Process"}
                            {processingId !== notif.id && (
                              <ArrowRight size={14} />
                            )}
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsPage;
