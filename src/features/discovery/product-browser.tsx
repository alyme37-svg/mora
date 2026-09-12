"use client";

import { Search, SearchX, SlidersHorizontal } from "lucide-react";
import { useDeferredValue, useMemo, useState } from "react";

import {
  FilterPanel,
  type FilterState,
} from "@/features/discovery/filter-panel";
import { ProductCard } from "@/components/marketplace/product-card";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useHydrated } from "@/hooks/use-hydrated";
import { buildCatalog, type CatalogProduct } from "@/lib/catalog";
import { useMarketplaceStore } from "@/store/marketplace-store";
import type { Category, Seller } from "@/types/marketplace";

type SortOption =
  "featured" | "newest" | "top-rated" | "price-asc" | "price-desc";

const initialFilters: FilterState = {
  sellerIds: [],
  minPrice: "",
  maxPrice: "",
  minRating: 0,
};

export function ProductBrowser({
  catalog,
  categories,
  sellers,
  initialQuery = "",
  initialCategory = "",
  initialSort = "featured",
}: {
  catalog: CatalogProduct[];
  categories: Category[];
  sellers: Seller[];
  initialQuery?: string;
  initialCategory?: string;
  initialSort?: SortOption;
}) {
  const [query, setQuery] = useState(initialQuery);
  const deferredQuery = useDeferredValue(query);
  const [category, setCategory] = useState(initialCategory);
  const [sort, setSort] = useState<SortOption>(initialSort);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const hydrated = useHydrated();
  const persistedProducts = useMarketplaceStore((state) => state.products);
  const persistedSellers = useMarketplaceStore((state) => state.sellers);
  const persistedReviews = useMarketplaceStore((state) => state.reviews);
  const persistedCategories = useMarketplaceStore((state) => state.categories);
  const liveCatalog = useMemo(
    () =>
      hydrated
        ? buildCatalog(persistedProducts, persistedSellers, persistedReviews)
        : catalog,
    [catalog, hydrated, persistedProducts, persistedReviews, persistedSellers],
  );
  const liveSellers = hydrated ? persistedSellers : sellers;
  const liveCategories = hydrated ? persistedCategories : categories;

  const products = useMemo(() => {
    const normalizedQuery = deferredQuery.trim().toLowerCase();
    const minAmount = filters.minPrice ? Number(filters.minPrice) * 100 : 0;
    const maxAmount = filters.maxPrice
      ? Number(filters.maxPrice) * 100
      : Number.POSITIVE_INFINITY;

    return liveCatalog
      .filter(({ product, seller, rating, reviewCount }) => {
        const matchesQuery =
          !normalizedQuery ||
          `${product.name} ${product.description} ${seller.settings.displayName} ${product.materials.join(" ")}`
            .toLowerCase()
            .includes(normalizedQuery);
        const matchesCategory =
          !category || product.categoryId === `cat_${category}`;
        const matchesSeller =
          filters.sellerIds.length === 0 ||
          filters.sellerIds.includes(seller.id);
        const matchesPrice =
          product.price.amount >= minAmount &&
          product.price.amount <= maxAmount;
        const matchesRating =
          filters.minRating === 0 ||
          (reviewCount > 0 && rating >= filters.minRating);
        return (
          matchesQuery &&
          matchesCategory &&
          matchesSeller &&
          matchesPrice &&
          matchesRating
        );
      })
      .toSorted((left, right) => {
        if (sort === "newest")
          return right.product.createdAt.localeCompare(left.product.createdAt);
        if (sort === "top-rated")
          return (
            right.rating - left.rating || right.reviewCount - left.reviewCount
          );
        if (sort === "price-asc")
          return left.product.price.amount - right.product.price.amount;
        if (sort === "price-desc")
          return right.product.price.amount - left.product.price.amount;
        return Number(right.product.featured) - Number(left.product.featured);
      });
  }, [liveCatalog, category, deferredQuery, filters, sort]);

  function clearAll() {
    setQuery("");
    setCategory("");
    setFilters(initialFilters);
    setSort("featured");
  }

  return (
    <>
      <div
        id="categories"
        className="flex gap-2 overflow-x-auto border-y py-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        <button
          type="button"
          onClick={() => setCategory("")}
          aria-pressed={!category}
          className={`min-h-10 shrink-0 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors ${!category ? "border-foreground bg-foreground text-surface" : "bg-surface hover:border-caramel"}`}
        >
          All products
        </button>
        {liveCategories.map((item) => (
          <button
            key={item.id}
            type="button"
            onClick={() => setCategory(item.slug)}
            aria-pressed={category === item.slug}
            className={`min-h-10 shrink-0 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors ${category === item.slug ? "border-foreground bg-foreground text-surface" : "bg-surface hover:border-caramel"}`}
          >
            {item.name}
          </button>
        ))}
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-[15rem_minmax(0,1fr)]">
        <aside
          className="hidden border-r pr-6 lg:block"
          aria-label="Product filters"
        >
          <div className="sticky top-6">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl font-semibold">Filters</h2>
              <SlidersHorizontal
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
            </div>
            <FilterPanel
              value={filters}
              onChange={setFilters}
              sellers={liveSellers}
              idPrefix="desktop"
            />
          </div>
        </aside>

        <div className="min-w-0">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
            <label className="flex min-h-11 flex-1 items-center gap-3 rounded-md border bg-surface px-4 focus-within:border-walnut focus-within:ring-2 focus-within:ring-walnut/10">
              <Search
                aria-hidden="true"
                className="size-4 text-muted-foreground"
              />
              <span className="sr-only">Search the collection</span>
              <input
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Search the collection…"
                className="min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
              />
            </label>
            <div className="flex gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="secondary" className="flex-1 lg:hidden">
                    <SlidersHorizontal aria-hidden="true" />
                    Filters
                  </Button>
                </SheetTrigger>
                <SheetContent
                  title="Filter the collection"
                  description="Narrow products by price, creator, and rating."
                >
                  <FilterPanel
                    value={filters}
                    onChange={setFilters}
                    sellers={liveSellers}
                    idPrefix="mobile"
                  />
                  <SheetClose asChild>
                    <Button className="mt-7 w-full">
                      Show {products.length} products
                    </Button>
                  </SheetClose>
                </SheetContent>
              </Sheet>
              <label className="sr-only" htmlFor="sort-products">
                Sort products
              </label>
              <select
                id="sort-products"
                value={sort}
                onChange={(event) => setSort(event.target.value as SortOption)}
                className="min-h-11 cursor-pointer rounded-md border bg-surface px-3 text-sm font-medium outline-none focus:border-walnut focus:ring-2 focus:ring-walnut/10"
              >
                <option value="featured">Featured</option>
                <option value="newest">Newest</option>
                <option value="top-rated">Top rated</option>
                <option value="price-asc">Price low to high</option>
                <option value="price-desc">Price high to low</option>
              </select>
            </div>
          </div>

          <div className="mb-6 mt-5 flex items-center justify-between gap-4 text-sm">
            <p className="text-muted-foreground">
              <span className="font-semibold text-foreground">
                {products.length}
              </span>{" "}
              thoughtful finds
            </p>
            {category ? (
              <button
                type="button"
                onClick={() => setCategory("")}
                className="min-h-10 cursor-pointer text-xs font-semibold underline underline-offset-4"
              >
                Clear category
              </button>
            ) : null}
          </div>

          {products.length ? (
            <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 sm:gap-x-5 xl:grid-cols-4">
              {products.map((item, index) => (
                <ProductCard
                  key={item.product.id}
                  {...item}
                  priority={index < 4}
                />
              ))}
            </div>
          ) : (
            <EmptyState
              icon={SearchX}
              title="No pieces match those filters"
              description="Try a wider price range, another creator, or clear the current search."
              action={<Button onClick={clearAll}>Clear all filters</Button>}
            />
          )}
        </div>
      </div>
    </>
  );
}
