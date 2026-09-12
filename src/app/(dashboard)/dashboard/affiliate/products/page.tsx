'use client';

import { useState, useEffect } from "react";
import { Search, Link2, Filter, Layout, AppWindow, Loader2, RefreshCw } from "lucide-react";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";
import { fetchProductCommissions } from "@/lib/api/affiliate";
import { fetchShopCategories } from "@/lib/api/categories";
import { useAuth } from "@/providers/AuthProvider";

const AffiliateProducts = () => {
  const { token, user } = useAuth();
  const affiliateId = user?.affiliate_id || "affiliate";

  // Filter States
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [subCategoryId, setSubCategoryId] = useState("");
  const [sortBy, setSortBy] = useState("");
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState("15");
  const [showFilters, setShowFilters] = useState(false);

  // Debounce search input
  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1); // Reset to page 1 on new search
    }, 500);
    return () => clearTimeout(handler);
  }, [searchInput]);

  // Handle Category Change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCategoryId(e.target.value);
    setSubCategoryId(""); // Reset sub-category when category changes
    setPage(1);
  };

  // Fetch Categories for filters
  const { data: categories = [] } = useQuery({
    queryKey: ["shopCategories"],
    queryFn: fetchShopCategories,
  });

  // Current selected category to show its sub-categories
  const selectedCategory = categories.find((c) => c.id.toString() === categoryId);

  // Fetch Product Commissions
  const { data: response, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["productCommissions", debouncedSearch, categoryId, subCategoryId, sortBy, page, perPage],
    queryFn: () => fetchProductCommissions(token || "", {
      search: debouncedSearch,
      category_id: categoryId,
      sub_category_id: subCategoryId,
      sort_by: sortBy,
      page: page.toString(),
      per_page: perPage,
    }),
    enabled: !!token,
  });

  const productsData = response?.data;
  const products = productsData?.data || [];

  const copyLink = (productUrl: string) => {
    navigator.clipboard.writeText(productUrl);
    toast.success("Affiliate product link copied to clipboard!");
  };

  const copyAdWidget = (productUrl: string, format: "square" | "banner") => {
    const embedUrl = `<iframe src="https://sirajtech.com/ads/${format}?ref=${affiliateId}&target=${encodeURIComponent(productUrl)}" width="${format === 'square' ? '300' : '728'}" height="${format === 'square' ? '250' : '90'}" frameborder="0" scrolling="no"></iframe>`;
    navigator.clipboard.writeText(embedUrl);
    toast.success(`${format} ad widget copied!`);
  };

  const handlePageChange = (url: string | null, label: string) => {
    if (!url) return;
    try {
      const urlObj = new URL(url);
      const newPage = urlObj.searchParams.get("page");
      if (newPage) setPage(parseInt(newPage, 10));
    } catch (e) {
      // Handle "Next" or "Previous" logic or fallback
      if (label.includes("Next")) setPage((p) => p + 1);
      if (label.includes("Previous")) setPage((p) => Math.max(1, p - 1));
    }
  };

  const resetFilters = () => {
    setSearchInput("");
    setDebouncedSearch("");
    setCategoryId("");
    setSubCategoryId("");
    setSortBy("");
    setPage(1);
  };

  const formatCommission = (commission: any) => {
    if (commission?.type === "percentage") {
      return `${commission.commission_percent}%`;
    }
    if (commission?.type === "flat") {
      return `৳${commission.commission_flat}`;
    }
    return "N/A";
  };

  return (
    <div>
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Product Catalog</h1>
          <p className="text-gray-500 mt-1">Browse products and instantly generate your tracking links or ad banners</p>
        </div>
        <button 
          onClick={() => refetch()}
          className="flex items-center justify-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium"
        >
          <RefreshCw size={16} className={isFetching ? "animate-spin text-secondary" : ""} />
          Refresh
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-4 mb-6 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="relative flex-1 w-full">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search products or categories..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 transition-all"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button 
              onClick={() => setShowFilters(!showFilters)}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 border text-sm font-medium rounded-xl transition-colors ${showFilters ? 'bg-primary-50 border-primary-200 text-primary-700' : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'}`}
            >
              <Filter size={16} /> Filters
            </button>
          </div>
        </div>

        {/* Expandable Filters */}
        {showFilters && (
          <div className="mt-4 pt-4 border-t border-gray-100 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Category</label>
              <select
                value={categoryId}
                onChange={handleCategoryChange}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
              >
                <option value="">All Categories</option>
                {categories.map((c: any) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Sub Category</label>
              <select
                value={subCategoryId}
                onChange={(e) => { setSubCategoryId(e.target.value); setPage(1); }}
                disabled={!categoryId || (selectedCategory?.children?.length || 0) === 0}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500 disabled:opacity-50"
              >
                <option value="">All Sub-Categories</option>
                {selectedCategory?.children.map((sub: any) => (
                  <option key={sub.id} value={sub.id}>{sub.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 mb-1.5">Sort By</label>
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
              >
                <option value="">Default Sorting</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
                <option value="newest">Newest First</option>
                <option value="commission_high">Highest Commission</option>
              </select>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex-1">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Per Page</label>
                <select
                  value={perPage}
                  onChange={(e) => { setPerPage(e.target.value); setPage(1); }}
                  className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary-500/30 focus:border-primary-500"
                >
                  <option value="15">15 items</option>
                  <option value="30">30 items</option>
                  <option value="50">50 items</option>
                </select>
              </div>
              <button 
                onClick={resetFilters}
                className="px-4 py-2 text-sm text-gray-600 font-medium hover:text-red-600 transition-colors h-10"
              >
                Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col h-full animate-pulse">
              {/* Image Skeleton */}
              <div className="h-48 w-full bg-gray-200 shrink-0"></div>
              
              {/* Content Skeleton */}
              <div className="p-5 flex flex-col flex-1">
                {/* Category Skeleton */}
                <div className="h-3 w-1/3 bg-gray-200 rounded-full mb-3"></div>
                
                {/* Title Skeleton */}
                <div className="h-5 w-3/4 bg-gray-200 rounded-full mb-2"></div>
                <div className="h-5 w-1/2 bg-gray-200 rounded-full mb-4"></div>
                
                {/* SKU Skeleton */}
                <div className="h-3 w-1/4 bg-gray-200 rounded-full mb-6"></div>
                
                {/* Buttons Skeleton */}
                <div className="space-y-2.5 mt-auto border-t border-gray-50 pt-4">
                  <div className="h-10 w-full bg-gray-100 rounded-xl"></div>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="h-9 w-full bg-gray-100 rounded-xl border border-gray-200"></div>
                    <div className="h-9 w-full bg-gray-100 rounded-xl border border-gray-200"></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : isError ? (
        <div className="text-center py-12 bg-white rounded-2xl border border-red-100">
           <p className="text-red-500 text-sm font-medium">Failed to load product catalog. Please try again.</p>
           <button onClick={() => refetch()} className="mt-4 px-4 py-2 bg-red-50 text-red-600 rounded-xl font-medium text-sm hover:bg-red-100 transition">
             Retry
           </button>
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-gray-100 shadow-sm">
           <div className="w-16 h-16 bg-gray-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
             <Search size={32} className="text-gray-400" />
           </div>
           <h3 className="text-lg font-bold text-gray-900 mb-1">No products found</h3>
           <p className="text-gray-500 text-sm max-w-md mx-auto">Try adjusting your filters or search query to find what you're looking for.</p>
           <button onClick={resetFilters} className="mt-6 px-6 py-2.5 bg-secondary text-white rounded-xl font-medium text-sm hover:bg-secondary/90 transition shadow-lg shadow-secondary/20">
             Clear All Filters
           </button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-8">
            {products.map((product: any) => (
              <div key={product.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col h-full">
                <div className="h-48 w-full overflow-hidden bg-gray-50 relative shrink-0">
                  <img 
                    src={product.thumbnail_url || "/placeholder.svg"} 
                    alt={product.name} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => { (e.target as HTMLImageElement).src = '/placeholder.svg' }}
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl text-xs font-bold text-secondary shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"></span>
                    Comm: {formatCommission(product.commission)}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <div className="flex items-center gap-2 text-xs font-semibold text-gray-500 mb-2 truncate">
                    <span>{product.category?.name}</span>
                    {product.sub_category && (
                      <>
                        <span className="w-1 h-1 rounded-full bg-gray-300"></span>
                        <span className="truncate">{product.sub_category.name}</span>
                      </>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1 line-clamp-2 leading-snug flex-1" title={product.name}>{product.name}</h3>
                  {product.sku && (
                    <p className="text-xs text-gray-400 mb-4 font-mono">SKU: {product.sku}</p>
                  )}
                  {!product.sku && <div className="h-4 mb-4"></div>}
                  
                  <div className="space-y-2.5 mt-auto border-t border-gray-50">
                    <button 
                      onClick={() => copyLink(product.affiliate_link)}
                      className="w-full flex items-center justify-center gap-2 py-2.5 bg-secondary/10 text-secondary hover:bg-secondary hover:text-white rounded-xl text-sm font-semibold transition-all group/btn"
                    >
                      <Link2 size={16} className="group-hover/btn:-rotate-12 transition-transform" /> Copy Affiliate Link
                    </button>
                    <div className="grid grid-cols-2 gap-2">
                      <button 
                        onClick={() => copyAdWidget(product.affiliate_link, "square")}
                        className="flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <Layout size={14} /> Square Ad
                      </button>
                      <button 
                        onClick={() => copyAdWidget(product.affiliate_link, "banner")}
                        className="flex items-center justify-center gap-1.5 py-2 border border-gray-200 text-gray-600 hover:border-gray-300 hover:bg-gray-50 rounded-xl text-xs font-semibold transition-colors"
                      >
                        <AppWindow size={14} /> Banner Ad
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Pagination Component */}
          {productsData && productsData.last_page > 1 && (
            <div className="flex items-center justify-between border-t border-gray-200 bg-white px-4 py-3 sm:px-6 rounded-2xl shadow-sm">
              <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{productsData.from || 0}</span> to <span className="font-medium">{productsData.to || 0}</span> of{' '}
                    <span className="font-medium">{productsData.total}</span> results
                  </p>
                </div>
                <div>
                  <nav className="isolate inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                    {productsData.links.map((link: any, idx: number) => {
                      // Parse labels from API like "&laquo; Previous" or "Next &raquo;"
                      let label = link.label;
                      label = label.replace('&laquo;', '«').replace('&raquo;', '»');
                      
                      return (
                        <button
                          key={idx}
                          onClick={() => handlePageChange(link.url, link.label)}
                          disabled={!link.url}
                          className={`relative inline-flex items-center px-4 py-2 text-sm font-semibold focus:z-20 focus:outline-offset-0 ${
                            link.active
                              ? "z-10 bg-primary-600 text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
                              : link.url 
                                ? "text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                                : "text-gray-300 ring-1 ring-inset ring-gray-300 cursor-not-allowed"
                          } ${
                            idx === 0 ? "rounded-l-md" : ""
                          } ${
                            idx === productsData.links.length - 1 ? "rounded-r-md" : ""
                          }`}
                          dangerouslySetInnerHTML={{ __html: label }}
                        />
                      );
                    })}
                  </nav>
                </div>
              </div>
              
              {/* Mobile pagination */}
              <div className="flex flex-1 justify-between sm:hidden">
                <button
                  onClick={() => handlePageChange(productsData.prev_page_url, "Previous")}
                  disabled={!productsData.prev_page_url}
                  className="relative inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => handlePageChange(productsData.next_page_url, "Next")}
                  disabled={!productsData.next_page_url}
                  className="relative ml-3 inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default AffiliateProducts;
