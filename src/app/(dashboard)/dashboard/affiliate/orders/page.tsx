'use client';

import { useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { format } from "date-fns";
import { Search, Calendar, Filter, ChevronLeft, ChevronRight, PackageOpen, DollarSign, Users, ChevronDown, ChevronUp } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { fetchReferredOrders, ReferredOrder } from "@/lib/api/affiliate";
import { useSearchParams, useRouter } from "next/navigation";

const OrderRow = ({ order }: { order: ReferredOrder }) => {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr className="hover:bg-gray-50/50 transition-colors border-b border-gray-100">
        <td className="py-4 px-4">
          <p className="text-sm font-bold text-gray-900">{order.order_no}</p>
          <p className="text-xs text-gray-500 mt-1">{format(new Date(order.date), "MMM d, yyyy")}</p>
        </td>
        <td className="py-4 px-4 text-sm font-medium text-gray-600">
          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
            order.status === "Delivered" ? "bg-emerald-100 text-emerald-800" :
            order.status === "Cancelled" || order.status === "Returned" ? "bg-red-100 text-red-800" :
            "bg-blue-100 text-blue-800"
          }`}>
            {order.status}
          </span>
        </td>
        <td className="py-4 px-4">
          <p className="text-sm font-medium text-gray-900">৳{order.total_amount.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1">{order.payment_type}</p>
        </td>
        <td className="py-4 px-4">
          <p className="text-sm font-bold text-emerald-600">৳{order.commission_amount.toLocaleString()}</p>
          <p className="text-xs text-gray-500 mt-1 capitalize">{order.commission_status}</p>
        </td>
        <td className="py-4 px-4 text-right">
          <button 
            onClick={() => setExpanded(!expanded)}
            className="text-primary-600 hover:text-primary-800 text-sm font-medium flex items-center justify-end w-full gap-1"
          >
            {expanded ? "Hide Items" : "View Items"}
            {expanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} className="bg-gray-50/80 p-0">
            <div className="px-6 py-4 border-b border-gray-100">
              <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Order Items</h4>
              <div className="space-y-3">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center bg-white p-3 rounded-lg border border-gray-100 shadow-sm">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.product_name}</p>
                      <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity} × ৳{item.price.toLocaleString()}</p>
                    </div>
                    <p className="text-sm font-bold text-gray-900">৳{item.total.toLocaleString()}</p>
                  </div>
                ))}
                
                <div className="mt-4 pt-3 border-t border-gray-200 flex justify-end">
                  <div className="text-right text-sm">
                    <p className="text-gray-500 mb-1">Subtotal: <span className="font-medium text-gray-900 ml-4">৳{order.sale_amount.toLocaleString()}</span></p>
                    <p className="text-gray-500 mb-1">Shipping: <span className="font-medium text-gray-900 ml-4">৳{order.courier_charge.toLocaleString()}</span></p>
                    <p className="text-gray-900 font-bold mt-2 pt-2 border-t border-gray-200">Total: <span className="ml-4 text-primary-600">৳{order.total_amount.toLocaleString()}</span></p>
                  </div>
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
};

const AffiliateOrdersContent = () => {
  const { token } = useAuth();
  const searchParams = useSearchParams();
  const router = useRouter();
  const orderIdQuery = searchParams.get("order_id") || "";

  const [page, setPage] = useState(1);
  const [orderIdFilter, setOrderIdFilter] = useState(orderIdQuery);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  const { data: responseData, isLoading } = useQuery({
    queryKey: ["affiliate-orders", page, orderIdFilter, statusFilter, dateFrom, dateTo],
    queryFn: () => fetchReferredOrders(token!, {
      page,
      order_id: orderIdFilter,
      status: statusFilter,
      date_from: dateFrom,
      date_to: dateTo
    }),
    enabled: !!token,
  });

  const data = responseData?.data;
  const orders = data?.orders.data || [];
  const pagination = data?.orders;
  const summary = data?.summary;

  const handleFilterReset = () => {
    setOrderIdFilter("");
    setStatusFilter("");
    setDateFrom("");
    setDateTo("");
    setPage(1);
    
    // Clear URL params if there are any
    if (searchParams.toString()) {
      router.replace("/dashboard/affiliate/orders");
    }
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Referred Orders</h1>
          <p className="text-gray-500 mt-1">Track orders placed by your referred customers</p>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
            <PackageOpen size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900">
              {isLoading ? <span className="animate-pulse bg-gray-200 text-transparent rounded">000</span> : summary?.total_orders || 0}
            </p>
          </div>
        </div>
        
        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <DollarSign size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900">
              {isLoading ? <span className="animate-pulse bg-gray-200 text-transparent rounded">৳0000</span> : `৳${summary?.total_revenue?.toLocaleString() || 0}`}
            </p>
          </div>
        </div>

        <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
            <Users size={24} />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Unique Customers</p>
            <p className="text-2xl font-bold text-gray-900">
              {isLoading ? <span className="animate-pulse bg-gray-200 text-transparent rounded">00</span> : data?.total_referred_customers || 0}
            </p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 mb-6 shadow-sm">
        <div className="flex items-center gap-2 mb-4">
          <Filter size={18} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900">Filter Orders</h3>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Order Status</label>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="w-full h-10 px-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm outline-none transition-all"
            >
              <option value="">All Statuses</option>
              <option value="Order Placed">Order Placed</option>
              <option value="Processing">Processing</option>
              <option value="Shipped">Shipped</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
              <option value="Returned">Returned</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1.5">Date From</label>
            <div className="relative">
              <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => { setDateFrom(e.target.value); setPage(1); }}
                className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm outline-none transition-all"
              />
            </div>
          </div>
          <div className="flex items-end gap-3">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1.5">Date To</label>
              <div className="relative">
                <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setPage(1); }}
                  className="w-full h-10 pl-9 pr-3 rounded-lg border border-gray-200 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm outline-none transition-all"
                />
              </div>
            </div>
            <button
              onClick={handleFilterReset}
              className="h-10 px-4 flex items-center justify-center rounded-lg border border-gray-200 text-gray-600 bg-white hover:bg-gray-50 hover:text-gray-900 transition-colors text-sm font-medium"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/80 border-b border-gray-100">
                <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider py-4 px-4">Order Info</th>
                <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider py-4 px-4">Status</th>
                <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider py-4 px-4">Order Value</th>
                <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider py-4 px-4">Your Commission</th>
                <th className="text-right text-xs font-bold text-gray-600 uppercase tracking-wider py-4 px-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                // Skeleton Loading
                [...Array(5)].map((_, i) => (
                  <tr key={i} className="animate-pulse border-b border-gray-100">
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-32"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-6 bg-gray-200 rounded-full w-20"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-20"></div>
                    </td>
                    <td className="py-4 px-4">
                      <div className="h-4 bg-gray-200 rounded w-16 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-20"></div>
                    </td>
                    <td className="py-4 px-4 flex justify-end">
                      <div className="h-4 bg-gray-200 rounded w-20"></div>
                    </td>
                  </tr>
                ))
              ) : orders.length > 0 ? (
                orders.map((order: ReferredOrder) => <OrderRow key={order.id} order={order} />)
              ) : (
                <tr>
                  <td colSpan={5} className="py-16 text-center">
                    <PackageOpen size={48} className="mx-auto text-gray-200 mb-3" />
                    <p className="text-base font-medium text-gray-900">No orders found</p>
                    <p className="text-sm text-gray-500 mt-1">We couldn't find any orders matching your criteria.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {pagination && pagination.last_page > 1 && (
          <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between bg-gray-50/30">
            <p className="text-sm text-gray-500">
              Showing <span className="font-medium text-gray-900">{pagination.from || 0}</span> to <span className="font-medium text-gray-900">{pagination.to || 0}</span> of <span className="font-medium text-gray-900">{pagination.total}</span> orders
            </p>
            <div className="flex items-center gap-1">
              <button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronLeft size={16} />
              </button>
              
              <span className="text-sm font-medium text-gray-900 px-3">
                Page {page} of {pagination.last_page}
              </span>

              <button
                onClick={() => setPage(p => Math.min(pagination.last_page, p + 1))}
                disabled={page === pagination.last_page}
                className="w-8 h-8 flex items-center justify-center rounded-md border border-gray-200 text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const AffiliateOrders = () => {
  return (
    <Suspense fallback={<div>Loading orders...</div>}>
      <AffiliateOrdersContent />
    </Suspense>
  )
}

export default AffiliateOrders;
