import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { getImageUrl } from "@/lib/api/images";

export interface OrderInvoiceProps {
  orderData: any;
  settings: any;
  formatDate?: (date: string) => string;
  showOnScreen?: boolean;
}

export default function OrderInvoice({ orderData, settings, formatDate, showOnScreen = false }: OrderInvoiceProps) {
  const [mounted, setMounted] = useState(false);
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(null);

  useEffect(() => {
    setMounted(true);
    let el = document.getElementById('invoice-portal-root');
    if (!el) {
      el = document.createElement('div');
      el.id = 'invoice-portal-root';
      document.body.appendChild(el);
    }
    setPortalContainer(el);

    return () => {
      if (el && el.parentNode) {
        el.parentNode.removeChild(el);
      }
    };
  }, []);

  if (!orderData || !mounted) return null;

  const defaultFormatDate = (d: string) => {
    if (!d) return "";
    try {
      return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
    } catch {
      return d;
    }
  };
  const formatFn = formatDate || defaultFormatDate;

  // Header data
  const orderNo = orderData.order_no || orderData.orderId || orderData.id || '';
  const dateStr = formatFn(orderData.date || orderData.created_at || new Date().toISOString());
  const paymentType = orderData.payment_type || orderData.paymentMethod || orderData.payment_method || '';

  // Customer / Billed To
  const customerName = orderData.customer?.name || orderData.customer_name || (typeof orderData.shipping_address === 'object' ? orderData.shipping_address?.name : '') || 'N/A';
  const customerPhone = orderData.customer?.phone || orderData.customer_phone || orderData.phone || (typeof orderData.shipping_address === 'object' ? orderData.shipping_address?.phone : '') || 'N/A';
  const secondaryPhone = orderData.secondary_phone || '';
  const customerEmail = orderData.customer?.email || orderData.customer_email || orderData.email || (typeof orderData.shipping_address === 'object' ? orderData.shipping_address?.email : '') || 'N/A';
  const customerAddress = (typeof orderData.shipping_address === 'string' ? orderData.shipping_address : orderData.shipping_address?.address) || orderData.customer?.address || 'N/A';

  // Order Details
  const orderType = orderData.order_type || orderData.sales_type || 'N/A';
  const courierName = orderData.courier_name || orderData.courier?.name || orderData.tracking?.courier || 'N/A';
  const deliveryMethod = orderData.shipping_rate?.name || orderData.shippingRate?.name || orderData.shipping_rate_name || orderData.delivery_method || 'N/A';
  const processedBy = (orderData.user?.name || orderData.processed_by || 'N/A') + (orderData.employee_id ? ' (Assigned)' : '');

  // Items & Quantities
  const items = orderData.items || [];
  const totalQuantity = items.reduce((sum: number, item: any) => sum + Number(item.quantity || item.qty || 1), 0);

  // Totals
  const subtotal = Number(orderData.sale_amount ?? orderData.subtotal ?? 0);
  const couponDiscount = Number(orderData.discount_amount ?? orderData.discount ?? 0);
  const couponCode = orderData.coupon_code || orderData.appliedCoupon || '';
  const manualDiscount = Number(orderData.manual_discount || 0);
  const manualDiscountReason = orderData.manual_discount_reason || '';
  const courierCharge = Number(orderData.courier_charge ?? orderData.shipping ?? 0);
  const totalWeight = orderData.total_weight !== undefined && orderData.total_weight !== null ? Number(orderData.total_weight) : null;
  const totalAmount = Number(orderData.total_amount ?? orderData.total ?? 0);
  const advanceAmount = Number(orderData.advance_amount ?? orderData.advance ?? 0);
  const dueAmount = orderData.due_amount !== undefined && orderData.due_amount !== null 
    ? Number(orderData.due_amount) 
    : Math.max(0, totalAmount - advanceAmount);

  // Note
  const invoiceNote = orderData.invoice_note || '';

  const invoiceMarkup = (
    <div id="printable-invoice" className="max-w-4xl mx-auto w-full font-sans text-sm bg-white text-black p-2 sm:p-4">
      {/* Header */}
      <div className="flex flex-row items-start justify-between gap-4 border-b border-gray-200 pb-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-indigo-600 uppercase tracking-wide">INVOICE</h1>
          <div className="mt-2 space-y-0.5 text-sm text-gray-700">
            <div>Invoice No: <strong className="font-semibold">{orderNo}</strong></div>
            <div>Date: {dateStr}</div>
            {paymentType && (
              <div>Payment: <span className="capitalize">{paymentType}</span></div>
            )}
          </div>
        </div>
        
        <div className="text-right">
          {settings?.logo_url || settings?.logo ? (
            /* eslint-disable-next-line @next/next/no-img-element */
            <img 
              src={getImageUrl(settings.logo_url || settings.logo)} 
              alt={settings?.name || "Siraj Tech"} 
              className="h-14 object-contain ml-auto mb-2" 
            />
          ) : (
            <h2 className="text-2xl font-bold text-indigo-600">{settings?.name || "NexusERP"}</h2>
          )}
          <div className="text-xs text-gray-600 space-y-0.5">
            {settings?.address && (
              <p className="whitespace-pre-line">{settings.address}</p>
            )}
            <p>Phone: {settings?.mobile || settings?.phone || '+123 456 7890'}</p>
            <p>Email: {settings?.email || 'info@nexuserp.com'}</p>
          </div>
        </div>
      </div>

      {/* Details Section: Billed To & Order Details */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-1.5 mb-2 text-xs uppercase tracking-wider">Billed To:</h3>
          <p className="font-bold text-gray-900">{customerName}</p>
          <p className="text-gray-700 mt-1">
            Phone: {customerPhone || 'N/A'}
            {secondaryPhone ? `, ${secondaryPhone}` : ''}
          </p>
          <p className="text-gray-700 mt-0.5">Email: {customerEmail || 'N/A'}</p>
          <p className="text-gray-700 mt-0.5 whitespace-pre-line">Address: {customerAddress}</p>
        </div>

        <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg">
          <h3 className="font-bold text-gray-800 border-b border-gray-200 pb-1.5 mb-2 text-xs uppercase tracking-wider">Order Details:</h3>
          <div className="space-y-1 text-gray-700 text-sm">
            <div><strong className="font-semibold">Sales Type:</strong> {orderType}</div>
            <div><strong className="font-semibold">Courier:</strong> {courierName}</div>
            <div><strong className="font-semibold">Delivery Method:</strong> {deliveryMethod}</div>
            <div><strong className="font-semibold">Processed By:</strong> {processedBy}</div>
          </div>
        </div>
      </div>

      {/* Items Table */}
      <div className="overflow-x-auto mb-6">
        <table className="w-full text-left border-collapse border border-gray-200">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200">
              <th className="py-2.5 px-3.5 text-xs font-bold text-gray-900 uppercase tracking-wider w-[50%]">Item Description</th>
              <th className="py-2.5 px-3.5 text-xs font-bold text-gray-900 uppercase tracking-wider text-center">Qty</th>
              <th className="py-2.5 px-3.5 text-xs font-bold text-gray-900 uppercase tracking-wider text-right">Price (৳)</th>
              <th className="py-2.5 px-3.5 text-xs font-bold text-gray-900 uppercase tracking-wider text-right">Total (৳)</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {items.map((item: any, idx: number) => {
              const qty = Number(item.quantity || item.qty || 1);
              const price = Number(item.price || (item.total ? item.total / qty : 0));
              const itemTotal = Number(item.total || (price * qty));
              const imgPath = item.thumbnail_image || item.product?.thumbnail_image || item.image || item.thumbnail_url || item.product?.image_url;

              return (
                <tr key={item.id || idx}>
                  <td className="py-2.5 px-3.5">
                    <div className="flex items-center">
                      {imgPath ? (
                        /* eslint-disable-next-line @next/next/no-img-element */
                        <img
                          src={getImageUrl(imgPath)}
                          alt={item.product_name || item.name}
                          className="w-10 h-10 object-cover rounded mr-3 border border-gray-200 shrink-0"
                        />
                      ) : (
                        <div className="w-10 h-10 bg-slate-100 rounded border border-gray-200 flex items-center justify-center text-[9px] text-gray-400 mr-3 shrink-0">
                          No Img
                        </div>
                      )}
                      <div>
                        <p className="font-semibold text-gray-900 leading-tight">{item.product_name || item.name}</p>
                        {(item.variant_name || item.variant?.name) && (
                          <p className="text-xs text-gray-500">Variant: {item.variant_name || item.variant?.name}</p>
                        )}
                      </div>
                    </div>
                  </td>
                  <td className="py-2.5 px-3.5 text-center text-gray-800">{qty}</td>
                  <td className="py-2.5 px-3.5 text-right text-gray-800">{price.toFixed(2)}</td>
                  <td className="py-2.5 px-3.5 text-right text-gray-900 font-medium">{itemTotal.toFixed(2)}</td>
                </tr>
              );
            })}
            {/* Total Quantity Row */}
            <tr className="border-t-2 border-gray-300 font-bold bg-slate-50/50">
              <td className="py-2.5 px-3.5 text-gray-900">Total Quantity:</td>
              <td className="py-2.5 px-3.5 text-center text-gray-900">{totalQuantity}</td>
              <td colSpan={2} className="py-2.5 px-3.5"></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Totals Summary */}
      <div className="flex flex-row justify-end mb-6">
        <div className="w-80 border-t-2 border-gray-800 pt-3 space-y-1.5 text-sm">
          <div className="flex justify-between text-gray-700">
            <span>Subtotal:</span>
            <span>৳{subtotal.toFixed(2)}</span>
          </div>

          {couponDiscount > 0 && (
            <div className="flex justify-between text-emerald-700">
              <span>Coupon Discount{couponCode ? ` (${couponCode})` : ''}:</span>
              <span>-৳{couponDiscount.toFixed(2)}</span>
            </div>
          )}

          {manualDiscount > 0 && (
            <div className="flex justify-between text-red-700">
              <span>Manual Discount{manualDiscountReason ? ` (${manualDiscountReason})` : ''}:</span>
              <span>-৳{manualDiscount.toFixed(2)}</span>
            </div>
          )}

          <div className="flex justify-between text-gray-700">
            <span>Courier Charge:{totalWeight !== null && totalWeight > 0 ? ` (${totalWeight.toFixed(2)} kg)` : ''}</span>
            <span>৳{courierCharge.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-300 pt-2 mt-1">
            <span>Total Amount:</span>
            <span>৳{totalAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between text-gray-700 pt-1">
            <span>Advance/Paid:</span>
            <span>৳{advanceAmount.toFixed(2)}</span>
          </div>

          <div className="flex justify-between font-bold text-red-600 text-base border-t border-gray-200 pt-1">
            <span>Due Amount:</span>
            <span>৳{dueAmount.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Invoice Note */}
      {invoiceNote && (
        <div className="mt-4 p-3.5 bg-amber-50/80 border border-amber-200 rounded-md text-xs text-amber-900 max-w-lg mb-6">
          <strong className="block font-bold text-sm text-amber-950 mb-1">Invoice Note:</strong>
          <p className="whitespace-pre-line">{invoiceNote}</p>
        </div>
      )}

      {/* Footer */}
      <div className="mt-8 pt-4 border-t border-gray-200 text-center text-xs text-gray-500 space-y-1">
        <p>If you have any questions about this invoice, please contact our support team.</p>
        <strong className="text-gray-700 font-semibold">Thank you for your business!</strong>
      </div>
    </div>
  );

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: `
        @media screen {
          .printable-invoice-inline {
            display: ${showOnScreen ? 'block' : 'none'} !important;
          }
          #invoice-portal-root {
            display: none !important;
          }
        }
        @media print {
          @page {
            margin: 0;
            size: auto;
          }
          body > *:not(#invoice-portal-root) {
            display: none !important;
          }
          body > #invoice-portal-root {
            display: block !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          #printable-invoice-wrapper-portal {
            display: block !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 1.2cm !important;
          }
          .no-print {
            display: none !important;
          }
        }
      `}} />

      {/* Inline view for screen display inside card container */}
      <div className="printable-invoice-inline w-full">
        {invoiceMarkup}
      </div>

      {/* Portal view for 1-page clean printing attached to body */}
      {portalContainer && createPortal(
        <div id="printable-invoice-wrapper-portal" className="bg-white text-black w-full">
          {invoiceMarkup}
        </div>,
        portalContainer
      )}
    </>
  );
}


