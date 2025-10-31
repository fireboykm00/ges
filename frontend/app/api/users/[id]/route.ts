import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8080";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const store = await cookies();
  const token = store.get("ges_token")?.value;
  const { id } = await params;
  
  const r = await fetch(`${BACKEND_URL}/api/users/${id}`, {
    headers: { Authorization: token ? `Bearer ${token}` : "" },
    cache: "no-store",
  });
  
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const store = await cookies();
  const token = store.get("ges_token")?.value;
  const { id } = await params;
  const body = await req.json();
  
  const r = await fetch(`${BACKEND_URL}/api/users/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: token ? `Bearer ${token}` : "",
    },
    body: JSON.stringify(body),
  });
  
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const store = await cookies();
  const token = store.get("ges_token")?.value;
  const { id } = await params;
  
  const r = await fetch(`${BACKEND_URL}/api/users/${id}`, {
    method: "DELETE",
    headers: { Authorization: token ? `Bearer ${token}` : "" },
  });
  
  if (r.status === 204) {
    return new NextResponse(null, { status: 204 });
  }
  
  const data = await r.json().catch(() => ({}));
  return NextResponse.json(data, { status: r.status });
}
