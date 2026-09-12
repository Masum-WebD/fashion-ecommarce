'use client';
import Link from "next/link";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { MapPin, CreditCard, Phone, Package, Printer, AlertCircle } from "lucide-react";
import { Order } from "@/data/customers";

interface ReadOnlyOrderDetailProps {
  order: Order;
  showBackButton?: boolean;
  backLink?: string;
  backText?: string;
}

const ReadOnlyOrderDetail = ({ 
  order, 
  showBackButton = true,
  backLink = "/dashboard/wholesaler/all-orders",
  backText = "Back to All Orders"
}: ReadOnlyOrderDetailProps) => {
  
  // Parse total value for calculations
  const parseAmount = (amount: string): number => {
    return parseFloat(amount.replace(/[à§³,]/g, ''));
  };

  return (
    <div className="space-y-6">
      {/* Header with Read-Only Badge */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          {showBackButton && (
            <Link
              href={backLink}
              className="text-sm text-gray-600 hover:text-gray-900 mb-2 inline-block"
            >
              â† {backText}
            </Link>
          )}
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl font-bold text-gray-900">Order {order.orderNumber}</h1>
            <StatusBadge status={order.status} />
            <span className="px-3 py-1 bg-amber-100 text-amber-800 text-xs font-semibold rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              View Only
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Placed on {new Date(order.date).toLocaleDateString('en-GB', { 
              day: 'numeric', 
              month: 'long', 
              year: 'numeric' 
            })}
          </p>
        </div>
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors flex items-center gap-2"
        >
          <Printer className="w-4 h-4" />
          Print Order
        </button>
      </div>

      {/* Info Cards Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Customer Info */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <MapPin className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Customer Details</h3>
          </div>
          <div className="space-y-2 text-sm">
            <p className="font-medium text-gray-900">{order.customerName}</p>
            <p className="text-gray-600">{order.customerEmail}</p>
            <p className="text-gray-600 flex items-center gap-1">
              <Phone className="w-3 h-3" />
              {order.customerPhone}
            </p>
            <p className="text-gray-600 mt-2">{order.customerAddress}</p>
          </div>
        </div>

        {/* Payment Info */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Payment</h3>
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Method:</span>
              <span className="font-medium text-gray-900">{order.paymentMethod}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Status:</span>
              <StatusBadge status={order.paymentStatus} />
            </div>
            {order.invoiceId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Invoice:</span>
                <Link 
                  href={`/dashboard/wholesaler/invoices/${order.invoiceId}`}
                  className="font-medium text-blue-600 hover:text-blue-700"
                >
                  {order.invoiceId}
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Staff & Tracking Info */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Package className="w-5 h-5 text-gray-400" />
            <h3 className="font-semibold text-gray-900">Order Info</h3>
          </div>
          <div className="space-y-2 text-sm">
            {order.staffName && (
              <div className="flex justify-between">
                <span className="text-gray-600">Handled by:</span>
                <span className="font-medium text-gray-900">{order.staffName}</span>
              </div>
            )}
            {order.staffId && (
              <div className="flex justify-between">
                <span className="text-gray-600">Staff ID:</span>
                <span className="font-medium text-gray-900">{order.staffId}</span>
              </div>
            )}
            {order.trackingNumber && (
              <div className="flex justify-between">
                <span className="text-gray-600">Tracking:</span>
                <span className="font-mono text-xs font-medium text-gray-900">{order.trackingNumber}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="font-semibold text-gray-900">Order Items</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">SKU</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">Qty</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Unit Price</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {order.items.map((item) => (
                <tr key={item.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{item.image}</span>
                      <span className="font-medium text-gray-900">{item.name}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-mono text-gray-600">{item.sku}</span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <span className="text-sm font-medium text-gray-900">{item.quantity}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm text-gray-900">{item.unitPrice}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <span className="text-sm font-medium text-gray-900">{item.total}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Price Summary */}
        <div className="border-t border-gray-200 p-6">
          <div className="max-w-sm ml-auto space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Subtotal</span>
              <span className="font-medium text-gray-900">{order.subtotal}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Shipping</span>
              <span className="font-medium text-gray-900">{order.shipping}</span>
            </div>
            {parseAmount(order.discount) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Discount</span>
                <span className="font-medium text-green-600">-{order.discount}</span>
              </div>
            )}
            {order.tax && parseAmount(order.tax) > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Tax</span>
                <span className="font-medium text-gray-900">{order.tax}</span>
              </div>
            )}
            <div className="border-t border-gray-200 pt-2 flex justify-between">
              <span className="font-semibold text-gray-900">Total</span>
              <span className="text-lg font-bold text-gray-900">{order.total}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes */}
      {order.notes && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-6">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-amber-600" />
            Notes
          </h3>
          <p className="text-sm text-gray-700">{order.notes}</p>
        </div>
      )}

      {/* Read-Only Notice */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
        <p className="text-sm text-gray-600 text-center">
          <AlertCircle className="w-4 h-4 inline mr-2" />
          This is a read-only view. You cannot modify or take actions on this order.
        </p>
      </div>
    </div>
  );
};

export default ReadOnlyOrderDetail;

