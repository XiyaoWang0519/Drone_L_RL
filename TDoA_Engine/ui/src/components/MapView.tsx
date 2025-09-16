import { useMemo } from "react";
import type { Anchor, TrailPoint } from "../types";

interface MapViewProps {
  anchors: Anchor[];
  trail: TrailPoint[];
  width?: number;
  height?: number;
}

interface ProjectedPoint {
  x: number;
  y: number;
}

function project(
  x: number,
  y: number,
  minX: number,
  minY: number,
  scale: number,
  padding: number,
  height: number
): ProjectedPoint {
  const px = padding + (x - minX) * scale;
  const py = height - padding - (y - minY) * scale;
  return { x: px, y: py };
}

export function MapView({ anchors, trail, width = 720, height = 520 }: MapViewProps) {
  const { projectedAnchors, projectedTrail, info } = useMemo(() => {
    const pts = [] as { x: number; y: number }[];
    anchors.forEach((a) => {
      if (Number.isFinite(a.pos.x) && Number.isFinite(a.pos.y)) {
        pts.push({ x: a.pos.x, y: a.pos.y });
      }
    });
    trail.forEach((p) => {
      if (Number.isFinite(p.x) && Number.isFinite(p.y)) {
        pts.push({ x: p.x, y: p.y });
      }
    });
    if (pts.length === 0) {
      pts.push({ x: 0, y: 0 });
      pts.push({ x: 5, y: 5 });
    }
    const minX = Math.min(...pts.map((p) => p.x));
    const maxX = Math.max(...pts.map((p) => p.x));
    const minY = Math.min(...pts.map((p) => p.y));
    const maxY = Math.max(...pts.map((p) => p.y));
    const padding = 48;
    const spanX = Math.max(maxX - minX, 1);
    const spanY = Math.max(maxY - minY, 1);
    const scaleX = (width - padding * 2) / spanX;
    const scaleY = (height - padding * 2) / spanY;
    const scale = Math.min(scaleX, scaleY);

    const projectedAnchors = anchors.map((anchor) => {
      const point = project(anchor.pos.x, anchor.pos.y, minX, minY, scale, padding, height);
      return { anchor, point };
    });
    const projectedTrail = trail.map((p) => ({ point: project(p.x, p.y, minX, minY, scale, padding, height), data: p }));
    return {
      projectedAnchors,
      projectedTrail,
      info: {
        minX,
        maxX,
        minY,
        maxY,
        scale,
        spanX,
        spanY,
      },
    };
  }, [anchors, trail, width, height]);

  const pathD = useMemo(() => {
    if (projectedTrail.length === 0) {
      return "";
    }
    return projectedTrail
      .map(({ point }, idx) => `${idx === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
      .join(" ");
  }, [projectedTrail]);

  return (
    <div
      style={{
        width,
        height,
        position: "relative",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 18px 60px rgba(15,23,42,0.45)",
      }}
      className="map-view"
    >
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <defs>
          <radialGradient id="bg-gradient" cx="50%" cy="50%" r="70%">
            <stop offset="0%" stopColor="rgba(15,23,42,0.9)" />
            <stop offset="100%" stopColor="rgba(2,6,23,0.6)" />
          </radialGradient>
        </defs>
        <rect x={0} y={0} width={width} height={height} fill="url(#bg-gradient)" stroke="rgba(59,130,246,0.3)" strokeWidth={1} />
        {/* axes */}
        <g stroke="rgba(148,163,184,0.2)" strokeWidth={1}>
          {[...Array(6)].map((_, idx) => {
            const t = idx / 5;
            const x = 48 + t * (width - 96);
            return <line key={`v-${idx}`} x1={x} y1={48} x2={x} y2={height - 48} />;
          })}
          {[...Array(6)].map((_, idx) => {
            const t = idx / 5;
            const y = 48 + t * (height - 96);
            return <line key={`h-${idx}`} x1={48} y1={y} x2={width - 48} y2={y} />;
          })}
        </g>
        {/* anchors */}
        {projectedAnchors.map(({ anchor, point }) => (
          <g key={anchor.id} transform={`translate(${point.x}, ${point.y})`}>
            <circle r={8} fill="rgba(96,165,250,0.9)" stroke="rgba(191,219,254,0.9)" strokeWidth={2} />
            <text x={12} y={4} fontSize={12} fill="#f8fafc">{anchor.id}</text>
            <text x={12} y={20} fontSize={10} fill="rgba(148,163,184,0.8)">({anchor.pos.x.toFixed(2)}, {anchor.pos.y.toFixed(2)}, {anchor.pos.z?.toFixed?.(2) ?? "0.00"})</text>
          </g>
        ))}
        {/* trail path */}
        {pathD && <path d={pathD} fill="none" stroke="rgba(16,185,129,0.8)" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />}
        {/* current position */}
        {projectedTrail.length > 0 && (
          <g transform={`translate(${projectedTrail[projectedTrail.length - 1].point.x}, ${projectedTrail[projectedTrail.length - 1].point.y})`}>
            <circle r={9} fill="rgba(74,222,128,0.95)" stroke="rgba(21,128,61,0.9)" strokeWidth={3} />
          </g>
        )}
      </svg>
      <div style={{ position: "absolute", top: 12, left: 16, fontSize: 12, color: "rgba(203,213,225,0.7)", letterSpacing: "0.08em", textTransform: "uppercase" }}>
        Span X {info.spanX.toFixed(2)} m · Span Y {info.spanY.toFixed(2)} m
      </div>
    </div>
  );
}
