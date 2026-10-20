import React from "react";
import { Easing, interpolate, useCurrentFrame } from "remotion";
import { BeatProps, clamp, ramp } from "../../components/BeatShell";
import { Card } from "../../components/Card";
import { MathText, Tex } from "../../components/MathText";
import { Axes, FunctionPlot, Plot, PlotLabel, Point, Scale, Segment, fmt, makeScale } from "../../components/plot";
import { colors, tint } from "../../components/theme";
import { ZoomInset } from "../../components/ZoomInset";
import { C, GraphPoint, LineLabel, ModelGraph, S0, SecantLine, T0 as X0, Triangle, graphLayout, s2, slopeAB } from "./graph";
import {
  BOLT_STOP,
  BigQuestion,
  LaserIcon,
  POSE_LOW,
  POSE_MAIN,
  RunnerFigure,
  Stopwatch,
  TRACK,
  TRACK_BASE,
  Tag,
  Track,
  boltPos,
  boltTime,
  headTop,
  label,
  lerp,
  lerpPose,
  mx,
  RACE_TIME,
} from "./parts";

const ease = Easing.inOut(Easing.cubic);
const MODEL = colors.brandBlue;

// =====================================================================
// b01 HIỆN TƯỢNG — Bolt chạy 100 m; trung bình 37,6 km/h; lúc nhanh nhất: ?
// =====================================================================
export const Beat01: React.FC<BeatProps> = ({ L, E }) => {
  const f = useCurrentFrame();
  const race = interpolate(f, [L[0] + 4, E[0]], [0, RACE_TIME], clamp);
  const watchO = 1 - ramp(f, L[1], L[1] + 12);
  const avgO = ramp(f, L[1] + 4, L[1] + 16) * (1 - ramp(f, L[2], L[2] + 12));
  const frozen = f >= L[2];
  const reappear = ramp(f, L[2] + 4, L[2] + 16);
  const q = ramp(f, L[2] + 14, L[2] + 34);
  return (
    <>
      <Track
        runner={{
          m: frozen ? BOLT_STOP : boltPos(race),
          opacity: frozen ? reappear : 1,
          name: "Bolt",
          nameOpacity: frozen ? 0 : 1,
        }}
      />
      <Stopwatch time={race} left={1500} top={140} opacity={watchO} />
      <Tag x={960} y={190} size={52} weight={800} color={colors.accent} opacity={avgO}>
        trung bình ≈ 37,6 km/h
      </Tag>
      {q > 0 ? <BigQuestion x={headTop(BOLT_STOP).x} y={150} p={q} /> : null}
    </>
  );
};

// =====================================================================
// b02 CÂU HỎI — v_tb = quãng đường : thời gian; một khoảnh khắc ra 0/0
// =====================================================================
const FORMULA_Y = 215;
export const Beat02: React.FC<BeatProps> = ({ L }) => {
  const f = useCurrentFrame();
  const shrink = ramp(f, L[1] + 4, L[1] + 40);
  const a = lerp(40, BOLT_STOP, shrink);
  const b = lerp(60, BOLT_STOP, shrink);
  const hl = ramp(f, L[0], L[0] + 14);
  const fIn = ramp(f, L[0] + 2, L[0] + 16);
  const swap = ramp(f, L[1] + 26, L[1] + 40);
  const strike = ramp(f, L[2] + 6, L[2] + 26);
  const voidO = ramp(f, L[2] + 20, L[2] + 32);
  const fx = 920;
  return (
    <>
      <Track runner={{ m: BOLT_STOP }} highlight={{ from: a, to: b, opacity: hl }} />
      <div data-text="formula" style={{ ...label, position: "absolute", right: 1920 - 900, top: FORMULA_Y, translate: "0 -50%", fontSize: 60, opacity: fIn }}>
        <Tex tex="v_{tb} =" />
      </div>
      <div data-text="formula" style={{ ...label, position: "absolute", left: fx, top: FORMULA_Y, translate: "0 -50%", fontSize: 60, opacity: fIn * (1 - swap) }}>
        <Tex tex="\dfrac{\text{quãng đường}}{\text{thời gian}}" />
      </div>
      <div data-text="formula" style={{ ...label, position: "absolute", left: fx, top: FORMULA_Y, translate: "0 -50%", fontSize: 60, opacity: swap }}>
        <Tex tex={`\\dfrac{\\textcolor{${colors.accent}}{0}\\text{ m}}{\\textcolor{${colors.accent}}{0}\\text{ s}}`} />
      </div>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <line
          x1={fx - 14}
          y1={FORMULA_Y + 80}
          x2={fx - 14 + 170 * strike}
          y2={FORMULA_Y + 80 - 160 * strike}
          stroke={colors.decrease}
          strokeWidth={12}
          strokeLinecap="round"
          opacity={strike > 0 ? 0.9 : 0}
        />
      </svg>
      <Tag x={fx + 200} y={FORMULA_Y - 30} anchor="left" size={48} weight={800} color={colors.decrease} opacity={voidO}>
        vô nghĩa
      </Tag>
    </>
  );
};

// =====================================================================
// b03 TRỰC GIÁC — khoảng ngắn dần; số liệu chỉ mỗi 10 m; cần biết vị trí ở mọi lúc
// =====================================================================
export const Beat03: React.FC<BeatProps> = ({ L, E }) => {
  const f = useCurrentFrame();
  const d0 = E[0] - L[0];
  const a = interpolate(f, [L[0], L[0] + 15, L[0] + d0 * 0.55, E[0] - 4], [BOLT_STOP, 40, 48, 51], { ...clamp, easing: ease });
  const b = interpolate(f, [L[0], L[0] + 15, L[0] + d0 * 0.55, E[0] - 4], [BOLT_STOP, 60, 56, 53], { ...clamp, easing: ease });
  const shortLbl = ramp(f, L[0] + 8, L[0] + 20) * (1 - ramp(f, L[1], L[1] + 10));
  const dots = ramp(f, L[1] + 4, L[1] + 18);
  const dataLbl = ramp(f, L[1] + 10, L[1] + 22);
  const gaps = ramp(f, L[2] + 4, L[2] + 20);
  return (
    <>
      <Track runner={{ m: BOLT_STOP }} highlight={{ from: a, to: b, opacity: 1 - ramp(f, L[1], L[1] + 12) }} dataDots={dots} gapMarks={gaps} />
      <Tag x={mx(BOLT_STOP)} y={615} weight={700} color={colors.c1} opacity={shortLbl}>
        khoảng ngắn dần
      </Tag>
      <Tag x={mx(50)} y={615} weight={700} color={colors.c2} opacity={dataLbl}>
        số liệu: mỗi 10 m
      </Tag>
    </>
  );
};

