import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function LoadingOrderDetails() {
  return (
    <PageContainer className="grid gap-6 py-10 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <Skeleton className="h-[38rem]" />
      <Skeleton className="h-80" />
    </PageContainer>
  );
}
