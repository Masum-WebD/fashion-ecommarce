'use client';

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import {
  Menu, X, Search, User, ChevronDown, Heart,
  ShoppingBag, LogIn, LogOut, LayoutDashboard,
} from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";
import { SearchInput } from "./SearchInput";
import Image from "next/image";

const BRAND_NAME = "Velura Fashion";
const BRAND_LOGO = "/assets/velura-logo.svg";

const navLinks = [
  { label: "New Arrivals", href: "/shop/new-arrivals" },
  {
    label: "Women",
    href: "/shop/women",
    hasDropdown: true,
    children: [
      { label: "Dresses & Skirts", href: "/shop/women/dresses" },
      { label: "Tops & Blouses",   href: "/shop/women/tops"    },
      { label: "Outerwear",        href: "/shop/women/outerwear"},
      { label: "Trousers & Jeans", href: "/shop/women/trousers"},
      { label: "Knitwear",         href: "/shop/women/knitwear"},
    ],
  },
  {
    label: "Men",
    href: "/shop/men",
    hasDropdown: true,
    children: [
      { label: "Shirts & Polo",        href: "/shop/men/shirts"  },
      { label: "T-Shirts",             href: "/shop/men/t-shirts"},
      { label: "Trousers & Chinos",    href: "/shop/men/trousers"},
      { label: "Knitwear & Sweaters",  href: "/shop/men/knitwear"},
      { label: "Suits & Blazers",      href: "/shop/men/suits"   },
    ],
  },
  { label: "Kids",        href: "/shop/kids" },
  {
    label: "Accessories",
    href: "/shop/accessories",
    hasDropdown: true,
    children: [
      { label: "Bags & Purses",  href: "/shop/accessories/bags"    },
      { label: "Scarves & Wraps",href: "/shop/accessories/scarves" },
      { label: "Jewellery",      href: "/shop/accessories/jewellery"},
      { label: "Belts & Wallets",href: "/shop/accessories/belts"   },
    ],
  },
  { label: "Sale", href: "/shop/sale", highlight: true },
];

const MOBILE_H = "calc(3.5rem + 1px)";

