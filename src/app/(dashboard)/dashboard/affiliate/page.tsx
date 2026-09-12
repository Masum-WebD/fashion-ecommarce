'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import StatCard from "@/components/dashboard/StatCard";
import { ChartCard, SimpleAreaChart } from "@/components/dashboard/DashboardCharts";
import {
  Link2,
  Wallet,
  Users,
  TrendingUp,
  Copy,
  Clock,
  MousePointerClick,
  Percent,
  CheckCircle2,
  AlertCircle,
  RefreshCw,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "@/providers/AuthProvider";
import { fetchAffiliateDashboard, type AffiliateDashboardData } from "@/lib/api/affiliate";

const AffiliateDashboard = () => {
  const { user, token, logout } = useAuth();
  const [dashboardData, setDashboardData] = useState<AffiliateDashboardData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Dynamic affiliate code generation
  const affiliateCode =  user?.username;
  const affiliateLink = user?.affiliate?.affiliate_link || `https://sirajtech.org/?ref=${affiliateCode}`;

  const copyLink = () => {
    navigator.clipboard.writeText(affiliateLink);
    toast.success("Referral link copied to clipboard!");
  };

  const loadDashboardData = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetchAffiliateDashboard(token);
      setDashboardData(res.data);
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [token]);

  // Format earnings overview for Recharts area chart
  const earningsChartData = dashboardData?.earnings_overview.map((item) => {
    try {
      const dateParts = item.date.split("-");
      if (dateParts.length === 3) {
        const dateObj = new Date(parseInt(dateParts[0]), parseInt(dateParts[1]) - 1, parseInt(dateParts[2]));
        return {
          name: dateObj.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          value: item.earnings,
        };
      }
    } catch (e) {
      // Fallback
    }
    return { name: item.date, value: item.earnings };
  }) || [];


  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        {/* Header Skeleton */}
        <div className="flex justify-between items-center mb-6">
          <div className="space-y-2">
            <div className="h-8 w-48 bg-gray-200 rounded-xl" />
            <div className="h-4 w-64 bg-gray-200 rounded-lg" />
          </div>
          <div className="h-10 w-24 bg-gray-200 rounded-xl" />
        </div>

        {/* Quick Link Card Skeleton */}
        <div className="h-24 bg-gray-200 rounded-3xl" />

        {/* Stats Skeleton */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-28 bg-gray-200 rounded-2xl" />
          ))}
        </div>

        {/* Charts Row Skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-gray-200 rounded-2xl" />
          <div className="h-80 bg-gray-200 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <div className="w-16 h-16 bg-red-50 text-red-500 rounded-2xl flex items-center justify-center mb-4">
          <AlertCircle size={32} />
        </div>
        <h3 className="text-lg font-bold text-gray-900 mb-1">Error Loading Dashboard</h3>
        <p className="text-gray-500 text-sm max-w-md mb-6">{error}</p>
        <div className="flex items-center gap-3">
          <button
            onClick={loadDashboardData}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-xl text-sm transition-colors shadow-lg shadow-primary-650/20"
          >
            <RefreshCw size={16} /> Retry
          </button>
          <button
            onClick={logout}
            className="flex items-center gap-2 px-5 py-2.5 bg-red-100 shadow-sm text-red-600 hover:bg-red-200 font-medium rounded-xl text-sm transition-colors shadow-sm"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-black text-gray-900 tracking-tight">Affiliate Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Real-time referral metrics and wallet overview</p>
        </div>
        <button
          onClick={loadDashboardData}
          className="self-start sm:self-center p-2 rounded-xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-600 transition-colors flex items-center gap-1.5 text-xs font-semibold"
        >
          <RefreshCw size={14} /> Sync Data
        </button>
      </div>

      {/* Premium Referral Link Card */}
      <div className="relative overflow-hidden 
