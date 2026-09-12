"use client";

import { ArrowLeft, MapPin, PackageSearch, ReceiptText } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { SellerBadge } from "@/components/marketplace/seller-badge";
import { StatusBadge } from "@/components/marketplace/status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { demoIdentities } from "@/data/seed";
import { TrackingTimeline } from "@/features/orders/tracking-timeline";
import { ReviewForm } from "@/features/reviews/review-form";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMoney, usd } from "@/lib/money";
import {
  estimatedDelivery,
  formatOrderDate,
  formatOrderNumber,
} from "@/lib/orders";
import { useMarketplaceStore } from "@/store/marketplace-store";

export function OrderDetails({ orderId }: { orderId: string }) {
  const hydrated = useHydrated();
  const order = useMarketplaceStore((state) =>
    state.orders.find(
      (item) =>
        item.id === orderId && item.shopperId === demoIdentities.shopperUserId,
    ),
  );
  const sellers = useMarketplaceStore((state) => state.sellers);
  const products = useMarketplaceStore((state) => state.products);
  const reviews = useMarketplaceStore((state) => state.reviews);
  const cancelOrder = useMarketplaceStore((state) => state.cancelOrder);
  const { toast } = useToast();

  if (!hydrated)
    return (
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Skeleton className="h-[38rem]" />
        <Skeleton className="h-80" />
      </div>
    );
  if (!order)
    return (
      <EmptyState
        icon={PackageSearch}
        title="Order not found"
        description="This order may belong to another fictional shopper or no longer exist in local demo data."
        action={
          <Button asChild>
            <Link href="/orders">Back to my orders</Link>
          </Button>
        }
      />
    );

  const canCancel = order.status === "placed" || order.status === "processing";
  function cancel() {
    if (!window.confirm(`Cancel demo order ${formatOrderNumber(order!.id)}?`))
      return;
    cancelOrder(order!.id);
    toast({
      title: "Demo order cancelled",
      description: formatOrderNumber(order!.id),
    });
  }

  return (
    <div>
      <Link
        href="/orders"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline-offset-4 hover:underline"
      >
        <ArrowLeft aria-hidden="true" className="size-4" />
        My orders
      </Link>
      <div className="mt-5 flex flex-col justify-between gap-5 border-b pb-7 sm:flex-row sm:items-end">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-caramel">
            Order details
          </p>
          <h1 className="mt-2 font-serif text-4xl font-semibold sm:text-5xl">
            {formatOrderNumber(order.id)}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Placed {formatOrderDate(order.placedAt)} · Estimated mock delivery{" "}
            {estimatedDelivery(order, sellers)}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <StatusBadge status={order.status} />
          {canCancel ? (
            <Button
              type="button"
              variant="ghost"
              onClick={cancel}
              className="text-danger hover:bg-danger/5"
            >
              Cancel order
            </Button>
          ) : null}
        </div>
      </div>
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
        <div className="grid gap-7">
          {order.fulfillments.map((fulfillment) => {
            const seller = sellers.find(
              (item) => item.id === fulfillment.sellerId,
            );
            return (
              <section
                key={fulfillment.id}
                className="rounded-lg border bg-surface p-5 sm:p-6"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 border-b pb-5">
                  {seller ? (
                    <Link
                      href={`/stores/${seller.slug}`}
                      className="rounded-sm underline-offset-4 hover:underline"
                    >
                      <SellerBadge seller={seller} />
                    </Link>
                  ) : (
                    <p className="font-semibold">Creator fulfillment</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    Ships and tracks separately
                  </p>
                </div>
                <div className="divide-y">
                  {fulfillment.lineItems.map((line) => {
                    const existingReview = reviews.find(
                      (review) =>
                        review.orderId === order.id &&
                        review.productId === line.productId,
                    );
                    return (
                      <article key={line.id} className="py-5">
                        <div className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-4 sm:grid-cols-[5.5rem_minmax(0,1fr)_auto]">
                          <Link
                            href={`/products/${products.find((product) => product.id === line.productId)?.slug ?? ""}`}
                            className="relative aspect-[4/5] overflow-hidden rounded-md border bg-muted"
                            aria-label={`View ${line.productName}`}
                          >
                            <Image
                              src={line.productImage}
                              alt=""
                              fill
                              sizes="88px"
                              className="object-cover"
                            />
                          </Link>
                          <div className="min-w-0">
                            <p className="font-semibold">{line.productName}</p>
                            {line.variantName ? (
                              <p className="mt-1 text-xs text-muted-foreground">
                                {line.variantName}
                              </p>
                            ) : null}
                            <p className="mt-2 text-xs text-muted-foreground">
                              Qty {line.quantity}
                            </p>
                          </div>
                          <p className="mt-2 text-sm font-semibold sm:mt-0">
                            {formatMoney(
                              usd(line.unitPrice.amount * line.quantity),
                            )}
                          </p>
                        </div>
                        {fulfillment.status === "delivered" ? (
                          existingReview ? (
                            <div className="mt-4 rounded-md bg-success/5 px-4 py-3 text-xs font-medium text-success">
                              Reviewed · {existingReview.rating}/5 stars
                            </div>
                          ) : (
                            <ReviewForm
                              orderId={order.id}
                              productId={line.productId}
                              lineId={line.id}
                              productName={line.productName}
                            />
                          )
                        ) : null}
                      </article>
                    );
                  })}
                </div>
                <TrackingTimeline fulfillment={fulfillment} />
              </section>
            );
          })}
        </div>
        <aside className="grid gap-5 lg:sticky lg:top-6">
          <section className="rounded-lg border bg-surface p-5">
            <div className="flex items-center gap-2">
              <ReceiptText aria-hidden="true" className="size-4 text-walnut" />
              <h2 className="font-semibold">Summary</h2>
            </div>
            <dl className="mt-5 grid gap-3 text-sm">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Subtotal</dt>
                <dd>{formatMoney(order.subtotal)}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Mock shipping</dt>
                <dd>{formatMoney(order.shipping)}</dd>
              </div>
              <div className="flex justify-between border-t pt-3 text-base font-semibold">
                <dt>Total</dt>
                <dd>{formatMoney(order.total)}</dd>
              </div>
            </dl>
            <p className="mt-5 rounded-md bg-muted/60 px-3 py-3 text-xs leading-5 text-muted-foreground">
              {order.paymentMethodLabel}
              <br />
              No real payment was processed.
            </p>
          </section>
          <section className="rounded-lg border bg-surface p-5">
            <div className="flex items-center gap-2">
              <MapPin aria-hidden="true" className="size-4 text-walnut" />
              <h2 className="font-semibold">Shipping address</h2>
            </div>
            <address className="mt-4 not-italic text-sm leading-6 text-muted-foreground">
              {order.shippingAddress.name}
              <br />
              {order.shippingAddress.line1}
              {order.shippingAddress.line2
                ? `, ${order.shippingAddress.line2}`
                : ""}
              <br />
              {order.shippingAddress.city}, {order.shippingAddress.region}{" "}
              {order.shippingAddress.postalCode}
              <br />
              {order.shippingAddress.country}
            </address>
          </section>
        </aside>
      </div>
    </div>
  );
}
