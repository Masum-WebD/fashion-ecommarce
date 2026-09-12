'use client';

import { useState, useEffect } from "react";
import { fetchWholesalerOrders, type WholesalerOrder } from "@/lib/api/wholesaler";
import { useAuth } from "@/providers/AuthProvider";
import Link from "next/link";
import { RefreshCw, Plus, FileText, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "all", label: "All Orders", defaultColor: "bg-[#20c997] text-white" },
  { id: "due", label: "Due Orders", defaultColor: "bg-white text-[#dc3545] border border-[#dc3545]" },
  { id: "paid", label: "Paid", defaultColor: "text-gray-500" },
  { id: "return_pending", label: "Return Pending", defaultColor: "text-gray-500" },
  { id: "order_placed", label: "Order Placed", defaultColor: "text-gray-500" },
  { id: "processing", label: "Processing", defaultColor: "text-gray-500" },
  { id: "on_hold", label: "On Hold", defaultColor: "text-gray-500" },
  { id: "cancelled", label: "Cancelled", defaultColor: "text-gray-500" },
  { id: "shipped", label: "Shipped", defaultColor: "text-gray-500" },
  { id: "delivered", label: "Delivered", defaultColor: "text-gray-500" },
  { id: "returned", label: "Returned", defaultColor: "text-gray-500" },
];

const OrderStatusBadge = ({ status }: { status: string }) => {
  const s = status.toLowerCase();
  if (s === 'processing') {
    return <span className="bg-[#ffc107] text-black px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">Processing</span>;
  }
  return (
    <span className="bg-gray-200 text-gray-800 px-2 py-0.5 rounded text-xs font-bold whitespace-nowrap">
      {status}
    </span>
  );
};

