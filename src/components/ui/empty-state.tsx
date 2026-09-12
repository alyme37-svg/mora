import type { LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "grid min-h-72 place-items-center rounded-lg border border-dashed bg-surface/60 px-6 py-12 text-center",
        className,
      )}
    >
      <div className="max-w-sm">
        <span className="mx-auto grid size-12 place-items-center rounded-full bg-muted text-walnut">
          <Icon aria-hidden="true" className="size-5" />
        </span>
        <h2 className="mt-5 text-lg font-semibold">{title}</h2>
        <p className="mt-2 text-sm leading-6 text-muted-foreground">
          {description}
        </p>
        {action ? <div className="mt-6">{action}</div> : null}
      </div>
    </section>
  );
}
