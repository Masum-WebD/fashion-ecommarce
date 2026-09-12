'use client';

import { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingCart,
  Package,
  User,
  LogOut,
  Menu,
  X,
  ChevronDown,
  Home,
  ClipboardList,
  TrendingUp,
  Link2,
  Share2,
  FileText,
  BanknoteIcon,
  Flag,
  HelpCircle,
  Clock,
  Lock,
  AlertCircle
} from "lucide-react";

import { useAuth, UserRole } from "@/providers/AuthProvider";
import { useSettings } from "@/providers/SettingsProvider";

import Topbar from "@/components/layout/Topbar";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Image from "next/image";

interface NavItem {
  label: string;
  href: string;
  icon: React.ElementType;
  badge?: string | number;
  children?: { label: string; href: string }[];
}

const customerNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/customer", icon: LayoutDashboard },
  { label: "My Orders", href: "/dashboard/customer/orders", icon: ShoppingCart },
  { label: "My Profile", href: "/dashboard/customer/profile", icon: User },
  { label: "Change Password", href: "/dashboard/customer/change-password", icon: Lock },
];

const wholesalerNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/customer", icon: LayoutDashboard },
  { label: "My Orders", href: "/dashboard/customer/orders", icon: ShoppingCart },
  { label: "Order List", href: "/dashboard/wholesaler/orders", icon: ClipboardList },
  { label: "Create Wholesale Order", href: "/dashboard/wholesaler/orders/create", icon: Package },
  { label: "My Profile", href: "/dashboard/customer/profile", icon: User },
  { label: "Change Password", href: "/dashboard/customer/change-password", icon: Lock },
];

const affiliateNavItems: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/affiliate", icon: LayoutDashboard },
  { label: "Product Catalog", href: "/dashboard/affiliate/products", icon: Package },
  { label: "Referrals", href: "/dashboard/affiliate/referrals", icon: Share2 },
  { label: "Campaigns", href: "/dashboard/affiliate/campaigns", icon: Flag },
  { label: "Creatives", href: "/dashboard/affiliate/creatives", icon: FileText },
  { label: "Performance", href: "/dashboard/affiliate/performance", icon: TrendingUp },
  { label: "Withdrawals", href: "/dashboard/affiliate/payouts", icon: BanknoteIcon },
  { label: "Referred Orders", href: "/dashboard/affiliate/orders", icon: ShoppingCart },
  { label: "Edit Your Account", href: "/dashboard/affiliate/profile", icon: User },
  { label: "Change Your Password", href: "/dashboard/affiliate/settings", icon: Lock },
  { label: "Help", href: "/dashboard/affiliate/help", icon: HelpCircle },
];

