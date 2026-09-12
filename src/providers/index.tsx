'use client';

import { useState, ReactNode } from "react";
import { QueryClient, QueryClientProvider, QueryCache, MutationCache } from "@tanstack/react-query";
import { AuthProvider } from "./AuthProvider";
import { CartProvider } from "./CartProvider";
import { SettingsProvider } from "./SettingsProvider";
import { TooltipProvider } from "@/components/ui/tooltip";
import { logErrorToBackend } from "@/lib/error-logger";

// QueryClient must be created inside the component for proper SSR
function makeQueryClient() {
  const handleApiError = (error: Error) => {
    logErrorToBackend({
      type: 'api',
      message: error.message || 'Unknown API Error',
      stack_trace: error.stack,
    });
  };

  return new QueryClient({
    queryCache: new QueryCache({
      onError: handleApiError,
    }),
    mutationCache: new MutationCache({
      onError: handleApiError,
    }),
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute default
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

function getQueryClient() {
  if (typeof window === "undefined") {
    // Server: always make a new client
    return makeQueryClient();
  } else {
    // Browser: reuse the same client
    if (!browserQueryClient) browserQueryClient = makeQueryClient();
    return browserQueryClient;
  }
}

interface ProvidersProps {
  children: ReactNode;
  onCartOpen?: () => void;
}

export function Providers({ children, onCartOpen }: ProvidersProps) {
  const queryClient = getQueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <SettingsProvider>
        <TooltipProvider>
          <AuthProvider>
            <CartProvider onAddItem={onCartOpen}>
              {children}
            </CartProvider>
          </AuthProvider>
        </TooltipProvider>
      </SettingsProvider>
    </QueryClientProvider>
  );
}
