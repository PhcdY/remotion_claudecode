import React from "react";
import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BeatProps, ramp } from "../../components/BeatShell";
import { Card } from "../../components/Card";
import { Tex } from "../../components/MathText";
import { colors, fontSize, fontText, halo, tint } from "../../components/theme";
import { Tag, label } from "./parts";

const Ball: React.FC<{ cx: number; cy: number; r?: number; color?: string; opacity?: number }> = ({ cx, cy, r = 14, color = "#F59E0B", opacity = 1 }) => (
  <circle data-mark="ball" cx={cx} cy={cy} r={r} fill={color} stroke="#B85E06" strokeWidth={3} opacity={opacity} />
);

/** Chữ thường xen công thức $...$ */
const MathLine: React.FC<{ text: string }> = ({ text }) => (
  <>{text.split("$").map((p, i) => (i % 2 ? <Tex key={i} tex={p} /> : <span key={i}>{p}</span>))}</>
);

// ---------------- b04: VÍ DỤ — quả bóng rơi s = 5t² ----------------
const RULER = { x: 250, top: 440, pxPerM: 11 }; // 0 m ở trên, 20 m → 260 px
const yOf = (m: number) => RULER.top + m * RULER.pxPerM;
const ROWS4 = [
  { dt: "1 s", fall: "20 − 5 = 15", v: "15" },
  { dt: "0,1 s", fall: "6,05 − 5 = 1,05", v: "10,5" },
  { dt: "0,01 s", fall: "5,1005 − 5 = 0,1005", v: "10,05" },
];
const GRID4 = "340px 420px 330px";

export const Beat04: React.FC<BeatProps> = ({ L, E }) => {
  const frame = useCurrentFrame();
  const d0 = E[0] - L[0];
  const d3 = E[3] - L[3];
  const ballO = [0, 1, 2].map((i) => ramp(frame, L[0] + (0.3 + i * 0.2) * d0, L[0] + (0.3 + i * 0.2) * d0 + 8));
  const hl = ramp(frame, L[1], L[1] + 10);
  const bar = ramp(frame, L[1] + 8, L[1] + 28);
  const rowO = [L[2], L[3], L[3] + 0.5 * d3].map((f) => ramp(frame, f, f + 12));

  return (
    <AbsoluteFill>
      <Card style={{ left: 120, top: 120, width: 600, height: 590, opacity: ramp(frame, 0, 12) }}>
        <div data-text="formula" style={{ position: "absolute", left: 40, top: 22, fontSize: 52, color: colors.text }}>
          <Tex tex="s=5t^2" />
        </div>
        <div data-text="label" style={{ ...label, position: "absolute", left: 40, top: 114, lineHeight: 1.35 }}>
          <Tex tex="s" />: quãng đường rơi (m)
          <br />
          <Tex tex="t" />: thời gian (s)
        </div>
      </Card>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0 }}>
        <g opacity={ramp(frame, 0, 12)}>
          <line x1={RULER.x} y1={yOf(0)} x2={RULER.x} y2={yOf(20)} stroke={colors.axis} strokeWidth={4} />
          {[0, 5, 10, 15, 20].map((m) => (
            <g key={m}>
              <line x1={RULER.x - 12} x2={RULER.x + 12} y1={yOf(m)} y2={yOf(m)} stroke={colors.axis} strokeWidth={4} />
              <text data-text="tick" x={RULER.x - 24} y={yOf(m) + 10} textAnchor="end" fontFamily={fontText} fontSize={fontSize.tick} fill={colors.muted}>
                {m}
              </text>
            </g>
          ))}
          <text data-text="axis" x={RULER.x - 24} y={yOf(0) - 40} textAnchor="middle" fontFamily={fontText} fontWeight={600} fontSize={fontSize.tick} fill={colors.text}>
            s (m)
          </text>
        </g>
        <line x1={RULER.x + 30} x2={RULER.x + 30} y1={yOf(5)} y2={yOf(5) + (yOf(20) - yOf(5)) * bar} stroke={colors.c2} strokeWidth={10} strokeLinecap="round" opacity={bar > 0 ? 1 : 0} />
        {[0, 1, 2].map((t, i) => (
          <Ball key={t} cx={RULER.x + 90} cy={yOf(5 * t * t)} opacity={ballO[i]} color={t === 1 && hl > 0.5 ? colors.accent : "#F59E0B"} />
        ))}
      </svg>
      {[0, 1, 2].map((t, i) => (
        <Tag key={t} x={RULER.x + 122} y={yOf(5 * t * t) - (t === 0 ? 34 : 14)} anchor="left" color={t === 1 && hl > 0.5 ? colors.accent : colors.muted} opacity={ballO[i]}>
          <Tex tex={`t=${t}`} /> s
        </Tag>
      ))}
      <div data-text="label" style={{ ...label, position: "absolute", left: RULER.x + 260, top: yOf(9), color: colors.c2, fontWeight: 700, opacity: bar, lineHeight: 1.25, textShadow: halo() }}>
        rơi thêm 15 m
        <br />
        trong 1 s
      </div>
      <Card group="table" style={{ left: 770, top: 180, overflow: "hidden", opacity: rowO[0] }}>
        <div style={{ display: "grid", gridTemplateColumns: GRID4, fontSize: 36, fontWeight: 700, background: tint(colors.brandBlue, 0.1), lineHeight: 1.25 }}>
          <div data-text="th" style={{ padding: "16px 24px" }}>
            Khoảng thời gian
            <br />
            (từ <Tex tex="t=1" /> s)
          </div>
          <div data-text="th" style={{ padding: "16px 24px" }}>
            Quãng rơi thêm (m)
          </div>
          <div data-text="th" style={{ padding: "16px 24px" }}>
            Vận tốc trung bình (m/s)
          </div>
        </div>
        {ROWS4.map((r, i) => (
          <div key={r.dt} style={{ display: "grid", gridTemplateColumns: GRID4, fontSize: 38, fontWeight: 600, borderTop: `2px solid ${colors.panelBorder}`, opacity: rowO[i] }}>
            <div data-text="td" style={{ padding: "18px 24px" }}>
              {r.dt}
            </div>
            <div data-text="td" style={{ padding: "18px 24px", color: colors.muted }}>
              {r.fall}
            </div>
            <div data-text="td" style={{ padding: "18px 24px", fontWeight: 800, color: i === 0 ? colors.c2 : colors.accent }}>
              {r.v}
            </div>
          </div>
        ))}
      </Card>
    </AbsoluteFill>
  );
};

