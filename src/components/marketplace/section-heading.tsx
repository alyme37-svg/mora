import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  description,
  href,
  linkLabel = "View all",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mb-7 flex items-end justify-between gap-6 border-b pb-5",
        className,
      )}
    >
      <div className="max-w-2xl">
        {eyebrow ? (
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-caramel">
            {eyebrow}
          </p>
        ) : null}
        <h2
          className={cn(
            "font-serif text-3xl font-semibold leading-none tracking-[-0.02em] sm:text-4xl",
            eyebrow && "mt-2",
          )}
        >
          {title}
        </h2>
        {description ? (
          <p className="mt-3 text-sm leading-6 text-muted-foreground">
            {description}
          </p>
        ) : null}
      </div>
      {href ? (
        <Link
          href={href}
          className="hidden min-h-11 shrink-0 items-center gap-2 rounded-md px-3 text-sm font-semibold underline-offset-4 hover:underline sm:inline-flex"
        >
          {linkLabel}
          <ArrowRight aria-hidden="true" className="size-4" />
        </Link>
      ) : null}
    </div>
  );
}
