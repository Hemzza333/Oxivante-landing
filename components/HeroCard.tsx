"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { useProduct, PRODUCT_IMAGES } from "@/lib/product-context";
import { LanguageToggle } from "@/components/LanguageToggle";
import { ChevronLeft, Heart } from "@/components/Icons";

export function HeroCard() {
  const { t, dir } = useProduct();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFav, setIsFav] = useState(false);
  const [touchStart, setTouchStart] = useState<number | null>(null);

  // Auto slider refs
  const intervalRef = useRef<number | null>(null);
  const resumeTimeoutRef = useRef<number | null>(null);

  const AUTO_DELAY = 2500; // 2.5s (مزيانة)
  const PAUSE_AFTER_INTERACT = 4500; // شحال يتسنا من بعد swipe/click
  const FADE_MS = 500; // نفس duration-500

  const startAuto = useCallback(() => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    intervalRef.current = window.setInterval(() => {
      setActiveIndex((i) => (i + 1) % PRODUCT_IMAGES.length);
    }, AUTO_DELAY);
  }, []);

  const pauseAuto = useCallback((ms = PAUSE_AFTER_INTERACT) => {
    if (intervalRef.current) window.clearInterval(intervalRef.current);
    if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);

    resumeTimeoutRef.current = window.setTimeout(() => {
      startAuto();
    }, ms);
  }, [startAuto]);

  useEffect(() => {
    // شعل auto ملي الصفحة كتفتح
    startAuto();

    // cleanup ملي كتخرج من الصفحة
    return () => {
      if (intervalRef.current) window.clearInterval(intervalRef.current);
      if (resumeTimeoutRef.current) window.clearTimeout(resumeTimeoutRef.current);
    };
  }, [startAuto]);

  const handleSwipe = useCallback(
    (direction: "left" | "right") => {
      pauseAuto();

      if (direction === "left") {
        setActiveIndex((i) => (i + 1) % PRODUCT_IMAGES.length);
      } else {
        setActiveIndex((i) => (i - 1 + PRODUCT_IMAGES.length) % PRODUCT_IMAGES.length);
      }
    },
    [pauseAuto]
  );

  return (
    <section className="relative w-full overflow-hidden" dir={dir}>
      {/* Soft gradient background - full width, no box */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, var(--ox-hero-start) 0%, var(--ox-hero-mid) 40%, var(--ox-hero-end) 100%)",
        }}
      />

      {/* Bottom fade to white */}
      <div className="absolute bottom-0 left-0 right-0 h-28 bg-gradient-to-t from-background to-transparent" />

      <div className="relative px-5 pt-5 pb-8">
        {/* Top bar */}
        <div className="flex items-center justify-between mb-1">
          <button
            className="flex items-center justify-center w-10 h-10 rounded-full glass border border-white/30 press-scale"
            aria-label="Back"
          >
            <ChevronLeft
              size={18}
              className={`text-foreground/70 ${dir === "rtl" ? "rotate-180" : ""}`}
            />
          </button>

          <LanguageToggle />

          <button
            onClick={() => setIsFav(!isFav)}
            className="flex items-center justify-center w-10 h-10 rounded-full glass border border-white/30 press-scale"
            aria-label="Favorite"
          >
            <Heart
              size={18}
              className={isFav ? "fill-primary text-primary" : "text-foreground/70"}
            />
          </button>
        </div>

        {/* Brand name */}
        <div className="text-center mb-2">
          <span className="text-[11px] font-semibold tracking-[0.25em] text-foreground/50 uppercase">
            {t("brand")}
          </span>
        </div>

        {/* Product image */}
        <div
          className="relative mx-auto w-full max-w-[260px] aspect-square"
          onTouchStart={(e) => setTouchStart(e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchStart === null) return;
            const diff = touchStart - e.changedTouches[0].clientX;

            if (Math.abs(diff) > 50) {
              handleSwipe(diff > 0 ? "left" : "right");
            }
            setTouchStart(null);
          }}
        >
          {PRODUCT_IMAGES.map((src, i) => (
            <img
              key={i}
              src={src}
              alt={`${t("hero.title")} - ${i + 1}`}
              className={`absolute inset-0 w-full h-full object-contain drop-shadow-xl transition-opacity duration-[${FADE_MS}ms] ease-in-out ${
                i === activeIndex ? "opacity-100" : "opacity-0"
              }`}
              loading={i === 0 ? "eager" : "lazy"}
            />
          ))}
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-3">
          {PRODUCT_IMAGES.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                pauseAuto();
                setActiveIndex(i);
              }}
              className={`rounded-full transition-all duration-300 ${
                i === activeIndex ? "w-6 h-[5px] bg-primary" : "w-[5px] h-[5px] bg-foreground/20"
              }`}
              aria-label={`Image ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}