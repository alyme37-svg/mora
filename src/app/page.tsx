import {
  ArrowRight,
  BadgeCheck,
  HeartHandshake,
  Leaf,
  LockKeyhole,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { PageContainer } from "@/components/layout/page-container";
import { SectionHeading } from "@/components/marketplace/section-heading";
import { Button } from "@/components/ui/button";
import { categoryVisuals, homeVisuals } from "@/data/presentation";
import { createMarketplaceSeed } from "@/data/seed";
import { HomeMarketplaceSections } from "@/features/discovery/home-marketplace-sections";

const benefits = [
  {
    icon: HeartHandshake,
    title: "Independent creators",
    copy: "Real people. Real stories.",
  },
  {
    icon: LockKeyhole,
    title: "Secure checkout",
    copy: "A confident demo journey.",
  },
  { icon: Leaf, title: "Thoughtful choices", copy: "Products made with care." },
  {
    icon: BadgeCheck,
    title: "Considered curation",
    copy: "Fewer, better finds.",
  },
];

export default function MarketplaceHomePage() {
  const seed = createMarketplaceSeed();

  return (
    <>
      <section className="relative min-h-[31rem] overflow-hidden border-b bg-surface sm:min-h-[34rem] lg:min-h-[35rem]">
          <Image
            src={homeVisuals.hero}
            alt="Handmade ceramics, a candle, and art books in a warm maker-inspired interior"
            fill
            loading="eager"
            sizes="100vw"
            className="object-cover object-[68%_center] sm:object-[62%_center]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,253,249,0.97)_0%,rgba(255,253,249,0.9)_62%,rgba(255,253,249,0.58)_100%)] sm:bg-[linear-gradient(90deg,rgba(255,253,249,0.98)_0%,rgba(255,253,249,0.91)_37%,rgba(255,253,249,0.18)_72%,rgba(40,31,25,0.08)_100%)]" />
          <PageContainer className="relative flex min-h-[31rem] flex-col justify-center py-10 sm:min-h-[34rem] sm:py-12 lg:min-h-[35rem]">
            <div className="max-w-[48rem]">
            <p className="mb-5 text-[0.6875rem] font-semibold uppercase tracking-[0.2em] text-caramel">
              Independent makers · thoughtful objects
            </p>
            <h1 className="max-w-[11ch] text-balance font-serif text-[3.25rem] font-semibold leading-[0.9] tracking-[-0.055em] sm:text-[5rem] sm:leading-[0.86] lg:text-[5.6rem]">
              Small brands.
              <br />
              <span className="text-walnut sm:whitespace-nowrap">
                Bigger stories.
              </span>
            </h1>
            <p className="mt-7 max-w-md text-pretty text-base leading-7 text-muted-foreground">
              Discover thoughtful products from independent creators and
              emerging brands.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link href="/shop">
                  Shop now <ArrowRight aria-hidden="true" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link href="#creators">Explore creators</Link>
              </Button>
            </div>
            <div className="mt-9 flex items-center gap-3 text-xs text-muted-foreground">
              <span className="h-px w-8 bg-gold" aria-hidden="true" />
              <span>A marketplace for real craft and fictional commerce.</span>
            </div>
            </div>
          </PageContainer>
          <Link
            href="/stores/clay-and-co"
            className="absolute bottom-5 right-5 hidden min-h-11 items-center gap-3 rounded-md border border-white/25 bg-foreground/76 px-4 text-xs font-semibold text-surface transition-colors hover:bg-foreground/88 sm:inline-flex"
          >
            Meet the makers <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
      </section>
      <section className="border-b bg-surface" aria-label="Marketplace benefits">
        <PageContainer className="grid grid-cols-2 lg:grid-cols-4">
          {benefits.map(({ icon: Icon, title, copy }, index) => (
            <div
              key={title}
              className={`flex gap-3 px-3 py-4 sm:px-4 sm:py-5 ${index > 1 ? "border-t lg:border-t-0" : ""} ${index % 2 === 1 ? "border-l" : ""} ${index === 2 ? "lg:border-l" : ""}`}
            >
              <span className="grid size-9 shrink-0 place-items-center rounded-full bg-muted text-walnut">
                <Icon aria-hidden="true" className="size-4" />
              </span>
              <div>
                <p className="text-xs font-semibold">{title}</p>
                <p className="mt-0.5 text-[0.6875rem] leading-4 text-muted-foreground">
                  {copy}
                </p>
              </div>
            </div>
          ))}
        </PageContainer>
      </section>

      <PageContainer className="py-10 sm:py-12">
        <SectionHeading
          title="Shop by category"
          description="Find your way in through material, ritual, and everyday use."
          href="/shop"
        />
        <div
          id="categories"
          className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5"
        >
          {seed.categories.map((category) => (
            <Link
              key={category.id}
              href={`/shop?category=${category.slug}`}
              className="group overflow-hidden rounded-lg border bg-surface"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                <Image
                  src={categoryVisuals[category.slug]}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                />
              </div>
              <div className="flex min-h-14 items-center justify-between gap-2 px-4 text-sm font-semibold">
                <span>{category.name}</span>
                <ArrowRight
                  aria-hidden="true"
                  className="size-4 shrink-0 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                />
              </div>
            </Link>
          ))}
        </div>
      </PageContainer>

      <HomeMarketplaceSections
        initial={{
          products: seed.products,
          sellers: seed.sellers,
          reviews: seed.reviews,
        }}
      />
    </>
  );
}
