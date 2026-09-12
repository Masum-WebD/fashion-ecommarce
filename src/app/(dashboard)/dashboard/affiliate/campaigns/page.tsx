'use client';

import { useState } from "react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { fetchCampaigns, createCampaign, Campaign } from "@/lib/api/affiliate";
import { Flag, Plus, Copy, ExternalLink, MousePointerClick, UserPlus, ShoppingCart, Loader2, Calendar } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { toast } from "sonner";

const AffiliateCampaigns = () => {
  const { token } = useAuth();
  const queryClient = useQueryClient();

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newCampaign, setNewCampaign] = useState({ name: "", destination_url: "", description: "" });

  const { data, isLoading } = useQuery({
    queryKey: ["affiliate-campaigns"],
    queryFn: () => fetchCampaigns(token!),
    enabled: !!token,
  });

  const createMutation = useMutation({
    mutationFn: (payload: { name: string; destination_url: string; description?: string }) => createCampaign(token!, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["affiliate-campaigns"] });
      toast.success("Campaign created successfully!");
      setIsCreateModalOpen(false);
      setNewCampaign({ name: "", destination_url: "", description: "" });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to create campaign");
    },
  });

  const campaigns = data?.data || [];

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name || !newCampaign.destination_url) {
      toast.error("Name and Destination URL are required");
      return;
    }
    createMutation.mutate(newCampaign);
  };

  const copyLink = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success("Affiliate link copied to clipboard!");
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Flag className="text-primary-600" /> My Campaigns
          </h1>
          <p className="text-gray-500 mt-1">Manage your custom marketing campaigns</p>
        </div>
        <button 
          onClick={() => setIsCreateModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> Create Campaign
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="flex justify-between items-start mb-4">
                <div className="w-full">
                  <div className="h-6 w-1/2 bg-gray-200 rounded-md mb-2"></div>
                  <div className="flex items-center gap-2 mt-1">
                    <div className="h-5 w-20 bg-gray-100 rounded-md"></div>
                    <div className="h-5 w-24 bg-gray-100 rounded-md"></div>
                  </div>
                </div>
                <div className="h-6 w-16 bg-gray-200 rounded-full shrink-0"></div>
              </div>
              
              <div className="space-y-2 mb-4">
                <div className="h-4 w-full bg-gray-100 rounded-md"></div>
                <div className="h-4 w-3/4 bg-gray-100 rounded-md"></div>
              </div>

              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mb-5">
                <div className="h-3 w-32 bg-gray-200 rounded-md mb-3"></div>
                <div className="h-4 w-3/4 bg-gray-200 rounded-md"></div>
              </div>

              <div className="bg-primary-50/50 rounded-xl p-3 border border-primary-100 mb-5">
                <div className="h-3 w-40 bg-primary-200/50 rounded-md mb-3"></div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-full bg-primary-200/50 rounded-md"></div>
                  <div className="h-8 w-8 bg-primary-100 rounded-lg shrink-0"></div>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                <div className="h-20 rounded-xl bg-blue-50/50 border border-blue-50"></div>
                <div className="h-20 rounded-xl bg-purple-50/50 border border-purple-50"></div>
                <div className="h-20 rounded-xl bg-emerald-50/50 border border-emerald-50"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {campaigns.map((campaign: Campaign) => (
            <div key={campaign.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{campaign.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                     <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-mono">{campaign.slug}</span>
                     <span className="text-xs text-gray-400 flex items-center gap-1"><Calendar size={12} /> {new Date(campaign.created_at).toLocaleDateString()}</span>
                  </div>
                </div>
                <StatusBadge status={campaign.status ? "active" : "inactive"} />
              </div>
              
              {campaign.description && (
                 <p className="text-sm text-gray-500 mb-4 line-clamp-2">{campaign.description}</p>
              )}

              <div className="bg-gray-50 rounded-xl p-3 border border-gray-100 mb-5">
                 <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 block">Destination URL</p>
                 <a href={campaign.destination_url} target="_blank" rel="noreferrer" className="text-sm text-blue-600 hover:underline flex items-center gap-1 break-all">
                   {campaign.destination_url} <ExternalLink size={12} />
                 </a>
              </div>

              <div className="bg-primary-50/50 rounded-xl p-3 border border-primary-100 mb-5 relative">
                 <p className="text-xs font-semibold text-primary-700 uppercase tracking-wider mb-2 block">Your Tracking Link</p>
                 <div className="flex items-center gap-2">
                    <span className="text-xs font-mono text-gray-700 truncate flex-1">{campaign.affiliate_link}</span>
                    <button onClick={() => copyLink(campaign.affiliate_link)} className="p-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-lg transition-colors">
                       <Copy size={14} />
                    </button>
                 </div>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-4 border-t border-gray-100">
                <div className="text-center p-3 rounded-xl bg-blue-50/50 border border-blue-50">
                  <div className="flex justify-center mb-1"><MousePointerClick size={16} className="text-blue-500" /></div>
                  <p className="text-lg font-bold text-gray-900">{campaign.total_clicks}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Clicks</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-purple-50/50 border border-purple-50">
                  <div className="flex justify-center mb-1"><UserPlus size={16} className="text-purple-500" /></div>
                  <p className="text-lg font-bold text-gray-900">{campaign.registrations}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Registers</p>
                </div>
                <div className="text-center p-3 rounded-xl bg-emerald-50/50 border border-emerald-50">
                  <div className="flex justify-center mb-1"><ShoppingCart size={16} className="text-emerald-500" /></div>
                  <p className="text-lg font-bold text-gray-900">{campaign.conversions}</p>
                  <p className="text-[10px] text-gray-500 uppercase tracking-wider mt-1">Sales</p>
                </div>
              </div>
            </div>
          ))}
          
          {campaigns.length === 0 && (
             <div className="col-span-1 lg:col-span-2 text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
                <Flag className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-lg font-medium text-gray-900 mb-1">No Campaigns Yet</h3>
                <p className="text-gray-500 text-sm mb-4">Create your first campaign to generate unique tracking links.</p>
                <button 
                  onClick={() => setIsCreateModalOpen(true)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-primary-50 text-primary-600 text-sm font-medium rounded-lg hover:bg-primary-100 transition-colors"
                >
                  <Plus size={16} /> Create Campaign
                </button>
             </div>
          )}
        </div>
      )}

      {/* Create Modal */}
      <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Create New Campaign</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4 pt-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Name <span className="text-red-500">*</span></label>
              <input
                type="text"
                placeholder="e.g. Winter Promo 2026"
                required
                value={newCampaign.name}
                onChange={(e) => setNewCampaign({ ...newCampaign, name: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Destination URL <span className="text-red-500">*</span></label>
              <input
                type="url"
                placeholder="https://sirajtech.org/shop"
                required
                value={newCampaign.destination_url}
                onChange={(e) => setNewCampaign({ ...newCampaign, destination_url: e.target.value })}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
              />
              <p className="text-xs text-gray-500 mt-1.5">The exact page you want visitors to land on.</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description (Optional)</label>
              <textarea
                placeholder="Brief notes about this campaign"
                value={newCampaign.description}
                onChange={(e) => setNewCampaign({ ...newCampaign, description: e.target.value })}
                rows={3}
                className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all resize-none"
              />
            </div>
            <DialogFooter className="pt-2">
              <DialogClose asChild>
                <button type="button" className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors">
                  Cancel
                </button>
              </DialogClose>
              <button
                type="submit"
                disabled={createMutation.isPending}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-50"
              >
                {createMutation.isPending && <Loader2 size={16} className="animate-spin" />}
                {createMutation.isPending ? "Creating..." : "Create Campaign"}
              </button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AffiliateCampaigns;
