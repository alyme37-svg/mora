import { ArrowUpRight, MapPin } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Rating } from "@/components/marketplace/rating";
import type { SellerPresentation } from "@/data/presentation";
import type { Seller } from "@/types/marketplace";

export function CreatorCard({
  seller,
  presentation,
  rating,
  reviewCount,
}: {
  seller: Seller;
  presentation: SellerPresentation;
  rating: number;
  reviewCount: number;
}) {
  return (
    <article className="group grid overflow-hidden rounded-lg border bg-surface sm:grid-cols-[8.5rem_1fr]">
      <Link
        href={`/stores/${seller.slug}`}
        className="relative min-h-52 overflow-hidden bg-muted sm:min-h-full"
        aria-label={`Visit ${seller.settings.displayName}`}
      >
        <Image
          src={presentation.coverUrl}
          alt={`${seller.settings.displayName} studio`}
          fill
          sizes="(max-width: 640px) 100vw, 18vw"
          className="object-cover transition-transform duration-500 group-hover:scale-[1.025] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
        />
      </Link>
      <div className="flex min-w-0 flex-col p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.16em] text-caramel">
              Independent studio
            </p>
            <h3 className="mt-1 font-serif text-2xl font-semibold leading-none">
              {seller.settings.displayName}
            </h3>
          </div>
          <Link
            href={`/stores/${seller.slug}`}
            className="grid size-11 shrink-0 place-items-center rounded-full border text-foreground transition-colors hover:border-caramel hover:bg-muted"
            aria-label={`Visit ${seller.settings.displayName}`}
          >
            <ArrowUpRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          {seller.settings.tagline}
        </p>
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-5 text-xs text-muted-foreground">
          <span className="inline-flex items-center gap-1.5">
            <MapPin aria-hidden="true" className="size-3.5" />
            {seller.location}
          </span>
          <Rating value={rating} count={reviewCount} />
        </div>
      </div>
    </article>
  );
}
