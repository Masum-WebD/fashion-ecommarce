import { API_BASE_URL } from "./config";

export interface MarketingConfig {
  gtm_id: string | null;
  ga4_measurement_id: string | null;
  gsc_verification_token: string | null;
}

export interface SitemapItem {
  url: string;
  lastmod: string;
  changefreq: string;
  priority: number;
}

export interface MarketingConfigResponse {
  success: boolean;
  message: string;
  data: MarketingConfig;
}

export interface SitemapDataResponse {
  success: boolean;
  message: string;
  data: SitemapItem[];
}

/**
 * Fetch Google Tag Manager, Analytics, and Search Console configs from Laravel API.
 */
export const fetchMarketingConfig = async (): Promise<MarketingConfig> => {
  try {
    if (!API_BASE_URL) {
      console.warn("API_BASE_URL is not defined, skipping fetchMarketingConfig");
      throw new Error("API_BASE_URL is not defined");
    }
    const response = await fetch(`${API_BASE_URL}/api/v1/marketing-configs`, {
      next: { revalidate: 3600 }, // cache server-side for 1 hour
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: MarketingConfigResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch marketing configurations");
    }

    return data.data;
  } catch (error) {
    console.error("fetchMarketingConfig error:", error);
    return {
      gtm_id: null,
      ga4_measurement_id: null,
      gsc_verification_token: null,
    };
  }
};

/**
 * Fetch dynamic URLs, last modified dates, and priorities from Laravel API.
 */
export const fetchSitemapData = async (): Promise<SitemapItem[]> => {
  try {
    if (!API_BASE_URL) {
      console.warn("API_BASE_URL is not defined, skipping fetchSitemapData");
      throw new Error("API_BASE_URL is not defined");
    }
    const response = await fetch(`${API_BASE_URL}/api/v1/sitemap-data`, {
      next: { revalidate: 1800 }, // cache server-side for 30 minutes
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: SitemapDataResponse = await response.json();

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch sitemap data");
    }

    return data.data;
  } catch (error) {
    console.error("fetchSitemapData error:", error);
    return [];
  }
};
