import type {
  CartItem,
  OrderStatus,
  Product,
  ProductVariant,
  Seller,
} from "@/types/marketplace";

type CatalogSnapshot = {
  products: Product[];
  sellers: Seller[];
};

export function isProductAdminSuspended(product: Product) {
  return product.adminSuspended === true || product.status === "suspended";
}

export function getProductStock(product: Product) {
  return product.variants.length
    ? product.variants.reduce(
        (sum, variant) => sum + normalizedStock(variant.inventory),
        0,
      )
    : normalizedStock(product.inventory);
}

export function isSellerAcceptingOrders(seller: Seller) {
  return (
    seller.status === "active" && seller.settings.storefrontStatus !== "away"
  );
}

export type PurchasableCartLine = CartItem & {
  product: Product;
  seller: Seller;
  variant?: ProductVariant;
  stock: number;
  unitAmount: number;
};

function normalizedStock(value: number) {
  return Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
}

export function resolvePurchasableCartLine(
  catalog: CatalogSnapshot,
  item: CartItem,
): PurchasableCartLine | null {
  const product = catalog.products.find(
    (candidate) =>
      candidate.id === item.productId &&
      candidate.status === "active" &&
      !isProductAdminSuspended(candidate),
  );
  const seller = product
    ? catalog.sellers.find(
        (candidate) =>
          candidate.id === product.sellerId &&
          isSellerAcceptingOrders(candidate),
      )
    : undefined;
  if (!product || !seller) return null;

  const variant = item.variantId
    ? product.variants.find((candidate) => candidate.id === item.variantId)
    : undefined;
  if (
    (product.variants.length > 0 && !variant) ||
    (product.variants.length === 0 && item.variantId)
  ) {
    return null;
  }

  const stock = normalizedStock(variant?.inventory ?? product.inventory);
  const unitAmount =
    product.price.amount + (variant?.priceAdjustment.amount ?? 0);
  if (stock === 0 || !Number.isFinite(unitAmount) || unitAmount < 0)
    return null;

  const requestedQuantity = Number.isFinite(item.quantity)
    ? Math.floor(item.quantity)
    : 1;
  return {
    ...item,
    quantity: Math.min(stock, Math.max(1, requestedQuantity)),
    product,
    seller,
    variant,
    stock,
    unitAmount,
  };
}

export function reconcileCart(
  cart: CartItem[],
  catalog: CatalogSnapshot,
): CartItem[] {
  return cart.flatMap((item) => {
    const resolved = resolvePurchasableCartLine(catalog, item);
    if (!resolved) return [];
    return [
      {
        productId: resolved.productId,
        variantId: resolved.variantId,
        quantity: resolved.quantity,
        addedAt: resolved.addedAt,
      },
    ];
  });
}

const nextFulfillmentStatus: Partial<Record<OrderStatus, OrderStatus>> = {
  placed: "processing",
  processing: "shipped",
  shipped: "delivered",
};

export function isValidFulfillmentTransition(
  current: OrderStatus,
  next: OrderStatus,
) {
  return nextFulfillmentStatus[current] === next;
}
