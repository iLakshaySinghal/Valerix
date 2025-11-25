// src/pages/Admin/Metrics.jsx
import { useEffect, useState } from "react";
import { adminGetDashboard } from "../../api/admin";

function MetricCard({ label, value }) {
  return (
    <div className="rounded-2xl bg-black/70 border border-cyan-500/40 p-4 shadow-[0_0_18px_rgba(34,211,238,0.35)]">
      <div className="text-[11px] uppercase tracking-[0.16em] text-slate-400">
        {label}
      </div>
      <div className="mt-2 text-xl md:text-2xl font-semibold text-cyan-300">
        {value}
      </div>
    </div>
  );
}

export default function AdminMetrics() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const res = await adminGetDashboard();
        setData(res.data || {});
      } catch (err) {
        console.error(err);
        alert("Failed to load metrics");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="h-24 rounded-2xl bg-slate-900/80 animate-pulse"
          />
        ))}
      </div>
    );
  }

  const inv = data.inventory || {};
  const sales = data.sales || {};
  const traffic = data.traffic || {};

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-lg md:text-xl font-semibold text-white">
          Metrics
        </h2>
        <p className="text-xs text-slate-400">
          Deep dive into inventory, sales & traffic.
        </p>
      </div>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-cyan-300 uppercase tracking-[0.16em]">
          Inventory
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard label="Total SKUs" value={inv.totalSKUs ?? "—"} />
          <MetricCard label="Out of stock" value={inv.outOfStock ?? "—"} />
          <MetricCard label="Low stock" value={inv.lowStock ?? "—"} />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-cyan-300 uppercase tracking-[0.16em]">
          Sales
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Total revenue"
            value={
              sales.totalRevenue != null
                ? `₹${sales.totalRevenue}`
                : "—"
            }
          />
          <MetricCard
            label="Orders"
            value={sales.totalOrders ?? "—"}
          />
          <MetricCard
            label="Avg order value"
            value={
              sales.avgOrderValue != null
                ? `₹${sales.avgOrderValue}`
                : "—"
            }
          />
        </div>
      </section>

      <section className="space-y-3">
        <h3 className="text-xs font-semibold text-cyan-300 uppercase tracking-[0.16em]">
          Traffic
        </h3>
        <div className="grid gap-4 md:grid-cols-3">
          <MetricCard
            label="Page views"
            value={traffic.pageViews ?? 0}
          />
          <MetricCard
            label="Unique visitors"
            value={traffic.uniqueVisitors ?? 0}
          />
          <MetricCard
            label="Avg session (s)"
            value={traffic.avgSessionDuration ?? 0}
          />
        </div>
      </section>
    </div>
  );
}
