"use client";

import { Heart } from "lucide-react";
import Link from "next/link";
import { useMemo } from "react";

import { ProductCard } from "@/components/marketplace/product-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated } from "@/hooks/use-hydrated";
import { buildCatalog, type CatalogProduct } from "@/lib/catalog";
import { useMarketplaceStore } from "@/store/marketplace-store";

export function WishlistCollection({ catalog }: { catalog: CatalogProduct[] }) {
  const hydrated = useHydrated();
  const wishlist = useMarketplaceStore((state) => state.wishlist);
  const persistedProducts = useMarketplaceStore((state) => state.products);
  const persistedSellers = useMarketplaceStore((state) => state.sellers);
  const persistedReviews = useMarketplaceStore((state) => state.reviews);
  const liveCatalog = useMemo(
    () =>
      hydrated
        ? buildCatalog(persistedProducts, persistedSellers, persistedReviews)
        : catalog,
    [catalog, hydrated, persistedProducts, persistedReviews, persistedSellers],
  );

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <Skeleton key={index} className="aspect-[4/5]" />
        ))}
      </div>
    );
  }

  const wishedIds = new Set(wishlist.map((item) => item.productId));
  const products = liveCatalog.filter((item) => wishedIds.has(item.product.id));

  if (!products.length) {
    return (
      <EmptyState
        icon={Heart}
        title="Your wishlist is ready for a first find"
        description="Save pieces from the collection and they will stay here on this device."
        action={
          <Button asChild>
            <Link href="/shop">Browse the collection</Link>
          </Button>
        }
      />
    );
  }

  return (
    <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-4">
      {products.map((item) => (
        <ProductCard key={item.product.id} {...item} />
      ))}
    </div>
  );
}
