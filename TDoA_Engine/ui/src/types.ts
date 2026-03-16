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

export interface RadioSchedule {
  tick_hz: number;
  superframe_uus: number;
  slot_start_uus: number;
  slot_uus: number;
  master_beacon_id?: number;
}

export interface AnchorResponse {
  anchors: Anchor[];
  anchor_clocks: AnchorClock[];
  radio_schedule?: RadioSchedule;
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
  radio_schedule?: RadioSchedule;
  source_mode?: string;
  ingest?: Record<string, unknown>;
  logging: boolean;
  replay_running: boolean;
  stats?: Record<string, unknown>;
}
