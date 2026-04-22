"use client";

/**
 * providers.tsx — Client-side provider wrapper for MotherHood Journey.
 *
 * Next.js App Router requires that context providers which use browser APIs
 * (like NextAuth's SessionProvider) be rendered inside a "use client" boundary.
 * This wrapper is used in the root layout.tsx so that all child server components
 * remain RSCs while still having access to the session context.
 *
 * Usage in layout.tsx:
 *   import { Providers } from "@/shared/components/providers";
 *   <Providers>{children}</Providers>
 */

import { SessionProvider } from "next-auth/react";
import type { ReactNode } from "react";

interface ProvidersProps {
  children: ReactNode;
}

export function Providers({ children }: ProvidersProps) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
