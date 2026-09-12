export type EntityId = string;
export type CurrencyCode = "USD";

export type DemoRole = "shopper" | "seller" | "admin";
export type UserStatus = "active" | "suspended";
export type ProductStatus = "draft" | "active" | "archived" | "suspended";
export type OrderStatus =
  "placed" | "processing" | "shipped" | "delivered" | "cancelled";
export type CheckoutStep = "shipping" | "payment" | "review";

export interface Money {
  amount: number;
  currency: CurrencyCode;
}

export interface User {
  id: EntityId;
  name: string;
  email: string;
  avatarUrl?: string;
  role: DemoRole;
  status: UserStatus;
}

export interface Address {
  name: string;
  line1: string;
  line2?: string;
  city: string;
  region: string;
  postalCode: string;
  country: string;
}

export interface ShopperProfile {
  userId: EntityId;
  defaultAddress: Address;
}

export interface StoreSettings {
  displayName: string;
  tagline: string;
  story: string;
  accentColor: string;
  announcement?: string;
  policies?: string;
  logoImageUrl?: string;
  coverImageUrl?: string;
  storefrontStatus?: "open" | "away";
  acceptsReturns: boolean;
  processingDays: number;
}

export interface Seller {
  id: EntityId;
  ownerUserId: EntityId;
  slug: string;
  status: UserStatus;
  avatarUrl?: string;
  location: string;
  joinedAt: string;
  settings: StoreSettings;
}

export interface Category {
  id: EntityId;
  slug: string;
  name: string;
  description: string;
}

export interface ProductVariant {
  id: EntityId;
  name: string;
  sku: string;
  optionValues: Record<string, string>;
  priceAdjustment: Money;
  inventory: number;
}

export interface Product {
  id: EntityId;
  sellerId: EntityId;
  categoryId: EntityId;
  slug: string;
  name: string;
  description: string;
  price: Money;
  compareAtPrice?: Money;
  status: ProductStatus;
  /** Moderation is independent from the seller-controlled publishing status. */
  adminSuspended?: boolean;
  inventory: number;
  images: string[];
  materials: string[];
  variants: ProductVariant[];
  featured: boolean;
  createdAt: string;
}

export interface CartItem {
  productId: EntityId;
  variantId?: EntityId;
  quantity: number;
  addedAt: string;
}

export interface OrderLineItem {
  id: EntityId;
  productId: EntityId;
  variantId?: EntityId;
  productName: string;
  productImage: string;
  variantName?: string;
  quantity: number;
  unitPrice: Money;
}

export interface TrackingEvent {
  id: EntityId;
  status: OrderStatus;
  label: string;
  occurredAt: string;
}

export interface SellerFulfillment {
  id: EntityId;
  sellerId: EntityId;
  status: OrderStatus;
  lineItems: OrderLineItem[];
  subtotal: Money;
  shipping: Money;
  trackingNumber?: string;
  trackingEvents: TrackingEvent[];
  updatedAt: string;
}

export interface MarketplaceOrder {
  id: EntityId;
  shopperId: EntityId;
  status: OrderStatus;
  fulfillments: SellerFulfillment[];
  shippingAddress: Address;
  subtotal: Money;
  shipping: Money;
  total: Money;
  paymentMethodLabel: string;
  placedAt: string;
  updatedAt: string;
  /** True only for locally-created orders whose stock was deducted. */
  inventoryDeducted?: boolean;
  inventoryRestored?: boolean;
  estimatedDeliveryStart?: string;
  estimatedDeliveryEnd?: string;
}

export interface Review {
  id: EntityId;
  orderId: EntityId;
  productId: EntityId;
  shopperId: EntityId;
  rating: 1 | 2 | 3 | 4 | 5;
  title: string;
  body: string;
  createdAt: string;
}

export interface WishlistItem {
  shopperId: EntityId;
  productId: EntityId;
  createdAt: string;
}

export interface SellerAnalyticsPoint {
  sellerId: EntityId;
  month: string;
  revenue: Money;
  orders: number;
  views: number;
}

export interface MarketplaceSeed {
  users: User[];
  shopperProfiles: ShopperProfile[];
  sellers: Seller[];
  categories: Category[];
  products: Product[];
  cart: CartItem[];
  orders: MarketplaceOrder[];
  reviews: Review[];
  wishlist: WishlistItem[];
  followedSellerIds: EntityId[];
  sellerAnalytics: SellerAnalyticsPoint[];
}

export interface AddProductInput {
  sellerId: EntityId;
  categoryId: EntityId;
  name: string;
  description: string;
  price: Money;
  inventory: number;
  status?: Extract<ProductStatus, "draft" | "active">;
  images: string[];
  materials?: string[];
  variants?: ProductVariant[];
}

export interface CreateOrderInput {
  shippingAddress: Address;
  paymentMethodLabel?: string;
}

export interface CheckoutDraft {
  step: CheckoutStep;
  shippingAddress: Address;
  paymentMethodLabel: string;
}

export interface AddReviewInput {
  orderId: EntityId;
  productId: EntityId;
  rating: Review["rating"];
  title: string;
  body: string;
}
