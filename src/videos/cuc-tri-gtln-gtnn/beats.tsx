import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BeatProps, clamp, ramp } from "../../components/BeatShell";
import { Card } from "../../components/Card";
import { Drone } from "../../components/Drone";
import { MathText, Tex } from "../../components/MathText";
import { Hi, PanelCard, Pill, Tag, fadeIn, label, lerp, lineAt } from "../../components/parts";
import { Axes, CurveArrow, FunctionPlot, Plot, PlotLabel, Point, Scale, Segment, TangentLine } from "../../components/plot";
import { colors, fontText } from "../../components/theme";
import { ZoomInset } from "../../components/ZoomInset";
import {
  A,
  AxisPart,
  B,
  C,
  Col,
  Cross,
  CurvePart,
  FixedDrone,
  FlightLine,
  G,
  GPOS,
  Graph,
  HILL,
  HS,
  Hill,
  MapCard,
  PANEL,
  QS,
  RS,
  Ring,
  f,
  fp,
  g,
  gp,
  hillLeft,
} from "./scene";

/** Nhãn trong thẻ: một hàng chữ có thể chứa $...$. */
const Row: React.FC<{ o?: number; color?: string; size?: number; weight?: number; mt?: number; children: React.ReactNode }> = ({
  o = 1,
  color = colors.text,
  size = 38,
  weight = 600,
  mt = 10,
  children,
}) =>
  o <= 0 ? null : (
    <div data-text="td" style={{ ...label, fontSize: size, fontWeight: weight, color, opacity: o, marginTop: mt, lineHeight: 1.45 }}>
      {children}
    </div>
  );

const Head: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div data-text="th" style={{ ...label, color: colors.muted, textAlign: "center", marginBottom: 4 }}>
    {children}
  </div>
);

// =====================================================================
// b01 HIỆN TƯỢNG — bay ở một độ cao cố định: phải cao hơn chỗ cao nhất. Ở đâu?
// =====================================================================
export const Beat01: React.FC<BeatProps> = ({ L, E }) => {
  const fr = useCurrentFrame();
  const mix = ramp(fr, L[2], L[2] + 20);
  const x = interpolate(fr, [L[0] + 4, E[1]], [3.8, -0.7], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const flyO = 1 - fadeIn(fr, L[2], 14);
  const line = fadeIn(fr, L[0], 10) * flyO;
  const peak = fadeIn(fr, L[1]) * (1 - fadeIn(fr, L[2], 10));
  const pulse = 1 + 0.25 * Math.sin((fr - L[1]) / 4);
  const card = fadeIn(fr, L[2] + 8, 14);
  const q = fadeIn(fr, L[3], 12);
  return (
    <>
      <Hill mix={mix} faint={mix}>
        {(s) => (peak > 0 ? <circle cx={s.x(A)} cy={s.y(f(A))} r={14 * pulse} fill={C.max} opacity={peak} /> : null)}
      </Hill>
      <FlightLine mix={mix} opacity={line} />
      <FixedDrone mix={mix} x={x} spin={fr * 0.9} gauge={1} opacity={flyO} />
      <Tag x={hillLeft(mix) + HS.x(-1.06) - 14} y={HILL.top + HS.y(f(A)) - 24} anchor="right" color={C.max} weight={700} opacity={peak}>
        chỗ cao nhất?
      </Tag>
      <MapCard left={1270} top={300} width={560} opacity={card} />
      <Tag x={1550} y={165} size={84} weight={800} color={colors.accent} opacity={q}>
        ?
      </Tag>
    </>
  );
};

// =====================================================================
// b02 TRỰC GIÁC — bài trước: f' > 0 lên, f' < 0 xuống. Còn f' = 0? Đáy, đỉnh
// =====================================================================
export const Beat02: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const axes = fadeIn(fr, 0, 14);
  const draw = ramp(fr, L[0] + 4, L[0] + 50, Easing.inOut(Easing.quad));
  const up = fadeIn(fr, L[1]);
  const down = fadeIn(fr, L[2]);
  const pts = fadeIn(fr, L[3]);
  const names = fadeIn(fr, L[4]);
  const q = pts * (1 - names);
  return (
    <Graph
      left={GPOS.center}
      axes={axes}
      curve={draw}
      overlay={(s) => (
        <>
          <PlotLabel scale={s} x={2} y={9} color={C.up} opacity={up}>
            <MathText text="$f' > 0$" />
          </PlotLabel>
          <PlotLabel scale={s} x={-0.75} y={6.5} color={C.down} opacity={down}>
            <MathText text="$f' < 0$" />
          </PlotLabel>
          <PlotLabel scale={s} x={3.75} y={8.2} color={C.down} opacity={down}>
            <MathText text="$f' < 0$" />
          </PlotLabel>
          <PlotLabel scale={s} x={1} y={6} size={56} color={C.deriv} opacity={q}>
            ?
          </PlotLabel>
          <PlotLabel scale={s} x={3} y={10} size={56} color={C.deriv} opacity={q}>
            ?
          </PlotLabel>
          <PlotLabel scale={s} x={1} y={6} color={C.deriv} opacity={names}>
            đáy
          </PlotLabel>
          <PlotLabel scale={s} x={3} y={10} color={C.deriv} opacity={names}>
            đỉnh
          </PlotLabel>
        </>
      )}
    >
      {(s) => (
        <>
          <CurvePart s={s} a={1} b={3} color={C.up} opacity={up} />
          <CurvePart s={s} a={A} b={1} color={C.down} opacity={down} />
          <CurvePart s={s} a={3} b={B} color={C.down} opacity={down} />
          <Point scale={s} x={1} y={2} color={C.deriv} opacity={pts} />
          <Point scale={s} x={3} y={6} color={C.deriv} opacity={pts} />
        </>
      )}
    </Graph>
  );
};

