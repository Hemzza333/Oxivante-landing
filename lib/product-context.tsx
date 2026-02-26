"use client";

import React, { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { type Lang, getTranslation } from "@/lib/translations";

export type { Lang };

interface ProductContextType {
  lang: Lang;
  setLang: (l: Lang) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
  isTransitioning: boolean;
}

const ProductContext = createContext<ProductContextType | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("fr");
  const [isTransitioning, setIsTransitioning] = useState(false);

  const setLang = useCallback((newLang: Lang) => {
    if (newLang === lang) return;
    setIsTransitioning(true);
    setTimeout(() => {
      setLangState(newLang);
      setTimeout(() => setIsTransitioning(false), 50);
    }, 150);
  }, [lang]);

  const t = useCallback(
    (key: string) => getTranslation(key, lang),
    [lang]
  );

  const dir = lang === "ar" ? "rtl" : "ltr";

  return (
    <ProductContext.Provider value={{ lang, setLang, t, dir, isTransitioning }}>
      {children}
    </ProductContext.Provider>
  );
}

export function useProduct() {
  const ctx = useContext(ProductContext);
  if (!ctx) throw new Error("useProduct must be used within ProductProvider");
  return ctx;
}

export const PRODUCT_IMAGES = [
  "/pack3.png",
  "/pack1.png",
];

export const WHATSAPP_NUMBER = "212681351568";