export default function Navbar() {
  const [scrolled,      setScrolled]     = useState(false);
  const [mobileOpen,    setMobileOpen]   = useState(false);
  const [searchOpen,    setSearchOpen]   = useState(false);
  const [expandedLink,  setExpandedLink] = useState<string | null>(null);
  const [mounted,       setMounted]      = useState(false);

  const pathname = usePathname();
  const router   = useRouter();
  const { user, logout } = useAuth();
  const cartCtx  = useCart() as { cartItemsCount?: number; totalItems?: number; setCartOpen?: (v: boolean) => void; setIsCartOpen?: (v: boolean) => void };
  const cartCount = cartCtx.cartItemsCount ?? cartCtx.totalItems ?? 0;
  const openCart  = cartCtx.setCartOpen ?? cartCtx.setIsCartOpen;

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  useEffect(() => {
    setMobileOpen(false);
    setSearchOpen(false);
    setExpandedLink(null);
  }, [pathname]);

  /* ── mobile menu ───────────────────────────────────────────────────────── */
  const mobileMenu = mounted && mobileOpen && (
    <>
      <div
        className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-sm lg:hidden"
        style={{ top: MOBILE_H }}
        onClick={() => setMobileOpen(false)}
        aria-hidden
      />
      <div
        className="fixed left-0 right-0 bottom-0 z-[101] bg-white lg:hidden overflow-y-auto border-t border-border shadow-xl"
        style={{ top: MOBILE_H }}
        role="dialog" aria-modal="true" aria-label="Mobile navigation"
      >
        <div className="container-main py-4 space-y-3">
          <SearchInput className="w-full" placeholder="Search styles..." onSelect={() => setMobileOpen(false)} />

          <nav className="space-y-0.5" aria-label="Mobile links">
            {navLinks.map((link) => (
              <div key={link.label}>
                <div className="flex items-center">
                  <Link
                    href={link.href}
                    onClick={() => { if (!link.children) setMobileOpen(false); }}
                    className={`flex-1 py-2.5 px-2 text-sm font-semibold ${link.highlight ? "text-primary" : "text-foreground hover:text-primary"}`}
                  >
                    {link.label}
                  </Link>
                  {link.children && (
                    <button
                      type="button"
                      onClick={() => setExpandedLink((c) => (c === link.label ? null : link.label))}
                      className="p-2 text-muted-foreground"
                      aria-label={`Toggle ${link.label}`}
                    >
                      <ChevronDown size={16} className={`transition-transform ${expandedLink === link.label ? "rotate-180" : ""}`} />
                    </button>
                  )}
                </div>
                {link.children && expandedLink === link.label && (
                  <div className="pl-4 pb-1 space-y-0.5">
                    {link.children.map((child) => (
                      <Link
                        key={child.label}
                        href={child.href}
                        onClick={() => setMobileOpen(false)}
                        className="block py-2 px-2 text-sm text-muted-foreground hover:text-primary"
                      >
                        {child.label}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {user ? (
            <div className="pt-3 border-t border-border space-y-1">
              <Link
                href={`/dashboard/${user.role || "customer"}`}
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:text-primary hover:bg-muted rounded-lg transition-colors"
              >
                <LayoutDashboard size={16} /> Dashboard
              </Link>
              <button
                onClick={() => { logout(); setMobileOpen(false); router.push("/"); }}
                className="flex items-center w-full gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              >
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="btn-primary w-full justify-center"
            >
              <LogIn size={16} /> Login / Register
            </Link>
          )}
        </div>
      </div>
    </>
  );

  /* ── mobile search ─────────────────────────────────────────────────────── */
  const mobileSearch = mounted && searchOpen && (
    <div className="fixed top-0 left-0 right-0 bg-white z-[102] lg:hidden flex items-center gap-2 px-4 py-3 shadow-lg border-b border-border">
      <SearchInput className="flex-1" placeholder="Search styles..." autoFocus onSelect={() => setSearchOpen(false)} />
      <button
        onClick={() => setSearchOpen(false)}
        className="p-1.5 hover:bg-muted rounded-full transition-colors"
        aria-label="Close search"
      >
        <X size={22} />
      </button>
    </div>
  );

  return (
    <>
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold">
        Skip to main content
      </a>

      {/* ── Announcement bar ─────────────────────────────────────────────── */}
      <div className="bg-foreground text-white text-xs text-center py-2 px-4 hidden sm:flex items-center justify-center gap-1.5">
        <span className="text-white/70">Free shipping on orders over ৳2,500&nbsp;•&nbsp;Use&nbsp;</span>
        <span className="font-bold text-primary tracking-wider">VELURA10</span>
        <span className="text-white/70">&nbsp;for 10% off your first order</span>
      </div>

      {/* ── Main header ──────────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 w-full border-b border-border bg-white/95 transition-all duration-300 ${scrolled ? "shadow-md backdrop-blur-sm" : ""}`}>

        {/* Desktop nav */}
        <nav className="container-main hidden lg:flex items-center h-16 gap-6" role="navigation" aria-label="Main navigation">
          {/* Logo */}
          <Link href="/" className="shrink-0 flex items-center" aria-label={`${BRAND_NAME} home`}>
            <Image
              src={BRAND_LOGO}
              alt={BRAND_NAME}
              width={160}
              height={40}
              className="h-10 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>

          {/* Links */}
          <div className="flex items-center gap-0 flex-1">
            {navLinks.map((link) => (
              <div key={link.label} className="group relative">
                <Link
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-semibold transition-colors flex items-center gap-1 whitespace-nowrap relative
                    after:absolute after:bottom-0.5 after:left-3.5 after:right-3.5 after:h-0.5 after:bg-primary
                    after:scale-x-0 hover:after:scale-x-100 after:transition-transform after:duration-200
                    ${link.highlight ? "text-primary" : "text-foreground hover:text-primary"}`}
                >
                  {link.label}
                  {link.hasDropdown && (
                    <ChevronDown size={13} className="text-muted-foreground group-hover:rotate-180 transition-transform duration-200 mt-0.5" />
                  )}
                </Link>
                {link.children && (
                  <div className="absolute top-full left-0 pt-2 opacity-0 invisible translate-y-2 group-hover:opacity-100 group-hover:visible group-hover:translate-y-0 transition-all duration-200 z-[60]">
                    <div className="w-56 bg-white shadow-xl border border-border/60 rounded-xl py-2">
                      {link.children.map((child) => (
                        <Link
                          key={child.label}
                          href={child.href}
                          className="block px-4 py-2 text-sm text-foreground hover:bg-primary/5 hover:text-primary transition-colors"
                        >
                          {child.label}
                        </Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1 ml-auto shrink-0">
            <div className="hidden xl:block w-60">
              <SearchInput placeholder="Search styles..." />
            </div>
            <button
              onClick={() => setSearchOpen(true)}
              className="xl:hidden p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Search"
            >
              <Search size={20} strokeWidth={1.75} />
            </button>

            <Link href="/wishlist" className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Wishlist">
              <Heart size={20} strokeWidth={1.75} />
            </Link>

            {user ? (
              <Link href={`/dashboard/${user.role || "customer"}`} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Account">
                <User size={20} strokeWidth={1.75} />
              </Link>
            ) : (
              <Link href="/login" className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Login">
                <User size={20} strokeWidth={1.75} />
              </Link>
            )}

            <button
              onClick={() => openCart?.(true)}
              className="relative p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Shopping bag"
            >
              <ShoppingBag size={20} strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold px-1 leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </nav>

        {/* Mobile header */}
        <div className="container-main lg:hidden flex items-center justify-between h-14 gap-2">
          <button
            type="button"
            className="p-2 rounded-full hover:bg-muted transition-colors"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
          </button>

          <Link href="/" className="shrink-0 flex items-center" aria-label="Home">
            <Image
              src={BRAND_LOGO}
              alt={BRAND_NAME}
              width={130}
              height={32}
              className="h-8 w-auto object-contain"
              priority
              unoptimized
            />
          </Link>

          <div className="flex items-center gap-1">
            <button onClick={() => setSearchOpen(true)} className="p-2 rounded-full hover:bg-muted transition-colors" aria-label="Search">
              <Search size={20} strokeWidth={1.75} />
            </button>
            <button
              onClick={() => openCart?.(true)}
              className="relative p-2 rounded-full hover:bg-muted transition-colors"
              aria-label="Cart"
            >
              <ShoppingBag size={20} strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] flex items-center justify-center rounded-full bg-primary text-white text-[10px] font-bold px-1 leading-none">
                  {cartCount > 99 ? "99+" : cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </header>

      {mounted && (mobileOpen || searchOpen) && createPortal(
        <>
          {mobileMenu}
          {mobileSearch}
        </>,
        document.body
      )}
    </>
  );
}