// =====================================================================
// b04 VÍ DỤ — đổi sang mô hình: người chạy tưởng tượng, bảng số, s = t²
// =====================================================================
const TABLE_W = 540;
const TimeTable: React.FC<{ left: number; top: number; rows: number[]; hi?: number[]; opacity?: number }> = ({ left, top, rows, hi = [0, 0, 0], opacity = 1 }) => {
  const cell: React.CSSProperties = { width: TABLE_W / 2 - 30, textAlign: "center" };
  return (
    <Card group="table" style={{ left, top, width: TABLE_W, padding: "10px 0", opacity }}>
      <div data-box style={{ ...label, fontSize: 38 }}>
        <div style={{ display: "flex", justifyContent: "space-around", color: colors.muted, fontSize: 36, paddingBottom: 6, borderBottom: `2px solid ${colors.panelBorder}` }}>
          <div data-text="th" style={cell}>
            thời gian (s)
          </div>
          <div data-text="th" style={cell}>
            quãng đường (m)
          </div>
        </div>
        {[2, 4, 6].map((t, i) => (
          <div
            key={t}
            style={{
              display: "flex",
              justifyContent: "space-around",
              padding: "8px 0",
              opacity: rows[i],
              background: hi[i] > 0 ? tint(colors.accent, 0.1 * hi[i]) : undefined,
              fontWeight: 700,
            }}
          >
            <div data-text="td" style={cell}>
              {t}
            </div>
            <div data-text="td" style={cell}>
              {t * t}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};

/** Cột hiện dần khi thời gian t của người chạy vượt qua mốc. */
const rowOpacity = (t: number, mark: number) => Math.min(1, Math.max(0, (t - mark + 0.05) * 6));

export const Beat04: React.FC<BeatProps> = ({ L, E }) => {
  const f = useCurrentFrame();
  const out = ramp(f, L[0], L[0] + 12); // Bolt + chấm + "?" mờ đi
  const pose = lerpPose(POSE_MAIN, POSE_LOW, ramp(f, L[0] + 8, L[0] + 32));
  const modelIn = ramp(f, L[0] + 22, L[0] + 36);
  const t = f < L[2] ? interpolate(f, [L[1] + 4, E[1] - 4], [0, 4], clamp) : interpolate(f, [L[2] + 4, E[2] - 8], [4, 6], clamp);
  const table = ramp(f, L[1], L[1] + 10);
  const formula = ramp(f, L[3] + 2, L[3] + 16);
  const boltPhase = f < L[0] + 16;
  return (
    <>
      <Track
        pose={pose}
        dataDots={1 - out}
        gapMarks={1 - out}
        runner={boltPhase ? { m: BOLT_STOP, opacity: 1 - out } : { m: s2(t), color: MODEL, opacity: modelIn, name: "mô hình" }}
      />
      <TimeTable left={330} top={150} rows={[rowOpacity(t, 2), rowOpacity(t, 4), rowOpacity(t, 6)]} opacity={table} />
      <div style={{ position: "absolute", left: 1000, top: 165, opacity: formula, ...label }}>
        <div data-text="formula" style={{ fontSize: 76, color: MODEL }}>
          <Tex tex="s = t^2" />
        </div>
        <div data-text="formula" style={{ fontSize: 42, marginTop: 14 }}>
          <Tex tex="2^2 = 4 \quad 4^2 = 16 \quad 6^2 = 36" />
        </div>
        <div data-text="caption" style={{ fontSize: 36, color: colors.muted, marginTop: 18, whiteSpace: "nowrap" }}>
          <MathText text="$s$ là quãng đường (m), $t$ là thời gian (s)" />
        </div>
      </div>
    </>
  );
};

// =====================================================================
// b05 VÍ DỤ — chấm từng cặp số lên hệ trục, nối thành đồ thị
// =====================================================================
const PT_LABEL: Record<number, string> = { 2: "$(2; 4)$", 4: "$(4; 16)$", 6: "$(6; 36)$" };

export const Beat05: React.FC<BeatProps> = ({ L, E }) => {
  const f = useCurrentFrame();
  const slide = ramp(f, 0, 22);
  const axes = ramp(f, L[0] + 6, L[0] + 22);
  const p2 = ramp(f, L[1] + 4, L[1] + 16);
  const p46 = ramp(f, L[2] + 4, L[2] + 16);
  const guides = 1 - ramp(f, L[3], L[3] + 12);
  const run = f >= L[3];
  const t = interpolate(f, [L[3] + 6, E[3] - 4], [0, 6], clamp);
  const hi = [
    ramp(f, L[1], L[1] + 8) * (1 - ramp(f, L[2], L[2] + 8)),
    ramp(f, L[2], L[2] + 8) * (1 - ramp(f, L[3], L[3] + 8)),
    ramp(f, L[2], L[2] + 8) * (1 - ramp(f, L[3], L[3] + 8)),
  ];
  return (
    <>
      <Track pose={POSE_LOW} runner={{ m: run ? s2(t) : 36, color: MODEL, name: "mô hình" }} />
      <TimeTable left={lerp(330, 1210, slide)} top={150} rows={[1, 1, 1]} hi={hi} />
      <div style={{ position: "absolute", left: 1000, top: 165, opacity: 1 - slide, ...label }}>
        <div data-text="formula" style={{ fontSize: 76, color: MODEL }}>
          <Tex tex="s = t^2" />
        </div>
      </div>
      <ModelGraph
        mix={1}
        axes={axes}
        curveTo={run ? t : 0}
        curveLabel={ramp(f, L[3] + 6, L[3] + 18)}
        overlay={(s) => (
          <>
            {[2, 4, 6].map((x) => (
              <PlotLabel key={x} scale={s} x={x} y={s2(x)} dx={-18} dy={-22} anchor="right" color={colors.accent} opacity={x === 2 ? p2 : p46}>
                <MathText text={PT_LABEL[x]} />
              </PlotLabel>
            ))}
          </>
        )}
      >
        {(s) => (
          <>
            <GraphPoint s={s} x={2} guides={guides} toS opacity={p2} />
            <GraphPoint s={s} x={4} guides={guides} toS opacity={p46} />
            <GraphPoint s={s} x={6} guides={guides} toS opacity={p46} />
            {run && t > 0 && t < 6 ? <Point scale={s} x={t} y={s2(t)} r={9} color={MODEL} /> : null}
          </>
        )}
      </ModelGraph>
    </>
  );
};

// =====================================================================
// b06 VÍ DỤ — A (5 s; 25 m), B (6 s; 36 m), thêm 11 m trong 1 s
// =====================================================================
export const Beat06: React.FC<BeatProps> = ({ L }) => {
  const f = useCurrentFrame();
  const mix = 1 - ramp(f, 0, 22);
  const oldPts = 1 - ramp(f, 0, 12);
  const aO = ramp(f, L[0] + 2, L[0] + 14);
  const bO = ramp(f, L[1] + 2, L[1] + 14);
  const tri = ramp(f, L[2] + 2, L[2] + 16);
  const runnerM = f < L[1] ? S0 : lerp(S0, 36, ramp(f, L[1] + 4, L[1] + 30));
  return (
    <>
      <Track pose={POSE_LOW} runner={{ m: runnerM, color: MODEL, name: "mô hình" }} />
      <ModelGraph
        mix={mix}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={X0} y={S0} dx={-18} dy={-22} anchor="right" color={C.point} opacity={aO}>
              A
            </PlotLabel>
            <PlotLabel scale={s} x={6} y={36} dy={-34} color={colors.text} opacity={bO}>
              B
            </PlotLabel>
            <PlotLabel scale={s} x={5.5} y={S0} dy={26} anchor="top" color={C.run} opacity={tri}>
              1 s
            </PlotLabel>
            <PlotLabel scale={s} x={6} y={30.5} dx={20} anchor="left" color={C.rise} opacity={tri}>
              11 m
            </PlotLabel>
          </>
        )}
      >
        {(s) => (
          <>
            {[2, 4, 6].map((x) => (
              <Point key={x} scale={s} x={x} y={s2(x)} r={9} color={colors.accent} opacity={oldPts} />
            ))}
            <GraphPoint s={s} x={X0} toS opacity={aO} />
            <GraphPoint s={s} x={6} color={colors.text} opacity={bO} />
            <Triangle s={s} b={6} opacity={tri} />
          </>
        )}
      </ModelGraph>
    </>
  );
};

// =====================================================================
// b07 ĐỊNH NGHĨA — cát tuyến, độ dốc = lên : ngang = vận tốc trung bình
// =====================================================================
export const Beat07: React.FC<BeatProps> = ({ L }) => {
  const f = useCurrentFrame();
  const pulse = interpolate(f, [L[0], L[0] + 8, L[0] + 18], [0, 1, 0], clamp);
  const line = ramp(f, L[0] + 14, L[0] + 44);
  const rate = f >= L[1] && f < L[2];
  const back = f >= L[2];
  const triGlow = ramp(f, L[1], L[1] + 10) * (1 - ramp(f, L[2], L[2] + 10));
  return (
    <>
      <Track pose={POSE_LOW} runner={{ m: 36, color: MODEL, name: "mô hình" }} />
      <ModelGraph
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={X0} y={S0} dx={-18} dy={-22} anchor="right" color={C.point}>
              A
            </PlotLabel>
            <PlotLabel scale={s} x={6} y={36} dy={-34} color={colors.text}>
              B
            </PlotLabel>
            <PlotLabel scale={s} x={5.5} y={S0} dy={26} anchor="top" color={C.run}>
              {rate ? "ngang 1" : "1 s"}
            </PlotLabel>
            <PlotLabel scale={s} x={6} y={30.5} dx={20} anchor="left" color={C.rise}>
              {rate ? "lên 11" : "11 m"}
            </PlotLabel>
            <LineLabel s={s} mix={0} opacity={ramp(f, L[0] + 30, L[0] + 42)}>
              {back ? "cát tuyến: 11 m/s" : "cát tuyến"}
            </LineLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <Segment scale={s} x1={X0} y1={0} x2={X0} y2={S0} color={colors.muted} width={3} dashed />
            <Segment scale={s} x1={6} y1={0} x2={6} y2={36} color={colors.muted} width={3} dashed />
            <SecantLine s={s} b={6} progress={line} />
            <Triangle s={s} b={6} />
            {triGlow > 0 ? (
              <g opacity={0.35 * triGlow}>
                <Segment scale={s} x1={X0} y1={S0} x2={6} y2={S0} color={C.run} width={16} />
                <Segment scale={s} x1={6} y1={S0} x2={6} y2={36} color={C.rise} width={16} />
              </g>
            ) : null}
            <Point scale={s} x={X0} y={S0} color={C.point} r={11 + 6 * pulse} />
            <Point scale={s} x={6} y={36} color={colors.text} r={11 + 6 * pulse} />
          </>
        )}
      </ModelGraph>
    </>
  );
};

