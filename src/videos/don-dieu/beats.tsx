import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BeatProps, clamp, ramp } from "../../components/BeatShell";
import { Card } from "../../components/Card";
import { MathText, Tex } from "../../components/MathText";
import { Axes, FunctionPlot, Plot, PlotLabel, Point, Scale, Segment, TangentLine, makeScale } from "../../components/plot";
import { colors, fontText, tint } from "../../components/theme";
import { ZoomInset } from "../../components/ZoomInset";
import {
  AxisDot,
  AxisLabel,
  AxisPart,
  Badge,
  C,
  Col,
  CurveArrow,
  CurvePart,
  Drone,
  G,
  GPOS,
  GS,
  Graph,
  HS,
  HILL,
  Hill,
  HillDrone,
  PANEL,
  PanelCard,
  Tag,
  col,
  h,
  hillLeft,
  hp,
  label,
  lerp,
  tiltFor,
} from "./scene";

/** Số dòng đã bắt đầu (0 trước dòng đầu). */
const lineAt = (f: number, L: number[]) => L.filter((l) => f >= l).length;
const fadeIn = (f: number, a: number, d = 12) => ramp(f, a, a + d);

const FORMULA = "f(x) = -x^3 + 6x^2 - 9x + 6";

// =====================================================================
// b01 HIỆN TƯỢNG — flycam bay bám địa hình; chỉ có công thức; lên hay xuống?
// =====================================================================
export const Beat01: React.FC<BeatProps> = ({ L, E }) => {
  const f = useCurrentFrame();
  const mix = ramp(f, L[1], L[1] + 20);
  const faint = ramp(f, L[1], L[1] + 20);
  const x = interpolate(f, [L[0] + 4, E[0] + 6], [0.3, 2.0], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const card = fadeIn(f, L[1] + 8, 14);
  const q = fadeIn(f, L[2], 14);
  const dronePx = hillLeft(mix) + HS.x(x);
  return (
    <>
      <Hill mix={mix} faint={faint} />
      <HillDrone mix={mix} x={x} spin={f * 0.9} gauge={1 - faint} />
      <Card group="map" style={{ left: 1270, top: 300, width: 560, padding: "18px 28px", opacity: card }}>
        <div data-box>
          <div data-text="th" style={{ ...label, color: colors.muted, textAlign: "center" }}>
            bản đồ độ cao
          </div>
          <div data-text="formula" style={{ textAlign: "center", fontSize: 38, marginTop: 6, whiteSpace: "nowrap" }}>
            <Tex tex={FORMULA} />
          </div>
        </div>
      </Card>
      <Tag x={dronePx - 70} y={210} size={60} weight={800} color={C.up} opacity={q}>
        ↑ ?
      </Tag>
      <Tag x={dronePx + 70} y={210} size={60} weight={800} color={C.down} opacity={q}>
        ↓ ?
      </Tag>
    </>
  );
};

// =====================================================================
// b02 VÍ DỤ — mô hình: x là quãng bay ngang (km), f(x) là độ cao (trăm m)
// =====================================================================
export const Beat02: React.FC<BeatProps> = ({ L }) => {
  const f = useCurrentFrame();
  const line = lineAt(f, L);
  const hillOut = 1 - ramp(f, 0, 14);
  const move = ramp(f, 0, 18);
  const badge = fadeIn(f, L[0] + 6);
  const rx = fadeIn(f, L[1]);
  const rh = fadeIn(f, L[2]);
  const r2 = fadeIn(f, L[3]);
  const X = col(line === 2 ? C.x : null, "x");
  const tex =
    line >= 3
      ? `${col(line === 3 ? colors.curve : null, "f(x)")} = -x^3 + 6x^2 - 9x + 6`
      : `f(${X}) = -${X}^3 + 6${X}^2 - 9${X} + 6`;
  const left = lerp(1270, 410, move);
  const width = lerp(560, 1100, move);
  const top = lerp(300, 180, move);
  const rowStyle: React.CSSProperties = { ...label, fontSize: 44, display: "flex", alignItems: "center", gap: 18, marginTop: 22 };
  return (
    <>
      <Hill mix={1} faint={1} opacity={hillOut} />
      <Card group="model" style={{ left, top, width, padding: "22px 40px" }}>
        <div data-box>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div data-text="th" style={{ ...label, color: colors.muted }}>
              bản đồ độ cao
            </div>
            <span
              data-text="badge"
              style={{
                ...label,
                padding: "2px 18px",
                borderRadius: 999,
                border: `2px solid ${colors.brandBlue}`,
                background: tint(colors.brandBlue, 0.08),
                color: colors.brandBlue,
                fontWeight: 700,
                opacity: badge,
              }}
            >
              mô hình
            </span>
          </div>
          <div data-text="formula" style={{ textAlign: "center", fontSize: lerp(38, 64, move), margin: "18px 0 6px", whiteSpace: "nowrap" }}>
            <Tex tex={tex} />
          </div>
          <div style={{ ...rowStyle, opacity: rx, color: C.x }}>
            <span data-text="td">
              <MathText text="$x$ — quãng bay ngang" />
            </span>
          </div>
          <div style={{ ...rowStyle, opacity: rh, color: colors.curve }}>
            <span data-text="td">
              <MathText text="$f(x)$ — độ cao mặt đất" />
            </span>
          </div>
          <div style={{ ...rowStyle, opacity: r2, justifyContent: "center", fontSize: 50 }}>
            <span data-text="td">
              <Tex tex="f(2) = -8 + 24 - 18 + 6" />
            </span>
          </div>
        </div>
      </Card>
    </>
  );
};

// =====================================================================
// b03 VÍ DỤ — bảng số → chấm điểm → nối thành đồ thị
// =====================================================================
const XS = [0, 1, 2, 3, 4];
const ValueTable: React.FC<{ hi: number; opacity: number; left: number }> = ({ hi, opacity, left }) => {
  if (opacity <= 0) return null;
  const cell: React.CSSProperties = { width: 190, textAlign: "center" };
  return (
    <Card group="values" style={{ left, top: 215, width: 440, padding: "10px 0", opacity }}>
      <div data-box style={{ ...label, fontSize: 40 }}>
        <div style={{ display: "flex", justifyContent: "space-around", color: colors.muted, fontSize: 36, paddingBottom: 6, borderBottom: `2px solid ${colors.panelBorder}` }}>
          <div data-text="th" style={cell}>
            <MathText text="$x$" />
          </div>
          <div data-text="th" style={cell}>
            <MathText text="$f(x)$" />
          </div>
        </div>
        {XS.map((x, i) => (
          <div
            key={x}
            style={{ display: "flex", justifyContent: "space-around", padding: "5px 0", fontWeight: 700, background: hi === i ? tint(colors.accent, 0.12) : undefined }}
          >
            <div data-text="td" style={cell}>
              {x}
            </div>
            <div data-text="td" style={cell}>
              {h(x)}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

/** Máy tính bị bịt mắt: chỉ được biết công thức, không được nhìn hình. */
const BlindComputer: React.FC<{ x: number; y: number; opacity: number }> = ({ x, y, opacity }) =>
  opacity <= 0 ? null : (
    <svg width={190} height={170} style={{ position: "absolute", left: x, top: y, opacity, overflow: "visible" }}>
      <rect x={10} y={10} width={170} height={110} rx={14} fill={colors.text} />
      <rect x={22} y={22} width={146} height={86} rx={6} fill={tint(colors.brandBlue, 0.35)} />
      <rect x={4} y={50} width={182} height={28} rx={8} fill={colors.warn} transform="rotate(-6 95 64)" />
      <path d="M180,58 l18,-10 l-4,18 z M180,66 l20,8 l-12,10 z" fill={colors.warn} />
      <rect x={80} y={120} width={30} height={22} fill={colors.text} />
      <rect x={50} y={142} width={90} height={12} rx={6} fill={colors.text} />
    </svg>
  );

export const Beat03: React.FC<BeatProps> = ({ L }) => {
  const f = useCurrentFrame();
  const table = fadeIn(f, L[0], 14) * (1 - ramp(f, L[2] + 30, L[2] + 46));
  const axes = fadeIn(f, L[1], 12);
  const ptStart = (i: number) => L[1] + 14 + i * 10;
  const hi = f >= L[1] && f < ptStart(4) + 12 ? XS.findIndex((_, i) => f >= ptStart(i) && f < ptStart(i) + 12) : -1;
  const curve = ramp(f, L[2] + 2, L[2] + 40, Easing.inOut(Easing.quad));
  const toCenter = ramp(f, L[2] + 34, L[2] + 54);
  const left = lerp(GPOS.right, GPOS.center, toCenter);
  const blind = fadeIn(f, L[2] + 50, 14);
  return (
    <>
      <ValueTable hi={hi} opacity={table} left={lerp(740, 130, ramp(f, L[1], L[1] + 16))} />
      <Graph left={left} axes={axes} curve={curve} model={axes}>
        {(s) => XS.map((x, i) => <Point key={x} scale={s} x={x} y={h(x)} opacity={fadeIn(f, ptStart(i), 8)} />)}
      </Graph>
      <BlindComputer x={left + G.width + 90} y={300} opacity={blind} />
    </>
  );
};

// =====================================================================
// b04 GỐC RỄ — tính vài điểm rồi nối theo cảm nhận: ở giữa lồi lên thì sao?
// =====================================================================
const bump = (x: number) => 1.8 * Math.exp(-(((x - 2.5) / 0.12) ** 2));
const g = (x: number) => h(x) + bump(x);
const DRONE_W = 150;
const DRONE_GAP_G = 0.5;
const HALF = DRONE_W / 2 / GS.sx;
/** Vị trí x flycam đâm vào chỗ lồi khi bay theo đường nối mềm qua 5 điểm. */
const CRASH_X = (() => {
  for (let x = 1.2; x < 3; x += 0.002) {
    for (let u = x; u <= x + HALF * 0.9; u += 0.005) {
      if (bump(u) > 0.05 && g(u) > h(x) + DRONE_GAP_G + 0.35) return x;
    }
  }
  return 2.2;
})();

export const Beat04: React.FC<BeatProps> = ({ L, E }) => {
  const f = useCurrentFrame();
  const back = fadeIn(f, L[3], 14);
  const dim = fadeIn(f, L[0], 14) * (1 - back);
  const guess = fadeIn(f, L[0] + 10, 20) * (1 - back);
  const ridge = fadeIn(f, L[1], 14) * (1 - back);
  const flyEnd = Math.min(E[2] - 20, L[2] + 70);
  const x = interpolate(f, [L[2] + 4, flyEnd], [1.1, CRASH_X], { ...clamp, easing: Easing.in(Easing.quad) });
  const crashed = f >= flyEnd;
  const shake = crashed ? Math.sin((f - flyEnd) * 2.2) * Math.max(0, 8 - (f - flyEnd) * 0.6) : 0;
  const droneO = fadeIn(f, L[2], 8) * (1 - back);
  const left = GPOS.center;
  return (
    <>
      <Graph
        left={left}
        curveOpacity={1 - dim}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={1.9} y={1.0} anchor="left" color={colors.accent} opacity={guess}>
              nối theo cảm nhận
            </PlotLabel>
            <PlotLabel scale={s} x={2.3} y={6.7} anchor="right" color={colors.warn} opacity={ridge}>
              lồi lên?
            </PlotLabel>
          </>
        )}
      >
        {(s) => (
          <>
            {guess > 0 ? <FunctionPlot scale={s} f={h} from={0} to={4} progress={guess} color={colors.accent} width={5} opacity={0.8} /> : null}
            {ridge > 0 ? <FunctionPlot scale={s} f={g} from={0} to={4} color={colors.warn} width={5} opacity={ridge} samples={500} /> : null}
            {XS.map((p) => (
              <Point key={p} scale={s} x={p} y={h(p)} opacity={1 - back} />
            ))}
          </>
        )}
      </Graph>
      <Drone
        x={left + GS.x(x) + shake}
        y={G.top + GS.y(h(x) + DRONE_GAP_G)}
        w={DRONE_W}
        tilt={crashed ? -12 : tiltFor(hp(x), GS)}
        spin={f * 0.9}
        dizzy={crashed ? fadeIn(f, flyEnd + 4, 8) : 0}
        opacity={droneO}
      />
    </>
  );
};

// =====================================================================
// b05 ĐỊNH NGHĨA — đồng biến: x1 < x2 ⇒ f(x1) < f(x2)
// =====================================================================
const X1 = 2;
const X2 = 3;

export const Beat05: React.FC<BeatProps> = ({ L }) => {
  const f = useCurrentFrame();
  const up = fadeIn(f, L[0]);
  const dots = fadeIn(f, L[1]);
  const cols = fadeIn(f, L[2]);
  const down = fadeIn(f, L[3]);
  return (
    <Graph
      left={GPOS.center}
      hideX={[2, 3]}
      overlay={(s) => (
        <>
          <AxisLabel s={s} x={X1} text="$x_1$" color={C.x0} opacity={dots} />
          <AxisLabel s={s} x={X2} text="$x_2$" color={C.x} opacity={dots} />
          <PlotLabel scale={s} x={X1 - 0.06} y={0.9} anchor="right" color={C.x0} opacity={cols}>
            <MathText text="$f(x_1) = 4$" />
          </PlotLabel>
          <PlotLabel scale={s} x={X2 + 0.06} y={0.9} anchor="left" color={C.x} opacity={cols}>
            <MathText text="$f(x_2) = 6$" />
          </PlotLabel>
        </>
      )}
    >
      {(s) => (
        <>
          <AxisPart s={s} a={1} b={3} color={C.up} opacity={up * 0.55} />
          <AxisPart s={s} a={0} b={1} color={C.down} opacity={down * 0.55} />
          <AxisPart s={s} a={3} b={4} color={C.down} opacity={down * 0.55} />
          <CurvePart s={s} a={1} b={3} color={C.up} opacity={up} />
          <CurvePart s={s} a={0} b={1} color={C.down} opacity={down} />
          <CurvePart s={s} a={3} b={4} color={C.down} opacity={down} />
          <Col s={s} x={X1} color={C.x0} opacity={cols} />
          <Col s={s} x={X2} color={C.x} opacity={cols} />
          <AxisDot s={s} x={X1} color={C.x0} opacity={dots} />
          <AxisDot s={s} x={X2} color={C.x} opacity={dots} />
          <Point scale={s} x={X1} y={h(X1)} color={C.x0} opacity={cols} />
          <Point scale={s} x={X2} y={h(X2)} color={C.x} opacity={cols} />
        </>
      )}
    </Graph>
  );
};

// =====================================================================
// b06 BẢN CHẤT — vì sao f' > 0 thì đi lên? Đạo hàm = lim phân số; tử = độ cao chênh, mẫu = khoảng ngang; f' > 0 ⇒ phân số > 0
// b07 BẢN CHẤT — bên phải: mẫu > 0 ⇒ tử > 0 ⇒ cao hơn; bên trái: mẫu < 0 ⇒ tử < 0 ⇒ thấp hơn ⇒ tại đó đi lên
// =====================================================================
const X0 = 2;
const XB = 2.6; // điểm thứ hai dùng để chỉ tử/mẫu trên đồ thị chính
const LENS = { left: PANEL.left, top: 465, w: PANEL.width, h: 250, z: 5 };
/** Trạng thái một cụm trên công thức: null thường, "hl" sáng màu, "+"/"-" sáng màu kèm dấu. */
type Part = null | "hl" | "+" | "-";

const partTex = (p: Part, color: string, body: string) =>
  p ? `${col(color, body)}${p === "hl" ? "" : `\\;${col(color, p === "+" ? "(+)" : "(-)")}`}` : body;

const defTex = (o: { pos: boolean; num: Part; den: Part }) => {
  const plain = !o.num && !o.den;
  const frac = `\\dfrac{${partTex(o.num, C.num, "f(x)-f(x_0)")}}{${partTex(o.den, C.den, "x-x_0")}}`;
  return `f'(x_0)=\\lim\\limits_{x\\to x_0}${o.pos && plain ? col(C.up, frac) : frac}${o.pos ? col(C.up, "\\;>0") : ""}`;
};

const DefCard: React.FC<{ pos: boolean; num: Part; den: Part; opacity: number }> = ({ pos, num, den, opacity }) => (
  <PanelCard top={165} opacity={opacity} group="def">
    <div data-box>
      <div data-text="th" style={{ ...label, color: colors.muted, textAlign: "center", marginBottom: 6 }}>
        đạo hàm (bài trước)
      </div>
      <div data-text="formula" style={{ textAlign: "center", fontSize: 42, whiteSpace: "nowrap" }}>
        <Tex tex={defTex({ pos, num, den })} />
      </div>
    </div>
  </PanelCard>
);

type SideState = { o: number; run: number; rise: number; arrow: number; signs: number };
const HIDDEN: SideState = { o: 0, run: 0, rise: 0, arrow: 0, signs: 0 };

/** Điểm x sát x0 (side = 1 bên phải, -1 bên trái) trong ô phóng to: đoạn ngang (mẫu), đoạn dọc (tử), dấu, mũi tên. */
const SideMark: React.FC<{ s: Scale; side: 1 | -1 } & SideState> = ({ s, side, o, run, rise, arrow, signs }) => {
  if (o <= 0) return null;
  const b = X0 + 0.1 * side;
  const yb = h(b);
  const y0 = h(X0);
  const sg = side === 1 ? "+" : "−";
  const tStyle = { fontFamily: fontText, fontWeight: 800, fontSize: 44, paintOrder: "stroke", stroke: colors.panel, strokeWidth: 7 } as const;
  // bên phải: ngang tại y0 (x0 → b), dọc tại b (y0 → yb). bên trái: ngang tại yb (b → x0), dọc tại x0 (yb → y0).
  const hy = side === 1 ? y0 : yb;
  const vx = side === 1 ? b : X0;
  const color = side === 1 ? C.up : C.down;
  return (
    <g opacity={o}>
      <line x1={s.x(b)} y1={s.height} x2={s.x(b)} y2={s.y(yb)} stroke={C.x} strokeWidth={4} strokeDasharray="8 6" />
      {run > 0 ? (
        <g opacity={run}>
          <line x1={s.x(Math.min(b, X0))} y1={s.y(hy)} x2={s.x(Math.max(b, X0))} y2={s.y(hy)} stroke={C.den} strokeWidth={8} />
          <text data-text="sign" x={(s.x(b) + s.x(X0)) / 2} y={s.y(hy) + 46} textAnchor="middle" fill={C.den} opacity={signs} {...tStyle}>
            {sg}
          </text>
        </g>
      ) : null}
      {rise > 0 ? (
        <g opacity={rise}>
          <line x1={s.x(vx)} y1={s.y(Math.min(y0, yb))} x2={s.x(vx)} y2={s.y(Math.max(y0, yb))} stroke={C.num} strokeWidth={8} />
          <text data-text="sign" x={s.x(vx) + 30} y={(s.y(y0) + s.y(yb)) / 2 + 14} textAnchor="middle" fill={C.num} opacity={signs} {...tStyle}>
            {sg}
          </text>
        </g>
      ) : null}
      <circle data-mark="point" cx={s.x(b)} cy={s.y(yb)} r={10} fill={arrow > 0.5 ? color : C.x} stroke={colors.panel} strokeWidth={3} />
      {arrow > 0 ? (
        <text data-text="sign" x={s.x(b) + (side === 1 ? -36 : -40)} y={s.y(yb) + (side === 1 ? -8 : 16)} textAnchor="middle" fill={color} opacity={arrow} {...tStyle}>
          {side === 1 ? "↑" : "↓"}
        </text>
      ) : null}
    </g>
  );
};

const WhyLens: React.FC<{ o: number; right: SideState; left: SideState }> = ({ o, right, left }) =>
  o <= 0 ? null : (
    <ZoomInset base={GS} baseLeft={GPOS.left} baseTop={G.top} f={h} x0={X0} y0={h(X0)} z={LENS.z} left={LENS.left} top={LENS.top} width={LENS.w} height={LENS.h} opacity={o}>
      {(s) => (
        <>
          <SideMark s={s} side={1} {...right} />
          <SideMark s={s} side={-1} {...left} />
        </>
      )}
    </ZoomInset>
  );

export const Beat06: React.FC<BeatProps> = ({ L }) => {
  const f = useCurrentFrame();
  const line = lineAt(f, L);
  const mix = ramp(f, 0, 18);
  const left = lerp(GPOS.center, GPOS.left, mix);
  const q = fadeIn(f, L[0] + 4) * (1 - fadeIn(f, L[1]));
  const def = fadeIn(f, L[1]);
  const pair = fadeIn(f, L[1] + 6) * (1 - fadeIn(f, L[4]));
  const rise = fadeIn(f, L[2]);
  const run = fadeIn(f, L[3]);
  const lens = fadeIn(f, L[4], 14);
  const num: Part = line === 3 ? "hl" : line === 4 ? "hl" : null;
  const den: Part = line === 4 ? "hl" : null;
  return (
    <>
      <Graph
        left={left}
        overlay={(s) => (
          <PlotLabel scale={s} x={X0 - 0.15} y={h(X0) + 1.4} size={64} color={C.deriv} opacity={q}>
            ?
          </PlotLabel>
        )}
      >
        {(s) => (
          <g>
            <g opacity={pair}>
              <Segment scale={s} x1={X0} y1={h(X0)} x2={XB} y2={h(X0)} color={colors.muted} width={3} dashed />
              <Segment scale={s} x1={XB} y1={h(X0)} x2={XB} y2={h(XB)} color={C.num} width={10} opacity={rise} />
              <Segment scale={s} x1={X0} y1={h(X0)} x2={XB} y2={h(X0)} color={C.den} width={10} opacity={run} />
              <Point scale={s} x={XB} y={h(XB)} color={C.x} />
            </g>
            <Point scale={s} x={X0} y={h(X0)} color={C.deriv} opacity={fadeIn(f, L[0])} />
          </g>
        )}
      </Graph>
      <DefCard pos={line >= 5} num={num} den={den} opacity={def} />
      <WhyLens o={lens} right={HIDDEN} left={HIDDEN} />
    </>
  );
};

export const Beat07: React.FC<BeatProps> = ({ L }) => {
  const f = useCurrentFrame();
  const line = lineAt(f, L); // 1..8
  const leftSide = line >= 5;
  const right: SideState = {
    o: fadeIn(f, L[0]) * (1 - 0.65 * fadeIn(f, L[4])),
    run: fadeIn(f, L[1]),
    rise: fadeIn(f, L[2]),
    arrow: fadeIn(f, L[3]),
    signs: leftSide ? 0 : 1,
  };
  const left: SideState = leftSide
    ? { o: fadeIn(f, L[4] + 4), run: fadeIn(f, L[5]), rise: fadeIn(f, L[5] + 8), arrow: fadeIn(f, L[6]), signs: 1 - fadeIn(f, L[7]) }
    : HIDDEN;
  const den: Part = line >= 2 && line <= 4 ? "+" : line === 6 || line === 7 ? "-" : null;
  const num: Part = line >= 3 && line <= 4 ? "+" : line === 6 || line === 7 ? "-" : null;
  return (
    <>
      <Graph left={GPOS.left}>
        {(s) => (
          <>
            <Point scale={s} x={X0} y={h(X0)} color={C.deriv} />
            <CurveArrow s={s} x={X0} color={C.up} opacity={fadeIn(f, L[7] + 4)} len={90} off={34} />
          </>
        )}
      </Graph>
      <DefCard pos num={num} den={den} opacity={1} />
      <WhyLens o={1} right={right} left={left} />
    </>
  );
};

// =====================================================================
// b08 BẢN CHẤT — mọi điểm đạo hàm dương: bậc nào cũng lên ⇒ cả khoảng cao dần
// =====================================================================
const ARROW_XS = [1.15, 1.4, 1.65, 1.9, 2.15, 2.4, 2.65, 2.88];
const STEPS = 8;
const stairX = (i: number) => 1 + (2 * i) / STEPS;

export const Beat08: React.FC<BeatProps> = ({ L, E }) => {
  const f = useCurrentFrame();
  const mix = ramp(f, 0, 18);
  const left = lerp(GPOS.left, GPOS.center, mix);
  const climb = interpolate(f, [L[1] + 6, E[1] - 30], [0, STEPS], clamp);
  const ends = fadeIn(f, E[1] - 30, 12);
  const step = Math.min(STEPS - 1, Math.floor(climb));
  const frac = climb - step;
  const dx = Math.min(1, frac * 1.6);
  const xa = stairX(step);
  const xb = stairX(step + 1);
  const droneX = lerp(xa, xb, dx);
  const droneY = frac > 0.62 || climb >= STEPS ? h(xb) : h(xa);
  const droneO = fadeIn(f, L[1] + 2, 8) * (1 - fadeIn(f, E[1] - 30, 10));
  return (
    <>
      <Graph
        left={left}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={1.05} y={0.75} anchor="right" color={C.up} opacity={ends}>
              thấp
            </PlotLabel>
            <PlotLabel scale={s} x={2.95} y={0.75} anchor="left" color={C.up} opacity={ends}>
              cao
            </PlotLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <AxisPart s={s} a={1} b={3} color={C.up} opacity={fadeIn(f, L[0]) * 0.6} />
            {ARROW_XS.map((x, i) => (
              <CurveArrow key={x} s={s} x={x} color={C.up} opacity={fadeIn(f, L[0] + 6 + i * 4, 8) * (1 - 0.6 * fadeIn(f, L[1]))} len={44} off={30} />
            ))}
            {Array.from({ length: STEPS }, (_, i) => {
              const o = interpolate(climb, [i, i + 0.4], [0, 1], clamp);
              const a = stairX(i);
              const bb = stairX(i + 1);
              return o > 0 ? (
                <g key={i} opacity={o} stroke={C.up} strokeWidth={6} strokeLinecap="round">
                  <line x1={s.x(a)} y1={s.y(h(a))} x2={s.x(bb)} y2={s.y(h(a))} />
                  <line x1={s.x(bb)} y1={s.y(h(a))} x2={s.x(bb)} y2={s.y(h(bb))} />
                </g>
              ) : null;
            })}
            <Col s={s} x={1.05} color={C.up} opacity={ends} width={8} />
            <Col s={s} x={2.95} color={C.up} opacity={ends} width={8} />
          </>
        )}
      </Graph>
      <Drone x={left + GS.x(droneX)} y={G.top + GS.y(droneY + 0.45)} w={140} spin={f * 0.9} opacity={droneO} />
    </>
  );
};

// =====================================================================
// b08 CÔNG THỨC — định lý trong sách, giải phẫu từng cụm
// =====================================================================
const Hi: React.FC<{ on: number; dim: boolean; color: string; children: React.ReactNode }> = ({ on, dim, color, children }) => (
  <span
    style={{
      color: on > 0 ? color : colors.text,
      background: on > 0 ? tint(color, 0.14 * on) : undefined,
      borderRadius: 10,
      padding: "0 6px",
      opacity: dim && on <= 0 ? 0.4 : 1,
    }}
  >
    {children}
  </span>
);

const TheoremCard: React.FC<{ hl: number; neg: number; opacity: number }> = ({ hl, neg, opacity }) => {
  const dim = hl > 0;
  const p: React.CSSProperties = { ...label, fontSize: 40, lineHeight: 1.55, marginTop: 10 };
  return (
    <PanelCard top={175} opacity={opacity} group="theorem">
      <div data-box>
        <div data-text="th" style={{ ...label, color: colors.muted, textAlign: "center" }}>
          định lý
        </div>
        <div data-text="p" style={{ ...p, opacity: dim ? 0.4 : 1 }}>
          <MathText text="Cho $f$ có đạo hàm trên khoảng $K$." />
        </div>
        <div data-text="p" style={p}>
          <Hi on={0} dim={dim} color={C.up}>
            Nếu
          </Hi>
          <Hi on={hl === 1 ? 1 : 0} dim={dim} color={C.up}>
            <Tex tex="f'(x) > 0" />
          </Hi>
          <Hi on={hl === 2 ? 1 : 0} dim={dim} color={C.x0}>
            <MathText text="với mọi $x \in K$" />
          </Hi>
          <Hi on={0} dim={dim} color={C.up}>
            thì
          </Hi>
          <Hi on={hl === 3 ? 1 : 0} dim={dim} color={C.up}>
            <MathText text="$f$ đồng biến trên $K$" />
          </Hi>
          .
        </div>
        <div data-text="p" style={p}>
          <Hi on={neg} dim={dim} color={C.down}>
            <MathText text="Nếu $f'(x) < 0$ với mọi $x \in K$ thì $f$ nghịch biến trên $K$." />
          </Hi>
        </div>
      </div>
    </PanelCard>
  );
};

export const Beat09: React.FC<BeatProps> = ({ L, E }) => {
  const f = useCurrentFrame();
  const line = lineAt(f, L);
  const mix = ramp(f, 0, 18);
  const left = lerp(GPOS.center, GPOS.left, mix);
  const negAt = Math.round((L[3] + E[3]) / 2);
  const neg = fadeIn(f, negAt);
  const hl = line <= 1 ? 0 : line === 2 ? 1 : line === 3 ? 2 : f < negAt ? 3 : 0;
  return (
    <>
      <Graph left={left}>
        {(s) => (
          <>
            <AxisPart s={s} a={1} b={3} color={C.x0} opacity={line === 3 ? fadeIn(f, L[2]) : 0} />
            {ARROW_XS.map((x) => (
              <CurveArrow key={x} s={s} x={x} color={C.up} opacity={x === 1.9 && line === 2 ? 1 : 0.3} len={44} off={30} />
            ))}
            <CurvePart s={s} a={1} b={3} color={C.up} opacity={line >= 4 ? fadeIn(f, L[3]) : 0} />
            <CurvePart s={s} a={0} b={1} color={C.down} opacity={neg} />
            <CurvePart s={s} a={3} b={4} color={C.down} opacity={neg} />
          </>
        )}
      </Graph>
      <TheoremCard hl={hl} neg={neg} opacity={fadeIn(f, L[0])} />
    </>
  );
};

// =====================================================================
// b09 VÍ DỤ — tính f'(x), phân tích nhân tử, kết quả dấu (không dùng bảng xét dấu)
// =====================================================================
const CalcRow: React.FC<{ o: number; color?: string; size?: number; children: React.ReactNode }> = ({ o, color = colors.text, size = 44, children }) =>
  o <= 0 ? null : (
    <div data-text="formula" style={{ textAlign: "center", fontSize: size, color, opacity: o, marginTop: 14, whiteSpace: "nowrap" }}>
      {children}
    </div>
  );

const CalcCard: React.FC<{ factored: number; pos: number; neg: number; opacity?: number }> = ({ factored, pos, neg, opacity = 1 }) => (
  <PanelCard top={175} opacity={opacity} group="calc">
    <div data-box>
      <div data-text="formula" style={{ textAlign: "center", fontSize: 48, height: 70, position: "relative" }}>
        <div style={{ position: "absolute", inset: 0, opacity: 1 - factored }}>
          <Tex tex="f'(x) = -3x^2 + 12x - 9" />
        </div>
        <div style={{ position: "absolute", inset: 0, opacity: factored }}>
          <Tex tex={`f'(x) = -3(x-${col(C.deriv, "1")})(x-${col(C.deriv, "3")})`} />
        </div>
      </div>
      <CalcRow o={pos} color={C.up}>
        <MathText text="$f' > 0$ trên $(1; 3)$" />
      </CalcRow>
      <CalcRow o={neg} color={C.down}>
        <MathText text="$f' < 0$ trên $(0; 1)$, $(3; 4)$" />
      </CalcRow>
    </div>
  </PanelCard>
);

export const Beat10: React.FC<BeatProps> = ({ L }) => {
  const f = useCurrentFrame();
  const card = fadeIn(f, L[0]);
  const factored = fadeIn(f, L[1], 10);
  const pos = fadeIn(f, L[2]);
  const neg = fadeIn(f, L[3]);
  return (
    <>
      <Graph left={GPOS.left}>
        {(s) => (
          <>
            <CurvePart s={s} a={1} b={3} color={C.up} opacity={pos} />
            <CurvePart s={s} a={0} b={1} color={C.down} opacity={neg} />
            <CurvePart s={s} a={3} b={4} color={C.down} opacity={neg} />
            <AxisDot s={s} x={1} color={C.deriv} opacity={factored} />
            <AxisDot s={s} x={3} color={C.deriv} opacity={factored} />
          </>
        )}
      </Graph>
      <CalcCard factored={factored} pos={pos} neg={neg} opacity={card} />
    </>
  );
};

// =====================================================================
// b10 TRỰC GIÁC — f' = 0 tại 1 và 3: đáy, đỉnh, cực trị (bài sau)
// =====================================================================
export const Beat11: React.FC<BeatProps> = ({ L }) => {
  const f = useCurrentFrame();
  const zeros = fadeIn(f, L[0]);
  const names = fadeIn(f, L[1]);
  const extreme = fadeIn(f, L[2], 10);
  return (
    <>
      <Graph
        left={GPOS.left}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={1} y={1.0} color={C.deriv} opacity={names * (1 - extreme)}>
              đáy ↓↑
            </PlotLabel>
            <PlotLabel scale={s} x={1} y={1.0} color={C.deriv} opacity={extreme}>
              cực trị
            </PlotLabel>
            <PlotLabel scale={s} x={2.88} y={6.85} anchor="right" color={C.deriv} opacity={names * (1 - extreme)}>
              đỉnh ↑↓
            </PlotLabel>
            <PlotLabel scale={s} x={2.88} y={6.85} anchor="right" color={C.deriv} opacity={extreme}>
              cực trị
            </PlotLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <CurvePart s={s} a={0} b={1} color={C.down} />
            <CurvePart s={s} a={1} b={3} color={C.up} />
            <CurvePart s={s} a={3} b={4} color={C.down} />
            <TangentLine scale={s} x0={1} y0={h(1)} slope={0} halfLengthPx={70} color={C.deriv} opacity={zeros} />
            <TangentLine scale={s} x0={3} y0={h(3)} slope={0} halfLengthPx={70} color={C.deriv} opacity={zeros} />
            <Point scale={s} x={1} y={h(1)} color={C.deriv} opacity={zeros} />
            <Point scale={s} x={3} y={h(3)} color={C.deriv} opacity={zeros} />
          </>
        )}
      </Graph>
      <CalcCard factored={1} pos={1} neg={1} />
    </>
  );
};

