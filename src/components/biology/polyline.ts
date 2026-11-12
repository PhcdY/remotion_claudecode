// Tiện ích đường gấp khúc cho đường đi của chất (mũi tên, hạt chạy theo mạch).

export type Pt = { x: number; y: number };

export const polyLength = (pts: Pt[]) => {
  let L = 0;
  for (let i = 1; i < pts.length; i++) L += Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y);
  return L;
};

/** Điểm ở tỉ lệ t (0–1) theo độ dài, kèm góc tiếp tuyến (độ). */
export const pointAt = (pts: Pt[], t: number): Pt & { angle: number } => {
  const total = polyLength(pts);
  let d = Math.max(0, Math.min(1, t)) * total;
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (d <= seg || i === pts.length - 1) {
      const k = seg ? Math.min(1, d / seg) : 0;
      return { x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k, angle: (Math.atan2(b.y - a.y, b.x - a.x) * 180) / Math.PI };
    }
    d -= seg;
  }
  return { ...pts[pts.length - 1], angle: 0 };
};

/** Phần đầu của đường, dài t (0–1) tổng độ dài. */
export const slice = (pts: Pt[], t: number): Pt[] => {
  if (t >= 1) return pts;
  const total = polyLength(pts);
  let d = Math.max(0, t) * total;
  const out: Pt[] = [pts[0]];
  for (let i = 1; i < pts.length; i++) {
    const a = pts[i - 1];
    const b = pts[i];
    const seg = Math.hypot(b.x - a.x, b.y - a.y);
    if (d <= seg) {
      const k = seg ? d / seg : 0;
      out.push({ x: a.x + (b.x - a.x) * k, y: a.y + (b.y - a.y) * k });
      return out;
    }
    out.push(b);
    d -= seg;
  }
  return out;
};

/** Cắt bớt `len` px ở cuối đường (mũi tên dừng trước mục tiêu — dung-video › mũi tên không đè mục tiêu). */
export const trimEnd = (pts: Pt[], len: number) => {
  const total = polyLength(pts);
  return total <= len ? pts : slice(pts, (total - len) / total);
};

/**
 * Dời cả đường sang một bên `d` px (dương = bên phải theo chiều đi) — tách làn khi hai quá trình
 * đi chung một đoạn mạch (gói Sinh › Mũi tên đi theo đường thật).
 */
export const offsetPolyline = (pts: Pt[], d: number): Pt[] => {
  if (!d) return pts;
  const n = (a: Pt, b: Pt) => {
    const L = Math.hypot(b.x - a.x, b.y - a.y) || 1;
    return { x: -(b.y - a.y) / L, y: (b.x - a.x) / L };
  };
  return pts.map((p, i) => {
    const n1 = i > 0 ? n(pts[i - 1], p) : n(p, pts[i + 1]);
    const n2 = i < pts.length - 1 ? n(p, pts[i + 1]) : n1;
    const mx = n1.x + n2.x;
    const my = n1.y + n2.y;
    const L = Math.hypot(mx, my) || 1;
    // giữ bề rộng làn ở góc gấp
    const cos = (n1.x * mx + n1.y * my) / L;
    const k = d / Math.max(0.5, cos);
    return { x: p.x + (mx / L) * k, y: p.y + (my / L) * k };
  });
};

export const toPath = (pts: Pt[]) => pts.map((p, i) => `${i ? "L" : "M"} ${p.x.toFixed(1)} ${p.y.toFixed(1)}`).join(" ");

/** Đầu mũi tên tam giác tại điểm cuối, hướng theo đoạn cuối. */
export const arrowHead = (pts: Pt[], size: number) => {
  const b = pts[pts.length - 1];
  const a = pts[pts.length - 2] ?? { x: b.x - 1, y: b.y };
  const ang = Math.atan2(b.y - a.y, b.x - a.x);
  const p = (r: number, t: number) => `${(b.x + r * Math.cos(ang + t)).toFixed(1)} ${(b.y + r * Math.sin(ang + t)).toFixed(1)}`;
  return `M ${p(size * 0.35, 0)} L ${p(size, Math.PI - 0.5)} L ${p(size, Math.PI + 0.5)} Z`;
};
