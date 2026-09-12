"use client";

import { useEffect } from "react";

import {
  MARKETPLACE_STORAGE_KEY,
  useMarketplaceStore,
} from "@/store/marketplace-store";

export function MarketplaceStorageSync() {
  useEffect(() => {
    function syncFromStorage(event: StorageEvent) {
      if (
        event.storageArea !== window.localStorage ||
        event.key !== MARKETPLACE_STORAGE_KEY
      ) {
        return;
      }
      void useMarketplaceStore.persist.rehydrate();
    }

    window.addEventListener("storage", syncFromStorage);
    return () => window.removeEventListener("storage", syncFromStorage);
  }, []);

  return null;
}
