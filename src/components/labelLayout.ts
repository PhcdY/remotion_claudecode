import type { Scale } from "./plot";

// Tính vị trí nhãn neo (thuần, không React) — dùng bởi AutoLabels (labels.tsx), thử nhanh được bằng node.
// Mỗi nhãn gắn với một điểm neo; thử các hướng quanh điểm ở khoảng cách tăng dần (và trượt dọc hướng),
// lấy chỗ GẦN NHẤT không vi phạm luật cứng: không đè vật cản/nhãn khác, không lệch sang điểm khác,
// đường dẫn (nếu có) không cắt nhãn khác. Không có chỗ sạch thì lấy chỗ vi phạm ít nhất.

export type Dir = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw";
/** pad: khoảng hở tối thiểu với nhãn (px); nét vẽ mặc định 6, chữ khác ≥ 14 */
export type Rect = { x: number; y: number; w: number; h: number; pad?: number };

const VEC: Record<Dir, [number, number]> = {
  n: [0, -1],
  ne: [1, -1],
  e: [1, 0],
  se: [1, 1],
  s: [0, 1],
  sw: [-1, 1],
  w: [-1, 0],
  nw: [-1, -1],
};
const DEFAULT_ORDER: Dir[] = ["ne", "nw", "e", "w", "n", "s", "se", "sw"];
const DISTANCES = [14, 24, 36, 52, 72, 96, 126, 160, 200];
/** trượt nhãn vuông góc với hướng (phần bề rộng/cao nhãn) để tìm chỗ trống */
const SLIDES = [0, 0.25, -0.25, 0.5, -0.5];
/** từ khoảng cách này trở lên thì vẽ đường dẫn mảnh từ điểm neo tới nhãn */
export const LEADER_FROM = 60;
const PAD_STROKE = 6;
const PAD_LABEL = 16;
const PAD_TEXT_OBSTACLE = 14;

export type LabelSpec = {
  id: string;
  ax: number;
  ay: number;
  w: number;
  h: number;
  prefer?: Dir[];
  /** các giai đoạn nhãn hiện (vd. ["b02"]); hai nhãn không chung giai đoạn nào thì không chặn nhau. Thiếu = mọi lúc */
  phases?: string[];
  /** neo vào một chấm nhìn thấy (mặc định) hay một vùng (đoạn cong, khoảng trên trục): chỉ chấm mới gây gán nhầm */
  anchor?: "point" | "region";
};
export type Placed = { cx: number; cy: number; w: number; h: number; dir: Dir; dist: number; leader: boolean; violation: number };

/** Ước lượng khung chữ (px) của một nhãn có thể chứa $...$ (Plus Jakarta Sans 600 + KaTeX). Kiểm lại bằng check-layout. */
export const estimateLabel = (text: string, size = 36) => {
  let w = 0;
  const parts = text.split(/(\$[^$]*\$)/);
  for (const p of parts) {
    if (p.startsWith("$") && p.endsWith("$") && p.length > 1) {
      const vis = p
        .slice(1, -1)
        .replace(/\\(left|right|limits|displaystyle|,|;|!)/g, "")
        .replace(/\\[a-zA-Z]+/g, "x")
        .replace(/[{}^_\\]/g, "");
      w += vis.length * 0.56 * size;
    } else {
      for (const ch of p) w += ch === " " ? 0.26 * size : 0.48 * size;
    }
  }
  const tall = /\\d?frac/.test(text);
  return { w: Math.ceil(w) + 12, h: Math.ceil(size * (tall ? 2.4 : 1.3)) + 4 };
};

const rectAt = (s: LabelSpec, dir: Dir, dist: number, slide = 0): Rect => {
  const [vx, vy] = VEC[dir];
  const cx = s.ax + vx * (dist + s.w / 2) + (vx === 0 ? slide * s.w : 0);
  const cy = s.ay + vy * (dist + s.h / 2) + (vy === 0 ? slide * s.h : 0);
  return { x: cx - s.w / 2, y: cy - s.h / 2, w: s.w, h: s.h };
};

