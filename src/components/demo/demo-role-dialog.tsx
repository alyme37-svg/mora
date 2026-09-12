"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { ArrowRight, ShieldCheck, ShoppingBag, Store, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { useToast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { useMarketplaceStore } from "@/store/marketplace-store";
import type { DemoRole } from "@/types/marketplace";

const roles = [
  {
    id: "shopper" as const,
    title: "Continue as Shopper",
    person: "Sarah Chen",
    description: "Browse, save products, and build a multi-brand cart.",
    icon: ShoppingBag,
    href: "/",
  },
  {
    id: "seller" as const,
    title: "Continue as Seller",
    person: "Alex Morgan · Clay & Co.",
    description: "Enter the creator side of this fictional marketplace.",
    icon: Store,
    href: "/seller",
  },
  {
    id: "admin" as const,
    title: "Continue as Admin",
    person: "Nora Reed",
    description: "See the lightweight moderation entry point.",
    icon: ShieldCheck,
    href: "/admin",
  },
];

export function DemoRoleDialog() {
  const [open, setOpen] = useState(false);
  const currentRole = useMarketplaceStore((state) => state.demoRole);
  const changeDemoRole = useMarketplaceStore((state) => state.changeDemoRole);
  const router = useRouter();
  const { toast } = useToast();

  function chooseRole(role: DemoRole, href: string) {
    changeDemoRole(role);
    setOpen(false);
    toast({
      title: `Viewing as ${role}`,
      description: "Demo identity changed locally.",
    });
    router.push(href);
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className="inline-flex min-h-8 cursor-pointer items-center gap-1.5 whitespace-nowrap rounded-sm px-2 text-xs font-semibold text-surface underline decoration-surface/35 underline-offset-4 transition-colors hover:text-white hover:decoration-white">
        View demo <ArrowRight aria-hidden="true" className="size-3.5" />
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/45 data-[state=closed]:opacity-0 data-[state=open]:opacity-100 motion-safe:transition-opacity" />
        <Dialog.Content className="fixed left-1/2 top-1/2 z-50 w-[min(calc(100vw-2rem),44rem)] -translate-x-1/2 -translate-y-1/2 rounded-lg border bg-surface p-6 shadow-[0_24px_80px_rgb(40_31_25/0.18)] sm:p-9">
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-caramel">
            Portfolio convenience
          </p>
          <Dialog.Title className="mt-2 font-serif text-4xl font-semibold tracking-[-0.025em]">
            Choose a demo view
          </Dialog.Title>
          <Dialog.Description className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground">
            Switch between stable fictional identities. This control is outside
            Mora&apos;s customer experience.
          </Dialog.Description>
          <div className="mt-7 grid gap-3 sm:grid-cols-3">
            {roles.map(
              ({ id, title, person, description, icon: Icon, href }) => (
                <button
                  key={id}
                  type="button"
                  aria-pressed={currentRole === id}
                  onClick={() => chooseRole(id, href)}
                  className={cn(
                    "group min-h-48 cursor-pointer rounded-md border bg-background p-5 text-left transition-[background-color,border-color] hover:border-caramel hover:bg-muted/45",
                    currentRole === id && "border-walnut bg-muted/60",
                  )}
                >
                  <span className="grid size-10 place-items-center rounded-full border border-gold/35 bg-gold/12 text-walnut">
                    <Icon aria-hidden="true" className="size-4.5" />
                  </span>
                  <span className="mt-6 block text-sm font-semibold">
                    {title}
                  </span>
                  <span className="mt-1 block text-xs font-medium text-caramel">
                    {person}
                  </span>
                  <span className="mt-3 block text-xs leading-5 text-muted-foreground">
                    {description}
                  </span>
                </button>
              ),
            )}
          </div>
          <Dialog.Close
            className="absolute right-4 top-4 grid size-11 cursor-pointer place-items-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close demo selector"
          >
            <X aria-hidden="true" className="size-5" />
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
