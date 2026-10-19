import React from "react";
import { AbsoluteFill, Easing, interpolate, useCurrentFrame } from "remotion";
import { BeatProps, clamp, ramp } from "../../components/BeatShell";
import { Card } from "../../components/Card";
import { Tex } from "../../components/MathText";
import { Axes, FunctionPlot, Plot, PlotLabel, Point, Scale, TangentLine, makeScale } from "../../components/plot";
import { colors, tint } from "../../components/theme";
import { Tag, TrafficLight, label } from "./parts";

export const cubic = (x: number) => x ** 3 - 3 * x;
export const dCubic = (x: number) => 3 * x * x - 3;
const signColor = (d: number) => (d > 0.15 ? colors.increase : d < -0.15 ? colors.decrease : colors.accent);

// Người leo núi đứng tại (px, py) — chân chạm đồ thị.
const Hiker: React.FC<{ px: number; py: number; tired: number; frame: number }> = ({ px, py, tired, frame }) => {
  const lean = tired * 30;
  const bob = tired * Math.sin(frame * 0.4) * 2;
  return (
    <g transform={`translate(${px}, ${py})`}>
      <g transform={`rotate(${lean}) translate(0, ${bob})`}>
        <line x1={-10} y1={0} x2={0} y2={-34} stroke={colors.text} strokeWidth={6} strokeLinecap="round" />
        <line x1={10} y1={0} x2={0} y2={-34} stroke={colors.text} strokeWidth={6} strokeLinecap="round" />
        <line x1={0} y1={-34} x2={0} y2={-72} stroke={colors.text} strokeWidth={6} strokeLinecap="round" />
        <rect x={-22} y={-70} width={16} height={28} rx={5} fill={colors.brandBlue} />
        <line x1={0} y1={-62} x2={14} y2={-44 + tired * 30} stroke={colors.text} strokeWidth={5} strokeLinecap="round" />
        <circle cx={0} cy={-86} r={14} fill="#F3C9A0" />
      </g>
      {tired > 0.3
        ? [0, 1, 2].map((i) => {
            const t = (frame * 0.05 + i / 3) % 1;
            return <circle key={i} cx={30 + t * 34} cy={-92 - t * 26} r={5 + t * 7} fill={tint(colors.brandBlue, 0.35)} opacity={(1 - t) * tired} />;
          })
        : null}
    </g>
  );
};

// ---------------- b08: TRỰC GIÁC — dấu đạo hàm = hướng dốc ----------------
const S7 = makeScale({ xMin: -2.5, xMax: 2.5, yMin: -4, yMax: 4, width: 1100, height: 540 });

