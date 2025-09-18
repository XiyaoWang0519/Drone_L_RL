import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import type { Anchor, TrailPoint } from "../types";

interface MapViewProps {
  anchors: Anchor[];
  trail: TrailPoint[];
  width?: number;
  height?: number;
}

interface BoundsInfo {
  minX: number;
  maxX: number;
  minY: number;
  maxY: number;
  minZ: number;
  maxZ: number;
  spanX: number;
  spanY: number;
  spanZ: number;
  center: { x: number; y: number; z: number };
  hasPoints: boolean;
}

const GRID_BASE_SIZE = 12;

function toWorldVector(x: number, y: number, z: number): THREE.Vector3 {
  return new THREE.Vector3(x, z, y);
}

function drawRoundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
): void {
  const r = Math.max(0, Math.min(radius, Math.min(width, height) / 2));
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + width - r, y);
  ctx.quadraticCurveTo(x + width, y, x + width, y + r);
  ctx.lineTo(x + width, y + height - r);
  ctx.quadraticCurveTo(x + width, y + height, x + width - r, y + height);
  ctx.lineTo(x + r, y + height);
  ctx.quadraticCurveTo(x, y + height, x, y + height - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function disposeMaterial(material: THREE.Material | THREE.Material[] | undefined): void {
  if (Array.isArray(material)) {
    material.forEach((m) => disposeMaterial(m));
    return;
  }
  if (!material) {
    return;
  }
  const mat = material as THREE.Material & { map?: THREE.Texture | null };
  if ("map" in mat && mat.map) {
    mat.map.dispose();
  }
  material.dispose();
}

function disposeObject(obj: THREE.Object3D): void {
  obj.traverse((node: THREE.Object3D) => {
    const maybeGeom = node as { geometry?: THREE.BufferGeometry | THREE.InstancedBufferGeometry };
    if (maybeGeom.geometry) {
      maybeGeom.geometry.dispose();
    }
    const maybeMat = node as { material?: THREE.Material | THREE.Material[] };
    if (maybeMat.material) {
      disposeMaterial(maybeMat.material);
    }
  });
}

function createAnchorLabel(anchor: Anchor): THREE.Sprite {
  const z = Number.isFinite(anchor.pos.z) ? (anchor.pos.z as number) : 0;
  const lines = [anchor.id, `(${anchor.pos.x.toFixed(2)}, ${anchor.pos.y.toFixed(2)}, ${z.toFixed(2)})`];
  const padding = 32;
  const idFont = 64;
  const subFont = 44;
  const canvas = document.createElement("canvas");
  const tempCtx = canvas.getContext("2d");
  if (!tempCtx) {
    return new THREE.Sprite();
  }
  tempCtx.font = `600 ${idFont}px Inter, 'Segoe UI', sans-serif`;
  const idWidth = tempCtx.measureText(lines[0]).width;
  tempCtx.font = `400 ${subFont}px Inter, 'Segoe UI', sans-serif`;
  const coordWidth = tempCtx.measureText(lines[1]).width;
  const width = Math.ceil(Math.max(idWidth, coordWidth) + padding * 2);
  const height = Math.ceil(idFont + subFont + padding * 3);
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    return new THREE.Sprite();
  }
  ctx.font = `600 ${idFont}px Inter, 'Segoe UI', sans-serif`;
  ctx.fillStyle = "rgba(15,23,42,0.78)";
  ctx.strokeStyle = "rgba(148,163,184,0.45)";
  ctx.lineWidth = 6;
  drawRoundedRect(ctx, 0, 0, width, height, 28);
  ctx.fill();
  ctx.stroke();
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle = "#f8fafc";
  ctx.font = `600 ${idFont}px Inter, 'Segoe UI', sans-serif`;
  ctx.fillText(lines[0], width / 2, padding + idFont / 2);
  ctx.font = `400 ${subFont}px Inter, 'Segoe UI', sans-serif`;
  ctx.fillStyle = "rgba(226,232,240,0.85)";
  ctx.fillText(lines[1], width / 2, padding + idFont + subFont / 2 + 8);
  const texture = new THREE.CanvasTexture(canvas);
  texture.encoding = THREE.sRGBEncoding;
  texture.needsUpdate = true;
  const material = new THREE.SpriteMaterial({ map: texture, transparent: true });
  const sprite = new THREE.Sprite(material);
  const scale = 0.01;
  sprite.scale.set(width * scale, height * scale, 1);
  return sprite;
}

