import { API_BASE_URL } from "./config";

// ─── Types ───────────────────────────────────────────────────────────

export interface CustomPageListItem {
  id: number;
  title: string;
  slug: string;
}

export interface CustomPageProduct {
  id: number;
  name: string;
  slug: string;
  product_type: "normal" | "variant";
  thumbnail_image: string;
  regular_price: string;
  sale_price: string;
  status: string;
  landing_page: {
    id: number;
    product_id: number;
    info_title: string;
    template: string;
    is_active: boolean;
  } | null;
  images: unknown[];
  variants: {
    id: number;
    product_id: number;
    name: string;
    price: string;
    sale_price: string;
    attribute_combinations: {
      id: number;
      product_variant_id: number;
      attribute: string;
      attribute_value: string;
    }[];
  }[];
}

export interface CustomPageDetail {
  id: number;
  title: string;
  slug: string;
  description: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  og_image: string;
  is_active: boolean;
  whatsapp_btn_text: string;
  messenger_btn_text: string;
  created_at: string;
  updated_at: string;
  og_image_url: string;
  products: CustomPageProduct[];
  table_data?: any;
}

// ─── API Responses ───────────────────────────────────────────────────

interface CustomPagesListResponse {
  success: boolean;
  message: string;
  data: CustomPageListItem[];
}

interface CustomPageDetailResponse {
  success: boolean;
  message: string;
  data: CustomPageDetail;
}

// ─── Fetch Functions ─────────────────────────────────────────────────

/** Fetch all active custom pages (used for footer "Other Products" links). */
export const fetchCustomPages = async (): Promise<CustomPageListItem[]> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/custom-pages`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch custom pages: ${response.status}`);
  }
  const result: CustomPagesListResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || "API returned an unsuccessful response");
  }
  return result.data;
};

/** Fetch a single custom page by slug (includes SEO data + associated products). */
export const fetchCustomPageBySlug = async (slug: string): Promise<CustomPageDetail> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/custom-pages/${slug}`, {
    headers: { Accept: "application/json" },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch custom page "${slug}": ${response.status}`);
  }
  const result: CustomPageDetailResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || "API returned an unsuccessful response");
  }
  return result.data;
};