// =====================================================================
// b08 TRỰC GIÁC — co khoảng: B trượt về A; kính lúp; 11 → 10,1 → 10,01
// =====================================================================
const LENS = { left: 1080, top: 170, w: 740, h: 300 };

/** Kính lúp quanh A (đồ thị ở bố cục mix) với B = (b; b²), cát tuyến/tiếp tuyến trong ô. */
const Lens: React.FC<{ mix: number; z: number; b: number; opacity: number; secant: number; tangent: number }> = ({ mix, z, b, opacity, secant, tangent }) => {
  const g = graphLayout(mix);
  return (
    <ZoomInset base={g.s} baseLeft={g.left} baseTop={g.top} f={s2} x0={X0} y0={S0} z={z} left={LENS.left} top={LENS.top} width={LENS.w} height={LENS.h} opacity={opacity}>
      {(s) => (
        <>
          <SecantLine s={s} b={b} opacity={secant} color={C.secant} />
          <SecantLine s={s} b={X0} opacity={tangent} color={C.tangent} />
          <Point scale={s} x={b} y={s2(b)} r={10} color={colors.text} opacity={secant} />
        </>
      )}
    </ZoomInset>
  );
};

export const Beat08: React.FC<BeatProps> = ({ L, E }) => {
  const f = useCurrentFrame();
  const b =
    f < L[2]
      ? lerp(6, 5.1, ramp(f, L[0] + 4, L[0] + 36))
      : lerp(5.1, 5.01, interpolate(f, [L[2] + 4, E[2] - 6], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) }));
  const tri = 1 - ramp(f, L[0], L[0] + 10);
  const mix = ramp(f, L[1], L[1] + 20);
  const lens = ramp(f, L[1] + 10, L[1] + 24);
  const z = f < L[2] ? lerp(3, 10, ramp(f, L[1] + 10, L[1] + 40)) : 1 / (b - X0);
  return (
    <>
      <Track pose={POSE_LOW} runner={{ m: s2(b), color: MODEL, name: "mô hình" }} />
      <ModelGraph
        mix={mix}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={X0} y={S0} dx={-18} dy={-22} anchor="right" color={C.point} opacity={1 - lens}>
              A
            </PlotLabel>
            <LineLabel s={s} mix={mix} opacity={1 - lens}>
              cát tuyến
            </LineLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <SecantLine s={s} b={b} />
            <Triangle s={s} b={6} opacity={tri} />
            <Point scale={s} x={b} y={s2(b)} r={10} color={colors.text} />
            <Point scale={s} x={X0} y={S0} color={C.point} />
          </>
        )}
      </ModelGraph>
      {lens > 0 ? <Lens mix={mix} z={z} b={b} opacity={lens} secant={1} tangent={0} /> : null}
      <Tag x={LENS.left + LENS.w / 2} y={LENS.top + LENS.h + 18} color={C.secant} weight={700} opacity={lens}>
        độ dốc cát tuyến: {fmt(slopeAB(b), 2)} m/s
      </Tag>
    </>
  );
};

