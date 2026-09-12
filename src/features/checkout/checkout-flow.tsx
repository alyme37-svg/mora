"use client";

import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  LockKeyhole,
  PackageCheck,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

import { SellerBadge } from "@/components/marketplace/seller-badge";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { demoIdentities } from "@/data/seed";
import { useHydrated } from "@/hooks/use-hydrated";
import { formatMoney, usd } from "@/lib/money";
import { estimatedDelivery, formatOrderNumber } from "@/lib/orders";
import { cn } from "@/lib/utils";
import { buildCartDetails } from "@/store/selectors";
import { useMarketplaceStore } from "@/store/marketplace-store";
import type { Address, CheckoutStep } from "@/types/marketplace";

const steps = ["Shipping", "Payment", "Review", "Confirmation"] as const;
const stepOrder: Record<CheckoutStep, number> = {
  shipping: 0,
  payment: 1,
  review: 2,
};
const requiredAddressFields: Array<keyof Address> = [
  "name",
  "line1",
  "city",
  "region",
  "postalCode",
  "country",
];

function CheckoutProgress({ current }: { current: number }) {
  return (
    <ol
      className="grid grid-cols-4 gap-1 border-y py-4"
      aria-label="Checkout progress"
    >
      {steps.map((label, index) => (
        <li
          key={label}
          aria-current={index === current ? "step" : undefined}
          className="min-w-0 text-center"
        >
          <span
            className={cn(
              "mx-auto grid size-7 place-items-center rounded-full border text-xs font-semibold",
              index < current && "border-success bg-success text-white",
              index === current &&
                "border-foreground bg-foreground text-surface",
              index > current && "bg-surface text-muted-foreground",
            )}
          >
            {index < current ? (
              <Check aria-hidden="true" className="size-3.5" />
            ) : (
              index + 1
            )}
          </span>
          <span
            className={cn(
              "mt-2 block truncate text-[0.625rem] font-medium sm:text-xs",
              index === current ? "text-foreground" : "text-muted-foreground",
            )}
          >
            {label}
          </span>
        </li>
      ))}
    </ol>
  );
}

