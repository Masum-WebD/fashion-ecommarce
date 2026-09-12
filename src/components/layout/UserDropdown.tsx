'use client';

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { User, LogOut, LayoutDashboard, Settings, ChevronDown } from "lucide-react";
import { useAuth } from "@/providers/AuthProvider";

export function UserDropdown() {
  const { user, logout } = useAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!user) return null;

  const dashboardUrl = `/dashboard/${user.role === 'wholesaler' ? 'customer' : user.role || 'customer'}`;

  const handleLogout = () => {
    logout();
    router.push("/");
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-foreground hover:text-primary sm:px-3 px-1.5 py-2 rounded-full sm:border border-transparent sm:border-border hover:bg-muted transition-all duration-200 sm:shadow-sm"
      >
        {user.avatar_url ? (
          <img src={user.avatar_url} alt={user.name} className="w-7 h-7 sm:w-6 sm:h-6 rounded-full object-cover shrink-0" />
        ) : (
          <div className="w-7 h-7 sm:w-6 sm:h-6 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
            <User className="w-4 h-4 sm:w-3.5 sm:h-3.5" />
          </div>
        )}
        <span className="max-w-[100px] truncate hidden sm:block">{user.name.split(' ')[0]}</span>
        <ChevronDown size={14} className={`text-muted-foreground transition-transform duration-200 hidden sm:block ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-56 bg-background border border-border shadow-xl rounded-xl overflow-hidden z-[51] animate-in fade-in slide-in-from-top-2">
          <div className="p-3 border-b border-border/50 bg-muted/10 flex items-center gap-3">
            {user.avatar_url ? (
              <img src={user.avatar_url} alt={user.name} className="w-10 h-10 rounded-full object-cover shrink-0 border border-border/50" />
            ) : (
              <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                <User size={20} />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-foreground truncate">{user.name}</p>

              <div className="flex items-center gap-1.5 flex-wrap">
                <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                  {user.role}
                </span>
                {user.role !== 'affiliate' && user.affiliate_approved && (
                  <span className="inline-flex items-center rounded-full bg-blue-100 px-2 py-0.5 text-[10px] font-semibold text-blue-700 uppercase tracking-wider">
                    Affiliate
                  </span>
                )}
              </div>
            </div>
          </div>
          <div className="p-1.5 flex flex-col gap-0.5">
            {user.role === 'customer' && user.affiliate_approved ? (
              <>
                <Link
                  href="/dashboard/affiliate"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Affiliate Dashboard
                </Link>
                <Link
                  href="/dashboard/customer"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors"
                >
                  <LayoutDashboard size={16} />
                  Customer Dashboard
                </Link>
              </>
            ) : (
              <Link
                href={dashboardUrl}
                onClick={() => setIsOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors"
              >
                <LayoutDashboard size={16} />
                Dashboard
              </Link>
            )}
            <Link
              href={user.affiliate_approved ? "/dashboard/affiliate/profile" : `${dashboardUrl}/profile`}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 text-sm text-foreground hover:bg-muted hover:text-primary rounded-lg transition-colors"
            >
              <Settings size={16} />
              Profile Settings
            </Link>
            <div className="h-px bg-border/50 my-1 mx-2" />
            <button
              onClick={handleLogout}
              className="flex items-center w-full gap-2.5 px-3 py-2 text-sm text-red-600 hover:bg-red-50 hover:text-red-700 rounded-lg transition-colors text-left font-medium"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
