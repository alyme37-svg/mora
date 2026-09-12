"use client";

import { Menu } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const navigation = [
  { label: "Shop", href: "/shop" },
  { label: "My orders", href: "/orders" },
  { label: "Categories", href: "/shop#categories" },
  { label: "Featured creators", href: "/#creators" },
  { label: "For creators", href: "/seller" },
  { label: "About", href: "/about" },
];

export function MobileNavigation() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" aria-label="Open navigation">
          <Menu aria-hidden="true" />
        </Button>
      </SheetTrigger>
      <SheetContent
        title="Browse Mora"
        description="Independent goods and the people behind them."
      >
        <nav className="grid gap-1" aria-label="Mobile navigation">
          {navigation.map((item) => (
            <SheetClose asChild key={item.href}>
              <Link
                href={item.href}
                className="flex min-h-12 items-center rounded-md px-3 text-base font-medium hover:bg-muted"
              >
                {item.label}
              </Link>
            </SheetClose>
          ))}
        </nav>
      </SheetContent>
    </Sheet>
  );
}
