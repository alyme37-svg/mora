import type { Product, Review, Seller } from "@/types/marketplace";
import { isProductAdminSuspended } from "@/store/marketplace-guards";

export function getRatingSummary(reviews: Review[], productId?: string) {
  const relevant = productId
    ? reviews.filter((review) => review.productId === productId)
    : reviews;
  return {
    average: relevant.length
      ? relevant.reduce((sum, review) => sum + review.rating, 0) /
        relevant.length
      : 0,
    count: relevant.length,
  };
}

export function getSellerReviews(
  products: Product[],
  reviews: Review[],
  sellerId: string,
) {
  const productIds = new Set(
    products
      .filter((product) => product.sellerId === sellerId)
      .map((product) => product.id),
  );
  return reviews.filter((review) => productIds.has(review.productId));
}

export interface CatalogProduct {
  product: Product;
  seller: Seller;
  rating: number;
  reviewCount: number;
}

export function buildCatalog(
  products: Product[],
  sellers: Seller[],
  reviews: Review[],
): CatalogProduct[] {
  const sellersById = new Map(sellers.map((seller) => [seller.id, seller]));

  return products.flatMap((product) => {
    const seller = sellersById.get(product.sellerId);
    if (
      !seller ||
      seller.status !== "active" ||
      product.status !== "active" ||
      isProductAdminSuspended(product)
    )
      return [];
    const rating = getRatingSummary(reviews, product.id);
    return [
      { product, seller, rating: rating.average, reviewCount: rating.count },
    ];
  });
}
