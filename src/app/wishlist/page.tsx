import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { createMarketplaceSeed } from "@/data/seed";
import { WishlistCollection } from "@/features/wishlist/wishlist-collection";
import { buildCatalog } from "@/lib/catalog";

export const metadata: Metadata = { title: "Your wishlist" };

export default function WishlistPage() {
  const seed = createMarketplaceSeed();
  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="mb-10 max-w-2xl">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-caramel">
          Saved for later
        </p>
        <h1 className="mt-3 font-serif text-5xl font-semibold leading-none tracking-[-0.035em] sm:text-6xl">
          Your wishlist
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          A quiet shelf for the pieces you want to find again.
        </p>
      </div>
      <WishlistCollection
        catalog={buildCatalog(seed.products, seed.sellers, seed.reviews)}
      />
    </PageContainer>
  );
}
