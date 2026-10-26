import React from "react";
import { CalcTable } from "../../components/CalcTable";
import { Card } from "../../components/Card";
import { AutoLabelItem, AutoLabels, Rect, axesObstacles, curveObstacles, segmentObstacles } from "../../components/labels";
import { MathText, Tex } from "../../components/MathText";
import { Tag, clamp01 } from "../../components/parts";
import { Axes, CurveArrow, FunctionPlot, Plot, Point, Scale, makeScale } from "../../components/plot";
import { role } from "../../components/roles";
import { colors, fontText, halo, tint } from "../../components/theme";

// ---------------- Hàm của video ----------------
/** Ví dụ xuyên suốt: f(x) = (x + 1)/(x − 1); f'(x) = −2/(x − 1)², tiệm cận đứng x = 1, ngang y = 1. */
export const f = (x: number) => (x + 1) / (x - 1);
export const df = (x: number) => -2 / (x - 1) ** 2;

/** Màu theo vai trò, giữ nguyên nghĩa suốt video. */
export const K = {
  main: role.main,
  focus: role.focus,
  up: role.up,
  down: role.down,
  warn: role.warn,
  left: role.pairA, // nhánh trái
  right: role.pairB, // nhánh phải
  dim: role.dim,
};

// ---------------- Bố cục ----------------
const PL = 900;
const PT = 200;
export const S = makeScale({ xMin: -4, xMax: 6, yMin: -5, yMax: 6, width: 880, height: 680 });
const XT = [-3, -2, -1, 1, 2, 3, 4, 5];
const YT = [-4, -3, -2, -1, 1, 2, 3, 4, 5];
const Y_HIDE = [-3, -1, 1, 3, 5];
const COL = { left: 100 };
const F_TOP = 140;
/** chỗ trống bên phải công thức f (tập xác định, phép chia, phép xấp xỉ) */
const SIDE = { left: 540, top: 172 };

/** Phân số dựng tay để tô tử / mẫu riêng và ghi chú cạnh chúng. */
const Frac: React.FC<{
  pre: string;
  num: string;
  den: string;
  size?: number;
  numColor?: string;
  denColor?: string;
  numBg?: number;
  denBg?: number;
  numNote?: { text: string; color: string; o: number };
  denNote?: { text: string; color: string; o: number };
}> = ({ pre, num, den, size = 56, numColor, denColor, numBg = 0, denBg = 0, numNote, denNote }) => {
  const box = (t: string, c: string | undefined, bg: number, note?: { text: string; color: string; o: number }) => (
    <span
      style={{
        position: "relative",
        padding: "0 10px",
        borderRadius: 10,
        color: c,
        background: bg > 0 && c ? tint(c, 0.14 * bg) : undefined,
      }}
    >
      <Tex tex={t} />
      {note && note.o > 0 ? (
        <span
          data-text="label"
          style={{
            position: "absolute",
            left: "100%",
            top: "50%",
            marginLeft: 44,
            translate: "0 -50%",
            whiteSpace: "nowrap",
            fontSize: 44,
            fontWeight: 700,
            color: note.color,
            opacity: note.o,
          }}
        >
          <MathText text={note.text} />
        </span>
      ) : null}
    </span>
  );
  return (
    <span style={{ display: "inline-flex", alignItems: "center", gap: 14, fontSize: size, lineHeight: 1.05, whiteSpace: "nowrap" }}>
      <Tex tex={pre} />
      <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
        {box(num, numColor, numBg, numNote)}
        <span style={{ alignSelf: "stretch", height: 4, background: colors.text, margin: "4px 0", borderRadius: 2 }} />
        {box(den, denColor, denBg, denNote)}
      </span>
    </span>
  );
};