export function MapView({ anchors, trail, width = 720, height = 520 }: MapViewProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const controlsRef = useRef<OrbitControls | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const anchorGroupRef = useRef<THREE.Group | null>(null);
  const trailRef = useRef<THREE.Line | null>(null);
  const droneRef = useRef<THREE.Mesh | null>(null);
  const gridRef = useRef<THREE.GridHelper | null>(null);
  const animationRef = useRef<number>();

  const bounds = useMemo<BoundsInfo>(() => {
    const coords: { x: number; y: number; z: number }[] = [];
    anchors.forEach((anchor) => {
      const { x, y } = anchor.pos;
      const z = Number.isFinite(anchor.pos.z) ? (anchor.pos.z as number) : 0;
      if (Number.isFinite(x) && Number.isFinite(y)) {
        coords.push({ x, y, z });
      }
    });
    trail.forEach((point) => {
      const { x, y, z } = point;
      if (Number.isFinite(x) && Number.isFinite(y) && Number.isFinite(z)) {
        coords.push({ x, y, z });
      }
    });
    if (coords.length === 0) {
      return {
        minX: 0,
        maxX: 6,
        minY: 0,
        maxY: 6,
        minZ: 0,
        maxZ: 2,
        spanX: 6,
        spanY: 6,
        spanZ: 2,
        center: { x: 3, y: 3, z: 1 },
        hasPoints: false,
      };
    }
    const xs = coords.map((c) => c.x);
    const ys = coords.map((c) => c.y);
    const zs = coords.map((c) => c.z);
    const minX = Math.min(...xs);
    const maxX = Math.max(...xs);
    const minY = Math.min(...ys);
    const maxY = Math.max(...ys);
    const minZ = Math.min(...zs);
    const maxZ = Math.max(...zs);
    const spanX = Math.max(maxX - minX, 1);
    const spanY = Math.max(maxY - minY, 1);
    const spanZ = Math.max(maxZ - minZ, 0.5);
    return {
      minX,
      maxX,
      minY,
      maxY,
      minZ,
      maxZ,
      spanX,
      spanY,
      spanZ,
      center: { x: (minX + maxX) / 2, y: (minY + maxY) / 2, z: (minZ + maxZ) / 2 },
      hasPoints: true,
    };
  }, [anchors, trail]);

  useEffect(() => {
    const mount = containerRef.current;
    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x020617);
    scene.fog = new THREE.Fog(0x020617, 30, 140);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 2000);
    camera.position.set(12, 8, 12);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    renderer.shadowMap.enabled = false;
    rendererRef.current = renderer;
    const canvas = renderer.domElement;
    canvas.style.display = "block";
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    canvas.style.outline = "1px solid rgba(59,130,246,0.35)";
    canvas.style.borderRadius = "18px";
    mount.appendChild(canvas);

    const controls = new OrbitControls(camera, canvas);
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.maxDistance = 500;
    controls.minDistance = 1;
    controls.maxPolarAngle = Math.PI * 0.49;
    controlsRef.current = controls;

    const ambient = new THREE.AmbientLight(0xf8fafc, 0.45);
    const hemi = new THREE.HemisphereLight(0x93c5fd, 0x0f172a, 0.25);
    const directional = new THREE.DirectionalLight(0xffffff, 0.65);
    directional.position.set(18, 24, 12);
    directional.castShadow = false;
    scene.add(ambient);
    scene.add(hemi);
    scene.add(directional);

    const grid = new THREE.GridHelper(GRID_BASE_SIZE, 20, 0x475569, 0x1f2937);
    const gridMaterials = Array.isArray(grid.material) ? grid.material : [grid.material];
    gridMaterials.forEach((mat: THREE.Material) => {
      mat.transparent = true;
      mat.opacity = 0.35;
    });
    gridRef.current = grid;
    scene.add(grid);

    const axes = new THREE.AxesHelper(1.8);
    axes.position.y = 0.01;
    scene.add(axes);

    const anchorGroup = new THREE.Group();
    anchorGroupRef.current = anchorGroup;
    scene.add(anchorGroup);

    const trailMaterial = new THREE.LineBasicMaterial({ color: 0x10b981, transparent: true, opacity: 0.85 });
    const trailLine = new THREE.Line(new THREE.BufferGeometry(), trailMaterial);
    trailLine.visible = false;
    trailRef.current = trailLine;
    scene.add(trailLine);

    const droneMaterial = new THREE.MeshStandardMaterial({
      color: 0x4ade80,
      emissive: 0x14532d,
      metalness: 0.25,
      roughness: 0.4,
    });
    const droneMesh = new THREE.Mesh(new THREE.SphereGeometry(0.32, 32, 32), droneMaterial);
    droneMesh.visible = false;
    droneRef.current = droneMesh;
    scene.add(droneMesh);

    const animate = () => {
      controls.update();
      renderer.render(scene, camera);
      animationRef.current = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      controls.dispose();
      disposeObject(anchorGroup);
      disposeObject(trailLine);
      disposeObject(droneMesh);
      disposeObject(grid);
      disposeObject(axes);
      renderer.dispose();
      if (canvas.parentElement === mount) {
        mount.removeChild(canvas);
      }
      rendererRef.current = null;
      cameraRef.current = null;
      controlsRef.current = null;
      sceneRef.current = null;
      anchorGroupRef.current = null;
      trailRef.current = null;
      droneRef.current = null;
      gridRef.current = null;
    };
  }, [height, width]);

  useEffect(() => {
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    if (!renderer || !camera) {
      return;
    }
    renderer.setSize(width, height);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }, [height, width]);

  useEffect(() => {
    const anchorGroup = anchorGroupRef.current;
    const trailLine = trailRef.current;
    const drone = droneRef.current;
    const controls = controlsRef.current;
    const camera = cameraRef.current;
    const grid = gridRef.current;
    if (!anchorGroup || !trailLine || !drone || !controls || !camera) {
      return;
    }

    anchorGroup.children.slice().forEach((child: THREE.Object3D) => {
      anchorGroup.remove(child);
      disposeObject(child);
    });

    const worldPoints: THREE.Vector3[] = [];

    anchors.forEach((anchor) => {
      const { x, y } = anchor.pos;
      const z = Number.isFinite(anchor.pos.z) ? (anchor.pos.z as number) : 0;
      if (!Number.isFinite(x) || !Number.isFinite(y)) {
        return;
      }
      const worldPos = toWorldVector(x, y, z);
      worldPoints.push(worldPos.clone());

      const anchorMesh = new THREE.Mesh(
        new THREE.CylinderGeometry(0.2, 0.2, 0.45, 20),
        new THREE.MeshStandardMaterial({ color: 0x60a5fa, emissive: 0x1d4ed8, roughness: 0.38, metalness: 0.2 })
      );
      anchorMesh.position.copy(worldPos);
      anchorMesh.castShadow = false;
      anchorMesh.receiveShadow = false;
      anchorGroup.add(anchorMesh);

      const stemGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(worldPos.x, 0, worldPos.z),
        new THREE.Vector3(worldPos.x, worldPos.y, worldPos.z),
      ]);
      const stemMaterial = new THREE.LineBasicMaterial({ color: 0x3b82f6, transparent: true, opacity: 0.35 });
      const stem = new THREE.Line(stemGeometry, stemMaterial);
      anchorGroup.add(stem);

      const label = createAnchorLabel(anchor);
      label.position.set(worldPos.x, worldPos.y + 0.7, worldPos.z);
      anchorGroup.add(label);
    });

    const trailPoints = trail.map((point) => toWorldVector(point.x, point.y, point.z));
    if (trailPoints.length > 0) {
      worldPoints.push(...trailPoints);
    }

    const previousGeometry = trailLine.geometry;
    if (trailPoints.length > 1) {
      trailLine.geometry = new THREE.BufferGeometry().setFromPoints(trailPoints);
      trailLine.visible = true;
    } else {
      trailLine.geometry = new THREE.BufferGeometry();
      trailLine.visible = false;
    }
    previousGeometry.dispose();

    if (trail.length > 0) {
      const last = trail[trail.length - 1];
      const worldLast = toWorldVector(last.x, last.y, last.z);
      drone.visible = true;
      drone.position.copy(worldLast);
    } else {
      drone.visible = false;
    }

    const fallbackPoints = worldPoints.length > 0 ? worldPoints : [
      toWorldVector(bounds.center.x, bounds.center.y, bounds.center.z),
      toWorldVector(bounds.center.x + bounds.spanX * 0.5, bounds.center.y, bounds.center.z + bounds.spanY * 0.5),
    ];

    const box = new THREE.Box3().setFromPoints(fallbackPoints);
    const centerWorld = box.getCenter(new THREE.Vector3());
    const sizeWorld = box.getSize(new THREE.Vector3());
    const maxSpan = Math.max(sizeWorld.x, sizeWorld.y, sizeWorld.z, 6);
    const desiredDistance = Math.max(maxSpan * 1.15, 6);

    if (grid) {
      const base = GRID_BASE_SIZE;
      const scaleX = Math.max(sizeWorld.x, 4) / base;
      const scaleZ = Math.max(sizeWorld.z, 4) / base;
      grid.scale.set(scaleX, 1, scaleZ);
      grid.position.set(centerWorld.x, 0, centerWorld.z);
    }

    const offset = camera.position.clone().sub(controls.target);
    if (offset.lengthSq() < 1e-6) {
      offset.set(1, 0.6, 1);
    }
    offset.setLength(desiredDistance);
    const desiredPosition = centerWorld.clone().add(offset);
    camera.position.lerp(desiredPosition, 0.12);
    controls.target.lerp(centerWorld, 0.12);
    controls.update();
    camera.far = Math.max(desiredDistance * 5, 200);
    camera.updateProjectionMatrix();
  }, [anchors, trail, bounds]);

  return (
    <div
      ref={containerRef}
      style={{
        width,
        height,
        position: "relative",
        borderRadius: "18px",
        overflow: "hidden",
        boxShadow: "0 18px 60px rgba(15,23,42,0.45)",
        background: "radial-gradient(circle at 50% 45%, rgba(15,23,42,0.88), rgba(2,6,23,0.65))",
      }}
      className="map-view"
    >
      <div
        style={{
          position: "absolute",
          top: 12,
          left: 16,
          padding: "10px 14px",
          borderRadius: 12,
          background: "rgba(15,23,42,0.72)",
          border: "1px solid rgba(148,163,184,0.3)",
          color: "rgba(226,232,240,0.9)",
          fontSize: 12,
          lineHeight: 1.5,
          pointerEvents: "none",
          boxShadow: "0 6px 18px rgba(2,6,23,0.4)",
        }}
      >
        <div style={{ fontSize: 11, textTransform: "uppercase", letterSpacing: "0.08em", color: "rgba(148,163,184,0.95)" }}>
          Scene bounds
        </div>
        <div>Span X {bounds.spanX.toFixed(2)} m</div>
        <div>Span Y {bounds.spanY.toFixed(2)} m</div>
        <div>
          Altitude {bounds.minZ.toFixed(2)} – {bounds.maxZ.toFixed(2)} m ({bounds.spanZ.toFixed(2)} m span)
        </div>
      </div>
      <div
        style={{
          position: "absolute",
          bottom: 12,
          left: 16,
          padding: "8px 12px",
          borderRadius: 10,
          background: "rgba(2,6,23,0.65)",
          border: "1px solid rgba(148,163,184,0.25)",
          fontSize: 11,
          color: "rgba(226,232,240,0.78)",
          lineHeight: 1.5,
          pointerEvents: "none",
          boxShadow: "0 4px 16px rgba(2,6,23,0.35)",
        }}
      >
        <div>Rotate: drag · Pan: right-drag · Zoom: scroll</div>
        <div>Axes → X (red), Y (green ↑ altitude), Z (blue)</div>
      </div>
    </div>
  );
}

