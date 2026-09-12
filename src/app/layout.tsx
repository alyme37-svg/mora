import type { Metadata } from "next";
import { Cormorant_Garamond, Geist } from "next/font/google";

import { AppShell } from "@/components/layout/app-shell";
import { ToastProvider } from "@/components/ui/toast";
import { MarketplaceStorageSync } from "@/store/marketplace-storage-sync";

import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MORA — Independent goods, thoughtfully found",
    template: "%s — MORA",
  },
  description:
    "A fictional, interactive multi-vendor marketplace portfolio demo.",
  authors: [{ name: "Ali Elhussein" }],
  creator: "Ali Elhussein",
  publisher: "Ali Elhussein",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geist.variable} ${cormorant.variable} antialiased`}>
        <ToastProvider>
          <MarketplaceStorageSync />
          <AppShell>{children}</AppShell>
        </ToastProvider>
      </body>
    </html>
  );
}