/** Mũi tên ngắn dọc tiếp tuyến tại (x0; f(x0)), hướng sang phải. */
const TangentArrow: React.FC<{ s: Scale; x0: number; color: string; o: number }> = ({ s, x0, color, o }) => {
  if (o <= 0) return null;
  const vx = s.sx;
  const vy = -df(x0) * s.sy;
  const n = Math.hypot(vx, vy);
  const ux = vx / n;
  const uy = vy / n;
  const ax = s.x(x0) + ux * 18;
  const ay = s.y(f(x0)) + uy * 18;
  const L = 78 * o;
  const bx = ax + ux * L;
  const by = ay + uy * L;
  const H = 18;
  return (
    <g opacity={o}>
      <line x1={ax} y1={ay} x2={bx - ux * 8} y2={by - uy * 8} stroke={color} strokeWidth={6} strokeLinecap="round" />
      <polygon data-mark="arrow" points={`${bx},${by} ${bx - ux * H - uy * 11},${by - uy * H + ux * 11} ${bx - ux * H + uy * 11},${by - uy * H - ux * 11}`} fill={color} />
    </g>
  );
};

/** Mũi tên cong (màu bẫy, nét liền) từ đáy nhánh trái, vòng bên phải chỗ đứt, lên đầu nhánh phải; không cắt nhánh phải. */
const JumpArrow: React.FC<{ s: Scale; o: number }> = ({ s, o }) => {
  if (o <= 0) return null;
  const P0 = [0.93, -4.7];
  const Cc = [2.3, 0];
  const P1 = [1.25, 5.2];
  const ux = (P1[0] - Cc[0]) * s.sx;
  const uy = -(P1[1] - Cc[1]) * s.sy;
  const n = Math.hypot(ux, uy);
  const dx = ux / n;
  const dy = uy / n;
  const tx = s.x(P1[0]) + dx * 10;
  const ty = s.y(P1[1]) + dy * 10;
  return (
    <g opacity={o}>
      <path d={`M${s.x(P0[0])},${s.y(P0[1])} Q${s.x(Cc[0])},${s.y(Cc[1])} ${s.x(P1[0])},${s.y(P1[1])}`} fill="none" stroke={K.warn} strokeWidth={6} strokeLinecap="round" />
      <polygon data-mark="arrow" points={`${tx},${ty} ${tx - dx * 26 - dy * 14},${ty - dy * 26 + dx * 14} ${tx - dx * 26 + dy * 14},${ty - dy * 26 - dx * 14}`} fill={K.warn} />
    </g>
  );
};

// ---------------- Trạng thái ----------------
export type St = Partial<{
  formula: number;
  rows: number[];
  table: number;
  p0: number;
  p2: number;
  /** 0: màu chính; 1: màu nhánh */
  ptColor: number;
  ptPulse: number;
  /** nhấp sáng riêng điểm (2; 3), màu bẫy */
  p2Pulse: number;
  tan0: number;
  tan2: number;
  dangXuong: number;
  cols: number;
  q: number;
  fp: number;
  notes: number;
  fpNeg: number;
  ghost: number;
  dLabel: number;
  denHi: number;
  vline: number;
  /** 0: màu bẫy; 1: màu nhấn */
  vlineFocus: number;
  /** nhãn đường đứng: 0 mẫu = 0 · 1 tiệm cận đứng · 2 chỗ đứt */
  vlabStep: number;
  vlab: number;
  halves: number;
  dot: number;
  dotX: number;
  /** phép chia cạnh công thức: 0 tại 0,9 · 1 tại 1,1 */
  div: number;
  divStep: number;
  arrow19: number;
  guessTop: number;
  guessBot: number;
  /** tiến độ vẽ: nhánh trái 0 → 1, nhánh phải 1 → 2, nhánh trái −4 → 0, nhánh phải 2 → 6 */
  lA: number;
  rA: number;
  lB: number;
  rB: number;
  branchDim: number;
  branchPulse: number;
  approx: number;
  hline: number;
  hlab: number;
  bArrows: number;
  jump: number;
  ring0: number;
  ring1: number;
  pm1: number;
  iLab0: number;
  iLab1: number;
  interPulse: number;
  general: number;
  numHi: number;
  coefs: number;
  conds: number;
  condNeg: number;
  card: number;
  mark: number;
  /** ô đánh dấu: 0 'Đúng?' · 1 'Sai' */
  markStep: number;
  ticks02: number;
  remind: number;
  right: number;
  union: number;
  intervals: number;
  intL: number;
  intR: number;
  sweep: number;
}>;

