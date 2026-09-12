"use client";

import {
  Archive,
  ArrowLeft,
  ImageIcon,
  Plus,
  Save,
  Trash2,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/toast";
import { productGallery, sellerAssetLibrary } from "@/data/presentation";
import { demoIdentities } from "@/data/seed";
import { useHydrated } from "@/hooks/use-hydrated";
import { makeId } from "@/lib/utils";
import { usd } from "@/lib/money";
import { useMarketplaceStore } from "@/store/marketplace-store";
import type {
  Product,
  ProductStatus,
  ProductVariant,
} from "@/types/marketplace";

const fieldClass =
  "min-h-11 w-full rounded-md border bg-surface px-3.5 text-sm outline-none transition-colors placeholder:text-muted-foreground/70 hover:border-caramel/70 focus:border-walnut focus:ring-2 focus:ring-walnut/15";

export function ProductForm({ productId }: { productId?: string }) {
  const hydrated = useHydrated();
  const product = useMarketplaceStore((state) =>
    productId
      ? state.products.find(
          (item) =>
            item.id === productId && item.sellerId === demoIdentities.sellerId,
        )
      : undefined,
  );
  if (productId && !hydrated)
    return (
      <div className="grid gap-5">
        <div className="h-24 animate-pulse rounded-md bg-muted" />
        <div className="h-[34rem] animate-pulse rounded-md bg-muted" />
      </div>
    );
  if (productId && !product)
    return (
      <div className="rounded-lg border bg-surface p-8">
        <h1 className="text-2xl font-semibold">Product not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          This item does not belong to Clay & Co.
        </p>
        <Button asChild className="mt-6">
          <Link href="/seller/products">Back to products</Link>
        </Button>
      </div>
    );
  return <ProductEditor key={product?.id ?? "new-product"} product={product} />;
}

function ProductEditor({ product }: { product?: Product }) {
  const router = useRouter();
  const categories = useMarketplaceStore((state) => state.categories);
  const addProduct = useMarketplaceStore((state) => state.addProduct);
  const updateProduct = useMarketplaceStore((state) => state.updateProduct);
  const archiveProduct = useMarketplaceStore((state) => state.archiveProduct);
  const { toast } = useToast();
  const [name, setName] = useState(() => product?.name ?? "");
  const [description, setDescription] = useState(
    () => product?.description ?? "",
  );
  const [price, setPrice] = useState(() =>
    product ? (product.price.amount / 100).toString() : "",
  );
  const [inventory, setInventory] = useState(() =>
    String(product?.inventory ?? (product ? 12 : 8)),
  );
  const [categoryId, setCategoryId] = useState(
    () => product?.categoryId ?? "cat_home-living",
  );
  const [status, setStatus] = useState<
    Extract<ProductStatus, "active" | "draft">
  >(() =>
    product ? (product.status === "active" ? "active" : "draft") : "active",
  );
  const [assetUrl, setAssetUrl] = useState(
    () => product?.images[0] ?? sellerAssetLibrary[0].url,
  );
  const [materials, setMaterials] = useState(
    () => product?.materials.join(", ") ?? "",
  );
  const [variants, setVariants] = useState<ProductVariant[]>(
    () => product?.variants ?? [],
  );
  const [error, setError] = useState("");
  const adminSuspended =
    product?.adminSuspended === true || product?.status === "suspended";

  function addVariant() {
    setVariants((current) => [
      ...current,
      {
        id: makeId("variant"),
        name: `Option ${current.length + 1}`,
        sku: `MORA-DEMO-${current.length + 1}`,
        optionValues: { option: `Option ${current.length + 1}` },
        priceAdjustment: usd(0),
        inventory: 4,
      },
    ]);
  }

  function updateVariant(id: string, updates: Partial<ProductVariant>) {
    setVariants((current) =>
      current.map((variant) =>
        variant.id === id
          ? {
              ...variant,
              ...updates,
              optionValues: updates.name
                ? { option: updates.name }
                : variant.optionValues,
            }
          : variant,
      ),
    );
  }

  function save(event: React.FormEvent) {
    event.preventDefault();
    const amount = Math.round(Number(price) * 100);
    const invalidVariant = variants.some(
      (variant) =>
        variant.name.trim().length === 0 ||
        !Number.isFinite(variant.inventory) ||
        variant.inventory < 0 ||
        !Number.isFinite(variant.priceAdjustment.amount),
    );
    if (
      name.trim().length < 3 ||
      description.trim().length < 20 ||
      !Number.isFinite(amount) ||
      amount <= 0 ||
      !Number.isFinite(Number(inventory)) ||
      Number(inventory) < 0 ||
      invalidVariant
    ) {
      setError(
        "Add a product name, a 20-character description, a valid price, and non-negative stock for every option.",
      );
      return;
    }
    setError("");
    const payload = {
      categoryId,
      name: name.trim(),
      description: description.trim(),
      price: usd(amount),
      inventory: Math.floor(Number(inventory)),
      status,
      images: productGallery(assetUrl),
      materials: materials
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
      variants: variants.map((variant) => ({
        ...variant,
        name: variant.name.trim(),
        inventory: Math.floor(variant.inventory),
      })),
    };
    if (product) {
      updateProduct(product.id, {
        ...payload,
        status: adminSuspended
          ? product.status === "suspended"
            ? "active"
            : product.status
          : status,
      });
      toast({
        title: "Product updated",
        description: adminSuspended
          ? `${payload.name} remains suspended until an admin reactivates it.`
          : `${payload.name} is ${status}.`,
      });
    } else {
      const id = addProduct({ sellerId: demoIdentities.sellerId, ...payload });
      toast({
        title: status === "active" ? "Product published" : "Draft saved",
        description: payload.name,
      });
      router.replace(`/seller/products/${id}`);
    }
  }

  return (
    <form onSubmit={save}>
      <div className="flex flex-col gap-5 border-b pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <Link
            href="/seller/products"
            className="inline-flex min-h-10 items-center gap-2 text-xs font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft aria-hidden="true" className="size-4" />
            Products
          </Link>
          <h1 className="mt-2 text-3xl font-semibold tracking-[-0.03em] sm:text-4xl">
            {product ? "Edit product" : "Add a new piece"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {product
              ? "Changes persist locally across the Mora demo."
              : "Active products appear in shopper discovery immediately."}
          </p>
        </div>
        <Button type="submit">
          <Save aria-hidden="true" />
          {product ? "Save changes" : "Save product"}
        </Button>
      </div>
      {error ? (
        <div
          role="alert"
          className="mt-6 rounded-md border border-danger/30 bg-danger/5 px-4 py-3 text-sm text-danger"
        >
          {error}
        </div>
      ) : null}
      <div className="mt-6 grid gap-6 xl:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="grid gap-6">
          <section className="rounded-lg border bg-surface p-5 sm:p-6">
            <h2 className="text-lg font-semibold">Product information</h2>
            <div className="mt-5 grid gap-5">
              <label className="grid gap-2 text-sm font-medium">
                Product name
                <input
                  className={fieldClass}
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Description
                <textarea
                  className={`${fieldClass} min-h-32 resize-y py-3 leading-6`}
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                />
                <span className="text-xs font-normal text-muted-foreground">
                  Tell shoppers what makes the piece useful and considered.
                </span>
              </label>
              <div className="grid gap-5 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium">
                  Category
                  <select
                    className={fieldClass}
                    value={categoryId}
                    onChange={(event) => setCategoryId(event.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label className="grid gap-2 text-sm font-medium">
                  Materials
                  <input
                    className={fieldClass}
                    value={materials}
                    onChange={(event) => setMaterials(event.target.value)}
                    placeholder="Stoneware, food-safe glaze"
                  />
                  <span className="text-xs font-normal text-muted-foreground">
                    Separate with commas.
                  </span>
                </label>
              </div>
            </div>
          </section>
          <section className="rounded-lg border bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-lg font-semibold">Variants</h2>
                <p className="mt-1 text-xs text-muted-foreground">
                  Optional sizes or finishes with their own stock.
                </p>
              </div>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={addVariant}
              >
                <Plus aria-hidden="true" />
                Add variant
              </Button>
            </div>
            {variants.length ? (
              <div className="mt-5 grid gap-3">
                {variants.map((variant) => (
                  <div
                    key={variant.id}
                    className="grid gap-3 rounded-md border bg-muted/35 p-3 sm:grid-cols-[1fr_8rem_8rem_auto]"
                  >
                    <label className="grid gap-1.5 text-xs font-medium">
                      Name
                      <input
                        className={fieldClass}
                        value={variant.name}
                        onChange={(event) =>
                          updateVariant(variant.id, {
                            name: event.target.value,
                          })
                        }
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium">
                      Price + ($)
                      <input
                        className={fieldClass}
                        inputMode="decimal"
                        value={(
                          variant.priceAdjustment.amount / 100
                        ).toString()}
                        onChange={(event) =>
                          updateVariant(variant.id, {
                            priceAdjustment: usd(
                              Math.round(Number(event.target.value || 0) * 100),
                            ),
                          })
                        }
                      />
                    </label>
                    <label className="grid gap-1.5 text-xs font-medium">
                      Stock
                      <input
                        className={fieldClass}
                        type="number"
                        min="0"
                        value={variant.inventory}
                        onChange={(event) =>
                          updateVariant(variant.id, {
                            inventory: Number(event.target.value),
                          })
                        }
                      />
                    </label>
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      className="self-end"
                      onClick={() =>
                        setVariants((current) =>
                          current.filter((item) => item.id !== variant.id),
                        )
                      }
                      aria-label={`Remove ${variant.name}`}
                    >
                      <Trash2 aria-hidden="true" />
                    </Button>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-5 rounded-md border border-dashed p-6 text-center text-sm text-muted-foreground">
                No variants. The base stock will be used.
              </div>
            )}
          </section>
        </div>
        <aside className="grid content-start gap-6">
          <section className="rounded-lg border bg-surface p-5">
            <h2 className="text-lg font-semibold">Pricing & availability</h2>
            <div className="mt-5 grid gap-5">
              <label className="grid gap-2 text-sm font-medium">
                Price (USD)
                <input
                  className={fieldClass}
                  inputMode="decimal"
                  value={price}
                  onChange={(event) => setPrice(event.target.value)}
                  placeholder="42.00"
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Base stock
                <input
                  className={fieldClass}
                  type="number"
                  min="0"
                  value={inventory}
                  onChange={(event) => setInventory(event.target.value)}
                  disabled={variants.length > 0}
                />
              </label>
              <label className="grid gap-2 text-sm font-medium">
                Visibility
                <select
                  className={fieldClass}
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value as "active" | "draft")
                  }
                  disabled={adminSuspended}
                >
                  <option value="active">Active · visible to shoppers</option>
                  <option value="draft">
                    {adminSuspended
                      ? "Suspended · admin controlled"
                      : "Draft · seller only"}
                  </option>
                </select>
                {adminSuspended ? (
                  <span className="text-xs font-normal leading-5 text-danger">
                    You can edit product details, but only an admin can
                    reactivate this listing.
                  </span>
                ) : null}
              </label>
            </div>
          </section>
          <section className="rounded-lg border bg-surface p-5">
            <div className="flex items-center gap-2">
              <ImageIcon aria-hidden="true" className="size-4 text-walnut" />
              <h2 className="text-lg font-semibold">Product imagery</h2>
            </div>
            <p className="mt-2 text-xs leading-5 text-muted-foreground">
              Choose from Mora&apos;s curated fictional asset library.
            </p>
            <div className="mt-4 grid grid-cols-3 gap-2">
              {sellerAssetLibrary.map((asset) => (
                <label key={asset.id} className="cursor-pointer">
                  <input
                    type="radio"
                    name="asset"
                    value={asset.url}
                    checked={assetUrl === asset.url}
                    onChange={() => setAssetUrl(asset.url)}
                    className="peer sr-only"
                  />
                  <span className="relative block aspect-square overflow-hidden rounded-md border-2 border-transparent bg-muted peer-checked:border-walnut peer-focus-visible:outline peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2">
                    <Image
                      src={asset.url}
                      alt={asset.label}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </span>
                </label>
              ))}
            </div>
          </section>
          {product && product.status !== "archived" ? (
            <Button
              type="button"
              variant="danger"
              onClick={() => {
                if (window.confirm(`Archive ${product.name}?`)) {
                  archiveProduct(product.id);
                  toast({
                    title: "Product archived",
                    description: product.name,
                  });
                  router.push("/seller/products");
                }
              }}
            >
              <Archive aria-hidden="true" />
              Archive product
            </Button>
          ) : null}
        </aside>
      </div>
    </form>
  );
}
