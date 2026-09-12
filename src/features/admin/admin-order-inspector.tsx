"use client";

import { Package, UserRound } from "lucide-react";
import Image from "next/image";

import { StatusBadge } from "@/components/marketplace/status-badge";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { formatMoney } from "@/lib/money";
import type { MarketplaceOrder, Seller, User } from "@/types/marketplace";

type AdminOrderInspectorProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  order: MarketplaceOrder | null;
  users: User[];
  sellers: Seller[];
};

export function AdminOrderInspector({
  open,
  onOpenChange,
  order,
  users,
  sellers,
}: AdminOrderInspectorProps) {
  const shopper = order
    ? users.find((user) => user.id === order.shopperId)
    : undefined;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        title={
          order ? `Order #${order.id.replace("order_", "")}` : "Order details"
        }
        description="Fictional marketplace order · read-only admin inspection."
        className="w-[min(94vw,31rem)]"
      >
        {order ? (
          <div className="grid gap-7">
            <section className="rounded-md border bg-muted/35 p-4">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Shopper
                  </p>
                  <p className="mt-2 flex items-center gap-2 text-sm font-semibold">
                    <UserRound
                      aria-hidden="true"
                      className="size-4 text-walnut"
                    />
                    {shopper?.name ?? "Fictional shopper"}
                  </p>
                </div>
                <StatusBadge status={order.status} />
              </div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                Placed{" "}
                {new Intl.DateTimeFormat("en", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                }).format(new Date(order.placedAt))}{" "}
                · {order.paymentMethodLabel}
              </p>
            </section>

            <section>
              <h3 className="text-sm font-semibold">Seller fulfillments</h3>
              <div className="mt-3 grid gap-4">
                {order.fulfillments.map((fulfillment) => {
                  const seller = sellers.find(
                    (candidate) => candidate.id === fulfillment.sellerId,
                  );
                  return (
                    <article
                      key={fulfillment.id}
                      className="rounded-md border p-4"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold">
                            {seller?.settings.displayName ?? "Fictional seller"}
                          </p>
                          <p className="mt-1 text-xs text-muted-foreground">
                            {fulfillment.lineItems.length} item
                            {fulfillment.lineItems.length === 1 ? "" : "s"}
                          </p>
                        </div>
                        <StatusBadge status={fulfillment.status} />
                      </div>
                      <div className="mt-4 grid gap-3 border-t pt-4">
                        {fulfillment.lineItems.map((line) => (
                          <div
                            key={line.id}
                            className="flex min-w-0 items-center gap-3"
                          >
                            <div className="relative size-11 shrink-0 overflow-hidden rounded-sm border bg-muted">
                              <Image
                                src={line.productImage}
                                alt=""
                                fill
                                sizes="44px"
                                className="object-cover"
                              />
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-xs font-semibold">
                                {line.productName}
                              </p>
                              <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                                Qty {line.quantity}
                                {line.variantName
                                  ? ` · ${line.variantName}`
                                  : ""}
                              </p>
                            </div>
                            <span className="shrink-0 text-xs font-semibold tabular-nums">
                              {formatMoney({
                                ...line.unitPrice,
                                amount: line.unitPrice.amount * line.quantity,
                              })}
                            </span>
                          </div>
                        ))}
                      </div>
                      <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs">
                        <span className="text-muted-foreground">
                          Fulfillment subtotal
                        </span>
                        <strong className="tabular-nums">
                          {formatMoney(fulfillment.subtotal)}
                        </strong>
                      </div>
                    </article>
                  );
                })}
              </div>
            </section>

            <section className="flex items-center justify-between border-t pt-5">
              <span className="flex items-center gap-2 text-sm text-muted-foreground">
                <Package aria-hidden="true" className="size-4" />
                Marketplace total
              </span>
              <strong className="text-base tabular-nums">
                {formatMoney(order.total)}
              </strong>
            </section>
          </div>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
