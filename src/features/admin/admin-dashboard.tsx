"use client";

import {
  AlertTriangle,
  ClipboardList,
  Eye,
  Package,
  RotateCcw,
  ShieldCheck,
  Store,
  UsersRound,
} from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

import { StatusBadge } from "@/components/marketplace/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { AdminOrderInspector } from "@/features/admin/admin-order-inspector";
import {
  AdminMobileOrders,
  AdminMobileProducts,
  AdminMobileSellers,
} from "@/features/admin/admin-mobile-cards";
import { AdminStateBadge } from "@/features/admin/admin-state-badge";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMoney } from "@/lib/money";
import { useMarketplaceStore } from "@/store/marketplace-store";
import {
  getActiveProducts,
  getProductRating,
  getProductStock,
  getSellerRating,
} from "@/store/selectors";
import type {
  MarketplaceOrder,
  ProductStatus,
  UserStatus,
} from "@/types/marketplace";

function Metric({
  label,
  value,
  note,
  icon: Icon,
}: {
  label: string;
  value: string;
  note: string;
  icon: typeof UsersRound;
}) {
  return (
    <article className="min-w-0 rounded-lg border bg-surface p-4 shadow-soft sm:p-5">
      <div className="flex items-start justify-between gap-2">
        <p className="text-xs font-medium text-muted-foreground sm:text-sm">
          {label}
        </p>
        <span className="grid size-8 shrink-0 place-items-center rounded-md bg-muted text-walnut sm:size-9">
          <Icon aria-hidden="true" className="size-4" />
        </span>
      </div>
      <p className="mt-4 text-xl font-semibold tabular-nums tracking-[-0.03em] sm:mt-5 sm:text-2xl">
        {value}
      </p>
      <p className="mt-1 text-[0.625rem] leading-4 text-muted-foreground sm:text-xs sm:leading-5">
        {note}
      </p>
    </article>
  );
}

