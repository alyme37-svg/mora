"use client";

import { ArrowRight, PackageSearch } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { StatusBadge } from "@/components/marketplace/status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { demoIdentities } from "@/data/seed";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMoney } from "@/lib/money";
import { formatOrderDate, formatOrderNumber } from "@/lib/orders";
import { useMarketplaceStore } from "@/store/marketplace-store";

export function OrdersList() {
  const hydrated = useHydrated();
  const orders = useMarketplaceStore((state) => state.orders)
    .filter((order) => order.shopperId === demoIdentities.shopperUserId)
    .toSorted((a, b) => b.placedAt.localeCompare(a.placedAt));
  const sellers = useMarketplaceStore((state) => state.sellers);
  if (!hydrated)
    return (
      <div className="grid gap-4">
        <Skeleton className="h-52" />
        <Skeleton className="h-52" />
      </div>
    );
  if (!orders.length)
    return (
      <EmptyState
        icon={PackageSearch}
        title="No demo orders yet"
        description="Complete the fictional checkout and your multi-creator order will appear here."
        action={
          <Button asChild>
            <Link href="/shop">Start shopping</Link>
          </Button>
        }
      />
    );

  return (
    <div className="grid gap-5">
      {orders.map((order) => {
        const lines = order.fulfillments.flatMap((group) => group.lineItems);
        return (
          <article
            key={order.id}
            className="rounded-lg border bg-surface p-5 sm:p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4 border-b pb-5">
              <div>
                <p className="text-xs text-muted-foreground">
                  {formatOrderDate(order.placedAt)}
                </p>
                <h2 className="mt-1 font-semibold tabular-nums">
                  {formatOrderNumber(order.id)}
                </h2>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <div className="mt-5 grid gap-6 sm:grid-cols-[1fr_auto] sm:items-end">
              <div>
                <div className="flex -space-x-3">
                  {lines.slice(0, 4).map((line) => (
                    <div
                      key={line.id}
                      className="relative size-14 overflow-hidden rounded-full border-2 border-surface bg-muted"
                    >
                      <Image
                        src={line.productImage}
                        alt=""
                        fill
                        sizes="56px"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <p className="mt-4 text-sm font-medium">
                  {lines.reduce((sum, line) => sum + line.quantity, 0)} items
                  from {order.fulfillments.length}{" "}
                  {order.fulfillments.length === 1 ? "creator" : "creators"}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {order.fulfillments
                    .map(
                      (group) =>
                        sellers.find((seller) => seller.id === group.sellerId)
                          ?.settings.displayName,
                    )
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>
              <div className="sm:text-right">
                <p className="text-lg font-semibold">
                  {formatMoney(order.total)}
                </p>
                <Button
                  asChild
                  variant="secondary"
                  className="mt-3 w-full sm:w-auto"
                >
                  <Link href={`/orders/${order.id}`}>
                    View details <ArrowRight aria-hidden="true" />
                  </Link>
                </Button>
              </div>
            </div>
          </article>
        );
      })}
    </div>
  );
}
