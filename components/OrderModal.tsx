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

  if (typeof w.ttq === "function") {
    w.ttq.track("InitiateCheckout", {
      value: PRICE,
      currency: CURRENCY,
      content_id: PRODUCT_ID,
      content_type: "product",
      content_name: PRODUCT_NAME,
      quantity: 1,
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

  if (typeof w.ttq === "function") {
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

/* ───────── Google Sheet ───────── */

async function submitToSheet(payload: any) {
  const url = process.env.NEXT_PUBLIC_SHEET_WEBAPP_URL;

  const res = await fetch(url!, {
    method: "POST",
    headers: {
      "Content-Type": "text/plain;charset=utf-8",
    },
    body: JSON.stringify(payload),
  });

  return res.json();
}

/* ───────── Component ───────── */

export function OrderModal({ open, onClose }: OrderModalProps) {
  const { t, dir, lang } = useProduct();

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [success, setSuccess] = useState(false);
  const [orderId, setOrderId] = useState("");

  const checkoutFiredRef = useRef(false);
  const purchaseFiredRef = useRef(false);

  /* ───────── Initiate Checkout ───────── */

  useEffect(() => {
    if (open && !checkoutFiredRef.current) {
      checkoutFiredRef.current = true;
      trackTikTokInitiateCheckout();
    }
  }, [open]);

  /* ───────── Purchase Event ───────── */

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

  /* ───────── Submit Order ───────── */

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const id = "ORD-" + Date.now();

    const payload = {
      orderId: id,
      lang,
      product: PRODUCT_NAME,
      price: PRICE,
      fullName: name,
      phone,
      city,
      addressNotes: address,
      status: "NEW",
      source: "website",
    };

    try {
      await submitToSheet(payload);

      setOrderId(id);
      setSuccess(true);
    } catch (err) {
      alert("Erreur lors de la commande");
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center" dir={dir}>
      <div className="absolute inset-0 bg-black/30" onClick={onClose} />

      <div className="relative w-full max-w-md bg-white rounded-t-3xl p-6">

        {!success ? (
          <>
            <h3 className="text-xl font-bold mb-4">{t("modal.title")}</h3>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">

              <input
                placeholder={t("modal.name")}
                className="border rounded-xl p-3"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />

              <input
                placeholder={t("modal.phone")}
                className="border rounded-xl p-3"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />

              <input
                placeholder={t("modal.city")}
                className="border rounded-xl p-3"
                value={city}
                onChange={(e) => setCity(e.target.value)}
              />

              <input
                placeholder={t("modal.address")}
                className="border rounded-xl p-3"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
              />

              <button className="bg-purple-600 text-white py-4 rounded-xl font-bold">
                {t("modal.submit")}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center">

            <CheckCircle className="mx-auto text-green-500" size={40} />

            <h3 className="text-xl font-bold mt-3">
              Commande confirmée !
            </h3>

            <p className="text-gray-500 mt-2">
              Merci pour votre confiance.
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