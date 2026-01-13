import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "../types";

interface WishlistStore {
  items: Product[];
  addItem: (product: Product) => void;
  removeItem: (productId: number) => void;
  isInWishlist: (productId: number) => boolean;
  toggleItem: (product: Product) => boolean;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        set((state) => ({
          items: state.items.some((item) => item.id === product.id)
            ? state.items
            : [...state.items, product],
        }));
      },
      removeItem: (productId) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== productId),
        }));
      },
      isInWishlist: (productId) => {
        return get().items.some((item) => item.id === productId);
      },
      toggleItem: (product) => {
        const isInList = get().isInWishlist(product.id);
        if (isInList) {
          get().removeItem(product.id);
          return false;
        } else {
          get().addItem(product);
          return true;
        }
      },
    }),
    {
      name: "wishlist-storage",
    }
  )
);
