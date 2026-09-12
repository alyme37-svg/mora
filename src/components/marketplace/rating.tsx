import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

export function Rating({
  value,
  count,
  compact = false,
  className,
}: {
  value: number;
  count?: number;
  compact?: boolean;
  className?: string;
}) {
  if (count === 0) {
    return (
      <span
        className={cn("text-xs font-medium text-muted-foreground", className)}
      >
        New
      </span>
    );
  }
  const label = `${value.toFixed(1)} out of 5${count === undefined ? "" : ` from ${count} reviews`}`;
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 text-xs text-muted-foreground",
        className,
      )}
      aria-label={label}
    >
      <Star aria-hidden="true" className="size-3.5 fill-gold text-gold" />
      <span className="font-medium text-foreground">{value.toFixed(1)}</span>
      {!compact && count !== undefined ? <span>({count})</span> : null}
    </div>
  );
}
