import type { MarketplaceState } from "@/store/marketplace-store";
import {
  getProductStock,
  isProductAdminSuspended,
  resolvePurchasableCartLine,
} from "@/store/marketplace-guards";
import type {
  CartItem,
  Product,
  Seller,
  SellerFulfillment,
} from "@/types/marketplace";

export function getActiveProducts(state: MarketplaceState) {
  const activeSellerIds = new Set(
    state.sellers
      .filter((seller) => seller.status === "active")
      .map((seller) => seller.id),
  );
  return state.products.filter(
    (product) =>
      product.status === "active" &&
      !isProductAdminSuspended(product) &&
      activeSellerIds.has(product.sellerId),
  );
}

export function getSellerFulfillments(
  state: MarketplaceState,
  sellerId: string,
) {
  return state.orders.flatMap((order) =>
    order.fulfillments
      .filter((fulfillment) => fulfillment.sellerId === sellerId)
      .map((fulfillment) => ({ order, fulfillment })),
  );
}

export function getSellerDashboard(state: MarketplaceState, sellerId: string) {
  const fulfillmentViews = getSellerFulfillments(state, sellerId).toSorted(
    (left, right) =>
      right.fulfillment.updatedAt.localeCompare(left.fulfillment.updatedAt),
  );
  const completed = fulfillmentViews.filter(
    ({ fulfillment }) => fulfillment.status !== "cancelled",
  );
  const salesAmount = completed.reduce(
    (sum, { fulfillment }) => sum + fulfillment.subtotal.amount,
    0,
  );
  const analytics = state.sellerAnalytics
    .filter((point) => point.sellerId === sellerId)
    .toSorted((left, right) => left.month.localeCompare(right.month));
  const latest = analytics.at(-1);
  const conversion = latest?.views ? (latest.orders / latest.views) * 100 : 0;
  const productPerformance = new Map<
    string,
    { quantity: number; revenue: number }
  >();

  for (const { fulfillment } of completed) {
    for (const line of fulfillment.lineItems) {
      const current = productPerformance.get(line.productId) ?? {
        quantity: 0,
        revenue: 0,
      };
      productPerformance.set(line.productId, {
        quantity: current.quantity + line.quantity,
        revenue: current.revenue + line.unitPrice.amount * line.quantity,
      });
    }
  }

  const topProducts = [...productPerformance.entries()]
    .map(([productId, performance]) => ({
      product: state.products.find((product) => product.id === productId),
      ...performance,
    }))
    .filter(
      (item): item is { product: Product; quantity: number; revenue: number } =>
        Boolean(item.product),
    )
    .toSorted((left, right) => right.revenue - left.revenue)
    .slice(0, 4);

  return {
    salesAmount,
    orderCount: fulfillmentViews.length,
    views: latest?.views ?? 0,
    conversion,
    analytics,
    recentOrders: fulfillmentViews.slice(0, 5),
    topProducts,
    awaitingProcessingCount: fulfillmentViews.filter(
      ({ fulfillment }) => fulfillment.status === "placed",
    ).length,
    inTransitCount: fulfillmentViews.filter(
      ({ fulfillment }) => fulfillment.status === "shipped",
    ).length,
  };
}

export { getProductStock };

export function getProductRating(state: MarketplaceState, productId: string) {
  const reviews = state.reviews.filter(
    (review) => review.productId === productId,
  );
  if (reviews.length === 0) return { average: 0, count: 0 };
  return {
    average:
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
    count: reviews.length,
  };
}

export function getSellerRating(
  state: Pick<MarketplaceState, "products" | "reviews">,
  sellerId: string,
) {
  const productIds = new Set(
    state.products
      .filter((product) => product.sellerId === sellerId)
      .map((product) => product.id),
  );
  const reviews = state.reviews.filter((review) =>
    productIds.has(review.productId),
  );
  if (reviews.length === 0) return { average: 0, count: 0 };
  return {
    average:
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length,
    count: reviews.length,
  };
}

export function buildCartDetails(
  cart: CartItem[],
  products: Product[],
  sellers: Seller[],
) {
  const sellerById = new Map(sellers.map((seller) => [seller.id, seller]));
  let itemCount = 0;
  let subtotalAmount = 0;

  const items = cart.flatMap((item) => {
    const resolved = resolvePurchasableCartLine({ products, sellers }, item);
    if (!resolved) return [];
    itemCount += resolved.quantity;
    subtotalAmount += resolved.unitAmount * resolved.quantity;
    return [resolved];
  });

  const itemsBySeller = new Map<string, typeof items>();
  for (const item of items) {
    itemsBySeller.set(item.seller.id, [
      ...(itemsBySeller.get(item.seller.id) ?? []),
      item,
    ]);
  }
  const groups = [...itemsBySeller.entries()].map(([sellerId, groupItems]) => ({
    seller: sellerById.get(sellerId)!,
    items: groupItems,
  }));
  const shippingAmount = groups.length * 800;
  return {
    items,
    groups,
    itemCount,
    subtotalAmount,
    shippingAmount,
    totalAmount: subtotalAmount + shippingAmount,
  };
}

export function getCartDetails(state: MarketplaceState) {
  return buildCartDetails(state.cart, state.products, state.sellers);
}

export type SellerFulfillmentView = {
  orderId: string;
  shopperId: string;
  placedAt: string;
  fulfillment: SellerFulfillment;
};
