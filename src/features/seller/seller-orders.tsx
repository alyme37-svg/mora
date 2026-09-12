"use client";

import {
  CheckCircle2,
  ChevronRight,
  Clock3,
  PackageCheck,
  Truck,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

import { StatusBadge } from "@/components/marketplace/status-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { demoIdentities } from "@/data/seed";
import { SellerPageHeader } from "@/features/seller/seller-page-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMoney } from "@/lib/money";
import { cn } from "@/lib/utils";
import { getSellerFulfillments } from "@/store/selectors";
import { useMarketplaceStore } from "@/store/marketplace-store";
import type { OrderStatus } from "@/types/marketplace";

const nextStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  placed: "processing",
  processing: "shipped",
  shipped: "delivered",
};
const actionCopy: Partial<Record<OrderStatus, string>> = {
  placed: "Start processing",
  processing: "Mark as shipped",
  shipped: "Mark as delivered",
};
const filters: Array<{ label: string; value: "all" | OrderStatus }> = [
  { label: "All", value: "all" },
  { label: "Placed", value: "placed" },
  { label: "Processing", value: "processing" },
  { label: "Shipped", value: "shipped" },
  { label: "Delivered", value: "delivered" },
  { label: "Cancelled", value: "cancelled" },
];

export function SellerOrders() {
  const hydrated = useHydrated();
  const marketplace = useMarketplaceStore();
  const fulfillments = useMemo(
    () =>
      getSellerFulfillments(marketplace, demoIdentities.sellerId).toSorted(
        (a, b) => b.order.placedAt.localeCompare(a.order.placedAt),
      ),
    [marketplace],
  );
  const users = useMarketplaceStore((state) => state.users);
  const updateStatus = useMarketplaceStore(
    (state) => state.updateFulfillmentStatus,
  );
  const [filter, setFilter] = useState<"all" | OrderStatus>("all");
  const { toast } = useToast();
  const visible = fulfillments.filter(
    ({ fulfillment }) => filter === "all" || fulfillment.status === filter,
  );

  function advance(
    orderId: string,
    fulfillmentId: string,
    current: OrderStatus,
  ) {
    const next = nextStatus[current];
    if (!next) return;
    updateStatus(orderId, fulfillmentId, next, demoIdentities.sellerId);
    toast({
      title: `Order marked ${next}`,
      description: "The shopper tracking timeline has been updated.",
    });
  }

  return (
    <div>
      <SellerPageHeader
        eyebrow="Fulfillment"
        title="Seller orders"
        description="Only Clay & Co. portions are shown. Other sellers in the same checkout remain private."
      />
      <div className="mt-6 flex gap-2 overflow-x-auto border-b pb-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {filters.map((item) => (
          <button
            key={item.value}
            type="button"
            onClick={() => setFilter(item.value)}
            aria-pressed={filter === item.value}
            className={cn(
              "min-h-10 shrink-0 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors",
              filter === item.value
                ? "border-foreground bg-foreground text-surface"
                : "bg-surface hover:border-caramel",
            )}
          >
            {item.label}
            <span className="ml-2 text-[0.6875rem] opacity-70">
              {item.value === "all"
                ? fulfillments.length
                : fulfillments.filter(
                    ({ fulfillment }) => fulfillment.status === item.value,
                  ).length}
            </span>
          </button>
        ))}
      </div>
      {!hydrated ? (
        <div className="mt-6 grid gap-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-64" />
          ))}
        </div>
      ) : visible.length ? (
        <div className="mt-6 grid gap-4">
          {visible.map(({ order, fulfillment }) => {
            const customer =
              users.find((user) => user.id === order.shopperId)?.name ??
              "Demo shopper";
            const next = nextStatus[fulfillment.status];
            return (
              <article
                id={fulfillment.id}
                key={fulfillment.id}
                className="scroll-mt-24 overflow-hidden rounded-lg border bg-surface"
              >
                <header className="grid gap-4 border-b bg-muted/35 px-5 py-4 sm:grid-cols-[1fr_auto] sm:items-center sm:px-6">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
                    <div>
                      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Order
                      </p>
                      <p className="mt-1 text-sm font-semibold">
                        #{order.id.replace("order_", "")}
                      </p>
                    </div>
                    <div className="h-8 w-px bg-border" aria-hidden="true" />
                    <div>
                      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Customer
                      </p>
                      <p className="mt-1 text-sm font-medium">{customer}</p>
                    </div>
                    <div className="h-8 w-px bg-border" aria-hidden="true" />
                    <div>
                      <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                        Placed
                      </p>
                      <p className="mt-1 text-sm">
                        {new Intl.DateTimeFormat("en", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        }).format(new Date(order.placedAt))}
                      </p>
                    </div>
                  </div>
                  <StatusBadge status={fulfillment.status} />
                </header>
                <div className="grid gap-6 p-5 sm:p-6 xl:grid-cols-[minmax(0,1fr)_18rem]">
                  <div>
                    <div className="grid gap-4">
                      {fulfillment.lineItems.map((line) => (
                        <div key={line.id} className="flex items-center gap-4">
                          <div className="relative size-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                            <Image
                              src={line.productImage}
                              alt=""
                              fill
                              sizes="64px"
                              className="object-cover"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="truncate text-sm font-semibold">
                              {line.productName}
                            </p>
                            <p className="mt-1 text-xs text-muted-foreground">
                              Qty {line.quantity}
                              {line.variantName ? ` · ${line.variantName}` : ""}
                            </p>
                          </div>
                          <p className="text-sm font-semibold tabular-nums">
                            {formatMoney({
                              ...line.unitPrice,
                              amount: line.unitPrice.amount * line.quantity,
                            })}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t pt-4">
                      <span className="text-sm text-muted-foreground">
                        Clay & Co. subtotal
                      </span>
                      <strong className="tabular-nums">
                        {formatMoney(fulfillment.subtotal)}
                      </strong>
                    </div>
                  </div>
                  <div className="border-t pt-5 xl:border-l xl:border-t-0 xl:pl-6 xl:pt-0">
                    <p className="text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                      Fulfillment progress
                    </p>
                    <ol className="mt-4 grid gap-3">
                      {["placed", "processing", "shipped", "delivered"].map(
                        (status, index) => {
                          const currentIndex = [
                            "placed",
                            "processing",
                            "shipped",
                            "delivered",
                          ].indexOf(fulfillment.status);
                          const complete = index <= currentIndex;
                          const Icon =
                            status === "shipped"
                              ? Truck
                              : status === "delivered"
                                ? CheckCircle2
                                : status === "processing"
                                  ? PackageCheck
                                  : Clock3;
                          return (
                            <li
                              key={status}
                              className={cn(
                                "flex items-center gap-3 text-xs capitalize",
                                complete
                                  ? "font-semibold text-foreground"
                                  : "text-muted-foreground",
                              )}
                            >
                              <span
                                className={cn(
                                  "grid size-7 place-items-center rounded-full border",
                                  complete
                                    ? "border-sage/30 bg-sage/12 text-success"
                                    : "bg-muted",
                                )}
                              >
                                <Icon aria-hidden="true" className="size-3.5" />
                              </span>
                              {status}
                            </li>
                          );
                        },
                      )}
                    </ol>
                    {next ? (
                      <Button
                        className="mt-5 w-full"
                        onClick={() =>
                          advance(order.id, fulfillment.id, fulfillment.status)
                        }
                      >
                        {actionCopy[fulfillment.status]}
                        <ChevronRight aria-hidden="true" />
                      </Button>
                    ) : (
                      <p className="mt-5 rounded-md bg-success/8 px-3 py-2.5 text-xs font-medium text-success">
                        No further action needed.
                      </p>
                    )}
                    {fulfillment.trackingNumber ? (
                      <p className="mt-3 break-all text-[0.6875rem] text-muted-foreground">
                        Demo tracking:{" "}
                        <span className="font-semibold text-foreground">
                          {fulfillment.trackingNumber}
                        </span>
                      </p>
                    ) : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={PackageCheck}
            title="No orders in this view"
            description="Choose another status to see Clay & Co. fulfillment work."
          />
        </div>
      )}
    </div>
  );
}