export function CheckoutFlow({ initialOrderId }: { initialOrderId?: string }) {
  const hydrated = useHydrated();
  const router = useRouter();
  const cart = useMarketplaceStore((state) => state.cart);
  const products = useMarketplaceStore((state) => state.products);
  const sellers = useMarketplaceStore((state) => state.sellers);
  const orders = useMarketplaceStore((state) => state.orders);
  const draft = useMarketplaceStore((state) => state.checkoutDraft);
  const setStep = useMarketplaceStore((state) => state.setCheckoutStep);
  const updateShipping = useMarketplaceStore(
    (state) => state.updateCheckoutShipping,
  );
  const createOrder = useMarketplaceStore((state) => state.createOrder);
  const { toast } = useToast();
  const [confirmedOrderId, setConfirmedOrderId] = useState(initialOrderId);
  const [errors, setErrors] = useState<Partial<Record<keyof Address, string>>>(
    {},
  );
  const [orderError, setOrderError] = useState("");
  const details = useMemo(
    () => buildCartDetails(cart, products, sellers),
    [cart, products, sellers],
  );
  const confirmedOrder = orders.find(
    (order) =>
      order.id === confirmedOrderId &&
      order.shopperId === demoIdentities.shopperUserId,
  );
  const currentStep = confirmedOrder ? 3 : stepOrder[draft.step];

  if (!hydrated)
    return (
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <Skeleton className="h-[36rem]" />
        <Skeleton className="h-80" />
      </div>
    );

  if (confirmedOrder) {
    return (
      <div>
        <CheckoutProgress current={3} />
        <section className="mx-auto max-w-4xl py-10 text-center sm:py-14">
          <span className="mx-auto grid size-16 place-items-center rounded-full bg-success/10 text-success">
            <CheckCircle2 aria-hidden="true" className="size-8" />
          </span>
          <p className="mt-6 text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-caramel">
            Demo order confirmed
          </p>
          <h1 className="mt-3 text-balance font-serif text-4xl font-semibold leading-none sm:text-5xl">
            Your makers have received the order.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-sm leading-6 text-muted-foreground">
            No payment was processed. This local order is now available across
            Mora’s fictional shopper and seller experiences.
          </p>
          <div className="mx-auto mt-8 grid max-w-2xl gap-3 rounded-lg border bg-surface p-5 text-left sm:grid-cols-2 sm:p-6">
            <div>
              <p className="text-xs text-muted-foreground">Order number</p>
              <p className="mt-1 font-semibold tabular-nums">
                {formatOrderNumber(confirmedOrder.id)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground">
                Estimated mock delivery
              </p>
              <p className="mt-1 font-semibold">
                {estimatedDelivery(confirmedOrder, sellers)}
              </p>
            </div>
          </div>
          <div className="mx-auto mt-5 max-w-2xl divide-y overflow-hidden rounded-lg border bg-surface text-left">
            {confirmedOrder.fulfillments.map((group) => {
              const seller = sellers.find((item) => item.id === group.sellerId);
              return (
                <section key={group.id} className="p-5">
                  {seller ? <SellerBadge seller={seller} /> : null}
                  <div className="mt-4 grid gap-3">
                    {group.lineItems.map((line) => (
                      <div key={line.id} className="flex items-center gap-3">
                        <div className="relative size-12 shrink-0 overflow-hidden rounded-md border bg-muted">
                          <Image
                            src={line.productImage}
                            alt=""
                            fill
                            sizes="48px"
                            className="object-cover"
                          />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium">
                            {line.quantity} × {line.productName}
                          </p>
                          {line.variantName ? (
                            <p className="mt-0.5 text-xs text-muted-foreground">
                              {line.variantName}
                            </p>
                          ) : null}
                        </div>
                        <p className="text-sm font-semibold">
                          {formatMoney(
                            usd(line.unitPrice.amount * line.quantity),
                          )}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              );
            })}
          </div>
          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            <Button asChild size="lg">
              <Link href={`/orders/${confirmedOrder.id}`}>
                View order details <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link href="/shop">Continue shopping</Link>
            </Button>
          </div>
        </section>
      </div>
    );
  }

  if (!details.items.length)
    return (
      <EmptyState
        icon={PackageCheck}
        title="Nothing is waiting for checkout"
        description="Your cart is empty, or this completed demo order is no longer available."
        action={
          <Button asChild>
            <Link href="/shop">Return to the marketplace</Link>
          </Button>
        }
      />
    );

  function submitShipping(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const nextErrors: Partial<Record<keyof Address, string>> = {};
    for (const field of requiredAddressFields)
      if (!draft.shippingAddress[field]?.trim())
        nextErrors[field] = "Add this detail to continue.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) {
      document
        .getElementById(`checkout-${Object.keys(nextErrors)[0]}`)
        ?.focus();
      return;
    }
    setStep("payment");
  }

  function changeAddress(field: keyof Address, value: string) {
    updateShipping({ [field]: value });
    if (errors[field])
      setErrors((current) => ({ ...current, [field]: undefined }));
  }

  function placeOrder() {
    const orderId = createOrder({
      shippingAddress: draft.shippingAddress,
      paymentMethodLabel: draft.paymentMethodLabel,
    });
    if (!orderId) {
      const message =
        "The cart changed before checkout. Review current availability and try again.";
      setOrderError(message);
      toast({ title: "Order not created", description: message });
      return;
    }
    setOrderError("");
    setConfirmedOrderId(orderId);
    router.replace(`/checkout?order=${encodeURIComponent(orderId)}`, {
      scroll: false,
    });
  }

  return (
    <div>
      <CheckoutProgress current={currentStep} />
      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-12">
        <section className="rounded-lg border bg-surface p-5 sm:p-8">
          {draft.step === "shipping" ? (
            <form onSubmit={submitShipping} noValidate>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-caramel">
                Step 1 of 3
              </p>
              <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
                Where should the demo order go?
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                A fictional address is prefilled for Sarah Chen. Nothing is
                transmitted.
              </p>
              <div className="mt-7 grid gap-5 sm:grid-cols-2">
                <Input
                  id="checkout-name"
                  label="Full name"
                  autoComplete="name"
                  value={draft.shippingAddress.name}
                  onChange={(event) =>
                    changeAddress("name", event.target.value)
                  }
                  error={errors.name}
                  className="sm:col-span-2"
                />
                <Input
                  id="checkout-line1"
                  label="Address"
                  autoComplete="street-address"
                  value={draft.shippingAddress.line1}
                  onChange={(event) =>
                    changeAddress("line1", event.target.value)
                  }
                  error={errors.line1}
                  className="sm:col-span-2"
                />
                <Input
                  id="checkout-line2"
                  label="Apartment or suite (optional)"
                  value={draft.shippingAddress.line2 ?? ""}
                  onChange={(event) =>
                    changeAddress("line2", event.target.value)
                  }
                  className="sm:col-span-2"
                />
                <Input
                  id="checkout-city"
                  label="City"
                  autoComplete="address-level2"
                  value={draft.shippingAddress.city}
                  onChange={(event) =>
                    changeAddress("city", event.target.value)
                  }
                  error={errors.city}
                />
                <Input
                  id="checkout-region"
                  label="State / region"
                  autoComplete="address-level1"
                  value={draft.shippingAddress.region}
                  onChange={(event) =>
                    changeAddress("region", event.target.value)
                  }
                  error={errors.region}
                />
                <Input
                  id="checkout-postalCode"
                  label="Postal code"
                  autoComplete="postal-code"
                  value={draft.shippingAddress.postalCode}
                  onChange={(event) =>
                    changeAddress("postalCode", event.target.value)
                  }
                  error={errors.postalCode}
                />
                <Input
                  id="checkout-country"
                  label="Country"
                  autoComplete="country-name"
                  value={draft.shippingAddress.country}
                  onChange={(event) =>
                    changeAddress("country", event.target.value)
                  }
                  error={errors.country}
                />
              </div>
              <Button type="submit" size="lg" className="mt-8 w-full sm:w-auto">
                Continue to payment <ArrowRight aria-hidden="true" />
              </Button>
            </form>
          ) : null}

          {draft.step === "payment" ? (
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-caramel">
                Step 2 of 3
              </p>
              <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
                A payment step, without a payment.
              </h1>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">
                This portfolio demo never asks for or processes real card
                information.
              </p>
              <div className="mt-8 flex items-center gap-4 rounded-lg border-2 border-foreground bg-canvas p-5">
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-muted text-walnut">
                  <CreditCard aria-hidden="true" className="size-5" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="font-semibold">Fictional Visa •••• 4242</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Sample only · expires 12/34
                  </p>
                </div>
                <CheckCircle2
                  aria-hidden="true"
                  className="size-5 text-success"
                />
              </div>
              <div className="mt-5 flex gap-3 rounded-md bg-muted/60 p-4 text-xs leading-5 text-muted-foreground">
                <LockKeyhole
                  aria-hidden="true"
                  className="mt-0.5 size-4 shrink-0 text-walnut"
                />
                <p>
                  No financial transaction, authorization, or external request
                  occurs.
                </p>
              </div>
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button variant="secondary" onClick={() => setStep("shipping")}>
                  <ArrowLeft aria-hidden="true" />
                  Back
                </Button>
                <Button size="lg" onClick={() => setStep("review")}>
                  Review order <ArrowRight aria-hidden="true" />
                </Button>
              </div>
            </div>
          ) : null}

          {draft.step === "review" ? (
            <div>
              <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-caramel">
                Step 3 of 3
              </p>
              <h1 className="mt-2 font-serif text-3xl font-semibold sm:text-4xl">
                Review your order.
              </h1>
              <div className="mt-7 grid gap-7">
                <section>
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="font-semibold">Shipping</h2>
                    <button
                      type="button"
                      onClick={() => setStep("shipping")}
                      className="min-h-11 cursor-pointer text-xs font-semibold underline underline-offset-4"
                    >
                      Edit
                    </button>
                  </div>
                  <address className="not-italic text-sm leading-6 text-muted-foreground">
                    {draft.shippingAddress.name}
                    <br />
                    {draft.shippingAddress.line1}
                    {draft.shippingAddress.line2
                      ? `, ${draft.shippingAddress.line2}`
                      : ""}
                    <br />
                    {draft.shippingAddress.city}, {draft.shippingAddress.region}{" "}
                    {draft.shippingAddress.postalCode}
                    <br />
                    {draft.shippingAddress.country}
                  </address>
                </section>
                <section className="border-t pt-6">
                  <h2 className="font-semibold">Creator fulfillments</h2>
                  <div className="mt-4 grid gap-5">
                    {details.groups.map((group) => (
                      <div
                        key={group.seller.id}
                        className="rounded-md border p-4"
                      >
                        <SellerBadge seller={group.seller} />
                        <div className="mt-3 grid gap-2">
                          {group.items.map((item) => (
                            <div
                              key={`${item.productId}:${item.variantId ?? "default"}`}
                              className="flex gap-3 text-sm"
                            >
                              <span className="min-w-0 flex-1">
                                {item.quantity} × {item.product.name}
                                {item.variant ? (
                                  <span className="mt-0.5 block text-xs text-muted-foreground">
                                    {item.variant.name}
                                  </span>
                                ) : null}
                              </span>
                              <span className="font-medium">
                                {formatMoney(
                                  usd(item.unitAmount * item.quantity),
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              </div>
              {orderError ? (
                <p
                  role="alert"
                  className="mt-6 rounded-md border border-danger/25 bg-danger/5 px-4 py-3 text-sm text-danger"
                >
                  {orderError}
                </p>
              ) : null}
              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
                <Button variant="secondary" onClick={() => setStep("payment")}>
                  <ArrowLeft aria-hidden="true" />
                  Back
                </Button>
                <Button size="lg" onClick={placeOrder}>
                  Place demo order <Check aria-hidden="true" />
                </Button>
              </div>
              <p className="mt-4 text-xs leading-5 text-muted-foreground">
                By continuing, you create a local fictional order only. No card
                is charged.
              </p>
            </div>
          ) : null}
        </section>

        <aside
          className="rounded-lg border bg-surface p-5 lg:sticky lg:top-6"
          aria-label="Checkout summary"
        >
          <p className="text-[0.6875rem] font-semibold uppercase tracking-[0.18em] text-caramel">
            Summary
          </p>
          <div className="mt-5 grid gap-3">
            {details.items.slice(0, 4).map((item) => (
              <div
                key={`${item.productId}:${item.variantId ?? "default"}`}
                className="flex items-center gap-3"
              >
                <div className="relative size-11 shrink-0 overflow-hidden rounded-md border bg-muted">
                  <Image
                    src={item.product.images[0]}
                    alt=""
                    fill
                    sizes="44px"
                    className="object-cover"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="line-clamp-2 text-xs font-medium">
                    {item.quantity} × {item.product.name}
                  </p>
                  {item.variant ? (
                    <p className="mt-0.5 text-[0.6875rem] text-muted-foreground">
                      {item.variant.name}
                    </p>
                  ) : null}
                </div>
                <p className="text-xs font-semibold">
                  {formatMoney(usd(item.unitAmount * item.quantity))}
                </p>
              </div>
            ))}
          </div>
          {details.items.length > 4 ? (
            <p className="mt-3 border-t pt-3 text-xs text-muted-foreground">
              +{details.items.length - 4} more product
              {details.items.length - 4 === 1 ? "" : "s"} shown in the review
              step
            </p>
          ) : null}
          <dl className="mt-5 grid gap-3 border-t pt-5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd>{formatMoney(usd(details.subtotalAmount))}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Mock shipping</dt>
              <dd>{formatMoney(usd(details.shippingAmount))}</dd>
            </div>
            <div className="flex justify-between text-base font-semibold">
              <dt>Total</dt>
              <dd>{formatMoney(usd(details.totalAmount))}</dd>
            </div>
          </dl>
        </aside>
      </div>
    </div>
  );
}
