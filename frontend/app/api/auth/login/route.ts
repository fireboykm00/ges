import { NextRequest, NextResponse } from "next/server";

function backendUrl() {
  return process.env.BACKEND_URL || "http://localhost:8080";
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const res = await fetch(`${backendUrl()}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));
  const status = res.status;

  const response = NextResponse.json(data, { status });

  if (res.ok && data?.token) {
    response.cookies.set("ges_token", data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });
  }

  return response;
}