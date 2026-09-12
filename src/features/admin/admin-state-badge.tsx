import { Badge } from "@/components/ui/badge";
import type { ProductStatus, UserStatus } from "@/types/marketplace";

export function AdminStateBadge({
  status,
}: {
  status: UserStatus | ProductStatus;
}) {
  const tone =
    status === "active"
      ? "success"
      : status === "suspended"
        ? "danger"
        : "neutral";
  return (
    <Badge tone={tone} className="capitalize">
      {status}
    </Badge>
  );
}