// =====================================================================
// b09 BẢN CHẤT — phóng thật to: gần như thẳng = tiếp tuyến; giới hạn = vận tốc tức thời
// =====================================================================
export const Beat09: React.FC<BeatProps> = ({ L, E }) => {
  const f = useCurrentFrame();
  const b = 5.01;
  const secant = 1 - ramp(f, L[0] + 2, L[0] + 18);
  const tangent = ramp(f, L[1] + 4, L[1] + 18);
  const glow = ramp(f, L[2] + 4, L[2] + 16);
  const zz = ramp(f, L[3], L[3] + 10) * (1 - ramp(f, E[3] - 16, E[3]));
  return (
    <>
      <Track pose={POSE_LOW} runner={{ m: f < L[2] ? s2(b) : S0, color: MODEL, name: "mô hình", glow }} />
      <ModelGraph
        mix={1}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={X0} y={S0} dx={-18} dy={-22} anchor="right" color={C.point}>
              A
            </PlotLabel>
            <LineLabel s={s} mix={1} color={C.tangent} opacity={tangent}>
              tiếp tuyến
            </LineLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <SecantLine s={s} b={b} opacity={secant} color={C.secant} />
            <SecantLine s={s} b={X0} opacity={tangent} />
            <Point scale={s} x={X0} y={S0} color={C.point} />
          </>
        )}
      </ModelGraph>
      <Lens mix={1} z={100} b={b} opacity={1} secant={secant} tangent={tangent} />
      <Tag x={LENS.left + LENS.w / 2} y={LENS.top + LENS.h + 18} color={C.secant} weight={700} opacity={secant}>
        độ dốc cát tuyến: {fmt(slopeAB(b), 2)} m/s
      </Tag>
      <Tag x={LENS.left + LENS.w / 2} y={LENS.top + LENS.h + 18} color={C.tangent} weight={700} opacity={tangent}>
        độ dốc tiếp tuyến: 10 m/s
      </Tag>
      <ZeroOverZero x={560} y={280} opacity={zz} />
    </>
  );
};

/** Phân số 0/0 bị gạch đỏ (nhắc lại b02). (x, y) = tâm. */
const ZeroOverZero: React.FC<{ x: number; y: number; opacity: number }> = ({ x, y, opacity }) =>
  opacity > 0 ? (
    <div style={{ position: "absolute", left: x, top: y, translate: "-50% -50%", opacity }}>
      <div data-text="formula" style={{ ...label, fontSize: 64 }}>
        <Tex tex="\dfrac{0}{0}" />
      </div>
      <svg width={120} height={140} style={{ position: "absolute", left: "50%", top: "50%", translate: "-50% -50%", overflow: "visible" }}>
        <line x1={10} y1={130} x2={110} y2={10} stroke={colors.decrease} strokeWidth={10} strokeLinecap="round" />
      </svg>
    </div>
  ) : null;

