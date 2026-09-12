'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import { ChartCard, SimpleAreaChart } from "@/components/dashboard/DashboardCharts";
import {
  ShoppingCart,
  Package,
  CheckCircle,
  XCircle,
  Wallet,
  ArrowRight,
  Eye,
  Clock,
  RefreshCw,
  AlertCircle,
} from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import {
  fetchCustomerDashboard,
  type CustomerDashboardData,
  type RecentOrder,
} from "@/lib/api/customer";
import { useRouter } from "next/navigation";

// ── Status badge (local, handles backend status strings) ──────────────
const OrderStatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  const styles: Record<string, string> = {
    "order placed":  "bg-blue-50   text-blue-700   border-blue-200",
    processing:      "bg-blue-50   text-blue-700   border-blue-200",
    "on hold":       "bg-amber-50  text-amber-700  border-amber-200",
    shipped:         "bg-indigo-50 text-indigo-700 border-indigo-200",
    completed:       "bg-emerald-50 text-emerald-700 border-emerald-200",
    cancelled:       "bg-red-50    text-red-700    border-red-200",
    returned:        "bg-gray-50   text-gray-600   border-gray-200",
    "pending return":"bg-amber-50  text-amber-700  border-amber-200",
  };
  const dotStyles: Record<string, string> = {
    "order placed":  "bg-blue-500",
    processing:      "bg-blue-500",
    "on hold":       "bg-amber-500",
    shipped:         "bg-indigo-500",
    completed:       "bg-emerald-500",
    cancelled:       "bg-red-500",
    returned:        "bg-gray-400",
    "pending return":"bg-amber-500",
  };
  const cls    = styles[s]    ?? "bg-gray-50 text-gray-600 border-gray-200";
  const dotCls = dotStyles[s] ?? "bg-gray-400";

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${cls}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${dotCls}`} />
      {status}
    </span>
  );
};

// ── Skeleton loaders ──────────────────────────────────────────────────
const SkeletonCard = () => (
  <div className="bg-white rounded-2xl border border-gray-100 p-5 animate-pulse">
    <div className="flex items-start justify-between">
      <div className="flex-1 space-y-2">
        <div className="h-3 bg-gray-200 rounded w-24" />
        <div className="h-7 bg-gray-200 rounded w-16" />
        <div className="h-3 bg-gray-200 rounded w-20" />
      </div>
      <div className="w-12 h-12 bg-gray-200 rounded-xl" />
    </div>
  </div>
);

const SkeletonRow = () => (
  <tr className="animate-pulse">
    {[1, 2, 3, 4, 5, 6].map((i) => (
      <td key={i} className="py-3.5 px-4">
        <div className="h-4 bg-gray-100 rounded w-full" />
      </td>
    ))}
  </tr>
);

// ── Main Component ────────────────────────────────────────────────────
export default function CustomerDashboard() {
  const { user, token, isLoading } = useAuth();
  const router = useRouter();

  const [data, setData]       = useState<CustomerDashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  const loadDashboard = async () => {
    if (!token) {
        setLoading(false);
        return;
    }
    setLoading(true);
    setError(null);
    try {
      const res = await fetchCustomerDashboard(token);
      setData(res.data);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // isLoading = true means auth cookies are still being read
    // wait until auth is fully hydrated before acting
    if (isLoading) return;

    if (token) {
      loadDashboard();
    } else {
      // No token after auth fully loaded → redirect to login
      router.replace('/login');
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, isLoading]);

  const stats = data?.stats;
  const monthlyChart = data?.monthly_chart ?? [];
  const recentOrders: RecentOrder[] = data?.recent_orders ?? [];

  // Format BDT currency
  const formatBDT = (amount: number) =>
    "৳" + amount.toLocaleString("en-BD", { minimumFractionDigits: 0, maximumFractionDigits: 0 });

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Welcome back, {user?.name?.split(" ")[0] ?? "there"}! 👋
          </h1>
          <p className="text-gray-500 mt-1 text-sm">
            Here's what's happening with your orders today.
          </p>
        </div>
        <button
          onClick={loadDashboard}
          disabled={loading}
          title="Refresh"
          className="p-2 rounded-xl border border-gray-200 hover:bg-gray-50 transition-colors disabled:opacity-50"
        >
          <RefreshCw size={16} className={`text-gray-500 ${loading ? "animate-spin" : ""}`} />
        </button>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-5 flex items-center gap-3 bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-xl">
          <AlertCircle size={16} className="shrink-0" />
          <span>{error}</span>
          <button
            onClick={loadDashboard}
            className="ml-auto text-red-600 font-semibold hover:underline text-xs"
          >
            Retry
          </button>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {loading ? (
          <>
            <SkeletonCard /><SkeletonCard /><SkeletonCard /><SkeletonCard />
          </>
        ) : (
          <>
            <StatCard
              title="Total Orders"
              value={stats?.total_orders ?? 0}
              change={`+${stats?.this_month_orders ?? 0} this month`}
              changeType={stats?.this_month_orders ? "positive" : "neutral"}
              icon={ShoppingCart}
              iconColor="text-primary"
              iconBg="bg-primary/10"
            />
            <StatCard
              title="Active Orders"
              value={stats?.active_orders ?? 0}
              change={stats?.active_orders ? "In progress" : "All clear"}
              changeType={stats?.active_orders ? "neutral" : "positive"}
              icon={Package}
              iconColor="text-blue-600"
              iconBg="bg-blue-50"
            />
            <StatCard
              title="Completed"
              value={stats?.completed_orders ?? 0}
              change={stats?.cancelled_orders ? `${stats.cancelled_orders} cancelled` : "No cancellations"}
              changeType={stats?.cancelled_orders ? "negative" : "positive"}
              icon={CheckCircle}
              iconColor="text-emerald-600"
              iconBg="bg-emerald-50"
            />
            <StatCard
              title="Total Spent"
              value={formatBDT(stats?.total_spent ?? 0)}
              change="All time"
              changeType="neutral"
              icon={Wallet}
              iconColor="text-violet-600"
              iconBg="bg-violet-50"
            />
          </>
        )}
      </div>

      {/* Chart Row */}
      <div className="mb-6">
        <ChartCard
          title="Monthly Spending"
          subtitle="Your spending over the last 12 months"
        >
          {loading ? (
            <div className="h-[240px] flex items-center justify-center animate-pulse">
              <div className="w-full h-full bg-gray-100 rounded-xl" />
            </div>
          ) : monthlyChart.length > 0 ? (
            <SimpleAreaChart data={monthlyChart} color="#0d7a3f" height={240} />
          ) : (
            <div className="h-[240px] flex flex-col items-center justify-center gap-2 text-gray-400">
              <ShoppingCart size={36} className="opacity-30" />
              <p className="text-sm">No spending data yet</p>
            </div>
          )}
        </ChartCard>
      </div>

      {/* Recent Orders */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-900">Recent Orders</h3>
          <Link
            href="/dashboard/customer/orders"
            className="text-xs text-primary font-medium hover:underline flex items-center gap-1"
          >
            View All <ArrowRight size={12} />
          </Link>
        </div>

        {/* Desktop Table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {["Order No", "Date", "Items", "Payment", "Total", "Status", ""].map((h) => (
                  <th
                    key={h}
                    className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3 px-3"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {loading ? (
                <><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /><SkeletonRow /></>
              ) : recentOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-sm text-gray-400">
                    <ShoppingCart size={36} className="mx-auto mb-2 opacity-30" />
                    No orders yet
                  </td>
                </tr>
              ) : (
                recentOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-3 px-3 text-sm font-semibold text-primary">
                      {order.order_no}
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-500">
                      {order.date}
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-700 max-w-[200px] truncate">
                      {order.items_summary}
                    </td>
                    <td className="py-3 px-3 text-sm text-gray-500">
                      {order.payment_type}
                    </td>
                    <td className="py-3 px-3 text-sm font-semibold text-gray-900">
                      {formatBDT(order.total_amount)}
                    </td>
                    <td className="py-3 px-3">
                      <OrderStatusBadge status={order.status} />
                    </td>
                    <td className="py-3 px-3 text-right">
                      <Link
                        href={`/dashboard/customer/orders/${order.id}`}
                        className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors inline-flex"
                        title="View Order"
                      >
                        <Eye size={15} className="text-gray-400" />
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Mobile Cards */}
        <div className="md:hidden space-y-3">
          {loading ? (
            [1, 2, 3].map((i) => (
              <div key={i} className="p-4 rounded-xl bg-gray-50 animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-24" />
                <div className="h-3 bg-gray-200 rounded w-full" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))
          ) : recentOrders.length === 0 ? (
            <div className="py-10 text-center text-sm text-gray-400">
              <ShoppingCart size={36} className="mx-auto mb-2 opacity-30" />
              No orders yet
            </div>
          ) : (
            recentOrders.map((order) => (
              <Link
                key={order.id}
                href={`/dashboard/customer/orders/${order.id}`}
                className="block p-4 rounded-xl bg-gray-50 hover:bg-gray-100 transition-colors space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-primary">{order.order_no}</span>
                  <OrderStatusBadge status={order.status} />
                </div>
                <p className="text-sm text-gray-600 truncate">{order.items_summary}</p>
                <div className="flex items-center justify-between pt-1 border-t border-gray-200">
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <Clock size={11} /> {order.date}
                  </span>
                  <span className="text-sm font-bold text-gray-900">
                    {formatBDT(order.total_amount)}
                  </span>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>
    </>
  );
}
