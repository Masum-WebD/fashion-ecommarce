'use client';

import { useState } from "react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { fetchReferrals, fetchReferralDetails, Referral } from "@/lib/api/affiliate";
import { Search, Users, UserPlus, ShoppingCart, Loader2, ChevronLeft, ChevronRight, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const AffiliateReferrals = () => {
  const { token } = useAuth();
  
  // States for filters and pagination
  const [page, setPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  
  // Optional date filters
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Modal State
  const [selectedReferralId, setSelectedReferralId] = useState<number | null>(null);

  const { data, isLoading } = useQuery({
    queryKey: ["affiliate-referrals", page, statusFilter, startDate, endDate],
    queryFn: () => fetchReferrals(token!, {
      page,
      status: statusFilter === "all" ? "" : statusFilter,
      start_date: startDate,
      end_date: endDate,
    }),
    enabled: !!token,
  });

  const { data: detailsData, isLoading: detailsLoading } = useQuery({
    queryKey: ["affiliate-referral-details", selectedReferralId],
    queryFn: () => fetchReferralDetails(token!, selectedReferralId!),
    enabled: !!token && !!selectedReferralId,
  });

  const referrals = data?.data?.referrals?.data || [];
  const stats = data?.data?.stats || { total: 0, visited: 0, registered: 0, converted: 0 };
  const pagination = data?.data?.referrals;

  const handlePageChange = (newPage: number) => {
    if (newPage > 0 && (!pagination || newPage <= pagination.last_page)) {
      setPage(newPage);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Referrals</h1>
        <p className="text-gray-500 mt-1">People who interacted with your referral links</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-primary-50"><Users size={20} className="text-primary-600" /></div>
          <div><p className="text-lg font-bold text-gray-900">{stats.total}</p><p className="text-xs text-gray-500">Total Referrals</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50"><Search size={20} className="text-blue-600" /></div>
          <div><p className="text-lg font-bold text-blue-600">{stats.visited}</p><p className="text-xs text-gray-500">Visited</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-50"><UserPlus size={20} className="text-purple-600" /></div>
          <div><p className="text-lg font-bold text-gray-900">{stats.registered}</p><p className="text-xs text-gray-500">Registered</p></div>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50"><ShoppingCart size={20} className="text-emerald-600" /></div>
          <div><p className="text-lg font-bold text-emerald-600">{stats.converted}</p><p className="text-xs text-gray-500">Converted</p></div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 space-y-4">
        <div className="flex flex-wrap gap-4 items-center">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Status:</span>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }}
              className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block p-2 outline-none"
            >
              <option value="">All Statuses</option>
              <option value="visited">Visited</option>
              <option value="registered">Registered</option>
              <option value="converted">Converted</option>
            </select>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-sm text-gray-500 font-medium">From:</span>
             <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg block p-2 outline-none"/>
          </div>
          <div className="flex items-center gap-2">
             <span className="text-sm text-gray-500 font-medium">To:</span>
             <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg block p-2 outline-none"/>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden relative min-h-[300px]">
        {isLoading && (
          <div className="absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex flex-col items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-primary-500 mb-2" />
            <p className="text-sm text-gray-500">Loading referrals...</p>
          </div>
        )}

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-5">ID</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-5">Customer Info</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-5">IP Address</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-5">Landing URL</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-5">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-5">Created At</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider py-4 px-5">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {referrals.map((r: Referral) => (
                <tr key={r.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="py-4 px-5 text-sm font-medium text-gray-900">#{r.id}</td>
                  <td className="py-4 px-5">
                    {r.customer ? (
                      <div>
                        <p className="text-sm font-medium text-gray-900">{r.customer.name}</p>
                        <p className="text-xs text-gray-500">{r.customer.email || r.customer.phone}</p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Guest / Unknown</span>
                    )}
                  </td>
                  <td className="py-4 px-5 text-sm text-gray-500">{r.ip_address}</td>
                  <td className="py-4 px-5 text-xs text-gray-500 max-w-[200px] truncate" title={r.landing_url}>
                    {r.landing_url}
                  </td>
                  <td className="py-4 px-5"><StatusBadge status={r.status as any} /></td>
                  <td className="py-4 px-5 text-sm text-gray-500">{new Date(r.created_at).toLocaleDateString()}</td>
                  <td className="py-4 px-5">
                    <button 
                      onClick={() => setSelectedReferralId(r.id)}
                      className="p-1.5 bg-gray-100 hover:bg-primary-100 text-gray-600 hover:text-primary-600 rounded-lg transition-colors"
                      title="View Details"
                    >
                      <Eye size={16} />
                    </button>
                  </td>
                </tr>
              ))}
              {!isLoading && referrals.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    No referrals found with the selected filters.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {pagination && pagination.last_page > 1 && (
          <div className="flex flex-col sm:flex-row items-center justify-between px-5 py-4 border-t border-gray-100 gap-4">
            <p className="text-sm text-gray-500">Showing <span className="font-medium text-gray-900">{pagination.from || 0}</span> to <span className="font-medium text-gray-900">{pagination.to || 0}</span> of <span className="font-medium text-gray-900">{pagination.total}</span> referrals</p>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => handlePageChange(page - 1)}
                disabled={page === 1}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronLeft size={16} />
              </button>
              
              <div className="flex gap-1">
                 {[...Array(pagination.last_page)].map((_, i) => {
                   const p = i + 1;
                   if (p === 1 || p === pagination.last_page || Math.abs(p - page) <= 1) {
                      return (
                         <button 
                            key={p}
                            onClick={() => handlePageChange(p)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${page === p ? 'bg-primary-600 text-white' : 'hover:bg-gray-100 text-gray-600'}`}
                         >
                            {p}
                         </button>
                      );
                   } else if (p === page - 2 || p === page + 2) {
                      return <span key={p} className="px-2 py-1 text-gray-400">...</span>;
                   }
                   return null;
                 })}
              </div>

              <button 
                onClick={() => handlePageChange(page + 1)}
                disabled={page === pagination.last_page}
                className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 disabled:opacity-50 disabled:hover:bg-transparent"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Dialog open={!!selectedReferralId} onOpenChange={(open) => !open && setSelectedReferralId(null)}>
        <DialogContent className="max-w-md bg-white border-0 shadow-2xl p-0 overflow-hidden">
          <div className="bg-gradient-to-r from-primary-600 to-primary-500 p-5">
             <DialogHeader>
               <DialogTitle className="text-white text-xl flex items-center gap-2">
                 <Search className="w-5 h-5 text-white/80" /> Referral Details
               </DialogTitle>
             </DialogHeader>
          </div>
          
          <div className="p-6">
            {detailsLoading ? (
               <div className="py-10 flex flex-col items-center justify-center gap-3">
                 <Loader2 className="w-8 h-8 animate-spin text-primary-500" />
                 <p className="text-sm text-gray-500">Loading referral info...</p>
               </div>
            ) : detailsData?.data ? (
              <div className="space-y-4">
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Referral ID</span>
                  <span className="font-semibold text-gray-900 bg-gray-100 px-2.5 py-1 rounded-md">#{detailsData.data.id}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Current Status</span>
                  <StatusBadge status={detailsData.data.status as any} />
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Visitor IP Address</span>
                  <span className="text-sm font-mono text-gray-700">{detailsData.data.ip_address}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Converted At</span>
                  <span className="text-sm text-gray-700">{detailsData.data.converted_at ? new Date(detailsData.data.converted_at).toLocaleString() : 'Not Converted'}</span>
                </div>
                <div className="flex justify-between items-center pb-3 border-b border-gray-100">
                  <span className="text-sm text-gray-500">Recorded At</span>
                  <span className="text-sm text-gray-700">{new Date(detailsData.data.created_at).toLocaleString()}</span>
                </div>
                
                <div className="pt-2 bg-gray-50 p-3 rounded-xl border border-gray-100">
                  <span className="text-xs font-semibold text-gray-500 uppercase block mb-1.5">Original Landing Page</span>
                  <a href={detailsData.data.landing_url} target="_blank" rel="noreferrer" className="text-sm text-primary-600 break-all hover:underline leading-relaxed">
                    {detailsData.data.landing_url}
                  </a>
                </div>

                {detailsData.data.customer && (
                  <div className="bg-primary-50/50 rounded-xl p-4 border border-primary-100 mt-4">
                    <h4 className="text-xs font-bold text-primary-700 uppercase tracking-wider mb-3 flex items-center gap-2">
                       <UserPlus size={14} /> Registered Customer
                    </h4>
                    <div className="space-y-2">
                       <p className="text-sm font-semibold text-gray-900">{detailsData.data.customer.name}</p>
                       {detailsData.data.customer.email && <p className="text-sm text-gray-600">Email: {detailsData.data.customer.email}</p>}
                       {detailsData.data.customer.phone && <p className="text-sm text-gray-600">Phone: {detailsData.data.customer.phone}</p>}
                    </div>
                  </div>
                )}
              </div>
            ) : (
               <div className="py-10 flex flex-col items-center justify-center gap-3">
                 <div className="w-12 h-12 rounded-full bg-red-100 text-red-500 flex items-center justify-center mb-2">!</div>
                 <p className="text-red-500 font-medium">Failed to load details.</p>
                 <button onClick={() => setSelectedReferralId(null)} className="text-sm text-gray-500 underline">Close</button>
               </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AffiliateReferrals;
