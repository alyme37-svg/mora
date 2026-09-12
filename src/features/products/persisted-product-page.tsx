"use client";

import { ArrowLeft, ArrowRight } from "lucide-react";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { ProductCard } from "@/components/marketplace/product-card";
import { SectionHeading } from "@/components/marketplace/section-heading";
import { SellerBadge } from "@/components/marketplace/seller-badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ProductDetails } from "@/features/products/product-details";
import { ProductGallery } from "@/features/products/product-gallery";
import { ProductPurchase } from "@/features/products/product-purchase";
import { LiveMarketplaceRating } from "@/features/reviews/live-marketplace-rating";
import { ReviewCollection } from "@/features/reviews/review-collection";
import { useHydrated } from "@/hooks/use-hydrated";
import { buildCatalog, getRatingSummary } from "@/lib/catalog";
import { useMarketplaceStore } from "@/store/marketplace-store";
import { isProductAdminSuspended } from "@/store/marketplace-guards";

export function PersistedProductPage({ slug }: { slug: string }) {
  const hydrated = useHydrated();
  const products = useMarketplaceStore((state) => state.products);
  const sellers = useMarketplaceStore((state) => state.sellers);
  const reviews = useMarketplaceStore((state) => state.reviews);
  const categories = useMarketplaceStore((state) => state.categories);
  const product = products.find(
    (item) =>
      item.slug === slug &&
      item.status === "active" &&
      !isProductAdminSuspended(item),
  );
  const seller = sellers.find(
    (item) => item.id === product?.sellerId && item.status === "active",
  );

  if (!hydrated)
    return (
      <PageContainer className="grid gap-8 py-10 lg:grid-cols-2">
        <Skeleton className="aspect-[4/5]" />
        <Skeleton className="h-[32rem]" />
      </PageContainer>
    );
  if (!product || !seller)
    return (
      <PageContainer className="py-20">
        <div className="rounded-lg border bg-surface p-8 text-center">
          <h1 className="font-serif text-4xl font-semibold">
            This piece is not available.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            It may still be a draft or has been archived by its maker.
          </p>
          <Button asChild className="mt-6">
            <Link href="/shop">
              <ArrowLeft aria-hidden="true" />
              Back to shop
            </Link>
          </Button>
        </div>
      </PageContainer>
    );
  const rating = getRatingSummary(reviews, product.id);
  const related = buildCatalog(products, sellers, reviews)
    .filter(
      (item) =>
        item.product.categoryId === product.categoryId &&
        item.product.id !== product.id,
    )
    .slice(0, 4);

  return (
    <>
      <PageContainer className="max-w-[84rem] py-6 sm:py-8">
        <nav
          className="mb-6 flex flex-wrap items-center gap-2 text-xs text-muted-foreground"
          aria-label="Breadcrumb"
        >
          <Link href="/shop" className="hover:underline">
            Shop
          </Link>
          <span aria-hidden="true">/</span>
          <span>
            {
              categories.find((category) => category.id === product.categoryId)
                ?.name
            }
          </span>
          <span aria-hidden="true">/</span>
          <span className="text-foreground">{product.name}</span>
        </nav>
        <div className="grid gap-9 lg:grid-cols-[0.94fr_1.06fr] lg:gap-12">
          <ProductGallery images={product.images} productName={product.name} />
          <div className="lg:sticky lg:top-5 lg:self-start lg:pt-1">
            <div className="flex items-center justify-between gap-4">
              <Link href={`/stores/${seller.slug}`}>
                <SellerBadge seller={seller} />
              </Link>
              <Link
                href={`/stores/${seller.slug}`}
                className="inline-flex min-h-10 items-center gap-1 text-xs font-semibold"
              >
                View shop <ArrowRight aria-hidden="true" className="size-3.5" />
              </Link>
            </div>
            <h1 className="mt-6 max-w-[17ch] text-balance font-serif text-[2.8rem] font-semibold leading-[0.94] tracking-[-0.035em] sm:text-[3.4rem]">
              {product.name}
            </h1>
            <div className="mt-5">
              <LiveMarketplaceRating
                productId={product.id}
                initialValue={rating.average}
                initialCount={rating.count}
              />
            </div>
            <p className="mt-5 text-sm leading-6 text-muted-foreground">
              {product.description}
            </p>
            <div className="mt-7">
              <ProductPurchase product={product} />
            </div>
            <ProductDetails product={product} seller={seller} />
          </div>
        </div>
      </PageContainer>
      <PageContainer className="py-16">
        <SectionHeading
          eyebrow="From shoppers"
          title={`Reviews${rating.count ? ` (${rating.count})` : ""}`}
        />
        <ReviewCollection productId={product.id} />
      </PageContainer>
      {related.length ? (
        <PageContainer>
          <SectionHeading title="You may also like" href="/shop" />
          <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.product.id} {...item} />
            ))}
          </div>
        </PageContainer>
      ) : null}
    </>
  );
}
