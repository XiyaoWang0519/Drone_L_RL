import { FormEvent, useState } from "react";

interface ControlsProps {
  engineHttpUrl: string;
  setEngineHttpUrl: (url: string) => void;
  wsUrl: string;
  setWsUrl: (url: string) => void;
  wsDirty: boolean;
  onSyncWs: () => void;
  connected: boolean;
  connecting: boolean;
  logging: boolean;
  replaying: boolean;
  onConnect: () => void;
  onDisconnect: () => void;
  onClearTrail: () => void;
  onStartLog: (label?: string) => Promise<void>;
  onStopLog: () => Promise<void>;
  onReplay: (file: string, speed: number) => Promise<void>;
  onStopReplay: () => Promise<void>;
}

function SectionHeader({ title, description }: { title: string; description?: string }) {
  return (
    <div style={{ marginBottom: "var(--space-4)" }}>
      <h3 className="section-title">{title}</h3>
      {description && <p className="section-subtitle">{description}</p>}
    </div>
  );
}

function Divider() {
  return (
    <div style={{ 
      height: 1, 
      background: "var(--separator)", 
      margin: "var(--space-5) 0" 
    }} />
  );
}

export function Controls({
  engineHttpUrl,
  setEngineHttpUrl,
  wsUrl,
  setWsUrl,
  wsDirty,
  onSyncWs,
  connected,
  connecting,
  logging,
  replaying,
  onConnect,
  onDisconnect,
  onClearTrail,
  onStartLog,
  onStopLog,
  onReplay,
  onStopReplay,
}: ControlsProps) {
  const [logLabel, setLogLabel] = useState<string>("");
  const [replayFile, setReplayFile] = useState<string>("");
  const [replaySpeed, setReplaySpeed] = useState<string>("1.0");

  const handleReplay = async (evt: FormEvent) => {
    evt.preventDefault();
    if (!replayFile) {
      return;
    }
    const speed = Number.parseFloat(replaySpeed) || 1.0;
    await onReplay(replayFile, speed);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}>
      {/* Connection Section */}
      <SectionHeader 
        title="Engine Connection" 
        description="Configure the HTTP and WebSocket endpoints"
      />
      
      <div style={{ display: "grid", gap: "var(--space-4)", gridTemplateColumns: "1fr 1fr" }}>
        <div className="form-group">
          <label htmlFor="engine-url" className="form-label">
            HTTP URL
          </label>
          <input
            id="engine-url"
            className="form-input"
            value={engineHttpUrl}
            onChange={(evt) => setEngineHttpUrl(evt.target.value)}
            placeholder="http://127.0.0.1:8000"
          />
        </div>
        <div className="form-group">
          <label htmlFor="ws-url" className="form-label">
            WebSocket URL
          </label>
          <div style={{ display: "flex", gap: "var(--space-2)" }}>
            <input
              id="ws-url"
              className="form-input"
              style={{ flex: 1 }}
              value={wsUrl}
              onChange={(evt) => setWsUrl(evt.target.value)}
              placeholder="ws://127.0.0.1:8000/stream"
            />
            <button className="btn btn-secondary btn-sm" onClick={onSyncWs}>
              Sync
            </button>
          </div>
          {wsDirty && (
            <span style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
              Manual override active
            </span>
          )}
        </div>
      </div>
      
      <div style={{ display: "flex", gap: "var(--space-2)", marginTop: "var(--space-2)" }}>
        <button
          className={`btn ${connected || connecting ? "btn-secondary" : "btn-primary"}`}
          onClick={onConnect}
          disabled={connecting || connected}
        >
          {connecting ? "Connecting..." : connected ? "Connected" : "Connect"}
        </button>
        <button
          className="btn btn-outline"
          onClick={onDisconnect}
          disabled={!connected && !connecting}
        >
          Disconnect
        </button>
        <button
          className="btn btn-secondary"
          onClick={onClearTrail}
        >
          Clear Trail
        </button>
      </div>

      <Divider />

      {/* Logging Section */}
      <SectionHeader 
        title="Data Logging" 
        description="Record incoming pose data to a binary log file"
      />
      
      <div style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-end" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="log-label" className="form-label">
            Log Label (optional)
          </label>
          <input
            id="log-label"
            className="form-input"
            value={logLabel}
            onChange={(evt) => setLogLabel(evt.target.value)}
            placeholder="experiment_001"
          />
        </div>
        <button
          className={`btn ${logging ? "btn-secondary" : "btn-primary"}`}
          onClick={() => onStartLog(logLabel || undefined)}
          disabled={logging}
          style={{ height: 40 }}
        >
          {logging ? "Recording..." : "Start Log"}
        </button>
        <button
          className="btn btn-danger"
          onClick={onStopLog}
          disabled={!logging}
          style={{ height: 40 }}
        >
          Stop
        </button>
      </div>

      <Divider />

      {/* Replay Section */}
      <SectionHeader 
        title="Log Replay" 
        description="Replay a recorded log file through the engine"
      />
      
      <form onSubmit={handleReplay} style={{ display: "flex", gap: "var(--space-2)", alignItems: "flex-end" }}>
        <div className="form-group" style={{ flex: 1 }}>
          <label htmlFor="replay-file" className="form-label">
            Log File Path
          </label>
          <input
            id="replay-file"
            className="form-input"
            value={replayFile}
            onChange={(evt) => setReplayFile(evt.target.value)}
            placeholder="logs/run_001.bin"
          />
        </div>
        <div className="form-group" style={{ width: 100 }}>
          <label htmlFor="replay-speed" className="form-label">
            Speed
          </label>
          <input
            id="replay-speed"
            className="form-input"
            value={replaySpeed}
            onChange={(evt) => setReplaySpeed(evt.target.value)}
            placeholder="1.0"
          />
        </div>
        <button 
          className={`btn ${replaying ? "btn-secondary" : "btn-primary"}`} 
          type="submit" 
          disabled={!replayFile || replaying}
          style={{ height: 40 }}
        >
          {replaying ? "Playing..." : "Replay"}
        </button>
        <button
          type="button"
          className="btn btn-danger"
          onClick={onStopReplay}
          disabled={!replaying}
          style={{ height: 40 }}
        >
          Stop
        </button>
      </form>
    </div>
  );
}
