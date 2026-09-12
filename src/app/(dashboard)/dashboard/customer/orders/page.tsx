'use client';

import { useState, useEffect } from "react";
import StatusBadge, { StatusType } from "@/components/dashboard/StatusBadge";
import { Search, Filter, Clock, Eye, Download, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { fetchCustomerOrders, RecentOrder, OrderPagination } from "@/lib/api/customer";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

const statusFilters: { label: string; value: string }[] = [
  { label: "All", value: "all" },
  { label: "Pending", value: "pending" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export default function CustomerOrders() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  const [orders, setOrders] = useState<RecentOrder[]>([]);
  const [pagination, setPagination] = useState<OrderPagination | null>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const loadOrders = async (pageNum: number) => {
    if (!token) {
        setLoading(false);
        return;
    }
    setLoading(true);
    try {
      const res = await fetchCustomerOrders(token, pageNum);
      setOrders(res.data.data);
      setPagination(res.data);
    } catch (err: any) {
      toast.error(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (token) {
        loadOrders(page);
    } else {
        router.replace('/login');
    }
  }, [token, isLoading, page, router]);

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order.order_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items_summary.toLowerCase().includes(searchQuery.toLowerCase());
    const orderStatus = order.status.toLowerCase();
    const matchesFilter = activeFilter === "all" || orderStatus === activeFilter;
    return matchesSearch && matchesFilter;
  });

  return (
    <>
      {/* Page Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Orders</h1>
        <p className="text-gray-500 mt-1">Track and manage all your orders</p>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or item name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {statusFilters.map((filter) => (
              <button
                key={filter.value}
                onClick={() => setActiveFilter(filter.value)}
                className={`px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                  activeFilter === filter.value
                    ? "bg-primary text-white shadow-sm"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {filter.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Orders Table - Desktop */}
      <div className="hidden md:block bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-5">Order ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-5">Date</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-5">Items</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-5">Payment</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-5">Total</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-5">Status</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-5">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
                {loading ? (
                  Array.from({ length: 5 }).map((_, idx) => (
                    <tr key={idx} className="animate-pulse bg-gray-50/30">
                      <td className="py-4 px-5"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                      <td className="py-4 px-5"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                      <td className="py-4 px-5"><div className="h-4 bg-gray-200 rounded w-48"></div></td>
                      <td className="py-4 px-5"><div className="h-4 bg-gray-200 rounded w-24"></div></td>
                      <td className="py-4 px-5"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                      <td className="py-4 px-5"><div className="h-6 bg-gray-200 rounded-full w-24"></div></td>
                      <td className="py-4 px-5 text-right"><div className="h-8 bg-gray-200 rounded-lg w-8 ml-auto"></div></td>
                    </tr>
                  ))
                ) : filteredOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-5 text-sm font-medium text-primary">{order.order_no}</td>
                  <td className="py-3.5 px-5 text-sm text-gray-500">{order.date}</td>
                  <td className="py-3.5 px-5 text-sm text-gray-700">{order.items_summary}</td>
                  <td className="py-3.5 px-5 text-sm text-gray-500">{order.payment_type}</td>
                  <td className="py-3.5 px-5 text-sm font-semibold text-gray-900">৳{Number(order.total_amount).toLocaleString()}</td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={order.status.toLowerCase() as StatusType} />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dashboard/customer/orders/${order.id}`} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="View Details">
                        <Eye size={16} className="text-gray-400" />
                      </Link>
                      <Link href={`/dashboard/customer/orders/${order.id}/invoice`} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Download Invoice">
                        <Download size={16} className="text-gray-400" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Filter size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No orders found matching your criteria</p>
          </div>
        )}

        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex items-center justify-between px-5 py-4 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing page {pagination.current_page} of {pagination.last_page}
            </p>
            <div className="flex items-center gap-1">
              <button 
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 disabled:opacity-50"
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="px-3 py-1.5 rounded-lg bg-primary text-white text-sm font-medium">{page}</span>
              
              <button 
                onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                disabled={page === pagination.last_page}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-400 disabled:opacity-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Orders Cards - Mobile */}
      <div className="md:hidden space-y-3">
        {loading ? (
            Array.from({ length: 3 }).map((_, idx) => (
              <div key={idx} className="block bg-white rounded-2xl border border-gray-100 p-4 space-y-3 animate-pulse">
                <div className="flex items-center justify-between">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                  <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                </div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                  <div className="flex items-center gap-3">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-4 bg-gray-200 rounded w-16"></div>
                  </div>
                  <div className="h-8 bg-gray-200 rounded-lg w-8"></div>
                </div>
              </div>
            ))
          ) : filteredOrders.map((order) => (
          <Link key={order.id} href={`/dashboard/customer/orders/${order.id}`} className="block bg-white rounded-2xl border border-gray-100 p-4 space-y-3 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">{order.order_no}</span>
              <StatusBadge status={order.status.toLowerCase() as StatusType} />
            </div>
            <p className="text-sm text-gray-700">{order.items_summary}</p>
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} /> {order.date}
                </span>
                <span className="text-xs text-gray-400">•</span>
                <span className="text-xs text-gray-500">{order.payment_type}</span>
              </div>
              <span className="text-sm font-bold text-gray-900">৳{Number(order.total_amount).toLocaleString()}</span>
            </div>
          </Link>
        ))}

        {!loading && filteredOrders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Filter size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No orders found</p>
          </div>
        )}
      </div>
    </>
  );
}