const roleConfig: Record<UserRole, { navItems: NavItem[]; label: string; color: string; bgColor: string }> = {
  customer: {
    navItems: customerNavItems,
    label: "Customer",
    color: "text-primary",
    bgColor: "bg-primary",
  },
  wholesaler: {
    navItems: wholesalerNavItems,
    label: "Wholesaler",
    color: "text-primary",
    bgColor: "bg-primary",
  },
  affiliate: {
    navItems: affiliateNavItems,
    label: "Affiliate",
    color: "text-primary-600",
    bgColor: "bg-primary-600",
  },
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [profileDropdown, setProfileDropdown] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { user, isLoading, logout } = useAuth();
  const { settings } = useSettings();

  // Determine role based on URL
  let role: UserRole = "customer";
  if (pathname?.startsWith("/dashboard/affiliate")) role = "affiliate";
  else if (pathname?.startsWith("/dashboard/wholesaler")) role = "wholesaler";

  let activeRole = role;
  if (role === "customer" && user?.role === "wholesaler") {
    activeRole = "wholesaler";
  }

  const config = roleConfig[activeRole] || roleConfig.customer;
  const navItems = config.navItems;

  const handleLogout = () => {
    logout();
    router.push(role === "affiliate" ? "/become-an-affiliate" : "/login");
  };

  // Wait for auth hydration to avoid flashing the access denied screen
  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-primary-200 border-t-primary-600 rounded-full animate-spin shadow-lg"></div>
      </div>
    );
  }

  // Access gate for affiliates
  if (role === "affiliate" && !user?.is_affiliate) {
    return (
      <div className="flex flex-col min-h-screen">
        <Topbar />
        <Navbar />
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-4">
          <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
            <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mx-auto mb-5 animate-pulse">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h2>
            <p className="text-gray-600 text-sm mb-6 leading-relaxed">
              This account does not have affiliate access. Please sign up for an affiliate account first.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => router.push("/become-an-affiliate")}
                className="w-full py-3 bg-primary-600 text-white font-semibold rounded-xl text-sm hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/20"
              >
                Register as Affiliate
              </button>
              <button
                onClick={handleLogout}
                className="w-full py-3 border border-gray-200 text-gray-700 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Logout / Switch Account
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // Pending approval gate
  if (role === "affiliate" && user?.affiliate_approved === false) {
    return (
      <div className="flex flex-col min-h-screen">
        <Topbar />
        <Navbar />
        <div className="flex-1 bg-gray-50 flex items-center justify-center p-4 py-12 relative overflow-hidden">
          <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-40">
            <div className="absolute -top-32 -left-32 w-96 h-96 bg-primary-200 rounded-full blur-3xl" />
            <div className="absolute -bottom-40 right-1/3 w-80 h-80 bg-blue-200 rounded-full blur-3xl" />
          </div>

          <div className="bg-white/75 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl max-w-lg w-full text-center border border-gray-100/50 relative z-10">
            <div className="w-20 h-20 bg-gradient-to-br from-amber-400 to-orange-500 text-white rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-orange-500/20 animate-pulse">
              <Clock className="w-10 h-10" />
            </div>
            <h2 className="text-3xl font-extrabold text-gray-950 mb-3 tracking-tight">Application Pending</h2>
            <p className="text-gray-650 text-sm mb-6 leading-relaxed">
              Thank you for registering! Your affiliate account is currently under review by our administration team. We are verifying your details and will activate your access shortly.
            </p>
            <div className="bg-amber-50/50 border border-amber-200/50 rounded-2xl p-4 mb-8 flex items-start gap-3 text-left">
              <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-xs font-semibold text-amber-900">Need immediate assistance?</h4>
                <p className="text-xs text-amber-700 mt-0.5">
                  If you have not received approval within 24 hours, please contact our support team.
                </p>
              </div>
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/"
                className="flex-1 py-3 px-4 bg-primary-650 hover:bg-primary-750 text-white font-semibold rounded-xl text-sm transition-all shadow-lg shadow-primary-600/20 flex items-center justify-center gap-1.5"
              >
                Back to Shop
              </Link>
              <button
                onClick={handleLogout}
                className="flex-1 py-3 px-4 border border-gray-200 text-gray-750 font-semibold rounded-xl text-sm hover:bg-gray-50 transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  const isActive = (href: string) => {
    return pathname === href;
  };

  return (
    <div className="flex flex-col min-h-screen print:bg-white print:min-h-0 print:block">
      <div className="flex-1 bg-gray-50/80 print:bg-white flex print:block">
        {/* Mobile Overlay */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black/50 z-40 lg:hidden transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Sidebar */}
        <aside
          className={`fixed inset-y-0 left-0 z-50 w-[280px] bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:sticky lg:top-0 lg:h-screen lg:z-auto flex flex-col print:hidden ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Sidebar Header */}
          <div className="flex items-center justify-between h-16 px-4 border-b border-gray-100 shrink-0">
            <Link href="/" className="flex items-center gap-2.5">
                <img src={settings?.logo_url || "/assets/logo.png"} alt={settings?.name || "Siraj Tech"} className="h-10 w-auto object-contain" />
            </Link>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <X size={20} className="text-gray-500" />
            </button>
          </div>

          {/* Role Badge */}
          <div className="px-4 py-3 border-b border-gray-100 shrink-0">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold text-white ${config.bgColor}`}
            >
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              {config.label} Panel
            </span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 overflow-y-auto py-4 px-3 space-y-1">
            {navItems.map((item) => {
              if (
                (item.label === "Order List" || item.label === "Create Wholesale Order") &&
                !(user?.role === "wholesaler" && user?.wholesaler_panel_access)
              ) {
                return null;
              }
              const Icon = item.icon;
              const active = isActive(item.href);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 group ${
                    active
                      ? `${config.bgColor} text-white shadow-md`
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  }`}
                >
                  <Icon
                    size={18}
                    className={`shrink-0 ${active ? "text-white" : "text-gray-400 group-hover:text-gray-600"}`}
                  />
                  <span className="flex-1 truncate">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          {/* Sidebar Footer */}
          <div className="border-t border-gray-100 p-4 shrink-0">
            <Link
              href="/"
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50 hover:text-gray-900 transition-all"
            >
              <Home size={18} className="text-gray-400" />
              <span>Back to Store</span>
            </Link>

            {(user?.is_affiliate || user?.role === 'affiliate') && role !== 'affiliate' && user?.role !== 'wholesaler' && (
              <Link
                href="/dashboard/affiliate"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-primary-600 hover:bg-primary-50 transition-all mt-1"
              >
                <LayoutDashboard size={18} />
                <span>Affiliate Dashboard</span>
              </Link>
            )}

            {(user?.is_affiliate || user?.role === 'affiliate') && role === 'affiliate' && (
              <Link
                href="/dashboard/customer"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-blue-600 hover:bg-blue-50 transition-all mt-1"
              >
                <User size={18} />
                <span>Customer Dashboard</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all mt-1"
            >
              <LogOut size={18} />
              <span>Logout</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 print:block">
          {/* Top Header Bar */}
          <header className="sticky top-0 z-30 bg-white border-b border-gray-200 h-16 flex items-center px-4 lg:px-6 shrink-0 print:hidden">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors mr-3"
            >
              <Menu size={20} className="text-gray-600" />
            </button>

            <div className="flex-1 sm:hidden" />

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 sm:gap-3 ml-auto">
              {/* Profile Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setProfileDropdown(!profileDropdown)}
                  className="flex items-center gap-2 p-1.5 pr-3 rounded-xl hover:bg-gray-100 transition-colors"
                >
                  {user?.avatar_url ? (
                    <Image
                      src={user.avatar_url}
                      alt={user?.name || "U"}
                      width={32}
                      height={32}
                      className="w-8 h-8 rounded-lg object-cover"
                    />
                  ) : (
                    <div
                      className={`w-8 h-8 rounded-lg ${config.bgColor} flex items-center justify-center text-white text-sm font-bold`}
                    >
                      {user?.name?.charAt(0) || "U"}
                    </div>
                  )}
                  <div className="hidden md:block text-left">
                    <p className="text-sm font-medium text-gray-900 leading-tight">
                      {user?.name || "User"}
                    </p>
                    <p className="text-xs text-gray-500 leading-tight">{config.label}</p>
                  </div>
                  <ChevronDown size={14} className="text-gray-400 hidden md:block" />
                </button>

                {profileDropdown && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setProfileDropdown(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-gray-200 py-2 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                        <p className="text-xs text-gray-500">{user?.email}</p>
                      </div>
                      
                      {role === 'affiliate' && user?.role === 'customer' && (
                        <Link
                          href="/dashboard/customer"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <User size={16} />
                          Customer Dashboard
                        </Link>
                      )}
                      {role === 'customer' && user?.affiliate_approved && (
                        <Link
                          href="/dashboard/affiliate"
                          onClick={() => setProfileDropdown(false)}
                          className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                        >
                          <LayoutDashboard size={16} />
                          Affiliate Dashboard
                        </Link>
                      )}

                      <Link
                        href={`/dashboard/${role}/profile`}
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <User size={16} />
                        Edit Your Account
                      </Link>
                      <Link
                        href={role === "customer" || role === "wholesaler" ? `/dashboard/customer/change-password` : `/dashboard/${role}/settings`}
                        onClick={() => setProfileDropdown(false)}
                        className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                      >
                        <Lock size={16} />
                        Change Your Password
                      </Link>
                      <div className="border-t border-gray-100 mt-1 pt-1">
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-2 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                        >
                          <LogOut size={16} />
                          Logout
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </header>

          {/* Page Content */}
          <main className="flex-1 p-4 lg:p-6 print:p-0 print:bg-white print:m-0">{children}</main>
        </div>
      </div>
    </div>
  );
}
