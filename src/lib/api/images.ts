import { API_BASE_URL } from "./config";

/**
 * Resolves any image path to a fully-qualified URL.
 * - Replaces legacy localhost dev URLs with the production domain.
 * - Prepends the production base URL to relative paths.
 * - Used for products: thumbnail_image is like "products/thumbnails/foo.webp"
 *   which resolves to: https://sirajtech.rigmartbd.com/storage/products/thumbnails/foo.webp
 */
export const getImageUrl = (path: string | null | undefined): string => {
  if (!path) return '';
  if (path.startsWith('http://127.0.0.1:8000') || path.startsWith('http://localhost:8000')) {
    return path.replace(/^http:\/\/(127\.0\.0\.1|localhost):8000/, API_BASE_URL);
  }
  if (path.startsWith('http') || path.startsWith('//')) return path;
  
  // Remove leading slash if exists
  const cleanPath = path.replace(/^\//, '');
  
  // Prevent double 'storage/' prefix if the database already saved it with 'storage/'
  if (cleanPath.startsWith('storage/')) {
    return `${API_BASE_URL}/${cleanPath}`;
  }
  
  return `${API_BASE_URL}/storage/${cleanPath}`;
};

/**
 * Resolves a category image filename (bare UUID, e.g. "88e0f26c-...png")
 * to a fully-qualified URL via the Laravel storage path.
 */
export const getCategoryImageUrl = (filename: string | null | undefined): string => {
  if (!filename) return '';
  if (filename.startsWith('http://127.0.0.1:8000') || filename.startsWith('http://localhost:8000')) {
    return filename.replace(/^http:\/\/(127\.0\.0\.1|localhost):8000/, API_BASE_URL);
  }
  if (filename.startsWith('http')) return filename;
  return `${API_BASE_URL}/storage/categories/${filename.replace(/^\//, '')}`;
};
