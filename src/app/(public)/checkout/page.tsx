'use client';

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";
import {
  CreditCard,
  Truck,
  CheckCircle2,
  Smartphone,
  Clipboard,
  Loader2,
  Tag,
  MapPin,
  Building2,
  ShieldCheck,
  ChevronRight,
  ArrowLeft,
  Copy,
  Check,
} from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { toast } from "react-toastify";
import { trackBeginCheckout } from "@/lib/analytics/dataLayer";
import {
  applyCoupon,
  placeOrder,
  getShippingRates,
  calculateShippingCharge,
  getPaymentMethods,
  DEFAULT_SHIPPING_RATES,
  DEFAULT_PAYMENT_METHODS,
  ShippingRate,
  PaymentMethod,
} from "@/lib/api/checkout";

const BD_DISTRICTS = [
  "Dhaka", "Gazipur", "Narayanganj", "Chattogram", "Sylhet", "Rajshahi", "Khulna",
  "Barisal", "Rangpur", "Mymensingh", "Cumilla", "Bagerhat", "Bandarban", "Barguna",
  "Bhola", "Bogra", "Brahmanbaria", "Chandpur", "Chapai Nawabganj", "Chuadanga",
  "Cox's Bazar", "Dinajpur", "Faridpur", "Feni", "Gaibandha", "Gopalganj", "Habiganj",
  "Jamalpur", "Jashore", "Jhalokati", "Jhenaidah", "Joypurhat", "Khagrachari",
  "Kishoreganj", "Kurigram", "Kushtia", "Lakshmipur", "Lalmonirhat", "Madaripur",
  "Magura", "Manikganj", "Meherpur", "Moulvibazar", "Munshiganj", "Naogaon", "Narail",
  "Narsingdi", "Natore", "Netrokona", "Nilphamari", "Noakhali", "Pabna", "Panchagarh",
  "Patuakhali", "Pirojpur", "Rajbari", "Rangamati", "Satkhira", "Shariatpur",
  "Sherpur", "Sirajganj", "Sunamganj", "Tangail", "Thakurgaon",
];

