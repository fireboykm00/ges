import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

function backend() {
  return process.env.BACKEND_URL || "http://localhost:8080";
}

export async function GET(req: NextRequest) {
  const store = await cookies();
  const token = store.get("ges_token")?.value;
  const qs = req.nextUrl.search;
  const r = await fetch(`${backend()}/api/stocks${qs}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    cache: "no-store",
  });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}

export async function POST(req: NextRequest) {
  const store = await cookies();
  const token = store.get("ges_token")?.value;
  const body = await req.json();
  const r = await fetch(`${backend()}/api/stocks`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