export default function WholesalerOrders() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);
  
  // Filters and Pagination State
  const [activeTab, setActiveTab] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [perPage, setPerPage] = useState(25);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalEntries, setTotalEntries] = useState(0);

  const loadOrders = async () => {
    if (!token) return;
    setLoading(true);
    try {
      const res = await fetchWholesalerOrders(token, {
        page: currentPage,
        per_page: perPage,
        status: activeTab,
        search: searchQuery
      });
      setOrders(res.orders.data);
      setTotalPages(res.orders.last_page);
      setTotalEntries(res.orders.total);
      setCounts(res.counts || {});
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  // Load orders when dependencies change
  useEffect(() => {
    if (!token) return;
    const delay = setTimeout(() => {
      loadOrders();
    }, 300);
    return () => clearTimeout(delay);
  }, [searchQuery, activeTab, perPage, currentPage, token]);

  if (!user?.wholesaler_panel_access) {
    return (
      <div className="bg-red-50 text-red-600 p-4 rounded-xl border border-red-200">
        You do not have permission to view the wholesaler panel.
      </div>
    );
  }

  return (
    <div>
      {/* Top Filter Tabs */}
      <div className="flex flex-wrap items-center gap-3 mb-6 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const count = counts[tab.id] || 0;
          
          let tabClass = "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-sm font-medium transition cursor-pointer";
          
          if (isActive) {
            tabClass = cn(tabClass, tab.id === 'due' ? "bg-white text-[#dc3545] border border-[#dc3545]" : "bg-[#20c997] text-white");
          } else {
            tabClass = cn(tabClass, tab.id === 'due' ? "bg-white text-[#dc3545] border border-[#dc3545] opacity-60 hover:opacity-100" : "text-[#20c997] hover:bg-[#20c997]/10");
          }

          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setCurrentPage(1); }}
              className={tabClass}
            >
              {tab.label}
              <span className={cn(
                "px-1.5 py-0.5 rounded text-[10px] font-bold", 
                isActive && tab.id !== 'due' ? "bg-white text-[#20c997]" : "bg-gray-500 text-white"
              )}>
                {count}
              </span>
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col min-h-[500px]">
        {/* Controls Bar */}
        <div className="p-4 flex flex-col sm:flex-row justify-between items-center gap-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-sm text-gray-600">
            Show
            <select
              value={perPage}
              onChange={(e) => { setPerPage(Number(e.target.value)); setCurrentPage(1); }}
              className="border border-gray-300 rounded px-2 py-1 outline-none focus:border-[#20c997]"
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
              <option value={100}>100</option>
            </select>
            entries
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Search:</span>
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border border-gray-300 rounded px-3 py-1 outline-none focus:border-[#20c997] pl-3 pr-8 w-48 sm:w-64"
              />
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto flex-1">
          <table className="w-full text-sm text-left border-collapse min-w-[1200px]">
            <thead className="bg-[#e9f9eb] border-b border-gray-200 text-[#198754]">
              <tr>
                <th className="px-3 py-3 border-r border-gray-200 w-10 text-center">#</th>
                <th className="px-3 py-3 border-r border-gray-200 whitespace-nowrap">Order No.</th>
                <th className="px-3 py-3 border-r border-gray-200">Date</th>
                <th className="px-3 py-3 border-r border-gray-200">Customer</th>
                <th className="px-3 py-3 border-r border-gray-200">Payment</th>
                <th className="px-3 py-3 border-r border-gray-200 text-left whitespace-nowrap">Order Summary</th>
                <th className="px-3 py-3 border-r border-gray-200 text-left whitespace-nowrap">Payment Info</th>
                <th className="px-3 py-3 border-r border-gray-200">Status</th>
                <th className="px-3 py-3 border-r border-gray-200">Courier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="px-3 py-4 border-r border-gray-100"><div className="h-4 bg-gray-200 rounded w-6 mx-auto"></div></td>
                    <td className="px-3 py-4 border-r border-gray-100">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-16"></div>
                    </td>
                    <td className="px-3 py-4 border-r border-gray-100"><div className="h-4 bg-gray-200 rounded w-20"></div></td>
                    <td className="px-3 py-4 border-r border-gray-100">
                      <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-24"></div>
                    </td>
                    <td className="px-3 py-4 border-r border-gray-100"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="px-3 py-4 border-r border-gray-100"><div className="h-12 bg-gray-200 rounded w-full"></div></td>
                    <td className="px-3 py-4 border-r border-gray-100"><div className="h-12 bg-gray-200 rounded w-full"></div></td>
                    <td className="px-3 py-4 border-r border-gray-100"><div className="h-6 bg-gray-200 rounded w-20 mx-auto"></div></td>
                    <td className="px-3 py-4 border-r border-gray-100"><div className="h-4 bg-gray-200 rounded w-16 mx-auto"></div></td>
                  </tr>
                ))
              ) : orders.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-6 py-10 text-center text-gray-400">
                    <FileText className="mx-auto mb-2 opacity-30" size={32} />
                    No orders found
                  </td>
                </tr>
              ) : (
                orders.map((o, idx) => (
                  <tr key={o.id} className="hover:bg-gray-50 transition">
                    <td className="px-3 py-2 border-r border-gray-100 text-center text-gray-500">{(currentPage - 1) * perPage + idx + 1}</td>
                    <td className="px-3 py-2 border-r border-gray-100 font-bold text-gray-800">
                      {o.order_no}
                      <span className="block mt-1 bg-gray-500 text-white text-[10px] px-1 py-0.5 rounded w-max">Wholesale</span>
                    </td>
                    <td className="px-3 py-2 border-r border-gray-100 text-gray-600 whitespace-nowrap">{o.date}</td>
                    <td className="px-3 py-2 border-r border-gray-100 text-gray-800 font-medium">
                      {o.customer?.name || "N/A"} <br/>
                      <span className="text-gray-500 text-xs font-normal">📞 {o.customer?.phone}</span>
                    </td>
                    <td className="px-3 py-2 border-r border-gray-100 font-bold text-gray-800">{o.payment_type}</td>
                    <td className="px-3 py-2 border-r border-gray-100 text-xs text-gray-700 whitespace-nowrap">
                      <div className="flex justify-between gap-4"><span>Sale:</span> <span className="font-bold">৳{parseFloat(o.sale_amount).toFixed(2)}</span></div>
                      <div className="flex justify-between gap-4"><span>Courier:</span> <span className="font-bold">৳{parseFloat(o.courier_charge).toFixed(2)}</span></div>
                      <div className="flex justify-between gap-4 border-t border-gray-100 mt-1 pt-1"><span className="font-bold text-[#198754]">Total:</span> <span className="font-bold text-[#20c997]">৳{parseFloat(o.total_amount).toFixed(2)}</span></div>
                    </td>
                    <td className="px-3 py-2 border-r border-gray-100 text-xs text-gray-700 whitespace-nowrap">
                      <div className="flex justify-between gap-4"><span>Advance:</span> <span className="font-bold text-[#ffc107]">৳{parseFloat(o.advance_amount).toFixed(2)}</span></div>
                      <div className="flex justify-between gap-4"><span>Paid:</span> <span className="font-bold text-[#0d6efd]">৳0.00</span></div>
                      <div className="flex justify-between gap-4 border-t border-gray-100 mt-1 pt-1"><span className="font-bold text-[#dc3545]">Due:</span> <span className="font-bold text-[#dc3545]">৳{parseFloat(o.due_amount).toFixed(2)}</span></div>
                    </td>
                    <td className="px-3 py-2 border-r border-gray-100 text-center"><OrderStatusBadge status={o.status} /></td>
                    <td className="px-3 py-2 border-r border-gray-100 text-center">
                      {o.courier_name ? (
                        <span className="bg-[#17a2b8] text-white px-2 py-0.5 rounded text-xs whitespace-nowrap">{o.courier_name}</span>
                      ) : "-"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Footer */}
        <div className="p-4 border-t border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-600 bg-gray-50">
          <div>
            Showing {orders.length > 0 ? (currentPage - 1) * perPage + 1 : 0} to {Math.min(currentPage * perPage, totalEntries)} of {totalEntries} entries
          </div>
          <div className="flex gap-1">
            <button
              disabled={currentPage === 1}
              onClick={() => setCurrentPage(p => p - 1)}
              className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-600"
            >
              Previous
            </button>
            <button
              className="px-3 py-1 border border-[#0d6efd] bg-[#0d6efd] text-white rounded"
            >
              {currentPage}
            </button>
            <button
              disabled={currentPage >= totalPages}
              onClick={() => setCurrentPage(p => p + 1)}
              className="px-3 py-1 border border-gray-300 rounded bg-white hover:bg-gray-50 disabled:opacity-50 text-gray-600"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
