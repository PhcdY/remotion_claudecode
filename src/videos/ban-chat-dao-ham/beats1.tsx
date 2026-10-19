import React from "react";
import { AbsoluteFill, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BeatProps, clamp, ramp } from "../../components/BeatShell";
import { Card } from "../../components/Card";
import { Tex } from "../../components/MathText";
import { colors, fontText, tint } from "../../components/theme";
import { fmt } from "../../components/plot";
import { BigQuestion, EBike, Polaroid, RACE_TIME, RaceStats, Runner, TRACK, Tag, Track, boltPos, label, mx } from "./parts";

// Bố cục chung của b01 và b10 (GIẢI ĐÁP dùng lại đúng hình này).
const TOP = 400; // mép trên đường chạy (2 làn)
const FOOT = TOP + TRACK.laneH * 0.75; // chân người chạy, làn 1
const GROUND2 = TOP + TRACK.laneH * 1.85; // bánh xe đạp điện, làn 2
const BELOW = TOP + TRACK.laneH * 2 + 75; // dòng nhãn dưới số vạch chia
const E_BIKE = 25 / 3.6; // m/s
const linear = Easing.linear;

/** Nhãn "Bolt" trên đầu người chạy. */
const RunnerName: React.FC<{ x: number; opacity?: number }> = ({ x, opacity = 1 }) => (
  <Tag x={x + 16} y={FOOT - 212} weight={800} opacity={opacity}>
    Bolt
  </Tag>
);

// ---------------- b01: HIỆN TƯỢNG — cú chạy 9,58 s ----------------
export const Beat01: React.FC<BeatProps> = ({ L, E }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const scene = ramp(frame, 0, 12);
  // Dòng 1: chạy thật (thời gian nén lại); dòng 2: chạy lại cùng xe đạp điện.
  const t1 = ramp(frame, L[0] + 8, E[0] - 4, linear) * RACE_TIME;
  const t2 = ramp(frame, L[1] + 6, E[1] - 6, linear) * RACE_TIME;
  const replay = frame >= L[1];
  const t = replay ? t2 : t1;
  const pos = boltPos(t);
  const bikeO = ramp(frame, L[1], L[1] + 8) * (1 - ramp(frame, L[2] - 4, L[2] + 8));
  const bikeM = Math.min(100, E_BIKE * t2);
  const seg = ramp(frame, L[2], L[2] + 14);
  const freeze = ramp(frame, L[3], L[3] + 10);
  const flash = interpolate(frame, [L[3] + 4, L[3] + 6, L[3] + 12], [0, 0.7, 0], clamp);
  const q = spring({ frame: frame - L[3] - 10, fps, config: { damping: 11, stiffness: 140 } });
  const running = pos > 0 && pos < 100;

  return (
    <AbsoluteFill style={{ opacity: scene }}>
      <RaceStats time={replay && frame >= E[1] - 6 ? RACE_TIME : t} avgOpacity={ramp(frame, L[1], L[1] + 12)} />
      <Track top={TOP} lanes={2} highlight={{ from: 60, to: 70, opacity: seg }}>
        <Runner x={mx(pos)} foot={FOOT} phase={running ? pos * 0.9 : 0} opacity={1 - freeze} />
        <Runner x={mx(65)} foot={FOOT} phase={1.3} opacity={freeze} />
        <EBike x={mx(bikeM)} ground={GROUND2} opacity={bikeO} />
      </Track>
      <RunnerName x={mx(pos)} opacity={1 - freeze} />
      <RunnerName x={mx(65)} opacity={freeze} />
      <Tag x={mx(bikeM) - 40} y={BELOW} anchor="left" color={colors.increase} opacity={bikeO}>
        xe đạp điện: tối đa 25 km/h
      </Tag>
      <Tag x={mx(65)} y={BELOW} color={colors.accent} weight={700} opacity={seg}>
        đoạn 60 → 70 m: 0,81 s · tốc độ ≈ 44 km/h
      </Tag>
      <BigQuestion x={mx(65) + 70} y={FOOT - 190} p={q} />
      <AbsoluteFill style={{ background: "#FFFFFF", opacity: flash }} />
    </AbsoluteFill>
  );
};

// ---------------- b02: CÂU HỎI — một khoảnh khắc ra 0/0 ----------------
const FrozenRunnerPhoto: React.FC = () => (
  <>
    <defs>
      <linearGradient id="sky2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#CFE2FF" />
        <stop offset="1" stopColor="#F2F7FF" />
      </linearGradient>
    </defs>
    <rect width={472} height={472} fill="url(#sky2)" />
    <rect x={0} y={360} width={472} height={112} fill="#E07A5A" />
    <line x1={0} x2={472} y1={416} y2={416} stroke="#FFFFFF" strokeWidth={3} opacity={0.8} />
    {[0, 1, 2].map((i) => (
      <line key={i} x1={70 + i * 12} x2={170} y1={250 + i * 34} y2={250 + i * 34} stroke={colors.brandBlue} strokeOpacity={0.35} strokeWidth={6} strokeLinecap="round" />
    ))}
    <Runner x={250} foot={392} phase={1.3} scale={1.5} />
  </>
);

