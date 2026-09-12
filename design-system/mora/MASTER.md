# MORA Design System

This file is the visual source of truth. Page-specific files in `pages/` may add constraints but must not replace these foundations.

## Character

MORA is a warm editorial marketplace, not a SaaS dashboard. The interface should feel tactile, quiet, and consumer-first: large product photography, fine rules, disciplined spacing, and confident typography. The visual signature is the small offset-ring maker mark used in the brand and seller identity.

## Tokens

| Role | Value | Intent |
| --- | --- | --- |
| Canvas | `#F7F3ED` | Warm ivory page background |
| Surface | `#FFFDF9` | Primary content surface |
| Espresso | `#281F19` | Primary text and CTA |
| Walnut | `#70482D` | Brand and maker accent |
| Caramel | `#A66F49` | Interactive accent |
| Muted gold | `#C39B6A` | Ratings and restrained detail |
| Sage | `#7C856B` | Natural secondary accent |
| Border | `#E5DBD0` | Hairline separation |
| Muted text | `#6F6258` | Accessible secondary text |

- Editorial type: Cormorant Garamond, 500–700, reserved for marketing headings and brand moments.
- Interface type: Geist, 400–700, used everywhere else including seller and admin UI.
- Spacing follows a 4/8px rhythm. Page gutters are 16 / 24 / 40px; content caps at 1440px.
- Corners are restrained: 6–14px. Product images use 14px; pills are reserved for compact statuses and filters.
- Shadows are almost invisible. Prefer a border before elevation.

## Components

- Product cards are image-led, borderless outside the image, and never resemble KPI cards.
- Primary actions use espresso on ivory; secondary actions use a hairline border.
- Inputs have visible labels, 44px minimum height, and a low-contrast surface until focus.
- Statuses always combine label and color. Color is never the sole signal.
- Sheets use a light scrim and shallow shadow. Avoid glass panels and heavy blur.
- Lucide is the only icon family. Interactive icon targets are at least 44×44px.

## Motion and performance

- No page-level animation dependency in the foundation.
- Use 150–250ms color/opacity transitions for controls; product image zoom may reach 500ms.
- Never animate layout dimensions. Respect `prefers-reduced-motion` globally.
- Use responsive `next/image`, reserve image aspect ratios, and avoid runtime-heavy decoration.

## Avoid

Purple SaaS styling, neon, liquid glass, deep shadows, excessive gradients, rounded-card grids, decorative dashboards, animated counters, and ornamental motion.
