import React from "react";
import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { BeatProps, clamp, ramp } from "../../components/BeatShell";
import { Card } from "../../components/Card";
import { Tex } from "../../components/MathText";
import { colors, fontSize, fontText, halo, tint } from "../../components/theme";
import { BallPhoto, Stopwatch } from "./parts";

export const label: React.CSSProperties = {
  fontFamily: fontText,
  fontWeight: 600,
  fontSize: fontSize.label,
  color: colors.text,
};

// ---------------- b01: ảnh chụp quả bóng đang rơi ----------------
export const Beat01: React.FC<BeatProps> = ({ L }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const flash = interpolate(
    frame,
    [L[0], L[0] + 2, L[0] + 8],
    [0, 0.9, 0],
    clamp,
  );
  const photoIn = ramp(frame, L[0], L[0] + 10);
  const shift = ramp(frame, L[1], L[1] + 18);
  const card = spring({
    frame: frame - L[1] - 8,
    fps,
    config: { damping: 16 },
  });
  const q = spring({
    frame: frame - L[2],
    fps,
    config: { damping: 11, stiffness: 140 },
  });
  // Trạng thái 1: ảnh giữa khung. Trạng thái 2: ảnh + "?" + thẻ cân giữa vùng hình.
  const photoLeft = interpolate(shift, [0, 1], [700, 330]);

  return (
    <AbsoluteFill>
      <BallPhoto left={photoLeft} top={150} opacity={photoIn} />
      <div
        data-text="question"
        style={{
          position: "absolute",
          left: 905,
          top: 170,
          fontFamily: fontText,
          fontWeight: 800,
          fontSize: 190,
          lineHeight: 1,
          color: colors.accent,
          opacity: interpolate(q, [0, 0.3], [0, 1], clamp),
          scale: interpolate(q, [0, 1], [0.4, 1]),
        }}
      >
        ?
      </div>
      <Card
        style={{
          left: 1110,
          top: 250,
          width: 500,
          padding: "32px 36px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 22,
          opacity: card,
          translate: `${(1 - card) * 40}px 0px`,
        }}
      >
        <Stopwatch label="1,00 s" />
        <div data-text="card" style={{ ...label, textAlign: "center" }}>
          Một khoảnh khắc:
          <br />
          bóng đứng yên
        </div>
      </Card>
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />
    </AbsoluteFill>
  );
};

// ---------------- b02: ảnh hoạt nghiệm + bảng vận tốc trung bình ----------------
const TS = [0, 0.5, 1, 1.5, 2];
const RULER_TOP = 200; // y của 0 m (toạ độ trang)
const PX_PER_M = 23; // 20 m → 460 px
const yOf = (m: number) => RULER_TOP + m * PX_PER_M;

const ROWS = [
  { to: "giây 2", fall: "20 − 5 = 15 m", v: "15 m/s" },
  { to: "giây 1,1", fall: "6,05 − 5 = 1,05 m", v: "10,5 m/s" },
  { to: "giây 1,01", fall: "5,1005 − 5 = 0,1005 m", v: "10,05 m/s" },
];