// =====================================================================
// b03 ĐỊNH NGHĨA — cực đại: cao hơn mọi điểm ở sát hai bên (giải phẫu)
// =====================================================================
const H = 0.8; // khoảng sát hai bên: (3 - 0,8; 3 + 0,8) = (2,2; 3,8)

const DefMaxCard: React.FC<{ hl: number; opacity: number }> = ({ hl, opacity }) => {
  const dim = hl > 0;
  return (
    <PanelCard top={170} left={PANEL.left} width={PANEL.width} opacity={opacity} group="def">
      <div data-box>
        <Head>định nghĩa</Head>
        <Row mt={6}>
          <Hi on={0} dim={dim} color={C.deriv}>
            <MathText text="Nếu tồn tại số $h > 0$ sao cho" />
          </Hi>
        </Row>
        <Row mt={6}>
          <Hi on={hl === 3 ? 1 : 0} dim={dim} color={C.below}>
            <Tex tex="f(x) < f(x_0)" />
          </Hi>{" "}
          <Hi on={0} dim={dim} color={C.deriv}>
            với mọi
          </Hi>
        </Row>
        <Row mt={6}>
          <Hi on={hl === 2 ? 1 : 0} dim={dim} color={C.span}>
            <Tex tex="x \in (x_0 - h;\, x_0 + h)" />
          </Hi>
          <Hi on={0} dim={dim} color={C.deriv}>
            <MathText text=", $x \ne x_0$" />
          </Hi>
        </Row>
        <Row mt={6}>
          <Hi on={0} dim={dim} color={C.deriv}>
            <MathText text="thì $f$ đạt cực đại tại" />
          </Hi>{" "}
          <Hi on={hl === 1 ? 1 : 0} dim={dim} color={C.deriv}>
            <Tex tex="x_0" />
          </Hi>
          .
        </Row>
      </div>
    </PanelCard>
  );
};

export const Beat03: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const line = lineAt(fr, L);
  const mix = ramp(fr, 0, 18);
  const left = lerp(GPOS.center, GPOS.left, mix);
  const near = fadeIn(fr, L[0]);
  const card = fadeIn(fr, L[1]);
  const x0 = fadeIn(fr, L[2]);
  const span = fadeIn(fr, L[3]);
  const below = line === 5 ? 1 : 0;
  const maxName = fadeIn(fr, L[5]);
  const minAll = fadeIn(fr, L[6]);
  const hl = line === 3 ? 1 : line === 4 ? 2 : line === 5 ? 3 : 0;
  return (
    <>
      <Graph
        left={left}
        hideX={x0 > 0 ? [3] : []}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={3} y={0} dy={16} anchor="top" color={C.deriv} size={28} opacity={x0}>
              3
            </PlotLabel>
            <PlotLabel scale={s} x={3 - H - 0.16} y={6} anchor="right" color={C.below} opacity={fadeIn(fr, L[4])}>
              6
            </PlotLabel>
            <PlotLabel scale={s} x={3} y={10} color={C.deriv} opacity={1 - maxName}>
              đỉnh
            </PlotLabel>
            <PlotLabel scale={s} x={3} y={10} color={C.deriv} opacity={maxName}>
              cực đại
            </PlotLabel>
            <PlotLabel scale={s} x={1} y={6} color={C.deriv} opacity={1 - minAll}>
              đáy
            </PlotLabel>
            <PlotLabel scale={s} x={1} y={6} color={C.deriv} opacity={minAll}>
              cực tiểu
            </PlotLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <AxisPart s={s} a={3 - H} b={3 + H} color={C.span} opacity={span * (line === 4 ? 1 : 0.55)} />
            <Segment scale={s} x1={3 - H} y1={6} x2={3 + H} y2={6} color={C.below} width={4} dashed opacity={near * (below ? 1 : 0.7)} />
            <CurvePart s={s} a={3 - H} b={3 + H} color={C.below} width={below ? 12 : 9} opacity={near * (below ? 1 : 0.75)} />
            <Segment scale={s} x1={1 - H} y1={2} x2={1 + H} y2={2} color={C.below} width={4} dashed opacity={minAll * 0.7} />
            <CurvePart s={s} a={1 - H} b={1 + H} color={C.below} width={9} opacity={minAll * 0.75} />
            <Segment scale={s} x1={3} y1={-0.7} x2={3} y2={0.7} color={C.deriv} width={8} opacity={x0} />
            <Point scale={s} x={1} y={2} color={C.deriv} />
            <Point scale={s} x={3} y={6} color={C.deriv} />
          </>
        )}
      </Graph>
      <DefMaxCard hl={hl} opacity={card} />
    </>
  );
};

// =====================================================================
// b04, b05 BẢN CHẤT — vì sao tại đỉnh f' = 0: f' > 0 thì ngay bên phải cao hơn,
// f' < 0 thì ngay bên trái cao hơn ⇒ chưa phải đỉnh ⇒ tại đỉnh chỉ có thể f' = 0
// =====================================================================
const LENS = { left: PANEL.left, top: 512, w: PANEL.width, h: 200, z: 5 };
const PR = 2; // điểm trước đỉnh, f'(2) = 3
const PL = 3.5; // điểm sau đỉnh, f'(3,5) = -3,75

const RuleCard: React.FC<{ r1: number; r2: number }> = ({ r1, r2 }) => (
  <PanelCard top={120} left={PANEL.left} width={PANEL.width} group="rule">
    <div data-box>
      <Head>bài trước</Head>
      <div data-text="formula" style={{ textAlign: "center", fontSize: 36, whiteSpace: "nowrap" }}>
        <Tex tex="f'(x_0) = \lim\limits_{x \to x_0} \dfrac{f(x) - f(x_0)}{x - x_0}" />
      </div>
      <Row o={r1} color={C.up} weight={700} mt={4}>
        <MathText text="$f' > 0$: ngay bên phải cao hơn" />
      </Row>
      <Row o={r2} color={C.down} weight={700} mt={2}>
        <MathText text="$f' < 0$: ngay bên trái cao hơn" />
      </Row>
    </div>
  </PanelCard>
);