// =====================================================================
// CẢNH 3 — hai tầng chung trục ngang: con đường (trên), đạo hàm (dưới)
// =====================================================================
const TIER = { left: 470, width: 1000 };
const TOP_T = { top: 150, height: 200 };
const BOT_T = { top: 440, height: 250 };

type TierCfg = { yMin: number; yMax: number; yTicks: number[]; label: string };

const Tiers: React.FC<{
  xMin: number;
  xMax: number;
  xTicks: number[];
  top: TierCfg;
  bot: TierCfg;
  topLayer?: (s: Scale) => React.ReactNode;
  botLayer?: (s: Scale) => React.ReactNode;
  topOverlay?: (s: Scale) => React.ReactNode;
  guides?: { x: number; o: number }[];
}> = ({ xMin, xMax, xTicks, top, bot, topLayer, botLayer, topOverlay, guides = [] }) => {
  const st = makeScale({ xMin, xMax, yMin: top.yMin, yMax: top.yMax, width: TIER.width, height: TOP_T.height });
  const sb = makeScale({ xMin, xMax, yMin: bot.yMin, yMax: bot.yMax, width: TIER.width, height: BOT_T.height });
  return (
    <>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        {guides.map((gd) =>
          gd.o > 0 ? (
            <line
              key={gd.x}
              x1={TIER.left + st.x(gd.x)}
              x2={TIER.left + st.x(gd.x)}
              y1={TOP_T.top}
              y2={BOT_T.top + BOT_T.height}
              stroke={colors.muted}
              strokeWidth={3}
              strokeDasharray="8 8"
              opacity={gd.o * 0.7}
            />
          ) : null,
        )}
      </svg>
      <Plot
        scale={st}
        left={TIER.left}
        top={TOP_T.top}
        overlay={
          <>
            <PlotLabel scale={st} x={xMin} y={top.yMax} dx={-26} dy={-34} anchor="right">
              <MathText text={top.label} />
            </PlotLabel>
            <PlotLabel scale={st} x={xMax} y={0} dx={34} anchor="left">
              <MathText text="$x$" />
            </PlotLabel>
            {topOverlay ? topOverlay(st) : null}
          </>
        }
      >
        <Axes scale={st} xTicks={xTicks} yTicks={top.yTicks} xLabel="" yLabel="" />
        {topLayer ? topLayer(st) : null}
      </Plot>
      <Plot
        scale={sb}
        left={TIER.left}
        top={BOT_T.top}
        overlay={
          <>
            <PlotLabel scale={sb} x={xMin} y={bot.yMax} dx={-26} dy={-44} anchor="right">
              <MathText text={bot.label} />
            </PlotLabel>
            <PlotLabel scale={sb} x={xMax} y={0} dx={34} anchor="left">
              <MathText text="$x$" />
            </PlotLabel>
          </>
        }
      >
        <Axes scale={sb} xTicks={xTicks} yTicks={bot.yTicks} xLabel="" yLabel="" />
        {botLayer ? botLayer(sb) : null}
      </Plot>
    </>
  );
};

