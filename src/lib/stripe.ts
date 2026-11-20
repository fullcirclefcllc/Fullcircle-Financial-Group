import "server-only";
import Stripe from "stripe";

let client: Stripe | null = null;
export function stripe() {
  if (!process.env.STRIPE_SECRET_KEY) throw new Error("Payments aren't set up yet (STRIPE_SECRET_KEY missing).");
  client ??= new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}
