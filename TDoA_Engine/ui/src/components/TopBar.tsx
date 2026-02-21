interface TopBarProps {
  connected: boolean;
  connecting: boolean;
  fps: number;
  latencyMs: number | null;
  anchorCount: number;
  logging: boolean;
  replaying: boolean;
}

function StatusBadge({ 
  status, 
  label 
}: { 
  status: "live" | "connecting" | "offline"; 
  label: string;
}) {
  return (
    <span className={`status-badge ${status}`}>
      <span className="status-dot" />
      {label}
    </span>
  );
}

function MetricPill({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ 
      display: "flex", 
      alignItems: "center", 
      gap: "var(--space-2)",
      padding: "var(--space-1) var(--space-3)",
      background: "var(--bg-tertiary)",
      borderRadius: "var(--radius-full)",
      fontSize: "var(--text-xs)",
      fontWeight: 500,
    }}>
      <span style={{ color: "var(--text-tertiary)" }}>{label}</span>
      <span style={{ 
        color: "var(--text-primary)",
        fontVariantNumeric: "tabular-nums",
      }}>{value}</span>
    </div>
  );
}

function RecordingIndicator() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-1)",
      padding: "var(--space-1) var(--space-2)",
      background: "var(--error-light)",
      borderRadius: "var(--radius-full)",
      fontSize: "var(--text-xs)",
      fontWeight: 500,
      color: "var(--error)",
    }}>
      <span style={{
        width: 6,
        height: 6,
        borderRadius: "var(--radius-full)",
        background: "var(--error)",
        animation: "pulse 1s ease-in-out infinite",
      }} />
      REC
    </div>
  );
}

function ReplayIndicator() {
  return (
    <div style={{
      display: "flex",
      alignItems: "center",
      gap: "var(--space-1)",
      padding: "var(--space-1) var(--space-2)",
      background: "var(--accent-light)",
      borderRadius: "var(--radius-full)",
      fontSize: "var(--text-xs)",
      fontWeight: 500,
      color: "var(--accent)",
    }}>
      <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
        <polygon points="5 3 19 12 5 21 5 3" />
      </svg>
      REPLAY
    </div>
  );
}

export function TopBar({ 
  connected, 
  connecting, 
  fps, 
  latencyMs, 
  anchorCount,
  logging,
  replaying,
}: TopBarProps) {
  const connectionStatus = connecting ? "connecting" : connected ? "live" : "offline";
  const connectionLabel = connecting ? "Connecting" : connected ? "Live" : "Offline";
  const latencyLabel = latencyMs != null ? `${latencyMs.toFixed(0)}ms` : "-";
  
  return (
    <header className="top-bar">
      <div className="top-bar-left">
        <div>
          <h1 className="top-bar-title">TDoA Engine</h1>
        </div>
        <StatusBadge status={connectionStatus} label={connectionLabel} />
        {logging && <RecordingIndicator />}
        {replaying && <ReplayIndicator />}
      </div>
      <div className="top-bar-right">
        <MetricPill label="FPS" value={fps.toFixed(0)} />
        <MetricPill label="Latency" value={latencyLabel} />
        <MetricPill label="Anchors" value={anchorCount.toString()} />
      </div>
    </header>
  );
}
