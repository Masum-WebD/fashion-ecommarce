'use client';

import { useRouter } from "next/navigation";
import { useAuth, UserRole } from "@/providers/AuthProvider";
import { ShoppingBag, Store, Share2, ArrowRight, Home } from "lucide-react";
import Link from "next/link";
import Image from "next/image";


const dashboards: {
  role: UserRole;
  title: string;
  description: string;
  icon: React.ElementType;
  color: string;
  bgColor: string;
  borderColor: string;
  features: string[];
}[] = [
  {
    role: "customer",
    title: "Customer Dashboard",
    description: "Track orders, manage wishlist, and view your purchase history",
    icon: ShoppingBag,
    color: "text-primary",
    bgColor: "bg-primary",
    borderColor: "border-primary/20 hover:border-primary/40",
    features: ["Order Tracking", "Wishlist", "Reviews", "Addresses", "Payment Methods"],
  },
  {
    role: "wholesaler",
    title: "Wholesaler Dashboard",
    description: "Manage products, process orders, and track your business analytics",
    icon: Store,
    color: "text-primary",
    bgColor: "bg-primary",
    borderColor: "border-primary/20 hover:border-primary/40",
    features: ["Product Management", "Order Processing", "Inventory", "Analytics", "Revenue Reports"],
  },
  {
    role: "affiliate",
    title: "Affiliate Dashboard",
    description: "Track referrals, manage links, and monitor your commission earnings",
    icon: Share2,
    color: "text-purple-600",
    bgColor: "bg-purple-600",
    borderColor: "border-purple-200 hover:border-purple-400",
    features: ["Referral Links", "Commission Tracking", "Performance Analytics", "Payouts", "Resources"],
  },
];

export default function DashboardSelect() {
  const router = useRouter();
  const { setAuth } = useAuth();

  const handleSelect = (role: UserRole) => {
    const mockCustomer = {
      id: 999,
      name: `Demo ${role}`,
      phone: "01700000000",
      email: "demo@sirajtech.com",
      address: "Dhaka, Bangladesh",
      profile_pic: null,
      user_type_id: role === "wholesaler" ? 2 : 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      is_affiliate: role === "affiliate",
      affiliate_code: role === "affiliate" ? "DEMO123" : null,
      referred_by: null,
      total_referrals: 0,
      total_earnings: "0.00",
      available_balance: "0.00",
      status: "active",
    };
    setAuth(mockCustomer, "demo_token");
    router.push(role === "wholesaler" ? "/dashboard/customer" : `/dashboard/${role}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 py-4 px-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image src="/assets/logo.png" alt="Siraj Tech" width={150} height={40} className="object-contain" priority />
          </Link>
          <Link
            href="/"
            className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors"
          >
            <Home size={16} />
            Back to Store
          </Link>
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="max-w-5xl w-full">
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Choose Your Dashboard</h1>
            <p className="text-gray-500 mt-3 max-w-lg mx-auto">
              Select the dashboard that matches your role to access your personalized panel
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {dashboards.map((dashboard) => {
              const Icon = dashboard.icon;
              return (
                <button
                  key={dashboard.role}
                  onClick={() => handleSelect(dashboard.role)}
                  className={`group bg-white rounded-2xl border-2 ${dashboard.borderColor} p-6 text-left transition-all duration-300 hover:shadow-xl hover:-translate-y-1`}
                >
                  {/* Icon */}
                  <div
                    className={`w-14 h-14 rounded-2xl ${dashboard.bgColor} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <Icon size={24} className="text-white" />
                  </div>

                  {/* Title & Description */}
                  <h3 className="text-lg font-bold text-gray-900 mb-2">{dashboard.title}</h3>
                  <p className="text-sm text-gray-500 mb-5 leading-relaxed">{dashboard.description}</p>

                  {/* Features */}
                  <div className="space-y-2 mb-6">
                    {dashboard.features.map((feature) => (
                      <div key={feature} className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${dashboard.bgColor}`} />
                        <span className="text-xs text-gray-600">{feature}</span>
                      </div>
                    ))}
                  </div>

                  {/* CTA */}
                  <div
                    className={`flex items-center gap-2 text-sm font-semibold ${dashboard.color} group-hover:gap-3 transition-all`}
                  >
                    Enter Dashboard
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </div>
                </button>
              );
            })}
          </div>

          <p className="text-center text-xs text-gray-400 mt-8">
            This is a demo panel. In production, you'll be automatically directed to your assigned dashboard.
          </p>
        </div>
      </main>
    </div>
  );
}