/** Trong ô kính lúp: điểm sát bên x1 cao hơn điểm đang soi x0 (đoạn ngang mờ, đoạn chênh, mũi tên ↑). */
const Higher: React.FC<{ s: Scale; x0: number; x1: number; color: string; o: number }> = ({ s, x0, x1, color, o }) => {
  if (o <= 0) return null;
  const y0 = f(x0);
  const y1 = f(x1);
  const tStyle = { fontFamily: fontText, fontWeight: 800, fontSize: 44, paintOrder: "stroke", stroke: colors.panel, strokeWidth: 7 } as const;
  return (
    <g opacity={o}>
      <line x1={s.x(x0)} y1={s.y(y0)} x2={s.x(x1)} y2={s.y(y0)} stroke={colors.muted} strokeWidth={3} strokeDasharray="8 6" />
      <line x1={s.x(x1)} y1={s.y(y0)} x2={s.x(x1)} y2={s.y(y1)} stroke={C.num} strokeWidth={8} />
      <circle data-mark="point" cx={s.x(x1)} cy={s.y(y1)} r={10} fill={color} stroke={colors.panel} strokeWidth={3} />
      <text data-text="sign" x={s.x(x1) + (x1 > x0 ? 40 : -40)} y={s.y(y1) + 4} textAnchor="middle" fill={color} {...tStyle}>
        ↑
      </text>
    </g>
  );
};

const Lens: React.FC<{ o: number; x0: number; children?: (s: Scale) => React.ReactNode }> = ({ o, x0, children }) =>
  o <= 0 ? null : (
    <ZoomInset base={RS} baseLeft={GPOS.left} baseTop={G.top} f={f} x0={x0} y0={f(x0)} z={LENS.z} left={LENS.left} top={LENS.top} width={LENS.w} height={LENS.h} opacity={o}>
      {children}
    </ZoomInset>
  );

const RuleCardFade: React.FC<{ o: number; r1: number; r2: number }> = ({ o, r1, r2 }) =>
  o <= 0 ? null : (
    <div style={{ position: "absolute", inset: 0, opacity: o }}>
      <RuleCard r1={r1} r2={r2} />
    </div>
  );

export const Beat04: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const q = fadeIn(fr, L[0]) * (1 - fadeIn(fr, L[2]));
  const card = fadeIn(fr, L[1]);
  const r1 = fadeIn(fr, L[2]);
  const pt = fadeIn(fr, L[3]);
  const lens = fadeIn(fr, L[4], 14);
  const mark = fadeIn(fr, L[4] + 14);
  const cross = fadeIn(fr, L[5]);
  return (
    <>
      <Graph
        left={GPOS.left}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={3} y={10} size={56} color={C.deriv} opacity={q}>
              ?
            </PlotLabel>
            <PlotLabel scale={s} x={PR} y={7.3} color={C.up} opacity={pt}>
              <MathText text="$f'(2) = 3$" />
            </PlotLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <Point scale={s} x={3} y={6} color={C.deriv} />
            <Point scale={s} x={PR} y={f(PR)} color={C.up} opacity={pt} />
            <Cross s={s} x={PR} y={f(PR)} opacity={cross} />
          </>
        )}
      </Graph>
      <RuleCardFade o={card} r1={r1} r2={0} />
      <Lens o={lens} x0={PR}>
        {(s) => (
          <>
            <Higher s={s} x0={PR} x1={PR + 0.1} color={C.up} o={mark} />
            <Cross s={s} x={PR} y={f(PR)} opacity={cross} size={18} />
          </>
        )}
      </Lens>
    </>
  );
};

export const Beat05: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const pt = fadeIn(fr, L[0]);
  const r2 = fadeIn(fr, L[1]);
  // kính lúp: ở 2 → trượt sang 3,5 (dòng 3) → trượt về đỉnh 3 (dòng 5) → tắt (dòng 7)
  const toPL = ramp(fr, L[2], L[2] + 20);
  const toTop = ramp(fr, L[4], L[4] + 20);
  const lx = toTop > 0 ? lerp(PL, 3, toTop) : lerp(PR, PL, toPL);
  const lensO = 1 - fadeIn(fr, L[6], 14);
  const markR = 1 - fadeIn(fr, L[2], 8);
  const markL = fadeIn(fr, L[2] + 20) * (1 - fadeIn(fr, L[4], 8));
  const crossL = fadeIn(fr, L[2] + 40);
  const line = lineAt(fr, L);
  const both = fadeIn(fr, L[3]);
  const crossR = line === 4 ? 1 : 0.4;
  const crossLO = crossL * (line >= 5 ? 0.4 : 1);
  const plLabel = pt * (1 - fadeIn(fr, L[4]));
  const topLabel = fadeIn(fr, L[4] + 16);
  const tan = fadeIn(fr, L[5]);
  const bottom = fadeIn(fr, L[6]);
  return (
    <>
      <Graph
        left={GPOS.left}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={PL} y={9.6} color={C.down} opacity={plLabel}>
              <MathText text="$f'(3{,}5) < 0$" />
            </PlotLabel>
            <PlotLabel scale={s} x={3} y={9.8} color={C.deriv} opacity={topLabel}>
              <MathText text="$f'(3) = 0$" />
            </PlotLabel>
            <PlotLabel scale={s} x={1} y={5.8} color={C.deriv} opacity={bottom}>
              <MathText text="$f'(1) = 0$" />
            </PlotLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <Point scale={s} x={3} y={6} color={C.deriv} />
            <Point scale={s} x={PR} y={f(PR)} color={C.up} opacity={0.5 + 0.5 * both} />
            <Cross s={s} x={PR} y={f(PR)} opacity={crossR} />
            <Point scale={s} x={PL} y={f(PL)} color={C.down} opacity={pt} />
            <Cross s={s} x={PL} y={f(PL)} opacity={crossLO} />
            <TangentLine scale={s} x0={3} y0={6} slope={0} halfLengthPx={80} color={C.deriv} width={6} opacity={tan} />
            <TangentLine scale={s} x0={1} y0={2} slope={0} halfLengthPx={80} color={C.deriv} width={6} opacity={bottom} />
            <Point scale={s} x={1} y={2} color={C.deriv} opacity={bottom} />
          </>
        )}
      </Graph>
      <RuleCard r1={1} r2={r2} />
      <Lens o={lensO} x0={lx}>
        {(s) => (
          <>
            <Higher s={s} x0={PR} x1={PR + 0.1} color={C.up} o={markR} />
            <Higher s={s} x0={PL} x1={PL - 0.1} color={C.down} o={markL} />
            <Cross s={s} x={PL} y={f(PL)} opacity={crossL * (1 - toTop)} size={18} />
            <TangentLine scale={s} x0={3} y0={6} slope={0} color={C.deriv} width={6} opacity={tan * toTop} />
          </>
        )}
      </Lens>
    </>
  );
};

