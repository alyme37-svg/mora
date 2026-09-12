# MORA — Curated multi-vendor marketplace

MORA is a premium interactive marketplace portfolio experience for independent makers and emerging brands. It demonstrates a complete fictional commerce lifecycle across shopper, seller, and admin roles—without a backend or real transactions.

**[Explore the live demo](https://mora-wheat.vercel.app)**

![MORA editorial marketplace home](docs/showcase/01-home.png)

## A marketplace that feels lived in

The public experience combines editorial storytelling with practical product discovery: category browsing, live search and filtering, wishlists, rich product galleries, seller storefronts, multi-seller cart groups, and a polished mock checkout.

![Marketplace browse and filters](docs/showcase/02-browse.png)

## Product detail, not a template

Product pages prioritize material, maker identity, imagery, stock-aware purchasing, and customer context. Reviews come from delivered fictional demo orders and include rating distribution, customer photography, verified-order context, and helpful feedback.

![Premium product detail](docs/showcase/03-product.png)

![Customer review experience](docs/showcase/04-reviews.png)

## One state, three perspectives

- **Shopper:** discover, wishlist, add to cart, complete a mock checkout, track seller fulfillments, and review delivered products.
- **Seller:** publish products, manage variants and inventory, update store identity, inspect analytics, and advance only their own fulfillment groups.
- **Admin Lite:** inspect marketplace activity and suspend or reactivate sellers and products without introducing enterprise complexity.

Seller changes appear in the shopper catalog. Shopper orders appear in the correct seller workspace. Fulfillment updates flow back to shopper tracking. Admin suspension immediately affects purchase eligibility.

![Clay and Co public storefront](docs/showcase/05-storefront.png)

![Seller operations dashboard](docs/showcase/06-seller.png)

![Admin Lite marketplace overview](docs/showcase/07-admin.png)

## Intentionally responsive

Mobile layouts are composed for touch rather than compressed from desktop. Navigation, product galleries, purchase actions, checkout, operational cards, and dense management views adapt around 375px while retaining MORA's warm editorial identity.

<p align="center">
  <img src="docs/showcase/08-mobile-home.png" width="320" alt="MORA mobile marketplace home" />
  &nbsp;&nbsp;&nbsp;
  <img src="docs/showcase/09-mobile-product.png" width="320" alt="MORA mobile product page" />
</p>

## Technical foundation

- Next.js App Router, TypeScript, and Tailwind CSS
- Centralized persisted Zustand marketplace state
- Deterministic fictional seed data and one-click demo reset
- Seller-scoped fulfillment groups inside multi-vendor orders
- Historical order pricing and stock-aware cart validation
- Responsive `next/image` assets, semantic controls, visible focus, and reduced-motion support

## Run locally

```bash
npm install
npm run dev
```

Then open `http://localhost:3000`.

Product rules and architecture live in [`docs/MORA_SPEC.md`](docs/MORA_SPEC.md). The visual source of truth lives in [`design-system/mora/MASTER.md`](design-system/mora/MASTER.md).

---

MORA is a fictional portfolio demonstration. No real purchases, payments, sellers, or customer data are used.

© 2026 Ali Elhussein. All rights reserved. See [`LICENSE.md`](LICENSE.md).
