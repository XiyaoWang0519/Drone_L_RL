import { useEffect, useState } from "react";
import type { Anchor } from "../types";

interface AnchorEditorProps {
  anchors: Anchor[];
  onSave: (anchors: Anchor[]) => Promise<void>;
}

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
    <div style={{ display: "flex", flexDirection: "column", gap: "var(--space-3)", height: "100%" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h3 className="section-title" style={{ marginBottom: "var(--space-1)" }}>Anchor Configuration</h3>
          <p style={{ fontSize: "var(--text-xs)", color: "var(--text-tertiary)" }}>
            Define anchor positions as JSON array with id, pos (x, y, z) fields
          </p>
        </div>
        <button 
          className={`btn ${saving ? "btn-secondary" : "btn-primary"}`} 
          onClick={handleSave} 
          disabled={saving}
        >
          {saving ? "Saving..." : "Push to Engine"}
        </button>
      </div>
      
      <div style={{ flex: 1, minHeight: 0, position: "relative" }}>
        <textarea
          className="form-input form-textarea"
          style={{
            width: "100%",
            height: "100%",
            minHeight: 140,
            fontFamily: "var(--font-mono)",
            fontSize: "var(--text-sm)",
            lineHeight: 1.5,
            resize: "none",
            borderColor: error ? "var(--error)" : undefined,
          }}
          value={buffer}
          onChange={(evt) => {
            setBuffer(evt.target.value);
            setError(null);
          }}
          spellCheck={false}
          placeholder='[{"id": "A1", "pos": {"x": 0, "y": 0, "z": 2.5}}]'
        />
      </div>

      {error && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: "var(--space-2)",
          padding: "var(--space-2) var(--space-3)",
          background: "var(--error-light)",
          borderRadius: "var(--radius-sm)",
          fontSize: "var(--text-sm)",
          color: "var(--error)",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
          {error}
        </div>
      )}
    </div>
  );
}