// =====================================================================
// b06 CÔNG THỨC — f' đổi dấu từ + sang − thì cực đại (định lý), − sang + thì cực tiểu
// =====================================================================
const TheoremCard: React.FC<{ o: number; minRow: number }> = ({ o, minRow }) => (
  <PanelCard top={190} left={PANEL.left} width={PANEL.width} opacity={o} group="theorem">
    <div data-box>
      <Head>định lý</Head>
      <Row mt={6}>
        Nếu{" "}
        <Hi on={1} dim={false} color={C.up}>
          <MathText text="$f'(x) > 0$ trên $(a; x_0)$" />
        </Hi>
      </Row>
      <Row mt={6}>
        và{" "}
        <Hi on={1} dim={false} color={C.down}>
          <MathText text="$f'(x) < 0$ trên $(x_0; b)$" />
        </Hi>
      </Row>
      <Row mt={6}>
        <MathText text="thì $f$ đạt cực đại tại $x_0$." />
      </Row>
      <Row o={minRow} mt={18} weight={700} color={C.deriv}>
        <MathText text="Đổi dấu từ $-$ sang $+$: cực tiểu." />
      </Row>
    </div>
  </PanelCard>
);

export const Beat06: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const q = fadeIn(fr, L[0]) * (1 - fadeIn(fr, L[1]));
  const up = fadeIn(fr, L[1]);
  const down = fadeIn(fr, L[2]);
  const card = fadeIn(fr, L[3]);
  const minO = fadeIn(fr, L[4]);
  const words = 1 - minO;
  return (
    <>
      <Graph
        left={GPOS.left}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={3} y={10} size={56} color={C.deriv} opacity={q}>
              ?
            </PlotLabel>
            <PlotLabel scale={s} x={1.6} y={9.5} color={C.up} opacity={up * words}>
              <MathText text="trước 3: $f' > 0$" />
            </PlotLabel>
            <PlotLabel scale={s} x={3.85} y={9.5} color={C.down} opacity={down * words}>
              <MathText text="sau 3: $f' < 0$" />
            </PlotLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <CurvePart s={s} a={1} b={3} color={C.up} opacity={up} />
            <CurveArrow s={s} f={f} df={fp} x={2} color={C.up} opacity={up * words} len={60} off={30} />
            <CurvePart s={s} a={3} b={B} color={C.down} opacity={down} />
            <CurveArrow s={s} f={f} df={fp} x={3.55} color={C.down} opacity={down * words} len={60} off={30} />
            <CurvePart s={s} a={A} b={1} color={C.down} opacity={minO} />
            <Point scale={s} x={3} y={6} color={C.deriv} />
            <Point scale={s} x={1} y={2} color={C.deriv} opacity={0.4 + 0.6 * minO} />
          </>
        )}
      </Graph>
      <TheoremCard o={card} minRow={minO} />
    </>
  );
};

