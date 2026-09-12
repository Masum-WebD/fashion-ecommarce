'use client';

import { useState, useEffect } from "react";
import { BookOpen, RefreshCw, AlertCircle } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";
import { fetchAffiliateHelp } from "@/lib/api/affiliate";

const AffiliateHelp = () => {
  const { token } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [helpContent, setHelpContent] = useState<string>("");

  useEffect(() => {
    if (!token) return;
    loadHelpContent();
  }, [token]);

  const loadHelpContent = async () => {
    if (!token) return;
    try {
      setLoading(true);
      setError(null);
      const res = await fetchAffiliateHelp(token);
      setHelpContent(res.data?.help_content || "");
    } catch (err: any) {
      console.error(err);
      setError(err?.message || "Failed to load help content");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Help & Guide</h1>
          <p className="text-gray-500 mt-1">Learn how to make the most of your affiliate account</p>
        </div>
        <button
          onClick={loadHelpContent}
          disabled={loading}
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors disabled:opacity-60"
        >
          <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm">
          <div className="flex flex-col items-center justify-center py-12 animate-pulse">
            <div className="w-14 h-14 rounded-2xl bg-primary-100 flex items-center justify-center mb-4">
              <BookOpen size={24} className="text-primary-400" />
            </div>
            <div className="h-4 w-48 bg-gray-200 rounded mb-3" />
            <div className="h-3 w-32 bg-gray-100 rounded" />
          </div>
        </div>
      ) : error ? (
        <div className="bg-white rounded-2xl border border-red-100 p-12 shadow-sm">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-red-50 flex items-center justify-center mb-4">
              <AlertCircle size={24} className="text-red-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load</h3>
            <p className="text-sm text-gray-500 mb-6 text-center max-w-md">{error}</p>
            <button
              onClick={loadHelpContent}
              className="px-5 py-2.5 bg-primary-600 text-white text-sm font-medium rounded-xl hover:bg-primary-700 transition-colors inline-flex items-center gap-2"
            >
              <RefreshCw size={14} />
              Try Again
            </button>
          </div>
        </div>
      ) : helpContent ? (
        <div
          className="bg-white rounded-2xl border border-gray-100 p-6 sm:p-8 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div
            className="prose prose-sm max-w-none
              prose-headings:text-gray-900 prose-headings:font-semibold
              prose-p:text-gray-600 prose-p:leading-relaxed
              prose-a:text-primary-600 prose-a:font-medium prose-a:no-underline hover:prose-a:underline
              prose-strong:text-gray-900
              prose-ul:list-disc prose-ul:pl-5
              prose-ol:list-decimal prose-ol:pl-5
              prose-li:text-gray-600
              prose-code:text-primary-700 prose-code:bg-primary-50 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-xs
              prose-pre:bg-gray-950 prose-pre:text-gray-100 prose-pre:rounded-xl
              prose-blockquote:border-l-primary-500 prose-blockquote:text-gray-600
              prose-img:rounded-xl prose-img:shadow-md
              [&_iframe]:w-full [&_iframe]:aspect-video [&_iframe]:rounded-xl [&_iframe]:shadow-md
            "
            dangerouslySetInnerHTML={{ __html: helpContent }}
          />
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 shadow-sm">
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-14 h-14 rounded-2xl bg-gray-50 flex items-center justify-center mb-4">
              <BookOpen size={24} className="text-gray-300" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No Content Available</h3>
            <p className="text-sm text-gray-500 text-center max-w-md">
              Help content is not available yet. Please check back later.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default AffiliateHelp;
