"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useProduct, WHATSAPP_NUMBER } from "@/lib/product-context";
import { XIcon, CheckCircle } from "@/components/Icons";

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
}

const PRICE = 349;
const CURRENCY = "MAD";
const PRODUCT_NAME = "PACK FEMME PREMIUM";
const PRODUCT_ID = "pack-femme-premium";

/* ───────── Tracking Helpers ───────── */

function trackTikTokInitiateCheckout() {
  if (typeof window === "undefined") return;
  const w = window as any;

  if (w.ttq && typeof w.ttq.track === "function") {
    w.ttq.track("InitiateCheckout", {
      content_id: PRODUCT_ID,
      content_type: "product",
      content_name: PRODUCT_NAME,
      quantity: 1,
      value: PRICE,
      currency: CURRENCY,
    });
  }
}

function trackTikTokPurchase(params: {
  value: number;
  currency: string;
  orderId?: string;
}) {
  if (typeof window === "undefined") return;

  const w = window as any;

  if (w.ttq && typeof w.ttq.track === "function") {
    w.ttq.track("Purchase", {
      value: params.value,
      currency: params.currency,

      contents: [
        {
          content_id: PRODUCT_ID,
          content_type: "product",
          content_name: PRODUCT_NAME,
          quantity: 1,
        },
      ],

      content_id: PRODUCT_ID,
      content_type: "product",
      content_name: PRODUCT_NAME,
      quantity: 1,
      order_id: params.orderId,
    });
  }
}

function trackFacebookLead(params: {
  value: number;
  currency: string;
  orderId?: string;
}) {
  const w = window as any;

  if (typeof w.fbq === "function") {
    w.fbq("track", "Lead", {
      value: params.value,
      currency: params.currency,
      order_id: params.orderId,
    });
  }
}

function trackFacebookPurchase(params: {
  value: number;
  currency: string;
  orderId?: string;
}) {
  const w = window as any;

  if (typeof w.fbq === "function") {
    w.fbq("track", "Purchase", {
      value: params.value,
      currency: params.currency,
      content_name: PRODUCT_NAME,
      content_type: "product",
      contents: [{ id: PRODUCT_ID, quantity: 1 }],
      num_items: 1,
      order_id: params.orderId,
    });
  }
}

function trackGA4Lead(params: {
  value: number;
  currency: string;
  orderId?: string;
}) {
  const w = window as any;

  if (typeof w.gtag === "function") {
    w.gtag("event", "generate_lead", {
      value: params.value,
      currency: params.currency,
      order_id: params.orderId,
    });
  }
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

  const checkoutFiredRef = useRef(false);
  const purchaseFiredRef = useRef(false);

  /* ───────── InitiateCheckout ───────── */

  useEffect(() => {
    if (open && !checkoutFiredRef.current) {
      checkoutFiredRef.current = true;
      trackTikTokInitiateCheckout();
    }
  }, [open]);

  /* ───────── Purchase ───────── */

  useEffect(() => {
    if (!success) return;

    if (!purchaseFiredRef.current) {
      purchaseFiredRef.current = true;

      trackFacebookLead({
        value: PRICE,
        currency: CURRENCY,
        orderId,
      });

      trackFacebookPurchase({
        value: PRICE,
        currency: CURRENCY,
        orderId,
      });

      trackTikTokPurchase({
        value: PRICE,
        currency: CURRENCY,
        orderId,
      });

      trackGA4Lead({
        value: PRICE,
        currency: CURRENCY,
        orderId,
      });
    }
  }, [success, orderId]);

  /* ───────── Submit ───────── */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const id = "ORD-" + Date.now();

    setSubmitting(true);

    try {
      setOrderId(id);
      setSuccess(true);
    } catch (err) {
      setError("Erreur");
    }

    setSubmitting(false);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" dir={dir}>
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-[32px] shadow-2xl max-h-[90vh] flex flex-col">

        {!success ? (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-3">

            <input
              placeholder={t("modal.name")}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border rounded-xl p-3"
            />

            <input
              placeholder={t("modal.phone")}
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border rounded-xl p-3"
            />

            <input
              placeholder={t("modal.city")}
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="border rounded-xl p-3"
            />

            <input
              placeholder={t("modal.address")}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border rounded-xl p-3"
            />

            {error && <p className="text-red-500">{error}</p>}

            <button
              disabled={submitting}
              className="bg-purple-600 text-white py-4 rounded-xl font-bold"
            >
              {submitting ? "..." : t("modal.submit")}
            </button>

          </form>
        ) : (
          <div className="text-center p-6">

            <CheckCircle className="mx-auto text-green-500" size={40} />

            <h3 className="text-xl font-bold mt-3">
              Commande confirmée !
            </h3>

            <p className="mt-2 text-gray-500">
              Merci pour votre confiance
            </p>

            <p className="mt-4 font-mono">{orderId}</p>

            <a
              href={`https://wa.me/${WHATSAPP_NUMBER}`}
              className="block mt-4 bg-green-500 text-white py-3 rounded-xl"
            >
              Support WhatsApp
            </a>

            <button
              onClick={onClose}
              className="block w-full mt-2 bg-gray-200 py-3 rounded-xl"
            >
              Retour à l'accueil
            </button>

          </div>
        )}
      </div>
    </div>
  );
}