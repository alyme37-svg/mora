"use client";

import Image from "next/image";
import { BadgeCheck, Camera, MessageCircle, ThumbsUp } from "lucide-react";
import { useMemo, useState } from "react";

import { Rating } from "@/components/marketplace/rating";
import { Skeleton } from "@/components/ui/skeleton";
import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { useMarketplaceStore } from "@/store/marketplace-store";

const shopperPresentation: Record<
  string,
  { avatar: string; helpful: number; location: string; customerPhoto?: string }
> = {
  user_sarah: {
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=160&q=82",
    helpful: 24,
    location: "Portland, OR",
    customerPhoto: "/images/mora/ceramic-mug-lifestyle.webp",
  },
  user_maya: {
    avatar:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=82",
    helpful: 18,
    location: "Brooklyn, NY",
    customerPhoto: "/images/mora/ceramic-mug-detail.webp",
  },
  user_jules: {
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=160&q=82",
    helpful: 11,
    location: "Austin, TX",
  },
};

function RatingSummary({ ratings }: { ratings: number[] }) {
  const average =
    ratings.reduce((sum, rating) => sum + rating, 0) / ratings.length;
  return (
    <aside className="self-start lg:sticky lg:top-28">
      <p className="font-serif text-[4.5rem] font-semibold leading-none tracking-[-0.06em]">
        {average.toFixed(1)}
      </p>
      <Rating value={average} count={ratings.length} className="mt-3" />
      <p className="mt-3 max-w-52 text-sm leading-6 text-muted-foreground">
        Loved for its tactile glaze, balanced shape, and everyday usefulness.
      </p>
      <div className="mt-7 space-y-2.5" aria-label="Rating distribution">
        {[5, 4, 3, 2, 1].map((star) => {
          const count = ratings.filter((rating) => rating === star).length;
          const percentage = (count / ratings.length) * 100;
          return (
            <div
              key={star}
              className="grid grid-cols-[12px_1fr_20px] items-center gap-2 text-xs"
            >
              <span>{star}</span>
              <span className="h-1 overflow-hidden rounded-full bg-border">
                <span
                  className="block h-full rounded-full bg-gold"
                  style={{ width: `${percentage}%` }}
                />
              </span>
              <span className="text-right text-muted-foreground">{count}</span>
            </div>
          );
        })}
      </div>
    </aside>
  );
}

