import type { Metadata } from "next";
import "./globals.css";
import { QueryClientProvider } from "@/lib/query-client-provider";

import { ServiceWorkerRegistration } from "@/shared/components/layout/ServiceWorkerRegistration";
import { Providers } from "./providers";

export const metadata: Metadata = {
<<<<<<< HEAD
  title: "MotherHood Journey",
  description: "Maternal Health Tracking System",
=======
  title: "Motherhood Journey",
  description: "Maternal and child health portal for mobile-first care workflows.",
>>>>>>> 70b53139d72327305443a69b70b7ff8739383fc2
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">
<<<<<<< HEAD
        <QueryClientProvider>
          {children}
        </QueryClientProvider>
=======
        <Providers>
          {children}
        </Providers>
        <ServiceWorkerRegistration />
>>>>>>> 70b53139d72327305443a69b70b7ff8739383fc2
      </body>
    </html>
  );
}
