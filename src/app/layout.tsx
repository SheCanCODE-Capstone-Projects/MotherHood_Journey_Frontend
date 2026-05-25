import type { Metadata } from "next";
import "./globals.css";
import { ServiceWorkerRegistration } from "@/shared/components/layout/ServiceWorkerRegistration";
import { Providers } from "./providers";
import { PortalShell } from "@/shared/components/layout";

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
    <html lang="en" className="h-full antialiased text-[13px]">
      <body className="min-h-full flex flex-col">
        <PortalShell fallbackRole="patient">
          <Providers>{children}</Providers>
        </PortalShell>
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
