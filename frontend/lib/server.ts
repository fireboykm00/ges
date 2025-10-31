export function getBackendUrl() {
  return process.env.BACKEND_URL || "http://localhost:8080";
}

export async function backendFetch(path: string, init: RequestInit = {}) {
  const url = `${getBackendUrl()}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, init);
  return res;
}