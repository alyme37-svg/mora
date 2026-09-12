import { Store } from "lucide-react";

import { cn } from "@/lib/utils";
import type { Seller } from "@/types/marketplace";

export function SellerBadge({
  seller,
  className,
  compact = false,
}: {
  seller: Seller;
  className?: string;
  compact?: boolean;
}) {
  return (
    <div className={cn("inline-flex min-w-0 items-center gap-2", className)}>
      <span
        className={cn(
          "grid shrink-0 place-items-center rounded-full border border-gold/30 bg-gold/15 text-walnut",
          compact ? "size-7" : "size-9",
        )}
        aria-hidden="true"
      >
        {compact ? (
          <Store className="size-3.5" />
        ) : (
          <span className="font-serif text-sm font-bold">
            {seller.settings.displayName.slice(0, 1)}
          </span>
        )}
      </span>
      <span className="truncate text-xs font-medium text-muted-foreground">
        {seller.settings.displayName}
      </span>
    </div>
  );
}
