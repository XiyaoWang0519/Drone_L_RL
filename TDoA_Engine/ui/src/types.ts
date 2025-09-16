export interface AnchorPosition {
  x: number;
  y: number;
  z?: number;
}

export interface Anchor {
  id: string;
  pos: AnchorPosition;
}

export interface AnchorClock {
  id: string;
  offset_ns: number;
  drift_ppm: number;
  valid?: boolean;
}

export interface AnchorResponse {
  anchors: Anchor[];
  anchor_clocks: AnchorClock[];
}

export interface EngineStatusPayload {
  anchors_used: number;
  residual_rms_ns: number;
  gdop?: number | null;
  outliers: number;
  ref_anchor?: string;
  anchor_order?: string[];
}

export interface PosePayload {
  ok: boolean;
  t: number;
  tag_tx_seq: number;
  pose: { x: number; y: number; z: number };
  vel: { x: number; y: number; z: number };
  cov?: number[][];
  status?: EngineStatusPayload;
}

export interface TrailPoint {
  seq: number;
  t: number;
  x: number;
  y: number;
  z: number;
}

export interface HealthResponse {
  status: string;
  anchors: string[];
  clock: Record<string, AnchorClock>;
  logging: boolean;
  replay_running: boolean;
  stats?: Record<string, unknown>;
}
