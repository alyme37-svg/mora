import { cn } from "@/lib/utils";

export function FilterChip({
  active = false,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { active?: boolean }) {
  return (
    <button
      type="button"
      aria-pressed={active}
      className={cn(
        "min-h-10 cursor-pointer rounded-full border px-4 text-sm font-medium transition-colors",
        active
          ? "border-foreground bg-foreground text-surface"
          : "bg-surface text-muted-foreground hover:border-caramel hover:text-foreground",
        className,
      )}
      {...props}
    />
  );
}