export const Beat02: React.FC<BeatProps> = ({ L, E }) => {
  const frame = useCurrentFrame();
  const d0 = E[0] - L[0];
  const d2 = E[2] - L[2];
  const seg = ramp(frame, L[1], L[1] + 20);
  const rowO = [
    ramp(frame, L[1] + 10, L[1] + 22),
    ramp(frame, L[2], L[2] + 12),
    ramp(frame, L[2] + 0.5 * d2, L[2] + 0.5 * d2 + 12),
  ];
  // Dòng 1: cột hoạt nghiệm ở giữa khung; dòng 2: trượt sang trái nhường chỗ cho bảng.
  const shiftX = interpolate(
    ramp(frame, L[1] - 4, L[1] + 14),
    [0, 1],
    [575, 0],
  );

  return (
    <AbsoluteFill>
      <AbsoluteFill style={{ translate: `${shiftX}px 0px` }}>
        <Card style={{ left: 150, top: 130, width: 470, height: 560 }} />
        <svg
          width={1920}
          height={1080}
          style={{ position: "absolute", inset: 0 }}
        >
          <line
            x1={250}
            y1={yOf(0)}
            x2={250}
            y2={yOf(20)}
            stroke={colors.axis}
            strokeWidth={4}
          />
          {[0, 5, 10, 15, 20].map((m) => (
            <g key={m}>
              <line
                x1={238}
                x2={262}
                y1={yOf(m)}
                y2={yOf(m)}
                stroke={colors.axis}
                strokeWidth={4}
              />
              <text
                data-text="tick"
                x={224}
                y={yOf(m) + 10}
                textAnchor="end"
                fontFamily={fontText}
                fontSize={fontSize.tick}
                fill={colors.muted}
              >
                {m}
              </text>
            </g>
          ))}
          <text
            data-text="axis"
            x={250}
            y={yOf(0) - 26}
            textAnchor="middle"
            fontFamily={fontText}
            fontWeight={600}
            fontSize={fontSize.tick}
            fill={colors.muted}
          >
            m
          </text>
          <line
            x1={272}
            x2={272}
            y1={yOf(5)}
            y2={yOf(5) + (yOf(20) - yOf(5)) * seg}
            stroke={colors.c2}
            strokeWidth={10}
            strokeLinecap="round"
            opacity={seg > 0 ? 1 : 0}
          />
          {TS.map((t, i) => (
            <circle
              key={t}
              data-mark="ball"
              cx={360}
              cy={yOf(5 * t * t)}
              r={13}
              fill="#F59E0B"
              stroke="#B85E06"
              strokeWidth={3}
              opacity={ramp(
                frame,
                L[0] + (i * d0) / 6,
                L[0] + (i * d0) / 6 + 8,
              )}
            />
          ))}
        </svg>
        {[1, 2].map((t) => (
          <div
            key={t}
            data-text="label"
            style={{
              ...label,
              position: "absolute",
              left: 392,
              top: yOf(5 * t * t),
              translate: "0 -50%",
              fontSize: 30,
              color: colors.muted,
              opacity: ramp(frame, L[0] + d0 * 0.6, L[0] + d0 * 0.6 + 10),
            }}
          >
            t = {t} s
          </div>
        ))}
        <div
          data-text="label"
          style={{
            ...label,
            position: "absolute",
            left: 392,
            top: yOf(12.5),
            translate: "0 -50%",
            color: colors.c2,
            opacity: seg,
          }}
        >
          +15 m
        </div>
        <div
          data-text="formula"
          style={{
            ...label,
            position: "absolute",
            left: 400,
            top: 146,
            opacity: ramp(frame, L[0], L[0] + 10),
          }}
        >
          <Tex tex="s=5t^2" />
        </div>
      </AbsoluteFill>
      <Card
        group="table"
        style={{
          left: 690,
          top: 200,
          width: 1080,
          overflow: "hidden",
          opacity: rowO[0],
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "260px 470px 350px",
            fontSize: 34,
            fontWeight: 700,
            background: tint(colors.brandBlue, 0.1),
          }}
        >
          {["Từ giây 1 đến", "Rơi thêm", "Trung bình"].map((h) => (
            <div key={h} data-text="th" style={{ padding: "18px 26px" }}>
              {h}
            </div>
          ))}
        </div>
        {ROWS.map((r, i) => (
          <div
            key={r.to}
            style={{
              display: "grid",
              gridTemplateColumns: "260px 470px 350px",
              fontSize: 36,
              fontWeight: 600,
              borderTop: `2px solid ${colors.panelBorder}`,
              opacity: rowO[i],
            }}
          >
            <div data-text="td" style={{ padding: "20px 26px" }}>
              {r.to}
            </div>
            <div
              data-text="td"
              style={{ padding: "20px 26px", color: colors.muted }}
            >
              {r.fall}
            </div>
            <div
              data-text="td"
              style={{
                padding: "20px 26px",
                fontWeight: 800,
                color: i === 0 ? colors.c2 : colors.accent,
              }}
            >
              {r.v}
            </div>
          </div>
        ))}
      </Card>
    </AbsoluteFill>
  );
};

// ---------------- b03: các con số dồn về 10 = giới hạn ----------------
const NL = { left: 260, right: 1660, y: 360, min: 9, max: 16 };
const nx = (v: number) =>
  NL.left + ((v - NL.min) / (NL.max - NL.min)) * (NL.right - NL.left);
const PTS = [
  { v: 15, text: "15", dy: -54 },
  { v: 10.5, text: "10,5", dy: -54 },
  { v: 10.05, text: "10,05", dy: -120 },
];

