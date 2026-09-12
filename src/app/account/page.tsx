import { UserRound } from "lucide-react";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
export default function AccountPage() {
  return (
    <RoutePlaceholder
      eyebrow="Demo identity"
      title="Sarah Chen is ready for the shopper journey."
      description="This portfolio demo uses stable local identities only. No real authentication will be introduced."
      icon={UserRound}
    />
  );
}
