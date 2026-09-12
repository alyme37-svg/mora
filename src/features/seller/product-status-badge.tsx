import { Badge } from "@/components/ui/badge";
import type { ProductStatus } from "@/types/marketplace";

const tone = {
  active: "success",
  draft: "gold",
  archived: "neutral",
  suspended: "danger",
} as const;

export function ProductStatusBadge({ status }: { status: ProductStatus }) {
  return (
    <Badge tone={tone[status]} className="capitalize">
      {status}
    </Badge>
  );
}
