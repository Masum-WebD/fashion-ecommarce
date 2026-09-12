'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  Package, Search, Truck, CheckCircle2, Clock, Loader2, Info, XCircle,
  MapPin, Calendar, CreditCard, Tag, ChevronRight, Box, ShoppingBag, Printer
} from "lucide-react";
import { trackOrder, TrackOrderRequest } from "@/lib/api/orderTracking";
import { getImageUrl } from "@/lib/api/images";
import { useSettings } from "@/providers/SettingsProvider";
import OrderInvoice from "@/components/shared/OrderInvoice";

const ORDER_STEPS = [
  { key: "placed",      label: "Order Placed",  icon: ShoppingBag },
  { key: "processing",  label: "Processing",    icon: Box },
  { key: "shipped",     label: "Shipped",       icon: Truck },
  { key: "delivered",   label: "Delivered",     icon: CheckCircle2 },
];

const getStepIndex = (status: string): number => {
  const s = status.toLowerCase();
  if (s === "order placed")                             return 0;
  if (s === "processing" || s === "on hold" || s === "approved") return 1;
  if (s === "shipped" || s === "delivering")             return 2;
  if (s === "delivered" || s === "paid")                return 3;
  // cancelled / returned / return pending → no step
  return -1;
};

const getStatusBadge = (status: string) => {
  const s = status.toLowerCase();
  if (s === "delivered" || s === "paid")
    return { bg: "bg-emerald-100 text-emerald-800 border-emerald-200", dot: "bg-emerald-500" };
  if (s === "shipped" || s === "delivering")
    return { bg: "bg-violet-100 text-violet-800 border-violet-200",   dot: "bg-violet-500" };
  if (s === "processing" || s === "approved")
    return { bg: "bg-blue-100 text-blue-800 border-blue-200",          dot: "bg-blue-500" };
  if (s === "on hold")
    return { bg: "bg-amber-100 text-amber-800 border-amber-200",       dot: "bg-amber-500" };
  if (s === "order placed")
    return { bg: "bg-sky-100 text-sky-800 border-sky-200",             dot: "bg-sky-500" };
  if (s === "return pending")
    return { bg: "bg-orange-100 text-orange-800 border-orange-200",    dot: "bg-orange-500" };
  if (s === "cancelled" || s === "returned")
    return { bg: "bg-red-100 text-red-800 border-red-200",             dot: "bg-red-500" };
  // fallback
  return { bg: "bg-slate-100 text-slate-700 border-slate-200",         dot: "bg-slate-400" };
};

