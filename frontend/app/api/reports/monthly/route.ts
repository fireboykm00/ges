import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
const B = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(req: NextRequest) {
  const store = await cookies();
  const token = store.get("ges_token")?.value;
  const qs = req.nextUrl.search;
  const r = await fetch(`${B}/api/reports/monthly${qs}`, { headers: { Authorization: token ? `Bearer ${token}` : "" } });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
