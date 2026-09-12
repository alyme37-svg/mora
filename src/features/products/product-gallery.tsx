"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

import { cn } from "@/lib/utils";

export function ProductGallery({
  images,
  productName,
}: {
  images: string[];
  productName: string;
}) {
  const credibleImages = images.filter((image, index) => {
    const canonical = image
      .replace(/([?&])(crop=(left|right)|sat=-12)(&|$)/g, "$1")
      .replace(/[?&]$/, "");
    return (
      images.findIndex(
        (candidate) =>
          candidate
            .replace(/([?&])(crop=(left|right)|sat=-12)(&|$)/g, "$1")
            .replace(/[?&]$/, "") === canonical,
      ) === index
    );
  });
  const [activeIndex, setActiveIndex] = useState(0);
  const lastIndex = credibleImages.length - 1;
  const safeActiveIndex = Math.min(activeIndex, lastIndex);

  function move(direction: -1 | 1) {
    setActiveIndex(
      (current) =>
        (current + direction + credibleImages.length) % credibleImages.length,
    );
  }

  return (
    <div
      className={cn(
        "grid gap-3",
        credibleImages.length > 1 && "sm:grid-cols-[5rem_minmax(0,1fr)]",
      )}
    >
      {credibleImages.length > 1 ? (
        <div
          className="order-2 flex gap-2 overflow-x-auto sm:order-1 sm:flex-col"
          aria-label="Product images"
        >
          {credibleImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              aria-label={`Show image ${index + 1} of ${credibleImages.length}`}
              aria-pressed={activeIndex === index}
              className={cn(
                "relative aspect-square size-16 shrink-0 cursor-pointer overflow-hidden rounded-md border bg-muted transition-colors sm:size-20",
                activeIndex === index
                  ? "border-walnut ring-1 ring-walnut"
                  : "hover:border-caramel",
              )}
            >
              <Image
                src={image}
                alt=""
                fill
                sizes="80px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      ) : null}
      <div className="group/main relative order-1 aspect-[4/5] cursor-zoom-in overflow-hidden rounded-lg border bg-muted sm:order-2">
        <Image
          key={credibleImages[safeActiveIndex]}
          src={credibleImages[safeActiveIndex]}
          alt={`${productName}, view ${safeActiveIndex + 1}`}
          fill
          loading="eager"
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-cover transition-transform duration-500 ease-out group-hover/main:scale-[1.045] motion-reduce:transition-none motion-reduce:group-hover/main:scale-100"
        />
        {credibleImages.length > 1 ? (
          <div className="absolute inset-x-3 bottom-3 flex justify-between">
            <button
              type="button"
              onClick={() => move(-1)}
              className="grid size-11 cursor-pointer place-items-center rounded-full border border-white/70 bg-surface/92 text-foreground shadow-soft hover:bg-surface"
              aria-label="Previous image"
            >
              <ChevronLeft aria-hidden="true" className="size-5" />
            </button>
            <span className="self-center rounded-full bg-foreground/70 px-3 py-1 text-[0.6875rem] font-semibold text-surface">
              {safeActiveIndex + 1} / {lastIndex + 1}
            </span>
            <button
              type="button"
              onClick={() => move(1)}
              className="grid size-11 cursor-pointer place-items-center rounded-full border border-white/70 bg-surface/92 text-foreground shadow-soft hover:bg-surface"
              aria-label="Next image"
            >
              <ChevronRight aria-hidden="true" className="size-5" />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
}