const v = (x: number | undefined) => x ?? 0;
const mixColor = (a: string, b: string, k: number) => (k > 0.5 ? b : a);

export const Scene: React.FC<{ st: St }> = ({ st }) => {
  const s = S;
  const pc0 = mixColor(K.main, K.left, v(st.ptColor));
  const pc2 = mixColor(K.main, K.right, v(st.ptColor));
  const vlColor = mixColor(K.warn, K.focus, v(st.vlineFocus));
  const vlText = ["mẫu $= 0$", "tiệm cận đứng $x = 1$", "chỗ đứt"][Math.round(v(st.vlabStep))];
  const bd = v(st.branchDim);
  const lc = bd > 0.5 ? K.dim : K.left;
  const rc = bd > 0.5 ? K.dim : K.right;
  const items: AutoLabelItem[] = [
    { id: "dx", x: 0, y: -1, text: "đang đi xuống", color: K.down, size: 44, weight: 700, opacity: v(st.dangXuong), prefer: ["sw", "w"], phases: ["b01"] },
    { id: "lera", x: 1.4, y: -3.8, text: "lẽ ra", color: K.warn, size: 44, weight: 700, opacity: v(st.ghost), prefer: ["e", "se", "ne"], anchor: "region" },
    { id: "vlab", x: 1, y: 5.4, text: vlText, color: vlColor, size: 44, weight: 700, opacity: v(st.vlab), prefer: ["e", "ne", "w"], anchor: "region" },
    { id: "m19", x: 0.9, y: -4.6, text: "$-19$", color: K.down, size: 44, weight: 700, opacity: v(st.arrow19), prefer: ["w", "nw", "sw"], anchor: "region" },
    { id: "hlab", x: 4.6, y: 1, text: "tiệm cận ngang $y = 1$", color: K.focus, size: 40, weight: 700, opacity: v(st.hlab), prefer: ["s", "n"], anchor: "region" },
    { id: "i0", x: 0, y: -1, text: "$(0;\\, -1)$", color: K.focus, size: 44, weight: 700, opacity: v(st.iLab0), prefer: ["sw", "w"], phases: ["b06"] },
    { id: "i1", x: -1, y: 0, text: "$(-1;\\, 0)$", color: K.focus, size: 44, weight: 700, opacity: v(st.iLab1), prefer: ["sw", "s", "w"] },
    { id: "nl", x: -2.6, y: -4.4, text: "nhánh trái", color: K.left, size: 40, weight: 700, opacity: v(st.halves), prefer: ["s"], anchor: "region" },
    { id: "nr", x: 4.3, y: -4.4, text: "nhánh phải", color: K.right, size: 40, weight: 700, opacity: v(st.halves), prefer: ["s"], anchor: "region" },
  ];
  const obst: Rect[] = [
    ...axesObstacles(s, XT, YT.filter((t) => !Y_HIDE.includes(t))),
    ...segmentObstacles(s.x(1), 0, s.x(1), s.height, 6),
  ];
  if (v(st.lA) + v(st.lB) > 0) obst.push(...curveObstacles(s, f, -4, 0.85));
  if (v(st.rA) + v(st.rB) > 0) obst.push(...curveObstacles(s, f, 1.25, 6));
  if (v(st.hline) > 0) obst.push(...segmentObstacles(0, s.y(1), s.width, s.y(1), 6));
  const sweep = v(st.sweep);
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <LeftColumn st={st} />
      <Plot scale={s} left={PL} top={PT} overlay={<AutoLabels scale={s} items={items} obstacles={obst} />}>
        {v(st.halves) > 0 ? (
          <g opacity={st.halves}>
            <rect x={0} y={0} width={s.x(1)} height={s.height} fill={tint(K.left, 0.07)} />
            <rect x={s.x(1)} y={0} width={s.width - s.x(1)} height={s.height} fill={tint(K.right, 0.07)} />
          </g>
        ) : null}
        <Axes scale={s} xTicks={XT} yTicks={YT} hideYLabels={v(st.dangXuong) > 0 || v(st.iLab0) > 0 ? [...Y_HIDE, -2] : Y_HIDE} hideXLabels={v(st.pm1) > 0 ? [-1] : []} xLabel="x" yLabel="y" />
        {/* khoảng trên trục ngang (b08) */}
        {v(st.intervals) > 0 ? (
          <g opacity={st.intervals}>
            <line x1={0} x2={s.x(0.93)} y1={s.y(0)} y2={s.y(0)} stroke={K.left} strokeWidth={10 + 6 * v(st.intL)} strokeLinecap="round" opacity={0.75} />
            <line x1={s.x(1.07)} x2={s.width} y1={s.y(0)} y2={s.y(0)} stroke={K.right} strokeWidth={10 + 6 * v(st.intR)} strokeLinecap="round" opacity={0.75} />
          </g>
        ) : null}
        {/* vòng sáng ở vạch 0 và 2 (b08) */}
        {v(st.ticks02) > 0
          ? [0, 2].map((x) => <circle key={x} cx={s.x(x)} cy={s.y(0)} r={16} fill="none" stroke={K.focus} strokeWidth={5} opacity={st.ticks02} />)
          : null}
        {/* vùng đoán trên / dưới ngay bên phải chỗ đứt */}
        {v(st.guessTop) > 0 ? <rect x={s.x(1.05)} y={s.y(5.9)} width={s.x(1.9) - s.x(1.05)} height={s.y(3.6) - s.y(5.9)} rx={14} fill={tint(K.focus, 0.18)} opacity={st.guessTop} /> : null}
        {v(st.guessBot) > 0 ? <rect x={s.x(1.05)} y={s.y(-2.6)} width={s.x(1.9) - s.x(1.05)} height={s.y(-4.9) - s.y(-2.6)} rx={14} fill={tint(K.focus, 0.18)} opacity={st.guessBot} /> : null}
        {/* hai tiệm cận */}
        {v(st.vline) > 0 ? (
          <line x1={s.x(1)} x2={s.x(1)} y1={0} y2={s.height} stroke={vlColor} strokeWidth={4} strokeDasharray="14 10" opacity={st.vline} />
        ) : null}
        {v(st.hline) > 0 ? (
          <line x1={0} x2={s.width * clamp01(v(st.hline))} y1={s.y(1)} y2={s.y(1)} stroke={K.focus} strokeWidth={4} strokeDasharray="14 10" />
        ) : null}
        {/* hai cột độ cao */}
        {v(st.cols) > 0
          ? [0, 2].map((x) => (
              <rect key={x} x={s.x(x) - 9} y={Math.min(s.y(0), s.y(f(x)))} width={18} height={Math.abs(s.y(f(x)) - s.y(0))} rx={5} fill={tint(K.focus, 0.45)} opacity={st.cols} />
            ))
          : null}
        {/* đường 'lẽ ra' */}
        {v(st.ghost) > 0 ? (
          <path
            d={`M${s.x(0)},${s.y(-1)} Q${s.x(1.2)},${s.y(-3.2)} ${s.x(2.6)},${s.y(-4.4)}`}
            fill="none"
            stroke={K.warn}
            strokeWidth={5}
            strokeDasharray="12 10"
            opacity={st.ghost}
          />
        ) : null}
        {/* hai nhánh */}
        {v(st.lA) > 0 ? <FunctionPlot scale={s} f={f} from={0} to={0.9995} progress={v(st.lA)} color={lc} width={7} samples={500} /> : null}
        {v(st.lB) > 0 ? <FunctionPlot scale={s} f={f} from={0} to={-4} progress={v(st.lB)} color={lc} width={7} /> : null}
        {v(st.rA) > 0 ? <FunctionPlot scale={s} f={f} from={1.0005} to={2} progress={v(st.rA)} color={rc} width={7} samples={500} /> : null}
        {v(st.rB) > 0 ? <FunctionPlot scale={s} f={f} from={2} to={6} progress={v(st.rB)} color={rc} width={7} /> : null}
        {v(st.branchPulse) > 0 ? (
          <g opacity={st.branchPulse}>
            <FunctionPlot scale={s} f={f} from={-4} to={0.9995} color={tint(K.down, 0.5)} width={18} samples={500} />
            <FunctionPlot scale={s} f={f} from={1.0005} to={6} color={tint(K.down, 0.5)} width={18} samples={500} />
          </g>
        ) : null}
        {v(st.intL) > 0 ? <FunctionPlot scale={s} f={f} from={-4} to={0.9995} color={tint(K.left, 0.4)} width={18} samples={500} opacity={st.intL} /> : null}
        {v(st.intR) > 0 ? <FunctionPlot scale={s} f={f} from={1.0005} to={6} color={tint(K.right, 0.4)} width={18} samples={500} opacity={st.intR} /> : null}
        {sweep > 0 && sweep < 1 ? (
          sweep < 0.5 ? (
            <FunctionPlot scale={s} f={f} from={0} to={0.84 + 0.155 * (sweep * 2)} color={tint(K.focus, 0.5)} width={18} samples={300} />
          ) : (
            <FunctionPlot scale={s} f={f} from={1.0005} to={1.0005 + (2 - 1.0005) * ((sweep - 0.5) * 2)} color={tint(K.focus, 0.5)} width={18} samples={500} />
          )
        ) : null}
        {/* mũi tên dọc nhánh, chỉ chiều đi xuống */}
        <CurveArrow s={s} f={f} df={df} x={0.45} color={K.down} opacity={v(st.bArrows)} />
        <CurveArrow s={s} f={f} df={df} x={1.62} color={K.down} opacity={v(st.bArrows)} />
        {/* mũi tên đi qua chỗ đứt: từ đáy nhánh trái lên đỉnh nhánh phải */}
          <JumpArrow s={s} o={v(st.jump)} />
        {/* mũi tên −19 */}
        {v(st.arrow19) > 0 ? (
          <g opacity={st.arrow19}>
            <line x1={s.x(0.9)} y1={s.y(-2.4)} x2={s.x(0.9)} y2={s.height - 6} stroke={K.down} strokeWidth={6} strokeLinecap="round" />
            <polygon data-mark="arrow" points={`${s.x(0.9)},${s.height + 14} ${s.x(0.9) - 14},${s.height - 12} ${s.x(0.9) + 14},${s.height - 12}`} fill={K.down} />
          </g>
        ) : null}
        {/* chấm chạy trên trục ngang */}
        {v(st.dot) > 0 ? <circle cx={s.x(v(st.dotX))} cy={s.y(0)} r={10} fill={K.focus} stroke={colors.bg} strokeWidth={3} opacity={st.dot} /> : null}
        {/* hai điểm */}
        {v(st.ptPulse) > 0
          ? [0, 2].map((x) => <circle key={x} cx={s.x(x)} cy={s.y(f(x))} r={26} fill={tint(K.focus, 0.28)} opacity={st.ptPulse} />)
          : null}
        {v(st.p2Pulse) > 0 ? <circle cx={s.x(2)} cy={s.y(3)} r={30} fill={tint(K.warn, 0.3)} opacity={st.p2Pulse} /> : null}
        <TangentArrow s={s} x0={0} color={K.down} o={v(st.tan0)} />
        <TangentArrow s={s} x0={2} color={K.down} o={v(st.tan2)} />
        <Point scale={s} x={0} y={-1} color={pc0} opacity={v(st.p0)} />
        <Point scale={s} x={2} y={3} color={pc2} opacity={v(st.p2)} />
        {v(st.ring0) > 0 ? <circle cx={s.x(0)} cy={s.y(-1)} r={24} fill="none" stroke={K.focus} strokeWidth={5} opacity={st.ring0} /> : null}
        {v(st.pm1) > 0 ? <Point scale={s} x={-1} y={0} color={K.left} opacity={st.pm1} /> : null}
        {v(st.ring1) > 0 ? <circle cx={s.x(-1)} cy={s.y(0)} r={24} fill="none" stroke={K.focus} strokeWidth={5} opacity={st.ring1} /> : null}
        {v(st.interPulse) > 0
          ? [
              [0, -1],
              [-1, 0],
            ].map(([x, y]) => <circle key={x} cx={s.x(x)} cy={s.y(y)} r={30} fill={tint(K.left, 0.3)} opacity={st.interPulse} />)
          : null}
      </Plot>
      {v(st.q) > 0 ? (
        <Tag x={PL + s.x(1)} y={PT + s.y(1.6) - 40} color={K.warn} size={80} weight={800} opacity={st.q} name="q">
          ?
        </Tag>
      ) : null}
    </div>
  );
};

