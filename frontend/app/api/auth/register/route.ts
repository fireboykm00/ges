import { NextRequest, NextResponse } from "next/server";

function backendUrl() {
  return process.env.BACKEND_URL || "http://localhost:8080";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${backendUrl()}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  return NextResponse.json(data, { status: res.status });
}