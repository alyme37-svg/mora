# MORA Product Specification

## Purpose

MORA is a fictional, premium multi-vendor marketplace portfolio demo for independent brands and creators. It should feel like a funded consumer product while remaining entirely local and deterministic.

It is not a production marketplace. Do not add real authentication, payments, shipping integrations, email, seller verification, external marketplace integrations, or a backend unless the product brief is explicitly replaced.

## Demo identities

| Role    | Person      | Store      |
| ------- | ----------- | ---------- |
| Shopper | Sarah Chen  | —          |
| Seller  | Alex Morgan | Clay & Co. |
| Admin   | Nora Reed   | —          |

The active role and user ID are persisted locally. Other fictional users exist only to make seeded orders and reviews credible.

## Marketplace rules

- Primary categories: Home & Living, Fashion, Beauty, Art & Prints, and Accessories.
- A product belongs to exactly one seller and one primary category.
- A shopper can put products from several sellers into one cart and complete one checkout.
- A `MarketplaceOrder` owns one or more `SellerFulfillment` groups, one per seller.
- Each fulfillment owns only that seller's immutable order-line snapshots, subtotal, shipping, tracking events, and status.
- Seller views must select only fulfillment groups whose `sellerId` matches the active seller.
- Shopper views show the parent order plus every fulfillment group.
- The parent order status is derived from fulfillment statuses, not independently edited.
- Reviews may be created only for products inside a delivered fulfillment from the shopper's order.
- Product ratings are derived from reviews; totals and counts are not duplicated on products.
- Archived or suspended products and suspended sellers are excluded from active catalog results.
- Admin product suspension is stored independently from seller-controlled draft/active/archived status, so seller edits cannot clear moderation.
- A store marked away remains browsable but is excluded from cart and checkout eligibility until it reopens.

## Cross-role flows

```text
Seller publishes product
  → active catalog selectors expose it to shoppers

Shopper checks out a multi-seller cart
  → one MarketplaceOrder is created
  → cart lines are grouped into SellerFulfillments
  → each seller selects only their group

Seller updates their fulfillment
  → tracking event is appended
  → parent order status is derived
  → shopper order timeline reads the same state

Shopper reviews a delivered line
  → Review is appended
  → product rating is recalculated from reviews
```

## State conventions

- `src/store/marketplace-store.ts` is the single persisted Zustand store.
- Storage key: `mora-marketplace-v1`; schema version: `1`.
- Currency values use integer minor units (`Money.amount`) to avoid floating-point totals.
- Actions own mutations; components should not write to local storage directly.
- Derived catalog, cart, rating, and seller-order information belongs in selectors.
- `resetDemoData` must recreate a fresh deterministic seed and the default shopper identity.
- Runtime-created IDs may vary; seed IDs and seed dates must remain stable.

## Seed rules

`src/data/seed.ts` produces five sellers, eighteen products, twenty existing orders, reviews, wishlist examples, and six months of seller analytics. The seeded pseudo-random generator is deterministic. Do not hand-write large sets of near-duplicate records.

All displayed people, stores, addresses, orders, and commerce activity are fictional. Remote product photographs are presentation assets only.

## Visual rules

Follow `design-system/mora/MASTER.md` and the supplied reference image. Use warm ivory surfaces, espresso type, walnut/caramel accents, muted-gold details, high-quality photography, generous whitespace, hairline borders, and nearly invisible shadows.

Use Cormorant Garamond only for editorial headings and Geist for application UI. Product cards are image-led. Avoid purple SaaS cues, glassmorphism, excessive gradients, pill-heavy layouts, giant shadows, clutter, and over-animation.

## Route map

