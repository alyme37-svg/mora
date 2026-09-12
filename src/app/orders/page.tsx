import type { Metadata } from "next";

import { EditorialHeading } from "@/components/layout/editorial-heading";
import { PageContainer } from "@/components/layout/page-container";
import { OrdersList } from "@/features/orders/orders-list";

export const metadata: Metadata = {
  title: "My orders",
  description: "Track Sarah Chen’s fictional Mora orders.",
};

export default function OrdersPage() {
  return (
    <PageContainer className="py-10 sm:py-14">
      <EditorialHeading
        eyebrow="Sarah’s account"
        title="Orders, from studio to doorstep."
        description="Every creator fulfillment moves independently while remaining part of one marketplace order."
      />
      <div className="mt-10">
        <OrdersList />
      </div>
    </PageContainer>
  );
}
