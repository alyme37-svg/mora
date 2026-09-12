"use client";

import { MapPin, Quote, Sparkles, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/marketplace/section-heading";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import type { SellerPresentation } from "@/data/presentation";
import { FollowSellerButton } from "@/features/sellers/follow-seller-button";
import { StorefrontProducts } from "@/features/sellers/storefront-products";
import { LiveMarketplaceRating } from "@/features/reviews/live-marketplace-rating";
import { ReviewCollection } from "@/features/reviews/review-collection";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  getRatingSummary,
  getSellerReviews,
  type CatalogProduct,
} from "@/lib/catalog";
import { useMarketplaceStore } from "@/store/marketplace-store";
import type { Seller } from "@/types/marketplace";

export function PersistedStorefront({
  initialSeller,
  presentation,
  initialCatalog,
  initialRating,
}: {
  initialSeller: Seller;
  presentation: SellerPresentation;
  initialCatalog: CatalogProduct[];
  initialRating: { average: number; count: number };
}) {
  const hydrated = useHydrated();
  const persistedSellers = useMarketplaceStore((state) => state.sellers);
  const products = useMarketplaceStore((state) => state.products);
  const reviews = useMarketplaceStore((state) => state.reviews);
  const seller = hydrated
    ? persistedSellers.find((item) => item.id === initialSeller.id)
    : initialSeller;

  if (!seller || seller.status !== "active") {
    return (
      <PageContainer className="py-20">
        <EmptyState
          icon={Store}
          title="This fictional storefront is paused"
          description="Its public profile and listings are unavailable while the seller is suspended in the Mora demo."
          action={
            <Button asChild>
              <Link href="/shop">Browse active creators</Link>
            </Button>
          }
        />
      </PageContainer>
    );
  }

  const sellerReviews = getSellerReviews(products, reviews, seller.id);
  const rating = hydrated ? getRatingSummary(sellerReviews) : initialRating;
  const cover = seller.settings.coverImageUrl ?? presentation.coverUrl;
  const portrait = seller.settings.logoImageUrl ?? presentation.portraitUrl;

  return (
    <>
      <PageContainer className="pt-4 sm:pt-6">
        <section className="relative min-h-[29rem] overflow-hidden rounded-lg border bg-foreground text-surface shadow-soft">
          <Image
            src={cover}
            alt={`${seller.settings.displayName} studio and process`}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-foreground/95 via-foreground/25 to-transparent" />
          <div className="relative flex min-h-[29rem] items-end px-6 py-8 sm:px-10 sm:py-10 lg:px-14">
            <div className="grid w-full items-end gap-6 lg:grid-cols-[1fr_auto]">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-end">
                <div className="relative size-24 shrink-0 overflow-hidden rounded-full border-2 border-surface bg-muted shadow-soft sm:size-28">
                  <Image
                    src={portrait}
                    alt={`${seller.settings.displayName} mark`}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                </div>
                <div>
                  <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold">
                    Independent creator
                  </p>
                  <h1 className="mt-2 font-serif text-5xl font-semibold leading-none tracking-[-0.035em] sm:text-6xl">
                    {seller.settings.displayName}
                  </h1>
                  <p className="mt-3 max-w-xl text-sm leading-6 text-surface/78">
                    {seller.settings.tagline}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center gap-4 text-xs text-surface/75">
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin aria-hidden="true" className="size-3.5" />
                      {seller.location}
                    </span>
                    <LiveMarketplaceRating
                      sellerId={seller.id}
                      initialValue={rating.average}
                      initialCount={rating.count}
                      className="text-surface/75 [&_span]:text-surface"
                    />
                  </div>
                </div>
              </div>
              <div className="rounded-md border border-surface/20 bg-foreground/45 p-4">
                <FollowSellerButton
                  sellerId={seller.id}
                  sellerName={seller.settings.displayName}
                  baseFollowers={presentation.followerCount}
                />
              </div>
            </div>
          </div>
        </section>
      </PageContainer>
      <PageContainer className="py-16 sm:py-20">
        <div className="grid gap-10 border-b pb-16 lg:grid-cols-[0.7fr_1.3fr] lg:gap-20">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-caramel">
              Their story
            </p>
            <h2 className="mt-3 font-serif text-4xl font-semibold leading-[0.95] sm:text-5xl">
              Made with a slower sense of time.
            </h2>
          </div>
          <div>
            <Quote aria-hidden="true" className="size-8 text-gold" />
            <p className="mt-5 max-w-2xl font-serif text-2xl font-medium leading-8 text-walnut sm:text-3xl sm:leading-10">
              “{seller.settings.story}”
            </p>
            <p className="mt-6 text-sm text-muted-foreground">
              {presentation.foundedLabel} · {seller.location}
            </p>
            <div className="mt-5 flex flex-wrap gap-2">
              {presentation.specialties.map((item) => (
                <span
                  key={item}
                  className="rounded-full border bg-surface px-3 py-1.5 text-xs font-medium text-muted-foreground"
                >
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </PageContainer>
      <StorefrontProducts
        initialSeller={initialSeller}
        initialCatalog={initialCatalog}
      />
      <PageContainer className="pb-16 sm:pb-20">
        <SectionHeading
          eyebrow="Shopper notes"
          title="Reviews of this creator"
          description="Reviews tied to delivered fictional orders."
        />
        <ReviewCollection sellerId={seller.id} limit={3} />
      </PageContainer>
      <PageContainer className="pb-4">
        <section className="grid gap-8 rounded-lg border bg-surface p-7 sm:p-10 lg:grid-cols-[auto_1fr] lg:items-center lg:gap-10">
          <span className="grid size-14 place-items-center rounded-full bg-muted text-walnut">
            <Sparkles aria-hidden="true" className="size-5" />
          </span>
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-caramel">
              Store policies
            </p>
            <h2 className="mt-2 font-serif text-3xl font-semibold">
              Made clear before you order.
            </h2>
            <p className="mt-3 max-w-3xl text-sm leading-6 text-muted-foreground">
              {seller.settings.policies ??
                (seller.settings.acceptsReturns
                  ? "Unused pieces may be returned within 14 days of delivery in this fictional demo."
                  : "This fictional shop does not accept returns.")}
            </p>
            {seller.settings.storefrontStatus === "away" ? (
              <p className="mt-4 font-medium text-danger">
                This store is temporarily away and is not accepting new orders.
              </p>
            ) : null}
          </div>
        </section>
      </PageContainer>
    </>
  );
}
