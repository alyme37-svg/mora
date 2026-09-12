"use client";

import { Heart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SellerBadge } from "@/components/marketplace/seller-badge";
import { useToast } from "@/components/ui/toast";
import { useHydrated } from "@/hooks/use-hydrated";
import { LiveMarketplaceRating } from "@/features/reviews/live-marketplace-rating";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { useMarketplaceStore } from "@/store/marketplace-store";
import type { Product, Seller } from "@/types/marketplace";

export function ProductCard({
  product,
  seller,
  rating,
  reviewCount,
  className,
  priority = false,
}: {
  product: Product;
  seller: Seller;
  rating: number;
  reviewCount: number;
  className?: string;
  priority?: boolean;
}) {
  const hydrated = useHydrated();
  const wished = useMarketplaceStore((state) =>
    state.wishlist.some((item) => item.productId === product.id),
  );
  const toggleWishlist = useMarketplaceStore((state) => state.toggleWishlist);
  const { toast } = useToast();
  const isWished = hydrated ? wished : false;

  function handleWishlist() {
    toggleWishlist(product.id);
    toast({
      title: isWished ? "Removed from wishlist" : "Saved to wishlist",
      description: product.name,
    });
  }

  return (
    <article className={cn("group min-w-0", className)}>
      <div className="relative aspect-[4/5] overflow-hidden rounded-lg border bg-muted">
        <Link
          href={`/products/${product.slug}`}
          className="relative block size-full"
          aria-label={`View ${product.name}`}
        >
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
            priority={priority}
          />
        </Link>
        <button
          type="button"
          onClick={handleWishlist}
          aria-label={
            isWished
              ? `Remove ${product.name} from wishlist`
              : `Save ${product.name} to wishlist`
          }
          aria-pressed={isWished}
          className="absolute right-2.5 top-2.5 grid size-11 cursor-pointer place-items-center rounded-full border border-white/70 bg-surface/90 text-foreground shadow-[0_1px_5px_rgb(40_31_25/0.08)] transition-colors duration-200 hover:bg-surface active:bg-muted"
        >
          <Heart
            aria-hidden="true"
            className={cn("size-4.5", isWished && "fill-caramel text-caramel")}
          />
        </button>
      </div>
      <div className="pt-3">
        <Link
          href={`/products/${product.slug}`}
          className="line-clamp-1 text-sm font-semibold leading-5 underline-offset-4 hover:underline"
        >
          {product.name}
        </Link>
        <Link
          href={`/stores/${seller.slug}`}
          className="mt-1 inline-flex rounded-sm underline-offset-4 hover:underline"
        >
          <SellerBadge seller={seller} compact />
        </Link>
        <div className="mt-2 flex items-center justify-between gap-3">
          <span className="text-sm font-semibold">
            {formatMoney(product.price)}
          </span>
          <LiveMarketplaceRating
            productId={product.id}
            initialValue={rating}
            initialCount={reviewCount}
            compact
          />
        </div>
      </div>
    </article>
  );
}
