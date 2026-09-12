'use client';

import { createContext, useContext, useReducer, useEffect, useState, useRef, ReactNode } from "react";
import { trackAddToCart, trackRemoveFromCart, trackQuantityUpdate } from "@/lib/analytics/dataLayer";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  size?: string;
  weight?: number;
  minQuantity?: number;
  maxQuantity?: number | null;
}

interface CartState {
  items: CartItem[];
}

type CartAction =
  | { type: "ADD_ITEM"; payload: CartItem }
  | { type: "REMOVE_ITEM"; payload: string }
  | { type: "UPDATE_QUANTITY"; payload: { id: string; quantity: number } }
  | { type: "CLEAR_CART" };

interface CartContextValue {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  onAddItem?: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  isLoaded: boolean;
}

export const SHIPPING_COST = 100;

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD_ITEM": {
      const existing = state.items.find((i) => i.id === action.payload.id);
      if (existing) {
        return {
          items: state.items.map((i) =>
            i.id === action.payload.id
              ? { ...i, quantity: i.quantity + action.payload.quantity }
              : i
          ),
        };
      }
      return { items: [...state.items, action.payload] };
    }
    case "REMOVE_ITEM":
      return { items: state.items.filter((i) => i.id !== action.payload) };
    case "UPDATE_QUANTITY": {
      const item = state.items.find((i) => i.id === action.payload.id);
      if (!item) return state;

      let newQuantity = action.payload.quantity;
      const minQ = item.minQuantity || 1;
      const maxQ = item.maxQuantity;

      // Ensure min boundary
      if (newQuantity < minQ) {
        newQuantity = minQ;
      }
      // Ensure max boundary
      if (maxQ !== undefined && maxQ !== null && newQuantity > maxQ) {
        newQuantity = maxQ;
      }

      // If trying to set below 1, usually means remove, but minQ protects it.
      // We will allow removal only via REMOVE_ITEM action directly.
      return {
        items: state.items.map((i) =>
          i.id === action.payload.id ? { ...i, quantity: newQuantity } : i
        ),
      };
    }
    case "CLEAR_CART":
      return { items: [] };
    default:
      return state;
  }
}

const CartContext = createContext<CartContextValue | undefined>(undefined);

const STORAGE_KEY = "sirajtech_cart";

function loadFromStorage(): CartState {
  if (typeof window === "undefined") return { items: [] };
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw) as CartState;
  } catch {
    // corrupted data – ignore
  }
  return { items: [] };
}

export function CartProvider({
  children,
  onAddItem,
}: {
  children: ReactNode;
  onAddItem?: () => void;
}) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  const [isCartOpen, setIsCartOpenState] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Clear timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  const setIsCartOpen = (open: boolean) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setIsCartOpenState(open);
  };

  // Load from localStorage on mount (client only)
  useEffect(() => {
    const stored = loadFromStorage();
    if (stored.items.length > 0) {
      stored.items.forEach((item) =>
        dispatch({ type: "ADD_ITEM", payload: item })
      );
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage on change
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  }, [state]);

  const addItem = (item: CartItem) => {
    dispatch({ type: "ADD_ITEM", payload: item });
    
    // Trigger GTM Add to Cart Event
    trackAddToCart(item, item.quantity);

    // Open the cart sidebar only on desktop (screen width >= 768px)
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
    if (!isMobile) {
      setIsCartOpenState(true);
      
      // Clear any existing timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      // Set 3-second auto-close timeout
      timeoutRef.current = setTimeout(() => {
        setIsCartOpenState(false);
      }, 3000);
    }

    onAddItem?.();
  };
  
  const removeItem = (id: string) => {
    const item = state.items.find((i) => i.id === id);
    if (item) {
      // Trigger GTM Remove from Cart Event
      trackRemoveFromCart(item, item.quantity);
    }
    dispatch({ type: "REMOVE_ITEM", payload: id });
  };

  const updateQuantity = (id: string, quantity: number) => {
    const item = state.items.find((i) => i.id === id);
    if (item) {
      const prevQty = item.quantity;
      dispatch({ type: "UPDATE_QUANTITY", payload: { id, quantity } });
      trackQuantityUpdate(item, quantity, prevQty);
    }
  };
  const clearCart = () => dispatch({ type: "CLEAR_CART" });

  const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items: state.items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        onAddItem,
        isCartOpen,
        setIsCartOpen,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