// =====================================================================
// Công thức định nghĩa (b10–b13): cụm đang giải thích sáng màu, phần còn lại mờ
// =====================================================================
type Hl = null | "x0" | "fx0" | "x" | "fx" | "num" | "den" | "frac" | "lim";
const reg = (color: string | null, t: string) => (color ? `\\textcolor{${color}}{${t}}` : t);
const formulaTex = (hl: Hl) => {
  const dimC = hl ? C.dim : null;
  const xz = hl === "x0" ? reg(C.x0, "x_0") : "x_0";
  const xv = hl === "x" ? reg(C.x, "x") : "x";
  const fx0 = hl === "fx0" ? reg(C.x0, `f(${xz})`) : `f(${xz})`;
  const fx = hl === "fx" ? reg(C.x, `f(${xv})`) : `f(${xv})`;
  const num = `${fx}-${fx0}`;
  const den = `${xv}-${xz}`;
  const lhs = reg(dimC, `f'(${xz})=`);
  const lim = reg(hl === "lim" ? C.tangent : dimC, `\\lim\\limits_{${xv}\\to ${xz}}`);
  const frac =
    hl === "frac"
      ? reg(C.secant, `\\dfrac{${num}}{${den}}`)
      : `\\dfrac{${reg(hl === "num" ? C.rise : dimC, num)}}{${reg(hl === "den" ? C.run : dimC, den)}}`;
  return lhs + lim + frac;
};

const PANEL_X = 1090;
const PANEL_W = 740;

const Formula: React.FC<{ hl: Hl; opacity?: number }> = ({ hl, opacity = 1 }) => (
  <>
    <Tag x={PANEL_X + PANEL_W / 2} y={428} weight={700} color={colors.muted} opacity={opacity}>
      Định nghĩa đạo hàm
    </Tag>
    <div
      data-text="formula"
      style={{ position: "absolute", left: PANEL_X, width: PANEL_W, top: 490, textAlign: "center", fontSize: 50, color: colors.text, opacity }}
    >
      <Tex tex={formulaTex(hl)} display />
    </div>
  </>
);

/** Bảng tương ứng ví dụ ↔ hàm số. */
const Legend: React.FC<{ rows12: number; row3: number; opacity?: number }> = ({ rows12, row3, opacity = 1 }) => {
  const row: React.CSSProperties = { display: "flex", alignItems: "center", height: 64 };
  const left: React.CSSProperties = { width: 360 };
  const arrow: React.CSSProperties = { width: 64, textAlign: "center", color: colors.muted };
  return (
    <Card group="legend" style={{ left: PANEL_X, top: 130, width: PANEL_W, padding: "12px 28px", opacity }}>
      <div data-box style={{ ...label, fontSize: 38 }}>
        <div style={{ ...row, opacity: rows12 }}>
          <div data-text="td" style={left}>
            <MathText text="thời gian $t$ (s)" />
          </div>
          <div style={arrow}>↔</div>
          <div data-text="td">
            <MathText text="$x$" />
          </div>
        </div>
        <div style={{ ...row, opacity: rows12 }}>
          <div data-text="td" style={left}>
            <MathText text="quãng đường $s$ (m)" />
          </div>
          <div style={arrow}>↔</div>
          <div data-text="td">
            <MathText text="$f(x)$" />
          </div>
        </div>
        <div style={{ ...row, opacity: row3, color: colors.accent }}>
          <div data-text="td" style={left}>
            <MathText text="$v$ tức thời tại $x_0$" />
          </div>
          <div style={arrow}>↔</div>
          <div data-text="td">
            <MathText text="$f'(x_0)$" />
          </div>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", opacity: row3 }}>
          <div data-text="td" style={{ fontSize: 36, color: colors.muted, whiteSpace: "nowrap" }}>
            <MathText text="đạo hàm của $f$ tại $x_0$" />
          </div>
        </div>
      </div>
    </Card>
  );
};

// =====================================================================
// b10 ĐỊNH NGHĨA — đổi sang ngôn ngữ hàm số; f(5) = 25; hiện định nghĩa
// =====================================================================
export const Beat10: React.FC<BeatProps> = ({ L }) => {
  const f = useCurrentFrame();
  const out = ramp(f, 0, 16);
  const relabel = f >= L[0] + 18;
  const rows12 = ramp(f, L[0] + 10, L[0] + 24);
  const f5 = ramp(f, L[1] + 2, L[1] + 14);
  const row3 = ramp(f, L[2], L[2] + 14);
  const formula = ramp(f, L[3], L[3] + 14);
  return (
    <>
      <Track pose={POSE_LOW} runner={{ m: S0, color: MODEL, name: "mô hình" }} opacity={1 - out} />
      <Lens mix={1} z={100} b={5.01} opacity={1 - out} secant={0} tangent={1} />
      <ModelGraph
        mix={1}
        labels={relabel ? "xy" : "ts"}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={X0} y={S0} dx={-18} dy={-22} anchor="right" color={C.point} opacity={1 - f5}>
              A
            </PlotLabel>
            <PlotLabel scale={s} x={X0} y={S0} dx={18} dy={20} anchor="left" color={C.point} opacity={f5}>
              <MathText text="$f(5) = 25$" />
            </PlotLabel>
            <LineLabel s={s} mix={1} color={C.tangent}>
              tiếp tuyến
            </LineLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <SecantLine s={s} b={X0} />
            <Point scale={s} x={X0} y={S0} color={C.point} />
          </>
        )}
      </ModelGraph>
      <Legend rows12={rows12} row3={row3} />
      <Formula hl={null} opacity={formula} />
    </>
  );
};

