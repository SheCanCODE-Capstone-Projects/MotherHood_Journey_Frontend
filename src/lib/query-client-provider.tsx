"use client";

import React from "react";
import { QueryClient, QueryClientProvider as ReactQueryProvider } from "@tanstack/react-query";

/**
 * Create a single QueryClient instance
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes (formerly cacheTime)
    },
  },
});

/**
 * QueryClientProvider wrapper component
 * Provides React Query context to the entire app
 */
export function QueryClientProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ReactQueryProvider client={queryClient}>
      {children}
    </ReactQueryProvider>
  );
}
