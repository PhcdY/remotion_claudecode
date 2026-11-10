import React from "react";
import { StagePanel } from "../../components/Card";
import { MathText } from "../../components/MathText";
import { role } from "../../components/roles";
import { colors, fontText, halo, tint } from "../../components/theme";

// Cảnh dùng chung cho hai bản demo luật "Hình và số tượng trưng" (cũ / mới).
// Toạ độ trong lòng StagePanel (1740 × 800).

export type StageState = {
  appear: number; // lưới người + ruộng hiện
  noble: number; // quý tộc + 7 thửa sáng màu
  farmer: number; // nông dân + 3 thửa sáng màu
  state: number; // 4 thửa sung công
  // nhãn trong cảnh
  quytoc: number;
  nongdan: number;
  pct: number; // "5% dân → 70% ruộng"
  y1397: number;
  // chỉ bản luật cũ
  dancu?: number;
  ruongdat?: number;
  badge?: number; // "MÔ HÌNH"
  badge2?: number; // "MÔ HÌNH · không phải số liệu thật"
  legP?: number; // "1 hình = 1% dân số"
  legF?: number; // "1 thửa = 10% ruộng đất"
  // chỉ bản luật mới: nhãn nhỏ góc video
  corner?: number;
};

const NOBLE = role.pairB;
const FARMER = role.pairA;
const STATE = role.focus;

const CELL = 56;
const GX = 150;
const GY = 170;
const person = (i: number) => ({ cx: GX + CELL / 2 + (i % 10) * CELL, cy: GY + CELL / 2 + Math.floor(i / 10) * CELL });

const PW = 128;
const PH = 245;
const FX = 900;
const FY = 180;
const plot = (i: number) => ({ x: FX + (i % 5) * (PW + 20), y: FY + Math.floor(i / 5) * (PH + 20) });
const isNoblePlot = (i: number) => i <= 6;
const isStatePlot = (i: number) => i >= 1 && i <= 4;

const mix = (a: string, b: string, t: number) => {
  const p = (h: string) => [1, 3, 5].map((k) => parseInt(h.slice(k, k + 2), 16));
  const [x, y] = [p(a), p(b)];
  return `#${x.map((v, k) => Math.round(v + (y[k] - v) * t).toString(16).padStart(2, "0")).join("")}`;
};

const Person: React.FC<{ i: number; color: string; crown: boolean }> = ({ i, color, crown }) => {
  const { cx, cy } = person(i);
  return (
    <g data-mark="person">
      <circle cx={cx} cy={cy - 13} r={8} fill={color} />
      <path d={`M ${cx - 13} ${cy + 19} Q ${cx - 13} ${cy - 2} ${cx} ${cy - 2} Q ${cx + 13} ${cy - 2} ${cx + 13} ${cy + 19} Z`} fill={color} />
      {crown ? (
        <polygon
          points={`${cx - 8},${cy - 22} ${cx - 8},${cy - 30} ${cx - 4},${cy - 25} ${cx},${cy - 32} ${cx + 4},${cy - 25} ${cx + 8},${cy - 30} ${cx + 8},${cy - 22}`}
          fill={color}
        />
      ) : null}
    </g>
  );
};

const Plot: React.FC<{ i: number; owner: string | null; t: number }> = ({ i, owner, t }) => {
  const { x, y } = plot(i);
  const BASE = "#EEF5E6";
  const fill = owner ? mix(BASE, mix("#FFFFFF", owner, 0.2), t) : BASE;
  const tufts: React.ReactNode[] = [];
  for (let r = 0; r < 7; r++) {
    for (let c = 0; c < 4; c++) {
      const tx = x + 22 + c * 28;
      const ty = y + 30 + r * 31;
      tufts.push(<path key={`${r}-${c}`} d={`M ${tx} ${ty + 10} L ${tx - 6} ${ty - 6} M ${tx} ${ty + 10} L ${tx} ${ty - 9} M ${tx} ${ty + 10} L ${tx + 6} ${ty - 6}`} stroke="#7DB35A" strokeWidth={2.5} strokeLinecap="round" />);
    }
  }
  return (
    <g data-mark="plot">
      <rect x={x} y={y} width={PW} height={PH} rx={14} fill={fill} stroke="#C9DDB4" strokeWidth={2} />
      {owner ? <rect x={x} y={y} width={PW} height={PH} rx={14} fill="none" stroke={owner} strokeOpacity={t} strokeWidth={4} /> : null}
      {tufts}
    </g>
  );
};

