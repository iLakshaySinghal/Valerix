// src/pages/Admin/Delivery.jsx
import { useEffect, useState } from "react";
import { adminGetDeliveryTasks } from "../../api/admin";

export default function AdminDelivery() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    try {
      setLoading(true);
      const res = await adminGetDeliveryTasks();
      setTasks(res.data.tasks || res.data || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load delivery tasks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-white">
          Delivery Tasks
        </h2>
        <p className="text-xs text-slate-400">
          Monitor last-mile delivery status.
        </p>
      </div>

      <div className="rounded-2xl bg-black/60 border border-cyan-500/30 overflow-hidden">
        <div className="overflow-x-auto text-xs md:text-sm">
          <table className="w-full border-collapse">
            <thead className="bg-black/80 border-b border-cyan-500/30 text-slate-300">
              <tr className="text-left">
                <th className="px-3 py-2">Order</th>
                <th className="px-3 py-2">Partner</th>
                <th className="px-3 py-2">Status</th>
                <th className="px-3 py-2">Location</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td className="px-3 py-2" colSpan={4}>
                      <div className="h-4 rounded-xl bg-slate-800 animate-pulse" />
                    </td>
                  </tr>
                ))
              ) : !tasks.length ? (
                <tr>
                  <td
                    className="px-3 py-4 text-center text-slate-400"
                    colSpan={4}
                  >
                    No delivery tasks.
                  </td>
                </tr>
              ) : (
                tasks.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b border-slate-800 last:border-0"
                  >
                    <td className="px-3 py-2 text-[11px] text-slate-300">
                      {t.orderId}
                    </td>
                    <td className="px-3 py-2 text-[11px] text-slate-300">
                      {t.partner?.name || t.partnerId || "—"}
                    </td>
                    <td className="px-3 py-2 text-[11px] text-cyan-300">
                      {t.status}
                    </td>
                    <td className="px-3 py-2 text-[11px] text-slate-300">
                      {t.location
                        ? `${t.location.lat}, ${t.location.lng}`
                        : "—"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
