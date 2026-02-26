"use client";

import { useProduct, type Lang } from "@/lib/product-context";

export function LanguageToggle() {
  const { lang, setLang } = useProduct();

  return (
    <div className="flex items-center rounded-full glass p-0.5 shadow-sm border border-white/30">
      <button
        onClick={() => setLang("fr")}
        className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
          lang === "fr"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-foreground/60 hover:text-foreground"
        }`}
        aria-label="Français"
      >
        FR
      </button>
      <button
        onClick={() => setLang("ar")}
        className={`px-3.5 py-1 text-xs font-semibold rounded-full transition-all duration-200 ${
          lang === "ar"
            ? "bg-primary text-primary-foreground shadow-sm"
            : "text-foreground/60 hover:text-foreground"
        }`}
        aria-label="العربية"
      >
        AR
      </button>
    </div>
  );
}
