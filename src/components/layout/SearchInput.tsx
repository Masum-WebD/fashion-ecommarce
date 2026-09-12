'use client';

import { useState, useEffect, useRef } from "react";
import { Search, SearchX } from "lucide-react";
import Link from "next/link";
import { searchProductsAPI, type Product } from "@/lib/api/products";
import { getImageUrl } from "@/lib/api/images";

interface SearchInputProps {
  placeholder?: string;
  className?: string;
  autoFocus?: boolean;
  onSelect?: () => void;
}

export function SearchInput({ placeholder = "Search products...", className = "", autoFocus, onSelect }: SearchInputProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<Product[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const trimmedQuery = query.trim();
    if (trimmedQuery.length >= 2) {
      setIsSearching(true);
    }

    const timer = setTimeout(() => {
      if (trimmedQuery.length >= 2) {
        performSearch(trimmedQuery);
      } else {
        setResults([]);
        setIsSearching(false);
      }
    }, 400);
    
    return () => clearTimeout(timer);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const performSearch = async (searchQuery: string) => {
    setIsSearching(true);
    try {
      const res = await searchProductsAPI(searchQuery);
      setResults(res.data || []);
    } catch (error) {
      console.error("Search failed", error);
      setResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSelect = () => {
    setShowDropdown(false);
    setQuery("");
    if (onSelect) onSelect();
  };

  return (
    <div className={`relative group ${className}`} ref={wrapperRef}>
      <input
        type="search"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setShowDropdown(true)}
        autoFocus={autoFocus}
        className="w-full pl-5 pr-12 py-2.5 text-sm bg-gray-50 border border-gray-200 rounded-full shadow-sm outline-none focus:bg-primary/5 transition-all duration-200"
      />
      <button
        type="button"
        className="absolute right-1.5 top-1/2 -translate-y-1/2 bg-primary text-white p-1.5 rounded-full shadow-sm hover:bg-primary/90 transition-all flex items-center justify-center z-10"
        aria-label="Search"
      >
        <Search size={18} strokeWidth={2.5} />
      </button>

      {/* Dropdown */}
      {showDropdown && query.trim().length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-background border border-border shadow-2xl rounded-2xl overflow-hidden z-[100] max-h-[70vh] flex flex-col backdrop-blur-md bg-background/95">
          <div className="p-2 overflow-y-auto custom-scrollbar">
            {isSearching ? (
              <div className="space-y-2 p-1">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="flex items-center gap-3 p-2 rounded-xl animate-pulse">
                    <div className="w-12 h-12 rounded-lg bg-gray-200 shrink-0"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : results.length === 0 ? (
              <div className="py-10 flex flex-col items-center justify-center text-center px-4">
                <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3 text-muted-foreground/50">
                  <SearchX size={24} />
                </div>
                <p className="text-sm font-medium text-foreground">No products found</p>
                {query.trim() !== "" && (
                  <p className="text-xs text-muted-foreground mt-1">
                    We couldn't find anything matching "{query}"
                  </p>
                )}
              </div>
            ) : (
              <div className="space-y-1">
                {query.trim() === "" && results.length > 0 && (
                  <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Suggested Products
                  </div>
                )}
                {results.map((product) => (
                  <Link
                    key={product.id}
                    href={`/product/${product.slug}`}
                    onClick={handleSelect}
                    className="flex items-center gap-3 p-2 hover:bg-muted/80 rounded-xl transition-all duration-200 group/item"
                  >
                    <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 shrink-0 border border-border/40 shadow-sm">
                      {product.thumbnail_image ? (
                        <img
                          src={getImageUrl(product.thumbnail_image)}
                          alt={product.name}
                          className="w-full h-full object-cover group-hover/item:scale-110 transition-transform duration-300"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-muted-foreground text-xs">
                          No img
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="text-sm font-medium text-foreground truncate group-hover/item:text-primary transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs text-muted-foreground truncate mt-0.5">
                        {product.category?.name || "Uncategorized"}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          {results.length > 0 && !isSearching && query.trim() !== "" && (
            <div className="p-2 border-t border-border/50 bg-muted/20">
              <Link
                href={`/shop?search=${encodeURIComponent(query)}`}
                onClick={handleSelect}
                className="block w-full text-center text-sm font-medium text-primary hover:text-primary/80 transition-colors rounded-lg hover:bg-primary/5"
              >
                View all results for "{query}"
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
