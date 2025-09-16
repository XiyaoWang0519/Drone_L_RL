import type { Anchor, AnchorClock, AnchorResponse, HealthResponse } from "./types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init && init.headers ? init.headers : {}),
    },
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(`Request failed (${res.status}): ${text}`);
  }
  if (res.status === 204) {
    return {} as T;
  }
  return (await res.json()) as T;
}

function join(base: string, path: string): string {
  const trimmed = base.replace(/\/$/, "");
  return `${trimmed}${path}`;
}

export async function fetchAnchors(baseUrl: string): Promise<AnchorResponse> {
  return request<AnchorResponse>(join(baseUrl, "/anchors"));
}

export async function setAnchors(baseUrl: string, anchors: Anchor[], clocks: AnchorClock[] = []) {
  const payload = { anchors, anchor_clocks: clocks };
  return request(join(baseUrl, "/set_anchors"), {
    method: "POST",
    body: JSON.stringify(payload),
  });
}

export async function startLog(baseUrl: string, label?: string) {
  const payload = label ? { label } : undefined;
  return request(join(baseUrl, "/start_log"), {
    method: "POST",
    body: payload ? JSON.stringify(payload) : undefined,
  });
}

export async function stopLog(baseUrl: string) {
  return request(join(baseUrl, "/stop_log"), {
    method: "POST",
  });
}

export async function replayLog(baseUrl: string, file: string, speed = 1.0) {
  const params = new URLSearchParams({ file, speed: String(speed) });
  return request(join(baseUrl, `/replay?${params.toString()}`), {
    method: "POST",
  });
}

export async function stopReplay(baseUrl: string) {
  return replayLog(baseUrl, "stop", 1.0);
}

export async function fetchHealth(baseUrl: string): Promise<HealthResponse> {
  return request<HealthResponse>(join(baseUrl, "/healthz"));
}
