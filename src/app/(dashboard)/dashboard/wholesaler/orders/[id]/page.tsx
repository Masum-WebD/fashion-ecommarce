'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Package, User, CreditCard, CheckCircle, Clock } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { fetchWholesalerOrderDetails } from "@/lib/api/wholesaler";
import StatusBadge, { StatusType } from "@/components/dashboard/StatusBadge";
import { toast } from "sonner";
import Image from "next/image";

export default function OrderDetailsPage() {
  const { token, isLoading } = useAuth();
  const params = useParams();
  const router = useRouter();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
        router.replace('/login');
        return;
    }
    
    if (params.id) {
        fetchWholesalerOrderDetails(token, params.id as string)
            .then(res => {
                setOrder(res.order);
                setLoading(false);
            })
            .catch(err => {
                toast.error(err.message || "Failed to load order details");
                setLoading(false);
            });
    }
  }, [token, params.id, isLoading, router]);

  if (loading || isLoading) {
      return (
          <div className="animate-pulse space-y-6">
              <div className="h-10 bg-gray-200 rounded w-1/4"></div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="h-40 bg-gray-200 rounded md:col-span-2"></div>
                  <div className="h-40 bg-gray-200 rounded"></div>
              </div>
              <div className="h-64 bg-gray-200 rounded w-full"></div>
          </div>
      );
  }

  if (!order) {
      return (
          <div className="text-center py-12">
              <h2 className="text-xl font-bold text-gray-700">Order Not Found</h2>
              <p className="text-gray-500 mt-2">The order you are looking for does not exist or you do not have permission to view it.</p>
              <Link href="/dashboard/wholesaler/orders" className="mt-4 inline-block px-4 py-2 bg-primary text-white rounded-lg">Back to Orders</Link>
          </div>
      );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/dashboard/wholesaler/orders" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ArrowLeft size={20} className="text-gray-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
              Order #{order.order_no}
              <StatusBadge status={order.status.toLowerCase() as StatusType} />
            </h1>
            <p className="text-sm text-gray-500 mt-1">Placed on {new Date(order.date).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Order Items */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden shadow-sm">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
              <Package size={18} className="text-primary" />
              <h2 className="font-semibold text-gray-800">Order Items</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-5 py-3 font-medium text-gray-500">Product</th>
                    <th className="px-5 py-3 font-medium text-gray-500 text-center">Qty</th>
                    <th className="px-5 py-3 font-medium text-gray-500 text-right">Price</th>
                    <th className="px-5 py-3 font-medium text-gray-500 text-right">Total</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {order.items?.map((item: any) => (
                    <tr key={item.id} className="hover:bg-gray-50/50">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-lg bg-gray-100 overflow-hidden relative border border-gray-200">
                            {item.thumbnail_url || item.product?.image_url ? (
                              <img 
                                src={item.thumbnail_url || item.product?.image_url} 
                                alt={item.product_name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <Package size={20} />
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-800">{item.product_name}</p>
                            {item.variant && (
                              <p className="text-xs text-gray-500 mt-0.5">Variant: {item.variant.name}</p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-center text-gray-700">{item.quantity}</td>
                      <td className="px-5 py-4 text-right text-gray-700">৳{Number(item.price).toLocaleString()}</td>
                      <td className="px-5 py-4 text-right font-medium text-gray-900">৳{Number(item.total).toLocaleString()}</td>
                    </tr>
                  ))}
                  {(!order.items || order.items.length === 0) && (
                    <tr>
                      <td colSpan={4} className="px-5 py-8 text-center text-gray-400">No items found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Customer & Payment Details */}
        <div className="space-y-6">
          {/* Customer Info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <User size={18} className="text-primary" />
              <h2 className="font-semibold text-gray-800">Customer Details</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Name</span>
                <span className="font-medium text-gray-800">{order.customer?.name || order.shipping_name || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Phone</span>
                <span className="font-medium text-gray-800">{order.customer?.phone || order.shipping_phone || 'N/A'}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-500">Address</span>
                <span className="font-medium text-gray-800 text-right max-w-[60%]">{order.shipping_address || order.customer?.address || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Shipping / Courier Info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Package size={18} className="text-primary" />
              <h2 className="font-semibold text-gray-800">Shipping Details</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Courier Name</span>
                <span className="font-medium text-gray-800">{order.courier_name || 'N/A'}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Tracking ID</span>
                <span className="font-medium text-gray-800">{order.tracking_id || 'N/A'}</span>
              </div>
              <div className="flex justify-between pb-2">
                <span className="text-gray-500">Delivery Type</span>
                <span className="font-medium text-gray-800">{order.delivery_type || 'N/A'}</span>
              </div>
            </div>
          </div>

          {/* Payment Info */}
          <div className="bg-white border border-gray-100 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <CreditCard size={18} className="text-primary" />
              <h2 className="font-semibold text-gray-800">Payment Details</h2>
            </div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Payment Type</span>
                <span className="font-medium text-gray-800">{order.payment_type || 'N/A'}</span>
              </div>
              {order.transaction_no && (
                <div className="flex justify-between border-b border-gray-50 pb-2">
                  <span className="text-gray-500">Transaction No</span>
                  <span className="font-medium text-gray-800">{order.transaction_no}</span>
                </div>
              )}
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-800">৳{Number(order.sale_amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Courier Charge</span>
                <span className="font-medium text-gray-800">৳{Number(order.courier_charge).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-2">
                <span className="text-gray-500">Discount</span>
                <span className="font-medium text-red-500">- ৳{Number(order.discount_amount || 0).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pb-3">
                <span className="font-semibold text-gray-700">Total Amount</span>
                <span className="font-bold text-primary text-lg">৳{Number(order.total_amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between border-b border-gray-50 pt-2 pb-2">
                <span className="text-gray-500">Advance Paid</span>
                <span className="font-medium text-green-600">৳{Number(order.advance_amount).toLocaleString()}</span>
              </div>
              <div className="flex justify-between pt-2">
                <span className="font-semibold text-gray-700">Due Amount</span>
                <span className="font-bold text-red-500">৳{Number(order.due_amount).toLocaleString()}</span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