// =====================================================================
// b07 BẪY THƯỜNG GẶP — sườn dốc khác g: g'(2) = 0 nhưng không đổi dấu ⇒ không phải cực trị
// =====================================================================
export const Beat07: React.FC<BeatProps> = ({ L, T0 }) => {
  const fr = useCurrentFrame();
  const a0 = Math.max(L[0], T0);
  const axes = fadeIn(fr, a0, 12);
  const draw = ramp(fr, a0 + 4, a0 + 44, Easing.inOut(Easing.quad));
  const pt = fadeIn(fr, L[1]);
  const sides = fadeIn(fr, L[2]);
  const not = fadeIn(fr, L[3]);
  const s = QS;
  return (
    <Plot
      scale={s}
      left={GPOS.center}
      top={G.top}
      overlay={
        <>
          <PlotLabel scale={s} x={0} y={s.yMax} dx={22} dy={-26} anchor="left" opacity={axes}>
            <MathText text="độ cao $g(x)$" />
          </PlotLabel>
          <PlotLabel scale={s} x={2.2} y={0} dy={64} anchor="top" opacity={axes}>
            <MathText text="quãng bay ngang $x$" />
          </PlotLabel>
          <PlotLabel scale={s} x={0.15} y={15.2} anchor="left" opacity={axes}>
            <span style={{ display: "inline-flex", gap: 14, alignItems: "center" }}>
              <Pill text="sườn dốc khác" color={colors.warn} />
              <Tex tex="g(x) = x^3 - 6x^2 + 12x" />
            </span>
          </PlotLabel>
          <PlotLabel scale={s} x={3.4} y={2.6} color={C.up} opacity={sides}>
            <Tex tex="g'(x) = 3(x - 2)^2" />
          </PlotLabel>
          <PlotLabel scale={s} x={2} y={5.2} color={C.deriv} opacity={pt}>
            <MathText text="$g'(2) = 0$" />
          </PlotLabel>
          <PlotLabel scale={s} x={1.9} y={11} color={C.warn} opacity={not}>
            không phải cực trị
          </PlotLabel>
        </>
      }
    >
      <g opacity={axes}>
        <Axes scale={s} xTicks={[1, 2, 3, 4]} yTicks={[4, 8, 12, 16]} xLabel="" yLabel="" />
      </g>
      <FunctionPlot scale={s} f={g} from={0} to={4} progress={draw} />
      <CurvePart s={s} a={0} b={2} color={C.up} opacity={sides} fn={g} />
      <CurvePart s={s} a={2} b={4} color={C.up} opacity={sides} fn={g} />
      <CurveArrow s={s} f={g} df={gp} x={1} color={C.up} opacity={sides} len={60} off={30} />
      <CurveArrow s={s} f={g} df={gp} x={3} color={C.up} opacity={sides} len={60} off={30} />
      <TangentLine scale={s} x0={2} y0={8} slope={0} halfLengthPx={80} color={C.deriv} width={6} opacity={pt} />
      <Point scale={s} x={2} y={8} color={C.deriv} opacity={pt} />
    </Plot>
  );
};

// =====================================================================
// b08 GỐC RỄ — lấy đỉnh (cao 6) làm chỗ cao nhất, bay ở 8 → đâm vào sườn đầu tuyến
// =====================================================================
const FLY = 8;
const DRONE_W = 140;
/** Nửa bề ngang thân flycam (đơn vị toán). */
const HALF = ((60 / 286) * DRONE_W * 1.3) / RS.sx;
/** Chỗ mặt đất cao bằng đường bay (bên trái): f(x) = 8 tại x ≈ -0,196. */
const HIT = (() => {
  let lo = -1;
  let hi = 0;
  for (let i = 0; i < 60; i++) {
    const m = (lo + hi) / 2;
    if (f(m) > FLY) lo = m;
    else hi = m;
  }
  return (lo + hi) / 2;
})();
const CRASH_X = HIT + HALF;

export const Beat08: React.FC<BeatProps> = ({ L, E }) => {
  const fr = useCurrentFrame();
  const top = fadeIn(fr, L[0]);
  const line = fadeIn(fr, L[1]);
  const labels = 1 - fadeIn(fr, L[2], 10);
  const flyEnd = Math.min(E[2] - 16, L[2] + 60);
  const x = interpolate(fr, [L[2] + 4, flyEnd], [4.25, CRASH_X], { ...clamp, easing: Easing.in(Easing.quad) });
  const crashed = fr >= flyEnd;
  const shake = crashed ? Math.sin((fr - flyEnd) * 2.2) * Math.max(0, 8 - (fr - flyEnd) * 0.6) : 0;
  const warn = crashed ? fadeIn(fr, flyEnd, 8) : 0;
  const left = GPOS.center;
  return (
    <>
      <Graph
        left={left}
        hideY={[5, 10, 20]}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={2.9} y={10.4} color={C.deriv} opacity={top * labels}>
              cực đại: 6
            </PlotLabel>
            <PlotLabel scale={s} x={1.3} y={10.3} color={colors.accent} opacity={line * labels}>
              bay ở 8
            </PlotLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <Segment scale={s} x1={4.3} y1={FLY} x2={s.xMin} y2={FLY} color={colors.accent} width={4} dashed opacity={line} />
            <CurvePart s={s} a={A} b={HIT} color={C.warn} opacity={warn} />
            <Point scale={s} x={3} y={6} color={C.deriv} opacity={0.4 + 0.6 * top} />
            {warn > 0 ? (
              <g opacity={warn}>
                {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
                  const a = (i * Math.PI) / 4;
                  const cx = s.x(HIT);
                  const cy = s.y(FLY + 1.2);
                  return <line key={i} x1={cx + Math.cos(a) * 16} y1={cy + Math.sin(a) * 16} x2={cx + Math.cos(a) * 34} y2={cy + Math.sin(a) * 34} stroke={C.warn} strokeWidth={6} strokeLinecap="round" />;
                })}
              </g>
            ) : null}
          </>
        )}
      </Graph>
      <Drone x={left + RS.x(x) + shake} y={G.top + RS.y(FLY)} w={DRONE_W} spin={fr * 0.9} opacity={line} dizzy={warn} flip />
    </>
  );
};

// =====================================================================
// b09 ĐỊNH NGHĨA — giá trị lớn nhất: so với cả tuyến; cực đại chỉ so với sát bên
// =====================================================================
const DefMaxValueCard: React.FC<{ hl: number; o: number }> = ({ hl, o }) => {
  const dim = hl > 0;
  return (
    <PanelCard top={170} left={PANEL.left} width={PANEL.width} opacity={o} group="defmax">
      <div data-box>
        <Head>định nghĩa</Head>
        <Row mt={6}>
          <Hi on={0} dim={dim} color={C.max}>
            <MathText text="$M = \max\limits_{[-1;\,4]} f(x)$ nếu" />
          </Hi>
        </Row>
        <Row mt={6}>
          <Hi on={hl === 1 ? 1 : 0} dim={dim} color={C.max}>
            <MathText text="$f(x) \le M$ với mọi $x \in [-1; 4]$" />
          </Hi>
          ,
        </Row>
        <Row mt={6}>
          <Hi on={0} dim={dim} color={C.max}>
            và
          </Hi>{" "}
          <Hi on={hl === 2 ? 1 : 0} dim={dim} color={C.deriv}>
            <MathText text="tồn tại $x_0$ sao cho $f(x_0) = M$" />
          </Hi>
          .
        </Row>
        <Row mt={14} size={46} weight={800} color={C.max}>
          <MathText text="$M = 22$" />
        </Row>
      </div>
    </PanelCard>
  );
};