// ---------------- b05: BẢN CHẤT — các số dồn về 10 = giới hạn ----------------
const NL = { left: 260, right: 1660, y: 430, min: 9, max: 16 };
const nx = (v: number) => NL.left + ((v - NL.min) / (NL.max - NL.min)) * (NL.right - NL.left);
const PTS = [
  { v: 15, text: "15", note: "khoảng 1 s", top: 300, color: colors.c2, dx: 0 },
  { v: 10.5, text: "10,5", note: "khoảng 0,1 s", top: 300, color: colors.brandBlue, dx: 70 },
  { v: 10.05, text: "10,05", note: "khoảng 0,01 s", top: 160, color: colors.brandBlue, dx: -80 },
];

export const Beat05: React.FC<BeatProps> = ({ L, E }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d0 = E[0] - L[0];
  const drop = PTS.map((_, i) => spring({ frame: frame - L[0] - i * 0.25 * d0, fps, config: { damping: 14 } }));
  const arrow = ramp(frame, L[0] + 0.75 * d0, E[0]);
  const lim = ramp(frame, L[1], L[1] + 14);
  const noDiv = ramp(frame, L[2], L[2] + 12);
  const card = spring({ frame: frame - L[3], fps, config: { damping: 16 } });
  const pulse = frame > L[0] + 0.75 * d0 ? 1 + 0.15 * Math.sin((frame - L[0]) * 0.3) : 1;

  return (
    <AbsoluteFill>
      <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, overflow: "visible" }}>
        <line x1={NL.left - 20} x2={NL.right + 30} y1={NL.y} y2={NL.y} stroke={colors.axis} strokeWidth={4} />
        <polygon points={`${NL.right + 46},${NL.y} ${NL.right + 28},${NL.y - 9} ${NL.right + 28},${NL.y + 9}`} fill={colors.axis} />
        {[9, 10, 11, 12, 13, 14, 15, 16].map((v) => (
          <g key={v}>
            <line x1={nx(v)} x2={nx(v)} y1={NL.y - 10} y2={NL.y + 10} stroke={colors.axis} strokeWidth={4} />
            <text data-text="tick" x={nx(v)} y={NL.y + 46} textAnchor="middle" fontFamily={fontText} fontSize={fontSize.tick} fill={v === 10 ? colors.accent : colors.muted} fontWeight={v === 10 ? 800 : 400}>
              {v}
            </text>
          </g>
        ))}
        <circle cx={nx(10)} cy={NL.y} r={14 * pulse} fill="none" stroke={colors.accent} strokeWidth={4} opacity={arrow} />
        <g opacity={arrow}>
          <line x1={nx(15) - 150} y1={NL.y - 50} x2={nx(11) + 110} y2={NL.y - 50} stroke={colors.accent} strokeWidth={4} strokeDasharray="12 10" />
          <polygon points={`${nx(11) + 88},${NL.y - 50} ${nx(11) + 108},${NL.y - 60} ${nx(11) + 108},${NL.y - 40}`} fill={colors.accent} />
        </g>
        {PTS.map((p, i) => (
          <g key={p.v} opacity={drop[i]}>
            {p.top < 200 ? <line x1={nx(p.v)} x2={nx(p.v)} y1={NL.y - 14} y2={p.top + 96} stroke={colors.muted} strokeWidth={2} /> : null}
            <circle data-mark="point" cx={nx(p.v)} cy={NL.y - (1 - drop[i]) * 120} r={11} fill={p.color} stroke="#FFFFFF" strokeWidth={3} />
          </g>
        ))}
      </svg>
      <div data-text="axis" style={{ ...label, position: "absolute", left: NL.right + 30, top: NL.y + 72, translate: "-100% 0", fontSize: 36, color: colors.text, whiteSpace: "nowrap" }}>
        vận tốc trung bình (m/s)
      </div>
      {PTS.map((p, i) => (
        <div
          key={p.v}
          data-text="label"
          style={{ ...label, position: "absolute", left: nx(p.v) + p.dx, top: p.top, translate: "-50% 0", textAlign: "center", opacity: drop[i], textShadow: halo(), lineHeight: 1.2 }}
        >
          <b style={{ fontWeight: 800, fontSize: 42 }}>{p.text}</b>
          <br />
          <span style={{ color: colors.muted }}>{p.note}</span>
        </div>
      ))}
      <div data-text="label" style={{ ...label, position: "absolute", left: nx(10), top: NL.y + 76, translate: "-50% 0", color: colors.accent, fontWeight: 800, opacity: lim }}>
        giới hạn
      </div>
      <div data-text="label" style={{ ...label, position: "absolute", left: nx(10) + 110, top: NL.y + 76, color: colors.muted, opacity: lim }}>
        (khi khoảng thời gian co về 0)
      </div>
      <Card style={{ left: 1120, top: 130, padding: "14px 30px", display: "flex", alignItems: "center", gap: 26, opacity: noDiv }}>
        <div data-text="formula" style={{ position: "relative", fontSize: 44 }}>
          <Tex tex="\dfrac{0}{0}" />
          <svg width={70} height={90} style={{ position: "absolute", left: -8, top: -6, overflow: "visible" }}>
            <line x1={4} y1={86} x2={66} y2={6} stroke={colors.decrease} strokeWidth={7} strokeLinecap="round" />
          </svg>
        </div>
        <div data-text="card" style={{ ...label, color: colors.increase, fontWeight: 700 }}>
          ✓ không chia cho 0
        </div>
      </Card>
      <Card style={{ left: 560, top: 600, width: 800, padding: "16px 32px", display: "flex", alignItems: "center", gap: 26, opacity: card, translate: `0px ${(1 - card) * 24}px` }}>
        <svg width={56} height={56}>
          <circle cx={28} cy={28} r={23} fill="#F59E0B" stroke="#B85E06" strokeWidth={3} />
        </svg>
        <div data-text="card" style={{ ...label, fontSize: 40 }}>
          vận tốc tức thời tại <Tex tex="t=1" /> s: <b style={{ color: colors.accent }}>10 m/s</b>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ---------------- b06: ĐỊNH NGHĨA — bảng tương ứng → định nghĩa đạo hàm ----------------
