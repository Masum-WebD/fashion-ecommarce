import { API_BASE_URL } from "./config";
import { getImageUrl } from "./images";
import type { Category } from "./home";

export interface BlogSubCategory {
  id: number;
  blog_category_id: number;
  title: string;
  slug: string;
}

export interface BlogCategory {
  id: number;
  title: string;
  slug: string;
  sub_categories?: BlogSubCategory[];
}

export interface BlogAuthor {
  id: number;
  name: string;
}

export interface Blog {
  id: number;
  title: string;
  slug: string;
  content: string | null;
  image: string | null;
  status: string;
  category_id: number;
  author_id: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  meta_title?: string;
  short_description?: string;
  meta_description: string | null;
  meta_keywords: string | null;
  category?: BlogCategory;
  author?: BlogAuthor;
}

export interface BlogFaq {
  id: number;
  blog_post_id: number;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

export interface BlogYoutubeVideo {
  id: number;
  blog_post_id: number;
  url: string;
  sort_order: number;
  is_active: boolean;
}

export interface BlogDetail extends Blog {
  faqs?: BlogFaq[];
  youtube_videos?: BlogYoutubeVideo[];
  image_url?: string;
  product_categories?: Category[];
}

export interface CategoryBlog {
  id: number;
  title: string;
  slug: string;
  blogs: Blog[];
}

export interface CategorySectionItem {
  image: string;
  title: string;
  description: string;
  href?: string;
}

export interface BlogsPaginatedData {
  current_page: number;
  data: Blog[];
  first_page_url: string;
  from: number | null;
  last_page: number;
  last_page_url: string;
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number | null;
  total: number;
}

interface ApiListResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

export interface FetchBlogsParams {
  search?: string;
  categoryId?: number;
  subCategoryId?: number;
  page?: number;
  perPage?: number;
}

export const isCategoryBlogEntry = (
  entry: CategoryBlog | Record<string, never>
): entry is CategoryBlog =>
  Boolean(entry && typeof entry === "object" && "id" in entry && entry.id && Array.isArray(entry.blogs));

export const getValidCategoryBlogs = (categoryBlogs?: CategoryBlog[]): CategoryBlog[] =>
  (categoryBlogs ?? []).filter(isCategoryBlogEntry);

export const findCategoryBlogBySlug = (
  categoryBlogs: CategoryBlog[] | undefined,
  slug: string
): CategoryBlog | undefined =>
  getValidCategoryBlogs(categoryBlogs).find((cb) => cb.slug === slug);

export const blogExcerpt = (content: string | null | undefined, maxLen = 120): string => {
  if (!content) return "";
  const plain = content
    .replace(/\r\n/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
  if (!plain) return "";
  if (plain.length <= maxLen) return plain;
  return `${plain.slice(0, maxLen).trim()}...`;
};

export const getBlogImageUrl = (blog: Pick<Blog, "image"> & { image_url?: string }): string => {
  if (blog.image_url) return blog.image_url;
  return getImageUrl(blog.image);
};

export const formatBlogDate = (dateStr: string | null | undefined): string => {
  if (!dateStr) return "";
  try {
    return new Intl.DateTimeFormat("bn-BD", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(dateStr));
  } catch {
    return dateStr;
  }
};

export const mapBlogsToSectionItems = (
  blogs: Blog[],
  maxItems = 4,
  fallbackImage?: string
): CategorySectionItem[] =>
  blogs
    .filter((b) => b.status === "published")
    .slice(0, maxItems)
    .map((blog) => ({
      image: getBlogImageUrl(blog) || fallbackImage || "",
      title: blog.title,
      description: blogExcerpt(blog.content) || blog.title,
      href: `/${blog.slug}`,
    }))
    .filter((item) => item.title);

export const fetchBlogCategories = async (): Promise<BlogCategory[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/blogs/categories`);
  if (!response.ok) throw new Error("Failed to fetch blog categories");

  const result: ApiListResponse<BlogCategory[]> = await response.json();
  if (!result.success) throw new Error(result.message || "Failed to fetch blog categories");

  return result.data;
};

export const fetchBlogs = async ({
  search = "",
  categoryId,
  subCategoryId,
  page = 1,
  perPage = 9,
}: FetchBlogsParams = {}): Promise<BlogsPaginatedData> => {
  const params = new URLSearchParams();
  params.set("search", search);
  if (categoryId) params.set("category_id", String(categoryId));
  if (subCategoryId) params.set("sub_category_id", String(subCategoryId));
  params.set("page", String(page));
  params.set("per_page", String(perPage));

  const response = await fetch(`${API_BASE_URL}/api/v1/blogs?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch blogs");

  const result: ApiListResponse<BlogsPaginatedData> = await response.json();
  if (!result.success) throw new Error(result.message || "Failed to fetch blogs");

  return result.data;
};

export const fetchBlogBySlug = async (slug: string): Promise<BlogDetail> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/blogs/${slug}`);
  if (!response.ok) throw new Error("Blog post not found");

  const result: ApiListResponse<BlogDetail> = await response.json();
  if (!result.success) throw new Error(result.message || "Blog post not found");

  return result.data;
};

export const fetchBlogsByTag = async (
  slug: string,
  page = 1,
  perPage = 12
): Promise<BlogsPaginatedData> => {
  const params = new URLSearchParams();
  params.set("page", String(page));
  params.set("per_page", String(perPage));

  const response = await fetch(`${API_BASE_URL}/api/v1/blogs/tags/${slug}?${params.toString()}`);
  if (!response.ok) throw new Error("Failed to fetch blogs by tag");

  const result: ApiListResponse<BlogsPaginatedData> = await response.json();
  if (!result.success) throw new Error(result.message || "Failed to fetch blogs by tag");

  return result.data;
};
