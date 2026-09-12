"use client";

import { ExternalLink, ImageIcon, Save, Store } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/toast";
import { sellerAssetLibrary, sellerPresentation } from "@/data/presentation";
import { demoIdentities } from "@/data/seed";
import { SellerPageHeader } from "@/features/seller/seller-page-header";
import { useHydrated } from "@/hooks/use-hydrated";
import { useMarketplaceStore } from "@/store/marketplace-store";
import type { StoreSettings } from "@/types/marketplace";

const fieldClass =
  "min-h-11 w-full rounded-md border bg-surface px-3.5 text-sm outline-none transition-colors hover:border-caramel/70 focus:border-walnut focus:ring-2 focus:ring-walnut/15";

export function StoreProfileForm() {
  const hydrated = useHydrated();
  const seller = useMarketplaceStore((state) =>
    state.sellers.find((item) => item.id === demoIdentities.sellerId),
  );
  const updateSettings = useMarketplaceStore(
    (state) => state.updateStoreSettings,
  );
  const { toast } = useToast();
  const fallback = sellerPresentation[demoIdentities.sellerId];
  const [draft, setDraft] = useState<StoreSettings | null>(null);
  const settings = draft ?? seller?.settings;

  if (!hydrated || !seller || !settings)
    return (
      <div className="grid gap-5">
        <Skeleton className="h-24" />
        <Skeleton className="h-[32rem]" />
      </div>
    );

  function update<K extends keyof StoreSettings>(
    key: K,
    value: StoreSettings[K],
  ) {
    setDraft((current) => ({ ...(current ?? seller!.settings), [key]: value }));
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    updateSettings(seller!.id, settings!);
    setDraft(null);
    toast({
      title: "Store profile saved",
      description: "Clay & Co. settings are persisted locally.",
    });
  }

  const logo = settings.logoImageUrl ?? fallback.portraitUrl;
  const cover = settings.coverImageUrl ?? fallback.coverUrl;

  return (
    <form onSubmit={save}>
      <SellerPageHeader
        eyebrow="Store settings"
        title="Store profile"
        description="Shape how Clay & Co. appears across this fictional Mora demo."
        action={
          <Button type="submit">
            <Save aria-hidden="true" />
            Save profile
          </Button>
        }
      />
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_23rem]">
        <div className="grid gap-6">
          <section className="rounded-lg border bg-surface p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Identity</h2>
            <div className="mt-5 grid gap-5">
              <label className="grid gap-2 text-sm font-medium">
                Store name
                <input
                  className={fieldClass}
                  value={settings.displayName}
                  onChange={(event) =>
                    update("displayName", event.target.value)
                  }
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Short bio
                <input
                  className={fieldClass}
                  value={settings.tagline}
                  onChange={(event) => update("tagline", event.target.value)}
                />
                <span className="text-xs font-normal text-muted-foreground">
                  Shown beside your store identity.
                </span>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Seller story
                <textarea
                  className={`${fieldClass} min-h-36 resize-y py-3 leading-6`}
                  value={settings.story}
                  onChange={(event) => update("story", event.target.value)}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Shop announcement
                <input
                  className={fieldClass}
                  value={settings.announcement ?? ""}
                  onChange={(event) =>
                    update("announcement", event.target.value)
                  }
                />
              </label>
            </div>
          </section>
          <section className="rounded-lg border bg-surface p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Policies & availability</h2>
            <div className="mt-5 grid gap-5">
              <label className="grid gap-2 text-sm font-medium">
                Store status
                <select
                  className={fieldClass}
                  value={settings.storefrontStatus ?? "open"}
                  onChange={(event) =>
                    update(
                      "storefrontStatus",
                      event.target.value as "open" | "away",
                    )
                  }
                >
                  <option value="open">Open · accepting demo orders</option>
                  <option value="away">Away · orders paused</option>
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Processing time
                <select
                  className={fieldClass}
                  value={settings.processingDays}
                  onChange={(event) =>
                    update("processingDays", Number(event.target.value))
                  }
                >
                  {[1, 2, 3, 4, 5, 7].map((days) => (
                    <option key={days} value={days}>
                      {days} business day{days === 1 ? "" : "s"}
                    </option>
                  ))}
                </select>
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Policies
                <textarea
                  className={`${fieldClass} min-h-32 resize-y py-3 leading-6`}
                  value={settings.policies ?? ""}
                  onChange={(event) => update("policies", event.target.value)}
                />
              </label>
              <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-md border bg-muted/35 px-4 text-sm font-medium">
                <input
                  type="checkbox"
                  checked={settings.acceptsReturns}
                  onChange={(event) =>
                    update("acceptsReturns", event.target.checked)
                  }
                  className="size-4 accent-[var(--mora-walnut)]"
                />
                Accepts returns
              </label>
            </div>
          </section>
        </div>
        <aside className="grid content-start gap-6">
          <section className="overflow-hidden rounded-lg border bg-surface">
            <div className="relative aspect-[16/8] bg-muted">
              <Image
                src={cover}
                alt="Clay & Co. cover preview"
                fill
                sizes="368px"
                className="object-cover"
              />
            </div>
            <div className="p-5">
              <div className="relative -mt-12 size-20 overflow-hidden rounded-full border-4 border-surface bg-muted">
                <Image
                  src={logo}
                  alt="Clay & Co. logo preview"
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              </div>
              <h2 className="mt-3 text-xl font-semibold">
                {settings.displayName}
              </h2>
              <p className="mt-1 text-sm leading-6 text-muted-foreground">
                {settings.tagline}
              </p>
              <span className="mt-4 inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1.5 text-xs font-semibold capitalize">
                <span
                  className={`size-2 rounded-full ${settings.storefrontStatus === "away" ? "bg-warning" : "bg-success"}`}
                />
                {settings.storefrontStatus ?? "open"}
              </span>
            </div>
          </section>
          <section className="rounded-lg border bg-surface p-5">
            <div className="flex items-center gap-2">
              <ImageIcon aria-hidden="true" className="size-4 text-walnut" />
              <h2 className="text-base font-semibold">Logo / avatar</h2>
            </div>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {sellerAssetLibrary.slice(0, 3).map((asset) => (
                <label key={asset.id} className="cursor-pointer">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="logo"
                    checked={logo === asset.url}
                    onChange={() => update("logoImageUrl", asset.url)}
                  />
                  <span className="relative block aspect-square overflow-hidden rounded-full border-2 border-transparent peer-checked:border-walnut peer-focus-visible:outline">
                    <Image
                      src={asset.url}
                      alt={asset.label}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </span>
                </label>
              ))}
            </div>
            <h2 className="mt-6 text-base font-semibold">Store cover</h2>
            <div className="mt-3 grid gap-2">
              {sellerAssetLibrary.slice(3, 6).map((asset) => (
                <label key={asset.id} className="cursor-pointer">
                  <input
                    className="peer sr-only"
                    type="radio"
                    name="cover"
                    checked={cover === asset.url}
                    onChange={() => update("coverImageUrl", asset.url)}
                  />
                  <span className="relative block aspect-[16/5] overflow-hidden rounded-md border-2 border-transparent peer-checked:border-walnut peer-focus-visible:outline">
                    <Image
                      src={asset.url}
                      alt={asset.label}
                      fill
                      sizes="320px"
                      className="object-cover"
                    />
                  </span>
                </label>
              ))}
            </div>
          </section>
          <Button asChild variant="secondary" className="w-full">
            <Link href={`/stores/${seller.slug}`}>
              <Store aria-hidden="true" />
              View public storefront
              <ExternalLink aria-hidden="true" />
            </Link>
          </Button>
        </aside>
      </div>
    </form>
  );
}
