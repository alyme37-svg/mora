import type { Money } from "@/types/marketplace";

const formatters = new Map<string, Intl.NumberFormat>();

export function formatMoney(money: Money, locale = "en-US") {
  const key = `${locale}:${money.currency}`;
  let formatter = formatters.get(key);

  if (!formatter) {
    formatter = new Intl.NumberFormat(locale, {
      style: "currency",
      currency: money.currency,
      maximumFractionDigits: 2,
    });
    formatters.set(key, formatter);
  }

  return formatter.format(money.amount / 100);
}

export const usd = (amount: number): Money => ({ amount, currency: "USD" });

export function addMoney(
  values: Money[],
  currency: Money["currency"] = "USD",
): Money {
  return {
    amount: values.reduce((sum, value) => sum + value.amount, 0),
    currency,
  };
}
