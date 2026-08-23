'use client';

import { useRef, useState, useCallback, useEffect } from 'react';
import type { AnnotationShape, AnnotationToolType } from '@/lib/store';

interface SVGAnnotationLayerProps {
  annotations: AnnotationShape[];
  activeAnnotationTool: AnnotationToolType | null;
  selectedAnnotationId: string | null;
  setSelectedAnnotationId: (id: string | null) => void;
  canvasW: number;
  canvasH: number;
  addAnnotation: (annotation: Omit<AnnotationShape, 'id'>) => void;
  updateAnnotation: (id: string, updates: Partial<AnnotationShape>) => void;
  removeAnnotation: (id: string) => void;
  setActiveAnnotationTool: (tool: AnnotationToolType | null) => void;
  annotationDefaults: { strokeColor: string; strokeWidth: number; fillColor: string };
  onDrawBlurRegion?: (rect: { x: number; y: number; w: number; h: number }) => void;
}

// ── Geometry helpers ──────────────────────────────────────────────────────────

function angleBetween(x1: number, y1: number, x2: number, y2: number) {
  return Math.atan2(y2 - y1, x2 - x1);
}

function ptDist(x1: number, y1: number, x2: number, y2: number) {
  return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
}

/** Shorten a line so it ends `offset` pixels before (x2,y2) */
function shortenEnd(x1: number, y1: number, x2: number, y2: number, offset: number) {
  const d = ptDist(x1, y1, x2, y2);
  if (d < offset) return { x: x1, y: y1 };
  const t = (d - offset) / d;
  return { x: x1 + (x2 - x1) * t, y: y1 + (y2 - y1) * t };
}

/** Get tangent angle at the end of a quadratic bezier */
function quadraticEndAngle(
  _p0x: number, _p0y: number,
  cx: number, cy: number,
  p1x: number, p1y: number,
) {
  return Math.atan2(p1y - cy, p1x - cx);
}

/** Shorten a quadratic bezier's endpoint by `offset` along the end tangent */
function shortenQuadEnd(
  p0x: number, p0y: number,
  ctrlX: number, ctrlY: number,
  p1x: number, p1y: number,
  offset: number,
) {
  const angle = quadraticEndAngle(p0x, p0y, ctrlX, ctrlY, p1x, p1y);
  return {
    x: p1x - offset * Math.cos(angle),
    y: p1y - offset * Math.sin(angle),
  };
}

// ── Arrow head ───────────────────────────────────────────────────────────────

function ArrowHead({ x, y, angle, color, size, strokeW }: {
  x: number; y: number; angle: number; color: string; size: number; strokeW: number;
}) {
  const halfAngle = Math.PI / 7.2;
  const p1x = x - size * Math.cos(angle - halfAngle);
  const p1y = y - size * Math.sin(angle - halfAngle);
  const p2x = x - size * Math.cos(angle + halfAngle);
  const p2y = y - size * Math.sin(angle + halfAngle);
  const notch = size * 0.35;
  const nx = x - notch * Math.cos(angle);
  const ny = y - notch * Math.sin(angle);

  return (
    <path
      d={`M ${x},${y} L ${p1x},${p1y} L ${nx},${ny} L ${p2x},${p2y} Z`}
      fill={color}
      stroke={color}
      strokeWidth={Math.max(1, strokeW * 0.3)}
      strokeLinejoin="round"
    />
  );
}

// ── Selection handle ─────────────────────────────────────────────────────────

const HANDLE_STYLE: React.CSSProperties = {
  pointerEvents: 'none',
  filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.18))',
};

function Handle({ cx: x, cy: y, primary, filled }: {
  cx: number; cy: number; primary: string; filled?: boolean;
}) {
  return (
    <circle
      data-export-exclude="true"
      cx={x} cy={y} r={5}
      fill={filled ? primary : 'white'}
      stroke={filled ? 'white' : primary}
      strokeWidth={2}
      style={HANDLE_STYLE}
    />
  );
}

