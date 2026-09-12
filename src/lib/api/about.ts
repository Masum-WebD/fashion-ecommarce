import { API_BASE_URL } from "./config";

export interface AboutPage {
  id: number;
  title: string;
  short_description: string;
  long_description: string;
  created_at: string;
  updated_at: string;
}

export interface AboutSection {
  id: number;
  title: string;
  description: string;
  image: string;
  image_url: string;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface AboutUsData {
  page: AboutPage;
  sections: AboutSection[];
}

export interface AboutUsResponse {
  success: boolean;
  message: string;
  data: AboutUsData;
}

/** About section images are served from /storage/. */
export const getAboutSectionImageUrl = (section: AboutSection): string => {
  if (section.image_url?.startsWith('http')) return section.image_url;
  if (section.image?.startsWith('http')) return section.image;
  if (section.image) {
    return `${API_BASE_URL}/storage/${section.image.replace(/^\//, '')}`;
  }
  return '';
};

export const getActiveAboutSections = (sections: AboutSection[]): AboutSection[] =>
  sections.filter((s) => s?.id && s.status === 'active');

export const fetchAboutUs = async (): Promise<AboutUsData> => {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined");
  }
  const response = await fetch(`${API_BASE_URL}/api/v1/about-us`, {
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch about us data: ${response.status}`);
  }
  const result: AboutUsResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'API returned an unsuccessful response');
  }
  return result.data;
};

