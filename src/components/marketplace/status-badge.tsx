import { Badge } from "@/components/ui/badge";
import type { OrderStatus } from "@/types/marketplace";

const toneByStatus = {
  placed: "gold",
  processing: "warning",
  shipped: "neutral",
  delivered: "success",
  cancelled: "danger",
} as const;

export function StatusBadge({ status }: { status: OrderStatus }) {
  return (
    <Badge tone={toneByStatus[status]} className="capitalize">
      {status}
    </Badge>
  );
}