function DraggableHandle({ cx: x, cy: y, primary, onDrag }: {
  cx: number; cy: number; primary: string;
  onDrag: (e: React.PointerEvent) => void;
}) {
  return (
    <circle
      data-export-exclude="true"
      cx={x} cy={y} r={6}
      fill={primary}
      stroke="white"
      strokeWidth={2}
      style={{
        cursor: 'grab',
        pointerEvents: 'auto',
        filter: 'drop-shadow(0 1px 3px rgba(0,0,0,0.2))',
      }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onDrag(e);
      }}
    />
  );
}

// ── Delete button on selected annotation ────────────────────────────────────

function AnnotationDeleteButton({ x, y, onDelete }: {
  x: number; y: number; onDelete: () => void;
}) {
  return (
    <g
      data-export-exclude="true"
      style={{ cursor: 'pointer', pointerEvents: 'auto' }}
      onPointerDown={(e) => {
        e.stopPropagation();
        onDelete();
      }}
    >
      <circle
        cx={x} cy={y} r={12}
        fill="hsl(0, 84%, 60%)"
        stroke="white"
        strokeWidth={2}
        style={{ filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.25))' }}
      />
      <path
        d={`M ${x - 4} ${y - 4} L ${x + 4} ${y + 4} M ${x + 4} ${y - 4} L ${x - 4} ${y + 4}`}
        stroke="white"
        strokeWidth={2.5}
        strokeLinecap="round"
      />
    </g>
  );
}

function getDeleteButtonPos(a: AnnotationShape, canvasW: number, canvasH: number) {
  let maxX = Math.max(a.x1, a.x2);
  let minY = Math.min(a.y1, a.y2);

  if (a.type === 'curved-arrow' && a.cx !== undefined && a.cy !== undefined) {
    maxX = Math.max(maxX, a.cx);
    minY = Math.min(minY, a.cy);
  }

  // Position top-right of bounding box, clamped within canvas
  const btnX = Math.min(Math.max(maxX + 20, 24), canvasW - 24);
  const btnY = Math.min(Math.max(minY - 20, 24), canvasH - 24);
  return { x: btnX, y: btnY };
}

// ── Annotation element ───────────────────────────────────────────────────────

const DRAG_THRESHOLD = 3; // px before drag actually starts