/** Diện tích chồng (đã nới pad); 0 nếu cách nhau ≥ pad. */
const overlap = (a: Rect, b: Rect, pad: number) => {
  const w = Math.min(a.x + a.w, b.x + b.w) - Math.max(a.x, b.x) + pad;
  const h = Math.min(a.y + a.h, b.y + b.h) - Math.max(a.y, b.y) + pad;
  return w > 0 && h > 0 ? w * h : 0;
};

const distTo = (r: Rect, x: number, y: number) =>
  Math.hypot(Math.max(r.x - x, 0, x - (r.x + r.w)), Math.max(r.y - y, 0, y - (r.y + r.h)));

const outside = (r: Rect, b: Rect) => {
  const inW = Math.max(0, Math.min(r.x + r.w, b.x + b.w) - Math.max(r.x, b.x));
  const inH = Math.max(0, Math.min(r.y + r.h, b.y + b.h) - Math.max(r.y, b.y));
  return r.w * r.h - inW * inH;
};

const together = (a: LabelSpec, b: LabelSpec) => !a.phases || !b.phases || a.phases.some((p) => b.phases?.includes(p));

const crosses = (x1: number, y1: number, x2: number, y2: number, r: Rect) => {
  for (let i = 1; i < 16; i++) {
    const x = x1 + ((x2 - x1) * i) / 16;
    const y = y1 + ((y2 - y1) * i) / 16;
    if (x > r.x && x < r.x + r.w && y > r.y && y < r.y + r.h) return true;
  }
  return false;
};

/** Đặt nhãn theo thứ tự: nhãn quan trọng truyền trước. */
export const placeLabels = (specs: LabelSpec[], obstacles: Rect[], bounds: Rect): Record<string, Placed> => {
  const placed: { r: Rect; s: LabelSpec }[] = [];
  const out: Record<string, Placed> = {};
  for (const s of specs) {
    const others = specs.filter((o) => o.id !== s.id && together(s, o));
    const points = others.filter((o) => (o.anchor ?? "point") === "point");
    const mates = placed.filter((p) => together(s, p.s));
    const order = [...(s.prefer ?? []), ...DEFAULT_ORDER.filter((d) => !(s.prefer ?? []).includes(d))];
    let best = null as { r: Rect; dir: Dir; dist: number; hard: number; soft: number } | null;
    search: for (const dist of DISTANCES) {
      for (const [di, dir] of order.entries()) {
        const diagonal = VEC[dir][0] !== 0 && VEC[dir][1] !== 0;
        for (const slide of diagonal ? [0] : SLIDES) {
          const r = rectAt(s, dir, dist, slide);
          let hard = outside(r, bounds);
          for (const o of obstacles) hard += overlap(r, o, o.pad ?? PAD_STROKE);
          for (const o of points) hard += overlap(r, { x: o.ax - 10, y: o.ay - 10, w: 20, h: 20 }, 2);
          for (const p of mates) hard += overlap(r, p.r, PAD_LABEL);
          const leader = dist >= LEADER_FROM;
          if (!leader && (s.anchor ?? "point") === "point") {
            // nhãn của một chấm: phải gần chấm của mình hơn mọi chấm khác cùng hiện, kẻo gán nhầm
            // (nhãn của vùng gắn bằng màu với đoạn tô, không cần luật này)
            const own = distTo(r, s.ax, s.ay);
            for (const o of points) if (distTo(r, o.ax, o.ay) < own + 24) hard += 5000;
          } else if (leader) {
            // có đường dẫn: đường không cắt nhãn khác, không đi qua điểm neo khác
            const ex = Math.max(r.x, Math.min(s.ax, r.x + r.w));
            const ey = Math.max(r.y, Math.min(s.ay, r.y + r.h));
            for (const p of mates) if (crosses(s.ax, s.ay, ex, ey, p.r)) hard += 5000;
            for (const o of points) if (crosses(s.ax, s.ay, ex, ey, { x: o.ax - 20, y: o.ay - 20, w: 40, h: 40 })) hard += 5000;
          }
          const soft = dist * 2 + di * 6 + Math.abs(slide) * 40 + (leader ? 150 : 0);
          if (!best || hard < best.hard || (hard === best.hard && soft < best.soft)) best = { r, dir, dist, hard, soft };
        }
      }
      // đã có chỗ sạch ở khoảng cách này: chỗ xa hơn chỉ kém hơn
      if (best && best.hard === 0) break search;
    }
    const b = best as { r: Rect; dir: Dir; dist: number; hard: number; soft: number };
    placed.push({ r: b.r, s });
    out[s.id] = { cx: b.r.x + b.r.w / 2, cy: b.r.y + b.r.h / 2, w: b.r.w, h: b.r.h, dir: b.dir, dist: b.dist, leader: b.dist >= LEADER_FROM, violation: Math.round(b.hard) };
  }
  return out;
};

