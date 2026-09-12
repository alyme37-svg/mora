"use client";

import { Eye, ShoppingBag, TrendingUp, WalletCards } from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { demoIdentities } from "@/data/seed";
import { SalesChart } from "@/features/seller/sales-chart";
import { SellerPageHeader } from "@/features/seller/seller-page-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMoney, usd } from "@/lib/money";
import { getSellerDashboard } from "@/store/selectors";
import { useMarketplaceStore } from "@/store/marketplace-store";

export function SellerAnalytics() {
  const hydrated = useHydrated();
  const marketplace = useMarketplaceStore();
  const data = useMemo(
    () => getSellerDashboard(marketplace, demoIdentities.sellerId),
    [marketplace],
  );
  if (!hydrated) return <Skeleton className="h-[36rem]" />;
  const metrics = [
    {
      label: "Sales",
      value: formatMoney(usd(data.salesAmount)),
      icon: WalletCards,
    },
    {
      label: "Orders",
      value: data.orderCount.toLocaleString(),
      icon: ShoppingBag,
    },
    { label: "Views", value: data.views.toLocaleString(), icon: Eye },
    {
      label: "Conversion",
      value: `${data.conversion.toFixed(1)}%`,
      icon: TrendingUp,
    },
  ];
  return (
    <div>
      <SellerPageHeader
        eyebrow="Performance"
        title="Store analytics"
        description="A lightweight, deterministic view of Clay & Co. — no enterprise tracking or external analytics."
      />
      <section className="mt-6 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, icon: Icon }) => (
          <article
            key={label}
            className="flex items-center gap-4 rounded-lg border bg-surface p-5"
          >
            <span className="grid size-10 place-items-center rounded-md bg-muted text-walnut">
              <Icon aria-hidden="true" className="size-4" />
            </span>
            <div>
              <p className="text-xs text-muted-foreground">{label}</p>
              <p className="mt-1 text-xl font-semibold tabular-nums">{value}</p>
            </div>
          </article>
        ))}
      </section>
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1.45fr)_minmax(18rem,0.75fr)]">
        <section className="rounded-lg border bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Sales trend</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Fictional monthly history stored in the deterministic seed.
          </p>
          <SalesChart points={data.analytics} />
        </section>
        <section className="rounded-lg border bg-surface p-5 sm:p-6">
          <h2 className="text-lg font-semibold">Top products</h2>
          <div className="mt-5 grid gap-5">
            {data.topProducts.map(({ product, revenue, quantity }, index) => (
              <div key={product.id} className="flex items-center gap-3">
                <span className="w-4 text-xs font-semibold text-muted-foreground">
                  {index + 1}
                </span>
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
                    {quantity} units
                  </p>
                </div>
                <span className="text-xs font-semibold tabular-nums">
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
