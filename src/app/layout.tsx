import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/shared/components/layout/ServiceWorkerRegistration";
import { Providers } from "./providers";
import { PortalShell } from "@/shared/components/layout";
import { Toaster } from "@/shared/components/ui/sonner";

export const metadata: Metadata = {
  title: "Motherhood Journey",
  description: "Maternal and child health portal for mobile-first care workflows.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning data-scroll-behavior="smooth">
      <body className="min-h-full flex flex-col">
        <Providers>
          <PortalShell fallbackRole="patient">
            {children}
          </PortalShell>
          <Toaster position="top-right" richColors />
        </Providers>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