// =====================================================================
// b11 TRONG ĐỀ THI — vẽ f' dưới sườn đồi: trên trục ↔ leo, dưới trục ↔ hạ
// =====================================================================
export const Beat12: React.FC<BeatProps> = ({ L, T0 }) => {
  const f = useCurrentFrame();
  const a0 = Math.max(L[0], T0);
  const draw = ramp(f, a0, a0 + 40, Easing.inOut(Easing.quad));
  const upO = fadeIn(f, L[1]);
  const downO = fadeIn(f, L[2]);
  return (
    <>
      <Tiers
        xMin={0}
        xMax={4.4}
        xTicks={[1, 2, 3, 4]}
        top={{ yMin: 0, yMax: 7.5, yTicks: [2, 4, 6], label: "$f(x)$" }}
        bot={{ yMin: -9.5, yMax: 4.2, yTicks: [-9, -6, -3, 3], label: "$f'(x)$" }}
        guides={[
          { x: 1, o: upO },
          { x: 3, o: upO },
        ]}
        topLayer={(s) => (
          <>
            <FunctionPlot scale={s} f={h} from={0} to={4} />
            <CurvePart s={s} a={1} b={3} color={C.up} opacity={upO} />
            <CurvePart s={s} a={0} b={1} color={C.down} opacity={downO} />
            <CurvePart s={s} a={3} b={4} color={C.down} opacity={downO} />
          </>
        )}
        botLayer={(s) => (
          <>
            <FunctionPlot scale={s} f={hp} from={0} to={4} progress={draw} color={colors.accent} />
            <FunctionPlot scale={s} f={hp} from={1} to={3} color={C.up} width={10} opacity={upO} />
            <FunctionPlot scale={s} f={hp} from={0} to={1} color={C.down} width={10} opacity={downO} />
            <FunctionPlot scale={s} f={hp} from={3} to={4} color={C.down} width={10} opacity={downO} />
            <Point scale={s} x={2} y={3} color={C.deriv} opacity={ramp(f, a0 + 30, a0 + 40)} />
          </>
        )}
      />
      <Badge x={TIER.left + TIER.width} y={118} text="mô hình" />
    </>
  );
};

