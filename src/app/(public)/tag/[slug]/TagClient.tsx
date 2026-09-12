'use client';

import { useState, useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import BlogCard from "@/components/blog/BlogCard";
import Pagination from "@/components/shop/Pagination";
import AnimatedSection from "@/components/home/AnimatedSection";
import { fetchBlogsByTag } from "@/lib/api/blog";
import { Loader2, ArrowRight } from "lucide-react";
import Link from "next/link";

interface TagClientProps {
  slug: string;
}

export default function TagClient({ slug }: TagClientProps) {
  const [page, setPage] = useState(1);
  const perPage = 12;

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['blogsByTag', slug, page, perPage],
    queryFn: () => fetchBlogsByTag(slug, page, perPage),
    staleTime: 60 * 1000, // 1 minute
  });

  const blogs = data?.data || [];
  const pagination = data;

  const tagName = useMemo(() => {
    try {
      const decoded = decodeURIComponent(slug);
      return decoded.replace(/-/g, ' ');
    } catch {
      return slug.replace(/-/g, ' ');
    }
  }, [slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen pt-8 md:pt-12 pb-12 bg-slate-50/50">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <div className="h-8 w-48 bg-slate-200 animate-pulse rounded-lg"></div>
            <div className="h-4 w-64 bg-slate-200 animate-pulse rounded mt-2"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-white rounded-2xl h-[320px] animate-pulse border border-slate-100 shadow-sm" />
            ))}
          </div>
        </div>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="min-h-screen pt-8 md:pt-12 pb-12 bg-slate-50/50 flex items-center justify-center">
        <div className="text-center bg-white p-8 rounded-2xl shadow-sm border border-slate-100 max-w-md">
          <div className="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-800 mb-2">Failed to load blogs</h2>
          <p className="text-slate-500 mb-6">{error instanceof Error ? error.message : "Something went wrong"}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2.5 bg-primary text-white font-medium rounded-xl hover:bg-primary/90 transition-colors"
          >
            Try Again
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen pt-8 md:pt-12 pb-12 bg-slate-50/50">
      <div className="container mx-auto px-4">
        <div className="mb-10 text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-3 capitalize leading-tight">
            Blogs tagged with <span className="text-primary">"{tagName}"</span>
          </h1>
          <p className="text-slate-500 text-lg">
            {pagination?.total || 0} {(pagination?.total === 1) ? 'article' : 'articles'} found
          </p>
        </div>

        {blogs.length > 0 ? (
          <AnimatedSection>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {blogs.map((blog, idx) => (
                <div key={blog.id} className="h-full">
                  <BlogCard blog={blog} delay={idx * 100} />
                </div>
              ))}
            </div>

            {pagination && pagination.last_page > 1 && (
              <div className="mt-12 flex justify-center">
                <Pagination
                  currentPage={pagination.current_page}
                  lastPage={pagination.last_page}
                  onPageChange={(p) => {
                    setPage(p);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </div>
            )}
          </AnimatedSection>
        ) : (
          <AnimatedSection>
            <div className="flex flex-col items-center justify-center py-20 px-6 bg-white/50 backdrop-blur-sm rounded-3xl border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] text-center relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary/40 via-primary to-primary/40"></div>
              
              <h3 className="text-2xl md:text-3xl font-black text-slate-800 mb-4 tracking-tight">No Articles Found</h3>
              <p className="text-slate-500 max-w-md text-base md:text-lg mb-8 leading-relaxed">
                We couldn't find any blog posts associated with the <span className="font-semibold text-primary">"{tagName}"</span> tag right now. 
              </p>
              
              <Link 
                href="/blogs" 
                className="group relative inline-flex items-center gap-2 justify-center px-8 py-3.5 text-base font-bold text-white transition-all duration-200 bg-primary border border-transparent rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary shadow-lg hover:shadow-xl hover:-translate-y-0.5"
              >
                Read Other Articles
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </AnimatedSection>
        )}
      </div>
    </main>
  );
}
