'use client';

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Printer, Loader2 } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { useSettings } from "@/providers/SettingsProvider";
import { fetchWholesalerOrderDetails } from "@/lib/api/wholesaler";
import { toast } from "sonner";
import OrderInvoice from "@/components/shared/OrderInvoice";

export default function WholesalerInvoice() {
  const params = useParams();
  const orderId = params?.id as string;
  const { token, isLoading } = useAuth();
  const { settings } = useSettings();
  const router = useRouter();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isLoading) return;
    if (!token) {
        setLoading(false);
        router.replace('/login');
        return;
    }
    if (!orderId) return;

    const loadData = async () => {
      setLoading(true);
      try {
        const res = await fetchWholesalerOrderDetails(token, orderId);
        setOrder(res.order);
      } catch (err: any) {
        toast.error(err.message || "Failed to load order invoice");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [token, orderId, isLoading, router]);

  // Auto print when order is fully loaded
  useEffect(() => {
    if (!loading && order) {
      const timer = setTimeout(() => {
        window.print();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [loading, order]);

  const handlePrint = () => {
    window.print();
  };

  if (loading || isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center text-gray-500">
          <Loader2 className="animate-spin mx-auto text-primary mb-3" size={32} />
          <p>Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center py-12">
          <h2 className="text-xl font-bold text-gray-900">Invoice Not Found</h2>
          <p className="text-gray-500 mt-2">The invoice you're looking for doesn't exist.</p>
          <Link href={`/dashboard/wholesaler/orders`} className="inline-flex items-center gap-2 mt-6 text-primary hover:underline">
            <ArrowLeft size={16} /> Back to Orders
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-6 px-4 print:py-0 print:px-0 print:bg-white rounded-2xl min-h-screen">
      {/* Top Bar (Hidden in Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link 
          href={`/dashboard/wholesaler/orders`} 
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-primary transition-colors font-medium"
        >
          <ArrowLeft size={16} /> Back to Orders
        </Link>
        <button 
          onClick={handlePrint}
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition-colors shadow-sm"
        >
          <Printer size={16} /> Print / Save as PDF
        </button>
      </div>

      {/* Shared OrderInvoice Component */}
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-6 md:p-10 print:shadow-none print:border-none print:p-0">
        <OrderInvoice 
          orderData={order} 
          settings={settings} 
          showOnScreen={true} 
        />
      </div>
    </div>
  );
}

