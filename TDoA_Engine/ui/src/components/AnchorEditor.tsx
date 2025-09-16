import { useEffect, useState } from "react";
import type { Anchor } from "../types";

interface AnchorEditorProps {
  anchors: Anchor[];
  onSave: (anchors: Anchor[]) => Promise<void>;
}

const textareaStyle: React.CSSProperties = {
  width: "100%",
  minHeight: 180,
  background: "rgba(15,23,42,0.75)",
  border: "1px solid rgba(148,163,184,0.32)",
  borderRadius: 12,
  color: "#e2e8f0",
  padding: 14,
  fontFamily: "'JetBrains Mono', 'Fira Code', monospace",
  fontSize: 13,
  lineHeight: 1.45,
  resize: "vertical",
};

const buttonStyle: React.CSSProperties = {
  borderRadius: 10,
  border: "1px solid rgba(94,234,212,0.45)",
  padding: "10px 16px",
  background: "rgba(45,212,191,0.15)",
  color: "#f8fafc",
  cursor: "pointer",
  fontSize: 14,
};

export function AnchorEditor({ anchors, onSave }: AnchorEditorProps) {
  const [buffer, setBuffer] = useState(() => JSON.stringify(anchors, null, 2));
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    setBuffer(JSON.stringify(anchors, null, 2));
  }, [anchors]);

  const handleSave = async () => {
    try {
      setError(null);
      setSaving(true);
      const parsed = JSON.parse(buffer) as Anchor[];
      if (!Array.isArray(parsed)) {
        throw new Error("Anchors JSON must be an array");
      }
      await onSave(parsed);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      style={{
        background: "rgba(15,23,42,0.7)",
        borderRadius: 16,
        padding: 20,
        border: "1px solid rgba(148,163,184,0.24)",
        display: "flex",
        flexDirection: "column",
        gap: 12,
      }}
    >
      <div style={{ fontSize: 13, color: "rgba(148,163,184,0.85)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Anchors JSON
      </div>
      <textarea style={textareaStyle} value={buffer} onChange={(evt) => setBuffer(evt.target.value)} spellCheck={false} />
      {error && <div style={{ color: "#fca5a5", fontSize: 13 }}>{error}</div>}
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <button style={buttonStyle} onClick={handleSave} disabled={saving}>
          {saving ? "Saving…" : "Push to Engine"}
        </button>
      </div>
    </div>
  );
}
