'use client';

import { useState, useEffect, useRef } from "react";
import StatusBadge, { StatusType } from "@/components/dashboard/StatusBadge";
import { Search, Filter, Clock, Eye, Printer, Download, ChevronLeft, ChevronRight, Plus } from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import { fetchWholesalerOrders, WholesalerOrder } from "@/lib/api/wholesaler";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function WholesalerOrders() {
  const { token, isLoading } = useAuth();
  const router = useRouter();
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  
  const [orders, setOrders] = useState<WholesalerOrder[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  const [statusTabs, setStatusTabs] = useState<{id: string, label: string}[]>([
    { id: "all", label: "All" }
  ]);

  const loadOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetchWholesalerOrders(token, { 
          page, 
          status: activeFilter, 
          search: searchQuery 
      });
      setOrders(res.orders?.data || []);
      setPagination(res.orders || null);
      if (res.counts) setCounts(res.counts);
      if (res.statuses) {
          setStatusTabs([{ id: "all", label: "All" }, ...res.statuses]);
      }
    } catch (err: any) {
      toast.error(err.message || "Failed to load orders");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
        router.replace('/login');
        return;
    }
    const delay = setTimeout(() => {
        loadOrders();
    }, 400);
    return () => clearTimeout(delay);
  }, [token, page, activeFilter, searchQuery, isLoading, router]);

  return (
    <>
      {/* Page Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Wholesaler Orders</h1>
          <p className="text-gray-500 mt-1">Manage and track your wholesaler orders</p>
        </div>
        <Link
          href="/dashboard/wholesaler/orders/create"
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/20"
        >
          <Plus size={18} />
          <span>Create Order</span>
        </Link>
      </div>

      {/* Filters & Search */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 flex">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by order ID or customer name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="min-w-[250px] w-full pl-9 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all"
            />
          </div>
          {/* Status Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto pb-1 sm:pb-0">
            {statusTabs.map((tab) => {
              const count = counts[tab.id] || 0;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                      setActiveFilter(tab.id);
                      setPage(1);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                    activeFilter === tab.id
                      ? "bg-primary text-white shadow-sm"
                      : "text-gray-600 hover:bg-gray-100"
                  }`}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className={`px-1.5 py-0.5 rounded-full text-[10px] ${
                      activeFilter === tab.id ? "bg-white/20 text-white" : "bg-gray-200 text-gray-600"
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
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
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-5">Customer</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-5">Total</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-3.5 px-5">Due</th>
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
                      <td className="py-4 px-5"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                      <td className="py-4 px-5"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                      <td className="py-4 px-5"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                      <td className="py-4 px-5"><div className="h-6 bg-gray-200 rounded-full w-24"></div></td>
                      <td className="py-4 px-5 text-right"><div className="h-8 bg-gray-200 rounded-lg w-8 ml-auto"></div></td>
                    </tr>
                  ))
                ) : orders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-3.5 px-5 text-sm font-medium text-primary">{order.order_no}</td>
                  <td className="py-3.5 px-5 text-sm text-gray-500">{order.date}</td>
                  <td className="py-3.5 px-5 text-sm text-gray-700">{order.customer?.name || 'N/A'}</td>
                  <td className="py-3.5 px-5 text-sm font-semibold text-gray-900">৳{Number(order.total_amount).toLocaleString()}</td>
                  <td className="py-3.5 px-5 text-sm font-semibold text-red-500">৳{Number(order.due_amount).toLocaleString()}</td>
                  <td className="py-3.5 px-5">
                    <StatusBadge status={order.status.toLowerCase() as StatusType} />
                  </td>
                  <td className="py-3.5 px-5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Link href={`/dashboard/wholesaler/orders/${order.id}/invoice`} className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors" title="Print Invoice">
                        <Printer size={16} className="text-gray-400" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {!loading && orders.length === 0 && (
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
          ) : orders.map((order) => (
          <Link key={order.id} href={`/dashboard/wholesaler/orders/${order.id}/invoice`} className="block bg-white rounded-2xl border border-gray-100 p-4 space-y-3 hover:shadow-sm transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-primary">{order.order_no}</span>
              <StatusBadge status={order.status.toLowerCase() as StatusType} />
            </div>
            <p className="text-sm text-gray-700">{order.customer?.name || 'N/A'}</p>
            <div className="flex items-center justify-between pt-2 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-xs text-gray-500 flex items-center gap-1">
                  <Clock size={12} /> {order.date}
                </span>
              </div>
              <span className="text-sm font-bold text-gray-900">৳{Number(order.total_amount).toLocaleString()}</span>
            </div>
          </Link>
        ))}

        {!loading && orders.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl border border-gray-100">
            <Filter size={40} className="mx-auto text-gray-300 mb-3" />
            <p className="text-gray-500 text-sm">No orders found</p>
          </div>
        )}
      </div>
    </>
  );
}
