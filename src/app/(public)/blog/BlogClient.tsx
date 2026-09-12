'use client';

import { useEffect, useState, Suspense } from "react";
import { useQuery } from "@tanstack/react-query";
import { Loader2, RefreshCw, Search, ChevronRight, Filter, X } from "lucide-react";
import { useRouter } from "next/navigation";
import AnimatedSection from "@/components/AnimatedSection";
import BlogCard from "@/components/blog/BlogCard";
import BlogCardSkeleton from "@/components/blog/BlogCardSkeleton";
import Pagination from "@/components/Pagination";
import { fetchBlogCategories, fetchBlogs, Blog } from "@/lib/api/blog";
import { cn } from "@/lib/utils";

interface BlogContentProps {
  categorySlug?: string;
  subCategorySlug?: string;
}

function BlogContent({ categorySlug, subCategorySlug }: BlogContentProps) {
  const router = useRouter();

  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  
  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [selectedSubCategories, setSelectedSubCategories] = useState<Set<number>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 400);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    setPage(1);
  }, [selectedCategories, selectedSubCategories, search]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [page, selectedCategories, selectedSubCategories, search]);

  const { data: categories = [], isLoading: categoriesLoading } = useQuery({
    queryKey: ["blogCategories"],
    queryFn: fetchBlogCategories,
    staleTime: 10 * 60 * 1000,
  });

  // Sync category state based on URL param
  useEffect(() => {
    if (!categories || categories.length === 0) return;

    if (categorySlug) {
      const foundCat = categories.find((c) => c.slug === categorySlug);
      if (foundCat) {
        if (subCategorySlug && foundCat.sub_categories) {
          const foundSub = foundCat.sub_categories.find(s => s.slug === subCategorySlug);
          if (foundSub) {
            setSelectedCategories(new Set());
            setSelectedSubCategories(new Set([foundSub.id]));
            setExpandedCategories(new Set([foundCat.id]));
          } else {
            setSelectedCategories(new Set([foundCat.id]));
            setExpandedCategories(new Set([foundCat.id]));
          }
        } else {
          setSelectedCategories(new Set([foundCat.id]));
          setExpandedCategories(new Set([foundCat.id]));
        }
      }
    } else {
      setSelectedCategories(new Set());
      setSelectedSubCategories(new Set());
    }
  }, [categorySlug, subCategorySlug, categories]);

  const handleCategoryChange = (catId: number, checked: boolean) => {
    const newCats = new Set(selectedCategories);
    const newExpanded = new Set(expandedCategories);
    
    if (checked) {
      newCats.add(catId);
      newExpanded.add(catId); // Auto-expand when selected
    } else {
      newCats.delete(catId);
    }
    
    setSelectedCategories(newCats);
    setExpandedCategories(newExpanded);
    setPage(1);
  };

  const handleSubCategoryChange = (subId: number, checked: boolean) => {
    const newSubs = new Set(selectedSubCategories);
    if (checked) {
      newSubs.add(subId);
    } else {
      newSubs.delete(subId);
    }
    setSelectedSubCategories(newSubs);
    setPage(1);
  };

  const toggleExpand = (catId: number) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(catId)) {
      newExpanded.delete(catId);
    } else {
      newExpanded.add(catId);
    }
    setExpandedCategories(newExpanded);
  };

  const clearAllFilters = () => {
    setSelectedCategories(new Set());
    setSelectedSubCategories(new Set());
    setPage(1);
    if (categorySlug) {
      router.push("/blog");
    }
  };

  const {
    data: blogsData,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: ["blogs", page, Array.from(selectedCategories), Array.from(selectedSubCategories), search],
    queryFn: async () => {
      // Show all blogs when no filters selected
      if (selectedCategories.size === 0 && selectedSubCategories.size === 0) {
        return fetchBlogs({ page, search, perPage: 9 });
      }

      // Fast path: single category
      if (selectedCategories.size === 1 && selectedSubCategories.size === 0) {
        const catId = Array.from(selectedCategories)[0];
        return fetchBlogs({ categoryId: catId, page, search, perPage: 9 });
      }

      // Fast path: single subcategory
      if (selectedCategories.size === 0 && selectedSubCategories.size === 1) {
        const subCatId = Array.from(selectedSubCategories)[0];
        return fetchBlogs({ subCategoryId: subCatId, page, search, perPage: 9 });
      }

      // Parallel queries for multiple selections
      const promises: Promise<any>[] = [];

      selectedCategories.forEach((id) => {
        promises.push(fetchBlogs({ categoryId: id, search, perPage: 100 })); // fetch more to merge
      });

      selectedSubCategories.forEach((id) => {
        promises.push(fetchBlogs({ subCategoryId: id, search, perPage: 100 }));
      });

      const results = await Promise.allSettled(promises);

      const allItems: Blog[] = [];
      const seenIds = new Set<number>();

      results.forEach((result) => {
        if (result.status !== "fulfilled") return;
        const list = result.value?.data || [];
        list.forEach((item: Blog) => {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            allItems.push(item);
          }
        });
      });

      // Sort by ID descending (newest first)
      allItems.sort((a, b) => b.id - a.id);

      const perPage = 9;
      const total = allItems.length;
      const lastPage = Math.max(1, Math.ceil(total / perPage));
      const currentPage = Math.min(page, lastPage);
      const start = (currentPage - 1) * perPage;
      const end = start + perPage;
      const pageData = allItems.slice(start, end);

      return {
        data: pageData,
        current_page: currentPage,
        last_page: lastPage,
        per_page: perPage,
        total: total,
        from: total > 0 ? start + 1 : null,
        to: Math.min(end, total),
      };
    },
    enabled: true,
    staleTime: 2 * 60 * 1000,
  });

  const blogs = blogsData?.data ?? [];
  const lastPage = blogsData?.last_page ?? 1;
  const total = blogsData?.total ?? 0;

  const renderSidebarContent = () => (
    <div className="flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center justify-center w-7 h-7 rounded-lg bg-primary/10">
            <Filter size={14} className="text-primary" />
          </div>
          <h3 className="text-sm font-bold text-foreground tracking-wide uppercase">
            Categories
          </h3>
        </div>
        {!categoriesLoading && (selectedCategories.size > 0 || selectedSubCategories.size > 0) && (
          <button
            onClick={clearAllFilters}
            className="flex items-center gap-1 text-[11px] font-semibold text-primary/70 hover:text-primary bg-primary/8 hover:bg-primary/15 px-2.5 py-1 rounded-full transition-all duration-200"
          >
            <X size={10} />
            Clear
          </button>
        )}
      </div>

      {/* Active filters badge */}
      {!categoriesLoading && (selectedCategories.size > 0 || selectedSubCategories.size > 0) && (
        <div className="flex items-center gap-1.5 mb-4 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">
            {selectedCategories.size + selectedSubCategories.size} filter{selectedCategories.size + selectedSubCategories.size > 1 ? "s" : ""} active
          </span>
        </div>
      )}

      {/* Skeleton while categories load */}
      {categoriesLoading ? (
        <div className="space-y-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center gap-3 px-3 py-2.5">
              <div className="w-4 h-4 rounded-md bg-gray-200 animate-pulse shrink-0" />
              <div
                className="h-3.5 rounded-full bg-gray-200 animate-pulse"
                style={{ width: `${50 + (i * 17) % 40}%` }}
              />
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-1">
          {categories.map((category) => {
            const isExpanded = expandedCategories.has(category.id);
            const hasChildren = category.sub_categories && category.sub_categories.length > 0;
            const isChecked = selectedCategories.has(category.id);

            return (
              <div key={category.id}>
                {/* Category row */}
                <div
                  className={cn(
                    "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group cursor-pointer",
                    isChecked
                      ? "bg-primary/10 text-primary"
                      : "hover:bg-muted/60 text-foreground/80"
                  )}
                  onClick={() => handleCategoryChange(category.id, !isChecked)}
                >
                  {/* Custom checkbox */}
                  <div
                    className={cn(
                      "flex items-center justify-center w-4 h-4 shrink-0 rounded border-2 transition-all duration-200",
                      isChecked
                        ? "bg-primary border-primary"
                        : "border-gray-400 group-hover:border-primary/70"
                    )}
                  >
                    {isChecked && (
                      <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                        <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    )}
                  </div>

                  <span
                    className={cn(
                      "text-sm font-medium flex-1 leading-snug break-words select-none",
                      isChecked ? "text-primary font-semibold" : "text-foreground/75 group-hover:text-foreground"
                    )}
                  >
                    {category.title}
                  </span>

                  {/* Sub-category count badge */}
                  {hasChildren && (
                    <span className={cn(
                      "text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 transition-colors",
                      isChecked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                    )}>
                      {category.sub_categories?.length}
                    </span>
                  )}

                  {/* Expand toggle */}
                  {hasChildren && (
                    <button
                      onClick={(e) => { e.stopPropagation(); toggleExpand(category.id); }}
                      className={cn(
                        "p-0.5 rounded shrink-0 transition-all duration-200",
                        isChecked ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                      )}
                    >
                      <ChevronRight
                        size={14}
                        className={cn(
                          "transition-transform duration-200",
                          isExpanded ? "rotate-90" : "rotate-0"
                        )}
                      />
                    </button>
                  )}
                </div>

                {/* Sub-categories */}
                {hasChildren && (
                  <div
                    className={cn(
                      "overflow-hidden transition-all duration-300 ease-in-out",
                      isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                    )}
                  >
                    <div className="flex flex-col gap-0.5 pl-4 ml-3 border-l-2 border-primary/15 mt-1 mb-1">
                      {category.sub_categories?.map((child) => {
                        const isSubChecked = selectedSubCategories.has(child.id);
                        return (
                          <div
                            key={child.id}
                            className={cn(
                              "flex items-center gap-2 rounded-lg px-2.5 py-2 cursor-pointer transition-all duration-200 group",
                              isSubChecked ? "bg-primary/8 text-primary" : "hover:bg-muted/50"
                            )}
                            onClick={() => handleSubCategoryChange(child.id, !isSubChecked)}
                          >
                            {/* Custom sub-checkbox */}
                            <div
                              className={cn(
                                "flex items-center justify-center w-3.5 h-3.5 shrink-0 rounded border-2 transition-all duration-200",
                                isSubChecked
                                  ? "bg-primary border-primary"
                                  : "border-gray-400 group-hover:border-primary/60"
                              )}
                            >
                              {isSubChecked && (
                                <svg width="7" height="5.5" viewBox="0 0 7 5.5" fill="none">
                                  <path d="M1 2.75L2.75 4.5L6 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                              )}
                            </div>
                            <label
                              className={cn(
                                "text-xs font-medium leading-snug break-words flex-1 cursor-pointer select-none transition-colors",
                                isSubChecked ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground"
                              )}
                            >
                              {child.title}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );


  return (
    <>
      <section className="bg-gradient-to-b from-primary/5 to-transparent backdrop-blur-sm">
        <div className="container-main py-8 md:py-10">
          <AnimatedSection>
            <div className="mx-auto max-w-2xl text-center">
              <h1 className="mb-3 font-heading text-3xl font-bold tracking-tight text-foreground md:text-4xl">
                Siraj Tech Blog
              </h1>
              <p className="mb-6 text-sm leading-relaxed text-muted-foreground md:text-base">
                প্রযুক্তি, সিভিল ইঞ্জিনিয়ারিং এবং আধুনিক কৃষির গভীর বিশ্লেষণ ও অনুপ্রেরণামূলক কাহিনী জানুন।
              </p>

              <div className="relative mx-auto max-w-lg">
                <Search
                  size={18}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground"
                />
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search articles..."
                  className="w-full rounded-md border border-primary/20 bg-white py-3.5 pl-11 pr-4 text-sm font-medium text-foreground shadow-md transition-all duration-300 placeholder:text-muted-foreground/70 focus:border-primary/60 focus:outline-none focus:ring-4 focus:ring-primary/15"
                />
              </div>
            </div>
          </AnimatedSection>
        </div>
      </section>

      <section className="container-main pb-6 md:pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-4 lg:gap-8">
          
          {/* Desktop Sidebar */}
          <div className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-white border border-border/60 rounded-xl p-4 shadow-sm">
              {renderSidebarContent()}
            </div>
          </div>

          {/* Mobile Filter Button */}
          <div className="lg:hidden mb-4 flex items-center justify-between bg-white border border-border/60 rounded-xl p-3 shadow-sm">
            <span className="text-sm font-medium text-foreground">
              Showing {blogs.length} of {total} article{total === 1 ? "" : "s"}
            </span>
            <button
              onClick={() => setMobileFiltersOpen(true)}
              className="flex items-center gap-2 bg-primary/10 text-primary px-3 py-1.5 rounded-lg text-sm font-semibold hover:bg-primary/20 transition-colors"
            >
              <Filter size={16} />
              Filter
            </button>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <AnimatedSection delay={100}>
              {isLoading ? (
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <BlogCardSkeleton key={i} />
                  ))}
                </div>
              ) : isError ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-border bg-white py-20 text-center shadow-sm">
                  <p className="mb-4 text-lg font-semibold text-foreground">Could not load blog posts</p>
                  <button
                    type="button"
                    onClick={() => refetch()}
                    className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                  >
                    <RefreshCw size={16} />
                    Try again
                  </button>
                </div>
              ) : blogs.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-white py-20 text-center">
                  <p className="text-lg font-semibold text-foreground">No articles found</p>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Try a different search term or category.
                  </p>
                </div>
              ) : (
                <>
                  <div className="hidden lg:flex mb-6 items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground">
                      Showing {blogs.length} of {total} article{total === 1 ? "" : "s"}
                    </p>
                    {isFetching && !isLoading && (
                      <Loader2 size={18} className="animate-spin text-primary" aria-label="Updating" />
                    )}
                  </div>

                  <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {blogs.map((blog, idx) => (
                      <BlogCard key={blog.id} blog={blog} delay={idx * 80} />
                    ))}
                  </div>

                  <Pagination
                    currentPage={page}
                    lastPage={lastPage}
                    onPageChange={setPage}
                    className="mt-12 md:mt-16 justify-center"
                  />
                </>
              )}
            </AnimatedSection>
          </div>
        </div>
      </section>

      {/* Mobile Sidebar Overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setMobileFiltersOpen(false)}
          />
          
          {/* Drawer */}
          <div className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white shadow-2xl animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 sticky top-0 bg-white z-10">
              <h2 className="text-lg font-bold text-foreground flex items-center gap-2">
                <Filter size={18} className="text-primary" />
                Filters
              </h2>
              <button
                type="button"
                className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                onClick={() => setMobileFiltersOpen(false)}
              >
                <span className="sr-only">Close panel</span>
                <X size={20} />
              </button>
            </div>
            
            <div className="p-5">
              {renderSidebarContent()}
            </div>
            
            <div className="mt-auto border-t border-border/50 p-5 bg-gray-50 sticky bottom-0">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm hover:bg-primary/90 transition-colors"
              >
                Apply Filters & View {total} Articles
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface BlogClientProps {
  categorySlug?: string;
  subCategorySlug?: string;
}

const BlogClient = ({ categorySlug, subCategorySlug }: BlogClientProps) => {
  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-section-alt/30 via-background to-background">
      <main className="flex-grow">
        <Suspense fallback={<div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>}>
          <BlogContent categorySlug={categorySlug} subCategorySlug={subCategorySlug} />
        </Suspense>
      </main>
    </div>
  );
};

export default BlogClient;
