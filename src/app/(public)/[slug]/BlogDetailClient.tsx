'use client';

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/autoplay";
import "@/text-editor.css";
import {
  ArrowLeft,
  ChevronRight,
  RefreshCw,
  ChevronLeft,
} from "lucide-react";
import ContactActionButtons from "@/components/ContactActionButtons";
import BlogCard from "@/components/blog/BlogCard";
import {
  fetchBlogBySlug,
  fetchBlogs,
  formatBlogDate,
  getBlogImageUrl,
} from "@/lib/api/blog";
import { getCategoryImageUrl } from "@/lib/api";

const DEMO_CATEGORY_IMAGE = "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><rect width='100' height='100' fill='%23f0fdf4' rx='12'/><circle cx='50' cy='50' r='30' fill='%23dcfce7'/><path d='M50 30 C38 45 38 65 50 70 C62 65 62 45 50 30 Z' fill='%2316a34a'/><path d='M50 30 L50 70' stroke='%23dcfce7' stroke-width='2'/></svg>";
import { ContentSkeleton } from "@/components/PageLoader";

const BlogDetailClient = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const router = useRouter();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const {
    data: post,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["blog", slug],
    queryFn: () => fetchBlogBySlug(slug!),
    enabled: !!slug,
    staleTime: 5 * 60 * 1000,
    retry: false,
  });

  const { data: relatedData } = useQuery({
    queryKey: ["blogs", "related", post?.category_id, post?.slug],
    queryFn: () =>
      fetchBlogs({
        categoryId: post!.category_id,
        perPage: 4,
        page: 1,
      }),
    enabled: !!post?.category_id,
    staleTime: 5 * 60 * 1000,
  });

  const relatedPosts =
    relatedData?.data.filter((b) => b.slug !== post?.slug).slice(0, 3) ?? [];

  if (isLoading) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <ContentSkeleton />
      </div>
    );
  }

  if (isError || !post) {
    return (
      <div className="flex min-h-screen flex-col bg-background">
        <main className="flex flex-grow items-center justify-center p-8">
          <div className="max-w-lg rounded-2xl border border-border bg-white p-10 text-center shadow-sm">
            <h1 className="mb-3 text-2xl font-bold text-foreground">Article not found</h1>
            <p className="mb-6 text-muted-foreground">
              The article you are looking for may have been moved or removed.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button
                type="button"
                onClick={() => refetch()}
                className="inline-flex items-center gap-2 rounded-xl border border-border px-5 py-2.5 text-sm font-semibold transition-colors hover:bg-muted"
              >
                <RefreshCw size={16} />
                Retry
              </button>
              <button
                type="button"
                onClick={() => router.push("/blog")}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-600"
              >
                <ArrowLeft size={16} />
                Back to blog
              </button>
            </div>
          </div>
        </main>
      </div>
    );
  }

  const imageUrl = getBlogImageUrl(post);
  const displayDate = formatBlogDate(post.published_at || post.created_at);

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-section-alt/20 via-background to-background">
      <main className="flex-grow pb-16 pt-8 md:pt-10">
        <div className="container-main">
          <nav
            aria-label="Breadcrumb"
            className="mb-6 flex flex-wrap items-center gap-1.5 text-sm text-muted-foreground"
          >
            <Link href="/" className="transition-colors hover:text-primary">
              Home
            </Link>
            <ChevronRight size={14} />
            <Link href="/blog" className="transition-colors hover:text-primary">
              Blog
            </Link>
            <ChevronRight size={14} />
            <span className="line-clamp-1 font-medium text-foreground">{post.title}</span>
          </nav>

          <button
            type="button"
            onClick={() => router.push("/blog")}
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-700"
          >
            <ArrowLeft size={16} />
            Back to all articles
          </button>
            <article className="overflow-hidden rounded-3xl border border-border/60 bg-white shadow-sm">
              {imageUrl && (
                <div className="relative aspect-video md:aspect-[2/1] max-h-[500px] w-full overflow-hidden bg-muted">
                  <img
                    src={imageUrl}
                    alt={post.title}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </div>
              )}

              <div className="p-6 md:p-10 lg:p-12">
                <ContactActionButtons className="flex flex-wrap gap-3 mb-6" />

                <div className="mb-6 flex flex-wrap items-center gap-3">
                  {post.category?.title && (
                    <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-primary">
                      {post.category.title}
                    </span>
                  )}
                </div>

                <h1 className="mb-6 text-2xl font-bold leading-snug text-foreground sm:text-3xl md:text-4xl lg:text-[42px] lg:leading-tight">
                  {post.title}
                </h1>

                <div className="prose max-w-none text-editor-content mb-8">
                  <div className="text-sm md:text-base text-muted-foreground leading-relaxed" dangerouslySetInnerHTML={{ __html: post.content || "" }} />
                </div>

                <ContactActionButtons />

                {post.product_categories && post.product_categories.length > 0 && (
                  <div className="mt-14 border-t border-border/60 pt-10">
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center gap-3">
                        <span className="w-1 h-7 rounded-full bg-gradient-to-b from-primary to-primary-600 shrink-0"></span>
                        <div>
                          <p className="text-[11px] font-semibold text-primary uppercase tracking-widest leading-none mb-0.5">
                            Categories
                          </p>
                          <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                            Related Categories
                          </h2>
                        </div>
                      </div>
                    </div>

                    <div className="relative group/slider">
                      <style>{`
                        .blog-categories-swiper {
                          padding: 10px 5px 25px 5px !important;
                          margin: -10px -5px -25px -5px !important;
                        }
                      `}</style>
                      
                      <button className="blog-categories-swiper-prev absolute left-0 top-[40%] -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md text-primary opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white disabled:opacity-0 disabled:hidden">
                        <ChevronLeft size={18} />
                      </button>
                      <button className="blog-categories-swiper-next absolute right-0 top-[40%] -translate-y-1/2 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white shadow-md text-primary opacity-100 md:opacity-0 md:group-hover/slider:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white disabled:opacity-0 disabled:hidden">
                        <ChevronRight size={18} />
                      </button>

                      {isMounted ? (
                        <Swiper
                          modules={[Navigation, Autoplay]}
                          spaceBetween={10}
                          slidesPerView={2}
                          navigation={{
                            nextEl: ".blog-categories-swiper-next",
                            prevEl: ".blog-categories-swiper-prev",
                          }}
                          autoplay={{ delay: 3000, disableOnInteraction: false }}
                          breakpoints={{
                            640: { slidesPerView: 3, spaceBetween: 16 },
                            1024: { slidesPerView: 4, spaceBetween: 20 },
                          }}
                          className="blog-categories-swiper"
                        >
                          {post.product_categories.map((category) => (
                            <SwiperSlide key={category.slug ?? category.name} className="h-auto">
                              <Link
                                href={`/shop/${category.slug}`}
                                className="group block h-full"
                              >
                                <div className="h-full bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)] border border-gray-100 hover:border-primary/30 transition-all duration-300 hover:-translate-y-1 overflow-hidden flex flex-col items-center p-2.5 sm:p-3 gap-3 group/cat">
                                  <div className="w-full aspect-[4/3] bg-gray-50/50 rounded-xl overflow-hidden flex items-center justify-center p-3 sm:p-4">
                                    <img
                                      src={category.image && category.image.trim() !== "" ? getCategoryImageUrl(category.image) : DEMO_CATEGORY_IMAGE}
                                      alt={category.name}
                                      loading="lazy"
                                      onError={(e) => {
                                        e.currentTarget.src = DEMO_CATEGORY_IMAGE;
                                      }}
                                      className="w-full h-full object-contain transition-transform duration-500 group-hover/cat:scale-110 mix-blend-multiply"
                                    />
                                  </div>
                                  <p className="text-sm sm:text-[15px] font-bold text-foreground text-center leading-snug line-clamp-2 group-hover/cat:text-primary transition-colors duration-300 w-full px-2 pb-1 sm:pb-2">
                                    {category.name}
                                  </p>
                                </div>
                              </Link>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      ) : (
                        <div className="flex gap-2 sm:gap-4 overflow-hidden blog-categories-swiper opacity-50">
                          {post.product_categories.slice(0, 4).map((category, i) => (
                            <div key={`skeleton-${i}`} className="w-1/2 sm:w-1/3 lg:w-1/4 shrink-0 h-auto">
                              <div className="block h-full">
                                <div className="h-full bg-white rounded-2xl shadow-[0_2px_10px_rgba(0,0,0,0.04)] border border-gray-100 flex flex-col items-center p-2.5 sm:p-3 gap-3">
                                  <div className="w-full aspect-[4/3] relative bg-gray-50/50 rounded-xl overflow-hidden flex items-center justify-center p-3 sm:p-4">
                                    <img
                                      src={category.image && category.image.trim() !== "" ? getCategoryImageUrl(category.image) : DEMO_CATEGORY_IMAGE}
                                      alt={category.name}
                                      className="w-full h-full object-contain mix-blend-multiply p-2"
                                    />
                                  </div>
                                  <p className="text-sm sm:text-[15px] font-bold text-foreground text-center leading-snug line-clamp-2 w-full px-2 pb-1 sm:pb-2">
                                    {category.name}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {post.youtube_videos && post.youtube_videos.length > 0 && (
                  <div className="mt-10 space-y-4 border-t border-border pt-10">
                    <h2 className="text-xl font-bold text-foreground">Related videos</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {post.youtube_videos
                        .filter((v) => v.is_active)
                        .map((video) => (
                          <a
                            key={video.id}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl border border-border px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5"
                          >
                            {video.url}
                          </a>
                        ))}
                    </div>
                  </div>
                )}

                {post.faqs && post.faqs.length > 0 && (
                  <div className="mt-10 space-y-4 border-t border-border pt-10">
                    <h2 className="text-xl font-bold text-foreground">FAQ</h2>
                    <div className="space-y-3">
                      {post.faqs
                        .filter((f) => f.is_active)
                        .map((faq) => (
                          <details
                            key={faq.id}
                            className="group rounded-xl border border-border bg-section-alt/30 px-5 py-4"
                          >
                            <summary className="cursor-pointer list-none font-semibold text-foreground transition-colors group-open:text-primary">
                              {faq.question}
                            </summary>
                            <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                              {faq.answer}
                            </p>
                          </details>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </article>
          {relatedPosts.length > 0 && (
              <section className="mt-14 md:mt-16">
                <h2 className="mb-8 text-center text-2xl font-bold text-foreground md:text-3xl">
                  Related articles
                </h2>
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                  {relatedPosts.map((blog, idx) => (
                    <BlogCard key={blog.id} blog={blog} delay={idx * 80} />
                  ))}
                </div>
              </section>
          )}
        </div>
      </main>
    </div>
  );
};

export default BlogDetailClient;