/** Hai cột dọc + phần chênh + khoảng chân cột (b11–b13). Toạ độ cột 2 là b. */
const Columns: React.FC<{
  s: Scale;
  b: number;
  x0Pt: number;
  col1: number;
  xPt: number;
  col2: number;
  rise: number;
  run: number;
  pts: number;
}> = ({ s, b, x0Pt, col1, xPt, col2, rise, run, pts }) => (
  <>
    <Segment scale={s} x1={X0} y1={0} x2={X0} y2={S0} color={C.x0} width={9} opacity={col1} />
    <Segment scale={s} x1={b} y1={0} x2={b} y2={s2(b)} color={C.x} width={9} opacity={col2} />
    {rise > 0 ? (
      <>
        <Segment scale={s} x1={X0} y1={S0} x2={b} y2={S0} color={colors.muted} width={3} dashed opacity={rise} />
        <Segment scale={s} x1={b} y1={S0} x2={b} y2={s2(b)} color={C.rise} width={11} opacity={rise} />
      </>
    ) : null}
    <Segment scale={s} x1={X0} y1={0} x2={b} y2={0} color={C.run} width={11} opacity={run} />
    <Point scale={s} x={X0} y={0} r={8} color={C.x0} opacity={x0Pt} />
    <Point scale={s} x={b} y={0} r={8} color={C.x} opacity={xPt} />
    <Point scale={s} x={X0} y={S0} color={C.point} opacity={pts * col1} />
    <Point scale={s} x={b} y={s2(b)} r={10} color={colors.text} opacity={pts * col2} />
  </>
);

/** Độ rõ của một thành phần: chưa tới thì 0, đang nói thì 1, đã nói thì giữ 0,6. */
const step = (line: number, i: number) => (line < i ? 0 : line === i ? 1 : 0.6);

// =====================================================================
// b11 ĐỊNH NGHĨA — từng ký hiệu đơn: x0, f(x0) (cột 1), x, f(x) (cột 2)
// =====================================================================
export const Beat11: React.FC<BeatProps> = ({ L }) => {
  const f = useCurrentFrame();
  const line = L.filter((l) => f >= l).length; // 1..4
  const hl = (["x0", "fx0", "x", "fx"] as Hl[])[line - 1] ?? "x0";
  const tangentOut = 1 - ramp(f, 0, 14);
  return (
    <>
      <ModelGraph
        mix={1}
        labels="xy"
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={X0} y={5} dx={-16} anchor="right" color={C.x0} opacity={step(line, 2)}>
              <MathText text="$f(5) = 25$" />
            </PlotLabel>
            <PlotLabel scale={s} x={6} y={15} dx={16} anchor="left" color={C.x} opacity={step(line, 4)}>
              <MathText text="$f(6) = 36$" />
            </PlotLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <SecantLine s={s} b={X0} opacity={tangentOut} />
            <Columns s={s} b={6} x0Pt={step(line, 1)} col1={step(line, 2)} xPt={step(line, 3)} col2={step(line, 4)} rise={0} run={0} pts={1} />
          </>
        )}
      </ModelGraph>
      <Legend rows12={1} row3={1} opacity={0.45} />
      <Formula hl={hl} />
    </>
  );
};

// =====================================================================
// b12 ĐỊNH NGHĨA — tử = phần chênh hai cột; mẫu = khoảng chân cột; phân số = cát tuyến; lim
// =====================================================================
export const Beat12: React.FC<BeatProps> = ({ L, E }) => {
  const f = useCurrentFrame();
  const line = L.filter((l) => f >= l).length;
  const hl = (["num", "den", "frac", "lim"] as Hl[])[line - 1] ?? "num";
  const slideIn = interpolate(f, [L[3] + 4, E[3] - 4], [0, 1], { ...clamp, easing: Easing.out(Easing.cubic) });
  const b = lerp(6, X0, slideIn);
  const lbl = 1 - ramp(f, L[3], L[3] + 10);
  const sec = ramp(f, L[2] + 4, L[2] + 30);
  return (
    <>
      <ModelGraph
        mix={1}
        labels="xy"
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={X0} y={5} dx={-16} anchor="right" color={C.x0} opacity={0.6}>
              <MathText text="$f(5) = 25$" />
            </PlotLabel>
            <PlotLabel scale={s} x={6} y={15} dx={16} anchor="left" color={C.x} opacity={0.6 * lbl}>
              <MathText text="$f(6) = 36$" />
            </PlotLabel>
            <PlotLabel scale={s} x={6} y={30.5} dx={18} anchor="left" color={C.rise} opacity={step(line, 1) * lbl}>
              11
            </PlotLabel>
            <PlotLabel scale={s} x={5.5} y={0} dy={-26} anchor="center" color={C.run} opacity={step(line, 2) * lbl}>
              1
            </PlotLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <Columns s={s} b={b} x0Pt={0.6} col1={0.6} xPt={0.6} col2={0.6} rise={step(line, 1)} run={step(line, 2)} pts={1} />
            <SecantLine s={s} b={b} progress={line >= 4 ? 1 : sec} />
          </>
        )}
      </ModelGraph>
      <Legend rows12={1} row3={1} opacity={0.45} />
      <Formula hl={hl} />
    </>
  );
};

// =====================================================================
// b13 CÔNG THỨC — thay f(x) = x²; ra 10 m/s
// =====================================================================
export const Beat13: React.FC<BeatProps> = ({ L }) => {
  const f = useCurrentFrame();
  const glow = interpolate(f, [L[0] + 2, L[0] + 12, L[1] - 6, L[1] + 4], [0, 1, 1, 0], clamp);
  const ten = ramp(f, L[1] + 4, L[1] + 16);
  return (
    <>
      <ModelGraph
        mix={1}
        labels="xy"
        curveLabelGlow={glow}
        overlay={(s) => (
          <>
            <PlotLabel scale={s} x={X0} y={5} dx={-16} anchor="right" color={C.x0} opacity={0.6}>
              <MathText text="$f(5) = 25$" />
            </PlotLabel>
            <LineLabel s={s} mix={1} color={C.tangent} opacity={ten}>
              10 m/s
            </LineLabel>
          </>
        )}
      >
        {(s) => (
          <>
            <Columns s={s} b={X0} x0Pt={0.6} col1={0.6} xPt={0} col2={0} rise={0} run={0} pts={1} />
            <SecantLine s={s} b={X0} />
          </>
        )}
      </ModelGraph>
      <Legend rows12={1} row3={1} opacity={0.45} />
      <Formula hl={null} />
    </>
  );
};

