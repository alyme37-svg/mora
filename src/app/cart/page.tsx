import type { Metadata } from "next";

import { EditorialHeading } from "@/components/layout/editorial-heading";
import { PageContainer } from "@/components/layout/page-container";
import { CartExperience } from "@/features/cart/cart-experience";

export const metadata: Metadata = {
  title: "Your cart",
  description: "Review your fictional multi-creator Mora cart.",
};

export default function CartPage() {
  return (
    <PageContainer className="py-10 sm:py-14">
      <EditorialHeading
        eyebrow="Your selection"
        title="A thoughtful cart, gathered together."
        description="Review quantities and creator groups before entering Mora’s fictional checkout."
      />
      <div className="mt-10">
        <CartExperience />
      </div>
    </PageContainer>
  );
}
