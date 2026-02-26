"use client";

import { useState, useEffect } from "react";
import { ProductProvider, useProduct } from "@/lib/product-context";
import { HeroCard } from "@/components/HeroCard";
import {
  StatsRow,
  ProductInfo,
  PackContents,
  WhySection,
  DescriptionSection,
  CertificationsSection,
} from "@/components/ProductSections";
import { FAQ } from "@/components/FAQ";
import { OrderModal } from "@/components/OrderModal";
import { SparklesIcon } from "@/components/Icons";

export default function Page() {
  return (
    <ProductProvider>
      <PageContent />
    </ProductProvider>
  );
}

function PageContent() {
  const { t, dir, lang, isTransitioning } = useProduct();
  const [modalOpen, setModalOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Update HTML attrs
  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = dir;
    if (lang === "ar") {
      document.body.style.fontFamily = "'Tajawal', 'Geist', sans-serif";
    } else {
      document.body.style.fontFamily = "";
    }
  }, [lang, dir]);

  return (
    <>
      <main
        className={`min-h-screen bg-background max-w-md mx-auto relative transition-opacity duration-200 ${
          isTransitioning ? "opacity-0" : "opacity-100"
        } ${!mounted ? "opacity-0" : ""}`}
        dir={dir}
      >
        {/* Hero */}
        <HeroCard />

        {/* Floating Stats */}
        <StatsRow />

        {/* Product Info */}
        <ProductInfo />

        {/* Pack Contents */}
        <PackContents />

        {/* Why Section */}
        <WhySection />

        {/* Description */}
        <DescriptionSection />

        {/* Certifications */}
        <CertificationsSection />

        {/* FAQ */}
        <FAQ />

        {/* Bottom spacer for sticky CTA */}
        <div className="h-28" />
      </main>

      {/* Sticky CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40" dir={dir}>
        <div className="max-w-md mx-auto px-5 pb-5 pt-3">
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/95 to-transparent pointer-events-none" />
          <button
            onClick={() => setModalOpen(true)}
            className="relative w-full py-4 rounded-[22px] font-bold text-[14px] shadow-xl shadow-primary/25 press-scale transition-all text-primary-foreground cta-shimmer flex items-center justify-center gap-2"
            style={{
              backgroundImage:
                "linear-gradient(90deg, var(--ox-rose) 0%, oklch(0.62 0.10 340) 25%, var(--ox-rose) 50%, oklch(0.62 0.10 340) 75%, var(--ox-rose) 100%)",
            }}
          >
            <SparklesIcon size={15} className="text-primary-foreground/80" />
            {t("cta.text")}
          </button>
          <p className="relative text-center text-[10px] text-muted-foreground mt-2 font-medium">
            {t("hero.payment")} {" \u2022 "} {t("stats.delivery.label")} {t("stats.delivery.value")}
          </p>
        </div>
      </div>

      {/* Order Modal */}
      <OrderModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
