"use client";

import {
  BarChart3,
  Boxes,
  ChevronRight,
  ExternalLink,
  LayoutDashboard,
  Menu,
  PackageCheck,
  Settings2,
  Store,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

import { Brand } from "@/components/layout/brand";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { demoIdentities } from "@/data/seed";
import { cn } from "@/lib/utils";
import { useMarketplaceStore } from "@/store/marketplace-store";

const items = [
  { label: "Overview", href: "/seller", icon: LayoutDashboard },
  { label: "Products", href: "/seller/products", icon: Boxes },
  { label: "Orders", href: "/seller/orders", icon: PackageCheck },
  { label: "Analytics", href: "/seller/analytics", icon: BarChart3 },
  { label: "Store profile", href: "/seller/store", icon: Settings2 },
] as const;

function SellerNavigation({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <nav className="grid gap-1" aria-label="Seller workspace">
      {items.map(({ label, href, icon: Icon }) => {
        const active =
          href === "/seller" ? pathname === href : pathname.startsWith(href);
        return (
          <Link
            key={href}
            href={href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={cn(
              "flex min-h-11 items-center gap-3 rounded-md px-3 text-sm font-medium transition-colors",
              active
                ? "bg-surface/10 text-surface"
                : "text-surface/70 hover:bg-surface/7 hover:text-surface",
            )}
          >
            <Icon aria-hidden="true" className="size-4.5" />
            {label}
            {active ? (
              <ChevronRight aria-hidden="true" className="ml-auto size-4" />
            ) : null}
          </Link>
        );
      })}
    </nav>
  );
}

export function SellerShell({ children }: { children: React.ReactNode }) {
  const seller = useMarketplaceStore((state) =>
    state.sellers.find((item) => item.id === demoIdentities.sellerId),
  );
  const changeDemoRole = useMarketplaceStore((state) => state.changeDemoRole);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div
      data-seller-workspace
      className="min-h-dvh bg-background lg:grid lg:grid-cols-[15rem_minmax(0,1fr)]"
    >
      <aside className="hidden min-h-dvh bg-foreground px-4 py-5 text-surface lg:sticky lg:top-0 lg:flex lg:h-dvh lg:flex-col">
        <div className="px-2">
          <Brand />
        </div>
        <div className="mt-8 border-y border-surface/10 py-5">
          <p className="text-[0.625rem] font-semibold uppercase tracking-[0.18em] text-gold">
            Seller workspace
          </p>
          <p className="mt-2 text-sm font-semibold">
            {seller?.settings.displayName ?? "Clay & Co."}
          </p>
          <p className="mt-1 text-xs text-surface/55">Fictional demo store</p>
        </div>
        <div className="mt-5">
          <SellerNavigation />
        </div>
        <div className="mt-auto border-t border-surface/10 pt-4">
          <Button
            asChild
            variant="ghost"
            className="w-full justify-start px-3 text-surface hover:bg-surface/10 hover:text-surface"
          >
            <Link href="/" onClick={() => changeDemoRole("shopper")}>
              <ExternalLink aria-hidden="true" />
              View marketplace
            </Link>
          </Button>
        </div>
      </aside>

      <div className="min-w-0">
        <header className="sticky top-0 z-30 border-b bg-surface/95 lg:hidden">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 sm:px-6">
            <Brand />
            <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
              <SheetTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Open seller navigation"
                >
                  <Menu aria-hidden="true" />
                </Button>
              </SheetTrigger>
              <SheetContent
                title="Seller workspace"
                description="Manage Clay & Co. in this fictional portfolio demo."
              >
                <SellerNavigation onNavigate={() => setMobileOpen(false)} />
                <SheetClose asChild>
                  <Button asChild variant="secondary" className="mt-8 w-full">
                    <Link href="/" onClick={() => changeDemoRole("shopper")}>
                      <Store aria-hidden="true" />
                      View marketplace
                    </Link>
                  </Button>
                </SheetClose>
              </SheetContent>
            </Sheet>
          </div>
        </header>
        <div className="mx-auto w-full max-w-[90rem] px-4 py-7 sm:px-6 sm:py-9 lg:px-10 lg:py-10">
          {children}
        </div>
      </div>
    </div>
  );
}
