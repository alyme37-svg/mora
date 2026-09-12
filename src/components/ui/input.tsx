import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  hint?: string;
  error?: string;
  containerClassName?: string;
}

export function Input({
  className,
  containerClassName,
  id,
  label,
  hint,
  error,
  ...props
}: InputProps) {
  const inputId = id ?? props.name;
  const descriptionId = inputId ? `${inputId}-description` : undefined;

  return (
    <label
      className={cn(
        "grid gap-2 text-sm font-medium text-foreground",
        containerClassName,
        className,
      )}
      htmlFor={inputId}
    >
      {label ? <span>{label}</span> : null}
      <input
        id={inputId}
        aria-invalid={Boolean(error)}
        aria-describedby={hint || error ? descriptionId : undefined}
        className={cn(
          "min-h-11 w-full rounded-md border bg-surface px-3.5 text-sm text-foreground shadow-[0_1px_0_rgb(40_31_25/0.02)] transition-colors placeholder:text-muted-foreground/70 hover:border-caramel/70 focus:border-walnut focus:outline-none focus:ring-2 focus:ring-walnut/15 disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-70",
          error && "border-danger focus:border-danger focus:ring-danger/15",
          className,
        )}
        {...props}
      />
      {hint || error ? (
        <span
          id={descriptionId}
          className={cn(
            "text-xs font-normal text-muted-foreground",
            error && "text-danger",
          )}
        >
          {error ?? hint}
        </span>
      ) : null}
    </label>
  );
}
