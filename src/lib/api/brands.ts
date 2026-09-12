import { API_BASE_URL } from "./config";

export interface Brand {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  image_url: string | null;
}

export interface BrandResponse {
  success: boolean;
  data: Brand[];
}

export interface SingleBrandResponse {
  success: boolean;
  data: Brand;
}

/**
 * Fetch all active brands
 */
export const fetchBrands = async (): Promise<Brand[]> => {
  try {
    if (!API_BASE_URL) {
      return [];
    }
    const url = `${API_BASE_URL}/api/v1/brand`;
    const response = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      return [];
    }
    
    const result: BrandResponse = await response.json();
    return result.data || [];
  } catch (error) {
    console.error("Failed to fetch brands:", error);
    return [];
  }
};

/**
 * Fetch a specific brand by slug
 */
export const fetchBrandBySlug = async (slug: string): Promise<Brand> => {
  try {
    if (!API_BASE_URL) {
      throw new Error("API_BASE_URL is not defined");
    }
    const url = `${API_BASE_URL}/api/v1/brand/${slug}`;
    const response = await fetch(url, { next: { revalidate: 3600 } });
    
    if (!response.ok) {
      throw new Error(`Failed to fetch brand: ${response.status}`);
    }
    
    const result: SingleBrandResponse = await response.json();
    return result.data;
  } catch (error) {
    console.error(`Failed to fetch brand ${slug}:`, error);
    throw error;
  }
};
