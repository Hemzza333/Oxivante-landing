import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, phone, city, address, product, price, lang, url } = body;

    if (!name || !phone || !city) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    const orderId = "OX-" + Date.now().toString(36).toUpperCase();
    const now = new Date().toISOString();

    const orderData = {
      date: now,
      orderId,
      name,
      phone,
      city,
      product: product || "PACK FEMME PREMIUM",
      price: price || "349 DH",
      pageLang: lang || "fr",
      pageUrl: url || "",
      source: "Website",
      status: "NEW",
      address: address || "",
      notes: "",
    };

    // Send to Google Sheet via Apps Script
    const scriptUrl = process.env.GOOGLE_APPS_SCRIPT_URL;

    if (scriptUrl) {
      try {
        await fetch(scriptUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(orderData),
        });
      } catch (err) {
        console.error("Google Sheets error:", err);
        // Don't fail the order if sheet logging fails
      }
    }

    return NextResponse.json({
      success: true,
      orderId,
    });
  } catch (err) {
    console.error("Order API error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
