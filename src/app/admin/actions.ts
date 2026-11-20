"use server";
import { revalidatePath } from "next/cache";
import { getUserAndProfile } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { ORDER_STATUSES } from "@/lib/formation";

async function requireAdmin() {
  const { user, profile } = await getUserAndProfile();
  if (!user || profile?.role !== "admin") throw new Error("Admins only.");
  return user;
}

const toCents = (v: FormDataEntryValue | null) => {
  const s = String(v ?? "").replace(/[$,\s]/g, "");
  if (s === "") return null;
  const n = Math.round(Number(s) * 100);
  return Number.isFinite(n) && n >= 0 ? n : null;
};

export async function updateOrderStatus(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const status = String(formData.get("status"));
  const note = String(formData.get("note") ?? "").trim() || null;
  if (!ORDER_STATUSES.some((s) => s.key === status)) throw new Error("Unknown status");
  const admin = createAdminClient();
  await admin.from("orders").update({ status, updated_at: new Date().toISOString() }).eq("id", id);
  await admin.from("order_status_history").insert({ order_id: id, status, note });
  revalidatePath(`/admin/orders/${id}`);
  revalidatePath("/admin");
}

export async function saveNotes(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  await createAdminClient().from("orders").update({ admin_notes: String(formData.get("notes") ?? "") }).eq("id", id);
  revalidatePath(`/admin/orders/${id}`);
}

export async function uploadDocument(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id"));
  const file = formData.get("file") as File | null;
  const name = String(formData.get("name") ?? "").trim();
  if (!file || file.size === 0) throw new Error("Choose a file.");
  if (file.size > 20 * 1024 * 1024) throw new Error("Files must be under 20 MB.");
  const admin = createAdminClient();
  const { data: order } = await admin.from("orders").select("user_id").eq("id", id).single();
  if (!order) throw new Error("Order not found");
  const safe = file.name.replace(/[^\w.\-]+/g, "_");
  const path = `${order.user_id}/${id}/${Date.now()}-${safe}`;
  const { error } = await admin.storage.from("documents").upload(path, file, { contentType: file.type || "application/octet-stream" });
  if (error) throw new Error(error.message);
  await admin.from("documents").insert({ order_id: id, user_id: order.user_id, name: name || file.name, storage_path: path });
  revalidatePath(`/admin/orders/${id}`);
}

export async function deleteDocument(formData: FormData) {
  await requireAdmin();
  const docId = String(formData.get("doc_id"));
  const orderId = String(formData.get("id"));
  const admin = createAdminClient();
  const { data: doc } = await admin.from("documents").select("storage_path").eq("id", docId).single();
  if (doc) await admin.storage.from("documents").remove([doc.storage_path]);
  await admin.from("documents").delete().eq("id", docId);
  revalidatePath(`/admin/orders/${orderId}`);
}

export async function savePrices(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const keys = formData.getAll("price_key").map(String);
  for (const key of keys) {
    await admin.from("addon_prices").update({
      price_cents: toCents(formData.get(`price_${key}`)),
      active: formData.get(`active_${key}`) === "on",
    }).eq("key", key);
  }
  revalidatePath("/admin/prices");
  revalidatePath("/");
}

export async function saveStateFees(formData: FormData) {
  await requireAdmin();
  const admin = createAdminClient();
  const codes = formData.getAll("fee_code").map(String);
  const rows = codes.map((code) => ({ code, llc_fee_cents: toCents(formData.get(`fee_${code}`)) }));
  for (const r of rows) await admin.from("state_fees").update({ llc_fee_cents: r.llc_fee_cents }).eq("code", r.code);
  revalidatePath("/admin/prices");
}
