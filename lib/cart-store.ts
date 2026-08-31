"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartLine = {
  productId: string;
  slug: string;
  name: string;
  brand: string;
  price: number;
  image: string;
  quantity: number;
};

type CartState = {
  lines: CartLine[];
  isOpen: boolean;
  lastAddedId: string | null;
  open: () => void;
  close: () => void;
  toggle: () => void;
  addItem: (line: Omit<CartLine, "quantity">, quantity?: number) => void;
  removeItem: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      lines: [],
      isOpen: false,
      lastAddedId: null,
      open: () => set({ isOpen: true }),
      close: () => set({ isOpen: false }),
      toggle: () => set((s) => ({ isOpen: !s.isOpen })),
      addItem: (line, quantity = 1) => {
        const existing = get().lines.find((l) => l.productId === line.productId);
        if (existing) {
          set({
            lines: get().lines.map((l) =>
              l.productId === line.productId ? { ...l, quantity: l.quantity + quantity } : l,
            ),
            isOpen: true,
            lastAddedId: line.productId,
          });
        } else {
          set({
            lines: [...get().lines, { ...line, quantity }],
            isOpen: true,
            lastAddedId: line.productId,
          });
        }
      },
      removeItem: (productId) => set({ lines: get().lines.filter((l) => l.productId !== productId) }),
      setQuantity: (productId, quantity) =>
        set({
          lines:
            quantity <= 0
              ? get().lines.filter((l) => l.productId !== productId)
              : get().lines.map((l) => (l.productId === productId ? { ...l, quantity } : l)),
        }),
      clear: () => set({ lines: [] }),
    }),
    { name: "choisistaborne-cart" },
  ),
);

export const cartCount = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.quantity, 0);
export const cartTotal = (lines: CartLine[]) => lines.reduce((sum, l) => sum + l.quantity * l.price, 0);