| Route                   | Intended experience                                                               | Current phase                   |
| ----------------------- | --------------------------------------------------------------------------------- | ------------------------------- |
| `/`                     | Marketing and marketplace discovery                                               | Implemented                     |
| `/shop`                 | Catalog, search, filters, sorting                                                 | Implemented                     |
| `/products/[slug]`      | Product detail and local purchase interactions                                    | Implemented for seeded products |
| `/cart`                 | Multi-seller cart                                                                 | Implemented                     |
| `/checkout`             | Persisted shipping, mock payment, review, confirmation                            | Implemented                     |
| `/orders`               | Shopper order history                                                             | Implemented                     |
| `/orders/[id]`          | Seller-group tracking, details, delivered-item reviews                            | Implemented                     |
| `/wishlist`             | Saved products                                                                    | Implemented                     |
| `/account`              | Shopper profile                                                                   | Placeholder                     |
| `/seller`               | Seller dashboard and operational overview                                         | Implemented                     |
| `/seller/products`      | Seller-scoped catalog management                                                  | Implemented                     |
| `/seller/products/[id]` | Product editor, variants, imagery, price, and stock                               | Implemented                     |
| `/seller/orders`        | Seller-scoped fulfillment workflow                                                | Implemented                     |
| `/seller/analytics`     | Lightweight sales, order, view, and conversion trends                             | Implemented                     |
| `/seller/store`         | Persisted Clay & Co. profile and policies                                         | Implemented                     |
| `/admin`                | Lightweight moderation, local suspension controls, and read-only order inspection | Implemented                     |
| `/about`                | Portfolio context                                                                 | Placeholder                     |
| `/stores/[slug]`        | Public seller storefront                                                          | Implemented for seeded sellers  |

## Shopper transaction conventions

- Checkout drafts, the cart, created orders, and reviews all live in the single persisted marketplace store.
- Checkout uses one explicitly fictional Visa sample and never collects or transmits real payment data.
- A checkout creates one parent order with one fulfillment per seller; mock shipping is calculated per fulfillment.
- Locally created orders record whether inventory was deducted/restored; eligible cancellation restores each base or variant quantity once.
- New orders snapshot their estimated delivery window so later store-processing changes do not rewrite history.
- Shopper order detail shows every fulfillment and its independent timeline. No carrier API, map, or real tracking is implied.
- Only an unreviewed product line inside a delivered fulfillment can create a review.
- Product and seller ratings are derived live from persisted reviews.

## Admin Lite conventions

- The portfolio `View demo` control switches between Shopper, Seller, and Admin without creating separate state copies. The selected role and all marketplace changes persist locally through the same store.
- Admin Lite is intentionally limited to a status overview, fictional users/sellers/products/orders, seller and product suspension/reactivation, order inspection, and a confirmed deterministic reset.
- Suspending a product removes it from local cart lines and active discovery. Suspending a seller removes that seller's products from active discovery and local cart lines. Neither action alters historical order records.
- Resetting demo data restores the deterministic original seed and default Shopper identity.

## Phase boundary

The foundation, shopper discovery, shopper transaction lifecycle, Clay & Co. seller workspace, and Admin Lite are implemented. Account and about remain intentional placeholders. Do not expand those routes until a later phase explicitly requests it.

## Shopper discovery conventions

- Marketing, product, and storefront pages stay server-rendered where possible.
- Local client islands own only filtering, galleries, purchase controls, wishlist, follow, and demo-role selection.
- All visible filters and accordions must remain functional; do not add decorative dead controls.
- Public storefronts live at `/stores/[slug]`; `/seller` is reserved for the seller workspace.
- `View demo` is portfolio chrome, not part of Mora's customer product.

## Seller conventions

- The demo seller is Alex Morgan of Clay & Co. (`seller_clay-co`).
- Seller dashboard metrics and top products are derived from orders, fulfillments, and seeded analytics rather than stored as duplicate totals.
- Seller order screens select only Clay & Co. fulfillment groups. Fulfillment status advances one valid step at a time: placed → processing → shipped → delivered.
- Product and store edits use the centralized persisted store. Active products are exposed to the live shopper catalog immediately; drafts, archived items, and suspended items are excluded.
- Product imagery is selected from the curated demo asset library. There is no upload service or external storage.
