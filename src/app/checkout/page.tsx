import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { CheckoutFlow } from "@/features/checkout/checkout-flow";

export const metadata: Metadata = {
  title: "Demo checkout",
  description: "Complete a fictional local Mora checkout.",
};

export default async function CheckoutPage({
  searchParams,
}: {
  searchParams: Promise<{ order?: string }>;
}) {
  const { order } = await searchParams;
  return (
    <PageContainer className="py-8 sm:py-12">
      <CheckoutFlow initialOrderId={order} />
    </PageContainer>
  );
}