export default function CheckoutPage() {
  const { items: cartItems, subtotal, clearCart, isLoaded, setIsCartOpen } = useCart();
  const router = useRouter();
  const { user, token } = useAuth();

  const hasTrackedBeginCheckout = useRef(false);

  // Form State
  const [formData, setFormData] = useState({
    fullName: user?.name || "",
    phone: user?.phone || "",
    email: user?.email || "",
    district: "Dhaka",
    address: "",
    note: "",
  });

  // Shipping & Delivery States
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>(DEFAULT_SHIPPING_RATES);
  const [isLoadingRates, setIsLoadingRates] = useState(true);
  const [isDhaka, setIsDhaka] = useState(true);
  const [selectedRateId, setSelectedRateId] = useState<number>(1);
  const [deliveryMethod, setDeliveryMethod] = useState("Home Delivery (Standard)");
  const [courierCharge, setCourierCharge] = useState(70);

  // Payment Methods State
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>(DEFAULT_PAYMENT_METHODS);
  const [isLoadingPayments, setIsLoadingPayments] = useState(true);
  const [paymentMethod, setPaymentMethod] = useState("1");
  const [transactionId, setTransactionId] = useState("");
  const [copiedNumber, setCopiedNumber] = useState(false);

  // Coupon State
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const [couponLoading, setCouponLoading] = useState(false);
  const [customCouponCode, setCustomCouponCode] = useState("");
  const [showCouponInput, setShowCouponInput] = useState(false);

  // Submitting States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccessRedirecting, setIsSuccessRedirecting] = useState(false);

  useEffect(() => {
    if (isLoaded && cartItems.length > 0 && !hasTrackedBeginCheckout.current) {
      trackBeginCheckout(cartItems, subtotal);
      hasTrackedBeginCheckout.current = true;
    }
  }, [isLoaded, cartItems, subtotal]);

  useEffect(() => {
    const fetchRates = async () => {
      try {
        const res = await getShippingRates();
        if (res.success && res.shipping_rates && res.shipping_rates.length > 0) {
          setShippingRates(res.shipping_rates);
          const firstRate = res.shipping_rates[0];
          setSelectedRateId(firstRate.id);
          setDeliveryMethod(firstRate.name);
          const charge = calculateShippingCharge(firstRate, getTotalWeight(), isDhaka);
          setCourierCharge(charge);
        }
      } catch (err) {
        console.warn("Using default shipping rates", err);
      } finally {
        setIsLoadingRates(false);
      }
    };
    fetchRates();
  }, []);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const res = await getPaymentMethods();
        if (res.success && res.data && res.data.length > 0) {
          setPaymentMethods(res.data);
          setPaymentMethod(res.data[0].id.toString());
        }
      } catch (err) {
        console.warn("Using default payment methods", err);
      } finally {
        setIsLoadingPayments(false);
      }
    };
    fetchPayments();
  }, []);

  const getTotalWeight = (): number => {
    return cartItems.reduce((acc, item) => acc + ((item.weight || 0.5) * item.quantity), 0);
  };

  useEffect(() => {
    const rate = shippingRates.find((r) => r.id === selectedRateId) || shippingRates[0];
    if (rate) {
      const charge = calculateShippingCharge(rate, getTotalWeight(), isDhaka);
      setCourierCharge(charge);
    }
  }, [isDhaka, selectedRateId, shippingRates, cartItems]);

  const handleLocationChange = (area: "dhaka" | "outside-dhaka") => {
    const inside = area === "dhaka";
    setIsDhaka(inside);
    if (inside && formData.district !== "Dhaka") {
      setFormData((prev) => ({ ...prev, district: "Dhaka" }));
    } else if (!inside && formData.district === "Dhaka") {
      setFormData((prev) => ({ ...prev, district: "Chattogram" }));
    }
  };

  const handleDeliveryMethodChange = (rateId: number) => {
    const rate = shippingRates.find((r) => r.id === rateId);
    if (rate) {
      setSelectedRateId(rateId);
      setDeliveryMethod(rate.name);
      const charge = calculateShippingCharge(rate, getTotalWeight(), isDhaka);
      setCourierCharge(charge);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "district") {
      if (value.toLowerCase() === "dhaka") {
        setIsDhaka(true);
      } else {
        setIsDhaka(false);
      }
    }
  };

  const handleApplyCoupon = async (code: string) => {
    if (!code.trim()) return;
    setCouponLoading(true);
    try {
      const productsInput = cartItems.map((item) => {
        const parts = item.id.split("-");
        const productId = parseInt(parts[0]) || 1;
        const variantId = parts[1] && parts[1] !== "default" ? parseInt(parts[1]) : null;
        return {
          product_id: productId,
          variant_id: variantId,
          quantity: item.quantity,
          price: item.price,
        };
      });

      const res = await applyCoupon(code, formData.phone, productsInput);
      if (res.success) {
        setAppliedCoupon(code.toUpperCase());
        setDiscountAmount(Number(res.discount));
        toast.success(res.message || `Coupon "${code}" applied successfully!`);
      }
    } catch (err: any) {
      toast.error(err?.message || "Invalid coupon code.");
    } finally {
      setCouponLoading(false);
      setCustomCouponCode("");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setDiscountAmount(0);
    toast.info("Coupon removed.");
  };

  const total = Math.max(0, subtotal - discountAmount + courierCharge);
  const handleCheckoutSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cartItems.length === 0) {
      toast.error("Your shopping bag is empty!");
      return;
    }

    if (!formData.fullName.trim() || !formData.phone.trim() || !formData.address.trim()) {
      toast.error("Please fill in your name, phone number, and address.");
      return;
    }

    const selectedPayment = paymentMethods.find((m) => m.id.toString() === paymentMethod);
    const isCod = selectedPayment?.name.toLowerCase().includes("cash on delivery");

    if (!isCod && !transactionId.trim()) {
      toast.error("Please enter the Transaction ID (TrxID) for mobile/card payment.");
      return;
    }

    setIsSubmitting(true);

    try {
      const mappedProducts = cartItems.map((item) => {
        const parts = item.id.split("-");
        const productId = parseInt(parts[0]) || 1;
        const variantId = parts[1] && parts[1] !== "default" ? parseInt(parts[1]) : null;
        return {
          product_id: productId,
          variant_id: variantId,
          quantity: item.quantity,
          price: item.price,
        };
      });

      const payload = {
        customer_id: user?.id || undefined,
        phone: formData.phone,
        name: formData.fullName,
        address: `${formData.address}, ${formData.district}`,
        email: formData.email || undefined,
        note: formData.note || undefined,
        coupon_code: appliedCoupon || undefined,
        delivery_method: deliveryMethod,
        courier_charge: courierCharge,
        payment_method: selectedPayment?.name || "Cash on Delivery",
        transaction_no: !isCod ? transactionId : undefined,
        products: mappedProducts,
      };

      const res = await placeOrder(payload as any, token);

      if (res.success) {
        setIsSuccessRedirecting(true);
        clearCart();
        toast.success("Order confirmed successfully!");

        const orderConfirmState = {
          orderId: res.order?.order_no || "VEL-" + Math.floor(100000 + Math.random() * 900000),
          customerName: formData.fullName,
          phone: formData.phone,
          email: formData.email || "",
          address: `${formData.address}, ${formData.district}`,
          district: formData.district,
          paymentMethod: selectedPayment?.name || "Cash on Delivery",
          items: cartItems,
          subtotal,
          discountAmount,
          appliedCoupon,
          shipping: courierCharge,
          total,
        };

        sessionStorage.setItem("orderConfirmState", JSON.stringify(orderConfirmState));
        sessionStorage.setItem("lastOrder", JSON.stringify(orderConfirmState));
        router.push("/order-confirmation");
      } else {
        toast.error(res.message || "Failed to place order.");
      }
    } catch (err: any) {
      toast.error(err?.message || "Something went wrong. Please check your information.");
    } finally {
      if (!isSuccessRedirecting) {
        setIsSubmitting(false);
      }
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedNumber(true);
    toast.success("Merchant number copied!");
    setTimeout(() => setCopiedNumber(false), 2500);
  };

  const selectedPaymentObj = paymentMethods.find((m) => m.id.toString() === paymentMethod);
  const isCodSelected = selectedPaymentObj?.name.toLowerCase().includes("cash on delivery");

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-stone-50">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-sm font-medium text-stone-600">Preparing checkout...</p>
        </div>
      </div>
    );
  }

  if (cartItems.length === 0 && !isSuccessRedirecting) {
    return (
      <div className="min-h-screen bg-stone-50 py-16">
        <div className="container-main max-w-md mx-auto text-center bg-white p-8 rounded-2xl border border-stone-200 shadow-sm">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4 text-stone-400">
            <Clipboard size={28} />
          </div>
          <h2 className="text-xl font-bold text-stone-900 mb-2">Your Bag is Empty</h2>
          <p className="text-sm text-stone-500 mb-6">Looks like you haven&apos;t added any fashion items to your shopping bag yet.</p>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center w-full py-3 px-6 rounded-xl bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-colors shadow-sm"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-stone-50/70 py-6 md:py-10">
      <div className="container-main max-w-6xl mx-auto px-4">
        {/* Header Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
          <div>
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-xs text-stone-500 mb-1">
              <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
              <ChevronRight size={12} />
              <Link href="/shop" className="hover:text-stone-900 transition-colors">Shop</Link>
              <ChevronRight size={12} />
              <span className="text-stone-900 font-semibold">Checkout</span>
            </nav>
            <h1 className="text-2xl md:text-3xl font-serif font-bold text-stone-900">Checkout & Payment</h1>
          </div>
          <button
            type="button"
            onClick={() => setIsCartOpen(true)}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-primary transition-colors bg-white px-3.5 py-2 rounded-lg border border-stone-200 shadow-2xs"
          >
            <ArrowLeft size={14} /> Back to Bag ({cartItems.reduce((a, b) => a + b.quantity, 0)} items)
          </button>
        </div>

        <form onSubmit={handleCheckoutSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Form & Methods */}
          <div className="lg:col-span-7 space-y-6">

            {/* STEP 1: Shipping Information */}
            <section className="bg-white rounded-2xl border border-stone-200/80 p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">1</span>
                  <div>
                    <h2 className="text-base font-bold text-stone-900">Shipping & Customer Information</h2>
                    <p className="text-xs text-stone-500">Enter where you would like your order delivered</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Full Name (আপনার নাম) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="e.g. Masum Billah"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Phone Number (ফোন নম্বর) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="017XXXXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all"
                  />
                </div>

                {/* Email */}
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Email Address (ঐচ্ছিক)
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="name@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all"
                  />
                </div>

                {/* District */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    District / City (জেলা) <span className="text-rose-500">*</span>
                  </label>
                  <select
                    name="district"
                    value={formData.district}
                    onChange={handleInputChange}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm text-stone-900 outline-none transition-all bg-white"
                  >
                    {BD_DISTRICTS.map((dist) => (
                      <option key={dist} value={dist}>
                        {dist} {dist === "Dhaka" ? "(Inside Dhaka)" : "(Outside Dhaka)"}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Delivery Address */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Full Street Address (পূর্ণ ঠিকানা) <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    rows={2}
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House number, road number, area / thana, landmark"
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm text-stone-900 placeholder:text-stone-400 outline-none transition-all resize-none"
                  />
                </div>

                {/* Order Note */}
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-1.5">
                    Order Note / Instructions (ঐচ্ছিক)
                  </label>
                  <input
                    type="text"
                    name="note"
                    value={formData.note}
                    onChange={handleInputChange}
                    placeholder="Special delivery instructions, preferred delivery time, etc."
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-200 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-xs text-stone-900 placeholder:text-stone-400 outline-none transition-all"
                  />
                </div>
              </div>
            </section>

            {/* STEP 2: Delivery Area & Delivery Method */}
            <section className="bg-white rounded-2xl border border-stone-200/80 p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">2</span>
                  <div>
                    <h2 className="text-base font-bold text-stone-900">Delivery Area & Shipping Method</h2>
                    <p className="text-xs text-stone-500">Select Inside or Outside Dhaka to calculate accurate delivery charge</p>
                  </div>
                </div>
                <Truck className="w-5 h-5 text-stone-400" />
              </div>

              {/* Inside Dhaka / Outside Dhaka Selector */}
              <div className="mb-6">
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2.5">
                  1. Select Shipping Area (শিপিং এরিয়া নির্বাচন করুন) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {/* Inside Dhaka Card */}
                  <button
                    type="button"
                    onClick={() => handleLocationChange("dhaka")}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      isDhaka
                        ? "border-stone-900 bg-stone-900/5 shadow-2xs"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                      isDhaka ? "border-stone-900" : "border-stone-300"
                    }`}>
                      {isDhaka && <div className="w-2.5 h-2.5 rounded-full bg-stone-900" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                          <Building2 size={15} className="text-stone-700" /> Inside Dhaka (ঢাকা সিটি)
                        </span>
                        <span className="font-extrabold text-sm text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                          ৳70
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">Delivery time: 24 - 48 Hours</p>
                    </div>
                  </button>

                  {/* Outside Dhaka Card */}
                  <button
                    type="button"
                    onClick={() => handleLocationChange("outside-dhaka")}
                    className={`flex items-start gap-3.5 p-4 rounded-xl border-2 text-left transition-all cursor-pointer ${
                      !isDhaka
                        ? "border-stone-900 bg-stone-900/5 shadow-2xs"
                        : "border-stone-200 hover:border-stone-300 bg-white"
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 flex-shrink-0 ${
                      !isDhaka ? "border-stone-900" : "border-stone-300"
                    }`}>
                      {!isDhaka && <div className="w-2.5 h-2.5 rounded-full bg-stone-900" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm text-stone-900 flex items-center gap-1.5">
                          <MapPin size={15} className="text-stone-700" /> Outside Dhaka (ঢাকার বাইরে)
                        </span>
                        <span className="font-extrabold text-sm text-stone-900 bg-stone-100 px-2 py-0.5 rounded-md">
                          ৳130
                        </span>
                      </div>
                      <p className="text-xs text-stone-500 mt-1">Delivery time: 2 - 4 Business Days</p>
                    </div>
                  </button>
                </div>
              </div>

              {/* Delivery Methods List */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-stone-700 mb-2.5">
                  2. Choose Delivery Method (ডেলিভারি মাধ্যম) <span className="text-rose-500">*</span>
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {shippingRates.map((rate) => {
                    const isSelected = selectedRateId === rate.id;
                    const charge = calculateShippingCharge(rate, getTotalWeight(), isDhaka);
                    return (
                      <div
                        key={rate.id}
                        onClick={() => handleDeliveryMethodChange(rate.id)}
                        className={`p-3.5 rounded-xl border cursor-pointer transition-all flex flex-col justify-between ${
                          isSelected
                            ? "border-stone-900 bg-stone-50 ring-1 ring-stone-900"
                            : "border-stone-200 hover:border-stone-300 bg-white"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2 mb-1.5">
                          <div className="flex items-center gap-2">
                            <input
                              type="radio"
                              name="shippingRateOption"
                              checked={isSelected}
                              onChange={() => handleDeliveryMethodChange(rate.id)}
                              className="w-4 h-4 text-stone-900 focus:ring-stone-900 cursor-pointer"
                            />
                            <span className="font-bold text-xs md:text-sm text-stone-900 leading-tight">
                              {rate.name}
                            </span>
                          </div>
                          <span className="text-xs font-extrabold text-stone-900 whitespace-nowrap bg-white px-2 py-0.5 rounded border border-stone-200">
                            ৳{charge}
                          </span>
                        </div>
                        <p className="text-[11px] text-stone-500 pl-6 leading-relaxed">
                          {rate.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>
            {/* STEP 3: Payment Method */}
            <section className="bg-white rounded-2xl border border-stone-200/80 p-5 md:p-6 shadow-sm">
              <div className="flex items-center justify-between pb-4 mb-5 border-b border-stone-100">
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-stone-900 text-white flex items-center justify-center text-xs font-bold">3</span>
                  <div>
                    <h2 className="text-base font-bold text-stone-900">Payment Method (পেমেন্ট পদ্ধতি)</h2>
                    <p className="text-xs text-stone-500">Select Cash on Delivery or Mobile / Card payment</p>
                  </div>
                </div>
                <CreditCard className="w-5 h-5 text-stone-400" />
              </div>

              {/* Payment Option Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                {paymentMethods.map((method) => {
                  const isSelected = paymentMethod === method.id.toString();
                  return (
                    <div
                      key={method.id}
                      onClick={() => setPaymentMethod(method.id.toString())}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-start gap-3 ${
                        isSelected
                          ? "border-stone-900 bg-stone-50 ring-1 ring-stone-900"
                          : "border-stone-200 hover:border-stone-300 bg-white"
                      }`}
                    >
                      <input
                        type="radio"
                        name="paymentOption"
                        checked={isSelected}
                        onChange={() => setPaymentMethod(method.id.toString())}
                        className="w-4 h-4 mt-0.5 text-stone-900 focus:ring-stone-900 cursor-pointer"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-1.5 font-bold text-sm text-stone-900">
                          {method.icon && <span>{method.icon}</span>}
                          <span>{method.name}</span>
                        </div>
                        <p className="text-xs text-stone-500 mt-0.5 leading-snug">
                          {method.short_description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Dynamic Instructions for Selected Non-COD Payment */}
              {!isCodSelected && selectedPaymentObj && (
                <div className="mt-4 p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 space-y-3">
                  <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                    <Smartphone size={16} />
                    <span>How to pay with {selectedPaymentObj.name}</span>
                  </div>

                  {selectedPaymentObj.number && (
                    <div className="flex items-center justify-between p-2.5 bg-white rounded-lg border border-amber-200">
                      <div>
                        <span className="text-[11px] text-stone-500 block">Merchant Account Number:</span>
                        <span className="text-sm font-extrabold text-stone-900 tracking-wide font-mono">
                          {selectedPaymentObj.number}
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => copyToClipboard(selectedPaymentObj.number!)}
                        className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-md transition-colors cursor-pointer"
                      >
                        {copiedNumber ? <Check size={13} className="text-emerald-600" /> : <Copy size={13} />}
                        <span>{copiedNumber ? "Copied" : "Copy"}</span>
                      </button>
                    </div>
                  )}

                  {selectedPaymentObj.steps && selectedPaymentObj.steps.length > 0 && (
                    <ol className="text-xs text-stone-700 space-y-1 list-decimal list-inside pl-1">
                      {selectedPaymentObj.steps.map((step, idx) => (
                        <li key={idx}>{step}</li>
                      ))}
                    </ol>
                  )}

                  <div>
                    <label className="block text-xs font-semibold uppercase tracking-wider text-stone-800 mb-1">
                      Transaction ID (TrxID) <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required={!isCodSelected}
                      value={transactionId}
                      onChange={(e) => setTransactionId(e.target.value.trim())}
                      placeholder="e.g. 9J28DA120X"
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 focus:border-stone-900 focus:ring-1 focus:ring-stone-900 text-sm font-mono uppercase text-stone-900 bg-white outline-none"
                    />
                    <p className="text-[11px] text-stone-500 mt-1">
                      Enter the transaction ID received from your mobile payment confirmation SMS.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-2xl border border-stone-200/80 p-5 md:p-6 shadow-sm sticky top-24 space-y-5">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-serif font-bold text-lg text-stone-900 flex items-center gap-2">
                  <Clipboard size={18} className="text-stone-700" /> Order Summary
                </h3>
                <span className="text-xs font-medium text-stone-500">
                  {cartItems.reduce((a, b) => a + b.quantity, 0)} Items
                </span>
              </div>

              {/* Item List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.id} className="flex items-center gap-3 pb-3 border-b border-stone-100 last:border-0 last:pb-0">
                    <div className="w-14 h-16 rounded-lg bg-stone-100 overflow-hidden relative flex-shrink-0 border border-stone-200/60">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                        sizes="56px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-xs font-semibold text-stone-900 truncate">{item.name}</h4>
                      <div className="flex items-center gap-2 mt-1 text-[11px] text-stone-500">
                        {item.size && (
                          <span className="bg-stone-100 px-1.5 py-0.5 rounded text-stone-700 font-medium">
                            Size: {item.size}
                          </span>
                        )}
                        <span>Qty: {item.quantity}</span>
                      </div>
                      <div className="text-xs font-bold text-stone-900 mt-1">
                        ৳{(item.price * item.quantity).toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Coupon Form */}
              <div className="pt-2 border-t border-stone-100">
                {appliedCoupon ? (
                  <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200/80 px-3.5 py-2.5 rounded-xl text-xs text-emerald-900 font-medium">
                    <div className="flex items-center gap-1.5">
                      <Tag size={14} className="text-emerald-600" />
                      <span>Coupon <strong>{appliedCoupon}</strong> (-৳{discountAmount.toLocaleString()})</span>
                    </div>
                    <button
                      type="button"
                      onClick={handleRemoveCoupon}
                      className="text-rose-600 font-bold hover:underline ml-2 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                ) : !showCouponInput ? (
                  <div className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => setShowCouponInput(true)}
                      className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-700 hover:text-stone-900 transition-colors cursor-pointer"
                    >
                      <Tag size={14} /> Have a Promo Code?
                    </button>
                    <button
                      type="button"
                      onClick={() => handleApplyCoupon("VELURA10")}
                      className="text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 px-2 py-0.5 rounded font-mono font-medium transition-colors cursor-pointer"
                    >
                      Apply &ldquo;VELURA10&rdquo;
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Enter promo code (e.g. VELURA10)"
                      value={customCouponCode}
                      onChange={(e) => setCustomCouponCode(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-xl border border-stone-200 text-xs outline-none focus:border-stone-900 uppercase font-mono"
                    />
                    <button
                      type="button"
                      disabled={couponLoading || !customCouponCode.trim()}
                      onClick={() => handleApplyCoupon(customCouponCode)}
                      className="px-4 py-2 bg-stone-900 hover:bg-stone-800 disabled:bg-stone-300 text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      {couponLoading ? "..." : "Apply"}
                    </button>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-2 pt-3 border-t border-stone-100 text-xs">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">৳{subtotal.toLocaleString()}</span>
                </div>

                {discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount</span>
                    <span>-৳{discountAmount.toLocaleString()}</span>
                  </div>
                )}

                <div className="flex justify-between text-stone-600">
                  <span className="flex items-center gap-1">
                    Shipping ({isDhaka ? "Inside Dhaka" : "Outside Dhaka"})
                  </span>
                  <span className="font-semibold text-stone-900">৳{courierCharge.toLocaleString()}</span>
                </div>

                <div className="flex justify-between items-baseline pt-3 border-t border-stone-200 text-stone-900">
                  <span className="text-sm font-bold">Total Amount</span>
                  <div className="text-right">
                    <span className="text-xl font-extrabold text-stone-900">৳{total.toLocaleString()}</span>
                    <p className="text-[10px] text-stone-400 font-normal">VAT included</p>
                  </div>
                </div>
              </div>

              {/* Submit Order Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 px-6 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-sm tracking-wide transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-75 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 size={16} className="animate-spin" />
                    <span>Processing Order...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Confirm Order • ৳{total.toLocaleString()}</span>
                  </>
                )}
              </button>

              {/* Trust Badges */}
              <div className="pt-2 border-t border-stone-100 grid grid-cols-2 gap-2 text-center text-[11px] text-stone-500">
                <div className="flex items-center justify-center gap-1 bg-stone-50 py-1.5 px-2 rounded-lg border border-stone-200/50">
                  <ShieldCheck size={13} className="text-emerald-600" />
                  <span>100% Genuine</span>
                </div>
                <div className="flex items-center justify-center gap-1 bg-stone-50 py-1.5 px-2 rounded-lg border border-stone-200/50">
                  <Truck size={13} className="text-stone-700" />
                  <span>Fast Delivery</span>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
