import { API_BASE_URL } from "./config";

export interface ContactData {
  id: number;
  title: string;
  phones: string[];
  call_time: string;
  email: string;
  address: string;
  landmark: string;
  google_map: string;
  created_at: string;
  updated_at: string;
}

export interface ContactResponse {
  success: boolean;
  message: string;
  data: ContactData;
}

export interface ContactFormPayload {
  full_name: string;
  email: string;
  phone: string;
  message: string;
}

export interface ContactFormResponse {
  success: boolean;
  message: string;
}

export const fetchContacts = async (): Promise<ContactData> => {
  if (!API_BASE_URL) {
    throw new Error("API_BASE_URL is not defined");
  }
  const response = await fetch(`${API_BASE_URL}/api/v1/contacts`, {
    next: { revalidate: 3600 },
  });
  if (!response.ok) {
    throw new Error(`Failed to fetch contact data: ${response.status}`);
  }
  const result: ContactResponse = await response.json();
  if (!result.success) {
    throw new Error(result.message || 'API returned an unsuccessful response');
  }
  return result.data;
};

export const submitContactForm = async (payload: ContactFormPayload): Promise<ContactFormResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/v1/contact-form-submit`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify(payload),
  });
  const result: ContactFormResponse = await response.json();
  if (!response.ok || !result.success) {
    throw new Error(result.message || `Failed to submit contact form: ${response.status}`);
  }
  return result;
};

/** Extract iframe src from an embed HTML string returned by the API. */
export const extractMapEmbedSrc = (embedHtml: string): string | null => {
  const match = embedHtml.match(/src=["']([^"']+)["']/i);
  return match?.[1] ?? null;
};

