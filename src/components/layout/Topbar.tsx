'use client';

import { Search } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { socialLinks } from "@/lib/socialLinks";
import { useSettings } from "@/providers/SettingsProvider";
import { useAuth } from "@/providers/AuthProvider";
import { Facebook, Twitter, Linkedin, Instagram, Youtube, LogIn, Phone } from "lucide-react";
import { SearchInput } from "./SearchInput";
import { UserDropdown } from "./UserDropdown";

const Topbar = () => {
  const { user } = useAuth();
  const { settings } = useSettings();
  const router = useRouter();

  const dynamicSocialLinks = [];
  if (settings?.facebook_url) dynamicSocialLinks.push({ icon: Facebook, label: "Facebook", href: settings.facebook_url });
  if (settings?.twitter_url) dynamicSocialLinks.push({ icon: Twitter, label: "Twitter", href: settings.twitter_url });
  if (settings?.linkedin_url) dynamicSocialLinks.push({ icon: Linkedin, label: "LinkedIn", href: settings.linkedin_url });
  if (settings?.instagram_url) dynamicSocialLinks.push({ icon: Instagram, label: "Instagram", href: settings.instagram_url });
  if (settings?.youtube_url) dynamicSocialLinks.push({ icon: Youtube, label: "YouTube", href: settings.youtube_url });

  const displaySocialLinks = dynamicSocialLinks.length > 0 ? dynamicSocialLinks : socialLinks;

  return (
    <header className="hidden lg:block border-b border-border bg-background py-0.5">
      <div className="container-main h-15 flex items-center gap-4">
        <Link href="/" className="shrink-0 flex items-center">
          <img src={settings?.logo_url || "/assets/logo.png"} alt={settings?.name || "Siraj Tech"} className="h-[47px] w-auto" />
        </Link>

        <SearchInput className="flex-1 max-w-xl mx-auto py-2" placeholder="Search products, categories..." />

        <div className="shrink-0 flex items-center gap-1">
          <span className="w-px h-4 bg-border mx-1" aria-hidden />



          {user ? (
            <UserDropdown />
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-1.5 text-sm font-medium 
             text-foreground hover:text-primary 
             px-2 py-1.5 rounded-md
             transition-colors whitespace-nowrap"
            >
              <LogIn className="w-4 h-4" />
              Login / Register
            </Link>
          )}

          <span className="w-[1px] h-4 bg-border mx-1" aria-hidden />

          {/* Commented out social links as requested
          <div className="flex items-center gap-0.5">
            {displaySocialLinks.map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                className="p-1.5 text-muted-foreground hover:text-white rounded-md hover:bg-secondary transition-colors"
                aria-label={label}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon size={18} />
              </a>
            ))}
          </div>
          */}

          <div className="relative group/track">
            <Link
              href="/track-order"
              className="flex items-center justify-center p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-full transition-all duration-200"
              aria-label="Track Order"
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 11h4l3 4v2h-2" />
                <path d="M14 14h6" />
                <circle cx="7" cy="17" r="2" />
                <circle cx="17" cy="17" r="2" />
                <path d="M4 17h1" />
                <path d="M9 17h6" />
                <path d="M4 17V8a2 2 0 0 1 2-2h1" />
                <path d="M14 7c0 2.5-4 7.5-4 7.5S6 9.5 6 7a4 4 0 1 1 8 0z" />
                <circle cx="10" cy="7" r="1.5" />
              </svg>
            </Link>
            {/* Premium Tooltip */}
            <div className="absolute right-1/2 translate-x-1/2 top-full mt-2 w-max origin-top scale-95 opacity-0 pointer-events-none group-hover/track:scale-100 group-hover/track:opacity-100 transition-all duration-200 z-[100] bg-primary text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl border border-white flex items-center gap-1.5">
              <span>Track Order</span>
            </div>
          </div>

          <div className="relative group/phone">
            <a
              href={`tel:${settings?.mobile || "01705175403"}`}
              className="flex items-center justify-center p-2 text-muted-foreground hover:text-primary hover:bg-muted rounded-full transition-all duration-200"
              aria-label="Call Us"
            >
              <Phone size={18} />
            </a>
            {/* Premium Tooltip */}
            <div className="absolute right-0 top-full mt-2 w-max origin-top-right scale-95 opacity-0 pointer-events-none group-hover/phone:scale-100 group-hover/phone:opacity-100 transition-all duration-200 z-[100] bg-green-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xl border border-white flex items-center gap-1.5">
              <Phone size={11} className="text-white animate-pulse" />
              <span>{settings?.mobile || "01705175403"}</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Topbar;
