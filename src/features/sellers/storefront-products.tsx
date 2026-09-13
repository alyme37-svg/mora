"use client";

import { Store } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { ProductCard } from "@/components/marketplace/product-card";
import { SectionHeading } from "@/components/marketplace/section-heading";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useHydrated } from "@/hooks/use-hydrated";
import { buildCatalog, type CatalogProduct } from "@/lib/catalog";
import { useMarketplaceStore } from "@/store/marketplace-store";
import type { Seller } from "@/types/marketplace";

export function StorefrontProducts({
  initialSeller,
  initialCatalog,
}: {
  initialSeller: Seller;
  initialCatalog: CatalogProduct[];
}) {
  const hydrated = useHydrated();
  const products = useMarketplaceStore((state) => state.products);
  const sellers = useMarketplaceStore((state) => state.sellers);
  const reviews = useMarketplaceStore((state) => state.reviews);
  const seller = hydrated
    ? sellers.find((candidate) => candidate.id === initialSeller.id)
    : initialSeller;
  const liveCatalog = useMemo(
    () =>
      hydrated ? buildCatalog(products, sellers, reviews) : initialCatalog,
    [hydrated, initialCatalog, products, reviews, sellers],
  );
  const sellerProducts = liveCatalog.filter(
    (item) => item.seller.id === initialSeller.id,
  );

  if (!seller || seller.status !== "active") {
    return (
      <PageContainer className="pb-16 sm:pb-20">
        <EmptyState
          icon={Store}
          title="This storefront is taking a short pause"
          description="Its listings are unavailable while the seller is suspended in the Mora demo."
          action={
            <Button asChild>
              <Link href="/shop">Browse active creators</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  return (
    <PageContainer className="pb-16 sm:pb-20">
      <SectionHeading
        title={`Shop ${seller.settings.displayName}`}
        description={`${sellerProducts.length} small-batch pieces from this studio.`}
      />
      {seller.settings.storefrontStatus === "away" ? (
        <p className="mb-6 rounded-md border border-gold/35 bg-gold/10 px-4 py-3 text-sm font-medium text-walnut">
          This store is temporarily away and is not accepting new orders. You
          can still browse its collection.
        </p>
      ) : null}
      {sellerProducts.length ? (
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
          {sellerProducts.map((item, index) => (
            <ProductCard key={item.product.id} {...item} priority={index < 2} />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Store}
          title="No active pieces right now"
          description="This creator's draft and archived listings stay out of public discovery."
        />
      )}
    </PageContainer>
  );
}
