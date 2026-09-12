'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, Heart, ShoppingCart, User, LogIn } from "lucide-react";
import { useCart } from "@/providers/CartProvider";
import { useAuth } from "@/providers/AuthProvider";

interface MobileBottomBarProps {
  onCartClick?: () => void;
}

// Terracotta primary color
const PRIMARY = "hsl(16, 58%, 46%)";
const PRIMARY_BG = "hsl(16, 58%, 46%, 0.1)";
const PRIMARY_SHADOW = "hsl(16 58% 46% / 0.45)";
const MUTED = "hsl(220 10% 55%)";

export default function MobileBottomBar({ onCartClick }: MobileBottomBarProps) {
  const pathname = usePathname();
  const { totalItems } = useCart();
  const { user } = useAuth();

  if (pathname.startsWith("/dashboard")) return null;

  const navItems = [
    { label: "Home",     href: "/",         icon: Home,        id: "mobile-nav-home"  },
    { label: "Shop",     href: "/shop",      icon: ShoppingBag, id: "mobile-nav-shop"  },
    { label: "Wishlist", href: "/wishlist",  icon: Heart,       id: "mobile-nav-wish"  },
    {
      label: "Cart",
      icon: ShoppingCart,
      badge: totalItems > 0 ? totalItems : null,
      id: "mobile-nav-cart",
      action: onCartClick,
    },
    {
      label: user ? "Account" : "Login",
      href: user ? "/dashboard" : "/login",
      icon: user ? User : LogIn,
      id: "mobile-nav-user",
    },
  ];

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 lg:hidden" aria-label="Mobile navigation">
        {/* Frosted glass backdrop */}
        <div
          className="absolute inset-0 rounded-t-2xl overflow-hidden"
          style={{
            background: "rgba(255,255,255,0.93)",
            backdropFilter: "blur(20px) saturate(180%)",
            WebkitBackdropFilter: "blur(20px) saturate(180%)",
            boxShadow: "0 -2px 20px rgba(0,0,0,0.07), 0 -1px 0 rgba(0,0,0,0.05)",
          }}
        />
        <div className="relative flex items-stretch h-[68px] px-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            const content = (
              <>
                {active && (
                  <span
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-b-full"
                    style={{ background: PRIMARY, boxShadow: `0 2px 8px ${PRIMARY_SHADOW}` }}
                  />
                )}
                <span
                  className="relative flex items-center justify-center w-10 h-8 rounded-xl transition-all duration-250"
                  style={active ? { background: PRIMARY_BG, transform: "translateY(-2px)" } : {}}
                >
                  <Icon
                    size={21}
                    strokeWidth={active ? 2.2 : 1.8}
                    style={{
                      color: active ? PRIMARY : MUTED,
                      transition: "color 0.2s, transform 0.2s",
                      transform: active ? "scale(1.08)" : "scale(1)",
                    }}
                  />
                  {item.badge && (
                    <span
                      className="absolute -top-1 -right-1 min-w-[17px] h-[17px] flex items-center justify-center rounded-full text-white text-[10px] font-bold leading-none px-1"
                      style={{ background: PRIMARY, boxShadow: `0 2px 6px ${PRIMARY_SHADOW}` }}
                    >
                      {item.badge > 99 ? "99+" : item.badge}
                    </span>
                  )}
                </span>
                <span
                  className="text-[10px] font-semibold tracking-wide transition-colors duration-200"
                  style={{ color: active ? PRIMARY : MUTED }}
                >
                  {item.label}
                </span>
              </>
            );

            if (item.action) {
              return (
                <button
                  key={item.id}
                  id={item.id}
                  onClick={item.action}
                  className="flex-1 flex flex-col items-center justify-center gap-0.5 relative bg-transparent border-none cursor-pointer"
                  aria-label={item.label}
                >
                  {content}
                </button>
              );
            }

            return (
              <Link
                key={item.id}
                id={item.id}
                href={item.href || "#"}
                className="flex-1 flex flex-col items-center justify-center gap-0.5 relative"
                aria-label={item.label}
                aria-current={active ? "page" : undefined}
              >
                {content}
              </Link>
            );
          })}
        </div>
        <div className="h-safe-area-bottom" />
      </nav>

      <style>{`
        @keyframes badge-pop {
          0%   { transform: scale(0.5); opacity: 0; }
          70%  { transform: scale(1.2); }
          100% { transform: scale(1);   opacity: 1; }
        }
        @supports (padding-bottom: env(safe-area-inset-bottom)) {
          nav.fixed.bottom-0 { padding-bottom: env(safe-area-inset-bottom); }
        }
      `}</style>
    </>
  );
}