export const Beat02: React.FC<BeatProps> = ({ L }) => {
  const frame = useCurrentFrame();
  const photo = ramp(frame, 0, 12);
  const f1 = ramp(frame, L[0], L[0] + 12);
  const f2 = ramp(frame, L[1], L[1] + 12);
  const f3 = ramp(frame, L[2], L[2] + 12);
  const strike = ramp(frame, L[2] + 14, L[2] + 30);
  const X = 760;
  return (
    <AbsoluteFill>
      <Polaroid left={170} top={150} scale={0.86} opacity={photo} caption="một khoảnh khắc">
        <FrozenRunnerPhoto />
      </Polaroid>
      <div data-text="formula" style={{ ...label, position: "absolute", left: X, top: 180, fontSize: 44, opacity: f1 }}>
        vận tốc trung bình = <span style={{ color: colors.c2 }}>quãng đường (m)</span> : <span style={{ color: colors.c1 }}>thời gian (s)</span>
      </div>
      <div data-text="formula" style={{ ...label, position: "absolute", left: X + 430, top: 270, fontSize: 52, fontWeight: 700, opacity: f2 }}>
        = <span style={{ color: colors.c2 }}>0 m</span> : <span style={{ color: colors.c1 }}>0 s</span>
      </div>
      <div style={{ position: "absolute", left: X + 160, top: 380, width: 260, height: 260, opacity: f3 }}>
        <div data-text="formula" style={{ position: "absolute", left: 0, right: 0, top: 20, textAlign: "center", fontSize: 110, color: colors.text }}>
          <Tex tex="\dfrac{0}{0}" />
        </div>
        <svg width={260} height={260} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
          <line x1={30} y1={230} x2={30 + 200 * strike} y2={230 - 200 * strike} stroke={colors.decrease} strokeWidth={12} strokeLinecap="round" opacity={strike > 0 ? 1 : 0} />
        </svg>
      </div>
      <Tag x={X + 470} y={480} anchor="left" color={colors.decrease} weight={800} size={48} opacity={strike}>
        không xác định
      </Tag>
    </AbsoluteFill>
  );
};

// ---------------- b03: TRỰC GIÁC — khoảng ngắn dần trên số liệu thật ----------------
const T3 = 150; // mép trên đường chạy (1 làn)
const ROWS3 = [
  { seg: "0 → 100 m", t: "9,58", v: "10,4", from: 0, to: 100 },
  { seg: "60 → 80 m", t: "1,63", v: "12,3", from: 60, to: 80 },
  { seg: "60 → 70 m", t: "0,81", v: "12,35  (≈ 44 km/h)", from: 60, to: 70 },
  { seg: "đoạn ngắn hơn 10 m", t: "?", v: "không có số liệu", from: 60, to: 70 },
];
const GRID3 = "420px 300px 540px";

