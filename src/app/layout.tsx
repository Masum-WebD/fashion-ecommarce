import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Providers } from "@/providers";
import { ToastProviders } from "@/components/ToastProviders";
import { Suspense } from "react";
import NextTopLoader from "nextjs-toploader";

// ── Typography ──────────────────────────────────────────────────────────────
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

// ── Static metadata (swap generateMetadata to fetch from API dynamically) ──
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://velurafashion.com"),
  title: {
    default: "Velura Fashion",
    template: "%s | Velura Fashion",
  },
  description:
    "Discover Velura Fashion — Bangladesh's premier online fashion destination. Shop premium women's, men's and kids' clothing, accessories, and more.",
  keywords: ["Fashion", "Clothing", "Women Fashion", "Men Fashion", "Online Shopping Bangladesh", "Velura Fashion"],
  alternates: { canonical: "/" },
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Velura Fashion",
    title: "Velura Fashion | Premium Clothing & Accessories",
    description: "Shop premium fashion from Bangladesh's finest online store. Free shipping over ৳2,500.",
    images: [{ url: "/assets/logo.png", width: 800, height: 600, alt: "Velura Fashion" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Velura Fashion | Premium Clothing & Accessories",
    description: "Shop premium fashion from Bangladesh's finest online store.",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${plusJakarta.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        <NextTopLoader color="hsl(16, 58%, 46%)" height={3} showSpinner={false} />
        <Providers>
          {children}
          <ToastProviders />
        </Providers>
      </body>
    </html>
  );
}
