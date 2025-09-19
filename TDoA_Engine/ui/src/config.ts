const DEFAULT_HTTP = "http://127.0.0.1:8000";

export function deriveWsFromHttp(httpUrl: string): string {
  try {
    const url = new URL(httpUrl);
    url.protocol = url.protocol === "https:" ? "wss:" : "ws:";
    url.pathname = url.pathname.replace(/\/$/, "");
    url.pathname += "/stream";
    url.search = "";
    return url.toString();
  } catch (err) {
    return "ws://127.0.0.1:8000/stream";
  }
}

export const ENGINE_HTTP_URL = (import.meta.env.VITE_ENGINE_HTTP_URL as string | undefined) || DEFAULT_HTTP;
export const ENGINE_WS_URL = (import.meta.env.VITE_ENGINE_WS_URL as string | undefined) || deriveWsFromHttp(ENGINE_HTTP_URL);
