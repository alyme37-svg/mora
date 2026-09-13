import { addMoney, usd } from "@/lib/money";
import {
  productGallery,
  productGalleryVisuals,
  productVisuals,
} from "@/data/presentation";
import type {
  Category,
  MarketplaceOrder,
  MarketplaceSeed,
  OrderLineItem,
  OrderStatus,
  Product,
  Review,
  Seller,
  SellerFulfillment,
  User,
} from "@/types/marketplace";

const SEED_DATE = new Date("2026-06-01T10:00:00.000Z");

const image = (id: string) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=85`;

function seededRandom(seed = 4107) {
  let state = seed >>> 0;
  return () => {
    state += 0x6d2b79f5;
    let value = state;
    value = Math.imul(value ^ (value >>> 15), value | 1);
    value ^= value + Math.imul(value ^ (value >>> 7), value | 61);
    return ((value ^ (value >>> 14)) >>> 0) / 4294967296;
  };
}

function isoDaysBefore(days: number, hour = 10) {
  const date = new Date(SEED_DATE);
  date.setUTCDate(date.getUTCDate() - days);
  date.setUTCHours(hour, 0, 0, 0);
  return date.toISOString();
}

const categories: Category[] = [
  [
    "home-living",
    "Home & Living",
    "Quiet objects that make everyday spaces feel considered.",
  ],
  ["fashion", "Fashion", "Small-run pieces made for an enduring wardrobe."],
  [
    "beauty",
    "Beauty",
    "Thoughtful rituals with gentle, ingredient-led formulas.",
  ],
  [
    "art-prints",
    "Art & Prints",
    "Original perspectives for walls, desks, and shelves.",
  ],
  [
    "accessories",
    "Accessories",
    "Useful finishing pieces with a maker's point of view.",
  ],
].map(([slug, name, description]) => ({
  id: `cat_${slug}`,
  slug,
  name,
  description,
}));

const users: User[] = [
  {
    id: "user_sarah",
    name: "Sarah Chen",
    email: "sarah@example.test",
    role: "shopper",
    status: "active",
  },
  {
    id: "user_maya",
    name: "Maya Brooks",
    email: "maya@example.test",
    role: "shopper",
    status: "active",
  },
  {
    id: "user_jules",
    name: "Jules Martin",
    email: "jules@example.test",
    role: "shopper",
    status: "active",
  },
  {
    id: "user_alex",
    name: "Alex Morgan",
    email: "alex@clayandco.example",
    role: "seller",
    status: "active",
  },
  {
    id: "user_ines",
    name: "Ines Laurent",
    email: "ines@lume.example",
    role: "seller",
    status: "active",
  },
  {
    id: "user_omar",
    name: "Omar Vale",
    email: "omar@minimalist.example",
    role: "seller",
    status: "active",
  },
  {
    id: "user_elena",
    name: "Elena Rossi",
    email: "elena@atelier.example",
    role: "seller",
    status: "active",
  },
  {
    id: "user_theo",
    name: "Theo Reed",
    email: "theo@cozyliving.example",
    role: "seller",
    status: "active",
  },
  {
    id: "user_nora",
    name: "Nora Reed",
    email: "nora@mora.example",
    role: "admin",
    status: "active",
  },
];

const sellers: Seller[] = [
  {
    id: "seller_clay-co",
    ownerUserId: "user_alex",
    slug: "clay-and-co",
    status: "active",
    location: "Portland, OR",
    joinedAt: "2024-03-14T00:00:00.000Z",
    settings: {
      displayName: "Clay & Co.",
      tagline: "Objects shaped slowly, for rituals kept daily.",
      story:
        "A two-person ceramics studio exploring useful forms and earthy glazes.",
      accentColor: "#A66F49",
      announcement: "Small batches, released every Friday.",
      policies:
        "Returns are accepted within 14 days on unused pieces. Made-to-order work is final sale.",
      storefrontStatus: "open",
      acceptsReturns: true,
      processingDays: 3,
    },
  },
  {
    id: "seller_lume-studio",
    ownerUserId: "user_ines",
    slug: "lume-studio",
    status: "active",
    location: "Brooklyn, NY",
    joinedAt: "2024-05-08T00:00:00.000Z",
    settings: {
      displayName: "Lume Studio",
      tagline: "Soft light and quieter evenings.",
      story: "A lighting and scent studio inspired by calm domestic spaces.",
      accentColor: "#C39B6A",
      acceptsReturns: true,
      processingDays: 2,
    },
  },
  {
    id: "seller_the-minimalist",
    ownerUserId: "user_omar",
    slug: "the-minimalist",
    status: "active",
    location: "Austin, TX",
    joinedAt: "2024-07-19T00:00:00.000Z",
    settings: {
      displayName: "The Minimalist",
      tagline: "Fewer, better things to wear and carry.",
      story: "An independent label making simple pieces from natural fibers.",
      accentColor: "#7C856B",
      acceptsReturns: true,
      processingDays: 2,
    },
  },
  {
    id: "seller_atelier-home",
    ownerUserId: "user_elena",
    slug: "atelier-home",
    status: "active",
    location: "Chicago, IL",
    joinedAt: "2024-09-02T00:00:00.000Z",
    settings: {
      displayName: "Atelier Home",
      tagline: "Artful utility for the lived-in home.",
      story:
        "A creative collective pairing small furniture runs with limited-edition prints.",
      accentColor: "#70482D",
      acceptsReturns: false,
      processingDays: 5,
    },
  },
  {
    id: "seller_cozy-living",
    ownerUserId: "user_theo",
    slug: "cozy-living",
    status: "active",
    location: "Burlington, VT",
    joinedAt: "2024-10-11T00:00:00.000Z",
    settings: {
      displayName: "Cozy Living",
      tagline: "Warm layers and comforting details.",
      story:
        "A textile studio focused on soft texture and responsible materials.",
      accentColor: "#8B735B",
      acceptsReturns: true,
      processingDays: 4,
    },
  },
];

const productBlueprints = [
  [
    "Handmade Ceramic Coffee Mug",
    "clay-co",
    "home-living",
    4200,
    "photo-1514228742587-6b1558fcca3d",
    ["stoneware", "food-safe glaze"],
  ],
  [
    "Small Ceramic Vase",
    "clay-co",
    "home-living",
    5800,
    "photo-1610701596007-11502861dcfa",
    ["stoneware", "matte glaze"],
  ],
  [
    "Ceramic Dinner Plate",
    "clay-co",
    "home-living",
    3600,
    "photo-1610701596061-2ecf227e85b2",
    ["porcelain", "mineral glaze"],
  ],
  [
    "Breakfast Bowl",
    "clay-co",
    "home-living",
    3200,
    "photo-1578749556568-bc2c40e68b61",
    ["stoneware"],
  ],
  [
    "Minimal Table Lamp",
    "lume-studio",
    "home-living",
    14800,
    "photo-1507473885765-e6ed057f782c",
    ["linen", "powder-coated steel"],
  ],
  [
    "Hinoki Scented Candle",
    "lume-studio",
    "beauty",
    3800,
    "photo-1603006905003-be475563bc59",
    ["soy wax", "cotton wick"],
  ],
  [
    "Stone Diffuser",
    "lume-studio",
    "beauty",
    5200,
    "photo-1602928321679-560bb453f190",
    ["porous stone", "cedar oil"],
  ],
  [
    "Linen Tote Bag",
    "the-minimalist",
    "accessories",
    4600,
    "photo-1544816155-12df9643f363",
    ["washed linen", "cotton webbing"],
  ],
  [
    "Relaxed Linen Shirt",
    "the-minimalist",
    "fashion",
    9800,
    "photo-1598033129183-c4f50c736f10",
    ["European flax linen"],
  ],
  [
    "Woven Studio Scarf",
    "the-minimalist",
    "accessories",
    6200,
    "photo-1601924994987-69e26d50dc26",
    ["merino wool", "linen"],
  ],
  [
    "Sculpted Brass Earrings",
    "the-minimalist",
    "accessories",
    7400,
    "photo-1535632066927-ab7c9ab60908",
    ["recycled brass"],
  ],
  [
    "Abstract Art Print No. 04",
    "atelier-home",
    "art-prints",
    6800,
    "photo-1549490349-8643362247b5",
    ["archival cotton paper", "pigment ink"],
  ],
  [
    "Oak Reading Chair",
    "atelier-home",
    "home-living",
    48500,
    "photo-1567538096630-e0c55bd6374c",
    ["white oak", "linen upholstery"],
  ],
  [
    "Hand-Bound Studio Notebook",
    "atelier-home",
    "accessories",
    2800,
    "photo-1531346878377-a5be20888e57",
    ["recycled paper", "linen thread"],
  ],
  [
    "Organic Skincare Ritual",
    "cozy-living",
    "beauty",
    8600,
    "photo-1556229010-6c3f2c9ca5f8",
    ["plant oils", "botanical extracts"],
  ],
  [
    "Chunky Knitted Blanket",
    "cozy-living",
    "home-living",
    13200,
    "photo-1583845112203-454c2254ed5c",
    ["responsible wool"],
  ],
  [
    "Woven Market Basket",
    "cozy-living",
    "accessories",
    7200,
    "photo-1528396518501-b53b655eb9b3",
    ["elephant grass", "leather"],
  ],
  [
    "Botanical Hand Soap Pair",
    "cozy-living",
    "beauty",
    3400,
    "photo-1600857544200-b2f666a9a2ec",
    ["olive oil", "shea butter"],
  ],
] as const;

function toSlug(value: string) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

function buildProducts(): Product[] {
  return productBlueprints.map(
    ([name, sellerSlug, categorySlug, amount, photo, materials], index) => {
      const slug = toSlug(name);
      const hasVariants = name.includes("Shirt") || name.includes("Blanket");
      const sellerName =
        sellers.find((seller) => seller.id === `seller_${sellerSlug}`)?.settings
          .displayName ?? "an independent studio";
      return {
        id: `product_${slug}`,
        sellerId: `seller_${sellerSlug}`,
        categoryId: `cat_${categorySlug}`,
        slug,
        name,
        description: `A considered ${name.toLowerCase()} made in small batches by ${sellerName}.`,
        price: usd(amount),
        status: "active",
        inventory: 8 + (index % 7) * 2,
        images:
          productGalleryVisuals[slug] ??
          productGallery(productVisuals[slug] ?? image(photo)),
        materials: [...materials],
        variants: hasVariants
          ? ["Small", "Medium", "Large"].map((size, variantIndex) => ({
              id: `variant_${slug}_${size.toLowerCase()}`,
              name: size,
              sku: `MORA-${index + 1}-${variantIndex + 1}`,
              optionValues: { size },
              priceAdjustment: usd(variantIndex === 2 ? 1000 : 0),
              inventory: 6 + variantIndex * 3,
            }))
          : [],
        featured: index % 4 === 0 || index === 1,
        createdAt: isoDaysBefore(210 - index * 7),
      };
    },
  );
}

function trackingEvents(status: OrderStatus, orderIndex: number) {
  const statusOrder: OrderStatus[] = [
    "placed",
    "processing",
    "shipped",
    "delivered",
  ];
  const finalIndex = statusOrder.indexOf(status);
  if (status === "cancelled") {
    return [
      {
        id: `event_${orderIndex}_placed`,
        status: "placed" as const,
        label: "Order placed",
        occurredAt: isoDaysBefore(75 - orderIndex * 3),
      },
      {
        id: `event_${orderIndex}_cancelled`,
        status: "cancelled" as const,
        label: "Order cancelled",
        occurredAt: isoDaysBefore(74 - orderIndex * 3),
      },
    ];
  }
  return statusOrder
    .slice(0, finalIndex + 1)
    .map((eventStatus, eventIndex) => ({
      id: `event_${orderIndex}_${eventStatus}`,
      status: eventStatus,
      label: eventStatus === "placed" ? "Order placed" : `Order ${eventStatus}`,
      occurredAt: isoDaysBefore(75 - orderIndex * 3 - eventIndex),
    }));
}

function buildOrders(products: Product[]): MarketplaceOrder[] {
  const random = seededRandom();
  const statuses: OrderStatus[] = [
    "delivered",
    "delivered",
    "shipped",
    "processing",
    "placed",
    "cancelled",
  ];
  const shoppers = ["user_sarah", "user_maya", "user_jules"];

  return Array.from({ length: 20 }, (_, orderIndex) => {
    const status = statuses[orderIndex % statuses.length];
    const productCount =
      orderIndex % 3 === 0 ? 3 : 1 + Math.floor(random() * 2);
    const picked = new Map<string, Product>();
    while (picked.size < productCount) {
      const product = products[Math.floor(random() * products.length)];
      picked.set(product.id, product);
    }

    const linesBySeller = new Map<string, OrderLineItem[]>();
    [...picked.values()].forEach((product, lineIndex) => {
      const line: OrderLineItem = {
        id: `line_${orderIndex + 1}_${lineIndex + 1}`,
        productId: product.id,
        productName: product.name,
        productImage: product.images[0],
        quantity: random() > 0.82 ? 2 : 1,
        unitPrice: product.price,
      };
      const existing = linesBySeller.get(product.sellerId) ?? [];
      linesBySeller.set(product.sellerId, [...existing, line]);
    });

    const fulfillments: SellerFulfillment[] = [...linesBySeller.entries()].map(
      ([sellerId, lineItems], fulfillmentIndex) => {
        const subtotal = usd(
          lineItems.reduce(
            (sum, line) => sum + line.unitPrice.amount * line.quantity,
            0,
          ),
        );
        return {
          id: `fulfillment_${orderIndex + 1}_${fulfillmentIndex + 1}`,
          sellerId,
          status,
          lineItems,
          subtotal,
          shipping: status === "cancelled" ? usd(0) : usd(800),
          trackingNumber: ["shipped", "delivered"].includes(status)
            ? `MORA${String(orderIndex + 1).padStart(6, "0")}`
            : undefined,
          trackingEvents: trackingEvents(status, orderIndex),
          updatedAt: isoDaysBefore(Math.max(1, 72 - orderIndex * 3)),
        };
      },
    );
    const subtotal = addMoney(fulfillments.map((group) => group.subtotal));
    const shipping = addMoney(fulfillments.map((group) => group.shipping));
    const placedAt = isoDaysBefore(75 - orderIndex * 3);

    return {
      id: `order_${String(orderIndex + 1).padStart(4, "0")}`,
      shopperId: shoppers[orderIndex % shoppers.length],
      status,
      fulfillments,
      shippingAddress: {
        name:
          users.find(
            (user) => user.id === shoppers[orderIndex % shoppers.length],
          )?.name ?? "Demo Shopper",
        line1: `${120 + orderIndex} Fictional Avenue`,
        city: "Portland",
        region: "OR",
        postalCode: "97205",
        country: "United States",
      },
      subtotal,
      shipping,
      total: addMoney([subtotal, shipping]),
      paymentMethodLabel: "Demo card ending in 4242",
      placedAt,
      updatedAt: isoDaysBefore(Math.max(1, 72 - orderIndex * 3)),
    };
  });
}

export const SHOWCASE_REVIEW_ORDER_IDS = [
  "order_0021",
  "order_0022",
  "order_0023",
] as const;

function buildShowcaseReviewOrders(products: Product[]): MarketplaceOrder[] {
  const product = products.find(
    (candidate) => candidate.slug === "handmade-ceramic-coffee-mug",
  );
  if (!product) return [];

  const shoppers = ["user_sarah", "user_maya", "user_jules"];
  return SHOWCASE_REVIEW_ORDER_IDS.map((orderId, index) => {
    const shopperId = shoppers[index];
    const ageInDays = 132 - index * 19;
    const lineItem: OrderLineItem = {
      id: `line_showcase_mug_${index + 1}`,
      productId: product.id,
      productName: product.name,
      productImage: product.images[0],
      quantity: 1,
      unitPrice: product.price,
    };
    const shipping = usd(800);
    const fulfillment: SellerFulfillment = {
      id: `fulfillment_showcase_mug_${index + 1}`,
      sellerId: product.sellerId,
      status: "delivered",
      lineItems: [lineItem],
      subtotal: product.price,
      shipping,
      trackingNumber: `MORA${String(21 + index).padStart(6, "0")}`,
      trackingEvents: [
        {
          id: `event_showcase_${index + 1}_placed`,
          status: "placed",
          label: "Order placed",
          occurredAt: isoDaysBefore(ageInDays),
        },
        {
          id: `event_showcase_${index + 1}_processing`,
          status: "processing",
          label: "Order processing",
          occurredAt: isoDaysBefore(ageInDays - 2),
        },
        {
          id: `event_showcase_${index + 1}_shipped`,
          status: "shipped",
          label: "Order shipped",
          occurredAt: isoDaysBefore(ageInDays - 4),
        },
        {
          id: `event_showcase_${index + 1}_delivered`,
          status: "delivered",
          label: "Order delivered",
          occurredAt: isoDaysBefore(ageInDays - 7),
        },
      ],
      updatedAt: isoDaysBefore(ageInDays - 7),
    };
    const shopper = users.find((user) => user.id === shopperId);

    return {
      id: orderId,
      shopperId,
      status: "delivered",
      fulfillments: [fulfillment],
      shippingAddress: {
        name: shopper?.name ?? "Demo Shopper",
        line1: `${221 + index} Fictional Avenue`,
        city: "Portland",
        region: "OR",
        postalCode: "97205",
        country: "United States",
      },
      subtotal: product.price,
      shipping,
      total: addMoney([product.price, shipping]),
      paymentMethodLabel: "Demo card ending in 4242",
      placedAt: isoDaysBefore(ageInDays),
      updatedAt: isoDaysBefore(ageInDays - 7),
    };
  });
}

function buildReviews(orders: MarketplaceOrder[]): Review[] {
  const delivered = orders.filter((order) => order.status === "delivered");
  const copy = [
    [
      "A beautiful everyday piece",
      "The finish feels even better in person and the packaging was thoughtful.",
    ],
    [
      "Quietly special",
      "Well made, useful, and exactly the kind of object I hoped to keep for years.",
    ],
    [
      "Lovely material and finish",
      "The details are subtle and considered. It arrived safely and on time.",
    ],
    [
      "My new morning favorite",
      "Comfortable to hold, beautifully balanced, and the speckled glaze has so much quiet character.",
    ],
    [
      "Thoughtful from start to finish",
      "The form feels handmade without being precious. It has already become part of my daily coffee ritual.",
    ],
  ] as const;

  const showcaseCopy: Record<
    string,
    readonly [string, string, Review["rating"]]
  > = {
    order_0021: [
      "The mug I reach for every morning",
      "I expected it to be beautiful, but what surprised me was how good it feels in hand. The handle is generous, the weight is balanced, and the little variations in the glaze make it feel genuinely mine. Coffee stays warm through my slow mornings, too.",
      5,
    ],
    order_0022: [
      "Even better once it became part of the kitchen",
      "The speckled finish catches the morning light so beautifully. It arrived wrapped with real care and has handled the dishwasher without losing any of its character. My partner keeps borrowing it, which is probably the most honest review.",
      5,
    ],
    order_0023: [
      "Beautifully made, with one tiny caveat",
      "The shape and glaze are gorgeous and it feels sturdy without being heavy. I only wish it held one more splash of coffee, but I still use it almost every day. It is the kind of small object that makes a routine feel considered.",
      4,
    ],
  };

  return delivered.flatMap((order, orderIndex) =>
    order.fulfillments.slice(0, 1).map((fulfillment) => {
      const line = fulfillment.lineItems[0];
      const showcase = showcaseCopy[order.id];
      const [title, body] = showcase ?? copy[orderIndex % copy.length];
      return {
        id: `review_${order.id}_${line.productId}`,
        orderId: order.id,
        productId: line.productId,
        shopperId: order.shopperId,
        rating:
          showcase?.[2] ?? ((orderIndex % 4 === 0 ? 4 : 5) as Review["rating"]),
        title,
        body,
        createdAt: isoDaysBefore(Math.max(1, 68 - orderIndex * 6)),
      };
    }),
  );
}

export function createMarketplaceSeed(): MarketplaceSeed {
  const products = buildProducts();
  const orders = [
    ...buildOrders(products),
    ...buildShowcaseReviewOrders(products),
  ];
  const random = seededRandom(9821);
  const months = [
    "2026-01",
    "2026-02",
    "2026-03",
    "2026-04",
    "2026-05",
    "2026-06",
  ];

  return {
    users: structuredClone(users),
    shopperProfiles: [
      {
        userId: "user_sarah",
        defaultAddress: {
          name: "Sarah Chen",
          line1: "184 Fictional Avenue",
          city: "Portland",
          region: "OR",
          postalCode: "97205",
          country: "United States",
        },
      },
    ],
    sellers: structuredClone(sellers),
    categories: structuredClone(categories),
    products,
    cart: [],
    orders,
    reviews: buildReviews(orders),
    wishlist: [
      "product_handmade-ceramic-coffee-mug",
      "product_minimal-table-lamp",
      "product_abstract-art-print-no-04",
      "product_woven-studio-scarf",
    ].map((productId, index) => ({
      shopperId: "user_sarah",
      productId,
      createdAt: isoDaysBefore(9 - index),
    })),
    followedSellerIds: ["seller_clay-co"],
    sellerAnalytics: sellers.flatMap((seller, sellerIndex) =>
      months.map((month, monthIndex) => ({
        sellerId: seller.id,
        month,
        revenue: usd(
          620000 +
            sellerIndex * 94000 +
            monthIndex * 83000 +
            Math.floor(random() * 72000),
        ),
        orders:
          24 + sellerIndex * 3 + monthIndex * 4 + Math.floor(random() * 6),
        views:
          1300 +
          sellerIndex * 180 +
          monthIndex * 210 +
          Math.floor(random() * 220),
      })),
    ),
  };
}

export const demoIdentities = {
  shopperUserId: "user_sarah",
  sellerUserId: "user_alex",
  sellerId: "seller_clay-co",
  adminUserId: "user_nora",
} as const;
