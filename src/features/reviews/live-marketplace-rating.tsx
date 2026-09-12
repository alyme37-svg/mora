"use client";

import { useMemo } from "react";

import { Rating } from "@/components/marketplace/rating";
import { useHydrated } from "@/hooks/use-hydrated";
import { getSellerRating } from "@/store/selectors";
import { useMarketplaceStore } from "@/store/marketplace-store";

export function LiveMarketplaceRating({
  productId,
  sellerId,
  initialValue = 0,
  initialCount = 0,
  compact = false,
  className,
}: {
  productId?: string;
  sellerId?: string;
  initialValue?: number;
  initialCount?: number;
  compact?: boolean;
  className?: string;
}) {
  const hydrated = useHydrated();
  const products = useMarketplaceStore((state) => state.products);
  const reviews = useMarketplaceStore((state) => state.reviews);
  const live = useMemo(() => {
    if (sellerId) return getSellerRating({ products, reviews }, sellerId);
    const matching = reviews.filter((review) => review.productId === productId);
    return {
      average: matching.length
        ? matching.reduce((sum, review) => sum + review.rating, 0) /
          matching.length
        : 0,
      count: matching.length,
    };
  }, [productId, products, reviews, sellerId]);
  return (
    <Rating
      value={hydrated ? live.average : initialValue}
      count={hydrated ? live.count : initialCount}
      compact={compact}
      className={className}
    />
  );
}
