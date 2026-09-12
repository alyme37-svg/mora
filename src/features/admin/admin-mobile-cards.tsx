import { Eye } from "lucide-react";
import Image from "next/image";

import { StatusBadge } from "@/components/marketplace/status-badge";
import { Button } from "@/components/ui/button";
import { AdminStateBadge } from "@/features/admin/admin-state-badge";
import { formatMoney } from "@/lib/money";
import type { MarketplaceState } from "@/store/marketplace-store";
import {
  getProductRating,
  getProductStock,
  getSellerRating,
} from "@/store/selectors";
import type {
  MarketplaceOrder,
  ProductStatus,
  UserStatus,
} from "@/types/marketplace";

export function AdminMobileOrders({
  orders,
  marketplace,
  onInspect,
}: {
  orders: MarketplaceOrder[];
  marketplace: MarketplaceState;
  onInspect: (order: MarketplaceOrder) => void;
}) {
  return (
    <div className="divide-y md:hidden">
      {orders.map((order) => {
        const shopper = marketplace.users.find(
          (user) => user.id === order.shopperId,
        );
        return (
          <article key={order.id} className="p-5 [content-visibility:auto]">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-[0.625rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Order
                </p>
                <p className="mt-1 text-sm font-semibold tabular-nums">
                  #{order.id.replace("order_", "")}
                </p>
              </div>
              <StatusBadge status={order.status} />
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-3 border-y py-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Shopper</dt>
                <dd className="mt-1 truncate font-medium">
                  {shopper?.name ?? "Fictional shopper"}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Sellers</dt>
                <dd className="mt-1 font-medium">
                  {order.fulfillments.length}
                </dd>
              </div>
              <div className="text-right">
                <dt className="text-muted-foreground">Total</dt>
                <dd className="mt-1 font-semibold tabular-nums">
                  {formatMoney(order.total)}
                </dd>
              </div>
            </dl>
            <Button
              size="sm"
              variant="secondary"
              className="mt-4 w-full"
              onClick={() => onInspect(order)}
            >
              <Eye aria-hidden="true" />
              Inspect order
            </Button>
          </article>
        );
      })}
    </div>
  );
}

export function AdminMobileSellers({
  marketplace,
  onStatusChange,
}: {
  marketplace: MarketplaceState;
  onStatusChange: (sellerId: string, status: UserStatus, name: string) => void;
}) {
  return (
    <div className="divide-y md:hidden">
      {marketplace.sellers.map((seller) => {
        const owner = marketplace.users.find(
          (user) => user.id === seller.ownerUserId,
        );
        const rating = getSellerRating(marketplace, seller.id);
        return (
          <article key={seller.id} className="p-5 [content-visibility:auto]">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <p className="truncate font-semibold">
                  {seller.settings.displayName}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {owner?.name ?? "Fictional owner"} · {seller.location}
                </p>
              </div>
              <AdminStateBadge status={seller.status} />
            </div>
            <div className="mt-4 flex items-center justify-between border-t pt-3 text-xs">
              <span className="text-muted-foreground">Store rating</span>
              <span className="font-medium">
                {rating.count
                  ? `${rating.average.toFixed(1)} · ${rating.count} reviews`
                  : "No reviews"}
              </span>
            </div>
            <Button
              size="sm"
              variant={seller.status === "active" ? "danger" : "secondary"}
              className="mt-4 w-full"
              onClick={() =>
                onStatusChange(
                  seller.id,
                  seller.status,
                  seller.settings.displayName,
                )
              }
            >
              {seller.status === "active"
                ? "Suspend seller"
                : "Reactivate seller"}
            </Button>
          </article>
        );
      })}
    </div>
  );
}

export function AdminMobileProducts({
  marketplace,
  onStatusChange,
}: {
  marketplace: MarketplaceState;
  onStatusChange: (
    productId: string,
    status: ProductStatus,
    name: string,
    adminSuspended?: boolean,
  ) => void;
}) {
  return (
    <div className="divide-y md:hidden">
      {marketplace.products.map((product) => {
        const seller = marketplace.sellers.find(
          (candidate) => candidate.id === product.sellerId,
        );
        const rating = getProductRating(marketplace, product.id);
        const actionable =
          product.adminSuspended ||
          product.status === "active" ||
          product.status === "suspended";
        return (
          <article key={product.id} className="p-5 [content-visibility:auto]">
            <div className="flex items-start gap-3">
              <div className="relative size-14 shrink-0 overflow-hidden rounded-md border bg-muted">
                <Image
                  src={product.images[0]}
                  alt=""
                  fill
                  sizes="56px"
                  className="object-cover"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-2 text-sm font-semibold leading-5">
                  {product.name}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">
                  {seller?.settings.displayName ?? "Unknown seller"}
                </p>
              </div>
              <AdminStateBadge
                status={product.adminSuspended ? "suspended" : product.status}
              />
            </div>
            <dl className="mt-4 grid grid-cols-3 gap-3 border-y py-3 text-xs">
              <div>
                <dt className="text-muted-foreground">Price</dt>
                <dd className="mt-1 font-semibold tabular-nums">
                  {formatMoney(product.price)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Stock</dt>
                <dd className="mt-1 font-medium tabular-nums">
                  {getProductStock(product)}
                </dd>
              </div>
              <div className="text-right">
                <dt className="text-muted-foreground">Rating</dt>
                <dd className="mt-1 font-medium">
                  {rating.count ? rating.average.toFixed(1) : "New"}
                </dd>
              </div>
            </dl>
            {actionable ? (
              <Button
                size="sm"
                variant={
                  !product.adminSuspended && product.status === "active"
                    ? "danger"
                    : "secondary"
                }
                className="mt-4 w-full"
                onClick={() =>
                  onStatusChange(
                    product.id,
                    product.status,
                    product.name,
                    product.adminSuspended,
                  )
                }
              >
                {!product.adminSuspended && product.status === "active"
                  ? "Suspend product"
                  : "Reactivate product"}
              </Button>
            ) : (
              <p className="mt-4 text-center text-xs text-muted-foreground">
                Managed by the seller
              </p>
            )}
          </article>
        );
      })}
    </div>
  );
}
