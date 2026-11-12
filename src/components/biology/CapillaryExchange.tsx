import React from "react";
import { interpolateColors, useCurrentFrame, useVideoConfig } from "remotion";
import { BLOOD, ORGAN, SUBSTANCE, type Substance } from "./palette";
import type { Dir } from "../labelLayout";
import { Pt, arrowHead, pointAt, slice, toPath } from "./polyline";

/**
 * Mặt cắt mao mạch – nơi chất vào/ra máu (gói Sinh › "Máu vận chuyển = thấy mạch máu và hạt đi theo mạch";
 * thường đặt trong ZoomCallout mở từ HumanBody).
 *
 * Mao mạch nằm ngang, hồng cầu trôi từ trái sang phải; phía trên là nơi trao đổi:
 *   - "tissue":    tế bào — O₂ và chất dinh dưỡng ra khỏi máu vào tế bào, CO₂ từ tế bào vào máu (máu đỏ → tím);
 *   - "lung":      phế nang chứa khí — O₂ vào máu, CO₂ ra phế nang (máu tím → đỏ);
 *   - "intestine": lòng ruột — chất dinh dưỡng vào máu.
 * Chiều đi của mỗi chất do `site` quyết định (đúng sinh lý), không truyền tay.
 * `flows`: chất nào khai báo mới hiện; "active" sáng + hạt đi qua thành mạch, "done" mờ.
 * Tên ("Mao mạch", "Tế bào", "Phế nang", "Oxygen"…) đặt bằng AutoLabels, neo vào capillaryAnchors(...).
 */

export type ExchangeSite = "tissue" | "lung" | "intestine";
export type FlowState = { state: "active" | "done"; draw?: number };

export type CapillaryExchangeProps = {
  left: number;
  top: number;
  width: number;
  height: number;
  site: ExchangeSite;
  flows?: Partial<Record<Substance, FlowState>>;
  opacity?: number;
};

/** chất → đi VÀO máu (true) hay RA khỏi máu (false), theo nơi trao đổi */
const INTO_BLOOD: Record<ExchangeSite, Partial<Record<Substance, boolean>>> = {
  tissue: { o2: false, nutrient: false, co2: true },
  lung: { o2: true, co2: false },
  intestine: { nutrient: true },
};

const ORDER: Substance[] = ["o2", "nutrient", "co2"];

const geom = (p: CapillaryExchangeProps) => {
  const { width: W, height: H } = p;
  const vTop = H * 0.58;
  const vBot = H * 0.8;
  const siteY = H * 0.32;
  const subs = ORDER.filter((s) => INTO_BLOOD[p.site][s] !== undefined);
  // các chất đi ở dải phải (42–86% bề ngang); dải trái để trống cho nhãn tên
  const xs = subs.map((_, i) => W * (0.42 + (0.44 * (i + 0.5)) / subs.length));
  return { W, H, vTop, vBot, vMid: (vTop + vBot) / 2, siteY, subs, xs };
};

/**
 * Điểm neo nhãn (px trang). `vessel`, `site` kèm hướng ưu tiên, ở dải trái còn trống:
 *   <AutoLabels items={[{ id: "mm", ...capillaryAnchors(P).vessel, text: "Mao mạch" }]} />
 */
export const capillaryAnchors = (p: CapillaryExchangeProps) => {
  const g = geom(p);
  const at = (x: number, y: number) => ({ x: p.left + x, y: p.top + y });
  const siteSpot: Record<ExchangeSite, Pt> = {
    tissue: { x: g.W * 0.2, y: g.siteY - g.H * 0.13 },
    lung: { x: g.W * 0.24, y: g.vTop - g.H * 0.12 },
    intestine: { x: g.W * 0.2, y: g.H * 0.22 },
  };
  const flow = {} as Partial<Record<Substance, Pt>>;
  g.subs.forEach((s, i) => {
    flow[s] = at(g.xs[i], (g.siteY + g.vMid) / 2);
  });
  return {
    vessel: { ...at(g.W * 0.2, g.vBot), prefer: ["s", "se"] as Dir[] },
    site: { ...at(siteSpot[p.site].x, siteSpot[p.site].y), prefer: ["n", "ne"] as Dir[] },
    flow,
  };
};

const Cell: React.FC<{ x: number; y: number; w: number; h: number }> = ({ x, y, w, h }) => (
  <g>
    <rect x={x - w / 2} y={y - h / 2} width={w} height={h} rx={h * 0.32} fill={ORGAN.tissue.fill} stroke={ORGAN.tissue.stroke} strokeWidth={4} />
    <ellipse cx={x} cy={y} rx={w * 0.13} ry={h * 0.17} fill={ORGAN.tissue.stroke} fillOpacity={0.55} />
  </g>
);

