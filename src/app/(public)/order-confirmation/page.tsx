'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { trackPurchase } from "@/lib/analytics/dataLayer";
import {
    CheckCircle2,
    Package,
    MapPin,
    Phone,
    Mail,
    CreditCard,
    Truck,
    Smartphone,
    Tag,
    ArrowRight,
    Home,
    ShoppingBag,
    Printer,
} from "lucide-react";
import OrderInvoice from "@/components/shared/OrderInvoice";
import { useSettings } from "@/providers/SettingsProvider";

interface CartItem {
    id: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
    weight?: number;
    size?: string;
}

interface OrderState {
    orderId: string;
    customerName: string;
    phone: string;
    email: string;
    address: string;
    district?: string;
    paymentMethod: string;
    mobileProvider?: string | null;
    items: CartItem[];
    subtotal: number;
    discountAmount: number;
    appliedCoupon: string | null;
    shipping: number;
    total: number;
    tracking_user_data?: any;
}

const OrderConfirmation = () => {
    const router = useRouter();
    const { settings } = useSettings();
    const [state, setState] = useState<OrderState | null>(null);

    useEffect(() => {
        const raw = sessionStorage.getItem('orderConfirmState');
        if (!raw) {
            router.replace("/shop");
            return;
        }
        try {
            const parsed = JSON.parse(raw);
            setState(parsed);

            // GTM Purchase tracking (fire exactly once per order ID using sessionStorage tracking key)
            if (parsed && parsed.orderId) {
                const trackingKey = `gtm_purchase_tracked_${parsed.orderId}`;
                const alreadyTracked = sessionStorage.getItem(trackingKey);
                if (!alreadyTracked) {
                    trackPurchase(parsed);
                    sessionStorage.setItem(trackingKey, 'true');
                }
            }
        } catch {
            router.replace("/shop");
        }
    }, [router]);

    if (!state) return null;

    return (
        <div className="min-h-screen flex flex-col print:min-h-0 print:bg-white">
            <main className="flex-grow pb-16 bg-section-alt print:hidden">
                {/* Hero Banner */}
                <div className="bg-gradient-to-r from-green-700 to-primary-700 text-white py-8 md:py-10 text-center">
                    <div className="container-main">
                        <div className="flex justify-center mb-5">
                            <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center animate-bounce-once">
                                <CheckCircle2 size={30} className="text-white" />
                            </div>
                        </div>
                        <h1 className="text-xl md:text-3xl font-bold mb-3">Order Placed Successfully!</h1>
                        <p className="text-white/80 text-lg">Thank you for your purchase. We'll process your order shortly.</p>
                        <div className="mt-5 flex flex-col sm:flex-row items-center justify-center gap-3">
                            <div className="inline-flex bg-white/20 backdrop-blur-sm px-5 py-2.5 rounded-xl text-sm font-semibold">
                                Order ID: <span className="font-bold text-white ml-2">{state.orderId}</span>
                            </div>
                            <button 
                                onClick={() => window.print()}
                                className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-primary hover:bg-white/90 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-sm"
                            >
                                <Printer size={16} /> Download Invoice
                            </button>
                        </div>
                    </div>
                </div>

                <div className="container-main py-10 max-w-4xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

                        {/* Customer & Shipping Info */}
                        <div className="bg-white rounded-xl shadow-sm border border-border p-6 space-y-4">
                            <h2 className="font-bold text-lg pb-3 border-b border-border flex items-center gap-2">
                                <MapPin size={20} className="text-primary" /> Shipping Details
                            </h2>
                            <div className="space-y-3 text-sm">
                                <div className="flex items-start gap-3">
                                    <span className="text-muted-foreground w-24 shrink-0">Name</span>
                                    <span className="font-semibold text-foreground">{state.customerName}</span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-muted-foreground w-24 shrink-0 flex items-center gap-1"><Phone size={13} /> Phone</span>
                                    <span className="font-semibold text-foreground">{state.phone}</span>
                                </div>
                                {state.email && (
                                    <div className="flex items-start gap-3">
                                        <span className="text-muted-foreground w-24 shrink-0 flex items-center gap-1"><Mail size={13} /> Email</span>
                                        <span className="text-[10px] md:text-sm font-semibold text-foreground">{state.email}</span>
                                    </div>
                                )}
                                <div className="flex items-start gap-3">
                                    <span className="text-muted-foreground w-24 shrink-0">Address</span>
                                    <span className="font-semibold text-foreground">
                                        {state.address}{state.district ? `, ${state.district}` : ''}
                                    </span>
                                </div>
                                <div className="flex items-start gap-3">
                                    <span className="text-muted-foreground w-24 shrink-0">Payment</span>
                                    <span className="font-semibold text-foreground flex items-center gap-1.5">
                                        {state.paymentMethod}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Summary */}
                        <div className="bg-white rounded-xl shadow-sm border border-border p-6">
                            <h2 className="font-bold text-lg pb-3 border-b border-border flex items-center gap-2">
                                <Package size={20} className="text-primary" /> Order Summary
                            </h2>
                            <div className="space-y-2.5 my-4 max-h-44 overflow-y-auto pr-1">
                                {state.items.map((item) => (
                                    <div key={item.id} className="flex justify-between text-sm gap-2">
                                        <img src={item.image} width={50} height={50} alt={item.name} />
                                        <span className="line-clamp-1 flex-1 text-foreground">{item.quantity}× {item.name}</span>
                                        <span className="font-medium whitespace-nowrap">৳{(item.price * item.quantity).toLocaleString()}</span>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t border-dashed border-border pt-3 space-y-2 text-sm">
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Subtotal</span>
                                    <span>৳{state.subtotal.toLocaleString()}</span>
                                </div>
                                {state.discountAmount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span className="flex items-center gap-1"><Tag size={13} /> {state.appliedCoupon}</span>
                                        <span>-৳{state.discountAmount.toLocaleString()}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-muted-foreground">
                                    <span>Shipping</span>
                                    <span>৳{state.shipping}</span>
                                </div>
                            </div>
                            <div className="border-t border-border pt-3 mt-2 flex justify-between items-center">
                                <span className="font-bold text-base">Total Paid</span>
                                <span className="font-bold text-xl text-primary">৳{state.total.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Timeline */}
                    <div className="bg-white rounded-xl shadow-sm border border-border p-6 mb-6">
                        <h2 className="font-bold text-lg pb-4 border-b border-border mb-5">Estimated Delivery</h2>
                        <div className="flex items-center justify-between gap-2 overflow-x-auto">
                            {[
                                { label: "Order Placed", sublabel: "Just now", done: true },
                                { label: "Confirmed", sublabel: "Within 1 hr", done: false },
                                { label: "Shipped", sublabel: "1-2 days", done: false },
                                { label: "Delivered", sublabel: "3-5 days", done: false },
                            ].map((step, i, arr) => (
                                <div key={step.label} className="flex items-center gap-2">
                                    <div className="flex flex-col items-center text-center min-w-[70px]">
                                        <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-2 text-white font-bold text-sm ${step.done ? "bg-green-500" : "bg-gray-200 text-gray-400"}`}>
                                            {step.done ? <CheckCircle2 size={20} /> : i + 1}
                                        </div>
                                        <span className={`text-xs font-semibold ${step.done ? "text-green-600" : "text-muted-foreground"}`}>{step.label}</span>
                                        <span className="text-xs text-muted-foreground">{step.sublabel}</span>
                                    </div>
                                    {i < arr.length - 1 && (
                                        <div className={`h-0.5 flex-1 min-w-[20px] mx-1 rounded ${step.done ? "bg-green-400" : "bg-gray-200"}`} />
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Note */}
                    <div className="bg-amber-50 border border-amber-200 rounded-xl p-5 mb-8 text-sm text-amber-800">
                        <strong>Note:</strong> Our team will contact you at <strong>{state.phone}</strong> to confirm your order. For any queries, call us at <strong>01896261223</strong>, <strong>01901328140</strong>, or <strong>01706176403</strong>.
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link
                            href="/"
                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl border-2 border-primary text-primary font-bold hover:bg-primary hover:text-white transition-all"
                        >
                            <Home size={18} /> Go to Home
                        </Link>
                        <Link
                            href="/shop"
                            className="flex items-center justify-center gap-2 px-8 py-3 rounded-xl btn-gradient-primary text-white font-bold hover:shadow-lg transition-all"
                        >
                            <ShoppingBag size={18} /> Continue Shopping
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </main>

            <OrderInvoice 
                orderData={{
                    order_no: state.orderId,
                    created_at: new Date().toISOString(),
                    status: "Order Placed",
                    shipping_address: {
                        name: state.customerName,
                        address: state.address,
                        phone: state.phone
                    },
                    items: state.items.map(i => ({
                        id: i.id,
                        name: i.name,
                        product_name: i.name,
                        quantity: i.quantity,
                        price: i.price,
                        total: i.price * i.quantity,
                        thumbnail_url: i.image,
                        variant_name: i.size
                    })),
                    sale_amount: state.subtotal,
                    courier_charge: state.shipping,
                    discount_amount: state.discountAmount,
                    total_amount: state.total,
                }} 
                settings={settings} 
                formatDate={(dateStr) => {
                    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
                }} 
            />
        </div>
    );
};

export default OrderConfirmation;
