'use client';

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import StatusBadge, { StatusType } from "@/components/dashboard/StatusBadge";
import { ArrowLeft, Package, Truck, CheckCircle, Clock, MapPin, CreditCard, Download, Phone, MessageSquare, Loader2, Image as ImageIcon } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { fetchCustomerOrder, OrderDetail } from "@/lib/api/customer";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function CustomerOrderDetail() {
  const params = useParams();
  const orderId = params?.orderId as string;
  const { token, isLoading } = useAuth();
  const router = useRouter();
  
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
        setLoading(false);
        router.replace('/login');
        return;
    }
    if (!orderId) return;

    const loadOrder = async () => {
      setLoading(true);
      try {
        const res = await fetchCustomerOrder(token, orderId);
        setOrder(res.data);
      } catch (err: any) {
        toast.error(err.message || "Failed to load order details");
      } finally {
        setLoading(false);
      }
    };

    loadOrder();
  }, [token, isLoading, orderId, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-500">
          <Loader2 className="animate-spin mx-auto text-primary mb-3" size={32} />
          <p>Loading order details...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-12">
        <Package size={48} className="mx-auto text-gray-300 mb-4" />
        <h2 className="text-xl font-bold text-gray-900">Order Not Found</h2>
        <p className="text-gray-500 mt-2">The order you're looking for doesn't exist or you don't have permission to view it.</p>
        <Link href="/dashboard/customer/orders" className="inline-flex items-center gap-2 mt-6 text-primary hover:underline">
          <ArrowLeft size={16} /> Back to Orders
        </Link>
      </div>
    );
  }

  return (
    <>
      {/* Header */}
      <div className="mb-6">
        <Link href="/dashboard/customer/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-primary transition-colors mb-3">
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Order {order.order_no}</h1>
            <p className="text-gray-500 mt-1">Placed on {order.date}</p>
          </div>
          <div className="flex items-center gap-2">
            <StatusBadge status={order.status.toLowerCase() as StatusType} />
            <Link 
              href={`/dashboard/customer/orders/${orderId}/invoice`}
              className="inline-flex items-center gap-1.5 px-4 py-2 border border-gray-200 text-gray-700 text-sm font-medium rounded-xl hover:bg-gray-50 transition-colors"
            >
              <Download size={14} /> Invoice
            </Link>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-2 space-y-6">
          {/* Order Items */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Items</h3>
            <div className="space-y-3">
              {order.items.map((item) => (
                <div key={item.id} className="flex items-center gap-4 p-3 rounded-xl bg-gray-50">
                  <div className="w-14 h-14 rounded-xl bg-white border border-gray-100 flex items-center justify-center shrink-0 overflow-hidden">
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-gray-300" size={24} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.name}</p>
                    <p className="text-xs text-gray-500">Qty: {item.quantity} x ৳{Number(item.price).toLocaleString()}</p>
                  </div>
                  <p className="text-sm font-semibold text-gray-900">৳{Number(item.total).toLocaleString()}</p>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Subtotal</span><span className="text-gray-700">৳{Number(order.subtotal).toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Shipping</span><span className="text-gray-700">৳{Number(order.shipping).toLocaleString()}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Discount</span><span className="text-gray-700">৳{Number(order.discount).toLocaleString()}</span></div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-gray-100"><span className="text-gray-900">Total</span><span className="text-primary">৳{Number(order.total).toLocaleString()}</span></div>
            </div>
          </div>

          {/* Order Timeline */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Order Timeline</h3>
            <div className="space-y-0">
              {order.timeline.length > 0 ? order.timeline.map((step, idx) => (
                <div key={idx} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${step.completed ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}>
                      {step.completed ? <CheckCircle size={16} /> : <Clock size={16} />}
                    </div>
                    {idx < order.timeline.length - 1 && (
                      <div className={`w-0.5 h-8 ${step.completed ? "bg-primary/30" : "bg-gray-100"}`} />
                    )}
                  </div>
                  <div className="pb-6">
                    <p className={`text-sm font-medium ${step.completed ? "text-gray-900" : "text-gray-400"}`}>{step.status}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{step.date}</p>
                  </div>
                </div>
              )) : (
                <div className="text-sm text-gray-500 py-4 text-center">No timeline history available.</div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          {/* Shipping Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><MapPin size={16} className="text-gray-400" /> Shipping Address</h3>
            <div className="space-y-2">
              <p className="text-sm font-medium text-gray-900">{order.shipping_address.name}</p>
              <p className="text-sm text-gray-600">{order.shipping_address.address}</p>
              {order.shipping_address.city && (
                <p className="text-sm text-gray-500">{order.shipping_address.city} {order.shipping_address.postalCode && `- ${order.shipping_address.postalCode}`}</p>
              )}
              <p className="text-sm text-gray-500 flex items-center gap-1.5"><Phone size={13} className="text-gray-400" />{order.shipping_address.phone}</p>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><CreditCard size={16} className="text-gray-400" /> Payment</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Method</span><span className="text-gray-900 font-medium">{order.payment_type}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Status</span><StatusBadge status={order.payment_status.toLowerCase() as StatusType} /></div>
            </div>
          </div>

          {/* Tracking Info */}
          <div className="bg-white rounded-2xl border border-gray-100 p-5">
            <h3 className="text-sm font-semibold text-gray-900 mb-4 flex items-center gap-2"><Truck size={16} className="text-gray-400" /> Tracking</h3>
            <div className="space-y-2">
              <div className="flex justify-between text-sm"><span className="text-gray-500">Courier</span><span className="text-gray-900 font-medium">{order.tracking.courier || "N/A"}</span></div>
              <div className="flex justify-between text-sm"><span className="text-gray-500">Tracking No.</span><span className="text-primary font-mono text-xs">{order.tracking.tracking_no || "N/A"}</span></div>
              {order.tracking.estimatedDelivery && (
                <div className="flex justify-between text-sm"><span className="text-gray-500">Est. Delivery</span><span className="text-gray-900 font-medium">{order.tracking.estimatedDelivery}</span></div>
              )}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
