import type { Metadata } from "next";

import { PageContainer } from "@/components/layout/page-container";
import { OrderDetails } from "@/features/orders/order-details";

export const metadata: Metadata = {
  title: "Order details",
  description: "Track a fictional Mora marketplace order.",
};

export default async function OrderDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <PageContainer className="py-8 sm:py-12">
      <OrderDetails orderId={id} />
    </PageContainer>
  );
}
