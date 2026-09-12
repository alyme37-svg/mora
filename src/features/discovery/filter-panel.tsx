import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import type { Seller } from "@/types/marketplace";

export interface FilterState {
  sellerIds: string[];
  minPrice: string;
  maxPrice: string;
  minRating: number;
}

export function FilterPanel({
  value,
  onChange,
  sellers,
  idPrefix,
}: {
  value: FilterState;
  onChange: (value: FilterState) => void;
  sellers: Seller[];
  idPrefix: string;
}) {
  const hasFilters =
    value.sellerIds.length > 0 ||
    value.minPrice ||
    value.maxPrice ||
    value.minRating > 0;

  function toggleSeller(sellerId: string) {
    onChange({
      ...value,
      sellerIds: value.sellerIds.includes(sellerId)
        ? value.sellerIds.filter((id) => id !== sellerId)
        : [...value.sellerIds, sellerId],
    });
  }

  return (
    <div className="grid gap-7">
      <fieldset>
        <legend className="text-sm font-semibold">Price range</legend>
        <div className="mt-3 grid grid-cols-[minmax(0,1fr)_minmax(0,1fr)] gap-2">
          <label
            className="grid min-w-0 gap-1.5 text-xs text-muted-foreground"
            htmlFor={`${idPrefix}-min-price`}
          >
            Minimum
            <span className="flex min-h-11 min-w-0 items-center overflow-hidden rounded-md border bg-surface px-3 focus-within:border-walnut focus-within:ring-2 focus-within:ring-walnut/10">
              <span aria-hidden="true">$</span>
              <input
                id={`${idPrefix}-min-price`}
                inputMode="decimal"
                min="0"
                type="number"
                value={value.minPrice}
                onChange={(event) =>
                  onChange({ ...value, minPrice: event.target.value })
                }
                className="min-w-0 flex-1 bg-transparent px-1 text-sm text-foreground outline-none"
                placeholder="0"
              />
            </span>
          </label>
          <label
            className="grid min-w-0 gap-1.5 text-xs text-muted-foreground"
            htmlFor={`${idPrefix}-max-price`}
          >
            Maximum
            <span className="flex min-h-11 min-w-0 items-center overflow-hidden rounded-md border bg-surface px-3 focus-within:border-walnut focus-within:ring-2 focus-within:ring-walnut/10">
              <span aria-hidden="true">$</span>
              <input
                id={`${idPrefix}-max-price`}
                inputMode="decimal"
                min="0"
                type="number"
                value={value.maxPrice}
                onChange={(event) =>
                  onChange({ ...value, maxPrice: event.target.value })
                }
                className="min-w-0 flex-1 bg-transparent px-1 text-sm text-foreground outline-none"
                placeholder="Any"
              />
            </span>
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold">Creator</legend>
        <div className="mt-3 grid gap-1">
          {sellers.map((seller) => (
            <label
              key={seller.id}
              className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md px-2 text-sm text-muted-foreground hover:bg-muted hover:text-foreground"
            >
              <input
                type="checkbox"
                checked={value.sellerIds.includes(seller.id)}
                onChange={() => toggleSeller(seller.id)}
                className="size-4 accent-walnut"
              />
              <span>{seller.settings.displayName}</span>
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className="text-sm font-semibold">Minimum rating</legend>
        <div className="mt-3 grid grid-cols-2 gap-2">
          {[0, 4, 4.5, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              onClick={() => onChange({ ...value, minRating: rating })}
              aria-pressed={value.minRating === rating}
              className={`min-h-10 cursor-pointer rounded-md border px-3 text-xs font-medium transition-colors ${value.minRating === rating ? "border-foreground bg-foreground text-surface" : "bg-surface text-muted-foreground hover:border-caramel hover:text-foreground"}`}
            >
              {rating === 0 ? "Any rating" : `${rating}+ stars`}
            </button>
          ))}
        </div>
      </fieldset>

      {hasFilters ? (
        <Button
          type="button"
          variant="ghost"
          onClick={() =>
            onChange({
              sellerIds: [],
              minPrice: "",
              maxPrice: "",
              minRating: 0,
            })
          }
        >
          <RotateCcw aria-hidden="true" />
          Reset filters
        </Button>
      ) : null}
    </div>
  );
}
