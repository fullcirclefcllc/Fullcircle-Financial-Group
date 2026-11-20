"use client";
import { useEffect } from "react";
import { DRAFT_KEY } from "@/lib/formation";

/** Removes the saved formation draft once an order has been paid. */
export function ClearDraft() {
  useEffect(() => { try { localStorage.removeItem(DRAFT_KEY); } catch {} }, []);
  return null;
}
