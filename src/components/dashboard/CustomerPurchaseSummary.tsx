'use client';

import { Customer } from "@/data/customers";
import { Package, TrendingUp, CreditCard, Calendar, ShoppingBag, Star } from "lucide-react";

interface CustomerPurchaseSummaryProps {
  customer: Customer;
  analytics: {
    totalOrders: number;
    totalSpent: number;
    averageOrderValue: number;
    favoriteProducts: { name: string; quantity: number }[];
    paymentMethods: { [key: string]: number };
    deliveredOrders: number;
    pendingOrders: number;
    processingOrders: number;
    shippedOrders: number;
  };
}

const CustomerPurchaseSummary = ({ customer, analytics }: CustomerPurchaseSummaryProps) => {
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `৳${amount.toLocaleString('en-IN')}`;
  };

  // Get preferred payment method
  const preferredPaymentMethod = Object.entries(analytics.paymentMethods).sort((a, b) => b[1] - a[1])[0];

  return (
    <div className="space-y-6">
      {/* Customer Header Card */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-6">
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-2xl">
                {customer.name.charAt(0)}
              </div>
              <div>
                <h2 className="text-2xl font-bold">{customer.name}</h2>
                <p className="text-blue-100 text-sm">Customer ID: {customer.id}</p>
              </div>
            </div>
            <div className="space-y-1 text-sm text-blue-100 mt-3">
              <p>📧 {customer.email}</p>
              <p>📞 {customer.phone}</p>
              <p>📍 {customer.address}, {customer.city} - {customer.postalCode}</p>
            </div>
          </div>
          <div className="text-right">
            <div className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-semibold mb-2">
              {customer.customerType === 'wholesale' ? '🏢 Wholesale' : customer.customerType === 'retail' ? '🛍️ Retail' : '👤 Regular'}
            </div>
            <p className="text-sm text-blue-100">
              Member since {new Date(customer.joinDate).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' })}
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Total Orders */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Package className="w-8 h-8 text-blue-600" />
            <span className="text-xs font-semibold text-gray-500 uppercase">Orders</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{analytics.totalOrders}</div>
          <p className="text-sm text-gray-600 mt-1">
            {analytics.deliveredOrders} delivered
          </p>
        </div>

        {/* Total Spent */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <TrendingUp className="w-8 h-8 text-green-600" />
            <span className="text-xs font-semibold text-gray-500 uppercase">Total Spent</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.totalSpent)}</div>
          <p className="text-sm text-gray-600 mt-1">
            Lifetime value
          </p>
        </div>

        {/* Average Order */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <ShoppingBag className="w-8 h-8 text-purple-600" />
            <span className="text-xs font-semibold text-gray-500 uppercase">Avg Order</span>
          </div>
          <div className="text-2xl font-bold text-gray-900">{formatCurrency(analytics.averageOrderValue)}</div>
          <p className="text-sm text-gray-600 mt-1">
            Per transaction
          </p>
        </div>

        {/* Last Order */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <Calendar className="w-8 h-8 text-amber-600" />
            <span className="text-xs font-semibold text-gray-500 uppercase">Last Order</span>
          </div>
          <div className="text-lg font-bold text-gray-900">
            {new Date(customer.lastOrderDate).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            {Math.floor((new Date().getTime() - new Date(customer.lastOrderDate).getTime()) / (1000 * 60 * 60 * 24))} days ago
          </p>
        </div>
      </div>

      {/* Additional Info Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Favorite Products */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <Star className="w-5 h-5 text-amber-500" />
            <h3 className="font-semibold text-gray-900">Top Products</h3>
          </div>
          {analytics.favoriteProducts.length > 0 ? (
            <div className="space-y-3">
              {analytics.favoriteProducts.slice(0, 3).map((product, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}</span>
                    <span className="text-sm font-medium text-gray-900 line-clamp-1">{product.name}</span>
                  </div>
                  <span className="text-sm text-gray-600 font-medium">{product.quantity}x</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500">No order history yet</p>
          )}
        </div>

        {/* Payment & Status */}
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center gap-2 mb-4">
            <CreditCard className="w-5 h-5 text-blue-500" />
            <h3 className="font-semibold text-gray-900">Payment & Status</h3>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Preferred Method:</span>
              <span className="text-sm font-medium text-gray-900">
                {preferredPaymentMethod ? preferredPaymentMethod[0] : customer.preferredPaymentMethod}
              </span>
            </div>
            <div className="border-t border-gray-200 pt-3 space-y-2">
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">✅ Delivered:</span>
                <span className="font-medium text-green-600">{analytics.deliveredOrders}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">🚚 Shipped:</span>
                <span className="font-medium text-blue-600">{analytics.shippedOrders}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">⏳ Processing:</span>
                <span className="font-medium text-amber-600">{analytics.processingOrders}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-600">🕐 Pending:</span>
                <span className="font-medium text-gray-600">{analytics.pendingOrders}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerPurchaseSummary;

