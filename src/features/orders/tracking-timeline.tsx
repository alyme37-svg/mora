import { Check, Circle, X } from "lucide-react";

import { StatusBadge } from "@/components/marketplace/status-badge";
import {
  activeTrackingSteps,
  formatOrderDate,
  orderStatusLabels,
  statusStepIndex,
} from "@/lib/orders";
import { cn } from "@/lib/utils";
import type { SellerFulfillment } from "@/types/marketplace";

export function TrackingTimeline({
  fulfillment,
}: {
  fulfillment: SellerFulfillment;
}) {
  const currentIndex = statusStepIndex(fulfillment.status);
  if (fulfillment.status === "cancelled") {
    const event = fulfillment.trackingEvents.findLast(
      (item) => item.status === "cancelled",
    );
    return (
      <div className="mt-5 flex gap-3 rounded-md border border-danger/20 bg-danger/5 p-4">
        <span className="grid size-8 shrink-0 place-items-center rounded-full bg-danger text-white">
          <X aria-hidden="true" className="size-4" />
        </span>
        <div>
          <p className="text-sm font-semibold">
            This fulfillment was cancelled
          </p>
          {event ? (
            <p className="mt-1 text-xs text-muted-foreground">
              Updated {formatOrderDate(event.occurredAt)}
            </p>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-5">
      <div className="mb-5 flex items-center justify-between gap-4">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
          Journey
        </p>
        <StatusBadge status={fulfillment.status} />
      </div>
      <ol
        className="grid grid-cols-4"
        aria-label={`Fulfillment status: ${orderStatusLabels[fulfillment.status]}`}
      >
        {activeTrackingSteps.map((step, index) => {
          const complete = index <= currentIndex;
          return (
            <li key={step} className="relative min-w-0 text-center">
              <span
                aria-hidden="true"
                className={cn(
                  "absolute left-0 right-0 top-3.5 h-px bg-border",
                  index === 0 && "left-1/2",
                  index === activeTrackingSteps.length - 1 && "right-1/2",
                  index < currentIndex && "bg-success",
                )}
              />
              <span
                className={cn(
                  "relative mx-auto grid size-7 place-items-center rounded-full border bg-surface",
                  complete
                    ? "border-success text-success"
                    : "text-muted-foreground",
                )}
              >
                {index < currentIndex ? (
                  <Check aria-hidden="true" className="size-3.5" />
                ) : (
                  <Circle
                    aria-hidden="true"
                    className={cn(
                      "size-2.5 fill-current",
                      index === currentIndex && "text-success",
                    )}
                  />
                )}
              </span>
              <span
                className={cn(
                  "mt-2 block text-[0.625rem] font-medium sm:text-xs",
                  complete ? "text-foreground" : "text-muted-foreground",
                )}
              >
                {orderStatusLabels[step]}
              </span>
            </li>
          );
        })}
      </ol>
      {fulfillment.trackingNumber ? (
        <p className="mt-5 rounded-md bg-muted/60 px-4 py-3 text-xs text-muted-foreground">
          Mock tracking{" "}
          <span className="ml-1 font-semibold text-foreground tabular-nums">
            {fulfillment.trackingNumber}
          </span>
        </p>
      ) : null}
      <div className="mt-5 grid gap-3 border-t pt-5">
        {fulfillment.trackingEvents
          .toSorted((a, b) => b.occurredAt.localeCompare(a.occurredAt))
          .map((event) => (
            <div
              key={event.id}
              className="flex items-baseline justify-between gap-4 text-xs"
            >
              <p className="font-medium">{event.label}</p>
              <time className="shrink-0 text-muted-foreground">
                {formatOrderDate(event.occurredAt)}
              </time>
            </div>
          ))}
      </div>
    </div>
  );
}