export function AdminDashboard() {
  const hydrated = useHydrated();
  const marketplace = useMarketplaceStore();
  const suspendProduct = useMarketplaceStore((state) => state.suspendProduct);
  const reactivateProduct = useMarketplaceStore(
    (state) => state.reactivateProduct,
  );
  const suspendSeller = useMarketplaceStore((state) => state.suspendSeller);
  const reactivateSeller = useMarketplaceStore(
    (state) => state.reactivateSeller,
  );
  const resetDemoData = useMarketplaceStore((state) => state.resetDemoData);
  const { toast } = useToast();
  const router = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<MarketplaceOrder | null>(
    null,
  );

  const summary = useMemo(() => {
    const activeProducts = getActiveProducts(marketplace);
    const activeUsers = marketplace.users.filter(
      (user) => user.status === "active",
    ).length;
    const activeSellers = marketplace.sellers.filter(
      (seller) => seller.status === "active",
    ).length;
    const ordersInFlight = marketplace.orders.filter(
      (order) => !["delivered", "cancelled"].includes(order.status),
    ).length;
    return {
      activeProducts: activeProducts.length,
      activeUsers,
      activeSellers,
      ordersInFlight,
    };
  }, [marketplace]);

  const recentOrders = useMemo(
    () =>
      marketplace.orders
        .toSorted((left, right) => right.placedAt.localeCompare(left.placedAt))
        .slice(0, 8),
    [marketplace.orders],
  );

  function changeSellerStatus(
    sellerId: string,
    status: UserStatus,
    name: string,
  ) {
    if (status === "active") {
      suspendSeller(sellerId);
      toast({
        title: "Seller suspended",
        description: `${name}'s active products are no longer purchasable.`,
      });
      return;
    }
    reactivateSeller(sellerId);
    toast({
      title: "Seller reactivated",
      description: `${name} is visible in discovery again.`,
    });
  }

  function changeProductStatus(
    productId: string,
    status: ProductStatus,
    name: string,
    adminSuspended = false,
  ) {
    if (!adminSuspended && status === "active") {
      suspendProduct(productId);
      toast({
        title: "Product suspended",
        description: `${name} is no longer available to shoppers.`,
      });
      return;
    }
    if (adminSuspended || status === "suspended") {
      reactivateProduct(productId);
      toast({
        title: "Product reactivated",
        description: `${name} is available again when its store is active.`,
      });
    }
  }

  function handleReset() {
    if (
      !window.confirm(
        "Reset all local MORA demo data? This restores the original fictional seed and returns to Shopper view.",
      )
    )
      return;
    resetDemoData();
    toast({
      title: "Demo data reset",
      description: "Original fictional data has been restored.",
    });
    router.push("/");
  }

  if (!hydrated) {
    return (
      <div className="mx-auto w-full max-w-[90rem] px-4 py-10 sm:px-6 lg:px-10">
        <Skeleton className="h-32" />
        <div className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
        <Skeleton className="mt-6 h-96" />
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-[90rem] px-4 py-8 sm:px-6 sm:py-10 lg:px-10">
      <header className="rounded-lg border bg-foreground px-5 py-6 text-surface shadow-soft sm:px-7 sm:py-8">
        <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-gold">
              Portfolio admin · Nora Reed
            </p>
            <h1 className="mt-2 text-balance font-serif text-4xl font-semibold tracking-[-0.03em] sm:text-5xl">
              Marketplace oversight, kept light.
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-surface/70">
              A small local moderation view for this fictional marketplace.
              Changes update the same shared demo state.
            </p>
          </div>
          <Button
            variant="secondary"
            onClick={handleReset}
            className="border-surface/20 bg-transparent text-surface hover:bg-surface/10"
          >
            <RotateCcw aria-hidden="true" />
            Reset demo data
          </Button>
        </div>
      </header>

      <section
        aria-label="Marketplace status"
        className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4"
      >
        <Metric
          label="Active users"
          value={summary.activeUsers.toLocaleString()}
          note={`${marketplace.users.length} fictional identities`}
          icon={UsersRound}
        />
        <Metric
          label="Active sellers"
          value={summary.activeSellers.toLocaleString()}
          note={`${marketplace.sellers.length - summary.activeSellers} currently suspended`}
          icon={Store}
        />
        <Metric
          label="Discoverable products"
          value={summary.activeProducts.toLocaleString()}
          note="Only active stores and listings"
          icon={Package}
        />
        <Metric
          label="Orders in motion"
          value={summary.ordersInFlight.toLocaleString()}
          note={`${marketplace.orders.length} total marketplace orders`}
          icon={ClipboardList}
        />
      </section>

      <section className="mt-6 grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1.15fr)_minmax(21rem,0.85fr)]">
        <div className="min-w-0 overflow-hidden rounded-lg border bg-surface">
          <div className="flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-6">
            <div>
              <h2 className="text-lg font-semibold">Marketplace orders</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Inspect seller groups without editing fulfillment.
              </p>
            </div>
            <Badge tone="gold">Read-only</Badge>
          </div>
          <div className="hidden overflow-x-auto md:block">
            <table className="min-w-[42rem] w-full text-left text-sm">
              <thead className="border-b bg-muted/35 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
                <tr>
                  <th className="px-5 py-3 sm:px-6">Order</th>
                  <th className="py-3">Shopper</th>
                  <th className="py-3">Sellers</th>
                  <th className="py-3">Total</th>
                  <th className="py-3">Status</th>
                  <th className="px-5 py-3 text-right sm:px-6">
                    <span className="sr-only">Inspect</span>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {recentOrders.map((order) => {
                  const shopper = marketplace.users.find(
                    (user) => user.id === order.shopperId,
                  );
                  return (
                    <tr key={order.id}>
                      <td className="whitespace-nowrap px-5 py-4 font-semibold sm:px-6">
                        #{order.id.replace("order_", "")}
                      </td>
                      <td className="py-4 font-medium">
                        {shopper?.name ?? "Fictional shopper"}
                      </td>
                      <td className="py-4 text-muted-foreground">
                        {order.fulfillments.length}
                      </td>
                      <td className="py-4 font-semibold tabular-nums">
                        {formatMoney(order.total)}
                      </td>
                      <td className="py-4">
                        <StatusBadge status={order.status} />
                      </td>
                      <td className="px-5 py-4 text-right sm:px-6">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => setSelectedOrder(order)}
                        >
                          <Eye aria-hidden="true" />
                          Inspect
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          <AdminMobileOrders
            orders={recentOrders}
            marketplace={marketplace}
            onInspect={setSelectedOrder}
          />
        </div>

        <aside className="rounded-lg border bg-surface p-5 sm:p-6">
          <div className="flex items-start gap-3">
            <span className="grid size-10 shrink-0 place-items-center rounded-md bg-gold/15 text-walnut">
              <ShieldCheck aria-hidden="true" className="size-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Status overview</h2>
              <p className="mt-1 text-xs leading-5 text-muted-foreground">
                Suspension is local-only and immediately affects public
                discovery and purchase controls.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-4">
            {[
              {
                label: "Seller visibility",
                value: `${summary.activeSellers} active`,
                note: "Suspended stores leave catalog and cart eligibility.",
              },
              {
                label: "Product availability",
                value: `${summary.activeProducts} active`,
                note: "Suspended listings disappear from shopper search.",
              },
              {
                label: "Order integrity",
                value: `${marketplace.orders.length} retained`,
                note: "Historical order records stay visible for inspection.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="border-b pb-4 last:border-0 last:pb-0"
              >
                <p className="text-xs font-semibold text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-semibold">{item.value}</p>
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {item.note}
                </p>
              </div>
            ))}
          </div>
        </aside>
      </section>

      <section className="mt-6 overflow-hidden rounded-lg border bg-surface">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold">Sellers</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Suspend or reactivate a fictional store. Existing orders stay
            intact.
          </p>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-[46rem] w-full text-left text-sm">
            <thead className="border-b bg-muted/35 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 sm:px-6">Store</th>
                <th className="py-3">Owner</th>
                <th className="py-3">Location</th>
                <th className="py-3">Rating</th>
                <th className="py-3">Status</th>
                <th className="px-5 py-3 text-right sm:px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {marketplace.sellers.map((seller) => {
                const owner = marketplace.users.find(
                  (user) => user.id === seller.ownerUserId,
                );
                const rating = getSellerRating(marketplace, seller.id);
                return (
                  <tr key={seller.id}>
                    <td className="px-5 py-4 font-semibold sm:px-6">
                      {seller.settings.displayName}
                    </td>
                    <td className="py-4">{owner?.name ?? "Fictional owner"}</td>
                    <td className="py-4 text-muted-foreground">
                      {seller.location}
                    </td>
                    <td className="py-4">
                      {rating.count
                        ? `${rating.average.toFixed(1)} · ${rating.count}`
                        : "No reviews"}
                    </td>
                    <td className="py-4">
                      <AdminStateBadge status={seller.status} />
                    </td>
                    <td className="px-5 py-4 text-right sm:px-6">
                      <Button
                        size="sm"
                        variant={
                          seller.status === "active" ? "danger" : "secondary"
                        }
                        onClick={() =>
                          changeSellerStatus(
                            seller.id,
                            seller.status,
                            seller.settings.displayName,
                          )
                        }
                      >
                        {seller.status === "active" ? "Suspend" : "Reactivate"}
                      </Button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <AdminMobileSellers
          marketplace={marketplace}
          onStatusChange={changeSellerStatus}
        />
      </section>

      <section className="mt-6 overflow-hidden rounded-lg border bg-surface">
        <div className="border-b px-5 py-4 sm:px-6">
          <h2 className="text-lg font-semibold">Products</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            A suspended product is removed from catalog results and local cart
            eligibility.
          </p>
        </div>
        <div className="hidden overflow-x-auto md:block">
          <table className="min-w-[53rem] w-full text-left text-sm">
            <thead className="border-b bg-muted/35 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground">
              <tr>
                <th className="px-5 py-3 sm:px-6">Product</th>
                <th className="py-3">Seller</th>
                <th className="py-3">Price</th>
                <th className="py-3">Stock</th>
                <th className="py-3">Rating</th>
                <th className="py-3">Status</th>
                <th className="px-5 py-3 text-right sm:px-6">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {marketplace.products.map((product) => {
                const seller = marketplace.sellers.find(
                  (candidate) => candidate.id === product.sellerId,
                );
                const rating = getProductRating(marketplace, product.id);
                return (
                  <tr key={product.id}>
                    <td className="px-5 py-3 sm:px-6">
                      <div className="flex min-w-[15rem] items-center gap-3">
                        <div className="relative size-11 shrink-0 overflow-hidden rounded-sm border bg-muted">
                          <Image
                            src={product.images[0]}
                            alt=""
                            fill
                            sizes="44px"
                            className="object-cover"
                          />
                        </div>
                        <span className="font-semibold">{product.name}</span>
                      </div>
                    </td>
                    <td className="py-3">
                      {seller?.settings.displayName ?? "Unknown seller"}
                    </td>
                    <td className="py-3 font-semibold tabular-nums">
                      {formatMoney(product.price)}
                    </td>
                    <td className="py-3 tabular-nums">
                      {getProductStock(product)}
                    </td>
                    <td className="py-3">
                      {rating.count
                        ? `${rating.average.toFixed(1)} · ${rating.count}`
                        : "No reviews"}
                    </td>
                    <td className="py-3">
                      <AdminStateBadge
                        status={
                          product.adminSuspended ? "suspended" : product.status
                        }
                      />
                    </td>
                    <td className="px-5 py-3 text-right sm:px-6">
                      {product.adminSuspended ||
                      product.status === "active" ||
                      product.status === "suspended" ? (
                        <Button
                          size="sm"
                          variant={
                            !product.adminSuspended &&
                            product.status === "active"
                              ? "danger"
                              : "secondary"
                          }
                          onClick={() =>
                            changeProductStatus(
                              product.id,
                              product.status,
                              product.name,
                              product.adminSuspended,
                            )
                          }
                        >
                          {!product.adminSuspended &&
                          product.status === "active"
                            ? "Suspend"
                            : "Reactivate"}
                        </Button>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Seller managed
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <AdminMobileProducts
          marketplace={marketplace}
          onStatusChange={changeProductStatus}
        />
      </section>

      <section className="mt-6 rounded-lg border border-danger/25 bg-danger/5 p-5 sm:flex sm:items-center sm:justify-between sm:gap-8 sm:p-6">
        <div className="flex items-start gap-3">
          <AlertTriangle
            aria-hidden="true"
            className="mt-0.5 size-5 shrink-0 text-danger"
          />
          <div>
            <h2 className="text-sm font-semibold">
              Reset this fictional workspace
            </h2>
            <p className="mt-1 max-w-2xl text-xs leading-5 text-muted-foreground">
              Restores the deterministic original data, including products,
              orders, reviews, store settings, cart, and role.
            </p>
          </div>
        </div>
        <Button variant="danger" className="mt-4 sm:mt-0" onClick={handleReset}>
          <RotateCcw aria-hidden="true" />
          Reset demo data
        </Button>
      </section>

      <AdminOrderInspector
        open={Boolean(selectedOrder)}
        onOpenChange={(open) => !open && setSelectedOrder(null)}
        order={selectedOrder}
        users={marketplace.users}
        sellers={marketplace.sellers}
      />
    </div>
  );
}
