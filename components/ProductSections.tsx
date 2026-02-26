"use client";

import { useProduct } from "@/lib/product-context";
import {
  DeliveryIcon,
  ClientsIcon,
  StarIcon,
  LeafIcon,
  ShieldPlusIcon,
  DropletIcon,
  NaturalIcon,
  MoroccoIcon,
  CalendarIcon,
  WomanIcon,
  CheckCircle,
  CertBadgeIcon,
  ClockIcon,
  SparklesIcon,
  UserIcon,
  IconBadge,
} from "@/components/Icons";

/* ─── FLOATING STATS ROW ─── */
export function StatsRow() {
  const { t, dir } = useProduct();
  const stats = [
    {
      icon: DeliveryIcon,
      value: t("stats.delivery.value"),
      label: t("stats.delivery.label"),
      bg: "bg-ox-blush",
      iconColor: "text-primary",
    },
    {
      icon: ClientsIcon,
      value: t("stats.clients.value"),
      label: t("stats.clients.label"),
      bg: "bg-ox-lavender",
      iconColor: "text-purple-500",
    },
    {
      icon: StarIcon,
      value: t("stats.rating.value"),
      label: t("stats.rating.label"),
      bg: "bg-ox-peach",
      iconColor: "text-amber-500",
    },
  ];

  return (
    <div className="flex items-stretch gap-2.5 px-5 -mt-4 relative z-10" dir={dir}>
      {stats.map((s, i) => (
        <div
          key={i}
          className="flex-1 flex flex-col items-center gap-1.5 py-3.5 px-2 rounded-[22px] bg-card shadow-lg shadow-foreground/[0.04] border border-border/60"
          style={{ animation: `floatUp 400ms ${i * 80}ms ease both` }}
        >
          <IconBadge bg={s.bg} className="w-9 h-9">
            <s.icon size={16} className={s.iconColor} />
          </IconBadge>
          <span className="text-sm font-bold text-foreground">{s.value}</span>
          <span className="text-[10px] text-muted-foreground font-medium">{s.label}</span>
        </div>
      ))}
    </div>
  );
}

/* ─── PRODUCT INFO (title, price, badges) ─── */
export function ProductInfo() {
  const { t, dir } = useProduct();

  return (
    <div className="px-5 pt-6 pb-1" dir={dir}>
      <div className="flex items-start justify-between gap-3">
        <h2 className="text-xl font-bold text-foreground tracking-tight text-balance leading-relaxed">
          {t("hero.title")}
        </h2>
        <span className="inline-flex items-center px-4 py-1.5 rounded-full bg-primary text-primary-foreground text-sm font-bold shadow-md shadow-primary/20 shrink-0">
          {t("hero.price")}
        </span>
      </div>
      <p className="text-xs text-muted-foreground mt-1.5 font-medium">{t("hero.origin")}</p>
      <div className="flex flex-wrap gap-2.5 mt-3.5">
        <PillBadge text={t("hero.delivery")} />
        <PillBadge text={t("hero.payment")} />
      </div>
    </div>
  );
}

function PillBadge({ text }: { text: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[11px] text-primary font-semibold bg-ox-rose-light px-3.5 py-1.5 rounded-full">
      <CheckCircle size={12} />
      {text}
    </span>
  );
}

