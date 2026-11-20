import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { createAdminClient } from "@/lib/supabase/admin";

// Stripe calls this after a payment. Add it in Stripe > Developers > Webhooks:
//   URL: https://YOUR-SITE/api/stripe/webhook   Event: checkout.session.completed
export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const secret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!sig || !secret) return NextResponse.json({ error: "Not configured" }, { status: 400 });

  let event: Stripe.Event;
  try {
    event = stripe().webhooks.constructEvent(await req.text(), sig, secret);
  } catch (e) {
    console.error("webhook signature", e);
    return NextResponse.json({ error: "Bad signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderId = session.metadata?.order_id || session.client_reference_id;
    if (orderId && session.payment_status === "paid") {
      const admin = createAdminClient();
      const { data: updated } = await admin
        .from("orders")
        .update({ status: "paid", updated_at: new Date().toISOString() })
        .eq("id", orderId)
        .eq("status", "awaiting_payment")
        .select("id");
      if (updated?.length) {
        await admin.from("order_status_history").insert({ order_id: orderId, status: "paid", note: "Payment received" });
      }
    }
  }
  return NextResponse.json({ received: true });
}
