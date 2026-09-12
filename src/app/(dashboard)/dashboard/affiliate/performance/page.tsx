'use client';

import { useQuery } from "@tanstack/react-query";
import StatCard from "@/components/dashboard/StatCard";
import { MousePointerClick, Target, DollarSign, CheckCircle, Wallet, Clock, ArrowUpRight, Users, Calendar, BanknoteIcon } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { fetchReportSummary, fetchReportCampaigns } from "@/lib/api/affiliate";

const AffiliatePerformance = () => {
  const { token } = useAuth();

  const { data: summaryData, isLoading: isSummaryLoading } = useQuery({
    queryKey: ["affiliate-report-summary"],
    queryFn: () => fetchReportSummary(token!),
    enabled: !!token,
  });

  const { data: campaignsData, isLoading: isCampaignsLoading } = useQuery({
    queryKey: ["affiliate-report-campaigns"],
    queryFn: () => fetchReportCampaigns(token!),
    enabled: !!token,
  });

  const summary = summaryData?.data;
  const campaigns = campaignsData?.data || [];

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Reports</h1>
          <p className="text-gray-500 mt-1">Detailed insights into your overall affiliate performance</p>
        </div>
      </div>

      {/* Overall Summary Stats */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-gray-900 mb-4">Overall Summary</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
          <StatCard
            title="Total Earnings"
            value={isSummaryLoading ? "..." : `৳${summary?.total_earnings?.toLocaleString() || "0"}`}
            change="Lifetime earnings"
            changeType="positive"
            icon={DollarSign}
            iconColor="text-emerald-600"
            iconBg="bg-emerald-50"
          />
          <StatCard
            title="Available Balance"
            value={isSummaryLoading ? "..." : `৳${summary?.available_balance?.toLocaleString() || "0"}`}
            change="Ready to withdraw"
            changeType="positive"
            icon={Wallet}
            iconColor="text-blue-600"
            iconBg="bg-blue-50"
          />
          <StatCard
            title="Pending Balance"
            value={isSummaryLoading ? "..." : `৳${summary?.pending_balance?.toLocaleString() || "0"}`}
            change="In review"
            changeType="neutral"
            icon={Clock}
            iconColor="text-amber-600"
            iconBg="bg-amber-50"
          />
          <StatCard
            title="Withdrawn Balance"
            value={isSummaryLoading ? "..." : `৳${summary?.withdrawn_balance?.toLocaleString() || "0"}`}
            change="Successfully paid out"
            changeType="neutral"
            icon={BanknoteIcon}
            iconColor="text-purple-600"
            iconBg="bg-purple-50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard
            title="Total Clicks"
            value={isSummaryLoading ? "..." : summary?.total_clicks?.toLocaleString() || "0"}
            change="Lifetime clicks"
            changeType="neutral"
            icon={MousePointerClick}
            iconColor="text-indigo-600"
            iconBg="bg-indigo-50"
          />
          <StatCard
            title="Conversion Rate"
            value={isSummaryLoading ? "..." : `${summary?.conversion_rate?.toFixed(2) || "0"}%`}
            change="Clicks to sales"
            changeType="positive"
            icon={Target}
            iconColor="text-rose-600"
            iconBg="bg-rose-50"
          />
          <StatCard
            title="Total Referrals"
            value={isSummaryLoading ? "..." : summary?.total_referrals?.toLocaleString() || "0"}
            change="Lifetime referrals"
            changeType="neutral"
            icon={Users}
            iconColor="text-cyan-600"
            iconBg="bg-cyan-50"
          />
          <StatCard
            title="This Month Earnings"
            value={isSummaryLoading ? "..." : `৳${summary?.this_month_earnings?.toLocaleString() || "0"}`}
            change={`${summary?.this_month_referrals || 0} referrals this month`}
            changeType="positive"
            icon={Calendar}
            iconColor="text-orange-600"
            iconBg="bg-orange-50"
          />
        </div>
      </div>


      {/* Campaign Performance Table */}
      <div className="bg-white rounded-2xl border border-gray-100 p-5 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-6">Campaign Performance</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50/50">
                <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider py-4 px-4">Campaign Name</th>
                <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider py-4 px-4">Total Clicks</th>
                <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider py-4 px-4">Registrations</th>
                <th className="text-left text-xs font-bold text-gray-600 uppercase tracking-wider py-4 px-4">Conversions</th>
                <th className="text-right text-xs font-bold text-gray-600 uppercase tracking-wider py-4 px-4">Conversion Rate</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isCampaignsLoading ? (
                [...Array(3)].map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-32"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-16"></div></td>
                    <td className="py-4 px-4"><div className="h-4 bg-gray-200 rounded w-16 ml-auto"></div></td>
                  </tr>
                ))
              ) : campaigns.length > 0 ? (
                campaigns.map((c: any) => (
                  <tr key={c.id} className="hover:bg-gray-50/50 transition-colors">
                    <td className="py-4 px-4">
                      <p className="text-sm font-bold text-gray-900">{c.name}</p>
                      <p className="text-xs text-gray-500 mt-1">{c.destination_url}</p>
                    </td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-600">{c.total_clicks}</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-600">{c.registrations}</td>
                    <td className="py-4 px-4 text-sm font-medium text-gray-600">{c.conversions}</td>
                    <td className="py-4 px-4 text-sm font-bold text-emerald-600 text-right">{c.conversion_rate.toFixed(2)}%</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-gray-500">
                    <Target size={48} className="mx-auto mb-3 text-gray-200" />
                    <p className="text-base font-medium text-gray-900">No campaigns found</p>
                    <p className="text-sm mt-1">Create a campaign to track performance here.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AffiliatePerformance;
