import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { createMarketplaceSeed } from "@/data/seed";
import { ProductBrowser } from "@/features/discovery/product-browser";
import { buildCatalog } from "@/lib/catalog";

export const metadata: Metadata = {
  title: "Shop independent design",
  description:
    "Browse curated home, fashion, beauty, art, and accessory collections on Mora.",
};

const validSorts = new Set([
  "featured",
  "newest",
  "top-rated",
  "price-asc",
  "price-desc",
]);

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{
    q?: string | string[];
    category?: string | string[];
    sort?: string | string[];
  }>;
}) {
  const params = await searchParams;
  const query = typeof params.q === "string" ? params.q : "";
  const requestedCategory =
    typeof params.category === "string" ? params.category : "";
  const requestedSort =
    typeof params.sort === "string" && validSorts.has(params.sort)
      ? params.sort
      : "featured";
  const seed = createMarketplaceSeed();
  const category = seed.categories.some(
    (item) => item.slug === requestedCategory,
  )
    ? requestedCategory
    : "";

  return (
    <PageContainer className="py-10 sm:py-14">
      <div className="max-w-3xl">
        <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-caramel">
          The marketplace collection
        </p>
        <h1 className="mt-3 text-balance font-serif text-5xl font-semibold leading-[0.9] tracking-[-0.035em] sm:text-6xl">
          Find the piece that stays with you.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
          Browse small-run objects, considered clothing, and everyday rituals
          from independent studios.
        </p>
      </div>
      <div className="mt-10">
        <ProductBrowser
          catalog={buildCatalog(seed.products, seed.sellers, seed.reviews)}
          categories={seed.categories}
          sellers={seed.sellers}
          initialQuery={query}
          initialCategory={category}
          initialSort={
            requestedSort as
              "featured" | "newest" | "top-rated" | "price-asc" | "price-desc"
          }
        />
      </div>
    </PageContainer>
  );
}
