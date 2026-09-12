'use client';

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import AnimatedSection from "@/components/home/AnimatedSection";
import ShopCategoryCard from "@/components/shop/ShopCategoryCard";
import ProductCardEnhanced from "@/components/home/ProductCardEnhanced";
import CategoryLongDescription from "@/components/shop/CategoryLongDescription";
import { useAuth } from "@/providers/AuthProvider";
import {
  fetchShopCategories,
  getShopCategoryView,
  isShopRootCategory,
  ShopCategory,
  ShopCategoryChild,
  ShopCategorySubChild,
  ShopCategoryItem,
  findShopCategoryBySlug,
} from "@/lib/api/categories";
import {
  fetchProducts,
  formatProductPrice,
  formatOriginalPrice,
  Product,
} from "@/lib/api/products";
import { getImageUrl } from "@/lib/api/images";
import { ChevronRight, Loader2, PackageOpen, RefreshCw, Filter, SlidersHorizontal, X, ArrowDown, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

const decodeHtmlEntities = (text: string | null | undefined): string => {
  if (!text) return "";
  return text
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'");
};

const getCategoryHref = (item: ShopCategoryItem): string => `/shop/${item.slug}`;

const getSubcategoryCount = (
  item: ShopCategoryItem,
  categories: ShopCategory[]
): number => {
  if (isShopRootCategory(categories, item)) {
    return item.children.length;
  }
  return 0;
};

const ProductSkeleton = () => (
  <div className="bg-white rounded-t-xl rounded-b-none overflow-hidden shadow-[0_4px_20px_-4px_rgba(0,0,0,0.06)] border border-border/60 flex flex-col h-full">
    {/* Image Container */}
    <div className="relative w-full aspect-[4/3] bg-[#f8fafc] border-b border-border/30">
      <div className="absolute inset-0 bg-gradient-to-r from-gray-100 via-gray-200 to-gray-100 animate-pulse" />
    </div>

    {/* Content */}
    <div className="p-2 md:p-4 flex flex-col flex-grow bg-white gap-1 md:gap-2">
      {/* Title */}
      <div className="h-3 md:h-4 w-full bg-gray-200 animate-pulse rounded mt-1"></div>
      <div className="h-3 md:h-4 w-2/3 bg-gray-200 animate-pulse rounded mb-1 md:mb-2"></div>

      {/* Price & Order Button */}
      <div className="mt-auto pt-1 md:pt-2 flex flex-col gap-2.5">
        <div className="h-4 md:h-5 w-1/3 bg-gray-200 animate-pulse rounded"></div>
        <div className="w-full h-[34px] md:h-[42px] bg-gray-200 animate-pulse rounded-md mt-1"></div>
      </div>
    </div>
  </div>
);

interface ShopClientProps {
  initialCategorySlug?: string;
}

const ShopClient = ({ initialCategorySlug }: ShopClientProps) => {
  const router = useRouter();
  const { user } = useAuth();
  const [productPage, setProductPage] = useState(1);
  const [accumulatedProducts, setAccumulatedProducts] = useState<Product[]>([]);
  const [hasMore, setHasMore] = useState(true);
  const [totalProducts, setTotalProducts] = useState(0);
  const isWholesaler = user?.role === "wholesaler";

  const [selectedCategories, setSelectedCategories] = useState<Set<number>>(new Set());
  const [selectedSubCategories, setSelectedSubCategories] = useState<Set<number>>(new Set());
  const [selectedChildCategories, setSelectedChildCategories] = useState<Set<number>>(new Set());
  const [expandedCategories, setExpandedCategories] = useState<Set<number>>(new Set());
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Local state for slug to enable shallow routing without Next.js full remounts
  const [currentSlug, setCurrentSlug] = useState(initialCategorySlug);
  const [selectedBrandId, setSelectedBrandId] = useState<number | undefined>(undefined);
  const isInternalUpdateRef = useRef(false);

  useEffect(() => {
    setCurrentSlug(initialCategorySlug);
  }, [initialCategorySlug]);

  const { data: categories = [], isLoading, isError, refetch, isFetching } =
    useQuery({
      queryKey: ["shopCategories"],
      queryFn: fetchShopCategories,
      staleTime: 5 * 60 * 1000,
    });

  // URL updater that maintains clean SEO-friendly URLs and shallow history
  const updateUrlAndSlug = useCallback((newSlug: string | undefined) => {
    let search = "";
    if (typeof window !== "undefined" && window.location.search) {
      const params = new URLSearchParams(window.location.search);
      params.delete("categories");
      params.delete("subcategories");
      params.delete("childcategories");
      const qs = params.toString();
      search = qs ? `?${qs}` : "";
    }

    const newPath = newSlug ? `/shop/${newSlug}${search}` : `/shop${search}`;

    if (typeof window !== "undefined" && window.location.pathname + window.location.search !== newPath) {
      window.history.pushState({ slug: newSlug }, "", newPath);
    }

    setCurrentSlug(newSlug);
  }, []);

  // Listen to browser Back/Forward navigation (popstate)
  useEffect(() => {
    const handlePopState = () => {
      if (typeof window === "undefined") return;
      isInternalUpdateRef.current = false;
      const pathname = window.location.pathname;
      const match = pathname.match(/^\/shop(?:\/([^\/?#]+))?/);
      const slugFromUrl = match && match[1] ? match[1] : undefined;
      setCurrentSlug(slugFromUrl);
    };

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // Sync category state based on local slug state
  useEffect(() => {
    if (!categories || categories.length === 0) return;

    if (isInternalUpdateRef.current) {
      isInternalUpdateRef.current = false;
      return;
    }

    let initialCats = new Set<number>();
    let initialSubs = new Set<number>();
    let initialChilds = new Set<number>();
    let initialExpanded = new Set<number>();

    const activeSlugs = currentSlug ? currentSlug.split("+").filter(Boolean) : [];

    activeSlugs.forEach((slug) => {
      const found = findShopCategoryBySlug(categories, slug);
      if (found) {
        const { category, parent } = found;

        if (parent) {
          const isRootParent = categories.some(c => c.id === parent.id);
          if (isRootParent) {
            initialSubs.add(category.id);
            initialExpanded.add(parent.id);
          } else {
            initialChilds.add(category.id);
            initialExpanded.add(parent.id);
            const rootParent = categories.find(c => c.children?.some(sub => sub.id === parent.id));
            if (rootParent) {
              initialExpanded.add(rootParent.id);
            }
          }
        } else {
          initialCats.add(category.id);
          initialExpanded.add(category.id);
        }
      }
    });

    // Cascade down from selected roots
    initialCats.forEach(catId => {
      const cat = categories.find(c => c.id === catId);
      cat?.children?.forEach(sub => {
        initialSubs.add(sub.id);
        sub.children?.forEach(child => initialChilds.add(child.id));
      });
    });

    // Cascade down from selected subcategories
    initialSubs.forEach(subId => {
      categories.forEach(c => {
        const sub = c.children?.find(s => s.id === subId);
        sub?.children?.forEach(child => initialChilds.add(child.id));
      });
    });

    setSelectedCategories(initialCats);
    setSelectedSubCategories(initialSubs);
    setSelectedChildCategories(initialChilds);
    setExpandedCategories(prev => new Set([...Array.from(prev), ...Array.from(initialExpanded)]));
  }, [currentSlug, categories]);

  const computeSlugsFromState = useCallback((
    cats: Set<number>,
    subs: Set<number>,
    childs: Set<number>
  ): string[] => {
    const slugs: string[] = [];

    categories.forEach(cat => {
      if (cats.has(cat.id)) {
        slugs.push(cat.slug);
      } else {
        cat.children?.forEach(sub => {
          if (subs.has(sub.id)) {
            slugs.push(sub.slug);
          } else {
            sub.children?.forEach(ch => {
              if (childs.has(ch.id)) {
                slugs.push(ch.slug);
              }
            });
          }
        });
      }
    });

    return slugs;
  }, [categories]);

  const toggleCategory = (catId: number) => {
    const category = categories.find(c => c.id === catId);
    if (!category) return;

    const isCatChecked = selectedCategories.has(catId);

    const nextCats = new Set(selectedCategories);
    const nextSubs = new Set(selectedSubCategories);
    const nextChilds = new Set(selectedChildCategories);

    if (isCatChecked) {
      nextCats.delete(catId);
      category.children?.forEach(sub => {
        nextSubs.delete(sub.id);
        sub.children?.forEach(ch => nextChilds.delete(ch.id));
      });
    } else {
      nextCats.add(catId);
      setExpandedCategories(prev => new Set(prev).add(catId));
      category.children?.forEach(sub => {
        nextSubs.add(sub.id);
        sub.children?.forEach(ch => nextChilds.add(ch.id));
      });
    }

    isInternalUpdateRef.current = true;
    setSelectedCategories(nextCats);
    setSelectedSubCategories(nextSubs);
    setSelectedChildCategories(nextChilds);
    setProductPage(1);
    setAccumulatedProducts([]);

    const newSlugs = computeSlugsFromState(nextCats, nextSubs, nextChilds);
    const newSlugParam = newSlugs.length > 0 ? newSlugs.join("+") : undefined;
    updateUrlAndSlug(newSlugParam);
  };

  const toggleSubCategory = (subCatId: number, parentId: number) => {
    const parent = categories.find(c => c.id === parentId);
    const sub = parent?.children?.find(s => s.id === subCatId);
    if (!sub) return;

    const isSubChecked = selectedSubCategories.has(subCatId);

    const nextCats = new Set(selectedCategories);
    const nextSubs = new Set(selectedSubCategories);
    const nextChilds = new Set(selectedChildCategories);

    if (isSubChecked) {
      nextSubs.delete(subCatId);
      nextCats.delete(parentId);
      sub.children?.forEach(ch => nextChilds.delete(ch.id));
    } else {
      nextSubs.add(subCatId);
      setExpandedCategories(prev => new Set(prev).add(parentId).add(subCatId));
      sub.children?.forEach(ch => nextChilds.add(ch.id));

      if (parent?.children && parent.children.every(s => nextSubs.has(s.id))) {
        nextCats.add(parentId);
      }
    }

    isInternalUpdateRef.current = true;
    setSelectedCategories(nextCats);
    setSelectedSubCategories(nextSubs);
    setSelectedChildCategories(nextChilds);
    setProductPage(1);
    setAccumulatedProducts([]);

    const newSlugs = computeSlugsFromState(nextCats, nextSubs, nextChilds);
    const newSlugParam = newSlugs.length > 0 ? newSlugs.join("+") : undefined;
    updateUrlAndSlug(newSlugParam);
  };

  const toggleChildCategory = (childId: number, subCatId: number, parentId: number) => {
    const parent = categories.find(c => c.id === parentId);
    const sub = parent?.children?.find(s => s.id === subCatId);
    const child = sub?.children?.find(ch => ch.id === childId);
    if (!child) return;

    const isChildChecked = selectedChildCategories.has(childId);

    const nextCats = new Set(selectedCategories);
    const nextSubs = new Set(selectedSubCategories);
    const nextChilds = new Set(selectedChildCategories);

    if (isChildChecked) {
      nextChilds.delete(childId);
      nextSubs.delete(subCatId);
      nextCats.delete(parentId);
    } else {
      nextChilds.add(childId);
      setExpandedCategories(prev => new Set(prev).add(parentId).add(subCatId));
      if (sub?.children && sub.children.every(c => nextChilds.has(c.id))) {
        nextSubs.add(subCatId);
      }
      if (parent?.children && parent.children.every(s => nextSubs.has(s.id))) {
        nextCats.add(parentId);
      }
    }

    isInternalUpdateRef.current = true;
    setSelectedCategories(nextCats);
    setSelectedSubCategories(nextSubs);
    setSelectedChildCategories(nextChilds);
    setProductPage(1);
    setAccumulatedProducts([]);

    const newSlugs = computeSlugsFromState(nextCats, nextSubs, nextChilds);
    const newSlugParam = newSlugs.length > 0 ? newSlugs.join("+") : undefined;
    updateUrlAndSlug(newSlugParam);
  };

  const removeFilterBySlug = (slugToRemove: string) => {
    for (const cat of categories) {
      if (cat.slug === slugToRemove) {
        toggleCategory(cat.id);
        return;
      }
      for (const sub of cat.children || []) {
        if (sub.slug === slugToRemove) {
          toggleSubCategory(sub.id, cat.id);
          return;
        }
        for (const child of sub.children || []) {
          if (child.slug === slugToRemove) {
            toggleChildCategory(child.id, sub.id, cat.id);
            return;
          }
        }
      }
    }
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
    isInternalUpdateRef.current = true;
    setSelectedCategories(new Set());
    setSelectedSubCategories(new Set());
    setSelectedChildCategories(new Set());
    setProductPage(1);
    setAccumulatedProducts([]);
    updateUrlAndSlug(undefined);
  };

  const selectAllFilters = () => {
    clearAllFilters();
  };

  const selectedFilterItems: ShopCategoryItem[] = [];
  categories.forEach(cat => {
    if (selectedCategories.has(cat.id)) {
      selectedFilterItems.push(cat);
    } else {
      cat.children?.forEach(sub => {
        if (selectedSubCategories.has(sub.id)) {
          selectedFilterItems.push(sub);
        } else {
          sub.children?.forEach(ch => {
            if (selectedChildCategories.has(ch.id)) {
              selectedFilterItems.push(ch);
            }
          });
        }
      });
    }
  });

  const activeSlugs = currentSlug ? currentSlug.split("+").filter(Boolean) : [];
  const matchedCategories = selectedFilterItems;

  const activeCategoryTitle = (() => {
    if (selectedFilterItems.length === 0) return "All Products";
    if (selectedFilterItems.length === 1) return decodeHtmlEntities(selectedFilterItems[0].name);
    return "Filtered Products";
  })();

  const activeCategoryItem: ShopCategoryItem | null = selectedFilterItems.length === 1 ? selectedFilterItems[0] : null;

  // Sync document title and canonical with selected categories
  useEffect(() => {
    if (!categories || categories.length === 0) return;

    if (selectedFilterItems.length === 1) {
      const cleanTitle = decodeHtmlEntities(selectedFilterItems[0].name).replace(/\s*[\-–|]\s*siraj\s*tech\s*$/i, "").trim();
      document.title = `${cleanTitle} | Siraj Tech`;
      const canonicalEl = document.querySelector('link[rel="canonical"]');
      if (canonicalEl) {
        canonicalEl.setAttribute("href", `/shop/${selectedFilterItems[0].slug}`);
      }
    } else if (selectedFilterItems.length > 1) {
      document.title = `Filtered Products | Siraj Tech`;
      const canonicalEl = document.querySelector('link[rel="canonical"]');
      if (canonicalEl) {
        canonicalEl.setAttribute("href", "/shop");
      }
    } else {
      document.title = "Shop | Siraj Tech";
      const canonicalEl = document.querySelector('link[rel="canonical"]');
      if (canonicalEl) {
        canonicalEl.setAttribute("href", "/shop");
      }
    }
  }, [selectedFilterItems, categories]);

  const view = getShopCategoryView(categories, currentSlug ? currentSlug.split("+")[0] : undefined);

  // Reset page when slug changes
  useEffect(() => {
    setProductPage(1);
    setAccumulatedProducts([]);
  }, [currentSlug]);

  const {
    data: productsData,
    isLoading: productsLoading,
    isError: productsError,
    refetch: refetchProducts,
    isFetching: productsFetching,
  } = useQuery({
    queryKey: [
      "products",
      Array.from(selectedCategories).sort().join(","),
      Array.from(selectedSubCategories).sort().join(","),
      Array.from(selectedChildCategories).sort().join(","),
      productPage,
      selectedBrandId,
    ],
    queryFn: async () => {
      // Show all products when no filters selected
      if (selectedCategories.size === 0 && selectedSubCategories.size === 0 && selectedChildCategories.size === 0) {
        return fetchProducts({ brand_id: selectedBrandId, page: productPage });
      }

      // Fast path: single root category
      if (selectedCategories.size === 1 && selectedSubCategories.size === 0) {
        const catId = Array.from(selectedCategories)[0];
        return fetchProducts({ categoryId: catId, brand_id: selectedBrandId, page: productPage });
      }
      // Fast path: single root category with its subcategories
      if (selectedCategories.size === 1) {
        const catId = Array.from(selectedCategories)[0];
        const category = categories.find((c) => c.id === catId);
        const childIds = category?.children?.map((ch) => ch.id) || [];
        const allChildrenSelected = childIds.length > 0 && childIds.every((id) => selectedSubCategories.has(id));
        if (allChildrenSelected && selectedSubCategories.size === childIds.length) {
          return fetchProducts({ categoryId: catId, brand_id: selectedBrandId, page: productPage });
        }
      }

      // Fast path: single subcategory
      if (selectedCategories.size === 0 && selectedSubCategories.size === 1) {
        const subCatId = Array.from(selectedSubCategories)[0];
        return fetchProducts({ subCategoryId: subCatId, brand_id: selectedBrandId, page: productPage });
      }

      // Fast path: single child category
      if (selectedCategories.size === 0 && selectedSubCategories.size === 0 && selectedChildCategories.size === 1) {
        const childCatId = Array.from(selectedChildCategories)[0];
        return fetchProducts({ childCategoryId: childCatId, brand_id: selectedBrandId, page: productPage });
      }

      // Parallel queries for multiple selections
      const promises: Promise<any>[] = [];

      selectedCategories.forEach((id) => {
        promises.push(fetchProducts({ categoryId: id, brand_id: selectedBrandId }));
      });

      selectedSubCategories.forEach((id) => {
        const parent = categories.find((c) => c.children?.some((ch) => ch.id === id));
        if (!parent || !selectedCategories.has(parent.id)) {
          promises.push(fetchProducts({ subCategoryId: id, brand_id: selectedBrandId }));
        }
      });

      selectedChildCategories.forEach((id) => {
        let isCovered = false;
        for (const cat of categories) {
          if (selectedCategories.has(cat.id)) {
            if (cat.children?.some(sub => sub.children?.some(child => child.id === id))) {
              isCovered = true;
              break;
            }
          }
          const subCat = cat.children?.find(sub => sub.children?.some(child => child.id === id));
          if (subCat && selectedSubCategories.has(subCat.id)) {
            isCovered = true;
            break;
          }
        }
        if (!isCovered) {
          promises.push(fetchProducts({ childCategoryId: id, brand_id: selectedBrandId }));
        }
      });

      const results = await Promise.allSettled(promises);

      const allItems: Product[] = [];
      const seenIds = new Set<number>();

      results.forEach((result) => {
        if (result.status !== "fulfilled") return;
        const list = result.value?.data || [];
        list.forEach((item: Product) => {
          if (!seenIds.has(item.id)) {
            seenIds.add(item.id);
            allItems.push(item);
          }
        });
      });

      const perPage = 12;
      const total = allItems.length;
      const lastPage = Math.max(1, Math.ceil(total / perPage));
      const currentPage = Math.min(productPage, lastPage);
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
    enabled: categories.length > 0,
    staleTime: 2 * 60 * 1000,
  });

  // Sync accumulated products
  useEffect(() => {
    if (!productsData) return;

    setTotalProducts(productsData.total);
    setHasMore(productsData.current_page < productsData.last_page);

    if (productsData.current_page === 1) {
      setAccumulatedProducts(productsData.data);
    } else {
      setAccumulatedProducts((prev) => {
        const existingIds = new Set(prev.map((p) => p.id));
        const newItems = productsData.data.filter((p) => !existingIds.has(p.id));
        return [...prev, ...newItems];
      });
    }
  }, [productsData]);

  const products = (productPage === 1 && productsLoading) ? [] : accumulatedProducts;

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
        {(selectedCategories.size > 0 || selectedSubCategories.size > 0 || selectedChildCategories.size > 0) && (
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
      {matchedCategories.length > 0 && (
        <div className="flex items-center gap-1.5 mb-4 px-3 py-2 bg-primary/5 border border-primary/20 rounded-lg">
          <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
          <span className="text-xs font-medium text-primary">
            {matchedCategories.length} {matchedCategories.length === 1 ? "category" : "categories"} selected
          </span>
        </div>
      )}

      <div className="space-y-1">
        {categories.map((category) => {
          const isExpanded = expandedCategories.has(category.id);
          const hasSub = category.children && category.children.length > 0;
          const isCatChecked = selectedCategories.has(category.id);

          return (
            <div key={category.id}>
              {/* Category row */}
              <div
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 transition-all duration-200 group cursor-pointer",
                  isCatChecked
                    ? "bg-primary/10 text-primary"
                    : "hover:bg-muted/60 text-foreground/80"
                )}
                onClick={() => toggleCategory(category.id)}
              >
                {/* Custom checkbox */}
                <div
                  className={cn(
                    "flex items-center justify-center w-4 h-4 shrink-0 rounded border-2 transition-all duration-200",
                    isCatChecked
                      ? "bg-primary border-primary"
                      : "border-gray-400 group-hover:border-primary/70"
                  )}
                >
                  {isCatChecked && (
                    <svg width="9" height="7" viewBox="0 0 9 7" fill="none">
                      <path d="M1 3.5L3.5 6L8 1" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </div>

                <span
                  className={cn(
                    "text-sm font-medium flex-1 leading-snug break-words select-none",
                    isCatChecked ? "text-primary font-semibold" : "text-foreground/75 group-hover:text-foreground"
                  )}
                >
                  {decodeHtmlEntities(category.name)}
                </span>

                {/* Sub-category count badge */}
                {hasSub && (
                  <span className={cn(
                    "text-[10px] font-bold px-1.5 py-0.5 rounded-full shrink-0 transition-colors",
                    isCatChecked ? "bg-primary/20 text-primary" : "bg-muted text-muted-foreground"
                  )}>
                    {category.children.length}
                  </span>
                )}

                {/* Expand toggle */}
                {hasSub && (
                  <button
                    onClick={(e) => { e.stopPropagation(); toggleExpand(category.id); }}
                    className={cn(
                      "p-0.5 rounded shrink-0 transition-all duration-200",
                      isCatChecked ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
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
              {hasSub && (
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300 ease-in-out",
                    isExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                  )}
                >
                  <div className="flex flex-col gap-0.5 pl-4 ml-3 border-l-2 border-primary/15 mt-1 mb-1">
                    {category.children.map((sub) => {
                      const isSubChecked = selectedSubCategories.has(sub.id);
                      const hasChild = sub.children && sub.children.length > 0;
                      const isSubExpanded = expandedCategories.has(sub.id);

                      return (
                        <div key={sub.id}>
                          <div
                            className={cn(
                              "flex items-center gap-2 rounded-lg px-2.5 py-2 cursor-pointer transition-all duration-200 group",
                              isSubChecked ? "bg-primary/8 text-primary" : "hover:bg-muted/50"
                            )}
                            onClick={() => toggleSubCategory(sub.id, category.id)}
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
                              {decodeHtmlEntities(sub.name)}
                            </label>

                            {/* Expand toggle for subcategory */}
                            {hasChild && (
                              <button
                                onClick={(e) => { e.stopPropagation(); toggleExpand(sub.id); }}
                                className={cn(
                                  "p-0.5 rounded shrink-0 transition-all duration-200",
                                  isSubChecked ? "text-primary" : "text-muted-foreground group-hover:text-foreground"
                                )}
                              >
                                <ChevronRight
                                  size={12}
                                  className={cn(
                                    "transition-transform duration-200",
                                    isSubExpanded ? "rotate-90" : "rotate-0"
                                  )}
                                />
                              </button>
                            )}
                          </div>

                          {/* Child categories */}
                          {hasChild && (
                            <div
                              className={cn(
                                "overflow-hidden transition-all duration-300 ease-in-out",
                                isSubExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                              )}
                            >
                              <div className="flex flex-col gap-0.5 pl-4 ml-3 border-l-2 border-primary/15 mt-1 mb-1">
                                {sub.children?.map((childCat) => {
                                  const isChildChecked = selectedChildCategories.has(childCat.id);
                                  return (
                                    <div
                                      key={childCat.id}
                                      className={cn(
                                        "flex items-center gap-2 rounded-lg px-2.5 py-1.5 cursor-pointer transition-all duration-200 group",
                                        isChildChecked ? "bg-primary/5 text-primary" : "hover:bg-muted/30"
                                      )}
                                      onClick={() => toggleChildCategory(childCat.id, sub.id, category.id)}
                                    >
                                      {/* Custom child-checkbox */}
                                      <div
                                        className={cn(
                                          "flex items-center justify-center w-3 h-3 shrink-0 rounded border transition-all duration-200",
                                          isChildChecked
                                            ? "bg-primary border-primary"
                                            : "border-gray-400 group-hover:border-primary/60"
                                        )}
                                      >
                                        {isChildChecked && (
                                          <svg width="6" height="4.5" viewBox="0 0 7 5.5" fill="none">
                                            <path d="M1 2.75L2.75 4.5L6 1" stroke="white" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                                          </svg>
                                        )}
                                      </div>
                                      <label
                                        className={cn(
                                          "text-[11px] font-medium leading-snug break-words flex-1 cursor-pointer select-none transition-colors",
                                          isChildChecked ? "text-primary font-semibold" : "text-muted-foreground group-hover:text-foreground"
                                        )}
                                      >
                                        {decodeHtmlEntities(childCat.name)}
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
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  return (
    <>
      <main id="main-content" role="main" className="flex-grow bg-gradient-to-b from-section-alt/40 via-background to-background">
        {/* Breadcrumb */}
        <div className="bg-slate-100 py-3 md:py-4">
          <div className="container-main">
            <div className="flex items-center gap-2 text-xs md:text-sm">
              <Link
                href="/"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                HOME
              </Link>
              <span className="text-muted-foreground">/</span>
              <Link
                href="/shop"
                onClick={() => clearAllFilters()}
                className="text-muted-foreground hover:text-primary transition-colors uppercase"
              >
                Shop
              </Link>
              {matchedCategories.length > 0 && (
                <>
                  <span className="text-muted-foreground">/</span>
                  <span className="text-foreground font-medium truncate max-w-[280px]">
                    {activeCategoryTitle}
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="container-main px-3 py-4 sm:px-4 sm:py-8 md:px-6 md:py-10">
          {isLoading ? (
            <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">
              {/* Sidebar Skeleton */}
              <aside className="hidden md:block w-64 lg:w-72 shrink-0 bg-white border border-border/40 rounded-2xl p-5 shadow-sm sticky top-24">
                <div className="h-5 w-32 bg-gray-200 animate-pulse rounded mb-6"></div>
                <div className="flex flex-col gap-5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="h-4 w-4 bg-gray-200 animate-pulse rounded"></div>
                      <div className="h-4 w-3/4 bg-gray-200 animate-pulse rounded"></div>
                    </div>
                  ))}
                </div>
              </aside>

              {/* Main Catalog Skeleton */}
              <div className="flex-grow w-full">
                {/* Mobile Header / Filters Skeleton */}
                <div className="flex items-center justify-between gap-3 mb-6 bg-white p-3.5 rounded-xl border border-border/40 shadow-sm">
                  <div className="h-4 w-32 bg-gray-200 animate-pulse rounded"></div>
                  <div className="md:hidden h-8 w-20 bg-gray-200 animate-pulse rounded-full"></div>
                </div>

                <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <ProductSkeleton key={i} />
                  ))}
                </div>
              </div>
            </div>
          ) : isError ? (
            <AnimatedSection>
              <div className="mx-auto max-w-md rounded-2xl border border-destructive/20 bg-white p-8 text-center shadow-card">
                <p className="mb-4 text-muted-foreground">
                  Could not load categories. Please try again.
                </p>
                <button
                  type="button"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
                >
                  {isFetching ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : (
                    <RefreshCw size={16} />
                  )}
                  Retry
                </button>
              </div>
            </AnimatedSection>
          ) : (activeSlugs.length === 1 && view.notFound) || (activeSlugs.length > 1 && matchedCategories.length === 0) ? (
            <AnimatedSection>
              <div className="mx-auto max-w-md rounded-2xl border border-border bg-white p-10 text-center shadow-card">
                <PackageOpen className="mx-auto mb-4 text-muted-foreground/50" size={48} />
                <h2 className="mb-2 text-lg font-bold text-foreground">Category not found</h2>
                <p className="mb-6 text-sm text-muted-foreground">
                  This category may have been removed or the link is incorrect.
                </p>
                <Link
                  href="/shop"
                  onClick={() => clearAllFilters()}
                  className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                >
                  Back to Shop
                </Link>
              </div>
            </AnimatedSection>
          ) : (
            <AnimatedSection>
              <div className="flex flex-col md:flex-row gap-6 lg:gap-8 items-start">

                {/* Desktop Sidebar (Left side, sticky) */}
                <aside className="hidden md:block w-64 lg:w-72 shrink-0 bg-white border border-border/40 rounded-2xl p-5 shadow-sm sticky top-24">
                  {renderSidebarContent()}
                </aside>

                {/* Main Catalog View (Right side) */}
                <div className="flex-grow w-full">

                  {/* Header Bar with Title, Active Filter Chips & Filters Trigger */}
                  <div className="mb-6 bg-white p-4 sm:p-5 rounded-2xl border border-border/40 shadow-sm">
                    <div className="flex items-start sm:items-center justify-between gap-3">
                      <div className="min-w-0 flex-1">
                        <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-foreground tracking-tight">
                          {activeCategoryTitle}
                        </h1>
                        {activeCategoryItem && (activeCategoryItem.short_description || activeCategoryItem.long_description || activeCategoryItem.meta_description) && (
                          <div className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-1.5">
                            {(() => {
                              const desc = activeCategoryItem.short_description || activeCategoryItem.long_description || activeCategoryItem.meta_description || '';
                              if (/<[a-z][\s\S]*>/i.test(desc)) {
                                return <div className="prose prose-sm max-w-none text-muted-foreground" dangerouslySetInnerHTML={{ __html: desc }} />;
                              }
                              return <p className="leading-relaxed">{desc}</p>;
                            })()}
                          </div>
                        )}
                      </div>

                      {/* Mobile Filters Trigger (Right side on mobile) */}
                      <button
                        onClick={() => setMobileFiltersOpen(true)}
                        className="md:hidden shrink-0 inline-flex items-center gap-1.5 px-3.5 py-1.5 sm:px-4 sm:py-2 bg-primary/5 hover:bg-primary/10 border border-primary/20 rounded-full text-xs font-bold text-primary transition-all shadow-sm"
                      >
                        <SlidersHorizontal size={13} />
                        Filters
                        {(selectedCategories.size > 0 || selectedSubCategories.size > 0 || selectedChildCategories.size > 0) && (
                          <span className="flex h-4.5 w-4.5 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-white leading-none">
                            {selectedCategories.size + selectedSubCategories.size + selectedChildCategories.size}
                          </span>
                        )}
                      </button>
                    </div>

                    {/* Active Selected Filter Chips */}
                    {selectedFilterItems.length > 0 && (
                      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-border/40">
                        <span className="text-xs font-semibold text-muted-foreground mr-1">
                          {selectedFilterItems.length > 1 ? "Selected Filters:" : "Active Category:"}
                        </span>
                        {selectedFilterItems.map((item) => (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => removeFilterBySlug(item.slug)}
                            className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/10 hover:bg-primary/20 text-primary text-xs font-medium rounded-full transition-all group cursor-pointer border border-primary/20"
                            title={`Remove ${decodeHtmlEntities(item.name)}`}
                          >
                            <span>{decodeHtmlEntities(item.name)}</span>
                            <X size={12} className="group-hover:scale-125 transition-transform" />
                          </button>
                        ))}
                        <button
                          type="button"
                          onClick={clearAllFilters}
                          className="text-xs text-muted-foreground hover:text-destructive underline ml-1 cursor-pointer transition-colors"
                        >
                          Clear All
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Products Grid / Fetching States */}
                  {productsLoading && accumulatedProducts.length === 0 ? (
                    <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
                      {Array.from({ length: 8 }).map((_, i) => (
                        <ProductSkeleton key={i} />
                      ))}
                    </div>
                  ) : productsError ? (
                    <div className="mx-auto max-w-md rounded-2xl border border-destructive/20 bg-white p-8 text-center shadow-card">
                      <p className="mb-4 text-muted-foreground">
                        Could not load products. Please try again.
                      </p>
                      <button
                        type="button"
                        onClick={() => refetchProducts()}
                        disabled={productsFetching}
                        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600 disabled:opacity-60"
                      >
                        {productsFetching ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <RefreshCw size={16} />
                        )}
                        Retry
                      </button>
                    </div>
                  ) : products.length === 0 ? (
                    <div className="mx-auto max-w-lg rounded-2xl border border-border/60 bg-white p-8 text-center shadow-card sm:p-10">
                      <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10 text-primary">
                        <PackageOpen size={32} />
                      </div>
                      <h2 className="mb-2 text-lg font-bold text-foreground sm:text-xl">
                        No Products Found
                      </h2>
                      <p className="mb-6 text-sm text-muted-foreground sm:text-base">
                        No products matched the selected filters. Please adjust your categories or show all.
                      </p>
                      <div className="flex justify-center gap-3">
                        <button
                          onClick={selectAllFilters}
                          className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
                        >
                          Show All Products
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* Product Cards Grid */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3 md:gap-5">
                        {products.map((product) => (
                          <ProductCardEnhanced
                            key={product.id}
                            image={getImageUrl(product.thumbnail_image)}
                            title={product.name}
                            price={formatProductPrice(product, isWholesaler)}
                            originalPrice={formatOriginalPrice(product, isWholesaler)}
                            badge={product.sale_price ? "Sale" : undefined}
                            productId={product.slug}
                          />
                        ))}
                      </div>

                      {/* Load More & Progress Section */}
                      {totalProducts > 0 && (
                        <div className="w-full pt-8 pb-10 flex flex-col items-center justify-center">
                          {hasMore ? (
                            <div className="flex flex-col items-center gap-3.5 max-w-xs w-full px-4">
                              <p className="text-xs text-muted-foreground font-medium">
                                Showing <span className="font-bold text-foreground">{products.length}</span> of <span className="font-bold text-foreground">{totalProducts}</span> products
                              </p>
                              
                              {/* Progress bar */}
                              <div className="w-full h-1.5 bg-slate-200/80 rounded-full overflow-hidden">
                                <div
                                  className="h-full bg-gradient-to-r from-primary to-primary-600 rounded-full transition-all duration-500 ease-out"
                                  style={{ width: `${Math.min(100, Math.round((products.length / totalProducts) * 100))}%` }}
                                />
                              </div>

                              <button
                                type="button"
                                onClick={() => setProductPage((prev) => prev + 1)}
                                disabled={productsFetching}
                                className="mt-2 group relative inline-flex items-center justify-center gap-2.5 px-8 py-3 rounded-full bg-primary hover:bg-primary-600 active:scale-98 text-white font-semibold text-sm shadow-md shadow-primary/20 hover:shadow-lg hover:shadow-primary/30 transition-all duration-300 disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
                              >
                                {productsFetching ? (
                                  <>
                                    <Loader2 size={16} className="animate-spin" />
                                    <span>Loading Products...</span>
                                  </>
                                ) : (
                                  <>
                                    <span>Load More Products</span>
                                    <ArrowDown size={15} className="group-hover:translate-y-0.5 transition-transform duration-300" />
                                  </>
                                )}
                              </button>
                            </div>
                          ) : (
                            totalProducts > 12 && (
                              <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-100/80 border border-slate-200/80 text-xs font-semibold text-muted-foreground shadow-2xs">
                                <CheckCircle2 size={15} className="text-emerald-500 shrink-0" />
                                <span>You have viewed all {totalProducts} products</span>
                              </div>
                            )
                          )}
                        </div>
                      )}
                    </>
                  )}

                  {/* Category Long Description Section */}
                  {activeCategoryItem && (activeCategoryItem.long_description || activeCategoryItem.short_description) && (
                    <CategoryLongDescription
                      categoryName={activeCategoryItem.name}
                      shortDescription={activeCategoryItem.short_description}
                      longDescription={activeCategoryItem.long_description}
                    />
                  )}
                </div>
              </div>
            </AnimatedSection>
          )}
        </div>
      </main>

      {/* Mobile Filters Drawer Overlay */}
      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-[100] md:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="absolute inset-0 bg-black/55 backdrop-blur-xs transition-opacity duration-300"
            onClick={() => setMobileFiltersOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-80 max-w-[85vw] h-full bg-white shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border/60">
              <h2 className="font-extrabold text-foreground text-base">Filters</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="p-1.5 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            {/* Content */}
            <div className="flex-grow overflow-y-auto p-5">
              {renderSidebarContent()}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-border/60 bg-muted/20">
              <button
                onClick={() => setMobileFiltersOpen(false)}
                className="w-full btn-gradient-primary text-white py-2.5 rounded-xl font-bold text-sm shadow hover:shadow-md transition-all text-center"
              >
                Apply Filters ({totalProducts} Products)
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShopClient;
