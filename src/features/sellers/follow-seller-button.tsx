"use client";

import { Check, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { useHydrated } from "@/hooks/use-hydrated";
import { useMarketplaceStore } from "@/store/marketplace-store";

export function FollowSellerButton({
  sellerId,
  sellerName,
  baseFollowers,
}: {
  sellerId: string;
  sellerName: string;
  baseFollowers: number;
}) {
  const hydrated = useHydrated();
  const followed = useMarketplaceStore((state) =>
    state.followedSellerIds.includes(sellerId),
  );
  const toggle = useMarketplaceStore((state) => state.toggleFollowSeller);
  const { toast } = useToast();
  const isFollowing = hydrated ? followed : false;

  function handleClick() {
    toggle(sellerId);
    toast({
      title: isFollowing ? "No longer following" : "Creator followed",
      description: sellerName,
    });
  }

  return (
    <div className="flex items-center gap-3">
      <Button
        variant={isFollowing ? "secondary" : "primary"}
        onClick={handleClick}
        aria-pressed={isFollowing}
      >
        {isFollowing ? (
          <Check aria-hidden="true" />
        ) : (
          <Plus aria-hidden="true" />
        )}
        {isFollowing ? "Following" : "Follow"}
      </Button>
      <p className="text-xs text-muted-foreground">
        <span className="font-semibold text-foreground">
          {baseFollowers + (isFollowing ? 1 : 0)}
        </span>{" "}
        demo followers
      </p>
    </div>
  );
}
