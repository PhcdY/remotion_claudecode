import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BeatProps, clamp, ramp } from "../../components/BeatShell";
import { Card } from "../../components/Card";
import { Tex } from "../../components/MathText";
import { Axes, FunctionPlot, Plot, PlotLabel, Point, TangentLine, fmt, makeScale } from "../../components/plot";
import { colors, fontText, shadow, tint } from "../../components/theme";
import { ZoomInset } from "../../components/ZoomInset";
import { label } from "./beats1";

// ---------------- b04: cát tuyến → kính lúp → độ dốc 10 ----------------
const fall = (t: number) => 5 * t * t;
const S4 = makeScale({ xMin: 0, xMax: 2.2, yMin: 0, yMax: 24, width: 700, height: 500 });
const P4 = { left: 200, top: 170, center: 610 };
const INSET = { left: 1080, top: 180, width: 640, height: 430 };

/** Trái Đất tròn → phóng tới mặt sân bóng phẳng (p: 0 → 1). */
const EarthToField: React.FC<{ p: number; width: number; height: number }> = ({ p, width: W, height: H }) => {
  const surface = H * 0.45;
  const R = 120 * Math.pow(60, p);
  const g = Math.min(1, Math.max(0, (p - 0.45) / 0.4));
  const ocean = [75, 135, 244];
  const grass = [56, 160, 90];
  const col = ocean.map((o, i) => Math.round(o + (grass[i] - o) * g));
  const field = Math.min(1, Math.max(0, (p - 0.8) / 0.2));
  return (
    <svg width={W} height={H} style={{ position: "absolute", inset: 0 }}>
      <rect width={W} height={H} fill="#EAF2FF" />
      <circle cx={W / 2} cy={surface + R} r={R} fill={`rgb(${col.join(",")})`} />
      <g opacity={1 - g}>
        <ellipse cx={W / 2 - R * 0.35} cy={surface + R * 0.55} rx={R * 0.25} ry={R * 0.18} fill="#5CC08A" />
        <ellipse cx={W / 2 + R * 0.3} cy={surface + R * 0.8} rx={R * 0.2} ry={R * 0.3} fill="#5CC08A" />
      </g>
      <g opacity={field}>
        <line x1={0} x2={W} y1={surface + 30} y2={surface + 30} stroke="white" strokeWidth={4} />
        <line x1={W / 2} x2={W / 2} y1={surface + 30} y2={H} stroke="white" strokeWidth={4} />
        <ellipse cx={W / 2} cy={surface + 130} rx={150} ry={50} fill="none" stroke="white" strokeWidth={4} />
        <g transform={`translate(${W * 0.78}, ${surface})`}>
          <line x1={0} y1={0} x2={-9} y2={-34} stroke={colors.text} strokeWidth={5} strokeLinecap="round" />
          <line x1={0} y1={0} x2={9} y2={-34} stroke={colors.text} strokeWidth={5} strokeLinecap="round" />
          <rect x={-14} y={-76} width={28} height={44} rx={8} fill={colors.brandIndigo} />
          <circle cx={0} cy={-92} r={15} fill="#F3C9A0" />
        </g>
      </g>
      <text data-text="label" x={24} y={52} fontFamily={fontText} fontWeight={700} fontSize={36} fill={colors.text}>
        {p < 0.6 ? "Trái Đất: tròn" : "Mặt sân: phẳng"}
      </text>
    </svg>
  );
};

