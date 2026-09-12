import { ArrowLeft, Boxes, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { EditorialHeading } from "@/components/layout/editorial-heading";
import { PageContainer } from "@/components/layout/page-container";
import { Button } from "@/components/ui/button";

export function RoutePlaceholder({
  eyebrow,
  title,
  description,
  icon: Icon = Boxes,
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}) {
  return (
    <PageContainer className="py-12 sm:py-16 lg:py-24">
      <section className="relative overflow-hidden rounded-lg border bg-surface px-6 py-14 shadow-soft sm:px-10 lg:px-16 lg:py-20">
        <div
          className="absolute -right-20 -top-20 size-64 rounded-full border border-gold/20 bg-gold/5"
          aria-hidden="true"
        />
        <div className="relative max-w-2xl">
          <span className="mb-8 grid size-12 place-items-center rounded-full border border-gold/30 bg-gold/10 text-walnut">
            <Icon aria-hidden="true" className="size-5" />
          </span>
          <EditorialHeading
            eyebrow={eyebrow}
            title={title}
            description={description}
          />
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button asChild>
              <Link href="/">
                <ArrowLeft aria-hidden="true" />
                Back to foundation
              </Link>
            </Button>
            <span className="text-xs text-muted-foreground">
              Planned for a later phase
            </span>
          </div>
        </div>
      </section>
    </PageContainer>
  );
}
