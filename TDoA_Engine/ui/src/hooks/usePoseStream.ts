import { useCallback, useEffect, useRef, useState } from "react";
import type { PosePayload, TrailPoint } from "../types";

interface PoseStreamOptions {
  autoConnect?: boolean;
  historySize?: number;
}

interface PoseStreamState {
  connected: boolean;
  connecting: boolean;
  lastMessage: PosePayload | null;
  trail: TrailPoint[];
  messageCount: number;
  fps: number;
  latencyMs: number | null;
  connect: () => void;
  disconnect: () => void;
  clearTrail: () => void;
}

export function usePoseStream(url: string | null, options?: PoseStreamOptions): PoseStreamState {
  const { autoConnect = false, historySize = 600 } = options ?? {};

  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [lastMessage, setLastMessage] = useState<PosePayload | null>(null);
  const [trail, setTrail] = useState<TrailPoint[]>([]);
  const [messageCount, setMessageCount] = useState(0);
  const [fps, setFps] = useState(0);
  const [latencyMs, setLatencyMs] = useState<number | null>(null);

  const wsRef = useRef<WebSocket | null>(null);
  const shouldReconnectRef = useRef(false);
  const fpsSamplesRef = useRef<number[]>([]);
  const engineTimeRef = useRef<number | null>(null);
  const clientTimeRef = useRef<number | null>(null);

  const handleMessage = useCallback(
    (event: MessageEvent) => {
      try {
        if (typeof event.data !== "string") {
          return;
        }
        const data = JSON.parse(event.data) as PosePayload;
        if (!data || data.ok === false || !data.pose) {
          return;
        }
        setLastMessage(data);
        setMessageCount((prev) => prev + 1);

        const now = performance.now();
        const samples = fpsSamplesRef.current;
        samples.push(now);
        while (samples.length && now - samples[0] > 1000) {
          samples.shift();
        }
        setFps(samples.length);

        if (typeof data.t === "number") {
          const nowSec = performance.now() / 1000;
          if (engineTimeRef.current == null || clientTimeRef.current == null) {
            engineTimeRef.current = data.t;
            clientTimeRef.current = nowSec;
            setLatencyMs(0);
          } else {
            const expectedClientTime = clientTimeRef.current + (data.t - engineTimeRef.current);
            const latency = Math.max(0, nowSec - expectedClientTime) * 1000;
            setLatencyMs(latency);
          }
        } else {
          setLatencyMs(null);
        }

        const nextPoint: TrailPoint = {
          seq: data.tag_tx_seq ?? 0,
          t: typeof data.t === "number" ? data.t : Date.now() / 1000,
          x: data.pose.x ?? 0,
          y: data.pose.y ?? 0,
          z: data.pose.z ?? 0,
        };
        setTrail((prev) => {
          const next = [...prev, nextPoint];
          if (next.length > historySize) {
            next.splice(0, next.length - historySize);
          }
          return next;
        });
      } catch (err) {
        console.warn("Failed to parse pose payload", err);
      }
    },
    [historySize]
  );

  const createSocket = useCallback(() => {
    if (!url) {
      return;
    }
    try {
      wsRef.current?.close();
    } catch (err) {
      // ignore
    }
    let target = url;
    try {
      const parsed = new URL(url);
      parsed.pathname = parsed.pathname.replace(/\/+/g, "/");
      target = parsed.toString();
    } catch (err) {
      // fallback to raw URL if parsing fails (e.g., relative paths)
    }
    const ws = new WebSocket(target);
    wsRef.current = ws;
    setConnecting(true);

    ws.onopen = () => {
      setConnected(true);
      setConnecting(false);
    };

    ws.onmessage = handleMessage;

    ws.onclose = () => {
      setConnected(false);
      setConnecting(false);
      wsRef.current = null;
      if (shouldReconnectRef.current) {
        setTimeout(() => {
          if (shouldReconnectRef.current) {
            createSocket();
          }
        }, 1000);
      }
    };

    ws.onerror = () => {
      setConnecting(false);
    };
  }, [handleMessage, url]);

  const connect = useCallback(() => {
    if (!url) {
      return;
    }
    shouldReconnectRef.current = true;
    createSocket();
  }, [createSocket, url]);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    setConnecting(false);
    try {
      wsRef.current?.close();
    } catch (err) {
      // ignore
    }
    wsRef.current = null;
  }, []);

  const clearTrail = useCallback(() => {
    setTrail([]);
    setMessageCount(0);
    fpsSamplesRef.current = [];
    setFps(0);
    engineTimeRef.current = null;
    clientTimeRef.current = null;
    setLatencyMs(null);
    setLastMessage(null);
  }, []);

  useEffect(() => {
    if (autoConnect && url) {
      connect();
    }
    return () => {
      shouldReconnectRef.current = false;
      try {
        wsRef.current?.close();
      } catch (err) {
        // ignore
      }
      wsRef.current = null;
      engineTimeRef.current = null;
      clientTimeRef.current = null;
    };
  }, [autoConnect, connect, url]);

  return {
    connected,
    connecting,
    lastMessage,
    trail,
    messageCount,
    fps,
    latencyMs,
    connect,
    disconnect,
    clearTrail,
  };
}
