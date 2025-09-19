import type { PosePayload } from "../types";

interface HudProps {
  connected: boolean;
  connecting: boolean;
  fps: number;
  latencyMs: number | null;
  messageCount: number;
  lastMessage: PosePayload | null;
}

function fmt(num: number | undefined | null, digits = 2): string {
  if (num === undefined || num === null || Number.isNaN(num)) {
    return "-";
  }
  return Number(num).toFixed(digits);
}

export function Hud({ connected, connecting, fps, latencyMs, messageCount, lastMessage }: HudProps) {
  const status = lastMessage?.status;
  const connectionLabel = connecting ? "connecting" : connected ? "live" : "offline";
  const latencyLabel = latencyMs != null ? `${latencyMs.toFixed(1)} ms` : "-";
  return (
    <div
      style={{
        position: "absolute",
        top: 16,
        right: 16,
        padding: "10px 14px",
        borderRadius: 12,
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        border: "1px solid #d0d0d0",
        color: "#111111",
        fontSize: 13,
        lineHeight: 1.45,
        minWidth: 180,
      }}
    >
      <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.12em", color: "#666666", marginBottom: 6 }}>
        Engine {connectionLabel}
      </div>
      <div>fps: {fps.toFixed(0)}</div>
      <div>latency: {latencyLabel}</div>
      <div>seq: {lastMessage?.tag_tx_seq ?? "-"}</div>
      <div>anchors used: {status?.anchors_used ?? "-"}</div>
      <div>gdop: {fmt(status?.gdop)}</div>
      <div>residual rms: {fmt(status?.residual_rms_ns, 1)} ns</div>
      <div>outliers: {status?.outliers ?? "-"}</div>
      <div>position: {fmt(lastMessage?.pose?.x)} m, {fmt(lastMessage?.pose?.y)} m, {fmt(lastMessage?.pose?.z)} m</div>
      <div>velocity: {fmt(lastMessage?.vel?.x)} m/s, {fmt(lastMessage?.vel?.y)} m/s, {fmt(lastMessage?.vel?.z)} m/s</div>
      <div>messages: {messageCount}</div>
    </div>
  );
}
