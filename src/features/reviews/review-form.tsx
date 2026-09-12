"use client";

import { Star } from "lucide-react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { useMarketplaceStore } from "@/store/marketplace-store";
import type { Review } from "@/types/marketplace";

export function ReviewForm({
  orderId,
  productId,
  lineId,
  productName,
}: {
  orderId: string;
  productId: string;
  lineId: string;
  productName: string;
}) {
  const addReview = useMarketplaceStore((state) => state.addReview);
  const { toast } = useToast();
  const [rating, setRating] = useState<Review["rating"]>(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState("");

  function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (title.trim().length < 3 || body.trim().length < 8) {
      setError("Add a short title and at least a few words about the piece.");
      return;
    }
    const id = addReview({
      orderId,
      productId,
      rating,
      title: title.trim(),
      body: body.trim(),
    });
    if (!id) {
      setError(
        "This delivered item has already been reviewed or is no longer eligible.",
      );
      return;
    }
    toast({
      title: "Review added",
      description: `${productName} now reflects your rating.`,
    });
  }

  return (
    <form
      onSubmit={submit}
      className="mt-4 rounded-md border bg-canvas p-4"
      aria-label={`Review ${productName}`}
    >
      <fieldset>
        <legend className="text-sm font-semibold">Your rating</legend>
        <div className="mt-2 flex gap-1">
          {([1, 2, 3, 4, 5] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              className="grid size-11 cursor-pointer place-items-center rounded-full hover:bg-muted"
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              aria-pressed={rating === value}
            >
              <Star
                aria-hidden="true"
                className={cn(
                  "size-5 text-gold",
                  value <= rating && "fill-gold",
                )}
              />
            </button>
          ))}
        </div>
      </fieldset>
      <div className="mt-4 grid gap-4">
        <Input
          id={`review-title-${productId}-${lineId}`}
          label="Review title"
          value={title}
          onChange={(event) => {
            setTitle(event.target.value);
            setError("");
          }}
          maxLength={60}
          placeholder="What stood out?"
        />
        <label
          className="grid gap-2 text-sm font-medium"
          htmlFor={`review-body-${productId}-${lineId}`}
        >
          Short review
          <textarea
            id={`review-body-${productId}-${lineId}`}
            value={body}
            onChange={(event) => {
              setBody(event.target.value);
              setError("");
            }}
            maxLength={280}
            rows={4}
            className="w-full resize-y rounded-md border bg-surface px-3.5 py-3 text-sm leading-6 outline-none transition-colors placeholder:text-muted-foreground/70 focus:border-walnut focus:ring-2 focus:ring-walnut/15"
            placeholder="Share a few fictional-demo thoughts…"
          />
        </label>
      </div>
      {error ? (
        <p role="alert" className="mt-3 text-xs font-medium text-danger">
          {error}
        </p>
      ) : null}
      <Button type="submit" className="mt-5 w-full sm:w-auto">
        Publish demo review
      </Button>
    </form>
  );
}
