import { useCallback, useEffect, useMemo, useState } from "react";
import "./App.css";
import { ENGINE_HTTP_URL, ENGINE_WS_URL, deriveWsFromHttp } from "./config";
import { usePoseStream } from "./hooks/usePoseStream";
import { MapView } from "./components/MapView";
import { Hud } from "./components/Hud";
import { Controls } from "./components/Controls";
import { AnchorEditor } from "./components/AnchorEditor";
import { ClockEditor } from "./components/ClockEditor";
import {
  fetchAnchors,
  setAnchors as pushAnchors,
  startLog,
  stopLog,
  replayLog,
  stopReplay,
  fetchHealth,
} from "./api";
import type { Anchor, AnchorClock } from "./types";

interface ToastState {
  text: string;
  kind: "ok" | "error";
}

export default function App() {
  const [engineHttpUrl, setEngineHttpUrl] = useState<string>(ENGINE_HTTP_URL);
  const [wsUrl, setWsUrl] = useState<string>(ENGINE_WS_URL);
  const [anchors, setAnchors] = useState<Anchor[]>([]);
  const [anchorClocks, setAnchorClocks] = useState<AnchorClock[]>([]);
  const [logging, setLogging] = useState(false);
  const [replaying, setReplaying] = useState(false);
  const [loadingAnchors, setLoadingAnchors] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);
  const [wsDirty, setWsDirty] = useState(false);

  const stream = usePoseStream(wsUrl, { autoConnect: true, historySize: 900 });
  const { clearTrail } = stream;
  const latest = useMemo(() => (stream.trail.length > 0 ? stream.trail[stream.trail.length - 1] : null), [stream.trail]);

  useEffect(() => {
    if (!toast) {
      return;
    }
    const id = window.setTimeout(() => setToast(null), 3600);
    return () => window.clearTimeout(id);
  }, [toast]);

  const showToast = useCallback((text: string, kind: "ok" | "error" = "ok") => {
    setToast({ text, kind });
  }, []);

  const refreshState = useCallback(async () => {
    try {
      setLoadingAnchors(true);
      const [anchorInfo, health] = await Promise.all([fetchAnchors(engineHttpUrl), fetchHealth(engineHttpUrl)]);
      setAnchors(anchorInfo.anchors);
      const clockArray =
        (anchorInfo.anchor_clocks && anchorInfo.anchor_clocks.length > 0
          ? anchorInfo.anchor_clocks
          : Object.entries(health.clock || {}).map(([id, info]) => ({
              id,
              offset_ns: Number((info as any).offset_ns ?? 0),
              drift_ppm: Number((info as any).drift_ppm ?? 0),
              valid: Boolean((info as any).valid ?? true),
            }))) as AnchorClock[];
      setAnchorClocks(clockArray);
      setLogging(Boolean(health.logging));
      setReplaying(Boolean(health.replay_running));
    } catch (err) {
      showToast(err instanceof Error ? err.message : String(err), "error");
    } finally {
      setLoadingAnchors(false);
    }
  }, [engineHttpUrl, showToast]);

  useEffect(() => {
    refreshState();
  }, [refreshState]);

  useEffect(() => {
    if (!wsDirty) {
      setWsUrl(deriveWsFromHttp(engineHttpUrl));
    }
  }, [engineHttpUrl, wsDirty]);

  const handleSetWsUrl = useCallback((value: string) => {
    setWsDirty(true);
    setWsUrl(value);
  }, []);

  const handleSyncWs = useCallback(() => {
    setWsDirty(false);
    setWsUrl(deriveWsFromHttp(engineHttpUrl));
  }, [engineHttpUrl]);

  const handlePushAnchors = useCallback(
    async (nextAnchors: Anchor[]) => {
      try {
        await pushAnchors(engineHttpUrl, nextAnchors, anchorClocks);
        setAnchors(nextAnchors);
        showToast("Anchors updated");
        clearTrail();
      } catch (err) {
        showToast(err instanceof Error ? `Failed to set anchors: ${err.message}` : String(err), "error");
      }
    },
    [anchorClocks, clearTrail, engineHttpUrl, showToast]
  );

  const handlePushClocks = useCallback(
    async (nextClocks: AnchorClock[]) => {
      try {
        await pushAnchors(engineHttpUrl, anchors, nextClocks);
        setAnchorClocks(nextClocks);
        showToast("Clock parameters updated");
        clearTrail();
      } catch (err) {
        showToast(err instanceof Error ? `Failed to set clocks: ${err.message}` : String(err), "error");
      }
    },
    [anchors, clearTrail, engineHttpUrl, showToast]
  );

  const handleStartLog = useCallback(
    async (label?: string) => {
      try {
        await startLog(engineHttpUrl, label);
        setLogging(true);
        showToast("Log started");
      } catch (err) {
        showToast(err instanceof Error ? `Failed to start log: ${err.message}` : String(err), "error");
      }
    },
    [engineHttpUrl, showToast]
  );

  const handleStopLog = useCallback(async () => {
    try {
      await stopLog(engineHttpUrl);
      setLogging(false);
      showToast("Log stopped");
    } catch (err) {
      showToast(err instanceof Error ? `Failed to stop log: ${err.message}` : String(err), "error");
    }
  }, [engineHttpUrl, showToast]);

  const handleReplay = useCallback(
    async (file: string, speed: number) => {
      try {
        await replayLog(engineHttpUrl, file, speed);
        setReplaying(true);
        showToast(`Replaying ${file}`);
      } catch (err) {
        showToast(err instanceof Error ? `Replay failed: ${err.message}` : String(err), "error");
      }
    },
    [engineHttpUrl, showToast]
  );

  const handleStopReplay = useCallback(async () => {
    try {
      await stopReplay(engineHttpUrl);
      setReplaying(false);
      showToast("Replay stopped");
    } catch (err) {
      showToast(err instanceof Error ? `Stop replay failed: ${err.message}` : String(err), "error");
    }
  }, [engineHttpUrl, showToast]);

  return (
    <div className="app-shell">
      <header className="app-header">
        <div>
          <div className="app-title">TDoA Engine Console</div>
          <div className="app-subtitle">Monitor, replay, and calibrate the indoor localization engine.</div>
        </div>
        <div className="app-subtitle">Anchors: {anchors.length || "-"}</div>
      </header>

      <Controls
        engineHttpUrl={engineHttpUrl}
        setEngineHttpUrl={setEngineHttpUrl}
        wsUrl={wsUrl}
        setWsUrl={handleSetWsUrl}
        wsDirty={wsDirty}
        onSyncWs={handleSyncWs}
        connected={stream.connected}
        connecting={stream.connecting}
        logging={logging}
        replaying={replaying}
        onConnect={stream.connect}
        onDisconnect={stream.disconnect}
        onClearTrail={stream.clearTrail}
        onStartLog={handleStartLog}
        onStopLog={handleStopLog}
        onReplay={handleReplay}
        onStopReplay={handleStopReplay}
      />

      <main className="app-main">
        <div style={{ position: "relative" }}>
          <MapView anchors={anchors} trail={stream.trail} />
          <Hud
            connected={stream.connected}
            connecting={stream.connecting}
            fps={stream.fps}
            latencyMs={stream.latencyMs}
            messageCount={stream.messageCount}
            lastMessage={stream.lastMessage}
          />
          {loadingAnchors && (
            <div
              style={{
                position: "absolute",
                top: 12,
                left: 16,
                padding: "6px 12px",
                borderRadius: 12,
                background: "rgba(15,23,42,0.7)",
                border: "1px solid rgba(148,163,184,0.3)",
                fontSize: 12,
                color: "rgba(226,232,240,0.85)",
              }}
            >
              refreshing anchors…
            </div>
          )}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <AnchorEditor anchors={anchors} onSave={handlePushAnchors} />
          <ClockEditor clocks={anchorClocks} onSave={handlePushClocks} />
          {latest && (
            <div
              style={{
                background: "rgba(15,23,42,0.7)",
                borderRadius: 16,
                padding: 18,
                border: "1px solid rgba(148,163,184,0.2)",
                color: "#e2e8f0",
                fontSize: 14,
                lineHeight: 1.5,
              }}
            >
              <div className="section-title">Latest pose</div>
              <div>seq: {latest.seq}</div>
              <div>
                position: {latest.x.toFixed(3)} m, {latest.y.toFixed(3)} m, {latest.z.toFixed(3)} m
              </div>
              <div>timestamp: {latest.t.toFixed(3)} s</div>
            </div>
          )}
        </div>
      </main>

      {toast && (
        <div className={`toast${toast.kind === "error" ? " error" : ""}`}>{toast.text}</div>
      )}
    </div>
  );
}
