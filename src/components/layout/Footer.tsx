'use client';

import { useState } from "react";
import { Phone, Mail, MapPin, Facebook, Youtube, Instagram, Twitter, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";
import Image from "next/image";

const BRAND = {
  name: "Velura Fashion",
  logo: "/assets/velura-logo.svg",
  tagline: "Wear Your Story",
  description: "Velura Fashion brings you premium quality clothing and accessories that blend modern aesthetics with timeless elegance. Crafted with care, worn with confidence.",
  phone: "+880 1700-000000",
  email: "hello@velurafashion.com",
  address: "House 42, Road 5, Sector 10, Uttara, Dhaka-1230",
  facebook: "#",
  instagram: "#",
  youtube: "#",
  twitter: "#",
};

const footerLinks = {
  shop: [
    { label: "New Arrivals", href: "/shop/new-arrivals" },
    { label: "Women", href: "/shop/women" },
    { label: "Men", href: "/shop/men" },
    { label: "Kids", href: "/shop/kids" },
    { label: "Accessories", href: "/shop/accessories" },
    { label: "Sale", href: "/shop/sale" },
  ],
  help: [
    { label: "Size Guide", href: "/size-guide" },
    { label: "Shipping & Returns", href: "/shipping-returns" },
    { label: "FAQ", href: "/faq" },
    { label: "Track Order", href: "/track-order" },
    { label: "Contact Us", href: "/contact" },
  ],
  company: [
    { label: "About Us", href: "/about" },
    { label: "Careers", href: "/careers" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Terms & Conditions", href: "/terms" },
    { label: "Become an Affiliate", href: "/become-an-affiliate" },
  ],
};

const socials = [
  { label: "Facebook",  Icon: Facebook,  href: BRAND.facebook  },
  { label: "Instagram", Icon: Instagram, href: BRAND.instagram },
  { label: "YouTube",   Icon: Youtube,   href: BRAND.youtube   },
  { label: "Twitter",   Icon: Twitter,   href: BRAND.twitter   },
];

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    toast.success("You're subscribed! Check your inbox.");
    setEmail("");
  };

  return (
    <footer className="bg-gradient-to-b from-slate-900 to-zinc-950 text-white relative overflow-hidden">
      {/* Decorative top border */}
      <div className="h-0.5 bg-gradient-to-r from-transparent via-primary/60 to-transparent" />

      {/* Newsletter band */}
      <div className="border-b border-white/10">
        <div className="container-main py-10 md:py-12 flex flex-col md:flex-row items-center gap-6 justify-between">
          <div className="text-center md:text-left">
            <h3 className="text-xl sm:text-2xl font-bold text-white mb-1">Stay in Style</h3>
            <p className="text-sm text-white/60">Subscribe for new arrivals, exclusive offers & style inspiration.</p>
          </div>
          <form onSubmit={handleNewsletter} className="flex w-full max-w-md gap-2">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="flex-1 px-4 py-2.5 rounded-full bg-white/10 border border-white/20 text-white placeholder:text-white/40 text-sm focus:outline-none focus:border-primary/60 focus:bg-white/15 transition-all"
              required
            />
            <button
              type="submit"
              className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary hover:bg-primary-600 text-white text-sm font-semibold transition-all duration-200 whitespace-nowrap"
            >
              Subscribe <ArrowRight size={14} />
            </button>
          </form>
        </div>
      </div>

      {/* Main footer grid */}
      <div className="container-main py-12 sm:py-14">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand col */}
          <div className="lg:col-span-2 space-y-5">
            <Link href="/" className="inline-block">
              <Image src={BRAND.logo} alt={BRAND.name} width={140} height={48} className="h-10 w-auto object-contain" />
            </Link>
            <p className="text-sm leading-relaxed text-white/60 max-w-xs">
              {BRAND.description}
            </p>
            {/* Socials */}
            <div className="flex items-center gap-2.5">
              {socials.map(({ label, Icon, href }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary transition-all duration-200 hover:scale-110"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
            {/* Contact */}
            <ul className="space-y-2.5 text-sm text-white/60">
              <li className="flex items-start gap-2.5">
                <MapPin size={15} className="mt-0.5 shrink-0 text-primary/80" />
                <span>{BRAND.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="shrink-0 text-primary/80" />
                <a href={`tel:${BRAND.phone}`} className="hover:text-primary transition-colors">{BRAND.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="shrink-0 text-primary/80" />
                <a href={`mailto:${BRAND.email}`} className="hover:text-primary transition-colors">{BRAND.email}</a>
              </li>
            </ul>
          </div>

          {/* Shop links */}
          <div>
            <h5 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">Shop</h5>
            <ul className="space-y-2.5 text-sm text-white/60">
              {footerLinks.shop.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Help links */}
          <div>
            <h5 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">Help</h5>
            <ul className="space-y-2.5 text-sm text-white/60">
              {footerLinks.help.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company links */}
          <div>
            <h5 className="font-bold text-white mb-4 text-sm uppercase tracking-widest">Company</h5>
            <ul className="space-y-2.5 text-sm text-white/60">
              {footerLinks.company.map((l) => (
                <li key={l.label}>
                  <Link href={l.href} className="hover:text-primary transition-colors">{l.label}</Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Payment icons + copyright */}
      <div className="border-t border-white/10">
        <div className="container-main py-5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-white/40">
          <span>© {new Date().getFullYear()} Velura Fashion. All rights reserved.</span>
          {/* Payment methods — simple text badges */}
          <div className="flex items-center gap-2">
            {["Visa", "Mastercard", "bKash", "Nagad", "SSLCOMMERZ"].map((m) => (
              <span key={m} className="px-2.5 py-1 rounded bg-white/10 text-white/60 font-medium text-[10px] uppercase tracking-wide">
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

