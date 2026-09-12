import { PageContainer } from "@/components/layout/page-container";
import { Skeleton } from "@/components/ui/skeleton";

export default function ProductLoading() {
  return (
    <PageContainer className="py-8">
      <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr]">
        <Skeleton className="aspect-[4/5]" />
        <div className="pt-8">
          <Skeleton className="h-4 w-28" />
          <Skeleton className="mt-6 h-14 w-full" />
          <Skeleton className="mt-4 h-5 w-44" />
          <Skeleton className="mt-10 h-14 w-full" />
          <Skeleton className="mt-8 h-12 w-full" />
        </div>
      </div>
    </PageContainer>
  );
}
