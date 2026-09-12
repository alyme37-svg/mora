"use client";

import { Heart, PackageSearch, ShoppingBag, UserRound } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useHydrated } from "@/hooks/use-hydrated";
import { useMarketplaceStore } from "@/store/marketplace-store";

export function HeaderActions() {
  const hydrated = useHydrated();
  const cartCount = useMarketplaceStore((state) =>
    state.cart.reduce((sum, item) => sum + item.quantity, 0),
  );
  const wishlistCount = useMarketplaceStore((state) => state.wishlist.length);
  const role = useMarketplaceStore((state) => state.demoRole);
  const currentRole = hydrated ? role : "shopper";
  const profileHref =
    currentRole === "seller"
      ? "/seller"
      : currentRole === "admin"
        ? "/admin"
        : "/orders";
  const profileLabel = currentRole === "shopper" ? "My orders" : "Demo profile";

  return (
    <div className="flex items-center gap-0.5">
      <Button asChild variant="ghost" size="icon">
        <Link
          href="/wishlist"
          aria-label={`Wishlist${hydrated ? ` with ${wishlistCount} items` : ""}`}
          className="relative"
        >
          <Heart aria-hidden="true" />
          {hydrated && wishlistCount > 0 ? (
            <span className="absolute right-1.5 top-1.5 size-1.5 rounded-full bg-caramel" />
          ) : null}
        </Link>
      </Button>
      <Button asChild variant="ghost" size="icon">
        <Link
          href="/cart"
          aria-label={`Cart${hydrated ? ` with ${cartCount} items` : ""}`}
          className="relative"
        >
          <ShoppingBag aria-hidden="true" />
          {hydrated && cartCount > 0 ? (
            <span className="absolute right-1 top-0.5 grid min-w-4 place-items-center rounded-full bg-caramel px-1 text-[0.625rem] font-bold leading-4 text-white">
              {cartCount}
            </span>
          ) : null}
        </Link>
      </Button>
      <Button
        asChild
        variant="ghost"
        size="icon"
        className="hidden sm:inline-flex"
      >
        <Link href={profileHref} aria-label={profileLabel}>
          {currentRole === "shopper" ? (
            <PackageSearch aria-hidden="true" />
          ) : (
            <UserRound aria-hidden="true" />
          )}
        </Link>
      </Button>
      <Badge tone="gold" className="ml-1 hidden capitalize xl:inline-flex">
        {hydrated ? `${role} demo` : "demo"}
      </Badge>
    </div>
  );
}
