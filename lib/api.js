import { BACKEND_URL } from "./config";

async function http(path, { method = "GET", body, headers = {} } = {}) {
  const res = await fetch(`${BACKEND_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(text || `HTTP ${res.status}`);
  }
  return res.json();
}

export async function startSearch(payload) {
  return http(`/search/start`, { method: "POST", body: payload });
}

export async function getStatus(jobId) {
  return http(`/search/${jobId}`);
}

export async function chooseCandidate(jobId, index) {
  return http(`/search/${jobId}/choose-candidate`, { method: "POST", body: { index } });
}

export async function answer(jobId, payload) {
  return http(`/search/${jobId}/answer`, { method: "POST", body: payload });
}