export const Beat03: React.FC<BeatProps> = ({ L, E }) => {
  const frame = useCurrentFrame();
  const d1 = E[1] - L[1];
  const at = [L[1], L[1] + 0.5 * d1, L[2], L[3]];
  const rowO = at.map((f) => ramp(frame, f, f + 12));
  // Đoạn sáng trên đường chạy co dần theo hàng đang xét.
  const from = interpolate(frame, [at[0], at[1], at[1] + 12], [0, 0, 60], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const to = interpolate(frame, [at[1], at[1] + 12, at[2], at[2] + 12], [100, 80, 80, 70], { ...clamp, easing: Easing.inOut(Easing.cubic) });
  const segO = ramp(frame, L[1], L[1] + 10);
  const lens = ramp(frame, L[3], L[3] + 14);
  const arrow = ramp(frame, L[2] + 10, L[2] + 30);

  return (
    <AbsoluteFill>
      <Track top={T3} lanes={1} highlight={{ from, to, opacity: segO }}>
        <g opacity={lens}>
          <line x1={mx(65) + 40} y1={T3 + 60} x2={mx(65) + 76} y2={T3 + 96} stroke={colors.text} strokeWidth={12} strokeLinecap="round" />
          <circle cx={mx(65)} cy={T3 + 22} r={52} fill="#FFFFFF" fillOpacity={0.92} stroke={colors.text} strokeWidth={8} />
          <text x={mx(65)} y={T3 + 40} textAnchor="middle" fontFamily={fontText} fontWeight={800} fontSize={52} fill={colors.warn}>
            ?
          </text>
        </g>
      </Track>
      <Card group="table" style={{ left: 140, top: 310, overflow: "hidden", opacity: ramp(frame, L[0], L[0] + 12) }}>
        <div style={{ display: "grid", gridTemplateColumns: GRID3, fontSize: 36, fontWeight: 700, background: tint(colors.brandBlue, 0.1) }}>
          {["Đoạn đường", "Thời gian (s)", "Vận tốc trung bình (m/s)"].map((h) => (
            <div key={h} data-text="th" style={{ padding: "14px 26px" }}>
              {h}
            </div>
          ))}
        </div>
        {ROWS3.map((r, i) => (
          <div
            key={r.seg}
            style={{
              display: "grid",
              gridTemplateColumns: GRID3,
              fontSize: 38,
              fontWeight: 600,
              borderTop: `2px solid ${colors.panelBorder}`,
              opacity: rowO[i],
              color: i === 3 ? colors.muted : colors.text,
            }}
          >
            <div data-text="td" style={{ padding: "14px 26px" }}>
              {r.seg}
            </div>
            <div data-text="td" style={{ padding: "14px 26px" }}>
              {r.t}
            </div>
            <div data-text="td" style={{ padding: "14px 26px", fontWeight: 800, color: i === 3 ? colors.warn : i === 2 ? colors.accent : colors.text }}>
              {r.v}
            </div>
          </div>
        ))}
      </Card>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g opacity={arrow}>
          <line x1={1500} y1={400} x2={1500} y2={580} stroke={colors.accent} strokeWidth={8} strokeLinecap="round" />
          <polygon points="1482,572 1518,572 1500,606" fill={colors.accent} />
        </g>
      </svg>
      <div data-text="label" style={{ ...label, position: "absolute", left: 1540, top: 450, color: colors.accent, fontWeight: 700, opacity: arrow, lineHeight: 1.25 }}>
        khoảng
        <br />
        ngắn dần
      </div>
    </AbsoluteFill>
  );
};

// ---------------- b10: GIẢI ĐÁP — quay lại đường chạy ----------------
export const Beat10: React.FC<BeatProps> = ({ L, E, T0 }) => {
  const frame = useCurrentFrame();
  const a0 = Math.max(L[0], T0);
  const seg = ramp(frame, a0, a0 + 12);
  const avgNote = ramp(frame, L[1], L[1] + 10);
  // Dòng 3: đoạn đo co dần 10 m → 1 m → 0,1 m quanh mốc 65 m (thang log).
  const shrink = ramp(frame, L[2] + 6, E[2] - 6, Easing.inOut(Easing.quad));
  const len = 10 * Math.pow(0.01, shrink);
  const inst = ramp(frame, L[3], L[3] + 12);
  const pointO = ramp(frame, L[2] + 0.6 * (E[2] - L[2]), E[2]);
  const msg = frame >= L[3] ? 3 : frame >= L[2] ? 2 : frame >= L[1] ? 1 : 0;

  return (
    <AbsoluteFill>
      <RaceStats time={RACE_TIME} avgOpacity={1} />
      <Track top={TOP} lanes={2} highlight={{ from: 65 - len / 2, to: 65 + len / 2, opacity: seg }}>
        <Runner x={mx(65)} foot={FOOT} phase={1.3} />
        <circle data-mark="point" cx={mx(65)} cy={TOP + TRACK.laneH} r={12} fill={colors.accent} stroke="#FFFFFF" strokeWidth={4} opacity={pointO} />
      </Track>
      <RunnerName x={mx(65)} />
      <Tag x={mx(65)} y={BELOW} color={colors.accent} weight={700} opacity={seg * (msg === 0 ? 1 : 0)}>
        đoạn 60 → 70 m: 0,81 s · tốc độ ≈ 44 km/h
      </Tag>
      <Tag x={mx(65)} y={BELOW} color={colors.accent} weight={700} opacity={avgNote * (msg === 1 ? 1 : 0)}>
        ≈ 44 km/h = vận tốc trung bình trên đoạn 10 m
      </Tag>
      <Tag x={mx(65)} y={BELOW} color={colors.accent} weight={700} opacity={msg === 2 ? 1 : 0}>
        khoảng đo co dần: {fmt(len, len < 1 ? 2 : 1)} m{shrink > 0.95 ? " → một khoảnh khắc" : ""}
      </Tag>
      <Tag x={mx(65)} y={BELOW} color={colors.accent} weight={800} opacity={inst * (msg === 3 ? 1 : 0)}>
        vận tốc tức thời = <Tex tex="s'(t)" />{" "}
        <span style={{ color: colors.muted, fontWeight: 600 }}>
          (<Tex tex="s" />: quãng đường, <Tex tex="t" />: thời gian)
        </span>
      </Tag>
    </AbsoluteFill>
  );
};
