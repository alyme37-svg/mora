"use client";

import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import {
  createMarketplaceSeed,
  demoIdentities,
  SHOWCASE_REVIEW_ORDER_IDS,
} from "@/data/seed";
import {
  productGallery,
  productGalleryVisuals,
  productVisuals,
} from "@/data/presentation";
import { addMoney, usd } from "@/lib/money";
import { makeId, slugify } from "@/lib/utils";
import {
  isValidFulfillmentTransition,
  reconcileCart,
  resolvePurchasableCartLine,
} from "@/store/marketplace-guards";
import type {
  AddProductInput,
  AddReviewInput,
  CartItem,
  CheckoutDraft,
  CheckoutStep,
  CreateOrderInput,
  DemoRole,
  MarketplaceOrder,
  MarketplaceSeed,
  OrderLineItem,
  OrderStatus,
  Product,
  StoreSettings,
} from "@/types/marketplace";

interface MarketplaceActions {
  addProduct: (input: AddProductInput) => string;
  updateProduct: (
    productId: string,
    updates: Partial<Omit<Product, "id" | "sellerId" | "adminSuspended">>,
  ) => void;
  archiveProduct: (productId: string) => void;
  toggleWishlist: (productId: string) => void;
  toggleFollowSeller: (sellerId: string) => void;
  addToCart: (productId: string, variantId?: string, quantity?: number) => void;
  updateCartQuantity: (
    productId: string,
    quantity: number,
    variantId?: string,
  ) => void;
  removeFromCart: (productId: string, variantId?: string) => void;
  clearCart: () => void;
  setCheckoutStep: (step: CheckoutStep) => void;
  updateCheckoutShipping: (
    updates: Partial<CheckoutDraft["shippingAddress"]>,
  ) => void;
  resetCheckoutDraft: () => void;
  createOrder: (input: CreateOrderInput) => string | null;
  cancelOrder: (orderId: string) => void;
  updateFulfillmentStatus: (
    orderId: string,
    fulfillmentId: string,
    status: OrderStatus,
    sellerId: string,
  ) => void;
  addReview: (input: AddReviewInput) => string | null;
  updateStoreSettings: (
    sellerId: string,
    updates: Partial<StoreSettings>,
  ) => void;
  suspendProduct: (productId: string) => void;
  reactivateProduct: (productId: string) => void;
  suspendSeller: (sellerId: string) => void;
  reactivateSeller: (sellerId: string) => void;
  changeDemoRole: (role: DemoRole) => void;
  resetDemoData: () => void;
}

export interface MarketplaceState extends MarketplaceSeed, MarketplaceActions {
  demoRole: DemoRole;
  activeUserId: string;
  checkoutDraft: CheckoutDraft;
}

export const MARKETPLACE_STORAGE_KEY = "mora-marketplace-v1";

function cartKey(productId: string, variantId?: string) {
  return `${productId}:${variantId ?? "default"}`;
}

function deriveOrderStatus(statuses: OrderStatus[]): OrderStatus {
  if (statuses.every((status) => status === "cancelled")) return "cancelled";
  if (
    statuses.every((status) => status === "delivered" || status === "cancelled")
  )
    return "delivered";
  if (statuses.some((status) => status === "shipped" || status === "delivered"))
    return "shipped";
  if (statuses.some((status) => status === "processing")) return "processing";
  return "placed";
}

function initialState() {
  const seed = createMarketplaceSeed();
  return {
    ...seed,
    demoRole: "shopper" as const,
    activeUserId: demoIdentities.shopperUserId,
    checkoutDraft: {
      step: "shipping" as const,
      shippingAddress: seed.shopperProfiles[0].defaultAddress,
      paymentMethodLabel: "Fictional Visa ending in 4242",
    },
  };
}

function freshCheckoutDraft(): CheckoutDraft {
  const seed = createMarketplaceSeed();
  return {
    step: "shipping",
    shippingAddress: seed.shopperProfiles[0].defaultAddress,
    paymentMethodLabel: "Fictional Visa ending in 4242",
  };
}

function addBusinessDays(value: Date, days: number) {
  const result = new Date(value);
  let remaining = Math.max(0, Math.floor(days));
  while (remaining > 0) {
    result.setUTCDate(result.getUTCDate() + 1);
    const day = result.getUTCDay();
    if (day !== 0 && day !== 6) remaining -= 1;
  }
  return result;
}

