"use client";

import { useState } from "react";
import { useProduct } from "@/lib/product-context";
import { ChevronDown, SparklesIcon } from "@/components/Icons";

export function FAQ() {
  const { t, dir } = useProduct();

  const faqs = [
    { q: t("faq.1.q"), a: t("faq.1.a") },
    { q: t("faq.2.q"), a: t("faq.2.a") },
    { q: t("faq.3.q"), a: t("faq.3.a") },
    { q: t("faq.4.q"), a: t("faq.4.a") },
    { q: t("faq.5.q"), a: t("faq.5.a") },
  ];

  return (
    <section className="px-5 pt-7 pb-2" dir={dir}>
      <div className="flex items-center gap-2 mb-4">
        <SparklesIcon size={15} className="text-primary" />
        <h3 className="text-[15px] font-bold text-foreground tracking-tight">{t("faq.title")}</h3>
      </div>
      <div className="flex flex-col gap-2">
        {faqs.map((faq, i) => (
          <FAQItem key={i} question={faq.q} answer={faq.a} />
        ))}
      </div>
    </section>
  );
}

function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="rounded-[18px] bg-card border border-border/40 shadow-sm shadow-foreground/[0.02] overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between p-4 text-left gap-3 min-h-[52px]"
        aria-expanded={open}
      >
        <span className="text-[13px] font-medium text-foreground leading-relaxed">{question}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-muted-foreground transition-transform duration-300 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          open ? "max-h-48 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-4 pb-4 text-[12px] text-muted-foreground leading-relaxed">
          {answer}
        </p>
      </div>
    </div>
  );
}
