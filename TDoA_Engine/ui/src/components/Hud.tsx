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

function StatRow({ label, value, unit }: { label: string; value: string; unit?: string }) {
  return (
    <div style={{ 
      display: "flex", 
      justifyContent: "space-between", 
      alignItems: "baseline",
      gap: "var(--space-3)",
    }}>
      <span style={{ 
        color: "var(--text-tertiary)", 
        fontSize: "var(--text-xs)",
      }}>
        {label}
      </span>
      <span style={{ 
        color: "var(--text-primary)", 
        fontSize: "var(--text-sm)",
        fontWeight: 500,
        fontVariantNumeric: "tabular-nums",
      }}>
        {value}{unit && <span style={{ color: "var(--text-tertiary)", fontWeight: 400 }}> {unit}</span>}
      </span>
    </div>
  );
}

function Divider() {
  return (
    <div style={{ 
      height: 1, 
      background: "var(--separator)", 
      margin: "var(--space-2) 0" 
    }} />
  );
}

export function Hud({ connected, connecting, fps, latencyMs, messageCount, lastMessage }: HudProps) {
  const status = lastMessage?.status;
  const connectionLabel = connecting ? "Connecting" : connected ? "Live" : "Offline";
  const connectionColor = connecting 
    ? "var(--warning)" 
    : connected 
      ? "var(--success)" 
      : "var(--text-tertiary)";
  const latencyLabel = latencyMs != null ? latencyMs.toFixed(0) : "-";

  return (
    <div
      className="glass-overlay"
      style={{
        position: "absolute",
        top: "var(--space-4)",
        right: "var(--space-4)",
        padding: "var(--space-3) var(--space-4)",
        minWidth: 200,
        maxWidth: 240,
      }}
    >
      {/* Header with status */}
      <div style={{ 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        marginBottom: "var(--space-2)",
      }}>
        <span style={{ 
          fontSize: "var(--text-xs)", 
          fontWeight: 600,
          color: "var(--text-secondary)", 
          textTransform: "uppercase",
          letterSpacing: "0.05em",
        }}>
          Engine HUD
        </span>
        <span style={{ 
          display: "flex",
          alignItems: "center",
          gap: "var(--space-1)",
          fontSize: "var(--text-xs)", 
          fontWeight: 500,
          color: connectionColor,
        }}>
          <span style={{
            width: 6,
            height: 6,
            borderRadius: "var(--radius-full)",
            background: connectionColor,
            animation: connected ? "pulse 2s ease-in-out infinite" : "none",
          }} />
          {connectionLabel}
        </span>
      </div>

      <Divider />

      {/* Performance stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <StatRow label="FPS" value={fps.toFixed(0)} />
        <StatRow label="Latency" value={latencyLabel} unit="ms" />
        <StatRow label="Messages" value={messageCount.toString()} />
        <StatRow label="Sequence" value={lastMessage?.tag_tx_seq?.toString() ?? "-"} />
      </div>

      <Divider />

      {/* Solver stats */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <StatRow label="Anchors" value={status?.anchors_used?.toString() ?? "-"} />
        <StatRow label="GDOP" value={fmt(status?.gdop)} />
        <StatRow label="Residual RMS" value={fmt(status?.residual_rms_ns, 1)} unit="ns" />
        <StatRow label="Outliers" value={status?.outliers?.toString() ?? "-"} />
      </div>

      <Divider />

      {/* Position */}
      <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <div style={{ 
          fontSize: "var(--text-xs)", 
          fontWeight: 500,
          color: "var(--text-tertiary)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 2,
        }}>
          Position
        </div>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: "var(--space-2)",
          fontSize: "var(--text-sm)",
          fontVariantNumeric: "tabular-nums",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "var(--text-tertiary)", fontSize: "var(--text-xs)" }}>X</div>
            <div style={{ color: "var(--text-primary)", fontWeight: 500 }}>{fmt(lastMessage?.pose?.x)}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "var(--text-tertiary)", fontSize: "var(--text-xs)" }}>Y</div>
            <div style={{ color: "var(--text-primary)", fontWeight: 500 }}>{fmt(lastMessage?.pose?.y)}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "var(--text-tertiary)", fontSize: "var(--text-xs)" }}>Z</div>
            <div style={{ color: "var(--text-primary)", fontWeight: 500 }}>{fmt(lastMessage?.pose?.z)}</div>
          </div>
        </div>
      </div>

      {/* Velocity */}
      <div style={{ marginTop: "var(--space-3)", display: "flex", flexDirection: "column", gap: "var(--space-1)" }}>
        <div style={{ 
          fontSize: "var(--text-xs)", 
          fontWeight: 500,
          color: "var(--text-tertiary)",
          textTransform: "uppercase",
          letterSpacing: "0.05em",
          marginBottom: 2,
        }}>
          Velocity
        </div>
        <div style={{ 
          display: "grid", 
          gridTemplateColumns: "repeat(3, 1fr)", 
          gap: "var(--space-2)",
          fontSize: "var(--text-sm)",
          fontVariantNumeric: "tabular-nums",
        }}>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "var(--text-tertiary)", fontSize: "var(--text-xs)" }}>Vx</div>
            <div style={{ color: "var(--text-primary)", fontWeight: 500 }}>{fmt(lastMessage?.vel?.x)}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "var(--text-tertiary)", fontSize: "var(--text-xs)" }}>Vy</div>
            <div style={{ color: "var(--text-primary)", fontWeight: 500 }}>{fmt(lastMessage?.vel?.y)}</div>
          </div>
          <div style={{ textAlign: "center" }}>
            <div style={{ color: "var(--text-tertiary)", fontSize: "var(--text-xs)" }}>Vz</div>
            <div style={{ color: "var(--text-primary)", fontWeight: 500 }}>{fmt(lastMessage?.vel?.z)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