export const Beat09: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const line = lineAt(fr, L);
  const mix = ramp(fr, 0, 18);
  const left = lerp(GPOS.center, GPOS.left, mix);
  const top = fadeIn(fr, L[0]);
  const card = fadeIn(fr, L[1]);
  const all = line === 3 ? 1 : 0;
  const one = line === 4 ? 1 : 0;
  const local = fadeIn(fr, L[4]);
  const hl = line === 3 ? 1 : line === 4 ? 2 : 0;
  return (
    <>
      <Graph
        left={left}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={-1.12} y={22} anchor="right" color={C.max} opacity={top}>
              22
            </PlotLabel>
            <PlotLabel scale={s} x={3} y={10.4} color={C.deriv} opacity={local}>
              cực đại: 6
            </PlotLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <Segment scale={s} x1={A} y1={22} x2={B} y2={22} color={C.max} width={all ? 6 : 4} dashed opacity={top * (all ? 1 : 0.75)} />
            <CurvePart s={s} a={A} b={B} color={C.max} width={9} opacity={all * fadeIn(fr, L[2])} />
            <AxisPart s={s} a={2.2} b={3.8} color={C.span} opacity={local * 0.8} />
            <Segment scale={s} x1={2.2} y1={6} x2={3.8} y2={6} color={C.below} width={4} dashed opacity={local * 0.7} />
            <CurvePart s={s} a={2.2} b={3.8} color={C.below} width={9} opacity={local * 0.8} />
            <Point scale={s} x={3} y={6} color={C.deriv} opacity={0.5 + 0.5 * local} />
            <Ring s={s} x={A} y={22} color={C.deriv} opacity={one} />
            <Point scale={s} x={A} y={22} color={C.max} opacity={top} />
          </>
        )}
      </Graph>
      <DefMaxValueCard hl={hl} o={card} />
    </>
  );
};

// =====================================================================
// b10 BẢN CHẤT — chỗ cao nhất: bên trong thì f' = 0; đầu tuyến thì không cần (hết tuyến)
// =====================================================================
const Hatch: React.FC<{ x1: number; x2: number; y1: number; y2: number; o: number }> = ({ x1, x2, y1, y2, o }) =>
  o <= 0 ? null : (
    <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: o }}>
      <defs>
        <pattern id="hatch" width="18" height="18" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="18" stroke={C.dim} strokeWidth="5" />
        </pattern>
      </defs>
      <rect x={x1} y={y1} width={x2 - x1} height={y2 - y1} fill="url(#hatch)" opacity={0.7} />
    </svg>
  );

export const Beat10: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const q = fadeIn(fr, L[0]) * (1 - fadeIn(fr, L[1]));
  const inside = fadeIn(fr, L[1]) * (1 - fadeIn(fr, L[3]));
  const crosses = fadeIn(fr, L[2]) * (1 - fadeIn(fr, L[2] + 30));
  const zeros = fadeIn(fr, L[2] + 24);
  const end = fadeIn(fr, L[3]);
  const tan = fadeIn(fr, L[4]);
  const hatch = fadeIn(fr, L[5]);
  const cand = fadeIn(fr, L[6]);
  const left = GPOS.center;
  const zeroLabels = zeros * (1 - cand);
  return (
    <>
      <Hatch x1={left + RS.x(-2.3)} x2={left + RS.x(A) - 4} y1={G.top} y2={G.top + RS.y(0)} o={hatch} />
      <Graph
        left={left}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={1} y={10.3} size={72} color={colors.accent} opacity={q}>
              ?
            </PlotLabel>
            <PlotLabel scale={s} x={2} y={9.5} color={colors.accent} opacity={inside}>
              bên trong
            </PlotLabel>
            <PlotLabel scale={s} x={3} y={9.6} color={C.deriv} opacity={zeroLabels}>
              <MathText text="$f' = 0$" />
            </PlotLabel>
            <PlotLabel scale={s} x={1} y={5.8} color={C.deriv} opacity={zeroLabels}>
              <MathText text="$f' = 0$" />
            </PlotLabel>
            <PlotLabel scale={s} x={1.05} y={21.6} color={C.down} opacity={tan * (1 - cand)}>
              <MathText text="$f'(-1) = -24$" />
            </PlotLabel>
            <PlotLabel scale={s} x={-1.85} y={10.5} color={colors.muted} opacity={hatch}>
              hết tuyến
            </PlotLabel>
            <PlotLabel scale={s} x={2} y={11.4} color={colors.accent} opacity={cand}>
              4 ứng viên
            </PlotLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <AxisPart s={s} a={A} b={B} color={colors.accent} opacity={inside * 0.35} />
            {inside > 0 ? (
              <g opacity={inside}>
                {[A, B].map((v) => (
                  <circle key={v} cx={s.x(v)} cy={s.y(0)} r={11} fill={colors.bg} stroke={colors.accent} strokeWidth={4} />
                ))}
              </g>
            ) : null}
            <Cross s={s} x={2} y={f(2)} opacity={crosses * 0.6} />
            <Cross s={s} x={3.5} y={f(3.5)} opacity={crosses * 0.6} />
            <TangentLine scale={s} x0={3} y0={6} slope={0} halfLengthPx={70} color={C.deriv} width={6} opacity={zeros} />
            <TangentLine scale={s} x0={1} y0={2} slope={0} halfLengthPx={70} color={C.deriv} width={6} opacity={zeros} />
            <Point scale={s} x={3} y={6} color={C.deriv} opacity={zeros} />
            <Point scale={s} x={1} y={2} color={C.deriv} opacity={zeros} />
            <TangentLine scale={s} x0={A} y0={22} slope={fp(A)} halfLengthPx={70} color={C.down} width={6} opacity={tan} />
            <Point scale={s} x={A} y={22} color={C.max} opacity={end} />
            <Point scale={s} x={B} y={2} color={colors.text} opacity={cand} />
            {[
              [A, 22],
              [1, 2],
              [3, 6],
              [B, 2],
            ].map(([x, y]) => (
              <Ring key={x} s={s} x={x} y={y} color={colors.accent} opacity={cand} />
            ))}
          </>
        )}
      </Graph>
    </>
  );
};

