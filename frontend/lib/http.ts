export async function http<T>(path: string, init?: RequestInit): Promise<T> {
  const base = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080/api';
  const res = await fetch(`${base}${path}`, { cache: 'no-store', ...(init||{}) });
  if (!res.ok) throw new Error(await res.text());
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}