// =====================================================================
// b12 TRONG ĐỀ THI — đề khác cho đồ thị f': đọc dấu, rồi vẽ f để so sánh từng khoảng
// =====================================================================
const fp = (x: number) => (x + 2) * (x - 1) * (x - 3);
const F = (x: number) => x ** 4 / 4 - (2 * x ** 3) / 3 - (5 * x ** 2) / 2 + 6 * x;
const EX = { xMin: -2.8, xMax: 3.8 };

/** So sánh hai điểm trên đồ thị f: kẻ ngang từ điểm trái, mũi tên dọc tới điểm phải. */
const Compare: React.FC<{ s: Scale; a: number; b: number; color: string; o: number }> = ({ s, a, b, color, o }) =>
  o <= 0 ? null : (
    <g opacity={o}>
      <Segment scale={s} x1={a} y1={F(a)} x2={b} y2={F(a)} color={colors.muted} width={3} dashed />
      <Segment scale={s} x1={b} y1={F(a)} x2={b} y2={F(b)} color={color} width={8} />
      <Point scale={s} x={a} y={F(a)} r={10} color={colors.text} />
      <Point scale={s} x={b} y={F(b)} r={10} color={color} />
    </g>
  );

export const Beat13: React.FC<BeatProps> = ({ L, T0 }) => {
  const f = useCurrentFrame();
  const a0 = Math.max(L[0], T0);
  const draw = ramp(f, a0 + 4, a0 + 44, Easing.inOut(Easing.quad));
  const roots = fadeIn(f, a0 + 40);
  const p1 = ramp(f, L[1], L[1] + 30);
  const cmp1 = fadeIn(f, L[2]) * (1 - fadeIn(f, L[4]));
  const p2 = ramp(f, L[3], L[3] + 30);
  const cmp2 = fadeIn(f, L[3] + 30) * (1 - fadeIn(f, L[4]));
  const p3 = ramp(f, L[4], L[4] + 30);
  const q = 1 - fadeIn(f, L[1]);
  return (
    <>
      <Tiers
        xMin={EX.xMin}
        xMax={EX.xMax}
        xTicks={[-2, -1, 1, 2, 3]}
        top={{ yMin: -14, yMax: 5, yTicks: [-10, -5], label: "$f$" }}
        bot={{ yMin: -13, yMax: 10, yTicks: [-10, -5], label: "$f'(x)$" }}
        guides={[
          { x: -2, o: p1 },
          { x: 1, o: p1 },
          { x: 3, o: p2 },
        ]}
        topOverlay={(s) => (
          <PlotLabel scale={s} x={0.2} y={-6} size={72} color={colors.muted} opacity={q}>
            ?
          </PlotLabel>
        )}
        topLayer={(s) => (
          <>
            <FunctionPlot scale={s} f={F} from={-2} to={1} progress={p1} color={C.up} width={7} />
            <FunctionPlot scale={s} f={F} from={1} to={3} progress={p2} color={C.down} width={7} />
            <FunctionPlot scale={s} f={F} from={-2} to={EX.xMin} progress={p3} color={C.down} width={7} />
            <FunctionPlot scale={s} f={F} from={3} to={EX.xMax} progress={p3} color={C.up} width={7} />
            <Compare s={s} a={-1} b={0.5} color={C.up} o={cmp1} />
            <Compare s={s} a={1.5} b={2.5} color={C.down} o={cmp2} />
          </>
        )}
        botLayer={(s) => (
          <>
            <FunctionPlot scale={s} f={fp} from={EX.xMin} to={EX.xMax} progress={draw} color={colors.accent} />
            <FunctionPlot scale={s} f={fp} from={-2} to={1} color={C.up} width={10} opacity={fadeIn(f, L[1])} />
            <FunctionPlot scale={s} f={fp} from={1} to={3} color={C.down} width={10} opacity={fadeIn(f, L[3])} />
            <FunctionPlot scale={s} f={fp} from={EX.xMin} to={-2} color={C.down} width={10} opacity={fadeIn(f, L[4])} />
            <FunctionPlot scale={s} f={fp} from={3} to={EX.xMax} color={C.up} width={10} opacity={fadeIn(f, L[4])} />
            {[-2, 1, 3].map((r) => (
              <Point key={r} scale={s} x={r} y={0} r={9} color={colors.text} opacity={roots} />
            ))}
          </>
        )}
      />
      <Tag x={TIER.left + ((0.2 - EX.xMin) / (EX.xMax - EX.xMin)) * TIER.width + 60} y={TOP_T.top + 120} anchor="left" color={colors.muted} opacity={q * 0.9}>
        con đường khác
      </Tag>
      <Badge x={TIER.left + TIER.width} y={118} text="đề bài" color={colors.warn} />
    </>
  );
};

