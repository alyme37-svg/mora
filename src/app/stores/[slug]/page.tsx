import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { sellerPresentation } from "@/data/presentation";
import { createMarketplaceSeed } from "@/data/seed";
import { PersistedStorefront } from "@/features/sellers/persisted-storefront";
import {
  buildCatalog,
  getRatingSummary,
  getSellerReviews,
} from "@/lib/catalog";

interface StorePageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: StorePageProps): Promise<Metadata> {
  const { slug } = await params;
  const seller = createMarketplaceSeed().sellers.find(
    (item) => item.slug === slug,
  );
  return seller
    ? {
        title: seller.settings.displayName,
        description: seller.settings.tagline,
      }
    : { title: "Creator not found" };
}

export default async function StorefrontPage({ params }: StorePageProps) {
  const { slug } = await params;
  const seed = createMarketplaceSeed();
  const seller = seed.sellers.find((item) => item.slug === slug);
  if (!seller) notFound();
  const presentation = sellerPresentation[seller.id];
  if (!presentation) notFound();
  const initialCatalog = buildCatalog(
    seed.products,
    seed.sellers,
    seed.reviews,
  ).filter((item) => item.seller.id === seller.id);
  const initialRating = getRatingSummary(
    getSellerReviews(seed.products, seed.reviews, seller.id),
  );
  return (
    <PersistedStorefront
      initialSeller={seller}
      presentation={presentation}
      initialCatalog={initialCatalog}
      initialRating={initialRating}
    />
  );
}
