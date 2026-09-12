"use client";

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from "react";
import type { Customer } from "@/lib/api/auth";
import { loginCustomer } from "@/lib/api/auth";

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
  wholesaler_panel_access?: boolean;
  username?: string | null;
  affiliate_approved?: boolean;
  affiliate_approved_at?: string | null;
  affiliate_code?: string | null;
  affiliate_link?: string | null;
  available_balance?: string;
  affiliate?: any;
}

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
  login: (phone: string, password: string) => Promise<User>;
  logout: () => void;
  setAuth: (customer: Customer, bearerToken: string) => void;
}

// ─── Storage keys ─────────────────────────────────────────────────────

const TOKEN_KEY = "sirajtech_token";
const USER_KEY = "sirajtech_user";

// ─── Helpers ──────────────────────────────────────────────────────────

function mapCustomerToUser(customer: Customer): User {
  const isApproved = !!customer.affiliate_approved || !!customer.affiliate?.approved;

  return {
    id: customer.id,
    name: customer.name,
    phone: customer.phone,
    email: customer.email,
    address: customer.address,
    avatar: customer.profile_pic ?? undefined,
    avatar_url: customer.profile_pic_url ?? undefined,
    role: customer.user_type_id === 2 ? "wholesaler" : (customer.user_type === "wholesaler" ? "wholesaler" : "customer"),
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
  };
}

function loadToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_KEY);
    if (raw) return JSON.parse(raw) as User;
  } catch {
    // corrupted
  }
  return null;
}

function saveAuth(token: string, user: User) {
  if (typeof window === "undefined") return;
  localStorage.setItem(TOKEN_KEY, token);
  localStorage.setItem(USER_KEY, JSON.stringify(user));
}

function clearAuth() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
}

// ─── Context ──────────────────────────────────────────────────────────

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  // Load from localStorage on mount (client only)
  useEffect(() => {
    setUser(loadUser());
    setToken(loadToken());
    setIsMounted(true);
  }, []);

  // Keep token in sync for consumers (e.g. Axios interceptor hooks)
  useEffect(() => {
    if (!isMounted) return;
    if (token && user) {
      saveAuth(token, user);
    } else {
      clearAuth();
    }
  }, [token, user, isMounted]);

  const login = useCallback(async (phone: string, password: string) => {
    const res = await loginCustomer(phone, password);
    const customer = res.data.user ?? res.data.customer;
    const bearerToken = res.data.token;
    const mapped = mapCustomerToUser(customer!);
    setToken(bearerToken);
    setUser(mapped);
    return mapped;
  }, []);

  const setAuth = useCallback((customer: Customer, bearerToken: string) => {
    const mapped = mapCustomerToUser(customer);
    setToken(bearerToken);
    setUser(mapped);
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUser(null);
    clearAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user && !!token,
        token,
        login,
        logout,
        setAuth,
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