function AnnotationElement({ annotation, isSelected, isHovered, onSelect, onDragStart, onControlDrag, onEndpointDrag, onHover }: {
  annotation: AnnotationShape;
  isSelected: boolean;
  isHovered: boolean;
  onSelect: () => void;
  onDragStart: (e: React.PointerEvent) => void;
  onControlDrag?: (e: React.PointerEvent) => void;
  onEndpointDrag?: (endpoint: 'p1' | 'p2', e: React.PointerEvent) => void;
  onHover: (hovering: boolean) => void;
}) {
  if (!annotation.isVisible) return null;

  const { type, x1, y1, x2, y2, cx, cy, strokeColor, strokeWidth, fillColor, opacity } = annotation;
  const headSize = Math.max(14, strokeWidth * 2.8);

  // Hover glow — subtle brightness when hovering (not selected)
  const hoverOpacity = isHovered && !isSelected ? Math.min(1, opacity + 0.15) : opacity;
  const groupStyle: React.CSSProperties = isHovered && !isSelected
    ? { filter: 'drop-shadow(0 0 3px rgba(0,0,0,0.15))' }
    : {};

  const commonProps = {
    stroke: strokeColor,
    strokeWidth,
    opacity: hoverOpacity,
    fill: fillColor === 'transparent' ? 'none' : fillColor,
    style: { cursor: 'move', pointerEvents: 'auto' as const },
    onPointerDown: (e: React.PointerEvent) => {
      e.stopPropagation();
      onSelect();
      onDragStart(e);
    },
  };

  const hitProps = {
    stroke: 'transparent',
    strokeWidth: Math.max(20, strokeWidth + 16),
    fill: 'none',
    style: { cursor: 'move', pointerEvents: 'auto' as const },
    onPointerDown: (e: React.PointerEvent) => {
      e.stopPropagation();
      onSelect();
      onDragStart(e);
    },
    onPointerEnter: () => onHover(true),
    onPointerLeave: () => onHover(false),
  };

  const sel = 'hsl(var(--primary))';

  switch (type) {
    case 'arrow': {
      const angle = angleBetween(x1, y1, x2, y2);
      const end = shortenEnd(x1, y1, x2, y2, headSize * 0.6);
      return (
        <g style={groupStyle}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} {...hitProps} />
          <line x1={x1} y1={y1} x2={end.x} y2={end.y} {...commonProps} fill="none" strokeLinecap="round" />
          <ArrowHead x={x2} y={y2} angle={angle} color={strokeColor} size={headSize} strokeW={strokeWidth} />
          {isSelected && onEndpointDrag && (
            <>
              <DraggableHandle cx={x1} cy={y1} primary={sel} onDrag={(e) => onEndpointDrag('p1', e)} />
              <DraggableHandle cx={x2} cy={y2} primary={sel} onDrag={(e) => onEndpointDrag('p2', e)} />
            </>
          )}
        </g>
      );
    }
    case 'curved-arrow': {
      const ctrlX = cx ?? (x1 + x2) / 2;
      const ctrlY = cy ?? (y1 + y2) / 2 - 60;
      const endAngle = quadraticEndAngle(x1, y1, ctrlX, ctrlY, x2, y2);
      const end = shortenQuadEnd(x1, y1, ctrlX, ctrlY, x2, y2, headSize * 0.6);
      const d = `M ${x1},${y1} Q ${ctrlX},${ctrlY} ${end.x},${end.y}`;
      const hitD = `M ${x1},${y1} Q ${ctrlX},${ctrlY} ${x2},${y2}`;
      return (
        <g style={groupStyle}>
          <path d={hitD} {...hitProps} />
          <path d={d} {...commonProps} fill="none" strokeLinecap="round" />
          <ArrowHead x={x2} y={y2} angle={endAngle} color={strokeColor} size={headSize} strokeW={strokeWidth} />
          {isSelected && (
            <g data-export-exclude="true">
              <line x1={x1} y1={y1} x2={ctrlX} y2={ctrlY}
                stroke={sel} strokeWidth={0.75} strokeDasharray="4 3" opacity={0.4}
                style={{ pointerEvents: 'none' }} />
              <line x1={ctrlX} y1={ctrlY} x2={x2} y2={y2}
                stroke={sel} strokeWidth={0.75} strokeDasharray="4 3" opacity={0.4}
                style={{ pointerEvents: 'none' }} />
              {onEndpointDrag && (
                <>
                  <DraggableHandle cx={x1} cy={y1} primary={sel} onDrag={(e) => onEndpointDrag('p1', e)} />
                  <DraggableHandle cx={x2} cy={y2} primary={sel} onDrag={(e) => onEndpointDrag('p2', e)} />
                </>
              )}
              {onControlDrag ? (
                <DraggableHandle cx={ctrlX} cy={ctrlY} primary={sel} onDrag={onControlDrag} />
              ) : (
                <Handle cx={ctrlX} cy={ctrlY} primary={sel} filled />
              )}
            </g>
          )}
        </g>
      );
    }
    case 'line': {
      return (
        <g style={groupStyle}>
          <line x1={x1} y1={y1} x2={x2} y2={y2} {...hitProps} />
          <line x1={x1} y1={y1} x2={x2} y2={y2} {...commonProps} fill="none" strokeLinecap="round" />
          {isSelected && onEndpointDrag && (
            <>
              <DraggableHandle cx={x1} cy={y1} primary={sel} onDrag={(e) => onEndpointDrag('p1', e)} />
              <DraggableHandle cx={x2} cy={y2} primary={sel} onDrag={(e) => onEndpointDrag('p2', e)} />
            </>
          )}
        </g>
      );
    }
    case 'rectangle': {
      const rx = Math.min(x1, x2);
      const ry = Math.min(y1, y2);
      const rw = Math.abs(x2 - x1);
      const rh = Math.abs(y2 - y1);
      return (
        <g style={groupStyle}>
          {/* Wider hit area for the rectangle outline */}
          <rect x={rx} y={ry} width={rw} height={rh} {...hitProps} />
          <rect x={rx} y={ry} width={rw} height={rh} {...commonProps} />
          {isSelected && (
            <g data-export-exclude="true">
              <rect x={rx} y={ry} width={rw} height={rh}
                fill="none" stroke={sel} strokeWidth={1.5} strokeDasharray="6 3"
                style={{ pointerEvents: 'none' }} />
              {onEndpointDrag && (
                <>
                  <DraggableHandle cx={x1} cy={y1} primary={sel} onDrag={(e) => onEndpointDrag('p1', e)} />
                  <DraggableHandle cx={x2} cy={y2} primary={sel} onDrag={(e) => onEndpointDrag('p2', e)} />
                </>
              )}
            </g>
          )}
        </g>
      );
    }
    case 'circle': {
      const ecx = (x1 + x2) / 2;
      const ecy = (y1 + y2) / 2;
      const erx = Math.abs(x2 - x1) / 2;
      const ery = Math.abs(y2 - y1) / 2;
      return (
        <g style={groupStyle}>
          <ellipse cx={ecx} cy={ecy} rx={erx} ry={ery} {...hitProps} />
          <ellipse cx={ecx} cy={ecy} rx={erx} ry={ery} {...commonProps} />
          {isSelected && (
            <g data-export-exclude="true">
              <ellipse cx={ecx} cy={ecy} rx={erx} ry={ery}
                fill="none" stroke={sel} strokeWidth={1.5} strokeDasharray="6 3"
                style={{ pointerEvents: 'none' }} />
              {onEndpointDrag && (
                <>
                  <DraggableHandle cx={x1} cy={y1} primary={sel} onDrag={(e) => onEndpointDrag('p1', e)} />
                  <DraggableHandle cx={x2} cy={y2} primary={sel} onDrag={(e) => onEndpointDrag('p2', e)} />
                </>
              )}
            </g>
          )}
        </g>
      );
    }
    default:
      return null;
  }
}

