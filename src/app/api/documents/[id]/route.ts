import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

// Opens a document through a short-lived signed link, after row-level security confirms access.
export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data: doc } = await supabase.from("documents").select("storage_path").eq("id", id).maybeSingle();
  if (!doc) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const { data, error } = await createAdminClient().storage.from("documents").createSignedUrl(doc.storage_path, 60);
  if (error || !data) return NextResponse.json({ error: "Couldn't open the file." }, { status: 500 });
  return NextResponse.redirect(data.signedUrl);
}
