'use client';

import { useState } from "react";
import StatusBadge from "@/components/dashboard/StatusBadge";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/providers/AuthProvider";
import { fetchCreatives, Creative } from "@/lib/api/affiliate";
import { Image, Copy, ExternalLink, Calendar, Code } from "lucide-react";
import { toast } from "sonner";

const AffiliateCreatives = () => {
  const { token } = useAuth();
  const [activeTab, setActiveTab] = useState<"link" | "html">("link");

  const { data, isLoading } = useQuery({
    queryKey: ["affiliate-creatives"],
    queryFn: () => fetchCreatives(token!),
    enabled: !!token,
  });

  const creatives = data?.data || [];

  const copyToClipboard = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${type} copied to clipboard!`);
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Image className="text-primary-600" /> Marketing Creatives
          </h1>
          <p className="text-gray-500 mt-1">Use these banners and promotional materials to drive more sales.</p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 p-6 animate-pulse">
              <div className="h-40 bg-gray-200 rounded-xl mb-4"></div>
              <div className="h-6 w-3/4 bg-gray-200 rounded-md mb-2"></div>
              <div className="h-4 w-1/2 bg-gray-100 rounded-md mb-4"></div>
              <div className="h-10 w-full bg-gray-100 rounded-lg"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {creatives.map((creative: Creative) => (
            <div key={creative.id} className="bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-md transition-all flex flex-col">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">{creative.name}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-md font-mono">{creative.banner_size}</span>
                    <span className="text-xs text-gray-400 flex items-center gap-1">
                      <Calendar size={12} /> {new Date(creative.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <StatusBadge status={creative.status === 1 ? "active" : "inactive"} />
              </div>

              {creative.description && (
                <p className="text-sm text-gray-500 mb-4 flex-grow">{creative.description}</p>
              )}

              {/* Banner Preview */}
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-5 flex items-center justify-center min-h-[160px]">
                <img 
                  src={creative.banner_image} 
                  alt={creative.name} 
                  className="max-h-48 max-w-full object-contain rounded-lg shadow-sm mix-blend-multiply"
                />
              </div>

              {/* Action Buttons & Tabs */}
              <div className="mt-auto">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Embed Options</p>
                  <div className="flex items-center bg-gray-100 rounded-lg p-0.5">
                     <button 
                       onClick={() => setActiveTab("link")}
                       className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === "link" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                     >
                       Direct Link
                     </button>
                     <button 
                       onClick={() => setActiveTab("html")}
                       className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${activeTab === "html" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500 hover:text-gray-700"}`}
                     >
                       HTML Code
                     </button>
                  </div>
                </div>

                <div className="bg-primary-50/50 rounded-xl p-3 border border-primary-100 relative">
                  <div className="flex items-start gap-2">
                    <div className="flex-1 overflow-hidden">
                      {activeTab === "link" ? (
                        <span className="text-xs font-mono text-gray-700 break-all line-clamp-2" title={creative.affiliate_link}>
                          {creative.affiliate_link}
                        </span>
                      ) : (
                        <span className="text-xs font-mono text-gray-700 break-all line-clamp-2" title={creative.html_code}>
                          {creative.html_code}
                        </span>
                      )}
                    </div>
                    <button 
                      onClick={() => copyToClipboard(activeTab === "link" ? creative.affiliate_link : creative.html_code, activeTab === "link" ? "Link" : "HTML code")} 
                      className="p-1.5 bg-white hover:bg-gray-100 border border-gray-200 text-gray-600 rounded-lg transition-colors shrink-0"
                    >
                      <Copy size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {creatives.length === 0 && (
            <div className="col-span-1 lg:col-span-2 text-center py-16 bg-white rounded-2xl border border-gray-100 border-dashed">
              <Image className="w-12 h-12 text-gray-300 mx-auto mb-3" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">No Creatives Available</h3>
              <p className="text-gray-500 text-sm mb-4">Check back later for new promotional banners and materials.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AffiliateCreatives;
