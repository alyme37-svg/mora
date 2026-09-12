"use client";

import { ArrowRight, Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { SellerBadge } from "@/components/marketplace/seller-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMoney, usd } from "@/lib/money";
import { buildCartDetails } from "@/store/selectors";
import { useMarketplaceStore } from "@/store/marketplace-store";

export function CartExperience() {
  const hydrated = useHydrated();
  const cart = useMarketplaceStore((state) => state.cart);
  const products = useMarketplaceStore((state) => state.products);
  const sellers = useMarketplaceStore((state) => state.sellers);
  const updateQuantity = useMarketplaceStore(
    (state) => state.updateCartQuantity,
  );
  const removeItem = useMarketplaceStore((state) => state.removeFromCart);
  const clearCart = useMarketplaceStore((state) => state.clearCart);
  const { toast } = useToast();
  const details = useMemo(
    () => buildCartDetails(cart, products, sellers),
    [cart, products, sellers],
  );

  if (!hydrated) {
    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <Skeleton className="h-[32rem]" />
        <Skeleton className="h-80" />
      </div>
    );
  }

  if (!details.items.length) {
    return (
      <EmptyState
        icon={ShoppingBag}
        title="Your cart is ready for a first find"
        description="Save a thoughtful piece from the marketplace and it will appear here, grouped with its creator."
        action={
          <Button asChild>
            <Link href="/shop">Explore the collection</Link>
          </Button>
        }
      />
    );
  }

  function remove(
    productId: string,
    variantId: string | undefined,
    name: string,
  ) {
    removeItem(productId, variantId);
    toast({ title: "Removed from cart", description: name });
  }

  function clear() {
    if (!window.confirm("Clear every item from this demo cart?")) return;
    clearCart();
    toast({ title: "Cart cleared" });
  }

  return (
    <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-12">
      <section aria-label="Cart items" className="min-w-0">
        <div className="mb-5 flex items-center justify-between gap-4 border-b pb-4">
          <p className="text-sm text-muted-foreground">
            <span className="font-semibold text-foreground">
              {details.itemCount}
            </span>{" "}
            {details.itemCount === 1 ? "item" : "items"} from{" "}
            {details.groups.length}{" "}
            {details.groups.length === 1 ? "creator" : "creators"}
          </p>
          <button
            type="button"
            onClick={clear}
            className="min-h-11 cursor-pointer text-xs font-semibold text-danger underline-offset-4 hover:underline"
          >
            Clear cart
          </button>
        </div>

        <div className="grid gap-8">
          {details.groups.map((group) => (
            <section
              key={group.seller.id}
              className="overflow-hidden rounded-lg border bg-surface"
            >
              <div className="flex items-center justify-between gap-4 border-b bg-muted/35 px-4 py-3 sm:px-5">
                <Link
                  href={`/stores/${group.seller.slug}`}
                  className="rounded-sm underline-offset-4 hover:underline"
                >
                  <SellerBadge seller={group.seller} />
                </Link>
                <span className="text-[0.6875rem] text-muted-foreground">
                  Ships separately
                </span>
              </div>
              <div className="divide-y">
                {group.items.map((item) => {
                  const stock =
                    item.variant?.inventory ?? item.product.inventory ?? 12;
                  return (
                    <article
                      key={`${item.productId}:${item.variantId ?? "default"}`}
                      className="grid grid-cols-[5.5rem_minmax(0,1fr)] gap-4 p-4 sm:grid-cols-[7rem_minmax(0,1fr)_auto] sm:p-5"
                    >
                      <Link
                        href={`/products/${item.product.slug}`}
                        className="relative aspect-[4/5] overflow-hidden rounded-md border bg-muted"
                        aria-label={`View ${item.product.name}`}
                      >
                        <Image
                          src={item.product.images[0]}
                          alt=""
                          fill
                          sizes="112px"
                          className="object-cover"
                        />
                      </Link>
                      <div className="min-w-0">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <Link
                              href={`/products/${item.product.slug}`}
                              className="font-semibold underline-offset-4 hover:underline"
                            >
                              {item.product.name}
                            </Link>
                            {item.variant ? (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {item.variant.name}
                              </p>
                            ) : null}
                          </div>
                          <p className="shrink-0 text-sm font-semibold sm:hidden">
                            {formatMoney(usd(item.unitAmount * item.quantity))}
                          </p>
                        </div>
                        <p className="mt-2 text-xs text-muted-foreground">
                          {formatMoney(usd(item.unitAmount))} each
                        </p>
                        <div className="mt-4 flex flex-wrap items-center gap-2">
                          <div className="inline-flex min-h-11 items-center rounded-md border bg-canvas">
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  item.quantity - 1,
                                  item.variantId,
                                )
                              }
                              className="grid size-11 cursor-pointer place-items-center"
                              aria-label={`Decrease ${item.product.name} quantity`}
                            >
                              <Minus aria-hidden="true" className="size-3.5" />
                            </button>
                            <span
                              className="min-w-7 text-center text-sm font-semibold"
                              aria-live="polite"
                            >
                              {item.quantity}
                            </span>
                            <button
                              type="button"
                              onClick={() =>
                                updateQuantity(
                                  item.productId,
                                  Math.min(stock, item.quantity + 1),
                                  item.variantId,
                                )
                              }
                              disabled={item.quantity >= stock}
                              className="grid size-11 cursor-pointer place-items-center disabled:cursor-not-allowed disabled:opacity-35"
                              aria-label={`Increase ${item.product.name} quantity`}
                            >
                              <Plus aria-hidden="true" className="size-3.5" />
                            </button>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() =>
                              remove(
                                item.productId,
                                item.variantId,
                                item.product.name,
                              )
                            }
                            aria-label={`Remove ${item.product.name}`}
                          >
                            <Trash2 aria-hidden="true" />
                          </Button>
                        </div>
                      </div>
                      <p className="hidden text-sm font-semibold sm:block">
                        {formatMoney(usd(item.unitAmount * item.quantity))}
                      </p>
                    </article>
                  );
                })}
              </div>
            </section>
          ))}
        </div>
      </section>

      <aside
        className="rounded-lg border bg-surface p-5 lg:sticky lg:top-6"
        aria-label="Order summary"
      >
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-caramel">
          Order summary
        </p>
        <h2 className="mt-2 font-serif text-3xl font-semibold">Your edit</h2>
        <dl className="mt-6 grid gap-3 border-y py-5 text-sm">
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Subtotal</dt>
            <dd className="font-medium">
              {formatMoney(usd(details.subtotalAmount))}
            </dd>
          </div>
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Mock shipping</dt>
            <dd className="font-medium">
              {formatMoney(usd(details.shippingAmount))}
            </dd>
          </div>
          <div className="flex justify-between gap-4 text-base">
            <dt className="font-semibold">Total</dt>
            <dd className="font-semibold">
              {formatMoney(usd(details.totalAmount))}
            </dd>
          </div>
        </dl>
        <Button asChild size="lg" className="mt-6 w-full">
          <Link href="/checkout">
            Continue to checkout <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
        <p className="mt-4 text-center text-[0.6875rem] leading-5 text-muted-foreground">
          Fictional checkout only. Each creator receives a separate fulfillment
          group.
        </p>
      </aside>
    </div>
  );
}
