"use client";

import {
  ArrowRight,
  Box,
  CircleDollarSign,
  Eye,
  PackageCheck,
  ShoppingBag,
  TrendingUp,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { StatusBadge } from "@/components/marketplace/status-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { demoIdentities } from "@/data/seed";
import { SalesChart } from "@/features/seller/sales-chart";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMoney, usd } from "@/lib/money";
import { useMarketplaceStore } from "@/store/marketplace-store";
import { getSellerDashboard } from "@/store/selectors";

export function SellerDashboard() {
  const hydrated = useHydrated();
  const marketplace = useMarketplaceStore();
  const dashboard = useMemo(
    () => getSellerDashboard(marketplace, demoIdentities.sellerId),
    [marketplace],
  );
  const users = useMarketplaceStore((state) => state.users);

  if (!hydrated)
    return (
      <div className="grid gap-5">
        <Skeleton className="h-24" />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-32" />
          ))}
        </div>
        <Skeleton className="h-80" />
      </div>
    );

  const metrics = [
    {
      label: "Total sales",
      value: formatMoney(usd(dashboard.salesAmount)),
      note: "Non-cancelled fulfillments",
      icon: CircleDollarSign,
    },
    {
      label: "Orders",
      value: dashboard.orderCount.toLocaleString(),
      note: "Clay & Co. portions only",
      icon: ShoppingBag,
    },
    {
      label: "Store views",
      value: dashboard.views.toLocaleString(),
      note: "Latest fictional month",
      icon: Eye,
    },
    {
      label: "Conversion",
      value: `${dashboard.conversion.toFixed(1)}%`,
      note: "Orders ÷ store views",
      icon: TrendingUp,
    },
  ];

  return (
    <div>
      <div className="flex flex-col gap-5 border-b pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-caramel">
            Store overview
          </p>
          <h1 className="mt-2 text-balance text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            Good afternoon, Alex <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Here&apos;s what&apos;s happening with your store today.
          </p>
        </div>
        <Button asChild>
          <Link href="/seller/products/new">
            <Box aria-hidden="true" />
            Add product
          </Link>
        </Button>
      </div>

      <section
        aria-label="Store metrics"
        className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4"
      >
        {metrics.map(({ label, value, note, icon: Icon }) => (
          <article
            key={label}
            className="min-w-0 rounded-lg border bg-surface p-4 shadow-soft sm:p-5"
          >
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
            <p className="mt-1 text-[0.625rem] leading-4 text-muted-foreground sm:text-[0.6875rem]">
              {note}
            </p>
          </article>
        ))}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.55fr)_minmax(18rem,0.75fr)]">
        <section className="rounded-lg border bg-surface p-5 sm:p-6">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-semibold">Sales overview</h2>
              <p className="mt-1 text-xs text-muted-foreground">
                Six months of fictional store performance.
              </p>
            </div>
            <span className="rounded-full border bg-muted px-3 py-1.5 text-xs font-semibold">
              Last 6 months
            </span>
          </div>
          <SalesChart points={dashboard.analytics} />
        </section>
        <section className="rounded-lg border bg-foreground p-5 text-surface sm:p-6">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-gold">
            Store activity
          </p>
          <h2 className="mt-2 text-xl font-semibold">The work moving today</h2>
          <div className="mt-6 grid gap-4">
            {[
              {
                label: "Awaiting processing",
                value: dashboard.awaitingProcessingCount,
                icon: PackageCheck,
              },
              {
                label: "In transit",
                value: dashboard.inTransitCount,
                icon: ShoppingBag,
              },
              {
                label: "Top-selling pieces",
                value: dashboard.topProducts.length,
                icon: Box,
              },
            ].map(({ label, value, icon: Icon }) => (
              <div
                key={label}
                className="flex items-center gap-3 border-b border-surface/10 pb-4 last:border-0 last:pb-0"
              >
                <Icon aria-hidden="true" className="size-4 text-gold" />
                <span className="flex-1 text-sm text-surface/70">{label}</span>
                <strong className="tabular-nums">{value}</strong>
              </div>
            ))}
          </div>
          <Button
            asChild
            variant="secondary"
            className="mt-7 w-full border-surface/20 bg-transparent text-surface hover:bg-surface/10"
          >
            <Link href="/seller/orders">
              Manage orders <ArrowRight aria-hidden="true" />
            </Link>
          </Button>
        </section>
      </div>

      <div className="mt-6 grid min-w-0 gap-6 [&>section]:min-w-0 xl:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)]">
        <section className="overflow-hidden rounded-lg border bg-surface">
          <div className="flex items-center justify-between gap-4 border-b px-5 py-4 sm:px-6">
            <h2 className="text-lg font-semibold">Recent orders</h2>
            <Link
              href="/seller/orders"
              className="inline-flex min-h-10 items-center gap-1 text-xs font-semibold hover:underline"
            >
              View all <ArrowRight aria-hidden="true" className="size-3.5" />
            </Link>
          </div>
          <div className="divide-y">
            {dashboard.recentOrders.map(({ order, fulfillment }) => {
              const customer =
                users.find((user) => user.id === order.shopperId)?.name ??
                "Demo shopper";
              return (
                <Link
                  key={fulfillment.id}
                  href={`/seller/orders#${fulfillment.id}`}
                  className="grid min-h-18 grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 hover:bg-muted/45 sm:grid-cols-[7rem_1fr_5rem_auto] sm:px-6"
                >
                  <span className="text-xs font-semibold">
                    #{order.id.replace("order_", "")}
                  </span>
                  <span className="hidden min-w-0 text-sm sm:block">
                    <span className="block truncate font-medium">
                      {customer}
                    </span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {fulfillment.lineItems.length} item
                      {fulfillment.lineItems.length === 1 ? "" : "s"}
                    </span>
                  </span>
                  <span className="hidden text-sm font-semibold tabular-nums sm:block">
                    {formatMoney(fulfillment.subtotal)}
                  </span>
                  <StatusBadge status={fulfillment.status} />
                </Link>
              );
            })}
          </div>
        </section>
        <section className="rounded-lg border bg-surface p-5 sm:p-6">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Top products</h2>
            <Link
              href="/seller/products"
              className="text-xs font-semibold hover:underline"
            >
              Catalog
            </Link>
          </div>
          <div className="mt-5 grid min-w-0 gap-4">
            {dashboard.topProducts.map(({ product, quantity, revenue }) => (
              <div
                key={product.id}
                className="flex w-full min-w-0 items-center gap-3"
              >
                <div className="relative size-12 shrink-0 overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={product.images[0]}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold">
                    {product.name}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {quantity} sold
                  </p>
                </div>
                <span className="shrink-0 text-xs font-semibold tabular-nums">
                  {formatMoney(usd(revenue))}
                </span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
