import { ChevronDown } from "lucide-react";

import type { Product, Seller } from "@/types/marketplace";

export function ProductDetails({
  product,
  seller,
}: {
  product: Product;
  seller: Seller;
}) {
  return (
    <div className="mt-7 border-t">
      <details className="group border-b" open>
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
          Product details
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="pb-6 text-sm leading-6 text-muted-foreground">
          <p>{product.description}</p>
          <dl className="mt-4 grid grid-cols-[6rem_1fr] gap-x-4 gap-y-2">
            <dt className="font-medium text-foreground">Materials</dt>
            <dd className="capitalize">{product.materials.join(", ")}</dd>
            <dt className="font-medium text-foreground">Made by</dt>
            <dd>{seller.settings.displayName}</dd>
            <dt className="font-medium text-foreground">Origin</dt>
            <dd>{seller.location}</dd>
          </dl>
        </div>
      </details>
      <details className="group border-b">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
          Shipping & returns
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="pb-6 text-sm leading-6 text-muted-foreground">
          <p>
            Prepared by {seller.settings.displayName} in approximately{" "}
            {seller.settings.processingDays} business days. Tracking updates
            appear in the shopper demo after dispatch.
          </p>
          <p className="mt-3">
            {seller.settings.policies ??
              (seller.settings.acceptsReturns
                ? "This fictional shop accepts returns within 14 days of delivery."
                : "This fictional made-to-order shop does not accept returns.")}
          </p>
        </div>
      </details>
      <details className="group border-b">
        <summary className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 text-sm font-semibold">
          Care notes
          <ChevronDown
            aria-hidden="true"
            className="size-4 transition-transform group-open:rotate-180"
          />
        </summary>
        <div className="pb-6 text-sm leading-6 text-muted-foreground">
          Treat small-batch objects gently. Product-specific care instructions
          are included as part of this fictional order experience.
        </div>
      </details>
    </div>
  );
}