const Label: React.FC<{
  text: string;
  x: number;
  y: number;
  o: number;
  color?: string;
  size?: number;
  weight?: number;
  align?: "left" | "center";
  kind?: string;
}> = ({ text, x, y, o, color = colors.text, size = 36, weight = 600, align = "center", kind = "label" }) =>
  o <= 0.001 ? null : (
    <div
      data-text={kind}
      style={{
        position: "absolute",
        left: x,
        top: y,
        transform: align === "center" ? "translateX(-50%)" : undefined,
        whiteSpace: "nowrap",
        fontFamily: fontText,
        fontSize: size,
        fontWeight: weight,
        color,
        opacity: o,
        textShadow: halo(colors.panel),
      }}
    >
      <MathText text={text} />
    </div>
  );

const Badge: React.FC<{ text: string; o: number }> = ({ text, o }) =>
  o <= 0.001 ? null : (
    <div
      data-text="label"
      style={{
        position: "absolute",
        left: 870,
        top: 22,
        transform: "translateX(-50%)",
        whiteSpace: "nowrap",
        padding: "4px 20px",
        borderRadius: 10,
        border: `3px solid ${role.warn}`,
        background: tint(role.warn, 0.1),
        fontFamily: fontText,
        fontSize: 36,
        fontWeight: 800,
        color: role.warn,
        opacity: o,
      }}
    >
      {text}
    </div>
  );

export const Stage: React.FC<{ s: StageState }> = ({ s }) => {
  const people = Array.from({ length: 100 }, (_, i) => {
    const noble = i < 5;
    const t = noble ? s.noble : s.farmer;
    return <Person key={i} i={i} crown={noble} color={mix(role.dim, noble ? NOBLE : FARMER, t)} />;
  });
  const plots = Array.from({ length: 10 }, (_, i) => {
    if (isNoblePlot(i)) {
      const toState = isStatePlot(i) ? s.state : 0;
      return <Plot key={i} i={i} owner={mix(NOBLE, STATE, toState)} t={s.noble} />;
    }
    return <Plot key={i} i={i} owner={FARMER} t={s.farmer} />;
  });

  return (
    <>
      <StagePanel hasTakeaway>
        <svg width={1740} height={800} style={{ position: "absolute", left: 0, top: 0, opacity: s.appear }}>
          {people}
          {plots}
        </svg>
        {/* nhãn chung hai bản */}
        <Label text="quý tộc" x={GX} y={100} o={s.quytoc} color={NOBLE} align="left" />
        <Label text="nông dân" x={GX + 280} y={735} o={s.nongdan} color={FARMER} />
        <Label text="5% dân → 70% ruộng" x={1260} y={712} o={s.pct} color={NOBLE} size={44} weight={700} kind="text" />
        <Label text="1397: phép hạn điền" x={1260} y={712} o={s.y1397} color={STATE} size={44} weight={700} kind="text" />
        {/* chỉ bản luật cũ */}
        <Label text="dân cư" x={GX + 280} y={100} o={(s.dancu ?? 0) * s.appear} />
        <Label text="ruộng đất" x={1260} y={110} o={(s.ruongdat ?? 0) * s.appear} />
        <Badge text="MÔ HÌNH" o={(s.badge ?? 0) * (1 - (s.badge2 ?? 0))} />
        <Badge text="MÔ HÌNH · không phải số liệu thật" o={s.badge2 ?? 0} />
        <Label text="1 hình = 1% dân số" x={GX + 280} y={728} o={s.legP ?? 0} size={44} weight={700} kind="text" />
        <Label text="1 thửa = 10% ruộng đất" x={1260} y={712} o={s.legF ?? 0} size={44} weight={700} kind="text" />
      </StagePanel>
      {/* chỉ bản luật mới: nhãn nhỏ, mờ ở góc dưới phải video (ngang dải câu chốt) */}
      {(s.corner ?? 0) > 0.001 ? (
        <div
          data-text="note"
          style={{
            position: "absolute",
            right: 100,
            top: 1000,
            fontFamily: fontText,
            fontSize: 22,
            fontWeight: 400,
            color: colors.muted,
            opacity: 0.75 * (s.corner ?? 0),
            whiteSpace: "nowrap",
          }}
        >
          Số liệu minh họa
        </div>
      ) : null}
    </>
  );
};

export const ZERO: StageState = { appear: 0, noble: 0, farmer: 0, state: 0, quytoc: 0, nongdan: 0, pct: 0, y1397: 0 };
