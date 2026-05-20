import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/shared/components/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "MotherHood Journey",
  description:
    "A digital platform connecting mothers, community health workers, nurses, and administrators to improve childhood vaccination compliance in Rwanda.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        {/*
         * Providers mounts NextAuth's SessionProvider inside a "use client"
         * boundary so that client hooks (useRole, useCanAccess) work throughout
         * the app while server components remain RSCs.
         */}
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