export function ReviewCollection({
  productId,
  sellerId,
  limit,
}: {
  productId?: string;
  sellerId?: string;
  limit?: number;
}) {
  const hydrated = useHydrated();
  const reviews = useMarketplaceStore((state) => state.reviews);
  const products = useMarketplaceStore((state) => state.products);
  const users = useMarketplaceStore((state) => state.users);
  const [helpfulReviewIds, setHelpfulReviewIds] = useState<string[]>([]);
  const sellerProductIds = useMemo(
    () =>
      new Set(
        products
          .filter((product) => product.sellerId === sellerId)
          .map((product) => product.id),
      ),
    [products, sellerId],
  );
  const visible = reviews
    .filter((review) =>
      productId
        ? review.productId === productId
        : sellerProductIds.has(review.productId),
    )
    .slice(0, limit);
  const productById = new Map(products.map((product) => [product.id, product]));
  const userById = new Map(users.map((user) => [user.id, user]));

  if (!hydrated)
    return (
      <div className="grid gap-6 lg:grid-cols-[15rem_1fr]">
        <Skeleton className="h-64" />
        <Skeleton className="h-80" />
      </div>
    );
  if (!visible.length)
    return (
      <div className="rounded-lg border border-dashed bg-surface/60 px-6 py-10 text-center">
        <p className="font-serif text-2xl font-semibold">A new find on Mora</p>
        <p className="mt-2 text-sm text-muted-foreground">
          No delivered-order reviews for this piece yet.
        </p>
      </div>
    );

  return (
    <div className="grid gap-10 border-y border-border py-10 lg:grid-cols-[15rem_minmax(0,1fr)] lg:gap-16">
      <RatingSummary ratings={visible.map((review) => review.rating)} />
      <div>
        <div className="mb-1 flex items-center gap-2 text-sm font-medium">
          <MessageCircle aria-hidden="true" className="size-4 text-walnut" />
          What people are saying
        </div>
        {visible.map((review) => {
          const shopper = userById.get(review.shopperId);
          const presentation = shopperPresentation[review.shopperId];
          const isHelpful = helpfulReviewIds.includes(review.id);
          const helpfulCount =
            (presentation?.helpful ?? 7) + (isHelpful ? 1 : 0);
          return (
            <article
              key={review.id}
              className="grid gap-5 border-b border-border py-8 last:border-b-0 sm:grid-cols-[3rem_minmax(0,1fr)]"
            >
              <div className="relative size-12 overflow-hidden rounded-full bg-muted ring-2 ring-surface ring-offset-1 ring-offset-border">
                {presentation?.avatar ? (
                  <Image
                    src={presentation.avatar}
                    alt=""
                    fill
                    sizes="48px"
                    className="object-cover"
                  />
                ) : (
                  <span className="grid size-full place-items-center font-serif text-lg font-semibold">
                    {shopper?.name.charAt(0) ?? "M"}
                  </span>
                )}
              </div>
              <div className="min-w-0">
                <div className="flex flex-wrap items-start justify-between gap-x-5 gap-y-2">
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold">
                        {shopper?.name ?? "Mora shopper"}
                      </p>
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-sage">
                        <BadgeCheck aria-hidden="true" className="size-3.5" />{" "}
                        Verified demo order
                      </span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground">
                      {presentation?.location ?? "Mora community"}
                    </p>
                  </div>
                  <time className="text-xs text-muted-foreground">
                    {new Intl.DateTimeFormat("en", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                    }).format(new Date(review.createdAt))}
                  </time>
                </div>
                <Rating value={review.rating} compact className="mt-5" />
                <h3 className="mt-3 font-serif text-[1.7rem] font-semibold leading-tight">
                  “{review.title}”
                </h3>
                <p className="mt-3 max-w-2xl text-[0.9375rem] leading-7 text-muted-foreground">
                  {review.body}
                </p>
                {presentation?.customerPhoto ? (
                  <div className="mt-5 w-28">
                    <div className="relative aspect-square overflow-hidden rounded-lg bg-muted">
                      <Image
                        src={presentation.customerPhoto}
                        alt={`${shopper?.name ?? "A shopper"}'s photo of ${productById.get(review.productId)?.name ?? "the product"}`}
                        fill
                        sizes="112px"
                        className="object-cover transition-transform duration-500 hover:scale-[1.04]"
                      />
                    </div>
                    <p className="mt-2 flex items-center gap-1 text-[0.6875rem] font-medium text-muted-foreground">
                      <Camera aria-hidden="true" className="size-3" /> Customer
                      photo
                    </p>
                  </div>
                ) : null}
                <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
                  <p className="text-xs text-muted-foreground">
                    {sellerId
                      ? `Purchased ${productById.get(review.productId)?.name}`
                      : "Shared after delivery"}
                  </p>
                  <button
                    type="button"
                    aria-pressed={isHelpful}
                    onClick={() =>
                      setHelpfulReviewIds((current) =>
                        isHelpful
                          ? current.filter((id) => id !== review.id)
                          : [...current, review.id],
                      )
                    }
                    className={cn(
                      "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 text-xs font-medium transition-colors duration-200",
                      isHelpful
                        ? "border-walnut bg-walnut text-white"
                        : "border-border bg-surface hover:border-caramel hover:bg-muted/50",
                    )}
                  >
                    <ThumbsUp
                      aria-hidden="true"
                      className={cn("size-3.5", isHelpful && "fill-current")}
                    />
                    Helpful · {helpfulCount}
                  </button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