const TrackOrder = () => {
  const { settings } = useSettings();
  const params = useParams();
  const orderidParam = params?.orderid ? (Array.isArray(params.orderid) ? params.orderid[0] : params.orderid) : "";

  const [loading, setLoading] = useState(false);
  const [orderData, setOrderData] = useState<any>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [formData, setFormData] = useState<TrackOrderRequest>({ query: orderidParam || "" });

  useEffect(() => {
    if (orderData?.order_no || orderData?.id) {
      document.title = `Track Order #${orderData.order_no || orderData.id} | Siraj Tech`;
    } else {
      document.title = "Track Order | Siraj Tech";
    }
  }, [orderData]);

  useEffect(() => {
    if (orderidParam) {
      setFormData({ query: orderidParam });
      handleSubmit(undefined, orderidParam);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderidParam]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e?: React.FormEvent, overrideQuery?: string) => {
    if (e) e.preventDefault();
    const queryToUse = overrideQuery || formData.query;
    if (!queryToUse.trim()) return;
    setLoading(true);
    setOrderData(null);
    setErrorMsg(null);
    try {
      const response = await trackOrder({ query: queryToUse });
      if (response.success && response.data) {
        setOrderData(response.data);
      } else {
        setErrorMsg(response.message || "We couldn't find an order with those details.");
      }
    } catch {
      setErrorMsg("Failed to track order. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit",
    });
  };

  const isCancelled = orderData && (
    ["cancelled", "returned", "return pending"].includes(orderData.status?.toLowerCase())
  );
  const currentStep = orderData ? getStepIndex(orderData.status) : -1;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 print:bg-white print:min-h-0">
      <main className="flex-grow print:hidden">
        {/* Hero Banner */}
        <div className="bg-gradient-to-br from-primary-900 via-primary-800 to-primary-600 text-white py-7 md:py-9 relative overflow-hidden">
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-8 left-12 w-40 h-40 rounded-full border-4 border-white/30" />
            <div className="absolute bottom-4 right-16 w-64 h-64 rounded-full border-4 border-white/20" />
          </div>
          <div className="container-main text-center relative z-10 flex items-center justify-center gap-3">
            <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm border border-white/30">
              <Truck className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Track Your Order</h1>
          </div>
        </div>

        <div className="container-main py-10 max-w-3xl mx-auto px-4 space-y-8">

          {/* Search Card */}
          {!orderidParam && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 md:p-8">
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    name="query"
                    required
                    value={formData.query}
                    onChange={handleChange}
                    placeholder="Order Number or Phone Number"
                    className="w-full pl-11 pr-4 py-3.5 rounded-xl border border-slate-200 focus:ring-2 focus:ring-primary focus:border-primary transition-all outline-none text-sm bg-slate-50"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-primary text-white font-semibold text-sm hover:bg-primary/90 active:scale-95 transition-all disabled:opacity-60 disabled:cursor-not-allowed shrink-0 shadow-md shadow-primary/20"
                >
                  {loading ? (
                    <><Loader2 className="w-4 h-4 animate-spin" /> Tracking...</>
                  ) : (
                    <><Search className="w-4 h-4" /> Track Order</>
                  )}
                </button>
              </form>
            </div>
          )}

          {/* Error State */}
          {errorMsg && !loading && (
            <div className="bg-white rounded-2xl shadow-sm border border-red-100 p-8 text-center animate-fade-in">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <XCircle className="w-8 h-8 text-red-400" />
              </div>
              <h3 className="text-lg font-bold text-slate-800 mb-1">Order Not Found</h3>
              <p className="text-slate-500 text-sm mb-4">{errorMsg}</p>
              <p className="text-xs text-slate-400">
                Please double-check your order number or phone and try again. Need help?{" "}
                <a href="/contact" className="text-primary font-medium hover:underline">Contact support</a>.
              </p>
            </div>
          )}

          {/* Skeleton Loader */}
          {loading && (
            <div className="space-y-5 animate-fade-in">
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
                <div className="bg-gradient-to-r from-slate-100/50 to-slate-50/50 px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="space-y-3 w-full sm:w-auto">
                    <div className="h-3 bg-slate-200 rounded w-24"></div>
                    <div className="h-7 bg-slate-200 rounded w-48"></div>
                    <div className="flex items-center gap-1.5 mt-1">
                      <div className="w-3.5 h-3.5 bg-slate-200 rounded-full"></div>
                      <div className="h-3 bg-slate-200 rounded w-36"></div>
                    </div>
                  </div>
                  <div className="flex flex-row flex-wrap items-center sm:justify-end gap-2 mt-3 sm:mt-0">
                    <div className="h-9 bg-slate-200 rounded-xl w-28 shrink-0"></div>
                    <div className="h-9 bg-slate-200 rounded-xl w-40 shrink-0"></div>
                  </div>
                </div>
                
                <div className="px-6 py-6">
                  <div className="flex items-start justify-between relative">
                    <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-200 z-0"></div>
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="relative z-10 flex flex-col items-center gap-2" style={{ minWidth: 56 }}>
                        <div className="w-10 h-10 rounded-full bg-slate-200 border-2 border-slate-100"></div>
                        <div className="h-2.5 bg-slate-200 rounded w-12 mt-1"></div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden animate-pulse">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                  <div className="w-4 h-4 bg-slate-200 rounded shrink-0"></div>
                  <div className="h-4 bg-slate-200 rounded w-24"></div>
                </div>
                <div className="divide-y divide-slate-50">
                  {[1, 2].map(i => (
                    <div key={i} className="flex gap-4 px-6 py-4">
                      <div className="w-16 h-16 rounded-xl bg-slate-200 shrink-0 border border-slate-100"></div>
                      <div className="flex-1 space-y-3 py-1">
                        <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                        <div className="h-3 bg-slate-200 rounded w-1/4"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Order Result */}
          {orderData && !loading && (
            <div className="space-y-5 animate-fade-in">

              {/* Order Header */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="bg-gradient-to-r from-primary/8 to-primary/4 px-6 py-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-xs text-slate-500 uppercase tracking-wider font-medium mb-1">Order Number</p>
                    <h2 className="text-xl font-extrabold text-slate-800">#{orderData.order_no}</h2>
                    <div className="flex items-center gap-1.5 mt-1 text-xs text-slate-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Placed on {formatDate(orderData.created_at)}</span>
                    </div>
                  </div>
                  <div className="flex flex-row flex-wrap items-center sm:justify-end gap-2 mt-3 sm:mt-0">
                    <div className={`inline-flex items-center justify-center w-fit gap-2 px-3.5 py-2 rounded-xl border text-sm font-semibold ${getStatusBadge(orderData.status).bg}`}>
                      <span className={`w-2 h-2 rounded-full animate-pulse ${getStatusBadge(orderData.status).dot}`} />
                      {orderData.status}
                    </div>
                    <button 
                      onClick={() => window.print()}
                      className="inline-flex items-center justify-center w-fit gap-2 px-4 py-2 bg-primary/10 text-primary hover:bg-primary/20 border border-primary/20 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm"
                    >
                      <Printer size={16} /> Download Invoice
                    </button>
                  </div>
                </div>

                {/* Progress Tracker */}
                {!isCancelled && (
                  <div className="px-6 py-6">
                    <div className="flex items-start justify-between relative">
                      {/* Connector line */}
                      <div className="absolute top-5 left-5 right-5 h-0.5 bg-slate-200 z-0" />
                      <div
                        className="absolute top-5 left-5 h-0.5 bg-primary z-0 transition-all duration-700 ease-out"
                        style={{ width: currentStep >= 0 ? `calc(${(currentStep / (ORDER_STEPS.length - 1)) * 100}% - 10px)` : '0%' }}
                      />

                      {ORDER_STEPS.map((step, idx) => {
                        const StepIcon = step.icon;
                        const done = currentStep >= idx;
                        const active = currentStep === idx;
                        return (
                          <div key={step.key} className="relative z-10 flex flex-col items-center gap-2" style={{ minWidth: 56 }}>
                            <div className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-500 ${done ? 'bg-primary border-primary text-white shadow-md shadow-primary/30' : 'bg-white border-slate-200 text-slate-400'} ${active ? 'ring-4 ring-primary/20' : ''}`}>
                              <StepIcon className="w-4 h-4" />
                            </div>
                            <span className={`text-[10px] font-semibold text-center leading-tight ${done ? 'text-primary' : 'text-slate-400'}`}>
                              {step.label}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {isCancelled && (
                  <div className="px-6 py-5 flex items-center gap-3 bg-red-50">
                    <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0">
                      <XCircle className="w-5 h-5 text-red-500" />
                    </div>
                    <div>
                      <p className="font-semibold text-red-800 text-sm">Order {orderData.status}</p>
                      <p className="text-xs text-red-600">This order has been {orderData.status?.toLowerCase()}.</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Order Items */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                  <Package className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-slate-800 text-sm">Order Items</h3>
                </div>
                <div className="divide-y divide-slate-50">
                  {orderData.items?.map((item: any) => (
                    <div key={item.id} className="flex gap-4 px-6 py-4 hover:bg-slate-50/50 transition-colors">
                      {(item.thumbnail_image || item.product?.thumbnail_image) ? (
                        <img
                          src={getImageUrl(item.thumbnail_image || item.product?.thumbnail_image)}
                          alt={item.product_name}
                          className="w-16 h-16 object-cover rounded-xl bg-white border border-slate-100 shadow-sm shrink-0"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                          <Package className="w-6 h-6 text-slate-400" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-slate-800 text-sm leading-snug line-clamp-2">{item.product_name}</p>
                        {(item.variant_name || item.variant?.name) && (
                          <span className="inline-flex items-center gap-1 mt-1.5 px-2 py-0.5 bg-slate-100 text-slate-600 rounded-md text-xs font-medium">
                            <Tag className="w-3 h-3" />
                            {item.variant_name || item.variant?.name}
                          </span>
                        )}
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-slate-500">Qty: <span className="font-bold text-slate-700">{item.quantity || item.qty}</span></span>
                          <span className="font-bold text-primary text-sm">৳ {Number(item.total).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Order Summary */}
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
                  <CreditCard className="w-4 h-4 text-primary" />
                  <h3 className="font-bold text-slate-800 text-sm">Payment Summary</h3>
                </div>
                <div className="px-6 py-5 space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500">Subtotal</span>
                    <span className="font-medium text-slate-800">৳ {Number(orderData.sale_amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 flex items-center gap-1.5"><Truck className="w-3.5 h-3.5" /> Shipping</span>
                    <span className="font-medium text-slate-800">
                      {Number(orderData.courier_charge) === 0 ? (
                        <span className="text-emerald-600 font-semibold">Free</span>
                      ) : `৳ ${Number(orderData.courier_charge).toLocaleString()}`}
                    </span>
                  </div>
                  {Number(orderData.discount_amount) > 0 && (
                    <div className="flex justify-between items-center text-emerald-600">
                      <span className="flex items-center gap-1.5"><Tag className="w-3.5 h-3.5" /> Discount</span>
                      <span className="font-semibold">- ৳ {Number(orderData.discount_amount).toLocaleString()}</span>
                    </div>
                  )}
                  <div className="h-px bg-slate-100 my-1" />
                  <div className="flex justify-between items-center pt-1">
                    <span className="font-bold text-slate-800 text-base">Total</span>
                    <span className="font-extrabold text-primary text-lg">৳ {Number(orderData.total_amount).toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Shipping Info */}
              {orderData.shipping_address && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 px-6 py-5 flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl bg-primary/10 flex items-center justify-center shrink-0 mt-0.5">
                    <MapPin className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Shipping Address</p>
                    <p className="text-sm font-semibold text-slate-800">{orderData.shipping_address}</p>
                  </div>
                </div>
              )}

              {/* Need Help */}
              <a href="/contact" className="flex items-center justify-between bg-primary/5 hover:bg-primary/10 border border-primary/15 rounded-2xl px-6 py-4 transition-colors group">
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Need help with this order?</p>
                  <p className="text-xs text-slate-500">Our support team is ready to assist you.</p>
                </div>
                <ChevronRight className="w-5 h-5 text-primary group-hover:translate-x-1 transition-transform" />
              </a>

            </div>
          )}
        </div>
      </main>

      {/* Hidden Print Invoice */}
      <OrderInvoice 
        orderData={orderData} 
        settings={settings} 
        formatDate={formatDate} 
      />
    </div>
  );
};

export default TrackOrder;
