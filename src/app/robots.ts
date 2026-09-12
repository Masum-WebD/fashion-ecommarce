import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  // Read base URL from environment variable, falling back to production URL
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://sirajtech.org";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/checkout",
        "/login",
        "/register",
        "/forgot-password",
        "/order-confirmation",
        "/dashboard/",
        "/cart",
        "/search",
        "/*?sort=",
        "/*?filter=",
        "/*?page=",
        "/*?ref=",
        "/*?utm_",
        "/*?color=",
        "/*?size=",
        "/*?variant=",
        "/*?currency=",
        "/*?sid=",
        "/*?PHPSESSID=",
        "/*?gclid=",
        "/*?fbclid=",
        "/*?msclkid=",
        "/*?add-to-cart",
        "/*?add_to_cart",
        "/wishlist",
        "/compare",
        "/*/print",
      ],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}
