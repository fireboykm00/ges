import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

function backend() { return process.env.BACKEND_URL || "http://localhost:8080"; }

export async function GET(_: NextRequest, { params }: { params: { id: string } }) {
  const store = await cookies();
  const token = store.get("ges_token")?.value;
  const r = await fetch(`${backend()}/api/stocks/${params.id}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const store = await cookies();
  const token = store.get("ges_token")?.value;
  const body = await req.json();
  const r = await fetch(`${backend()}/api/stocks/${params.id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json", Authorization: token ? `Bearer ${token}` : "" },
    body: JSON.stringify(body),
  });
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}

export async function DELETE(_: NextRequest, { params }: { params: { id: string } }) {
  const store = await cookies();
  const token = store.get("ges_token")?.value;
  const r = await fetch(`${backend()}/api/stocks/${params.id}`, {
    method: "DELETE",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  return NextResponse.json({}, { status: r.status });
}
