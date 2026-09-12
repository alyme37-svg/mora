"use client";

import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useMemo } from "react";

import { PageContainer } from "@/components/layout/page-container";
import { CreatorCard } from "@/components/marketplace/creator-card";
import { ProductCard } from "@/components/marketplace/product-card";
import { SectionHeading } from "@/components/marketplace/section-heading";
import { Button } from "@/components/ui/button";
import { homeVisuals, sellerPresentation } from "@/data/presentation";
import { useHydrated } from "@/hooks/use-hydrated";
import {
  buildCatalog,
  getRatingSummary,
  getSellerReviews,
} from "@/lib/catalog";
import { useMarketplaceStore } from "@/store/marketplace-store";
import type { MarketplaceSeed } from "@/types/marketplace";

export function HomeMarketplaceSections({
  initial,
}: {
  initial: Pick<MarketplaceSeed, "products" | "sellers" | "reviews">;
}) {
  const hydrated = useHydrated();
  const persistedProducts = useMarketplaceStore((state) => state.products);
  const persistedSellers = useMarketplaceStore((state) => state.sellers);
  const persistedReviews = useMarketplaceStore((state) => state.reviews);
  const products = hydrated ? persistedProducts : initial.products;
  const sellers = hydrated ? persistedSellers : initial.sellers;
  const reviews = hydrated ? persistedReviews : initial.reviews;
  const catalog = useMemo(
    () => buildCatalog(products, sellers, reviews),
    [products, reviews, sellers],
  );
  const featured = catalog
    .filter(({ product }) => product.featured)
    .slice(0, 6);
  const trending = catalog
    .filter(({ product }) => !product.featured)
    .slice(0, 4);
  const featuredSellers = sellers
    .filter((seller) => seller.status === "active")
    .slice(0, 3);
  const maker = sellers.find(
    (seller) => seller.id === "seller_clay-co" && seller.status === "active",
  );

  return (
    <>
      <PageContainer className="pb-16 sm:pb-20">
        <SectionHeading
          eyebrow="Editor's selection"
          title="Featured products"
          description="A small edit of useful forms, natural materials, and quiet details."
          href="/shop?sort=featured"
        />
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:grid-cols-3 sm:gap-x-5 lg:grid-cols-6">
          {featured.map((item, index) => (
            <ProductCard key={item.product.id} {...item} priority={index < 2} />
          ))}
        </div>
      </PageContainer>

      {maker ? (
        <PageContainer className="pb-16 sm:pb-20">
          <section className="relative min-h-[27rem] overflow-hidden rounded-lg bg-foreground text-surface">
            <Image
              src={maker.settings.coverImageUrl ?? homeVisuals.maker}
              alt={`Inside ${maker.settings.displayName}'s studio`}
              fill
              sizes="100vw"
              className="object-cover opacity-55"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-foreground/90 via-foreground/55 to-transparent" />
            <div className="relative flex min-h-[27rem] max-w-xl flex-col justify-center px-7 py-12 sm:px-12 lg:px-16">
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-gold">
                Maker story · {maker.settings.displayName}
              </p>
              <h2 className="mt-4 font-serif text-5xl font-semibold leading-[0.9] tracking-[-0.035em] sm:text-6xl">
                Meet the hands behind the objects.
              </h2>
              <p className="mt-5 max-w-md text-sm leading-6 text-surface/78">
                {maker.settings.story}
              </p>
              <Button
                asChild
                variant="secondary"
                className="mt-7 w-fit border-surface/30 bg-surface/10 text-surface hover:border-surface/60 hover:bg-surface/15"
              >
                <Link href={`/stores/${maker.slug}`}>
                  Read their story <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </section>
        </PageContainer>
      ) : null}

      <PageContainer className="pb-16 sm:pb-20">
        <SectionHeading
          eyebrow="Right now"
          title="Trending this week"
          href="/shop?sort=top-rated"
        />
        <div className="grid grid-cols-2 gap-x-3 gap-y-10 sm:gap-x-5 lg:grid-cols-4">
          {trending.map((item) => (
            <ProductCard key={item.product.id} {...item} />
          ))}
        </div>
      </PageContainer>

      <PageContainer id="creators" className="scroll-mt-8 pb-4">
        <SectionHeading
          eyebrow="The people behind the pieces"
          title="Featured creators"
          description="Independent studios with a material point of view and a story worth entering."
        />
        <div className="grid gap-4 lg:grid-cols-3">
          {featuredSellers.map((seller) => {
            const sellerReviews = getSellerReviews(
              products,
              reviews,
              seller.id,
            );
            const rating = getRatingSummary(sellerReviews);
            return (
              <CreatorCard
                key={seller.id}
                seller={seller}
                presentation={{
                  ...sellerPresentation[seller.id],
                  coverUrl:
                    seller.settings.coverImageUrl ??
                    sellerPresentation[seller.id].coverUrl,
                  portraitUrl:
                    seller.settings.logoImageUrl ??
                    sellerPresentation[seller.id].portraitUrl,
                }}
                rating={rating.average}
                reviewCount={rating.count}
              />
            );
          })}
        </div>
      </PageContainer>
    </>
  );
}
