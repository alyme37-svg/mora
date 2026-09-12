import { Sparkles } from "lucide-react";
import { RoutePlaceholder } from "@/components/layout/route-placeholder";
export default function AboutPage() {
  return (
    <RoutePlaceholder
      eyebrow="About Mora"
      title="A marketplace made to demonstrate product craft."
      description="Mora is a fictional portfolio project—not a live marketplace or operating business."
      icon={Sparkles}
    />
  );
}
