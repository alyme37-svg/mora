# MORA Working Notes

Priorities are speed, stability, clean organization, and a polished low-end-device experience. Keep patches focused and preserve established patterns.

## Product boundary

MORA is a fictional portfolio demo, not production commerce. Never introduce real auth, backend, payments, shipping APIs, email, seller verification, or external marketplace integrations. Keep all sample identities and activity clearly fictional.

## Architecture

- Next.js App Router + TypeScript + Tailwind CSS.
- Shared primitives live in `src/components/ui`; marketplace-specific components in `src/components/marketplace`; shell/layout in `src/components/layout`.
- Domain contracts live in `src/types/marketplace.ts`.
- Deterministic demo content comes from `src/data/seed.ts`.
- `src/store/marketplace-store.ts` is the only persisted client store. Add derived data to `src/store/selectors.ts`; do not duplicate totals, ratings, or seller views in state.
- Use integer minor units for money.
- Keep components small; split by feature once a route gains real behavior.

## Multi-vendor invariant

One `MarketplaceOrder` contains seller-scoped `SellerFulfillment` groups. A seller must only read or update the group matching their seller ID. Shopper tracking reads all groups. Parent order status is derived from group statuses. Reviews require a delivered line and ratings are derived from reviews.

## Visual language

Read `design-system/mora/MASTER.md` before UI work. Preserve warm ivory surfaces, espresso typography, walnut/caramel accents, muted gold, image-led product cards, hairline borders, minimal shadows, and generous whitespace. Use Cormorant Garamond selectively and Geist for application UI. Use Lucide icons only. Avoid purple SaaS styling, glassmorphism, pill-heavy cards, large shadows, clutter, and decorative animation.

The curated project-owned visual set lives in `public/images/mora`. Use these local optimized assets before introducing remote stock imagery, and do not replace the established Mora wordmark or maker mark without an explicit brand brief. Copyright and portfolio attribution belong to Ali Elhussein; preserve the visible footer notice and `LICENSE.md`.

## Performance and UX

- Prefer server components; add `"use client"` only around interaction/state boundaries.
- Avoid broad barrel imports and heavy dependencies. Recharts and Framer Motion are not installed until a real phase needs them.
- Use `next/image` with reserved aspect ratios and responsive `sizes`.
- Maintain visible focus, semantic controls, 44px interaction targets, usable contrast, and reduced-motion support.
- Give slow future interactions an explicit loading or skeleton state.

## Routes and phase boundary

The shopper discovery, transaction lifecycle, Clay & Co. seller workspace, and Admin Lite are complete. Preserve `/`, `/shop`, `/products/[slug]`, `/wishlist`, `/stores/[slug]`, `/cart`, `/checkout`, `/orders`, and `/orders/[id]`, plus `/seller`, `/seller/products`, `/seller/orders`, `/seller/analytics`, `/seller/store`, and `/admin`. Seller metrics are derived, active product edits feed the live shopper catalog, fulfillment advances only placed → processing → shipped → delivered, and Admin Lite uses the same persisted state to suspend/reactivate sellers and products. A suspended product or seller is excluded from catalog, cart, checkout, and purchase controls. `/account` and `/about` remain intentional placeholders. Do not rebuild completed flows or expand placeholders without the next phase brief.

After changes, report files touched, checks run, and remaining risks/manual checks.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