export const Beat03: React.FC<BeatProps> = ({ L, E }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d0 = E[0] - L[0];
  const drop = PTS.map((_, i) =>
    spring({
      frame: frame - L[0] - i * 0.28 * d0,
      fps,
      config: { damping: 14 },
    }),
  );
  const arrow = ramp(frame, L[0] + 0.75 * d0, E[0]);
  const lim = ramp(frame, L[1], L[1] + 14);
  const card = spring({ frame: frame - L[2], fps, config: { damping: 16 } });
  const pulse =
    frame > L[0] + 0.75 * d0 ? 1 + 0.15 * Math.sin((frame - L[0]) * 0.3) : 1;

  return (
    <AbsoluteFill>
      <svg
        width={1920}
        height={1080}
        style={{ position: "absolute", inset: 0, overflow: "visible" }}
      >
        <line
          x1={NL.left - 20}
          x2={NL.right + 30}
          y1={NL.y}
          y2={NL.y}
          stroke={colors.axis}
          strokeWidth={4}
        />
        <polygon
          points={`${NL.right + 46},${NL.y} ${NL.right + 28},${NL.y - 9} ${NL.right + 28},${NL.y + 9}`}
          fill={colors.axis}
        />
        {[9, 10, 11, 12, 13, 14, 15, 16].map((v) => (
          <g key={v}>
            <line
              x1={nx(v)}
              x2={nx(v)}
              y1={NL.y - 10}
              y2={NL.y + 10}
              stroke={colors.axis}
              strokeWidth={4}
            />
            <text
              data-text="tick"
              x={nx(v)}
              y={NL.y + 46}
              textAnchor="middle"
              fontFamily={fontText}
              fontSize={fontSize.tick}
              fill={v === 10 ? colors.accent : colors.muted}
              fontWeight={v === 10 ? 800 : 400}
            >
              {v}
            </text>
          </g>
        ))}
        <circle
          cx={nx(10)}
          cy={NL.y}
          r={14 * pulse}
          fill="none"
          stroke={colors.accent}
          strokeWidth={4}
          opacity={arrow}
        />
        <path
          d={`M${nx(15)},${NL.y - 120} Q${nx(12.8)},${NL.y - 250} ${nx(11)},${NL.y - 160}`}
          fill="none"
          stroke={colors.accent}
          strokeWidth={4}
          strokeDasharray="12 10"
          opacity={arrow}
        />
        <polygon
          points={`${nx(11) - 2},${NL.y - 178} ${nx(11) + 10},${NL.y - 156} ${nx(11) - 16},${NL.y - 152}`}
          fill={colors.accent}
          opacity={arrow}
        />
        {PTS.map((p, i) => (
          <g key={p.v} opacity={drop[i]}>
            {p.dy < -60 ? (
              <line
                x1={nx(p.v)}
                x2={nx(p.v)}
                y1={NL.y - 14}
                y2={NL.y + p.dy + 24}
                stroke={colors.muted}
                strokeWidth={2}
              />
            ) : null}
            <circle
              data-mark="point"
              cx={nx(p.v)}
              cy={NL.y - (1 - drop[i]) * 120}
              r={11}
              fill={i === 0 ? colors.c2 : colors.brandBlue}
              stroke="#FFFFFF"
              strokeWidth={3}
            />
          </g>
        ))}
      </svg>
      {PTS.map((p, i) => (
        <div
          key={p.v}
          data-text="label"
          style={{
            ...label,
            position: "absolute",
            left: nx(p.v),
            top: NL.y + p.dy,
            translate: "-50% -50%",
            fontWeight: 700,
            opacity: drop[i],
            textShadow: halo(),
          }}
        >
          {p.text}
        </div>
      ))}
      <div
        data-text="label"
        style={{
          ...label,
          position: "absolute",
          left: nx(10),
          top: NL.y + 96,
          translate: "-50% 0",
          color: colors.accent,
          fontWeight: 800,
          opacity: lim,
        }}
      >
        giới hạn
      </div>
      <div
        data-text="label"
        style={{
          ...label,
          position: "absolute",
          left: nx(10) + 120,
          top: NL.y + 100,
          color: colors.muted,
          fontSize: 34,
          opacity: lim,
          whiteSpace: "nowrap",
        }}
      >
        (khi khoảng thời gian co về 0)
      </div>
      <Card
        style={{
          left: 560,
          top: 560,
          width: 800,
          padding: "20px 32px",
          display: "flex",
          alignItems: "center",
          gap: 26,
          opacity: card,
          translate: `0px ${(1 - card) * 24}px`,
        }}
      >
        <svg width={64} height={64}>
          <circle
            cx={32}
            cy={32}
            r={27}
            fill="#F59E0B"
            stroke="#B85E06"
            strokeWidth={3}
          />
        </svg>
        <div data-text="card" style={{ ...label, fontSize: 38 }}>
          Vận tốc tức thời tại <Tex tex="t=1" />:{" "}
          <b style={{ color: colors.accent }}>10 m/s</b>
        </div>
      </Card>
    </AbsoluteFill>
  );
};
