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

const fieldStyle: React.CSSProperties = {
  display: "flex",
  flexDirection: "column",
  gap: 6,
};

const inputStyle: React.CSSProperties = {
  background: "#ffffff",
  border: "1px solid #c4c4c4",
  borderRadius: 8,
  padding: "8px 10px",
  color: "#111111",
  font: "inherit",
};

const buttonStyle: React.CSSProperties = {
  border: "1px solid #111111",
  borderRadius: 10,
  background: "#111111",
  padding: "10px 14px",
  color: "#ffffff",
  fontSize: 14,
  letterSpacing: "0.03em",
  cursor: "pointer",
  transition: "background 0.2s ease, color 0.2s ease",
};

const syncButtonStyle: React.CSSProperties = {
  ...buttonStyle,
  padding: "8px 10px",
  fontSize: 12,
  letterSpacing: "0.08em",
  background: "#f5f5f5",
  borderColor: "#c4c4c4",
  color: "#111111",
};

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
    <div
      style={{
        display: "grid",
        gap: 16,
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        background: "#f7f7f7",
        borderRadius: 16,
        padding: 20,
        border: "1px solid #d6d6d6",
      }}
    >
      <div style={fieldStyle}>
        <label htmlFor="engine-url" style={{ fontSize: 12, color: "#666666", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Engine HTTP URL
        </label>
        <input
          id="engine-url"
          style={inputStyle}
          value={engineHttpUrl}
          onChange={(evt) => setEngineHttpUrl(evt.target.value)}
          placeholder="http://127.0.0.1:8000"
        />
      </div>
      <div style={fieldStyle}>
        <label htmlFor="ws-url" style={{ fontSize: 12, color: "#666666", letterSpacing: "0.08em", textTransform: "uppercase" }}>
          Stream WS URL
        </label>
        <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
          <input
            id="ws-url"
            style={{ ...inputStyle, flex: 1 }}
            value={wsUrl}
            onChange={(evt) => setWsUrl(evt.target.value)}
            placeholder="ws://127.0.0.1:8000/stream"
          />
          <button type="button" style={syncButtonStyle} onClick={onSyncWs}>
            Sync
          </button>
        </div>
        {wsDirty && <div style={{ fontSize: 11, color: "#666666" }}>manual override</div>}
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <button
          style={{
            ...buttonStyle,
            ...(connecting || connected ? { background: "#c9c9c9", borderColor: "#c9c9c9", color: "#555555" } : {}),
          }}
          onClick={onConnect}
          disabled={connecting || connected}
        >
          {connecting ? "Connecting" : connected ? "Connected" : "Connect"}
        </button>
        <button
          style={{
            ...buttonStyle,
            background: "#f5f5f5",
            borderColor: "#111111",
            color: "#111111",
            opacity: !connected && !connecting ? 0.5 : 1,
          }}
          onClick={onDisconnect}
          disabled={!connected && !connecting}
        >
          Disconnect
        </button>
        <button
          style={{
            ...buttonStyle,
            background: "#f5f5f5",
            borderColor: "#c4c4c4",
            color: "#111111",
          }}
          onClick={onClearTrail}
        >
          Clear Trail
        </button>
      </div>
      <div style={{ display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <input
          style={{ ...inputStyle, flex: 1, minWidth: 140 }}
          value={logLabel}
          onChange={(evt) => setLogLabel(evt.target.value)}
          placeholder="Log label (optional)"
        />
        <button
          style={{
            ...buttonStyle,
            ...(logging ? { background: "#c9c9c9", borderColor: "#c9c9c9", color: "#555555" } : {}),
          }}
          onClick={() => onStartLog(logLabel || undefined)}
          disabled={logging}
        >
          Start Log
        </button>
        <button
          style={{
            ...buttonStyle,
            background: "#f5f5f5",
            borderColor: "#111111",
            color: "#111111",
            opacity: !logging ? 0.5 : 1,
          }}
          onClick={onStopLog}
          disabled={!logging}
        >
          Stop Log
        </button>
      </div>
      <form onSubmit={handleReplay} style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
        <input
          style={{ ...inputStyle, flex: 1, minWidth: 160 }}
          value={replayFile}
          onChange={(evt) => setReplayFile(evt.target.value)}
          placeholder="logs/run.bin"
        />
        <input
          style={{ ...inputStyle, width: 80 }}
          value={replaySpeed}
          onChange={(evt) => setReplaySpeed(evt.target.value)}
          placeholder="1.0"
        />
        <button style={buttonStyle} type="submit" disabled={!replayFile}>
          Replay
        </button>
        <button
          type="button"
          style={{
            ...buttonStyle,
            background: "#f5f5f5",
            borderColor: "#111111",
            color: "#111111",
            opacity: !replaying ? 0.5 : 1,
          }}
          onClick={onStopReplay}
          disabled={!replaying}
        >
          Stop Replay
        </button>
      </form>
    </div>
  );
}