bg-gradient-to-br from-emerald-600 via-green-700 to-green-800
rounded-3xl p-6 mb-8 text-white
shadow-xl shadow-green-900/15">
        <div className="absolute top-0 right-0 -mt-8 -mr-8 w-60 h-60 bg-white/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-primary-500/20 rounded-full blur-2xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-green-50 backdrop-blur-md">
              <Link2 size={12} /> Live Referral Code: {affiliateCode}
            </span>
            <h3 className="text-xl font-bold tracking-tight mt-2">Start Earning Commissions</h3>
            <p className="text-sm text-green-50/80 max-w-xl">
              Share your custom referral link. When visitors purchase products through your link, you will receive payout commissions directly in your account.
            </p>
          </div>
          
          <div className="flex items-center gap-3 bg-white/10 p-1.5 rounded-2xl border border-white/10 backdrop-blur-md w-full md:max-w-md shadow-inner">
            <span className="text-sm text-green-50 font-medium px-3 truncate flex-1 select-all">{affiliateLink}</span>
            <button
              onClick={copyLink}
              className="p-3 rounded-xl bg-white text-indigo-700 hover:bg-green-50 font-bold transition-all shadow-md active:scale-95 shrink-0 flex items-center gap-1.5 text-xs"
            >
              <Copy size={14} /> Copy Link
            </button>
          </div>
        </div>
      </div>

      {/* Premium Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <StatCard
          title="Total Referrals"
          value={dashboardData?.total_referrals || 0}
          change={`Verified: ${dashboardData?.paid_referrals || 0} | Pending: ${dashboardData?.unpaid_referrals || 0}`}
          changeType="positive"
          icon={Users}
          iconColor="text-primary-600"
          iconBg="bg-primary-50"
        />
        
        <StatCard
          title="Total Earnings"
          value={`৳${dashboardData?.total_earnings || 0}`}
          change="All time commissions"
          changeType="positive"
          icon={TrendingUp}
          iconColor="text-emerald-600"
          iconBg="bg-emerald-50"
        />

        <StatCard
          title="Current Balance"
          value={`৳${dashboardData?.current_balance || 0}`}
          change="Available for withdrawal"
          changeType="positive"
          icon={Wallet}
          iconColor="text-indigo-600"
          iconBg="bg-indigo-50"
        />

        <StatCard
          title="Total Paid Out"
          value={`৳${dashboardData?.withdrawn_earnings || 0}`}
          change="Successfully processed"
          changeType="neutral"
          icon={CheckCircle2}
          iconColor="text-blue-600"
          iconBg="bg-blue-50"
        />

        <StatCard
          title="Total Link Clicks"
          value={dashboardData?.total_clicks || 0}
          change="Total traffic generated"
          changeType="neutral"
          icon={MousePointerClick}
          iconColor="text-amber-600"
          iconBg="bg-amber-50"
        />
      </div>

      {/* Main Grid: Live Earnings Trends & Performance Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Live Earnings Chart */}
        <div className="lg:col-span-2">
          <ChartCard
            title="Commissions History"
            subtitle="Detailed commission trends over the last 30 days"
          >
            {earningsChartData.length > 0 ? (
              <SimpleAreaChart data={earningsChartData} color="#8b5cf6" height={250} />
            ) : (
              <div className="flex flex-col items-center justify-center h-[250px] bg-gray-50 rounded-xl">
                <p className="text-sm text-gray-400">No earnings data available yet</p>
              </div>
            )}
          </ChartCard>
        </div>

        {/* This Month Progress Card */}
        <div className="bg-gradient-to-br from-white to-gray-50/50 rounded-2xl border border-gray-100 p-5 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-bold text-gray-900">Performance This Month</h3>
              <span className="text-xs px-2.5 py-1 rounded-full bg-primary-50 text-primary-700 font-semibold">
                Monthly Stats
              </span>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-primary-50 text-primary-600 rounded-lg">
                    <Users size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">New Referrals</p>
                    <p className="text-sm font-bold text-gray-950 mt-0.5">
                      {dashboardData?.this_month?.total_referrals || 0}
                    </p>
                  </div>
                </div>
                {dashboardData?.this_month?.unverified_referrals ? (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-50 text-amber-600 font-medium border border-amber-100">
                    {dashboardData.this_month.unverified_referrals} unverified
                  </span>
                ) : null}
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-indigo-50 text-indigo-600 rounded-lg">
                    <MousePointerClick size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Month Clicks</p>
                    <p className="text-sm font-bold text-gray-950 mt-0.5">
                      {dashboardData?.this_month?.clicks || 0}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white border border-gray-100">
                <div className="flex items-center gap-2.5">
                  <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                    <Percent size={16} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500 font-medium">Conversion Rate</p>
                    <p className="text-sm font-bold text-gray-950 mt-0.5">
                      {dashboardData?.this_month?.conversion_rate || 0}%
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-100 mt-4 flex items-center justify-between">
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">Month Earnings</p>
              <p className="text-lg font-black text-gray-900">৳{dashboardData?.this_month?.total_earnings || 0}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AffiliateDashboard;
