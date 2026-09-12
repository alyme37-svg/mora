"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";

import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  className,
  children,
  title,
  description,
}: {
  className?: string;
  children: React.ReactNode;
  title: string;
  description?: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-foreground/35 backdrop-blur-[1px] data-[state=closed]:opacity-0 data-[state=open]:opacity-100 motion-safe:transition-opacity" />
      <Dialog.Content
        className={cn(
          "fixed inset-y-0 right-0 z-50 w-[min(90vw,24rem)] max-w-full overflow-x-hidden overflow-y-auto border-l bg-surface p-6 shadow-[-12px_0_40px_rgb(40_31_25/0.08)] data-[state=closed]:translate-x-full data-[state=open]:translate-x-0 motion-safe:transition-transform motion-safe:duration-200",
          className,
        )}
      >
        <div className="mb-7 pr-12">
          <Dialog.Title className="font-serif text-3xl font-semibold leading-none">
            {title}
          </Dialog.Title>
          {description ? (
            <Dialog.Description className="mt-2 text-sm leading-6 text-muted-foreground">
              {description}
            </Dialog.Description>
          ) : null}
        </div>
        {children}
        <Dialog.Close
          className="absolute right-4 top-4 inline-flex size-11 cursor-pointer items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label="Close panel"
        >
          <X aria-hidden="true" className="size-5" />
        </Dialog.Close>
      </Dialog.Content>
    </Dialog.Portal>
  );
}
