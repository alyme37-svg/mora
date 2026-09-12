import type { Metadata } from "next";

import { createMarketplaceSeed } from "@/data/seed";
import { PersistedProductPage } from "@/features/products/persisted-product-page";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const product = createMarketplaceSeed().products.find(
    (item) => item.slug === slug,
  );
  if (!product) return { title: "Marketplace product" };
  return { title: product.name, description: product.description };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  return <PersistedProductPage slug={slug} />;
}
