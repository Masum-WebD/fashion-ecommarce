import { API_BASE_URL } from "./config";

export interface ShippingReturnSection {
  id: string;
  title: string;
  label?: string;
  content: string;
  icon?: string;
}

export interface ShippingReturnData {
  id: number;
  hero_badge?: string;
  hero_title?: string;
  hero_subtitle?: string;
  shipping_tab_title?: string;
  shipping_sections?: ShippingReturnSection[];
  return_tab_title?: string;
  return_sections?: ShippingReturnSection[];
  contact_email?: string;
  contact_phone?: string;
  meta_title?: string;
  meta_description?: string;
  meta_keywords?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface ShippingReturnResponse {
  success: boolean;
  message: string;
  data: ShippingReturnData;
}

export const fetchShippingReturns = async (): Promise<ShippingReturnData | null> => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/v1/shipping-returns`, {
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    const result: ShippingReturnResponse = await response.json();
    return result?.data || null;
  } catch (error) {
    console.error("Failed to fetch shipping & returns data:", error);
    return null;
  }
};