// ---------------- Cột trái ----------------
const LeftColumn: React.FC<{ st: St }> = ({ st }) => {
  const div = v(st.divStep);
  const markStep = v(st.markStep);
  return (
    <>
      <div data-text="formula" style={{ position: "absolute", left: COL.left, top: F_TOP, fontSize: 56, fontFamily: fontText, color: colors.text, opacity: v(st.formula), textShadow: halo() }}>
        <Frac pre="f(x) =" num="x + 1" den="x - 1" denColor={v(st.denHi) > 0 ? K.warn : undefined} denBg={v(st.denHi)} />
      </div>
      {/* chỗ trống bên phải công thức */}
      <Tag x={SIDE.left} y={SIDE.top} anchor="left" color={K.warn} size={48} weight={700} opacity={v(st.dLabel)}>
        <MathText text={"$D = \\mathbb{R} \\setminus \\{1\\}$"} />
      </Tag>
      {[0, 1].map((i) => {
        const k = clamp01(1 - Math.abs(div - i)) * v(st.div);
        return k > 0 ? (
          <Tag key={i} x={SIDE.left} y={SIDE.top - 34} anchor="left" size={46} weight={600} opacity={k}>
            <MathText text={i === 0 ? "$f(0{,}9) = \\dfrac{1{,}9}{-0{,}1}$" : "$f(1{,}1) = \\dfrac{2{,}1}{0{,}1} = 21$"} />
          </Tag>
        ) : null;
      })}
      <Tag x={SIDE.left} y={SIDE.top - 34} anchor="left" size={42} weight={600} opacity={v(st.approx)}>
        <MathText text={"$|x|$ rất lớn: $\\dfrac{x + 1}{x - 1} \\approx \\dfrac{x}{x} = 1$"} />
      </Tag>
      <CalcTable
        left={COL.left}
        top={372}
        width={600}
        headers={["$x$", "$f(x)$", "$f'(x)$"]}
        rows={[
          { cells: ["0", "−1", "−2"], o: v(st.rows?.[0]) },
          { cells: ["2", "3", "−2"], o: v(st.rows?.[1]) },
        ]}
        colColors={[undefined, undefined, K.down]}
        opacity={v(st.table)}
      />
      {/* đạo hàm */}
      {v(st.fp) > 0 ? (
        <div data-text="formula" style={{ position: "absolute", left: COL.left, top: 650, fontSize: 52, fontFamily: fontText, color: colors.text, opacity: st.fp, textShadow: halo() }}>
          <Frac
            pre="f'(x) ="
            num="-2"
            den="(x - 1)^2"
            size={52}
            numColor={v(st.notes) > 0 ? K.down : undefined}
            denColor={v(st.notes) > 0 ? K.left : undefined}
            numBg={v(st.notes)}
            denBg={v(st.notes)}
            numNote={{ text: "$< 0$", color: K.down, o: v(st.notes) }}
            denNote={{ text: "$\\geq 0$", color: K.left, o: v(st.notes) }}
          />
        </div>
      ) : null}
      <Tag x={COL.left} y={835} anchor="left" color={K.down} size={48} weight={700} opacity={v(st.fpNeg)}>
        <MathText text={"$f'(x) < 0$"} />
      </Tag>
      {/* dạng chung (b07) */}
      {v(st.general) > 0 ? (
        <>
          <Tag x={COL.left} y={352} anchor="left" color={colors.muted} size={40} weight={600} opacity={st.general}>
            <MathText text={"dạng chung $y = \\dfrac{ax + b}{cx + d}$"} />
          </Tag>
          <div
            data-text="label"
            style={{ position: "absolute", left: 590, top: 362, fontFamily: fontText, fontSize: 38, fontWeight: 600, lineHeight: 1.25, whiteSpace: "nowrap", color: colors.muted, opacity: v(st.coefs) * v(st.general) }}
          >
            <div>
              ví dụ: <Tex tex={"a = 1,\\ b = 1"} />
            </div>
            <div>
              <Tex tex={"c = 1,\\ d = -1"} />
            </div>
          </div>
          <div data-text="formula" style={{ position: "absolute", left: COL.left, top: 478, fontSize: 46, fontFamily: fontText, color: colors.text, opacity: st.general, textShadow: halo() }}>
            <Frac pre="y' =" num="ad - bc" den="(cx + d)^2" size={46} numColor={v(st.numHi) > 0 ? K.focus : undefined} numBg={v(st.numHi)} />
          </div>
          <Tag x={COL.left} y={652} anchor="left" color={K.focus} size={44} weight={700} opacity={v(st.coefs) * v(st.general)}>
            <MathText text={"$ad - bc = 1 \\cdot (-1) - 1 \\cdot 1 = -2$"} />
          </Tag>
          <Tag x={COL.left} y={738} anchor="left" color={K.down} size={40} weight={700} opacity={v(st.conds) * v(st.general)}>
            <span style={{ background: v(st.condNeg) > 0 ? tint(K.down, 0.14 * v(st.condNeg)) : undefined, borderRadius: 10, padding: "0 8px" }}>
              <MathText text={"$ad - bc < 0$: hai nhánh cùng đi xuống"} />
            </span>
          </Tag>
          <Tag x={COL.left} y={818} anchor="left" color={K.up} size={40} weight={700} opacity={v(st.conds) * v(st.general) * (1 - 0.6 * v(st.condNeg))}>
            <MathText text={"$ad - bc > 0$: hai nhánh cùng đi lên"} />
          </Tag>
        </>
      ) : null}
      {/* thẻ mệnh đề (b08) */}
      {v(st.card) > 0 ? (
        <Card style={{ left: COL.left, top: 360, width: 660, padding: "22px 28px", opacity: st.card, display: "flex", alignItems: "center", gap: 22 }}>
          <div data-text="label" style={{ fontSize: 42, fontWeight: 600, flex: 1 }}>
            <MathText text={"Hàm số nghịch biến trên $\\mathbb{R} \\setminus \\{1\\}$"} />
          </div>
          <div
            style={{
              width: 140,
              height: 74,
              borderRadius: 14,
              border: `3px solid ${markStep > 0.5 ? K.down : colors.panelBorder}`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
            }}
          >
            {v(st.mark) > 0 ? (
              <span data-text="label" style={{ fontSize: 40, fontWeight: 800, color: markStep > 0.5 ? K.down : tint(K.warn, 0.75), opacity: v(st.mark) }}>
                {markStep > 0.5 ? "Sai" : "Đúng?"}
              </span>
            ) : null}
          </div>
        </Card>
      ) : null}
      <Tag x={COL.left} y={530} anchor="left" color={colors.muted} size={40} weight={600} opacity={v(st.remind)}>
        <MathText text={"đi sang phải $\\Rightarrow$ độ cao giảm"} />
      </Tag>
      <Tag x={COL.left} y={610} anchor="left" color={K.focus} size={42} weight={700} opacity={v(st.right)}>
        <MathText text={"nghịch biến trên $(-\\infty;\\, 1)$ và $(1;\\, +\\infty)$"} />
      </Tag>
      {v(st.union) > 0 ? (
        <div data-text="label" style={{ position: "absolute", left: COL.left, top: 690, fontFamily: fontText, fontSize: 42, fontWeight: 700, color: K.warn, opacity: st.union, whiteSpace: "nowrap" }}>
          <span style={{ position: "relative", display: "inline-block" }}>
            <Tex tex={"(-\\infty;\\, 1) \\cup (1;\\, +\\infty) = \\mathbb{R} \\setminus \\{1\\}"} />
          </span>
          <span style={{ display: "inline-block" }}>: sai</span>
        </div>
      ) : null}
    </>
  );
};
