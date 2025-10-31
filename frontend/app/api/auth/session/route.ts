import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type JwtPayload = { sub?: string; name?: string; email?: string; role?: string; [k: string]: unknown };

function decodeJwt(token: string): JwtPayload | null {
  try {
    const [, payload] = token.split(".");
    const json = Buffer.from(payload, "base64").toString("utf8");
    return JSON.parse(json);
  } catch {
    return null;
  }
}

export async function GET() {
  const store = await cookies();
  const token = store.get("ges_token")?.value;
  if (!token) return NextResponse.json({ user: null }, { status: 401 });
  const payload = decodeJwt(token);
  return NextResponse.json({ user: payload || null }, { status: payload ? 200 : 400 });
}
