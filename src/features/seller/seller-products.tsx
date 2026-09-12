"use client";

import { Archive, Edit3, PackageOpen, Plus, Search } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useDeferredValue, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { demoIdentities } from "@/data/seed";
import { ProductStatusBadge } from "@/features/seller/product-status-badge";
import { SellerPageHeader } from "@/features/seller/seller-page-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMoney } from "@/lib/money";
import { useMarketplaceStore } from "@/store/marketplace-store";
import { getProductStock } from "@/store/selectors";

export function SellerProducts() {
  const hydrated = useHydrated();
  const marketplaceProducts = useMarketplaceStore((state) => state.products);
  const products = useMemo(
    () =>
      marketplaceProducts
        .filter((product) => product.sellerId === demoIdentities.sellerId)
        .toSorted((a, b) => b.createdAt.localeCompare(a.createdAt)),
    [marketplaceProducts],
  );
  const archiveProduct = useMarketplaceStore((state) => state.archiveProduct);
  const { toast } = useToast();
  const [query, setQuery] = useState("");
  const deferredQuery = useDeferredValue(query.trim().toLowerCase());
  const filtered = products.filter(
    (product) =>
      !deferredQuery || product.name.toLowerCase().includes(deferredQuery),
  );

  function archive(id: string, name: string) {
    if (
      !window.confirm(
        `Archive ${name}? It will disappear from the shopper marketplace.`,
      )
    )
      return;
    archiveProduct(id);
    toast({ title: "Product archived", description: name });
  }

  return (
    <div>
      <SellerPageHeader
        eyebrow="Catalog"
        title="Products"
        description="Keep the Clay & Co. collection accurate, in stock, and ready for discovery."
        action={
          <Button asChild>
            <Link href="/seller/products/new">
              <Plus aria-hidden="true" />
              Add product
            </Link>
          </Button>
        }
      />
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex min-h-11 max-w-md flex-1 items-center gap-3 rounded-md border bg-surface px-3.5 focus-within:border-walnut focus-within:ring-2 focus-within:ring-walnut/10">
          <Search aria-hidden="true" className="size-4 text-muted-foreground" />
          <span className="sr-only">Search products</span>
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            type="search"
            placeholder="Search your catalog…"
            className="min-w-0 flex-1 bg-transparent text-sm outline-none"
          />
        </label>
        <p className="text-xs text-muted-foreground">
          <strong className="text-foreground">{filtered.length}</strong>{" "}
          products · local demo inventory
        </p>
      </div>

      {!hydrated ? (
        <div className="mt-6 grid gap-3">
          {Array.from({ length: 4 }, (_, index) => (
            <Skeleton key={index} className="h-24" />
          ))}
        </div>
      ) : filtered.length ? (
        <div className="seller-data-table mt-6 overflow-hidden rounded-lg border bg-surface">
          <div className="hidden grid-cols-[minmax(18rem,1fr)_8rem_7rem_7rem_6rem] gap-4 border-b bg-muted/55 px-5 py-3 text-[0.6875rem] font-semibold uppercase tracking-[0.12em] text-muted-foreground xl:grid">
            <span>Product</span>
            <span>Price</span>
            <span>Stock</span>
            <span>Status</span>
            <span className="text-right">Actions</span>
          </div>
          <div className="divide-y">
            {filtered.map((product) => (
              <article
                key={product.id}
                className="grid gap-4 px-4 py-4 xl:grid-cols-[minmax(18rem,1fr)_8rem_7rem_7rem_6rem] xl:items-center xl:px-5"
              >
                <div className="flex min-w-0 items-center gap-4">
                  <div className="relative size-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                    <Image
                      src={product.images[0]}
                      alt=""
                      fill
                      sizes="64px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {product.name}
                    </p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {product.variants.length
                        ? `${product.variants.length} variants`
                        : "Single item"}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4 xl:block">
                  <span className="text-xs text-muted-foreground xl:hidden">
                    Price
                  </span>
                  <span className="text-sm font-semibold">
                    {formatMoney(product.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 xl:block">
                  <span className="text-xs text-muted-foreground xl:hidden">
                    Stock
                  </span>
                  <span className="text-sm font-medium">
                    {getProductStock(product)}
                  </span>
                </div>
                <div className="flex items-center justify-between gap-4 xl:block">
                  <span className="text-xs text-muted-foreground xl:hidden">
                    Status
                  </span>
                  <ProductStatusBadge
                    status={
                      product.adminSuspended ? "suspended" : product.status
                    }
                  />
                </div>
                <div className="flex justify-end gap-1">
                  <Button
                    asChild
                    size="icon"
                    variant="ghost"
                    aria-label={`Edit ${product.name}`}
                  >
                    <Link href={`/seller/products/${product.id}`}>
                      <Edit3 aria-hidden="true" />
                    </Link>
                  </Button>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => archive(product.id, product.name)}
                    disabled={product.status === "archived"}
                    aria-label={`Archive ${product.name}`}
                  >
                    <Archive aria-hidden="true" />
                  </Button>
                </div>
              </article>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-6">
          <EmptyState
            icon={PackageOpen}
            title="No products found"
            description="Try another search or add a new Clay & Co. piece."
            action={
              <Button asChild>
                <Link href="/seller/products/new">
                  <Plus aria-hidden="true" />
                  Add product
                </Link>
              </Button>
            }
          />
        </div>
      )}
    </div>
  );
}