// =====================================================================
// b11 CÔNG THỨC — quy tắc: tìm f' = 0 trong đoạn, tính f tại đó và hai đầu, so sánh
// =====================================================================
const RuleBookCard: React.FC<{ o: number; hl: number }> = ({ o, hl }) => {
  const dim = true;
  return (
    <PanelCard top={170} left={PANEL.left} width={PANEL.width} opacity={o} group="rulebook">
      <div data-box>
        <Head>
          <MathText text="quy tắc trên đoạn $[a; b]$" />
        </Head>
        <Row mt={6}>
          <Hi on={hl === 1 ? 1 : 0} dim={dim} color={C.deriv}>
            <MathText text="1. Tìm các $x_i \in (a; b)$ mà $f'(x_i) = 0$." />
          </Hi>
        </Row>
        <Row mt={6}>
          <Hi on={hl === 2 ? 1 : 0} dim={dim} color={colors.accent}>
            <MathText text="2. Tính $f(x_i)$, $f(a)$, $f(b)$." />
          </Hi>
        </Row>
        <Row mt={6}>
          <Hi on={hl === 3 ? 1 : 0} dim={dim} color={C.max}>
            <MathText text="3. Số lớn nhất: $\max\limits_{[a;\,b]} f(x)$," />
          </Hi>
        </Row>
        <Row mt={6}>
          <Hi on={hl === 4 ? 1 : 0} dim={dim} color={C.min}>
            <MathText text="số nhỏ nhất: $\min\limits_{[a;\,b]} f(x)$." />
          </Hi>
        </Row>
      </div>
    </PanelCard>
  );
};

export const Beat11: React.FC<BeatProps> = ({ L }) => {
  const fr = useCurrentFrame();
  const line = lineAt(fr, L);
  const mix = ramp(fr, 0, 18);
  const left = lerp(GPOS.center, GPOS.left, mix);
  const card = fadeIn(fr, L[0]);
  const zeros = line === 2 ? 1 : 0.45;
  const ends = fadeIn(fr, L[2]);
  const nums = fadeIn(fr, L[2]);
  const maxO = fadeIn(fr, L[3]);
  const minO = fadeIn(fr, L[4]);
  const hl = line >= 2 ? line - 1 : 0;
  const numColor = (v: number) => (v === 22 && maxO > 0 ? C.max : v === 2 && minO > 0 ? C.min : colors.text);
  const numSize = (v: number) => (v === 22 && maxO > 0 ? 48 : v === 2 && minO > 0 ? 44 : 38);
  return (
    <>
      <Graph
        left={left}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={-1.12} y={22} anchor="right" color={numColor(22)} size={numSize(22)} opacity={nums}>
              22
            </PlotLabel>
            <PlotLabel scale={s} x={1} y={4.6} color={numColor(2)} size={numSize(2)} opacity={nums}>
              2
            </PlotLabel>
            <PlotLabel scale={s} x={3} y={8.6} color={colors.text} opacity={nums}>
              6
            </PlotLabel>
            <PlotLabel scale={s} x={4} y={4.8} color={numColor(2)} size={numSize(2)} opacity={nums}>
              2
            </PlotLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <Point scale={s} x={1} y={2} color={C.deriv} opacity={zeros} />
            <Point scale={s} x={3} y={6} color={C.deriv} opacity={zeros} />
            <Ring s={s} x={1} y={2} color={C.deriv} opacity={line === 2 ? 1 : 0} />
            <Ring s={s} x={3} y={6} color={C.deriv} opacity={line === 2 ? 1 : 0} />
            <Point scale={s} x={A} y={22} color={line >= 4 ? C.max : colors.accent} opacity={ends} />
            <Point scale={s} x={B} y={2} color={colors.accent} opacity={ends} />
            <Ring s={s} x={A} y={22} color={colors.accent} opacity={line === 3 ? 1 : 0} />
            <Ring s={s} x={B} y={2} color={colors.accent} opacity={line === 3 ? 1 : 0} />
          </>
        )}
      </Graph>
      <RuleBookCard o={card} hl={hl} />
    </>
  );
};