export const Beat04: React.FC<BeatProps> = ({ L, E }) => {
  const frame = useCurrentFrame();
  const d0 = E[0] - L[0];
  const tB = interpolate(
    frame,
    [L[0] + 10, L[0] + 0.35 * d0, L[0] + 0.45 * d0, L[0] + 0.75 * d0, L[0] + 0.82 * d0, E[0]],
    [2, 1.1, 1.1, 1.01, 1.01, 1],
    { ...clamp, easing: Easing.inOut(Easing.cubic) },
  );
  const slope = 5 * (tB + 1); // (5tB² − 5) / (tB − 1)
  const isTangent = tB < 1.001;
  const plotIn = ramp(frame, 0, 12);
  const insetO = ramp(frame, L[1], L[1] + 12);
  const z = 2 * Math.pow(50, ramp(frame, L[1] + 6, E[1], Easing.inOut(Easing.quad)));
  const gagO = ramp(frame, L[2], L[2] + 8) * (1 - ramp(frame, L[3] - 6, L[3] + 4));
  const gagP = ramp(frame, L[2] + 4, L[2] + 0.8 * (E[2] - L[2]), Easing.inOut(Easing.quad));
  const tan = ramp(frame, L[3], L[3] + 14);
  const lineColor = isTangent ? colors.accent : colors.c2;
  // Dòng 1: đồ thị ở giữa; dòng 2: trượt sang trái khi kính lúp vào.
  const plotLeft = interpolate(ramp(frame, L[1] - 6, L[1] + 12), [0, 1], [P4.center, P4.left]);

  return (
    <AbsoluteFill>
      <Plot
        scale={S4}
        left={plotLeft}
        top={P4.top}
        style={{ opacity: plotIn }}
        overlay={
          <>
            <PlotLabel scale={S4} x={1} y={5} dx={-18} dy={-26} anchor="right" color={colors.accent}>
              A(1; 5)
            </PlotLabel>
            <PlotLabel scale={S4} x={tB} y={fall(tB)} dx={-18} dy={-24} anchor="right" color={colors.c2} opacity={tB > 1.3 ? 1 : 0}>
              B
            </PlotLabel>
            <PlotLabel scale={S4} x={0.08} y={22.5} anchor="left" color={lineColor}>
              {isTangent ? "độ dốc tiếp tuyến: 10" : `độ dốc cát tuyến: ${fmt(slope)}`}
            </PlotLabel>
          </>
        }
      >
        <Axes scale={S4} xTicks={[1, 2]} yTicks={[5, 10, 15, 20]} xLabel="t" yLabel="s" />
        <FunctionPlot scale={S4} f={fall} />
        <TangentLine scale={S4} x0={1} y0={5} slope={slope} color={lineColor} width={4} />
        <Point scale={S4} x={tB} y={fall(tB)} color={colors.c2} opacity={tB > 1.05 ? 1 : 0} />
        <Point scale={S4} x={1} y={5} />
      </Plot>
      <ZoomInset
        base={S4}
        baseLeft={plotLeft}
        baseTop={P4.top}
        f={fall}
        x0={1}
        y0={5}
        z={z}
        left={INSET.left}
        top={INSET.top}
        width={INSET.width}
        height={INSET.height}
        opacity={insetO}
      >
        {(s) => <TangentLine scale={s} x0={1} y0={5} slope={10} color={colors.accent} width={4} opacity={tan} />}
      </ZoomInset>
      <div
        style={{
          position: "absolute",
          left: INSET.left,
          top: INSET.top,
          width: INSET.width,
          height: INSET.height,
          borderRadius: 16,
          overflow: "hidden",
          opacity: gagO,
          boxShadow: shadow,
          border: `3px solid ${colors.accent}`,
        }}
      >
        <EarthToField p={gagP} width={INSET.width} height={INSET.height} />
      </div>
      <div data-text="label" style={{ ...label, position: "absolute", left: INSET.left, top: INSET.top + INSET.height + 22, width: INSET.width, textAlign: "center", color: colors.accent, fontWeight: 800, opacity: tan }}>
        độ dốc = 10
      </div>
    </AbsoluteFill>
  );
};

// ---------------- b05: bảng tương ứng quả bóng ↔ hàm số ----------------
const MAP_ROWS = [
  { a: "thời gian $t$", b: "$x$" },
  { a: "quãng đường $s(t)$", b: "$f(x)$" },
  { a: "vận tốc tức thời", b: "$f'(x)$" },
];

const MathLine: React.FC<{ text: string }> = ({ text }) => {
  const parts = text.split("$");
  return (
    <>
      {parts.map((p, i) => (i % 2 ? <Tex key={i} tex={p} /> : <span key={i}>{p}</span>))}
    </>
  );
};

export const Beat05: React.FC<BeatProps> = ({ L }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [L[0], L[0] + 20, L[1]].map((f) => spring({ frame: frame - f, fps, config: { damping: 16 } }));
  const cap = ramp(frame, L[2], L[2] + 12);
  return (
    <AbsoluteFill>
      <Card group="table" style={{ left: 410, top: 140, width: 1100, overflow: "hidden" }}>
        <div style={{ display: "grid", gridTemplateColumns: "560px 120px 420px", background: tint(colors.brandBlue, 0.1), fontSize: 40, fontWeight: 800 }}>
          <div data-text="th" style={{ padding: "20px 40px" }}>
            Quả bóng
          </div>
          <div />
          <div data-text="th" style={{ padding: "20px 40px" }}>
            Hàm số
          </div>
        </div>
        {MAP_ROWS.map((r, i) => (
          <div
            key={r.a}
            style={{
              display: "grid",
              gridTemplateColumns: "560px 120px 420px",
              alignItems: "center",
              fontSize: 42,
              fontWeight: 600,
              borderTop: `2px solid ${colors.panelBorder}`,
              background: i === 2 ? tint(colors.accent, 0.08 * cap + 0.04) : undefined,
              color: i === 2 ? colors.accent : colors.text,
              opacity: rows[i],
              translate: `${(1 - rows[i]) * -30}px 0px`,
            }}
          >
            <div data-text="td" style={{ padding: "24px 40px" }}>
              <MathLine text={r.a} />
            </div>
            <div style={{ textAlign: "center", fontSize: 44, color: colors.muted }}>⟷</div>
            <div data-text="td" style={{ padding: "24px 40px", fontSize: 48 }}>
              <MathLine text={r.b} />
            </div>
          </div>
        ))}
      </Card>
      <div data-text="caption" style={{ ...label, position: "absolute", left: 0, right: 0, top: 652, textAlign: "center", fontSize: 40, opacity: cap }}>
        <Tex tex="f'(x_0)" />: tốc độ thay đổi của <Tex tex="f" /> ngay tại <Tex tex="x_0" />
      </div>
    </AbsoluteFill>
  );
};