// =====================================================================
// b13 GIẢI ĐÁP — quay lại flycam: tính f', xét dấu, ra lệnh bay
// =====================================================================
const Row: React.FC<{ o: number; color?: string; size?: number; weight?: number; children: React.ReactNode }> = ({ o, color = colors.text, size = 40, weight = 700, children }) => (
  <div data-text="td" style={{ ...label, fontSize: size, fontWeight: weight, color, opacity: o, marginTop: 12, whiteSpace: "nowrap" }}>
    {children}
  </div>
);

export const Beat14: React.FC<BeatProps> = ({ L, E, T0 }) => {
  const f = useCurrentFrame();
  const a0 = Math.max(L[0], T0);
  const r1 = fadeIn(f, a0);
  const r2 = fadeIn(f, L[1]);
  const r3 = fadeIn(f, L[2]);
  const flyStart = L[2] + 20;
  const flyEnd = E[2] + 6;
  const x = interpolate(f, [flyStart, flyEnd], [0.3, 3.4], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const segs = [
    { a: 0, b: 1, color: C.down, opacity: r3 },
    { a: 1, b: 3, color: C.up, opacity: r3 },
    { a: 3, b: 4, color: C.down, opacity: r3 },
  ];
  return (
    <>
      <Hill mix={1} segments={segs} />
      <HillDrone mix={1} x={x} spin={f * 0.9} gauge={1} showLabel={false} />
      <Badge x={hillLeft(1) + 30} y={HILL.top - 30} text="mô hình" anchor="left" />
      <Card group="program" style={{ left: 1290, top: 190, width: 540, padding: "20px 30px" }}>
        <div data-box>
          <div data-text="th" style={{ ...label, color: colors.muted }}>
            chương trình
          </div>
          <Row o={r1}>
            <MathText text="1. tính $f'(x)$" />
          </Row>
          <Row o={r1}>2. xét dấu</Row>
          <Row o={r2} color={colors.accent}>
            <MathText text="$f' > 0$ ⇒ trước cao hơn" />
          </Row>
          <Row o={r3} color={C.up} size={44} weight={800}>
            <MathText text="$(1; 3)$: bay lên" />
          </Row>
          <Row o={r3} color={C.down} size={44} weight={800}>
            <MathText text="$(0; 1), (3; 4)$: hạ" />
          </Row>
        </div>
      </Card>
    </>
  );
};