const MAP_ROWS = [
  { a: "thời gian $t$ (s)", b: "$x$" },
  { a: "quãng đường $s$ (m)", b: "$f(x)$" },
  { a: "vận tốc tức thời tại thời điểm $x_0$", b: "$f'(x_0)$", note: "đạo hàm của $f$ tại $x_0$" },
];
const GRID6 = "700px 110px 480px";
const DEF_PLAIN = "f'(x_0)=\\lim\\limits_{x\\to x_0}\\dfrac{f(x)-f(x_0)}{x-x_0}";
const DEF_COLOR = `f'(x_0)=\\lim\\limits_{x\\to x_0}\\dfrac{\\textcolor{${colors.c2}}{f(x)-f(x_0)}}{\\textcolor{${colors.c1}}{x-x_0}}`;

export const Beat06: React.FC<BeatProps> = ({ L }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const rows = [L[0], L[0] + 18, L[1]].map((f) => spring({ frame: frame - f, fps, config: { damping: 16 } }));
  const up = ramp(frame, L[2] - 4, L[2] + 16);
  const def = ramp(frame, L[2] + 8, L[2] + 22);
  const colored = ramp(frame, L[3], L[3] + 14);
  // Dòng 3: bảng nhường chỗ cho định nghĩa, còn lại dải tóm tắt ở trên (giữ cỡ chữ tối thiểu).

  return (
    <AbsoluteFill>
      <Card group="table" style={{ left: 960 - 650, top: 190, width: 1300, overflow: "hidden", opacity: 1 - up }}>
        <div style={{ display: "grid", gridTemplateColumns: GRID6, background: tint(colors.brandBlue, 0.1), fontSize: 40, fontWeight: 800 }}>
          <div data-text="th" style={{ padding: "16px 36px" }}>
            Quả bóng
          </div>
          <div />
          <div data-text="th" style={{ padding: "16px 36px" }}>
            Hàm số
          </div>
        </div>
        {MAP_ROWS.map((r, i) => (
          <div
            key={r.a}
            style={{
              display: "grid",
              gridTemplateColumns: GRID6,
              alignItems: "center",
              fontSize: 40,
              fontWeight: 600,
              borderTop: `2px solid ${colors.panelBorder}`,
              background: i === 2 ? tint(colors.accent, 0.06) : undefined,
              color: i === 2 ? colors.accent : colors.text,
              opacity: rows[i],
              translate: `${(1 - rows[i]) * -30}px 0px`,
            }}
          >
            <div data-text="td" style={{ padding: "20px 36px" }}>
              <MathLine text={r.a} />
            </div>
            <div style={{ textAlign: "center", fontSize: 44, color: colors.muted }}>⟷</div>
            <div data-text="td" style={{ padding: "16px 36px", fontSize: 46, lineHeight: 1.2 }}>
              <MathLine text={r.b} />
              {r.note ? (
                <div style={{ fontSize: 36, color: colors.muted, fontWeight: 600 }}>
                  <MathLine text={r.note} />
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </Card>
      <Card style={{ left: 140, top: 150, padding: "16px 34px", opacity: up, translate: `0px ${(1 - up) * -20}px` }}>
        <div data-text="card" style={{ ...label }}>
          thời gian ↔ <Tex tex="x" /> · quãng đường ↔ <Tex tex="f(x)" /> · vận tốc tức thời ↔ <Tex tex="f'(x_0)" />
        </div>
      </Card>
      <Card style={{ left: 140, top: 330, width: 1640, height: 330, opacity: def }}>
        <div data-text="label" style={{ ...label, position: "absolute", left: 50, top: 22, color: colors.muted }}>
          Định nghĩa đạo hàm của <Tex tex="f" /> tại <Tex tex="x_0" />
        </div>
        <div style={{ position: "absolute", left: 40, top: 98, fontSize: 56, color: colors.text }}>
          <div data-text="formula" style={{ position: "absolute", left: 0, opacity: 1 - colored, whiteSpace: "nowrap" }}>
            <Tex tex={DEF_PLAIN} display />
          </div>
          <div style={{ position: "absolute", left: 0, opacity: colored, whiteSpace: "nowrap" }}>
            <Tex tex={DEF_COLOR} display />
          </div>
        </div>
        <div style={{ position: "absolute", left: 900, top: 80, display: "flex", flexDirection: "column", gap: 20, opacity: colored, whiteSpace: "nowrap" }}>
          <div data-text="label" style={{ ...label, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ width: 22, height: 22, borderRadius: 11, background: colors.c2 }} />
            tử: phần <Tex tex="f" /> thay đổi (quãng rơi thêm, m)
          </div>
          <div data-text="label" style={{ ...label, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ width: 22, height: 22, borderRadius: 11, background: colors.c1 }} />
            mẫu: phần <Tex tex="x" /> thay đổi (thời gian trôi, s)
          </div>
          <div data-text="label" style={{ ...label, display: "flex", alignItems: "center", gap: 16 }}>
            <span style={{ width: 22, height: 22, borderRadius: 11, background: colors.accent }} />
            <Tex tex="\lim" />: cho <Tex tex="x" /> dồn về <Tex tex="x_0" /> (lấy giới hạn)
          </div>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

// ---------------- b07: CÔNG THỨC — thay số quả bóng → 10 ----------------
export const Beat07: React.FC<BeatProps> = ({ L, E }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const d1 = E[1] - L[1];
  const s0 = ramp(frame, L[0], L[0] + 12);
  const s1 = ramp(frame, L[1], L[1] + 12);
  const s1b = ramp(frame, L[1] + 0.45 * d1, L[1] + 0.45 * d1 + 12);
  const s2 = spring({ frame: frame - L[2], fps, config: { damping: 14 } });
  const s3 = ramp(frame, L[3], L[3] + 14);

  return (
    <AbsoluteFill>
      <Card style={{ left: 120, top: 140, width: 640, height: 420, opacity: ramp(frame, 0, 12) }}>
        <div data-text="label" style={{ ...label, position: "absolute", left: 36, top: 22, color: colors.muted }}>
          Định nghĩa đạo hàm
        </div>
        <div data-text="formula" style={{ position: "absolute", left: 30, top: 86, fontSize: 44, color: colors.text, whiteSpace: "nowrap" }}>
          <Tex tex={DEF_COLOR} display />
        </div>
        <div style={{ position: "absolute", left: 36, top: 262, display: "flex", flexDirection: "column", gap: 14 }}>
          <div data-text="label" style={{ ...label, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 20, height: 20, borderRadius: 10, background: colors.c2 }} /> tử: phần <Tex tex="f" /> thay đổi
          </div>
          <div data-text="label" style={{ ...label, display: "flex", alignItems: "center", gap: 14 }}>
            <span style={{ width: 20, height: 20, borderRadius: 10, background: colors.c1 }} /> mẫu: phần <Tex tex="x" /> thay đổi
          </div>
        </div>
      </Card>
      <Card style={{ left: 800, top: 130, width: 1000, height: 470, opacity: s0 }}>
        <div data-text="step" style={{ position: "absolute", left: 40, top: 20, fontSize: 42, color: colors.text, opacity: s0 }}>
          <Tex tex="f(x)=5x^2,\quad x_0=1,\quad f(1)=5" />
        </div>
        <div data-text="step" style={{ position: "absolute", left: 40, top: 106, fontSize: 42, color: colors.text, opacity: s1 }}>
          <Tex tex="\dfrac{f(x)-f(1)}{x-1}=\dfrac{5x^2-5}{x-1}" />
        </div>
        <div style={{ position: "absolute", left: 40, top: 240, display: "flex", alignItems: "center", gap: 24, fontSize: 42, color: colors.text, opacity: s1b }}>
          <div data-text="step">
            <Tex tex="=\dfrac{5\cancel{(x-1)}(x+1)}{\cancel{x-1}}=5(x+1)" />
          </div>
          <div data-text="label" style={{ ...label, color: colors.muted }}>
            (<Tex tex="x\neq 1" />)
          </div>
        </div>
        <div
          style={{
            position: "absolute",
            left: 40,
            top: 384,
            display: "flex",
            alignItems: "center",
            gap: 20,
            fontSize: 42,
            color: colors.text,
            opacity: s2,
            scale: interpolate(s2, [0, 1], [0.9, 1]),
            transformOrigin: "left center",
          }}
        >
          <div data-text="step">
            <Tex tex="f'(1)=\lim\limits_{x\to 1}5(x+1)=" />
          </div>
          <span data-text="step" style={{ padding: "2px 22px", border: `4px solid ${colors.accent}`, borderRadius: 14, color: colors.accent, fontWeight: 800, fontFamily: fontText }}>
            10
          </span>
        </div>
      </Card>
      <Card style={{ left: 480, top: 626, padding: "8px 30px", display: "flex", alignItems: "center", gap: 22, opacity: s3, translate: `0px ${(1 - s3) * 20}px` }}>
        <svg width={44} height={44}>
          <circle cx={22} cy={22} r={18} fill="#F59E0B" stroke="#B85E06" strokeWidth={3} />
        </svg>
        <div data-text="card" style={{ ...label, fontSize: 38 }}>
          bảng vận tốc trung bình: 15 → 10,5 → 10,05 → <b style={{ color: colors.accent }}>dồn về 10 m/s</b>{" "}
          <span style={{ color: colors.increase, fontWeight: 800 }}>✓ khớp</span>
        </div>
      </Card>
    </AbsoluteFill>
  );
};

