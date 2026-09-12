import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Blog, blogExcerpt, getBlogImageUrl } from "@/lib/api/blog";

interface BlogCardProps {
  blog: Blog;
  delay?: number;
}

const BlogCard = ({ blog, delay = 0 }: BlogCardProps) => {
  const excerpt = blogExcerpt(blog.content, 140);
  const imageUrl = getBlogImageUrl(blog);

  return (
    <article
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-border/60 bg-white shadow-sm transition-all duration-500 hover:-translate-y-1 hover:border-primary/20 hover:shadow-card-hover"
      style={{
        animation: `blogCardFadeIn 0.6s ease-out ${delay}ms both`,
      }}
    >
      <Link href={`/${blog.slug}`} className="block overflow-hidden">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={blog.title}
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              loading="lazy"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-primary/10 to-accent/10 text-sm font-medium text-muted-foreground">
              No image
            </div>
          )}
          {blog.category?.title && (
            <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm backdrop-blur-sm">
              {blog.category.title}
            </span>
          )}
        </div>
      </Link>

      <div className="flex flex-grow flex-col p-5 text-left">
        <Link href={`/${blog.slug}`}>
          <h2 className="mb-3 line-clamp-2 text-base font-bold leading-snug text-foreground transition-colors duration-300 group-hover:text-primary md:text-lg">
            {blog.title}
          </h2>
        </Link>

        {excerpt && (
          <p className="mb-5 line-clamp-2 flex-grow text-sm leading-relaxed text-muted-foreground">
            {excerpt}
          </p>
        )}

        <Link
          href={`/${blog.slug}`}
          className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary transition-all duration-300 group-hover:gap-2.5 w-fit"
        >
          Read more
          <ArrowRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5" />
        </Link>
      </div>
    </article>
  );
};

export default BlogCard;
