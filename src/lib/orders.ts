import type {
  MarketplaceOrder,
  OrderStatus,
  Seller,
} from "@/types/marketplace";

export const orderStatusLabels: Record<OrderStatus, string> = {
  placed: "Placed",
  processing: "Processing",
  shipped: "Shipped",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const activeTrackingSteps: OrderStatus[] = [
  "placed",
  "processing",
  "shipped",
  "delivered",
];

export function formatOrderNumber(orderId: string) {
  const compact = orderId
    .replace(/[^a-z0-9]/gi, "")
    .slice(-8)
    .toUpperCase();
  return `MOR-${compact}`;
}

export function formatOrderDate(value: string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function estimatedDelivery(order: MarketplaceOrder, sellers: Seller[]) {
  if (order.estimatedDeliveryStart && order.estimatedDeliveryEnd) {
    const formatter = new Intl.DateTimeFormat("en", {
      month: "short",
      day: "numeric",
    });
    return `${formatter.format(new Date(order.estimatedDeliveryStart))}–${formatter.format(new Date(order.estimatedDeliveryEnd))}`;
  }
  const processingDays = Math.max(
    2,
    ...order.fulfillments.map(
      (group) =>
        sellers.find((seller) => seller.id === group.sellerId)?.settings
          .processingDays ?? 3,
    ),
  );
  const earliest = new Date(order.placedAt);
  const latest = new Date(order.placedAt);
  earliest.setDate(earliest.getDate() + processingDays + 3);
  latest.setDate(latest.getDate() + processingDays + 6);
  const formatter = new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
  });
  return `${formatter.format(earliest)}–${formatter.format(latest)} (estimated)`;
}

export function statusStepIndex(status: OrderStatus) {
  if (status === "cancelled") return -1;
  return activeTrackingSteps.indexOf(status);
}
