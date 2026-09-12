'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import Cookies from "js-cookie";
import { trackUserLogin } from "@/lib/analytics/dataLayer";

// ─── Types ────────────────────────────────────────────────────────────

export type UserRole = "customer" | "wholesaler" | "affiliate";

export interface User {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address?: string | null;
  avatar?: string;
  avatar_url?: string;
  role: UserRole;
  joinedDate: string;
  is_affiliate?: boolean;
  affiliate_id?: number | string | null;
  wholesaler_panel_access?: boolean;
  username?: string | null;
  affiliate_approved?: boolean;
  affiliate_approved_at?: string | null;
  affiliate_code?: string | null;
  affiliate_link?: string | null;
  available_balance?: string;
  affiliate?: any;
  tracking_user_data?: {
    first_name: string;
    last_name: string;
    city: string;
    state: string;
    zip_code: string;
    phone_number: string;
    email: string;
    external_id: string;
    ip_address: string;
  } | null;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email: string | null;
  address: string | null;
  profile_pic: string | null;
  profile_pic_url?: string | null;
  user_type_id: number | null;
  user_type?: string;
  wholesaler_panel_access?: boolean;
  created_at: string;
  updated_at: string;
  is_affiliate: boolean;
  affiliate_code: string | null;
  referred_by: string | null;
  total_referrals: number;
  total_earnings: string;
  available_balance: string;
  status: string;
  username?: string | null;
  affiliate_approved?: boolean;
  affiliate_approved_at?: string | null;
  affiliate_link?: string | null;
  affiliate?: {
    username?: string | null;
    affiliate_code: string;
    rank_label?: string | null;
    commission_percentage?: string;
    approved: boolean;
    approved_at: string | null;
    total_clicks: number;
    total_sales: number;
    total_earnings: string;
    available_balance: string;
    pending_balance: string;
    withdrawn_balance: string;
    affiliate_link?: string;
  } | null;
  tracking_user_data?: any;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  token: string | null;
  login: (phone: string, password: string) => Promise<User>;
  logout: () => void;
  setAuth: (customer: Customer, bearerToken: string) => void;
  updateUser: (updatedUser: Partial<User>) => void;
}

// ─── Storage keys ─────────────────────────────────────────────────────

const TOKEN_COOKIE = "sirajtech_token";
const USER_COOKIE = "sirajtech_user";
const COOKIE_OPTIONS = {
  path: "/",
  expires: 7, // 7 days — session বেশিক্ষণ টিকবে
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
};

// ─── Helpers ──────────────────────────────────────────────────────────

function mapCustomerToUser(customer: Customer): User {
  const isApproved =
    !!customer.affiliate_approved || !!customer.affiliate?.approved;

  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    avatar: customer.profile_pic ?? undefined,
    avatar_url: customer.profile_pic_url ?? undefined,
    role:
      customer.user_type_id === 2
        ? "wholesaler"
        : customer.user_type === "wholesaler"
        ? "wholesaler"
        : "customer",
    joinedDate: customer.created_at,
    is_affiliate: customer.is_affiliate,
    wholesaler_panel_access: customer.wholesaler_panel_access,
    username: customer.username,
    affiliate_approved: isApproved,
    affiliate_approved_at: customer.affiliate_approved_at,
    affiliate_code: customer.affiliate_code,
    affiliate_link: customer.affiliate_link,
    available_balance: customer.available_balance,
    affiliate: customer.affiliate,
    tracking_user_data: customer.tracking_user_data || null,
  };
}

function loadToken(): string | null {
  return Cookies.get(TOKEN_COOKIE) ?? null;
}

function loadUser(): User | null {
  try {
    const raw = Cookies.get(USER_COOKIE);
    if (raw) return JSON.parse(decodeURIComponent(raw)) as User;
  } catch {
    // corrupted
  }
  return null;
}

function saveAuth(token: string, user: User) {
  Cookies.set(TOKEN_COOKIE, token, COOKIE_OPTIONS);
  Cookies.set(USER_COOKIE, encodeURIComponent(JSON.stringify(user)), COOKIE_OPTIONS);
}

function clearAuth() {
  Cookies.remove(TOKEN_COOKIE, { path: "/" });
  Cookies.remove(USER_COOKIE, { path: "/" });
}

// ─── Context ──────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  // Track whether auth was loaded from cookies (prevents premature clearAuth)
  const [authLoaded, setAuthLoaded] = useState(false);

  // Load from cookies on client mount
  useEffect(() => {
    const savedToken = loadToken();
    const savedUser = loadUser();
    setToken(savedToken);
    setUser(savedUser);
    setMounted(true);
    setAuthLoaded(true);
  }, []);

  // Keep cookies in sync — only after initial auth load
  // This prevents clearing valid cookies on the first render
  useEffect(() => {
    if (!mounted || !authLoaded) return;
    if (token && user) {
      saveAuth(token, user);
    } else if (authLoaded) {
      // Only clear if explicitly logged out (not on initial mount with no session)
      clearAuth();
    }
  }, [token, user, mounted, authLoaded]);

  const login = useCallback(async (phone: string, password: string) => {
    const { API_BASE_URL } = await import("@/lib/api/config");
    const res = await fetch(`${API_BASE_URL}/api/v1/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({ phone, password }),
    });
    const json = await res.json();
    if (!res.ok || !json.success) throw new Error(json.message || "Login failed");
    const customer = json.data.user ?? json.data.customer;
    const bearerToken = json.data.token;
    const mapped = mapCustomerToUser(customer!);
    
    // Save cookies synchronously before state updates/navigation
    saveAuth(bearerToken, mapped);

    setToken(bearerToken);
    setUser(mapped);
    
    // GTM User login tracking
    trackUserLogin(mapped);

    return mapped;
  }, []);

  const setAuth = useCallback((customer: Customer, bearerToken: string) => {
    const mapped = mapCustomerToUser(customer);

    // Save cookies synchronously before state updates/navigation
    saveAuth(bearerToken, mapped);

    setToken(bearerToken);
    setUser(mapped);

    // GTM User login tracking
    trackUserLogin(mapped);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearAuth();
  }, []);

  const updateUser = useCallback((updatedUser: Partial<User>) => {
    setUser((prev) => (prev ? { ...prev, ...updatedUser } : null));
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!token,
        isLoading: !mounted,
        token,
        login,
        logout,
        setAuth,
        updateUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