// =====================================================================
// Cảnh 3 (b14–b15): đồ thị f' = vận tốc người chạy, đường chạy bên dưới
// =====================================================================
const fp = (x: number) => (x - 1) * (x - 4) * (x - 4);
/** Vị trí người chạy: một nguyên hàm của f'. */
const F = (x: number) => x ** 4 / 4 - 3 * x ** 3 + 12 * x ** 2 - 16 * x;
const X_START = 0.5;
/** Quãng đường đã đi (để tính pha sải chân): lùi tới x = 1 rồi tiến. */
const travelled = (x: number) => (x <= 1 ? F(X_START) - F(x) : F(X_START) - F(1) + (F(x) - F(1)));

const S3 = makeScale({ xMin: 0, xMax: 5.5, yMin: -7, yMax: 5, width: 1200, height: 320 });
const S3_LEFT = 330;
const S3_TOP = 140;
const LANE = { top: 600, h: 60, left: 300, right: 1580 };
/** Vị trí (đơn vị của F) → px trên đường chạy. */
const lanePx = (P: number) => S3_LEFT + (P + 7.5) * (1200 / 9.5);

/** Vùng giữa đồ thị f' và trục hoành trên [a; b]. */
const Shade: React.FC<{ s: Scale; a: number; b: number; color: string; opacity: number }> = ({ s, a, b, color, opacity }) => {
  if (opacity <= 0) return null;
  let d = `M${s.x(a)},${s.y(0)} `;
  for (let i = 0; i <= 60; i++) {
    const x = a + ((b - a) * i) / 60;
    d += `L${s.x(x)},${s.y(fp(x))} `;
  }
  d += `L${s.x(b)},${s.y(0)} Z`;
  return <path d={d} fill={tint(color, 0.22)} opacity={opacity} />;
};

const ExamScene: React.FC<{
  draw: number;
  x: number;
  facing: number;
  crouch?: number;
  runnerO: number;
  neg: number;
  pos: number;
  p1: number;
  p4: number;
  done: number;
  curveLbl: number;
}> = ({ draw, x, facing, crouch = 0, runnerO, neg, pos, p1, p4, done, curveLbl }) => {
  const s = S3;
  const sweep = draw >= 1 ? 1 : 0;
  return (
    <>
      <Plot
        scale={s}
        left={S3_LEFT}
        top={S3_TOP}
        overlay={
          <>
            <PlotLabel scale={s} x={3.6} y={-3.3} anchor="left" color={colors.curve} opacity={curveLbl}>
              <MathText text="$y = f'(x)$" />
            </PlotLabel>
            <PlotLabel scale={s} x={3.6} y={-5.85} anchor="left" color={colors.muted} opacity={curveLbl}>
              vận tốc người chạy
            </PlotLabel>
            <PlotLabel scale={s} x={0.1} y={-2.3} anchor="left" color={colors.decrease} opacity={neg}>
              <MathText text="$f' < 0$" />
            </PlotLabel>
            <PlotLabel scale={s} x={2.5} y={1.2} color={colors.increase} opacity={pos}>
              <MathText text="$f' > 0$" />
            </PlotLabel>
            <PlotLabel scale={s} x={1.12} y={-1.3} anchor="left" color={colors.accent} opacity={p1}>
              <span style={{ fontWeight: 800 }}>cực tiểu</span>
            </PlotLabel>
            <PlotLabel scale={s} x={3.9} y={2.1} color={colors.warn} opacity={p4}>
              không đổi dấu
            </PlotLabel>
            <PlotLabel scale={s} x={0.2} y={3.6} anchor="left" color={colors.accent} opacity={done}>
              <span style={{ fontWeight: 800 }}>chỉ 1 cực trị</span>
            </PlotLabel>
          </>
        }
      >
        <Axes scale={s} xTicks={[1, 2, 3, 4, 5]} yTicks={[-6, -4, -2, 2, 4]} hideXLabels={[1, 4]} />
        <Shade s={s} a={X_START} b={1} color={colors.decrease} opacity={neg} />
        <Shade s={s} a={1} b={4} color={colors.increase} opacity={pos} />
        <FunctionPlot scale={s} f={fp} from={X_START} to={5} progress={draw} />
        <Segment scale={s} x1={4} y1={0.3} x2={4} y2={1.45} color={colors.warn} width={3} opacity={p4} />
        <Point scale={s} x={1} y={0} color={colors.accent} opacity={p1} />
        <Point scale={s} x={4} y={0} color={colors.warn} opacity={p4} />
        <Point scale={s} x={x} y={fp(x)} r={12} color={colors.text} opacity={sweep * runnerO} />
      </Plot>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, opacity: runnerO }}>
        <rect x={LANE.left} y={LANE.top} width={LANE.right - LANE.left} height={LANE.h} rx={10} fill="#E07A5A" />
        <g data-mark="runner" transform={`translate(${lanePx(F(x))}, ${LANE.top + 40}) scale(0.95)`}>
          <RunnerFigure phase={travelled(x) * 6} facing={facing} crouch={crouch} color={colors.brandBlue} />
        </g>
      </svg>
    </>
  );
};

// =====================================================================
// b14 TRONG ĐỀ THI — đồ thị f' là vận tốc; lùi lại; quay đầu tại x = 1
// =====================================================================
export const Beat14: React.FC<BeatProps> = ({ L, E, T0 }) => {
  const f = useCurrentFrame();
  const draw = ramp(f, T0, T0 + 30);
  const x = interpolate(f, [L[1] + 4, E[1] - 4], [X_START, 1], clamp);
  const facing = interpolate(f, [L[2] + 8, L[2] + 20], [-1, 1], clamp);
  return (
    <ExamScene
      draw={draw}
      x={x}
      facing={facing}
      runnerO={ramp(f, T0 + 10, T0 + 24)}
      neg={ramp(f, L[1], L[1] + 12)}
      pos={0}
      p1={ramp(f, L[2] + 12, L[2] + 24)}
      p4={0}
      done={0}
      curveLbl={ramp(f, T0 + 20, T0 + 34)}
    />
  );
};

