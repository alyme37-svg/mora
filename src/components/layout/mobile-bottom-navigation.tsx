"use client";

import { Heart, Home, PackageCheck, Search, ShoppingBag } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { useHydrated } from "@/hooks/use-hydrated";
import { cn } from "@/lib/utils";
import { useMarketplaceStore } from "@/store/marketplace-store";

const items = [
  { label: "Home", href: "/", icon: Home },
  { label: "Browse", href: "/shop", icon: Search },
  { label: "Wishlist", href: "/wishlist", icon: Heart },
  { label: "Orders", href: "/orders", icon: PackageCheck },
  { label: "Cart", href: "/cart", icon: ShoppingBag },
] as const;

export function MobileBottomNavigation() {
  const pathname = usePathname();
  const hydrated = useHydrated();
  const cartCount = useMarketplaceStore((state) =>
    state.cart.reduce((sum, item) => sum + item.quantity, 0),
  );
  const wishlistCount = useMarketplaceStore((state) => state.wishlist.length);

  return (
    <nav
      className="public-mobile-nav fixed inset-x-0 bottom-0 z-40 border-t bg-surface/96 px-2 pb-[max(env(safe-area-inset-bottom),0.35rem)] pt-1.5 shadow-[0_-8px_24px_rgb(40_31_25/0.05)] md:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto grid max-w-md grid-cols-5">
        {items.map(({ label, href, icon: Icon }) => {
          const active =
            href === "/" ? pathname === "/" : pathname.startsWith(href);
          const count =
            label === "Cart"
              ? cartCount
              : label === "Wishlist"
                ? wishlistCount
                : 0;
          return (
            <Link
              key={href}
              href={href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "relative flex min-h-14 flex-col items-center justify-center gap-1 rounded-md text-[0.625rem] font-medium text-muted-foreground transition-colors duration-200 active:bg-muted",
                active && "text-walnut",
              )}
            >
              <span
                className={cn(
                  "grid size-7 place-items-center rounded-full transition-colors duration-200",
                  active && "bg-walnut/10",
                )}
              >
                <Icon aria-hidden="true" className="size-[1.125rem]" />
              </span>
              <span>{label}</span>
              {hydrated && count > 0 ? (
                <span
                  className="absolute right-[calc(50%-1.1rem)] top-0.5 min-w-4 rounded-full bg-caramel px-1 text-center text-[0.5625rem] font-bold leading-4 text-white"
                  aria-label={`${count} ${label.toLowerCase()} items`}
                >
                  {count > 9 ? "9+" : count}
                </span>
              ) : null}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