// ---------- vật cản ----------

/** Các ô nhỏ dọc đồ thị y = f(x) (toạ độ trong khung Plot). */
export const curveObstacles = (s: Scale, f: (x: number) => number, from = s.xMin, to = s.xMax, thick = 8): Rect[] => {
  const res: Rect[] = [];
  const n = Math.max(8, Math.ceil(((to - from) * s.sx) / 10));
  for (let i = 0; i <= n; i++) {
    const x = from + ((to - from) * i) / n;
    const y = f(x);
    if (!isFinite(y) || y < s.yMin || y > s.yMax) continue;
    res.push({ x: s.x(x) - thick / 2, y: s.y(y) - thick / 2, w: thick, h: thick });
  }
  return res;
};

/** Đoạn thẳng (px) thành các ô nhỏ. */
export const segmentObstacles = (x1: number, y1: number, x2: number, y2: number, thick = 6): Rect[] => {
  const n = Math.max(2, Math.ceil(Math.hypot(x2 - x1, y2 - y1) / 10));
  return Array.from({ length: n + 1 }, (_, i) => ({
    x: x1 + ((x2 - x1) * i) / n - thick / 2,
    y: y1 + ((y2 - y1) * i) / n - thick / 2,
    w: thick,
    h: thick,
  }));
};

/** Một khối chữ/thẻ có sẵn (công thức, tên trục, thẻ) làm vật cản, giữ khoảng hở như giữa hai nhãn. */
export const textObstacle = (x: number, y: number, w: number, h: number): Rect => ({ x, y, w, h, pad: PAD_TEXT_OBSTACLE });

const fmtTick = (v: number) => {
  const t = v.toFixed(2).replace(/\.?0+$/, "");
  return t === "-0" ? "0" : t.replace(".", ",");
};

/** Trục, số vạch chia của <Axes> (cùng vị trí như plot.tsx vẽ). */
export const axesObstacles = (s: Scale, xTicks: number[] = [], yTicks: number[] = [], yTickSide: "left" | "right" = "left"): Rect[] => {
  const ox = s.x(Math.min(Math.max(0, s.xMin), s.xMax));
  const oy = s.y(Math.min(Math.max(0, s.yMin), s.yMax));
  const res: Rect[] = [...segmentObstacles(0, oy, s.width + 22, oy, 6), ...segmentObstacles(ox, s.height, ox, -22, 6)];
  for (const t of xTicks) {
    if (t === 0) continue;
    const w = fmtTick(t).length * 17 + 4;
    res.push(textObstacle(s.x(t) - w / 2, oy + 16, w, 30));
  }
  for (const t of yTicks) {
    if (t === 0) continue;
    const w = fmtTick(t).length * 17 + 4;
    res.push(textObstacle(yTickSide === "left" ? ox - 16 - w : ox + 16, s.y(t) - 12, w, 26));
  }
  return res;
};
