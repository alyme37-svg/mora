import type { Metadata } from "next";

import { SellerShell } from "@/features/seller/seller-shell";

export const metadata: Metadata = { title: "Seller workspace" };

export default function SellerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SellerShell>{children}</SellerShell>;
}
