// ────────────────────────────────────────────────────────────────────────────
// STATIC FASHION SETTINGS
// Replace with API call to /api/settings when going dynamic.
// ────────────────────────────────────────────────────────────────────────────

export interface SiteSettings {
  name: string;
  tagline: string;
  logo_url: string;
  favicon_url?: string;
  mobile: string;
  phone_secondary?: string;
  email: string;
  address: string;
  footer_description: string;
  footer_text: string;
  facebook_url?: string;
  twitter_url?: string;
  youtube_url?: string;
  instagram_url?: string;
  linkedin_url?: string;
  pinterest_url?: string;
  whatsapp_number?: string;
}

export const staticSettings: SiteSettings = {
  name: "Velura Fashion",
  tagline: "Wear Your Story",
  logo_url: "/assets/logo.png",
  mobile: "+880 1700-000000",
  email: "hello@velurafashion.com",
  address: "House 42, Road 5, Sector 10, Uttara, Dhaka-1230",
  footer_description:
    "Velura Fashion brings you premium quality clothing and accessories that blend modern aesthetics with timeless elegance. Crafted with care, worn with confidence.",
  footer_text: `© ${new Date().getFullYear()} Velura Fashion. All rights reserved.`,
  facebook_url: "https://facebook.com",
  instagram_url: "https://instagram.com",
  youtube_url: "https://youtube.com",
  pinterest_url: "https://pinterest.com",
  whatsapp_number: "+8801700000000",
};