// =====================================================================
// b12 TRONG ĐỀ THI — đoạn [2; 4]: loại x = 1, so f(2), f(3), f(4)
// =====================================================================
export const Beat12: React.FC<BeatProps> = ({ L, T0 }) => {
  const fr = useCurrentFrame();
  const a0 = Math.max(L[0], T0);
  const seg = fadeIn(fr, a0);
  const roots = fadeIn(fr, L[1]);
  const drop = fadeIn(fr, L[2]);
  const cols = fadeIn(fr, L[3]);
  const res = fadeIn(fr, L[4]);
  const names = fadeIn(fr, L[5]);
  return (
    <Graph
      left={GPOS.center}
      chipText="đề bài"
      hideX={roots > 0 ? [1, 3] : []}
      curveOpacity={1 - 0.7 * seg}
      overlay={(s) => (
        <>
          <PlotLabel scale={s} x={0.3} y={21.6} anchor="left" opacity={seg}>
            <MathText text="Tìm $\max$, $\min$ trên $[2; 4]$" />
          </PlotLabel>
          <PlotLabel scale={s} x={2.14} y={2.2} anchor="left" opacity={cols}>
            4
          </PlotLabel>
          <PlotLabel scale={s} x={3.14} y={3} anchor="left" opacity={cols * (1 - res)}>
            6
          </PlotLabel>
          <PlotLabel scale={s} x={4.18} y={2} anchor="left" opacity={cols * (1 - res)}>
            2
          </PlotLabel>
          <PlotLabel scale={s} x={1} y={0} dy={16} anchor="top" color={C.deriv} size={28} opacity={roots * (1 - 0.75 * drop)}>
            1
          </PlotLabel>
          <PlotLabel scale={s} x={3} y={0} dy={16} anchor="top" color={C.deriv} size={28} opacity={roots}>
            3
          </PlotLabel>
          <PlotLabel scale={s} x={3} y={8.2} color={C.max} opacity={res}>
            <MathText text="$\max = 6$" />
          </PlotLabel>
          <PlotLabel scale={s} x={4.18} y={2} anchor="left" color={C.min} opacity={res}>
            <MathText text="$\min = 2$" />
          </PlotLabel>
          <PlotLabel scale={s} x={2.4} y={8.2} anchor="right" color={C.deriv} opacity={names}>
            cực đại
          </PlotLabel>
          <PlotLabel scale={s} x={4.18} y={5.6} anchor="left" color={colors.accent} opacity={names}>
            đầu mút
          </PlotLabel>
        </>
      )}
    >
      {(s) => (
        <>
          <AxisPart s={s} a={2} b={4} color={colors.accent} opacity={seg * 0.8} />
          <FunctionPlot scale={s} f={f} from={2} to={4} opacity={seg} />
          <Col s={s} x={2} color={colors.muted} opacity={cols * 0.8} />
          <Col s={s} x={3} color={res > 0 ? C.max : colors.muted} opacity={cols * 0.8} />
          <Col s={s} x={4} color={res > 0 ? C.min : colors.muted} opacity={cols * 0.8} />
          <Segment scale={s} x1={3} y1={-0.7} x2={3} y2={0.7} color={C.deriv} width={8} opacity={roots} />
          <Segment scale={s} x1={1} y1={-0.7} x2={1} y2={0.7} color={C.deriv} width={8} opacity={roots * (1 - 0.75 * drop)} />
          <Cross s={s} x={1} y={0} opacity={drop} size={14} />
          <Point scale={s} x={3} y={6} color={C.max} opacity={res} />
          <Point scale={s} x={4} y={2} color={C.min} opacity={res} />
        </>
      )}
    </Graph>
  );
};

// =====================================================================
// b13 GIẢI ĐÁP — quay lại flycam: giải f' = 0, so với hai đầu, cao nhất 22 ⇒ bay cao hơn 22
// =====================================================================
export const Beat13: React.FC<BeatProps> = ({ L, E, T0 }) => {
  const fr = useCurrentFrame();
  const a0 = Math.max(L[0], T0);
  const r1 = fadeIn(fr, a0);
  const r2 = fadeIn(fr, L[1]);
  const r3 = fadeIn(fr, L[2]);
  const flyStart = L[2] + 16;
  const flyEnd = E[2] + 6;
  const x = interpolate(fr, [flyStart, flyEnd], [3.9, -0.75], { ...clamp, easing: Easing.inOut(Easing.quad) });
  const pts: [number, number, string][] = [
    [A, 22, "22"],
    [1, 2, "2"],
    [3, 6, "6"],
    [B, 2, "2"],
  ];
  return (
    <>
      <Hill mix={1}>
        {(s) => (
          <>
            <Point scale={s} x={1} y={2} color={C.deriv} opacity={r1} />
            <Point scale={s} x={3} y={6} color={C.deriv} opacity={r1} />
            <Point scale={s} x={A} y={22} color={r3 > 0 ? C.max : colors.accent} opacity={r2} />
            <Point scale={s} x={B} y={2} color={colors.accent} opacity={r2} />
          </>
        )}
      </Hill>
      {pts.map(([px, py, t], i) => (
        <Tag
          key={i}
          x={hillLeft(1) + HS.x(px === A ? -0.86 : px)}
          y={HILL.top + HS.y(px === A ? 22 : py + 2.6) - 24}
          anchor={px === A ? "left" : "center"}
          color={px === A && r3 > 0 ? C.max : colors.text}
          weight={800}
          size={px === A && r3 > 0 ? 52 : 40}
          opacity={r2}
        >
          {t}
        </Tag>
      ))}
      <FlightLine mix={1} opacity={r3} />
      <FixedDrone mix={1} x={x} spin={fr * 0.9} opacity={fadeIn(fr, flyStart - 6, 8)} />
      <Card group="program" style={{ left: 1290, top: 200, width: 540, padding: "20px 30px" }}>
        <div data-box>
          <div data-text="th" style={{ ...label, color: colors.muted }}>
            chương trình
          </div>
          <Row o={r1} weight={700}>
            <MathText text="1. $f' = 0$: $x = 1$, $x = 3$" />
          </Row>
          <Row o={r2} weight={700}>
            <MathText text="2. so $f$ tại $-1$, $1$, $3$, $4$" />
          </Row>
          <Row o={r3} color={C.max} size={46} weight={800} mt={18}>
            cao nhất: 22
          </Row>
        </div>
      </Card>
    </>
  );
};

