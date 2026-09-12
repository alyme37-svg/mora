"use client";

import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMoney, usd } from "@/lib/money";
import { cn } from "@/lib/utils";
import { useMarketplaceStore } from "@/store/marketplace-store";
import { isProductAdminSuspended } from "@/store/marketplace-guards";
import type { Product } from "@/types/marketplace";

export function ProductPurchase({ product }: { product: Product }) {
  const [selectedVariantId, setSelectedVariantId] = useState(
    product.variants[0]?.id,
  );
  const [quantity, setQuantity] = useState(1);
  const hydrated = useHydrated();
  const liveProduct = useMarketplaceStore((state) =>
    state.products.find((candidate) => candidate.id === product.id),
  );
  const liveSeller = useMarketplaceStore((state) => {
    const currentProduct = state.products.find(
      (candidate) => candidate.id === product.id,
    );
    return currentProduct
      ? state.sellers.find((seller) => seller.id === currentProduct.sellerId)
      : undefined;
  });
  const wished = useMarketplaceStore((state) =>
    state.wishlist.some((item) => item.productId === product.id),
  );
  const addToCart = useMarketplaceStore((state) => state.addToCart);
  const toggleWishlist = useMarketplaceStore((state) => state.toggleWishlist);
  const { toast } = useToast();
  const currentProduct = hydrated ? liveProduct : product;
  const selectedVariant = useMemo(
    () =>
      currentProduct?.variants.find(
        (variant) => variant.id === selectedVariantId,
      ) ?? currentProduct?.variants[0],
    [currentProduct?.variants, selectedVariantId],
  );
  const stock = selectedVariant?.inventory ?? currentProduct?.inventory ?? 0;
  const price = usd(
    (currentProduct?.price.amount ?? product.price.amount) +
      (selectedVariant?.priceAdjustment.amount ?? 0),
  );
  const isWished = hydrated ? wished : false;
  const listingAvailable = Boolean(
    currentProduct &&
    currentProduct.status === "active" &&
    !isProductAdminSuspended(currentProduct) &&
    (hydrated
      ? liveSeller?.status === "active" &&
        liveSeller.settings.storefrontStatus !== "away"
      : true),
  );
  const isAvailable = listingAvailable && stock > 0;
  const storeIsAway =
    hydrated && liveSeller?.settings.storefrontStatus === "away";

  function chooseVariant(variantId: string) {
    setSelectedVariantId(variantId);
    setQuantity(1);
  }

  function handleAddToCart() {
    if (!currentProduct || !isAvailable) {
      toast({
        title: "This listing is unavailable",
        description: "It is not currently available in the demo catalog.",
      });
      return;
    }
    const before =
      useMarketplaceStore
        .getState()
        .cart.find(
          (item) =>
            item.productId === currentProduct.id &&
            item.variantId === selectedVariant?.id,
        )?.quantity ?? 0;
    addToCart(currentProduct.id, selectedVariant?.id, quantity);
    const after =
      useMarketplaceStore
        .getState()
        .cart.find(
          (item) =>
            item.productId === currentProduct.id &&
            item.variantId === selectedVariant?.id,
        )?.quantity ?? 0;
    const added = Math.max(0, after - before);
    toast({
      title: added ? "Added to cart" : "Cart already holds the available stock",
      description: added
        ? `${added} × ${currentProduct.name}${selectedVariant ? ` · ${selectedVariant.name}` : ""}`
        : currentProduct.name,
    });
  }

  function handleWishlist() {
    toggleWishlist(product.id);
    toast({
      title: isWished ? "Removed from wishlist" : "Saved to wishlist",
      description: product.name,
    });
  }

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4 border-y py-5">
        <p className="text-2xl font-semibold tracking-[-0.02em]">
          {formatMoney(price)}
        </p>
        <p
          className={cn(
            "text-xs font-medium",
            isAvailable ? "text-success" : "text-danger",
          )}
        >
          {storeIsAway
            ? "Store temporarily away"
            : stock === 0
              ? "Sold out"
              : stock <= 5
                ? `Only ${stock} left`
                : "In stock"}
        </p>
      </div>

      {currentProduct?.variants.length ? (
        <fieldset className="mt-6">
          <legend className="text-sm font-semibold">
            Choose{" "}
            {Object.keys(currentProduct.variants[0].optionValues)[0] ??
              "option"}
          </legend>
          <div className="mt-3 flex flex-wrap gap-2">
            {currentProduct.variants.map((variant) => (
              <button
                key={variant.id}
                type="button"
                onClick={() => chooseVariant(variant.id)}
                aria-pressed={selectedVariant?.id === variant.id}
                disabled={!listingAvailable || variant.inventory <= 0}
                className={cn(
                  "min-h-11 min-w-20 cursor-pointer rounded-md border px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-45",
                  selectedVariant?.id === variant.id
                    ? "border-foreground bg-foreground text-surface"
                    : "bg-surface hover:border-caramel",
                )}
              >
                {variant.name}
                {variant.inventory <= 0 ? " · Sold out" : ""}
              </button>
            ))}
          </div>
        </fieldset>
      ) : null}

      <div className="mt-6 flex items-end justify-between gap-4">
        <div>
          <p className="mb-2 text-sm font-semibold">Quantity</p>
          <div className="inline-flex min-h-11 items-center rounded-md border bg-surface">
            <button
              type="button"
              onClick={() => setQuantity((current) => Math.max(1, current - 1))}
              disabled={!isAvailable || quantity === 1}
              className="grid size-11 cursor-pointer place-items-center disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Decrease quantity"
            >
              <Minus aria-hidden="true" className="size-4" />
            </button>
            <span
              className="min-w-8 text-center text-sm font-semibold"
              aria-live="polite"
            >
              {quantity}
            </span>
            <button
              type="button"
              onClick={() =>
                setQuantity((current) => Math.min(stock, current + 1))
              }
              disabled={!isAvailable || quantity >= stock}
              className="grid size-11 cursor-pointer place-items-center disabled:cursor-not-allowed disabled:opacity-35"
              aria-label="Increase quantity"
            >
              <Plus aria-hidden="true" className="size-4" />
            </button>
          </div>
        </div>
        <p
          className={cn(
            "pb-3 text-xs",
            isAvailable ? "text-muted-foreground" : "font-medium text-danger",
          )}
        >
          {isAvailable
            ? `${stock} available`
            : storeIsAway
              ? "This store is temporarily not accepting orders."
              : stock === 0
                ? "Choose another available option."
                : "Currently unavailable"}
        </p>
      </div>

      <div className="mt-6 h-[4.75rem] md:h-auto">
        <div className="fixed inset-x-0 bottom-[calc(4rem+env(safe-area-inset-bottom))] z-30 grid grid-cols-[1fr_auto] gap-2 border-y bg-surface/96 px-4 py-3 shadow-[0_-8px_24px_rgb(40_31_25/0.06)] md:static md:border-0 md:bg-transparent md:p-0 md:shadow-none">
          <Button size="lg" onClick={handleAddToCart} disabled={!isAvailable}>
            <ShoppingBag aria-hidden="true" />
            {isAvailable ? "Add to cart" : "Unavailable"}
          </Button>
          <Button
            size="icon"
            variant="secondary"
            onClick={handleWishlist}
            aria-label={isWished ? "Remove from wishlist" : "Add to wishlist"}
            aria-pressed={isWished}
            className="size-12"
          >
            <Heart
              aria-hidden="true"
              className={cn(isWished && "fill-caramel text-caramel")}
            />
          </Button>
        </div>
      </div>
      <p className="mt-3 text-center text-[0.6875rem] leading-5 text-muted-foreground">
        Demo cart only. No payment will be processed.
      </p>
    </div>
  );
}