const Molecule: React.FC<{ s: Substance; x: number; y: number; k?: number }> = ({ s, x, y, k = 1 }) => {
  const c = SUBSTANCE[s];
  const st = { stroke: "#FFFFFF", strokeWidth: 3 };
  if (s === "o2")
    return (
      <g>
        <circle cx={x - 9 * k} cy={y} r={11 * k} fill={c} {...st} />
        <circle cx={x + 9 * k} cy={y} r={11 * k} fill={c} {...st} />
      </g>
    );
  if (s === "co2")
    return (
      <g>
        <circle cx={x - 16 * k} cy={y} r={9.5 * k} fill={c} {...st} />
        <circle cx={x + 16 * k} cy={y} r={9.5 * k} fill={c} {...st} />
        <circle cx={x} cy={y} r={11 * k} fill={c} {...st} />
      </g>
    );
  const r = 13 * k;
  const d = Array.from({ length: 6 }, (_, i) => {
    const a = ((-90 + 60 * i) * Math.PI) / 180;
    return `${i ? "L" : "M"} ${(x + r * Math.cos(a)).toFixed(1)} ${(y + r * Math.sin(a)).toFixed(1)}`;
  }).join(" ");
  return <path d={`${d} Z`} fill={c} {...st} />;
};

export const CapillaryExchange: React.FC<CapillaryExchangeProps> = (p) => {
  const { left, top, site, flows = {}, opacity = 1 } = p;
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const g = geom(p);
  const { W, H, vTop, vBot, vMid, siteY } = g;
  const [c0, c1] = site === "tissue" ? [BLOOD.rich, BLOOD.poor] : site === "lung" ? [BLOOD.poor, BLOOD.rich] : [BLOOD.rich, BLOOD.rich];
  const t = frame / fps;
  const rbc = Array.from({ length: 9 }, (_, i) => {
    const x = (((i / 9) * (W + 80) + t * 70) % (W + 80)) - 40;
    return { x, y: vMid + (i % 2 ? 14 : -14), c: interpolateColors(Math.max(0, Math.min(1, x / W)), [0, 1], [c0, c1]) };
  });
  return (
    <div data-extent="" style={{ position: "absolute", left, top, width: W, height: H, opacity }}>
      <svg width={W} height={H} style={{ overflow: "hidden" }}>
        <defs>
          <linearGradient id={`blood-${site}`} x1="0" x2="1" y1="0" y2="0">
            <stop offset="0" stopColor={c0} stopOpacity={0.16} />
            <stop offset="1" stopColor={c1} stopOpacity={0.16} />
          </linearGradient>
        </defs>
        {/* nơi trao đổi */}
        {site === "tissue"
          ? [0.2, 0.47, 0.74].map((f) => <Cell key={f} x={W * f} y={siteY} w={W * 0.2} h={H * 0.26} />)
          : null}
        {site === "lung" ? (
          <path
            d={`M ${W * 0.06} ${vTop - 6} C ${W * 0.06} ${H * 0.02}, ${W * 0.94} ${H * 0.02}, ${W * 0.94} ${vTop - 6} Z`}
            fill="#EAF2FD"
            stroke={ORGAN.lung.stroke}
            strokeWidth={5}
          />
        ) : null}
        {site === "intestine" ? (
          <>
            <rect x={0} y={0} width={W} height={vTop - 22} fill={ORGAN.intestine.fill} fillOpacity={0.55} />
            <path
              d={Array.from({ length: 13 }, (_, i) => `${i ? "L" : "M"} ${(W * i) / 12} ${vTop - 22 + (i % 2 ? -14 : 0)}`).join(" ")}
              fill="none"
              stroke={ORGAN.intestine.stroke}
              strokeWidth={5}
              strokeLinejoin="round"
            />
          </>
        ) : null}
        {/* mao mạch */}
        <rect x={-10} y={vTop} width={W + 20} height={vBot - vTop} fill={`url(#blood-${site})`} />
        <line x1={0} y1={vTop} x2={W} y2={vTop} stroke="#8592B3" strokeWidth={6} />
        <line x1={0} y1={vBot} x2={W} y2={vBot} stroke="#8592B3" strokeWidth={6} />
        {rbc.map((b, i) => (
          <ellipse key={i} cx={b.x} cy={b.y} rx={22} ry={11} fill={b.c} fillOpacity={0.85} stroke="#FFFFFF" strokeWidth={2} />
        ))}
        {/* chất đi qua thành mạch */}
        {g.subs.map((s, i) => {
          const st = flows[s];
          if (!st) return null;
          const into = INTO_BLOOD[site][s];
          const x = g.xs[i];
          const pts: Pt[] = into ? [{ x, y: siteY + H * 0.08 }, { x, y: vMid + 4 }] : [{ x, y: vMid - 4 }, { x, y: siteY + H * 0.08 }];
          const active = st.state === "active";
          const k = active ? Math.max(0, Math.min(1, st.draw ?? 1)) : 1;
          if (k <= 0) return null;
          const vis = slice(pts, k);
          const color = SUBSTANCE[s];
          return (
            <g key={s} opacity={active ? 1 : 0.3}>
              <path d={toPath(vis)} fill="none" stroke={color} strokeWidth={7} strokeLinecap="round" />
              {k >= 1 ? <path d={arrowHead(vis, 26)} fill={color} /> : null}
              {active && k >= 1
                ? [0, 1, 2].map((j) => {
                    const q = pointAt(pts, ((t * 0.45 + j / 3) % 1) * 0.9);
                    return <Molecule key={j} s={s} x={q.x + 30} y={q.y} />;
                  })
                : null}
            </g>
          );
        })}
      </svg>
    </div>
  );
};
