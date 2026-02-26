"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useProduct, WHATSAPP_NUMBER } from "@/lib/product-context";
import { XIcon, CheckCircle, WhatsAppIcon } from "@/components/Icons";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
}

/* ───────── Submit to Google Sheet ───────── */
async function submitToSheet(payload: any) {
  const url = process.env.NEXT_PUBLIC_SHEET_WEBAPP_URL;
  if (!url) throw new Error("Missing NEXT_PUBLIC_SHEET_WEBAPP_URL");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let json: any = {};
  try {
    json = JSON.parse(text);
  } catch {}

  if (!res.ok || json?.ok === false) {
    throw new Error(json?.error || "Failed to submit order");
  }

  return json;
}

/* ───────── Component ───────── */
export function OrderModal({ open, onClose }: OrderModalProps) {
  const { t, dir, lang } = useProduct();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const scrollYRef = useRef(0);

  /* ───────── Scroll Lock ───────── */
  useEffect(() => {
    if (open) {
      scrollYRef.current = window.scrollY;
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollYRef.current}px`;
      document.body.style.width = "100%";
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      document.body.style.overflow = "";
      window.scrollTo(0, scrollYRef.current);
    }
  }, [open]);

  const resetForm = useCallback(() => {
    setName("");
    setPhone("");
    setCity("");
    setAddress("");
    setError("");
    setSuccess(false);
    setOrderId("");
  }, []);

  const handleClose = useCallback(() => {
    resetForm();
    onClose();
  }, [onClose, resetForm]);

  /* ───────── Submit Handler ───────── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!name.trim()) return setError(t("validation.name"));
    if (!phone.trim()) return setError(t("validation.phone"));
if (!/^0[67]\d{8}$/.test(phone)) {
  return setError("Numéro marocain invalide");
}
    if (!city.trim()) return setError(t("validation.city"));

    setSubmitting(true);

    const generatedId = "ORD-" + Date.now();

    try {
      const payload = {
        orderId: generatedId,
        lang,
        product: t("hero.title"),
        price: "349",
        fullName: name.trim(),
        phone: phone.trim(),
        city: city.trim(),
        addressNotes: address.trim(),
        status: "NEW",
        source: "website",
        notes: "",
      };

    const json = await submitToSheet(payload);

    setOrderId(json.orderId || generatedId);

    // 🔥 Facebook Lead Event
    if (typeof window !== "undefined") {
      const w = window as any;
      if (w.fbq) {
        w.fbq("track", "Lead", {
          value: 349,
          currency: "MAD",
        });
      }
    }

    setSuccess(true);
  } catch (err) {
    setError(err instanceof Error ? err.message : "An error occurred");
  } finally {
    setSubmitting(false);
  }
};

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" dir={dir}>
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/20 backdrop-blur-md"
        onClick={handleClose}
      />

      {/* Sheet */}
      <div className="relative w-full max-w-md bg-white rounded-t-[32px] shadow-2xl max-h-[90vh] flex flex-col">

        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-[4px] rounded-full bg-gray-300" />
        </div>

        {/* Close */}
        <button
          onClick={handleClose}
          className="absolute top-3 end-4 w-9 h-9 rounded-full bg-white/80 backdrop-blur flex items-center justify-center text-black shadow-sm border border-black/5"
        >
          <XIcon size={16} />
        </button>

        <div className="flex-1 overflow-y-auto px-5 pb-8 pt-2">

          {!success ? (
            <>
              <h3 className="text-lg font-bold mt-2 mb-5">
                {t("modal.title")}
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">

                <InputField label={t("modal.name")} value={name} onChange={setName} />
                <InputField
  label={t("modal.phone")}
  value={phone}
  onChange={(val) =>
    setPhone(
      val
        .replace(/[^\d]/g, "")  // يمنع أي حرف
        .slice(0, 10)          // أقصى 10 أرقام
    )
  }
/>
                <InputField label={t("modal.city")} value={city} onChange={setCity} />
                <InputField label={t("modal.address")} value={address} onChange={setAddress} required={false} />

                {error && (
                  <p className="text-sm text-red-600 bg-red-50 px-3 py-2 rounded-xl">
                    {error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full py-4 rounded-[22px] bg-purple-600 text-white font-bold shadow-lg disabled:opacity-60"
                >
                  {submitting ? t("modal.submitting") : t("modal.submit")}
                </button>
              </form>
            </>
          ) : (
            <SuccessView
              orderId={orderId}
              name={name}
              t={t}
              onClose={handleClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}

/* ───────── Input ───────── */
function InputField({
  label,
  value,
  onChange,
  required = true,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-sm text-gray-600">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-4 py-3 rounded-2xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
      />
    </label>
  );
}

/* ───────── Success ───────── */
function SuccessView({
  orderId,
  name,
  t,
  onClose,
}: {
  orderId: string;
  name: string;
  t: (key: string) => string;
  onClose: () => void;
}) {
  return (
    <div className="flex flex-col items-center text-center py-6">

      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
        <CheckCircle size={32} className="text-green-600" />
      </div>

      <h3 className="text-xl font-bold mb-1">
        {t("modal.success.title")}
      </h3>

      <p className="text-sm text-gray-500 mb-5">
        {t("modal.success.text")}
      </p>

      <div className="w-full bg-gray-50 rounded-2xl p-4 mb-5 text-sm">
        <div className="flex justify-between">
          <span>{t("modal.success.order")}</span>
          <span className="font-mono font-bold">{orderId}</span>
        </div>
        <div className="flex justify-between mt-2">
          <span>{t("modal.name")}</span>
          <span>{name}</span>
        </div>
      </div>

      <a
        href={`https://wa.me/${WHATSAPP_NUMBER}`}
        target="_blank"
        className="w-full py-3.5 rounded-[20px] bg-green-500 text-white font-bold mb-3 text-center"
      >
        {t("modal.whatsapp")}
      </a>

      <button
        onClick={onClose}
        className="w-full py-3.5 rounded-[20px] bg-gray-200 font-medium"
      >
        {t("modal.back")}
      </button>
    </div>
  );
}