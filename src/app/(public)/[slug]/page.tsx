import { Metadata } from 'next';
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import "@/text-editor.css";
import { ChevronRight, ArrowLeft } from "lucide-react";
import ContactActionButtons from "@/components/ContactActionButtons";
import BlogCard from "@/components/blog/BlogCard";
import RelatedCategoriesSlider from "@/components/blog/RelatedCategoriesSlider";
import {
  fetchBlogBySlug,
  fetchBlogs,
  formatBlogDate,
  getBlogImageUrl,
} from "@/lib/api/blog";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  try {
    const resolvedParams = await params;
    const post = await fetchBlogBySlug(resolvedParams.slug);
    if (!post) return { title: "Blog Not Found | Siraj Tech" };

    let rawTitle = post.meta_title || post.title;
    // Fallback to pure title if meta_title has unparsed Yoast variables
    if (rawTitle.includes("%%")) {
      rawTitle = post.title;
    }
    const cleanTitle = rawTitle.replace(/\s*[\-–|]\s*siraj\s*tech\s*$/i, "").trim();
    
    // Strip HTML from description if it contains any
    const rawDescription = post.meta_description || post.short_description || post.title;
    const description = rawDescription.replace(/<[^>]*>?/gm, "").trim();
    
    const currentPath = `/${post.slug}`;
    const imageUrl = getBlogImageUrl(post);
    
    return {
      title: {
        absolute: `${cleanTitle} | Siraj Tech`,
      },
      description,
      keywords: post.meta_keywords || undefined,
      alternates: {
        canonical: currentPath,
      },
      robots: {
        index: true,
        follow: true,
        googleBot: { index: true, follow: true },
      },
      openGraph: {
        type: 'article',
        locale: 'bn_BD',
        siteName: 'Siraj Tech',
        url: currentPath,
        title: `${cleanTitle} | Siraj Tech`,
        description,
        ...(imageUrl && {
          images: [
            {
              url: imageUrl,
              width: 800,
              height: 600,
              alt: cleanTitle,
            }
          ]
        })
      },
      twitter: {
        card: 'summary_large_image',
        site: '@siraj_tech24',
        title: `${cleanTitle} | Siraj Tech`,
        description,
        ...(imageUrl && { images: [imageUrl] })
      }
    };
  } catch (error) {
    return {
      title: {
        absolute: "Blog | Siraj Tech"
      }
    };
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  let post;
  
  try {
    post = await fetchBlogBySlug(resolvedParams.slug);
  } catch (error) {
    notFound();
  }

  if (!post) {
    notFound();
  }

  let relatedPosts: any[] = [];
  try {
    if (post.category_id) {
      const relatedData = await fetchBlogs({
        categoryId: post.category_id,
        perPage: 4,
        page: 1,
      });
      relatedPosts = (relatedData?.data || []).filter((b: any) => b.slug !== post.slug).slice(0, 3);
    }
  } catch (e) {
    // Ignore error fetching related posts
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

          <Link
            href="/blog"
            className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-700"
          >
            <ArrowLeft size={16} />
            Back to all articles
          </Link>

            <article className="overflow-hidden rounded-3xl border border-border/60 bg-white shadow-sm">
              {imageUrl && (
                <div className="relative aspect-video md:aspect-[2/1] max-h-[500px] w-full overflow-hidden bg-muted">
                  <Image
                    src={imageUrl}
                    alt={post.title}
                    fill
                    priority
                    sizes="100vw"
                    className="object-cover"
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
                  {displayDate && (
                    <span className="text-sm font-medium text-muted-foreground">
                      {displayDate}
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
                          <h2 className="text-xl md:text-2xl font-bold text-foreground leading-tight">
                            Our Products
                          </h2>
                        </div>
                      </div>
                    </div>
                    <RelatedCategoriesSlider categories={post.product_categories} />
                  </div>
                )}

                {post.youtube_videos && post.youtube_videos.length > 0 && (
                  <div className="mt-10 space-y-4 border-t border-border pt-10">
                    <h2 className="text-xl font-bold text-foreground">Related videos</h2>
                    <div className="grid gap-4 md:grid-cols-2">
                      {post.youtube_videos
                        .filter((v: any) => v.is_active)
                        .map((video: any) => (
                          <a
                            key={video.id}
                            href={video.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="rounded-xl border border-border px-4 py-3 text-sm font-medium text-primary transition-colors hover:bg-primary/5 break-all"
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
                        .filter((f: any) => f.is_active)
                        .map((faq: any) => (
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
                  {relatedPosts.map((blog: any, idx: number) => (
                    <BlogCard key={blog.id} blog={blog} delay={idx * 80} />
                  ))}
                </div>
              </section>
          )}
        </div>
      </main>
    </div>
  );
}