export const Beat08: React.FC<BeatProps> = ({ L, E }) => {
  const frame = useCurrentFrame();
  const s = S7;
  const draw = ramp(frame, 0, 30);
  const hx = interpolate(frame, [L[1], E[1], L[2], E[2]], [-2, -1, -1, 1], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const d = dCubic(hx);
  const up = ramp(frame, L[1], L[1] + 10) * (1 - ramp(frame, L[2] - 4, L[2] + 6));
  const down = ramp(frame, L[2], L[2] + 10) * (1 - ramp(frame, L[3] - 4, L[3] + 6));
  const flat = ramp(frame, L[3], L[3] + 14);
  const tired = ramp(frame, L[3] + 10, L[3] + 25);

  return (
    <AbsoluteFill>
      <Plot
        scale={s}
        left={410}
        top={160}
        overlay={
          <>
            <PlotLabel scale={s} x={-0.5} y={-3.3} color={colors.curve} opacity={draw}>
              <Tex tex="y=f(x)=x^3-3x" />
            </PlotLabel>
            <PlotLabel scale={s} x={-1.6} y={3.1} color={colors.increase} opacity={up}>
              <Tex tex="f'(x)>0" />: lên dốc
            </PlotLabel>
            <PlotLabel scale={s} x={1.15} y={3.1} color={colors.decrease} opacity={down}>
              <Tex tex="f'(x)<0" />: xuống dốc
            </PlotLabel>
            <PlotLabel scale={s} x={-1} y={2} dy={-46} color={colors.accent} opacity={flat}>
              cực đại
            </PlotLabel>
            <PlotLabel scale={s} x={1} y={-2} dy={48} color={colors.accent} opacity={flat}>
              cực tiểu
            </PlotLabel>
          </>
        }
      >
        <Axes scale={s} xTicks={[-2, -1, 1, 2]} yTicks={[-2, 2]} />
        <FunctionPlot scale={s} f={cubic} progress={draw} />
        <g opacity={flat}>
          <TangentLine scale={s} x0={-1} y0={2} slope={0} color={colors.accent} halfLengthPx={110} />
          <TangentLine scale={s} x0={1} y0={-2} slope={0} color={colors.accent} halfLengthPx={110} />
        </g>
        <g opacity={ramp(frame, 25, 35) * (1 - flat)}>
          <TangentLine scale={s} x0={hx} y0={cubic(hx)} slope={d} color={signColor(d)} halfLengthPx={140} width={6} />
        </g>
        <g opacity={ramp(frame, 25, 35)}>
          <Hiker px={s.x(hx)} py={s.y(cubic(hx))} tired={tired} frame={frame} />
        </g>
      </Plot>
    </AbsoluteFill>
  );
};

// ---------------- b09: TRONG ĐỀ THI — đồ thị f' → bảng biến thiên ----------------
const fp8 = (x: number) => (x + 1) * (x - 2) ** 2;
const S8 = makeScale({ xMin: -1.5, xMax: 3, yMin: -6.5, yMax: 6, width: 820, height: 460 });
const P8 = { left: 170, top: 170 };

const areaPath = (s: Scale, a: number, b: number) => {
  const pts: string[] = [];
  for (let i = 0; i <= 60; i++) {
    const x = a + ((b - a) * i) / 60;
    pts.push(`${s.x(x)},${s.y(fp8(x))}`);
  }
  return `${s.x(a)},${s.y(0)} ${pts.join(" ")} ${s.x(b)},${s.y(0)}`;
};

const COLS = ["-\\infty", "", "-1", "", "2", "", "+\\infty"];
const FP = ["", "-", "0", "+", "0", "+", ""];
const CW = 88; // độ rộng cột
const LW = 120; // cột nhãn

export const Beat09: React.FC<BeatProps> = ({ L, E, T0 }) => {
  const frame = useCurrentFrame();
  const s = S8;
  const draw = ramp(frame, T0, T0 + 30);
  const sign1 = ramp(frame, L[1], L[1] + 16);
  const touch = ramp(frame, L[2], L[2] + 14);
  const d2 = E[2] - L[2];
  const red = frame < L[2] + 0.55 * d2;
  const arrows = ramp(frame, L[3], L[3] + 20);
  const fpVis = (i: number) => (i <= 3 ? sign1 : touch);

  return (
    <AbsoluteFill>
      <Plot
        scale={s}
        left={P8.left}
        top={P8.top}
        overlay={
          <>
            <PlotLabel scale={s} x={-1.45} y={5.4} anchor="left" color={colors.warn} opacity={draw}>
              <Tex tex="y=f'(x)" />
            </PlotLabel>
            <PlotLabel scale={s} x={-1.3} y={1.15} color={colors.decrease} opacity={sign1}>
              <Tex tex="f'<0" />
            </PlotLabel>
            <PlotLabel scale={s} x={0.6} y={1.6} color={colors.increase} opacity={sign1}>
              <Tex tex="f'>0" />
            </PlotLabel>
            <PlotLabel scale={s} x={-1} y={0} dx={18} dy={34} anchor="left" color={colors.accent} opacity={sign1}>
              <Tex tex="x=-1" />
            </PlotLabel>
            <PlotLabel scale={s} x={2} y={0} dy={58} anchor="top" color={colors.warn} opacity={touch}>
              <div style={{ textAlign: "center" }}>
                <Tex tex="x=2" />: chạm trục,
                <br />
                không đổi dấu
              </div>
            </PlotLabel>
          </>
        }
      >
        <Axes scale={s} xTicks={[-1, 1, 2, 3]} yTicks={[-4]} hideXLabels={[-1, 2]} grid={false} />
        <polygon points={areaPath(s, -1.5, -1)} fill={colors.decrease} opacity={0.22 * sign1} />
        <polygon points={areaPath(s, -1, 3)} fill={colors.increase} opacity={0.18 * sign1} />
        <FunctionPlot scale={s} f={fp8} color={colors.warn} width={6} progress={draw} />
        <g opacity={sign1}>
          <Point scale={s} x={-1} y={0} />
        </g>
        <g opacity={touch}>
          <Point scale={s} x={2} y={0} color={colors.warn} />
        </g>
      </Plot>
      <Tag x={P8.left} y={P8.top + s.height + 24} anchor="left" color={colors.muted} opacity={draw}>
        ↑ đồ thị của đạo hàm <Tex tex="f'" />, không phải của <Tex tex="f" />
      </Tag>
      <div style={{ position: "absolute", left: P8.left + s.x(2) - 23, top: P8.top + s.y(0) - 24 - 104, opacity: touch }}>
        <TrafficLight red={red} />
      </div>
      <Card group="table" style={{ left: 1090, top: 190, width: LW + CW * 7 + 4, overflow: "hidden", opacity: ramp(frame, T0, T0 + 14) }}>
        {[
          { name: "x", cells: COLS, h: 64 },
          { name: "f'(x)", cells: FP, h: 64 },
        ].map((row, r) => (
          <div key={row.name} style={{ display: "flex", height: row.h, borderTop: r ? `2px solid ${colors.panelBorder}` : undefined }}>
            <div data-text="th" style={{ width: LW, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, borderRight: `2px solid ${colors.panelBorder}`, background: tint(colors.brandBlue, 0.08) }}>
              <Tex tex={row.name} />
            </div>
            {row.cells.map((c, i) => (
              <div
                key={i}
                style={{
                  width: CW,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 34,
                  color: c === "+" ? colors.increase : c === "-" ? colors.decrease : colors.text,
                  opacity: r === 1 ? fpVis(i) : 1,
                }}
              >
                {c ? <Tex tex={c} /> : null}
              </div>
            ))}
          </div>
        ))}
        <div style={{ display: "flex", height: 130, borderTop: `2px solid ${colors.panelBorder}` }}>
          <div data-text="th" style={{ width: LW, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 34, borderRight: `2px solid ${colors.panelBorder}`, background: tint(colors.brandBlue, 0.08) }}>
            <Tex tex="f(x)" />
          </div>
          <svg width={CW * 7} height={130} style={{ opacity: arrows }}>
            <defs>
              <marker id="ah" markerWidth="10" markerHeight="10" refX="7" refY="5" orient="auto">
                <path d="M0,0 L10,5 L0,10 z" fill={colors.text} />
              </marker>
            </defs>
            <line x1={CW * 0.6} y1={22} x2={CW * 2.3} y2={98} stroke={colors.decrease} strokeWidth={4} markerEnd="url(#ah)" />
            <line x1={CW * 2.7} y1={98} x2={CW * 4.3} y2={62} stroke={colors.increase} strokeWidth={4} markerEnd="url(#ah)" />
            <line x1={CW * 4.7} y1={62} x2={CW * 6.4} y2={22} stroke={colors.increase} strokeWidth={4} markerEnd="url(#ah)" />
          </svg>
        </div>
        <div data-text="label" style={{ ...label, padding: "14px 24px", borderTop: `2px solid ${colors.panelBorder}`, fontSize: 36, color: colors.accent, fontWeight: 700, opacity: arrows }}>
          Chỉ 1 cực trị: cực tiểu tại <Tex tex="x=-1" />
        </div>
      </Card>
    </AbsoluteFill>
  );
};
