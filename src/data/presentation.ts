const unsplash = (id: string, width = 1600) =>
  `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${width}&q=86`;

export const homeVisuals = {
  hero: "/images/mora/marketplace-hero.webp",
  maker: unsplash("photo-1565193566173-7a0ee3dbe261", 1800),
} as const;

export const categoryVisuals: Record<string, string> = {
  "home-living": "/images/mora/ceramic-vase.webp",
  fashion: "/images/mora/linen-shirt.webp",
  beauty: "/images/mora/skincare-ritual.webp",
  "art-prints": "/images/mora/abstract-art-print.webp",
  accessories: "/images/mora/linen-tote.webp",
};

export const productVisuals: Record<string, string> = {
  "handmade-ceramic-coffee-mug": "/images/mora/ceramic-mug.webp",
  "small-ceramic-vase": "/images/mora/ceramic-vase.webp",
  "breakfast-bowl": "/images/mora/breakfast-bowl.webp",
  "minimal-table-lamp": "/images/mora/table-lamp.webp",
  "hinoki-scented-candle": "/images/mora/hinoki-candle.webp",
  "stone-diffuser": "/images/mora/stone-diffuser.webp",
  "linen-tote-bag": "/images/mora/linen-tote.webp",
  "relaxed-linen-shirt": "/images/mora/linen-shirt.webp",
  "sculpted-brass-earrings": "/images/mora/brass-earrings.webp",
  "abstract-art-print-no-04": "/images/mora/abstract-art-print.webp",
  "oak-reading-chair": "/images/mora/oak-chair.webp",
  "organic-skincare-ritual": "/images/mora/skincare-ritual.webp",
  "chunky-knitted-blanket": "/images/mora/knitted-blanket.webp",
  "botanical-hand-soap-pair": "/images/mora/botanical-skincare.webp",
};

export const productGalleryVisuals: Record<string, string[]> = {
  "handmade-ceramic-coffee-mug": [
    "/images/mora/ceramic-mug.webp",
    "/images/mora/ceramic-mug-rear.webp",
    "/images/mora/ceramic-mug-detail.webp",
    "/images/mora/ceramic-mug-lifestyle.webp",
  ],
};

export interface SellerPresentation {
  coverUrl: string;
  portraitUrl: string;
  followerCount: number;
  foundedLabel: string;
  specialties: string[];
}

export const sellerPresentation: Record<string, SellerPresentation> = {
  "seller_clay-co": {
    coverUrl: "/images/mora/marketplace-hero.webp",
    portraitUrl: "/images/mora/ceramic-vase.webp",
    followerCount: 428,
    foundedLabel: "Founded in 2022",
    specialties: ["Wheel-thrown stoneware", "Earthy glazes", "Small batches"],
  },
  "seller_lume-studio": {
    coverUrl: "/images/mora/table-lamp.webp",
    portraitUrl: "/images/mora/hinoki-candle.webp",
    followerCount: 316,
    foundedLabel: "Founded in 2023",
    specialties: ["Ambient lighting", "Natural scent", "Quiet interiors"],
  },
  "seller_the-minimalist": {
    coverUrl: "/images/mora/linen-shirt.webp",
    portraitUrl: "/images/mora/linen-tote.webp",
    followerCount: 572,
    foundedLabel: "Founded in 2021",
    specialties: ["Natural fibers", "Small-run clothing", "Everyday carry"],
  },
  "seller_atelier-home": {
    coverUrl: "/images/mora/oak-chair.webp",
    portraitUrl: "/images/mora/abstract-art-print.webp",
    followerCount: 389,
    foundedLabel: "Founded in 2020",
    specialties: ["Limited prints", "Domestic objects", "Small furniture"],
  },
  "seller_cozy-living": {
    coverUrl: "/images/mora/knitted-blanket.webp",
    portraitUrl: "/images/mora/skincare-ritual.webp",
    followerCount: 447,
    foundedLabel: "Founded in 2022",
    specialties: ["Responsible wool", "Botanical care", "Soft texture"],
  },
};

export function productGallery(primaryUrl: string) {
  return [primaryUrl];
}

export const sellerAssetLibrary = [
  {
    id: "speckled-stoneware",
    label: "Speckled stoneware",
    url: "/images/mora/ceramic-mug.webp",
  },
  {
    id: "quiet-vase",
    label: "Quiet ceramic vase",
    url: "/images/mora/ceramic-vase.webp",
  },
  {
    id: "glazed-plate",
    label: "Mineral glazed plate",
    url: "/images/mora/breakfast-bowl.webp",
  },
  {
    id: "breakfast-bowl",
    label: "Breakfast bowl",
    url: "/images/mora/breakfast-bowl.webp",
  },
  {
    id: "maker-studio",
    label: "Maker studio",
    url: unsplash("photo-1565193566173-7a0ee3dbe261"),
  },
  {
    id: "still-life",
    label: "Warm still life",
    url: unsplash("photo-1603006905003-be475563bc59"),
  },
] as const;