export const useMarketplaceStore = create<MarketplaceState>()(
  persist(
    (set, get) => ({
      ...initialState(),

      addProduct: (input) => {
        const id = makeId("product");
        const product: Product = {
          id,
          sellerId: input.sellerId,
          categoryId: input.categoryId,
          slug: `${slugify(input.name)}-${id.slice(-6)}`,
          name: input.name,
          description: input.description,
          price: input.price,
          status: input.status ?? "active",
          inventory: input.inventory,
          images: input.images,
          materials: input.materials ?? [],
          variants: input.variants ?? [],
          featured: false,
          createdAt: new Date().toISOString(),
        };
        set((state) => ({ products: [...state.products, product] }));
        return id;
      },

      updateProduct: (productId, updates) =>
        set((state) => {
          const products = state.products.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  ...updates,
                  adminSuspended: product.adminSuspended,
                }
              : product,
          );
          return {
            products,
            cart: reconcileCart(state.cart, {
              products,
              sellers: state.sellers,
            }),
          };
        }),

      archiveProduct: (productId) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? { ...product, status: "archived" }
              : product,
          ),
          cart: state.cart.filter((item) => item.productId !== productId),
        })),

      toggleWishlist: (productId) =>
        set((state) => {
          const shopperId = demoIdentities.shopperUserId;
          const exists = state.wishlist.some(
            (item) =>
              item.shopperId === shopperId && item.productId === productId,
          );
          return {
            wishlist: exists
              ? state.wishlist.filter(
                  (item) =>
                    !(
                      item.shopperId === shopperId &&
                      item.productId === productId
                    ),
                )
              : [
                  ...state.wishlist,
                  { shopperId, productId, createdAt: new Date().toISOString() },
                ],
          };
        }),

      toggleFollowSeller: (sellerId) =>
        set((state) => ({
          followedSellerIds: state.followedSellerIds.includes(sellerId)
            ? state.followedSellerIds.filter((id) => id !== sellerId)
            : [...state.followedSellerIds, sellerId],
        })),

      addToCart: (productId, variantId, quantity = 1) =>
        set((state) => {
          const addedQuantity = Number.isFinite(quantity)
            ? Math.max(1, Math.floor(quantity))
            : 1;
          const resolved = resolvePurchasableCartLine(
            { products: state.products, sellers: state.sellers },
            {
              productId,
              variantId,
              quantity: addedQuantity,
              addedAt: new Date().toISOString(),
            },
          );
          if (!resolved) return state;
          const key = cartKey(productId, variantId);
          const current = state.cart.find(
            (item) => cartKey(item.productId, item.variantId) === key,
          );
          if (!current) {
            return {
              cart: [
                ...state.cart,
                {
                  productId,
                  variantId,
                  quantity: resolved.quantity,
                  addedAt: resolved.addedAt,
                },
              ],
            };
          }
          return {
            cart: state.cart.map((item) =>
              cartKey(item.productId, item.variantId) === key
                ? {
                    ...item,
                    quantity: Math.min(
                      resolved.stock,
                      item.quantity + addedQuantity,
                    ),
                  }
                : item,
            ),
          };
        }),

      updateCartQuantity: (productId, quantity, variantId) => {
        if (quantity <= 0) {
          get().removeFromCart(productId, variantId);
          return;
        }
        const key = cartKey(productId, variantId);
        set((state) => {
          const resolved = resolvePurchasableCartLine(
            { products: state.products, sellers: state.sellers },
            {
              productId,
              variantId,
              quantity,
              addedAt: new Date().toISOString(),
            },
          );
          if (!resolved) {
            return {
              cart: state.cart.filter(
                (item) => cartKey(item.productId, item.variantId) !== key,
              ),
            };
          }
          return {
            cart: state.cart.map((item) =>
              cartKey(item.productId, item.variantId) === key
                ? { ...item, quantity: resolved.quantity }
                : item,
            ),
          };
        });
      },

      removeFromCart: (productId, variantId) => {
        const key = cartKey(productId, variantId);
        set((state) => ({
          cart: state.cart.filter(
            (item) => cartKey(item.productId, item.variantId) !== key,
          ),
        }));
      },

      clearCart: () => set({ cart: [] }),

      setCheckoutStep: (step) =>
        set((state) => ({ checkoutDraft: { ...state.checkoutDraft, step } })),

      updateCheckoutShipping: (updates) =>
        set((state) => ({
          checkoutDraft: {
            ...state.checkoutDraft,
            shippingAddress: {
              ...state.checkoutDraft.shippingAddress,
              ...updates,
            },
          },
        })),

      resetCheckoutDraft: () => set({ checkoutDraft: freshCheckoutDraft() }),

      createOrder: (input) => {
        const state = get();
        const validCart = reconcileCart(state.cart, {
          products: state.products,
          sellers: state.sellers,
        });
        if (validCart.length === 0) {
          if (state.cart.length > 0) set({ cart: [] });
          return null;
        }

        const linesBySeller = new Map<string, OrderLineItem[]>();
        for (const item of validCart) {
          const resolved = resolvePurchasableCartLine(
            { products: state.products, sellers: state.sellers },
            item,
          );
          if (!resolved) continue;
          const unitPrice = usd(resolved.unitAmount);
          const line: OrderLineItem = {
            id: makeId("line"),
            productId: resolved.product.id,
            variantId: resolved.variant?.id,
            productName: resolved.product.name,
            productImage: resolved.product.images[0],
            variantName: resolved.variant?.name,
            quantity: resolved.quantity,
            unitPrice,
          };
          linesBySeller.set(resolved.product.sellerId, [
            ...(linesBySeller.get(resolved.product.sellerId) ?? []),
            line,
          ]);
        }
        if (linesBySeller.size === 0) return null;

        const now = new Date().toISOString();
        const fulfillments = [...linesBySeller.entries()].map(
          ([sellerId, lineItems]) => ({
            id: makeId("fulfillment"),
            sellerId,
            status: "placed" as const,
            lineItems,
            subtotal: usd(
              lineItems.reduce(
                (sum, line) => sum + line.unitPrice.amount * line.quantity,
                0,
              ),
            ),
            shipping: usd(800),
            trackingEvents: [
              {
                id: makeId("event"),
                status: "placed" as const,
                label: "Order placed",
                occurredAt: now,
              },
            ],
            updatedAt: now,
          }),
        );
        const processingDays = Math.max(
          2,
          ...fulfillments.map(
            (group) =>
              state.sellers.find((seller) => seller.id === group.sellerId)
                ?.settings.processingDays ?? 3,
          ),
        );
        const subtotal = addMoney(fulfillments.map((group) => group.subtotal));
        const shipping = addMoney(fulfillments.map((group) => group.shipping));
        const order: MarketplaceOrder = {
          id: makeId("order"),
          shopperId: demoIdentities.shopperUserId,
          status: "placed",
          fulfillments,
          shippingAddress: input.shippingAddress,
          subtotal,
          shipping,
          total: addMoney([subtotal, shipping]),
          paymentMethodLabel:
            input.paymentMethodLabel ?? "Demo card ending in 4242",
          placedAt: now,
          updatedAt: now,
          inventoryDeducted: true,
          inventoryRestored: false,
          estimatedDeliveryStart: addBusinessDays(
            new Date(now),
            processingDays + 3,
          ).toISOString(),
          estimatedDeliveryEnd: addBusinessDays(
            new Date(now),
            processingDays + 6,
          ).toISOString(),
        };
        const purchasedBySelection = new Map(
          validCart.map((item) => [
            cartKey(item.productId, item.variantId),
            item.quantity,
          ]),
        );
        set((current) => ({
          products: current.products.map((product) => {
            if (product.variants.length > 0) {
              return {
                ...product,
                variants: product.variants.map((variant) => {
                  const purchased = purchasedBySelection.get(
                    cartKey(product.id, variant.id),
                  );
                  return purchased
                    ? {
                        ...variant,
                        inventory: Math.max(0, variant.inventory - purchased),
                      }
                    : variant;
                }),
              };
            }
            const purchased = purchasedBySelection.get(cartKey(product.id));
            return purchased
              ? {
                  ...product,
                  inventory: Math.max(0, product.inventory - purchased),
                }
              : product;
          }),
          orders: [order, ...current.orders],
          cart: [],
          checkoutDraft: freshCheckoutDraft(),
        }));
        return order.id;
      },

      cancelOrder: (orderId) =>
        set((state) => {
          const order = state.orders.find(
            (candidate) => candidate.id === orderId,
          );
          if (!order || !["placed", "processing"].includes(order.status))
            return state;

          const shouldRestoreInventory =
            order.inventoryDeducted === true &&
            order.inventoryRestored !== true;
          const purchased = new Map<string, number>();
          if (shouldRestoreInventory) {
            for (const group of order.fulfillments) {
              for (const line of group.lineItems) {
                const key = cartKey(line.productId, line.variantId);
                purchased.set(key, (purchased.get(key) ?? 0) + line.quantity);
              }
            }
          }

          const now = new Date().toISOString();
          const cancelledOrder: MarketplaceOrder = {
            ...order,
            status: "cancelled",
            updatedAt: now,
            inventoryRestored: shouldRestoreInventory
              ? true
              : order.inventoryRestored,
            fulfillments: order.fulfillments.map((group) => ({
              ...group,
              status: "cancelled",
              updatedAt: now,
              trackingEvents: [
                ...group.trackingEvents,
                {
                  id: makeId("event"),
                  status: "cancelled",
                  label: "Order cancelled",
                  occurredAt: now,
                },
              ],
            })),
          };

          return {
            orders: state.orders.map((candidate) =>
              candidate.id === orderId ? cancelledOrder : candidate,
            ),
            products: shouldRestoreInventory
              ? state.products.map((product) => {
                  if (product.variants.length) {
                    return {
                      ...product,
                      variants: product.variants.map((variant) => ({
                        ...variant,
                        inventory:
                          variant.inventory +
                          (purchased.get(cartKey(product.id, variant.id)) ?? 0),
                      })),
                    };
                  }
                  return {
                    ...product,
                    inventory:
                      product.inventory +
                      (purchased.get(cartKey(product.id)) ?? 0),
                  };
                })
              : state.products,
          };
        }),

      updateFulfillmentStatus: (orderId, fulfillmentId, status, sellerId) =>
        set((state) => ({
          orders: state.orders.map((order) => {
            if (order.id !== orderId) return order;
            const now = new Date().toISOString();
            const fulfillments = order.fulfillments.map((group) => {
              const canUpdate =
                group.id === fulfillmentId &&
                group.sellerId === sellerId &&
                isValidFulfillmentTransition(group.status, status);
              return canUpdate
                ? {
                    ...group,
                    status,
                    updatedAt: now,
                    trackingNumber:
                      status === "shipped" && !group.trackingNumber
                        ? `MORA${Date.now().toString().slice(-8)}`
                        : group.trackingNumber,
                    trackingEvents: [
                      ...group.trackingEvents,
                      {
                        id: makeId("event"),
                        status,
                        label: `Order ${status}`,
                        occurredAt: now,
                      },
                    ],
                  }
                : group;
            });
            if (
              fulfillments.every(
                (group, index) => group === order.fulfillments[index],
              )
            )
              return order;
            return {
              ...order,
              fulfillments,
              status: deriveOrderStatus(
                fulfillments.map((group) => group.status),
              ),
              updatedAt: now,
            };
          }),
        })),

      addReview: (input) => {
        const state = get();
        const shopperId = demoIdentities.shopperUserId;
        const order = state.orders.find(
          (candidate) => candidate.id === input.orderId,
        );
        const deliveredProduct = order?.fulfillments.some(
          (group) =>
            group.status === "delivered" &&
            group.lineItems.some((line) => line.productId === input.productId),
        );
        const duplicate = state.reviews.some(
          (review) =>
            review.orderId === input.orderId &&
            review.productId === input.productId,
        );
        const validRating =
          Number.isInteger(input.rating) &&
          input.rating >= 1 &&
          input.rating <= 5;
        const title = input.title.trim();
        const body = input.body.trim();
        if (
          !order ||
          order.shopperId !== shopperId ||
          !deliveredProduct ||
          duplicate ||
          !validRating ||
          title.length < 3 ||
          body.length < 8
        )
          return null;

        const id = makeId("review");
        set((current) => ({
          reviews: [
            {
              id,
              shopperId,
              orderId: input.orderId,
              productId: input.productId,
              rating: input.rating,
              title,
              body,
              createdAt: new Date().toISOString(),
            },
            ...current.reviews,
          ],
        }));
        return id;
      },

      updateStoreSettings: (sellerId, updates) =>
        set((state) => {
          const sellers = state.sellers.map((seller) =>
            seller.id === sellerId
              ? { ...seller, settings: { ...seller.settings, ...updates } }
              : seller,
          );
          return {
            sellers,
            cart: reconcileCart(state.cart, {
              products: state.products,
              sellers,
            }),
          };
        }),

      suspendProduct: (productId) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  status:
                    product.status === "suspended" ? "active" : product.status,
                  adminSuspended: true,
                }
              : product,
          ),
          cart: state.cart.filter((item) => item.productId !== productId),
        })),

      reactivateProduct: (productId) =>
        set((state) => ({
          products: state.products.map((product) =>
            product.id === productId
              ? {
                  ...product,
                  status:
                    product.status === "suspended" ? "active" : product.status,
                  adminSuspended: false,
                }
              : product,
          ),
        })),

      suspendSeller: (sellerId) =>
        set((state) => ({
          sellers: state.sellers.map((seller) =>
            seller.id === sellerId && seller.status === "active"
              ? { ...seller, status: "suspended" }
              : seller,
          ),
          cart: state.cart.filter((item) => {
            const product = state.products.find(
              (candidate) => candidate.id === item.productId,
            );
            return product?.sellerId !== sellerId;
          }),
        })),

      reactivateSeller: (sellerId) =>
        set((state) => ({
          sellers: state.sellers.map((seller) =>
            seller.id === sellerId && seller.status === "suspended"
              ? { ...seller, status: "active" }
              : seller,
          ),
        })),

      changeDemoRole: (role) => {
        const identityByRole: Record<DemoRole, string> = {
          shopper: demoIdentities.shopperUserId,
          seller: demoIdentities.sellerUserId,
          admin: demoIdentities.adminUserId,
        };
        set({ demoRole: role, activeUserId: identityByRole[role] });
      },

      resetDemoData: () => set(initialState()),
    }),
    {
      name: MARKETPLACE_STORAGE_KEY,
      version: 6,
      migrate: (persistedState, version) => {
        const persisted = persistedState as Partial<MarketplaceState>;
        let migrated: Partial<MarketplaceState> = { ...persisted };

        if (version < 3 && persisted.products) {
          migrated = {
            ...migrated,
            products: persisted.products.map((product) => {
              const curatedImage = productVisuals[product.slug];
              const curatedGallery = productGalleryVisuals[product.slug];
              return curatedImage || curatedGallery
                ? {
                    ...product,
                    images:
                      curatedGallery ?? productGallery(curatedImage as string),
                  }
                : product;
            }),
          };
        }

        if (version < 4) {
          const seed = createMarketplaceSeed();
          const showcaseOrderIds = new Set<string>(SHOWCASE_REVIEW_ORDER_IDS);
          const existingOrderIds = new Set(
            (migrated.orders ?? []).map((order) => order.id),
          );
          const existingReviewIds = new Set(
            (migrated.reviews ?? []).map((review) => review.id),
          );
          migrated = {
            ...migrated,
            orders: [
              ...(migrated.orders ?? []),
              ...seed.orders.filter(
                (order) =>
                  showcaseOrderIds.has(order.id) &&
                  !existingOrderIds.has(order.id),
              ),
            ],
            reviews: [
              ...(migrated.reviews ?? []),
              ...seed.reviews.filter(
                (review) =>
                  showcaseOrderIds.has(review.orderId) &&
                  !existingReviewIds.has(review.id),
              ),
            ],
          };
        }

        if (version < 5) {
          const freshReviewById = new Map(
            createMarketplaceSeed().reviews.map((review) => [
              review.id,
              review,
            ]),
          );
          migrated = {
            ...migrated,
            reviews: (migrated.reviews ?? []).map(
              (review) => freshReviewById.get(review.id) ?? review,
            ),
          };
        }

        if (version < 6) {
          const freshSeed = createMarketplaceSeed();
          const freshProductById = new Map(
            freshSeed.products.map((product) => [product.id, product]),
          );
          const freshSellerById = new Map(
            freshSeed.sellers.map((seller) => [seller.id, seller]),
          );
          migrated = {
            ...migrated,
            products: (migrated.products ?? []).map((product) =>
              product.description.includes("fictional MORA marketplace demo")
                ? {
                    ...product,
                    description:
                      freshProductById.get(product.id)?.description ??
                      product.description,
                  }
                : product,
            ),
            sellers: (migrated.sellers ?? []).map((seller) =>
              seller.settings.story.toLowerCase().includes("fictional")
                ? {
                    ...seller,
                    settings: {
                      ...seller.settings,
                      story:
                        freshSellerById.get(seller.id)?.settings.story ??
                        seller.settings.story,
                    },
                  }
                : seller,
            ),
          };
        }

        return migrated;
      },
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        users: state.users,
        shopperProfiles: state.shopperProfiles,
        sellers: state.sellers,
        categories: state.categories,
        products: state.products,
        cart: state.cart,
        orders: state.orders,
        reviews: state.reviews,
        wishlist: state.wishlist,
        followedSellerIds: state.followedSellerIds,
        sellerAnalytics: state.sellerAnalytics,
        demoRole: state.demoRole,
        activeUserId: state.activeUserId,
        checkoutDraft: state.checkoutDraft,
      }),
      merge: (persistedState, currentState) => {
        const persisted = persistedState as Partial<MarketplaceState>;
        const products = (persisted.products ?? currentState.products).map(
          (product) =>
            product.status === "suspended"
              ? { ...product, status: "active" as const, adminSuspended: true }
              : product,
        );
        const sellers = persisted.sellers ?? currentState.sellers;
        return {
          ...currentState,
          ...persisted,
          products,
          sellers,
          cart: reconcileCart(persisted.cart ?? currentState.cart, {
            products,
            sellers,
          }),
        };
      },
    },
  ),
);

export type { CartItem };
