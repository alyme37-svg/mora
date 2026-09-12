import { cn } from "@/lib/utils";

export function EditorialHeading({
  eyebrow,
  title,
  description,
  align = "left",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow ? (
        <p className="mb-3 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-caramel">
          {eyebrow}
        </p>
      ) : null}
      <h1 className="text-balance font-serif text-4xl font-semibold leading-[0.98] tracking-[-0.025em] sm:text-5xl lg:text-6xl">
        {title}
      </h1>
      {description ? (
        <p className="mt-5 max-w-xl text-pretty text-base leading-7 text-muted-foreground">
          {description}
        </p>
      ) : null}
    </div>
  );
}
