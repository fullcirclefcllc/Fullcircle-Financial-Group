import { NextResponse } from "next/server";
import { getUserAndProfile } from "@/lib/supabase/server";
import { loadClients, toCsv } from "@/lib/clients";

// Downloads every client sign-up as a spreadsheet (opens in Excel or Google Sheets).
export async function GET(req: Request) {
  const { user, profile } = await getUserAndProfile();
  if (!user || profile?.role !== "admin") return NextResponse.json({ error: "Admins only." }, { status: 403 });
  const service = new URL(req.url).searchParams.get("service");
  const rows = (await loadClients()).filter((r) => !service || r.services.includes(service));
  const date = new Date().toISOString().slice(0, 10);
  return new NextResponse(toCsv(rows), {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="full-circle-clients-${service ?? "all"}-${date}.csv"`,
      "Cache-Control": "no-store",
    },
  });
}
