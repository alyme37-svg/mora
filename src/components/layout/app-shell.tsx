import { Search } from "lucide-react";
import Link from "next/link";

import { DemoRoleDialog } from "@/components/demo/demo-role-dialog";
import { Brand } from "@/components/layout/brand";
import { HeaderActions } from "@/components/layout/header-actions";
import { MobileBottomNavigation } from "@/components/layout/mobile-bottom-navigation";
import { MobileNavigation } from "@/components/layout/mobile-navigation";
import { PageContainer } from "@/components/layout/page-container";

const navigation = [
  { label: "Shop", href: "/shop" },
  { label: "Categories", href: "/shop#categories" },
  { label: "Creators", href: "/#creators" },
  { label: "For creators", href: "/seller" },
  { label: "About", href: "/about" },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="app-shell min-h-screen">
      <a
        href="#main-content"
        className="fixed left-4 top-4 z-[100] -translate-y-24 rounded-md bg-foreground px-4 py-3 text-sm font-semibold text-surface transition-transform focus:translate-y-0"
      >
        Skip to main content
      </a>
      <div className="public-demo-bar border-b border-walnut/15 bg-walnut text-surface">
        <PageContainer className="flex min-h-9 items-center justify-between gap-4 text-[0.6875rem] font-medium tracking-wide">
          <span className="sm:hidden">Portfolio by Ali Elhussein</span>
          <span className="hidden sm:inline">
            Interactive portfolio demo by Ali Elhussein · no real purchases
          </span>
          <DemoRoleDialog />
        </PageContainer>
      </div>
      <header className="public-header border-b border-walnut/10 bg-background/96">
        <PageContainer className="flex min-h-17 items-center gap-3 sm:gap-5">
          <div className="lg:hidden">
            <MobileNavigation />
          </div>
          <Brand />
          <nav
            className="hidden items-center gap-0.5 lg:flex"
            aria-label="Primary navigation"
          >
            {navigation.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-11 items-center rounded-md px-3 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
          <form
            action="/shop"
            role="search"
            className="mx-auto hidden h-11 max-w-xl flex-1 items-center gap-3 rounded-md bg-muted px-4 text-muted-foreground md:flex"
          >
            <Search aria-hidden="true" className="size-4 shrink-0" />
            <label htmlFor="site-search" className="sr-only">
              Search products and creators
            </label>
            <input
              id="site-search"
              name="q"
              type="search"
              placeholder="Search products, brands, or creators…"
              className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground/80"
            />
          </form>
          <div className="ml-auto">
            <HeaderActions />
          </div>
        </PageContainer>
      </header>
      <main id="main-content" className="app-main pb-20 md:pb-0">
        {children}
      </main>
      <MobileBottomNavigation />
      <footer className="public-footer mt-20 border-t bg-surface">
        <PageContainer className="grid gap-8 py-10 sm:grid-cols-[1fr_auto] sm:items-end">
          <div>
            <Brand />
            <p className="mt-4 max-w-md text-sm leading-6 text-muted-foreground">
              Thoughtful objects from independent studios, presented as an
              interactive portfolio experience.
            </p>
            <p className="mt-5 text-xs text-muted-foreground">
              © 2026 Ali Elhussein. All rights reserved.
            </p>
          </div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-muted-foreground">
            <Link href="/shop" className="hover:text-foreground">
              Shop
            </Link>
            <Link href="/#creators" className="hover:text-foreground">
              Creators
            </Link>
            <Link href="/about" className="hover:text-foreground">
              About
            </Link>
          </div>
        </PageContainer>
      </footer>
    </div>
  );
}