// ---------------- b06: công thức → thay số → 10 ----------------
const STEPS = ["\\dfrac{5x^2-5}{x-1}", "=\\dfrac{5(x-1)(x+1)}{x-1}", "=5(x+1)"];

export const Beat06: React.FC<BeatProps> = ({ L, E }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const formula = ramp(frame, 0, 14);
  const colored = ramp(frame, L[1], L[1] + 14);
  const d2 = E[2] - L[2];
  const steps = [L[2], L[2] + 0.35 * d2, L[2] + 0.7 * d2].map((f) => ramp(frame, f, f + 12));
  const result = spring({ frame: frame - L[3], fps, config: { damping: 14 } });
  const cardLeft = interpolate(ramp(frame, L[2] - 6, L[2] + 12), [0, 1], [560, 120]);
  const plain = "f'(x_0)=\\lim\\limits_{x\\to x_0}\\dfrac{f(x)-f(x_0)}{x-x_0}";
  const col = `f'(x_0)=\\lim\\limits_{x\\to x_0}\\dfrac{\\textcolor{${colors.c2}}{f(x)-f(x_0)}}{\\textcolor{${colors.c1}}{x-x_0}}`;

  return (
    <AbsoluteFill>
      <Card style={{ left: cardLeft, top: 150, width: 800, height: 520, opacity: formula }}>
        <div style={{ position: "absolute", left: 0, right: 0, top: 70, fontSize: 60, color: colors.text, textAlign: "center" }}>
          <div data-text="formula" style={{ position: "absolute", left: 0, right: 0, opacity: 1 - colored }}>
            <Tex tex={plain} display />
          </div>
          <div style={{ position: "absolute", left: 0, right: 0, opacity: colored }}>
            <Tex tex={col} display />
          </div>
        </div>
        <div style={{ position: "absolute", left: 60, top: 330, display: "flex", flexDirection: "column", gap: 22, opacity: colored }}>
          <div data-text="label" style={{ ...label, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ width: 22, height: 22, borderRadius: 11, background: colors.c2 }} /> tử: phần <Tex tex="f" /> thay đổi
          </div>
          <div data-text="label" style={{ ...label, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ width: 22, height: 22, borderRadius: 11, background: colors.c1 }} /> mẫu: phần <Tex tex="x" /> thay đổi
          </div>
        </div>
      </Card>
      <Card style={{ left: 980, top: 150, width: 820, height: 520, opacity: steps[0] }}>
        <div data-text="label" style={{ ...label, position: "absolute", left: 40, top: 28, fontSize: 36, color: colors.muted }}>
          <Tex tex="f(x)=5x^2,\ x_0=1" />
        </div>
        <div style={{ position: "absolute", left: 50, top: 110, display: "flex", alignItems: "center", gap: 18, fontSize: 44, color: colors.text }}>
          <div data-text="step" style={{ opacity: steps[0] }}>
            <Tex tex={STEPS[0]} />
          </div>
          <div data-text="step" style={{ opacity: steps[1] }}>
            <Tex tex={STEPS[1]} />
          </div>
        </div>
        <div data-text="step" style={{ position: "absolute", left: 50, top: 270, fontSize: 44, color: colors.text, opacity: steps[2] }}>
          <Tex tex={STEPS[2]} />
        </div>
        <div
          data-text="step"
          style={{
            position: "absolute",
            left: 50,
            top: 390,
            display: "flex",
            alignItems: "center",
            gap: 24,
            fontSize: 44,
            color: colors.text,
            opacity: result,
            scale: interpolate(result, [0, 1], [0.9, 1]),
            transformOrigin: "left center",
          }}
        >
          <Tex tex="x\to 1:\ 5(x+1)\to" />
          <span style={{ padding: "2px 22px", border: `4px solid ${colors.accent}`, borderRadius: 14, color: colors.accent, fontWeight: 800, fontFamily: fontText }}>10</span>
          <span style={{ ...label, color: colors.increase, fontWeight: 800 }}>✓ 10 m/s</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};
