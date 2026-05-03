import type { Metadata } from "next";
import "./globals.css";

import { ServiceWorkerRegistration } from "@/shared/components/layout/ServiceWorkerRegistration";

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
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
        {children}
        <ServiceWorkerRegistration />
      </body>
    </html>
  );
}
