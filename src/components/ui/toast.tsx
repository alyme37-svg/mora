"use client";

import { CheckCircle2, X } from "lucide-react";
import { usePathname } from "next/navigation";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

import { cn } from "@/lib/utils";

type ToastItem = { id: number; title: string; description?: string };
type ToastContextValue = { toast: (item: Omit<ToastItem, "id">) => void };

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [items, setItems] = useState<ToastItem[]>([]);
  const toast = useCallback((item: Omit<ToastItem, "id">) => {
    const id = Date.now();
    setItems((current) => [...current.slice(-2), { ...item, id }]);
    window.setTimeout(
      () => setItems((current) => current.filter((entry) => entry.id !== id)),
      3200,
    );
  }, []);
  const value = useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        className={cn(
          "pointer-events-none fixed right-4 z-[70] grid w-[min(calc(100vw-2rem),22rem)] gap-2 md:bottom-4",
          pathname.startsWith("/seller")
            ? "bottom-4"
            : pathname.startsWith("/products/")
              ? "bottom-[calc(9rem+env(safe-area-inset-bottom))]"
              : "bottom-[calc(4.75rem+env(safe-area-inset-bottom))]",
        )}
        aria-live="polite"
        aria-atomic="false"
      >
        {items.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto flex items-start gap-3 rounded-lg border bg-surface p-4 shadow-soft"
          >
            <CheckCircle2
              aria-hidden="true"
              className="mt-0.5 size-5 shrink-0 text-success"
            />
            <div className="min-w-0 flex-1">
              <p className="text-sm font-semibold">{item.title}</p>
              {item.description ? (
                <p className="mt-1 text-xs leading-5 text-muted-foreground">
                  {item.description}
                </p>
              ) : null}
            </div>
            <button
              className="-mr-2 -mt-2 inline-flex size-9 cursor-pointer items-center justify-center rounded-full text-muted-foreground hover:bg-muted hover:text-foreground"
              onClick={() =>
                setItems((current) =>
                  current.filter((entry) => entry.id !== item.id),
                )
              }
              aria-label="Dismiss notification"
            >
              <X aria-hidden="true" className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) throw new Error("useToast must be used inside ToastProvider");
  return context;
}