// ── Main layer ───────────────────────────────────────────────────────────────

export function SVGAnnotationLayer({
  annotations,
  activeAnnotationTool,
  selectedAnnotationId: selectedId,
  setSelectedAnnotationId: setSelectedId,
  canvasW,
  canvasH,
  addAnnotation,
  updateAnnotation,
  removeAnnotation,
  setActiveAnnotationTool,
  annotationDefaults,
  onDrawBlurRegion,
}: SVGAnnotationLayerProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const [drawing, setDrawing] = useState<{
    type: AnnotationToolType;
    x1: number; y1: number; x2: number; y2: number;
  } | null>(null);

  // Drag with threshold: only starts moving after DRAG_THRESHOLD px
  const [dragging, setDragging] = useState<{
    annotationId: string;
    startX: number; startY: number;
    origX1: number; origY1: number;
    origX2: number; origY2: number;
    origCx?: number; origCy?: number;
    hasMoved: boolean;
  } | null>(null);

  const [ctrlDragging, setCtrlDragging] = useState<{
    annotationId: string;
    startX: number; startY: number;
    origCx: number; origCy: number;
  } | null>(null);

  const getSVGPoint = useCallback(
    (e: React.PointerEvent | PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return { x: 0, y: 0 };
      const rect = svg.getBoundingClientRect();
      return {
        x: ((e.clientX - rect.left) / rect.width) * canvasW,
        y: ((e.clientY - rect.top) / rect.height) * canvasH,
      };
    },
    [canvasW, canvasH]
  );

  // --- Drawing (uses pointer capture so events always fire on the rect) ---
  const drawingRef = useRef<typeof drawing>(null);

  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (!activeAnnotationTool) return;
      (e.target as Element).setPointerCapture(e.pointerId);
      const pt = getSVGPoint(e);
      const d = { type: activeAnnotationTool, x1: pt.x, y1: pt.y, x2: pt.x, y2: pt.y };
      drawingRef.current = d;
      setDrawing(d);
      setSelectedId(null);
    },
    [activeAnnotationTool, getSVGPoint]
  );

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!drawingRef.current) return;
      const pt = getSVGPoint(e);
      const updated = { ...drawingRef.current, x2: pt.x, y2: pt.y };
      drawingRef.current = updated;
      setDrawing(updated);
    },
    [getSVGPoint]
  );

  const handlePointerUp = useCallback(() => {
    const finished = drawingRef.current;
    drawingRef.current = null;
    setDrawing(null);

    if (!finished) return;
    const { type, x1, y1, x2, y2 } = finished;
    const d = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);

    if (d > 5) {
      if (type === 'blur') {
        onDrawBlurRegion?.({
          x: Math.min(x1, x2),
          y: Math.min(y1, y2),
          w: Math.abs(x2 - x1),
          h: Math.abs(y2 - y1),
        });
      } else {
        let curveX: number | undefined;
        let curveY: number | undefined;
        if (type === 'curved-arrow') {
          const mx = (x1 + x2) / 2;
          const my = (y1 + y2) / 2;
          const len = ptDist(x1, y1, x2, y2);
          const offset = len * 0.3;
          const angle = angleBetween(x1, y1, x2, y2);
          curveX = mx - offset * Math.sin(angle);
          curveY = my + offset * Math.cos(angle);
        }

        addAnnotation({
          type,
          x1, y1, x2, y2,
          cx: curveX,
          cy: curveY,
          strokeColor: annotationDefaults.strokeColor,
          strokeWidth: annotationDefaults.strokeWidth,
          fillColor: annotationDefaults.fillColor,
          opacity: 1,
          isVisible: true,
        });
      }
    }

    setActiveAnnotationTool(null);
  }, [addAnnotation, annotationDefaults, onDrawBlurRegion, setActiveAnnotationTool]);

  // --- Dragging existing annotation (with threshold) ---
  const handleDragStart = useCallback(
    (annotationId: string, e: React.PointerEvent) => {
      if (activeAnnotationTool) return;
      const annotation = annotations.find((a) => a.id === annotationId);
      if (!annotation) return;
      const pt = getSVGPoint(e);
      setDragging({
        annotationId,
        startX: pt.x, startY: pt.y,
        origX1: annotation.x1, origY1: annotation.y1,
        origX2: annotation.x2, origY2: annotation.y2,
        origCx: annotation.cx, origCy: annotation.cy,
        hasMoved: false,
      });
    },
    [activeAnnotationTool, annotations, getSVGPoint]
  );

  useEffect(() => {
    if (!dragging) return;
    const handleMove = (e: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * canvasW;
      const py = ((e.clientY - rect.top) / rect.height) * canvasH;
      const dx = px - dragging.startX;
      const dy = py - dragging.startY;

      // Don't move until we exceed the drag threshold
      if (!dragging.hasMoved && Math.sqrt(dx * dx + dy * dy) < DRAG_THRESHOLD) {
        return;
      }

      if (!dragging.hasMoved) {
        setDragging((prev) => prev ? { ...prev, hasMoved: true } : null);
      }

      const updates: Partial<AnnotationShape> = {
        x1: dragging.origX1 + dx, y1: dragging.origY1 + dy,
        x2: dragging.origX2 + dx, y2: dragging.origY2 + dy,
      };
      if (dragging.origCx !== undefined && dragging.origCy !== undefined) {
        updates.cx = dragging.origCx + dx;
        updates.cy = dragging.origCy + dy;
      }
      updateAnnotation(dragging.annotationId, updates);
    };
    const handleUp = () => setDragging(null);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [dragging, canvasW, canvasH, updateAnnotation]);

  // --- Dragging curve control point ---
  const handleControlDragStart = useCallback(
    (annotationId: string, e: React.PointerEvent) => {
      const annotation = annotations.find((a) => a.id === annotationId);
      if (!annotation || annotation.cx === undefined || annotation.cy === undefined) return;
      const pt = getSVGPoint(e);
      setCtrlDragging({
        annotationId,
        startX: pt.x,
        startY: pt.y,
        origCx: annotation.cx,
        origCy: annotation.cy,
      });
    },
    [annotations, getSVGPoint]
  );

  useEffect(() => {
    if (!ctrlDragging) return;
    const handleMove = (e: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * canvasW;
      const py = ((e.clientY - rect.top) / rect.height) * canvasH;
      const dx = px - ctrlDragging.startX;
      const dy = py - ctrlDragging.startY;
      updateAnnotation(ctrlDragging.annotationId, {
        cx: ctrlDragging.origCx + dx,
        cy: ctrlDragging.origCy + dy,
      });
    };
    const handleUp = () => setCtrlDragging(null);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [ctrlDragging, canvasW, canvasH, updateAnnotation]);

  // --- Dragging endpoint (resize) ---
  const [endpointDragging, setEndpointDragging] = useState<{
    annotationId: string;
    endpoint: 'p1' | 'p2';
    startX: number; startY: number;
    origX: number; origY: number;
  } | null>(null);

  const handleEndpointDragStart = useCallback(
    (annotationId: string, endpoint: 'p1' | 'p2', e: React.PointerEvent) => {
      const annotation = annotations.find((a) => a.id === annotationId);
      if (!annotation) return;
      const pt = getSVGPoint(e);
      setEndpointDragging({
        annotationId,
        endpoint,
        startX: pt.x,
        startY: pt.y,
        origX: endpoint === 'p1' ? annotation.x1 : annotation.x2,
        origY: endpoint === 'p1' ? annotation.y1 : annotation.y2,
      });
    },
    [annotations, getSVGPoint]
  );

  useEffect(() => {
    if (!endpointDragging) return;
    const handleMove = (e: PointerEvent) => {
      const svg = svgRef.current;
      if (!svg) return;
      const rect = svg.getBoundingClientRect();
      const px = ((e.clientX - rect.left) / rect.width) * canvasW;
      const py = ((e.clientY - rect.top) / rect.height) * canvasH;
      const dx = px - endpointDragging.startX;
      const dy = py - endpointDragging.startY;
      const newX = endpointDragging.origX + dx;
      const newY = endpointDragging.origY + dy;
      const updates: Partial<AnnotationShape> = endpointDragging.endpoint === 'p1'
        ? { x1: newX, y1: newY }
        : { x2: newX, y2: newY };
      updateAnnotation(endpointDragging.annotationId, updates);
    };
    const handleUp = () => setEndpointDragging(null);
    window.addEventListener('pointermove', handleMove);
    window.addEventListener('pointerup', handleUp);
    return () => {
      window.removeEventListener('pointermove', handleMove);
      window.removeEventListener('pointerup', handleUp);
    };
  }, [endpointDragging, canvasW, canvasH, updateAnnotation]);

  // --- Keyboard ---
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable) return;
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        e.preventDefault();
        removeAnnotation(selectedId);
        setSelectedId(null);
      }
      if (e.key === 'Escape') {
        if (activeAnnotationTool) {
          setActiveAnnotationTool(null);
          setDrawing(null);
        } else if (selectedId) {
          setSelectedId(null);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, activeAnnotationTool, removeAnnotation, setActiveAnnotationTool]);

  const isToolActive = !!activeAnnotationTool;

  // Drawing preview
  const renderDrawingPreview = () => {
    if (!drawing) return null;

    if (drawing.type === 'blur') {
      const rx = Math.min(drawing.x1, drawing.x2);
      const ry = Math.min(drawing.y1, drawing.y2);
      const rw = Math.abs(drawing.x2 - drawing.x1);
      const rh = Math.abs(drawing.y2 - drawing.y1);
      return (
        <g>
          <rect
            x={rx} y={ry} width={rw} height={rh}
            fill="hsl(var(--primary) / 0.06)"
            stroke="hsl(var(--primary) / 0.5)"
            strokeWidth={1.5}
            strokeDasharray="6 3"
            rx={4}
          />
          <rect
            x={rx + 1} y={ry + 1} width={Math.max(0, rw - 2)} height={Math.max(0, rh - 2)}
            fill="none"
            stroke="hsl(var(--primary) / 0.15)"
            strokeWidth={0.5}
            rx={3}
          />
        </g>
      );
    }

    let curveX: number | undefined;
    let curveY: number | undefined;
    if (drawing.type === 'curved-arrow') {
      const mx = (drawing.x1 + drawing.x2) / 2;
      const my = (drawing.y1 + drawing.y2) / 2;
      const len = ptDist(drawing.x1, drawing.y1, drawing.x2, drawing.y2);
      const offset = len * 0.3;
      const angle = angleBetween(drawing.x1, drawing.y1, drawing.x2, drawing.y2);
      curveX = mx - offset * Math.sin(angle);
      curveY = my + offset * Math.cos(angle);
    }

    const previewAnnotation: AnnotationShape = {
      id: '__preview__',
      ...drawing,
      cx: curveX,
      cy: curveY,
      strokeColor: annotationDefaults.strokeColor,
      strokeWidth: annotationDefaults.strokeWidth,
      fillColor: annotationDefaults.fillColor,
      opacity: 0.6,
      isVisible: true,
    };
    return (
      <AnnotationElement
        annotation={previewAnnotation}
        isSelected={false}
        isHovered={false}
        onSelect={() => {}}
        onDragStart={() => {}}
        onHover={() => {}}
      />
    );
  };

  // The SVG is always pointer-events:none. When a tool is active, we add a
  // full-size background rect with pointer-events:auto to capture drawing.
  // Individual annotation shapes always have pointer-events:auto so they
  // can be selected/dragged even when no tool is active.
  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${canvasW} ${canvasH}`}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 220,
        pointerEvents: 'none',
      }}
    >
      {/* Background rect — captures drawing when tool active, deselects when not */}
      <rect
        x={0} y={0} width={canvasW} height={canvasH}
        fill="transparent"
        style={{
          pointerEvents: isToolActive || selectedId ? 'auto' : 'none',
          cursor: isToolActive ? 'crosshair' : 'default',
        }}
        onPointerDown={(e) => {
          if (isToolActive) {
            handlePointerDown(e);
          } else if (selectedId) {
            setSelectedId(null);
          }
        }}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />

      {annotations.map((annotation) => (
        <AnnotationElement
          key={annotation.id}
          annotation={annotation}
          isSelected={selectedId === annotation.id}
          isHovered={hoveredId === annotation.id}
          onSelect={() => setSelectedId(annotation.id)}
          onDragStart={(e) => handleDragStart(annotation.id, e)}
          onControlDrag={
            annotation.type === 'curved-arrow'
              ? (e) => handleControlDragStart(annotation.id, e)
              : undefined
          }
          onEndpointDrag={(endpoint, e) => handleEndpointDragStart(annotation.id, endpoint, e)}
          onHover={(h) => setHoveredId(h ? annotation.id : null)}
        />
      ))}
      {renderDrawingPreview()}

      {/* Delete button on selected annotation */}
      {selectedId && !isToolActive && (() => {
        const selected = annotations.find(a => a.id === selectedId);
        if (!selected) return null;
        const pos = getDeleteButtonPos(selected, canvasW, canvasH);
        return (
          <AnnotationDeleteButton
            x={pos.x}
            y={pos.y}
            onDelete={() => {
              removeAnnotation(selectedId);
              setSelectedId(null);
            }}
          />
        );
      })()}
    </svg>
  );
}