// =====================================================================
// b15 BẪY THƯỜNG GẶP — tiến lên; x = 4 dừng buộc dây giày, không quay đầu; chỉ 1 cực trị
// =====================================================================
export const Beat15: React.FC<BeatProps> = ({ L, E, T0 }) => {
  const f = useCurrentFrame();
  const startRun = Math.max(L[0], T0) + 4;
  let x: number;
  if (f < L[1]) x = interpolate(f, [startRun, E[0] - 2], [1, 3.96], clamp);
  else if (f < L[1] + 44) x = interpolate(f, [L[1], L[1] + 8], [3.96, 4], clamp);
  else x = interpolate(f, [L[1] + 44, E[1] - 2], [4, 5], clamp);
  const crouch = ramp(f, L[1] + 8, L[1] + 16) * (1 - ramp(f, L[1] + 34, L[1] + 44));
  return (
    <ExamScene
      draw={1}
      x={x}
      facing={1}
      crouch={crouch}
      runnerO={1}
      neg={1}
      pos={ramp(f, startRun, startRun + 12)}
      p1={1}
      p4={ramp(f, L[1] + 8, L[1] + 20)}
      done={ramp(f, L[2], L[2] + 12)}
      curveLbl={1}
    />
  );
};

// =====================================================================
// b16 GIẢI ĐÁP — laser đo 100 lần/giây; khoảng 0,01 s; 12,32 m/s ≈ 44,4 km/h; vậy...
// =====================================================================
const LASER = { x: 132, y: TRACK_BASE };
const BLENS = { left: 1010, top: 140, w: 560, h: 190, from: 51.6, to: 52.4 };

export const Beat16: React.FC<BeatProps> = ({ L, E, T0 }) => {
  const f = useCurrentFrame();
  const tStop = boltTime(BOLT_STOP);
  const race = interpolate(f, [T0 + 6, E[0] - 4], [0, tStop], clamp);
  const m = boltPos(race);
  const laserO = ramp(f, T0, T0 + 12);
  const dots: number[] = [];
  for (let k = 0; k * 0.01 <= race; k++) dots.push(boltPos(k * 0.01));
  const lens = ramp(f, L[1], L[1] + 12) * (1 - ramp(f, L[2], L[2] + 10));
  const big = ramp(f, L[2] + 6, L[2] + 18);
  // chấm đo trong ô kính lúp
  const pxPerM = BLENS.w / (BLENS.to - BLENS.from);
  const lensDots: number[] = [];
  for (let k = Math.floor(boltTime(BLENS.from) / 0.01); k * 0.01 <= boltTime(BLENS.to); k++) {
    const pm = boltPos(k * 0.01);
    if (pm >= BLENS.from && pm <= BLENS.to) lensDots.push(pm);
  }
  const mid = lensDots.findIndex((d) => d >= BOLT_STOP);
  const d1 = lensDots[Math.max(0, mid - 1)];
  const d2 = lensDots[Math.max(1, mid)];
  const lx = (pm: number) => (pm - BLENS.from) * pxPerM;
  const head = headTop(BOLT_STOP);
  return (
    <>
      <Track laserDots={dots} runner={{ m, name: "Bolt", nameOpacity: 1 - big }} />
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <LaserIcon x={LASER.x} y={LASER.y} opacity={laserO} />
        <line
          x1={LASER.x + 46}
          y1={LASER.y - 86}
          x2={mx(m) - 12}
          y2={LASER.y - 86}
          stroke={colors.decrease}
          strokeWidth={3}
          strokeDasharray="10 8"
          opacity={laserO * 0.8}
        />
        {/* khung soi trên đường chạy + đường dẫn tới ô phóng to */}
        <g opacity={lens}>
          <rect x={mx(BLENS.from)} y={TRACK.top - 8} width={mx(BLENS.to) - mx(BLENS.from)} height={TRACK.laneH + 16} fill="none" stroke={colors.accent} strokeWidth={3} />
          <line x1={mx(BLENS.from)} y1={TRACK.top - 8} x2={BLENS.left} y2={BLENS.top + BLENS.h} stroke={colors.accent} strokeWidth={2} strokeDasharray="8 8" />
          <line x1={mx(BLENS.to)} y1={TRACK.top - 8} x2={BLENS.left + BLENS.w} y2={BLENS.top + BLENS.h} stroke={colors.accent} strokeWidth={2} strokeDasharray="8 8" />
        </g>
      </svg>
      {lens > 0 ? (
        <div
          data-box
          style={{
            position: "absolute",
            left: BLENS.left,
            top: BLENS.top,
            width: BLENS.w,
            height: BLENS.h,
            background: colors.panel,
            border: `3px solid ${colors.accent}`,
            borderRadius: 16,
            overflow: "hidden",
            opacity: lens,
          }}
        >
          <svg width={BLENS.w} height={BLENS.h} style={{ position: "absolute", inset: 0 }}>
            <rect x={0} y={0} width={BLENS.w} height={100} fill="#E07A5A" />
            {lensDots.map((d) => (
              <circle key={d} cx={lx(d)} cy={50} r={9} fill="#FFFFFF" />
            ))}
            <path
              d={`M${lx(d1)},112 L${lx(d1)},124 L${lx(d2)},124 L${lx(d2)},112`}
              fill="none"
              stroke={colors.accent}
              strokeWidth={4}
            />
          </svg>
          <div
            data-text="label"
            style={{ ...label, position: "absolute", left: (lx(d1) + lx(d2)) / 2, top: 128, translate: "-50% 0", color: colors.accent, fontWeight: 800 }}
          >
            0,01 s
          </div>
        </div>
      ) : null}
      <Tag x={head.x} y={150} size={60} weight={800} color={colors.accent} opacity={big}>
        12,32 m/s ≈ 44,4 km/h
      </Tag>
      <Tag x={head.x} y={248} color={colors.muted} opacity={big}>
        tốc độ lớn nhất
      </Tag>
    </>
  );
};