/* ─── PACK CONTENTS ─── */
export function PackContents() {
  const { t, dir } = useProduct();

  const items = [
    {
      icon: LeafIcon,
      name: t("contents.ashwagandha.name"),
      desc: t("contents.ashwagandha.desc"),
      bg: "bg-ox-mint",
      iconColor: "text-emerald-600",
    },
    {
      icon: ShieldPlusIcon,
      name: t("contents.iron.name"),
      desc: t("contents.iron.desc"),
      bg: "bg-ox-peach",
      iconColor: "text-orange-500",
    },
    {
      icon: DropletIcon,
      name: t("contents.collagen.name"),
      desc: t("contents.collagen.desc"),
      bg: "bg-ox-lavender",
      iconColor: "text-violet-500",
    },
  ];

  return (
    <section className="px-5 pt-7" dir={dir}>
      <SectionTitle text={t("contents.title")} />
      <div className="flex flex-col gap-2.5 mt-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3.5 p-3.5 rounded-[20px] bg-card shadow-sm shadow-foreground/[0.03] border border-border/50"
          >
            <IconBadge bg={item.bg} className="w-11 h-11">
              <item.icon size={20} className={item.iconColor} />
            </IconBadge>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-semibold text-foreground">{item.name}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
            <span className="text-[9px] text-muted-foreground bg-muted px-2.5 py-1 rounded-full shrink-0 font-medium uppercase tracking-wide">
              {t("contents.format")}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── WHY THIS PACK ─── */
export function WhySection() {
  const { t, dir } = useProduct();

  const items = [
    { icon: NaturalIcon, text: t("why.natural"), bg: "bg-ox-mint", iconColor: "text-emerald-600" },
    { icon: MoroccoIcon, text: t("why.morocco"), bg: "bg-ox-peach", iconColor: "text-amber-600" },
    { icon: CalendarIcon, text: t("why.results"), bg: "bg-ox-lavender", iconColor: "text-violet-500" },
    { icon: WomanIcon, text: t("why.women"), bg: "bg-ox-blush", iconColor: "text-primary" },
  ];

  return (
    <section className="px-5 pt-7" dir={dir}>
      <SectionTitle text={t("why.title")} />
      <div className="flex flex-col gap-2 mt-4">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3.5 p-3.5 rounded-[18px] bg-card shadow-sm shadow-foreground/[0.02] border border-border/40"
          >
            <IconBadge bg={item.bg} className="w-9 h-9">
              <item.icon size={16} className={item.iconColor} />
            </IconBadge>
            <p className="text-[13px] text-foreground leading-relaxed">{item.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── DESCRIPTION ─── */
export function DescriptionSection() {
  const { t, dir } = useProduct();

  return (
    <section className="px-5 pt-7" dir={dir}>
      <SectionTitle text={t("desc.title")} />
      <div className="mt-4 p-4 rounded-[22px] bg-card shadow-sm shadow-foreground/[0.03] border border-border/40">
        <p className="text-[13px] text-muted-foreground leading-relaxed">
          {t("desc.text")}
        </p>
      </div>

      <div className="flex flex-col gap-2.5 mt-4">
        <MiniCard
          icon={ClockIcon}
          title={t("desc.howto.title")}
          text={t("desc.howto.text")}
          bg="bg-ox-mint"
          iconColor="text-emerald-600"
        />
        <MiniCard
          icon={UserIcon}
          title={t("desc.forwho.title")}
          text={t("desc.forwho.text")}
          bg="bg-ox-blush"
          iconColor="text-primary"
        />
      </div>
    </section>
  );
}

function MiniCard({
  icon: Icon,
  title,
  text,
  bg,
  iconColor,
}: {
  icon: React.ComponentType<{ size?: number; className?: string }>;
  title: string;
  text: string;
  bg: string;
  iconColor: string;
}) {
  return (
    <div className="flex gap-3.5 p-4 rounded-[20px] bg-card shadow-sm shadow-foreground/[0.03] border border-border/40">
      <IconBadge bg={bg} className="w-10 h-10">
        <Icon size={18} className={iconColor} />
      </IconBadge>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-semibold text-foreground">{title}</p>
        <p className="text-[11px] text-muted-foreground mt-0.5 leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

/* ─── CERTIFICATIONS ─── */
export function CertificationsSection() {
  const { t, dir } = useProduct();

  const certs = [
    { title: t("cert.iso"), desc: t("cert.iso.desc"), bg: "bg-ox-lavender", iconColor: "text-violet-500" },
    { title: t("cert.onssa"), desc: t("cert.onssa.desc"), bg: "bg-ox-peach", iconColor: "text-amber-600" },
    { title: t("cert.halal"), desc: t("cert.halal.desc"), bg: "bg-ox-mint", iconColor: "text-emerald-600" },
  ];

  return (
    <section className="px-5 pt-7" dir={dir}>
      <SectionTitle text={t("cert.title")} />
      <div className="flex gap-2.5 mt-4">
        {certs.map((cert, i) => (
          <div
            key={i}
            className="flex-1 flex flex-col items-center gap-2 p-3.5 rounded-[22px] bg-card shadow-md shadow-foreground/[0.04] border border-border/40 text-center"
          >
            <IconBadge bg={cert.bg} className="w-11 h-11">
              <CertBadgeIcon size={20} className={cert.iconColor} />
            </IconBadge>
            <p className="text-[11px] font-bold text-foreground">{cert.title}</p>
            <p className="text-[9px] text-muted-foreground leading-tight">{cert.desc}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─── SHARED: Section Title ─── */
function SectionTitle({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-2">
      <SparklesIcon size={15} className="text-primary" />
      <h3 className="text-[15px] font-bold text-foreground tracking-tight">{text}</h3>
    </div>
  );
}
