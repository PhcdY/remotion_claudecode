import React from "react";
import { Card } from "../../components/Card";
import { AutoLabelItem, AutoLabels, Rect, axesObstacles, curveObstacles, segmentObstacles } from "../../components/labels";
import { MathText, Tex } from "../../components/MathText";
import { Hi, Tag, clamp01, lerp } from "../../components/parts";
import { Axes, CurveArrow, FunctionPlot, Plot, Point, makeScale } from "../../components/plot";
import { role } from "../../components/roles";
import { colors, fontText, halo, tint } from "../../components/theme";
import { ZoomInset, insetScale } from "../../components/ZoomInset";

// ---------------- Hàm của video ----------------
/** Ví dụ xuyên suốt: f(x) = x²/(x + 1) = x − 1 + 1/(x + 1); tiệm cận xiên y = x − 1, tiệm cận đứng x = −1. */
export const f = (x: number) => (x * x) / (x + 1);
export const df = (x: number) => 1 - 1 / (x + 1) ** 2;

/** Màu theo vai trò, giữ nguyên nghĩa suốt video. */
export const K = {
  main: role.main, // đồ thị
  trap: role.warn, // đường y = x của mẹo (đúng hướng, sai độ cao)
  focus: role.focus, // tiệm cận xiên y = x − 1
  gap: role.pairB, // khoảng cách dọc (đoạn đo, MH)
  hH: role.pairA, // độ cao của điểm trên đường thẳng (cột tới H)
  dim: role.dim,
};

const v = (x: number | undefined) => x ?? 0;

/** Phân số dựng tay (KaTeX từng mảnh) để tô / làm mờ riêng từng cụm. */
const Frac: React.FC<{ pre?: React.ReactNode; num: React.ReactNode; den: React.ReactNode; post?: React.ReactNode; size?: number; color?: string }> = ({
  pre,
  num,
  den,
  post,
  size = 52,
  color = colors.text,
}) => (
  <span style={{ display: "inline-flex", alignItems: "center", gap: 14, fontSize: size, lineHeight: 1.05, whiteSpace: "nowrap", color }}>
    {pre}
    <span style={{ display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <span style={{ padding: "0 8px" }}>{num}</span>
      <span style={{ alignSelf: "stretch", height: 4, background: color, margin: "4px 0", borderRadius: 2 }} />
      <span style={{ padding: "0 8px" }}>{den}</span>
    </span>
    {post}
  </span>
);

const T: React.FC<{ t: string; o?: number; c?: string }> = ({ t, o = 1, c }) => (
  <span style={{ opacity: o, color: c }}>
    <Tex tex={t} />
  </span>
);

/**
 * Nhãn chạy dọc một đường thẳng (đường xiên 45°: hộp chữ nằm ngang luôn cắt vào đường).
 * (x, y): điểm trên đường (toạ độ trang); side 1: phía dưới-phải, −1: phía trên-trái; angle: góc của đường (độ).
 */
const LineLabel: React.FC<{ x: number; y: number; text: string; color: string; o: number; side: 1 | -1; angle?: number; size?: number; steps?: string[]; step?: number }> = ({
  x,
  y,
  text,
  color,
  o,
  side,
  angle = -45,
  size = 40,
  steps,
  step = 0,
}) => {
  if (o <= 0) return null;
  const off = 30;
  const a = (angle * Math.PI) / 180;
  // pháp tuyến của hướng (cos a, sin a), quay về phía side
  const nx = -Math.sin(a) * side;
  const ny = Math.cos(a) * side;
  const ts = steps ?? [text];
  const st = Math.min(Math.max(step, 0), ts.length - 1);
  const lo = Math.floor(st);
  return (
    <>
      {ts.map((t, i) => {
        const k = i === lo ? 1 - (st - lo) : i === lo + 1 ? st - lo : 0;
        return k > 0 ? (
          <div
            key={i}
            data-text="label"
            style={{
              position: "absolute",
              left: x + nx * off,
              top: y + ny * off,
              translate: side === 1 ? "-50% 0" : "-50% -100%",
              rotate: `${angle}deg`,
              transformOrigin: side === 1 ? "50% 0" : "50% 100%",
              whiteSpace: "nowrap",
              fontFamily: fontText,
              fontWeight: 800,
              fontSize: size,
              color,
              opacity: o * k,
              textShadow: halo(),
            }}
          >
            <MathText text={t} />
          </div>
        ) : null;
      })}
    </>
  );
};

/** Khung bao (thẳng trục) của LineLabel — vật cản cho AutoLabels. */
const lineLabelRect = (x: number, y: number, side: 1 | -1, w = 240, h = 52): Rect => {
  const a = (-45 * Math.PI) / 180;
  const nx = -Math.sin(a) * side;
  const ny = Math.cos(a) * side;
  const cx = x + nx * (30 + h / 2);
  const cy = y + ny * (30 + h / 2);
  const half = ((w + h) * Math.SQRT1_2) / 2;
  return { x: cx - half, y: cy - half, w: 2 * half, h: 2 * half };
};

// =====================================================================
// CẢNH 1 — nhìn xa (0 → 1200) + kính lúp
// =====================================================================
const P1 = { left: 130, top: 190 };
export const S1 = makeScale({ xMin: 0, xMax: 1200, yMin: 0, yMax: 1200, width: 680, height: 680 });
const T1 = [200, 400, 600, 800, 1000, 1200];
const INS = { left: 960, top: 450, width: 800, height: 430 };
const ZOOM = 265;
/** tâm dọc của ô phóng: giữa đường y = x và y = x − 1 */
const yc = (x0: number) => x0 - 0.55;
/** hàng trên cùng (trên ô phóng): cột số đo, thẻ bài trước, thẻ phép chia */
const TOP = { left: 960, top: 160 };

export type St1 = Partial<{
  /** 0: cụm hình gốc ở giữa khung (chưa có kính lúp) · 1: ở bên trái */
  shift: number;
  formula: number;
  plus1Fade: number;
  approx: number;
  yx: number; // vẽ đường y = x (0 → 1)
  yxDim: number;
  labYX: number;
  zoom: number;
  x0: number;
  // đoạn đo tới y = x
  segYX: number;
  gapYX: string;
  gapYXo: number;
  ghost: number;
  rows: number[]; // cột số đo tới y = x (10, 100, 1000)
  rowsArrow: number;
  q: number;
  // b03
  refCard: number;
  refHi: number;
  hut: number[];
  // b04
  divCard: number;
  divStep: number; // 0: tại 100 · 1: tại 1000
  divRow1: number;
  divRow2: number;
  ptYX: number;
  ptF: number;
  divHi: number;
  divNote: number;
  pct: number;
  pctStep: number;
  slide: number; // 0..1 mũi tên chạy dọc đồ thị
  slideO: number;
  // b05
  newLine: number; // 0..1: bản sao y = x trượt xuống 1
  newO: number;
  segNew: number;
  gapNew: string;
  gapNewO: number;
  rows2: number[];
  // b13
  approxBack: number;
  labTC: number;
  labTCpulse: number;
  pulseYX: number;
}>;

const ROWS_YX = ["$0{,}91$", "$0{,}99$", "$0{,}999$"];
const ROWS_NEW = ["$0{,}09$", "$0{,}01$", "$0{,}001$"];
const XS = [10, 100, 1000];

export const Scene1: React.FC<{ st: St1 }> = ({ st }) => {
  const s = S1;
  const dx = lerp(380, 0, v(st.shift));
  const x0 = v(st.x0) || 1000;
  const zs = insetScale(s, x0, yc(x0), ZOOM, INS.width, INS.height);
  const ip = (x: number, y: number) => ({ x: INS.left + zs.x(x), y: INS.top + zs.y(y) });
  const k = clamp01(v(st.newLine));
  const fx = f(x0);

  // nhãn trên hình gốc
  const baseItems: AutoLabelItem[] = [
    { id: "yx", x: 1130, y: 1130, text: "$y = x$", color: K.trap, size: 44, weight: 700, opacity: v(st.labYX), prefer: ["e", "se"], anchor: "region" },
  ];
  const baseObst: Rect[] = [...axesObstacles(s, T1, T1), ...curveObstacles(s, f, 0, 1200)];

  // nhãn trong ô phóng (toạ độ trang)
  const midYX = ip(x0, (fx + x0) / 2);
  const manualYX = !(st.gapYX ?? "").startsWith("cách");
  const numYX = ip(x0 - 0.42, x0 + 0.36);
  const numNew = ip(x0 + 0.45, x0 - 1.36);
  const lyx = ip(x0 - 1.15, x0 - 1.15);
  const lnew = ip(x0 + 1.2, x0 + 1.2 - k);
  const lgr = ip(x0 + 1.3, f(x0 + 1.3));
  const insItems: AutoLabelItem[] = [
    // b01: "cách ≈ 1" chưa có đoạn đo — để AutoLabels đặt cạnh khe
    { id: "gYX", x: midYX.x, y: midYX.y, text: st.gapYX ?? "", color: K.gap, size: 44, weight: 800, opacity: manualYX ? 0 : v(st.gapYXo), prefer: ["e", "w"], anchor: "region", phases: ["gap"] },
    {
      id: "pct",
      x: midYX.x,
      y: midYX.y,
      text: "",
      steps: ["$1\\%$ của $100$ là $1$", "$0{,}1\\%$ của $1000$ là $1$"],
      step: v(st.pctStep),
      color: K.gap,
      size: 44,
      weight: 700,
      opacity: v(st.pct),
      prefer: ["e"],
      anchor: "region",
      phases: ["pct"],
    },
  ];
  const lineObst = (off: number) => {
    const a = ip(zs.xMin, zs.xMin - off);
    const b = ip(zs.xMax, zs.xMax - off);
    return segmentObstacles(a.x, a.y, b.x, b.y, 8);
  };
  const a1 = ip(x0, fx);
  const a2 = ip(x0, x0);
  const insObst: Rect[] = [
    ...lineObst(0),
    ...lineObst(1),
    ...segmentObstacles(ip(zs.xMin, f(zs.xMin)).x, ip(zs.xMin, f(zs.xMin)).y, ip(zs.xMax, f(zs.xMax)).x, ip(zs.xMax, f(zs.xMax)).y, 8),
    ...segmentObstacles(a1.x, a1.y, a2.x, a2.y, 10),
    { x: INS.left, y: INS.top + INS.height - 50, w: INS.width, h: 50 }, // số vạch chia ngang
    { x: INS.left, y: INS.top, w: 90, h: INS.height }, // số vạch chia dọc
  ];
  if (v(st.zoom) > 0) insObst.push(lineLabelRect(lyx.x, lyx.y, -1));
  if (v(st.newO) > 0) insObst.push(lineLabelRect(lnew.x, lnew.y, 1));

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Plot scale={s} left={P1.left + dx} top={P1.top} overlay={<AutoLabels scale={s} items={baseItems} obstacles={baseObst} />}>
        <Axes scale={s} xTicks={T1} yTicks={T1} hideXLabels={[1200]} hideYLabels={[1200]} xLabel="x" yLabel="y" />
        <FunctionPlot scale={s} f={f} from={0} to={1200} width={7} />
        {v(st.yx) > 0 ? (
          <line
            x1={s.x(0)}
            y1={s.y(0)}
            x2={s.x(1200 * clamp01(v(st.yx)))}
            y2={s.y(1200 * clamp01(v(st.yx)))}
            stroke={K.trap}
            strokeWidth={5}
            strokeDasharray="18 14"
            opacity={1 - 0.5 * v(st.yxDim)}
          />
        ) : null}
        {v(st.newO) > 0 ? <line x1={s.x(1)} y1={s.y(0)} x2={s.x(1200)} y2={s.y(1199)} stroke={K.focus} strokeWidth={5} strokeDasharray="18 14" strokeDashoffset={16} opacity={v(st.newO)} /> : null}
        <CurveArrow s={s} f={f} df={df} x={lerp(160, 1020, v(st.slide))} color={K.main} opacity={v(st.slideO)} len={70} off={34} />
      </Plot>

      {/* thẻ công thức (góc trên trái, vùng trống phía trên đường chéo) */}
      {v(st.formula) > 0 ? (
        <Card style={{ left: 175 + dx, top: 200, padding: "14px 26px", opacity: st.formula }}>
          <div data-text="formula" style={{ fontSize: 52 }}>
            <Frac pre={<T t="f(x) =" />} num={<T t="x^2" />} den={<><T t="x" /> <T t="+\, 1" o={1 - 0.75 * v(st.plus1Fade)} /></>} />
          </div>
        </Card>
      ) : null}
      <Tag x={185 + dx} y={420} anchor="left" size={48} weight={700} color={K.trap} opacity={Math.max(v(st.approx), v(st.approxBack))}>
        <MathText text={"$\\approx \\dfrac{x^2}{x} = x$"} />
      </Tag>

      {/* kính lúp */}
      {v(st.zoom) > 0 ? (
        <ZoomInset
          base={s}
          baseLeft={P1.left + dx}
          baseTop={P1.top}
          f={f}
          x0={x0}
          y0={yc(x0)}
          z={ZOOM}
          left={INS.left}
          top={INS.top}
          width={INS.width}
          height={INS.height}
          opacity={v(st.zoom)}
          showPoint={false}
          minBox={30}
        >
          {(z) => (
            <>
              <line x1={z.x(z.xMin)} y1={z.y(z.xMin)} x2={z.x(z.xMax)} y2={z.y(z.xMax)} stroke={K.trap} strokeWidth={5 + 4 * v(st.pulseYX)} opacity={1 - 0.5 * v(st.yxDim)} />
              {v(st.newO) > 0 ? (
                <line x1={z.x(z.xMin)} y1={z.y(z.xMin - k)} x2={z.x(z.xMax)} y2={z.y(z.xMax - k)} stroke={K.focus} strokeWidth={6 + 4 * v(st.labTCpulse)} strokeDasharray="22 14" opacity={v(st.newO)} />
              ) : null}
              {v(st.ghost) > 0 ? (
                <line
                  x1={z.x(x0 - 0.3)}
                  y1={z.y(f(x0 - 0.3))}
                  x2={z.x(x0 - 0.3)}
                  y2={z.y(f(x0 - 0.3) + 10 / 11)}
                  stroke={K.gap}
                  strokeWidth={8}
                  strokeDasharray="10 8"
                  strokeLinecap="round"
                  opacity={0.5 * v(st.ghost)}
                />
              ) : null}
              {v(st.segYX) > 0 ? (
                <line x1={z.x(x0)} y1={z.y(fx)} x2={z.x(x0)} y2={z.y(fx + (x0 - fx) * clamp01(v(st.segYX)))} stroke={K.gap} strokeWidth={9} strokeLinecap="round" />
              ) : null}
              {v(st.segNew) > 0 ? (
                <line x1={z.x(x0)} y1={z.y(x0 - 1)} x2={z.x(x0)} y2={z.y(fx)} stroke={K.gap} strokeWidth={9} strokeLinecap="round" opacity={v(st.segNew)} />
              ) : null}
              {v(st.ptYX) > 0 ? <Point scale={z} x={x0} y={x0} color={K.trap} r={13} opacity={st.ptYX} /> : null}
              {v(st.ptF) > 0 ? <Point scale={z} x={x0} y={fx} color={K.main} r={13} opacity={st.ptF} /> : null}
            </>
          )}
        </ZoomInset>
      ) : null}
      <LineLabel x={lgr.x} y={lgr.y} text="đồ thị" color={K.main} o={v(st.zoom) * (1 - v(st.newO))} side={1} size={38} />
      {v(st.gapNewO) > 0 ? (
        <svg width={1920} height={1080} style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
          <line x1={numNew.x - 30} y1={numNew.y - 22} x2={ip(x0, x0 - 1).x + 6} y2={ip(x0, x0 - 1).y + 6} stroke={K.gap} strokeWidth={2.5} opacity={0.8 * v(st.gapNewO)} />
          <circle cx={ip(x0, x0 - 1).x} cy={ip(x0, x0 - 1).y} r={9} fill="none" stroke={K.gap} strokeWidth={3} opacity={v(st.gapNewO)} />
        </svg>
      ) : null}
      <LineLabel x={lyx.x} y={lyx.y} text="$y = x$" color={K.trap} o={v(st.zoom) * (1 - 0.5 * v(st.yxDim))} side={-1} />
      <LineLabel x={lnew.x} y={lnew.y} text="" steps={["$y = x - 1$", "tiệm cận xiên"]} step={v(st.labTC)} color={K.focus} o={v(st.newO) * v(st.zoom)} side={1} />
      {v(st.zoom) > 0 ? <AutoLabels items={insItems} obstacles={insObst} bounds={{ x: INS.left + 90, y: INS.top + 8, w: INS.width - 100, h: INS.height - 60 }} /> : null}
      <Tag x={numYX.x} y={numYX.y - 26} anchor="center" size={42} weight={800} color={K.gap} opacity={manualYX ? v(st.gapYXo) : 0}>
        <MathText text={st.gapYX ?? ""} />
      </Tag>
      <Tag x={numNew.x} y={numNew.y - 26} anchor="center" size={42} weight={800} color={K.gap} opacity={v(st.gapNewO)}>
        <MathText text={st.gapNew ?? ""} />
      </Tag>
      {v(st.q) > 0 ? (
        <Tag x={midYX.x - 60} y={midYX.y - 46} anchor="center" size={72} weight={800} color={K.trap} opacity={st.q} name="q">
          ?
        </Tag>
      ) : null}

      {/* cột số đo (trên ô phóng) */}
      <MeasureRows values={ROWS_YX} o={st.rows} arrow={v(st.rowsArrow)} arrowText={"$\\to 1$"} />
      <MeasureRows values={ROWS_NEW} o={st.rows2} arrow={0} arrowText="" />

      {/* b03: thẻ bài trước + phần hụt */}
      {v(st.refCard) > 0 ? (
        <Card style={{ left: TOP.left, top: TOP.top, padding: "10px 24px 14px", opacity: st.refCard }}>
          <div data-text="label" style={{ fontSize: 36, fontWeight: 600, color: colors.muted, marginBottom: 14 }}>
            bài trước
          </div>
          <div data-text="formula" style={{ fontSize: 44 }}>
            <Frac
              size={44}
              num={<T t="60x" />}
              den={
                <>
                  <T t="x" />{" "}
                  <span style={{ background: tint(K.trap, 0.18 * v(st.refHi)), borderRadius: 8, color: v(st.refHi) > 0 ? K.trap : undefined }}>
                    <Tex tex="+\, 30" />
                  </span>
                </>
              }
              post={<T t="\to 60" />}
            />
          </div>
        </Card>
      ) : null}
      {[0, 1].map((i) =>
        v(st.hut?.[i]) > 0 ? (
          <div
            key={i}
            data-text="label"
            style={{ position: "absolute", left: 1340, top: TOP.top + 22 + i * 90, display: "flex", alignItems: "center", gap: 18, fontFamily: fontText, fontSize: 44, fontWeight: 600, color: colors.text, opacity: st.hut![i], whiteSpace: "nowrap", textShadow: halo() }}
          >
            <MathText text={i === 0 ? "$x = 900$: hụt $1{,}9$" : "$x = 9000$: hụt $0{,}2$"} />
            <span style={{ display: "inline-block", width: i === 0 ? 152 : 16, height: 22, borderRadius: 6, background: K.trap }} />
          </div>
        ) : null,
      )}

      {/* b04: thẻ phép chia */}
      {v(st.divCard) > 0 ? <DivRows st={st} /> : null}
    </div>
  );
};

const MeasureRows: React.FC<{ values: string[]; o?: number[]; arrow: number; arrowText: string }> = ({ values, o, arrow, arrowText }) => (
  <>
    {values.map((val, i) =>
      v(o?.[i]) > 0 ? (
        <div
          key={i}
          data-text="label"
          style={{ position: "absolute", left: TOP.left, top: TOP.top + i * 84, fontFamily: fontText, fontSize: 44, fontWeight: 600, color: colors.text, opacity: o![i], whiteSpace: "nowrap", textShadow: halo() }}
        >
          <Tex tex={`x = ${XS[i]}`} />: <span style={{ color: K.gap, fontWeight: 800 }}><Tex tex={val.slice(1, -1)} /></span>
          {i === 2 && arrow > 0 ? (
            <span style={{ marginLeft: 26, color: K.gap, fontWeight: 800, opacity: arrow }}>
              <Tex tex={arrowText.slice(1, -1)} />
            </span>
          ) : null}
        </div>
      ) : null,
    )}
  </>
);

const DivRows: React.FC<{ st: St1 }> = ({ st }) => {
  const step = v(st.divStep);
  const blocks = [
    {
      o: 1 - step,
      a: { num: "10\\,000", den: "100", res: "= 100" },
      b: { num: "10\\,000", den: "101", res: "\\approx 99{,}01" },
    },
    {
      o: step,
      a: { num: "1\\,000\\,000", den: "1000", res: "= 1000" },
      b: { num: "1\\,000\\,000", den: "1001", res: "\\approx 999{,}001" },
    },
  ];
  return (
    <div style={{ position: "absolute", inset: 0, opacity: v(st.divCard) }}>
      {blocks.map((bl, i) =>
        bl.o > 0 ? (
          <React.Fragment key={i}>
            <div data-text="formula" style={{ position: "absolute", left: TOP.left, top: TOP.top, opacity: bl.o * v(st.divRow1), fontFamily: fontText, fontSize: 44 }}>
              <Frac size={44} color={K.trap} num={<T t={bl.a.num} />} den={<T t={bl.a.den} />} post={<T t={bl.a.res} />} />
            </div>
            <div data-text="formula" style={{ position: "absolute", left: 1400, top: TOP.top, opacity: bl.o * v(st.divRow2), fontFamily: fontText, fontSize: 44 }}>
              <Frac
                size={44}
                color={K.main}
                num={<T t={bl.b.num} />}
                den={
                  <span style={{ background: tint(K.gap, 0.18 * v(st.divHi)), borderRadius: 8, color: v(st.divHi) > 0 ? K.gap : undefined }}>
                    <Tex tex={bl.b.den} />
                  </span>
                }
                post={<T t={bl.b.res} />}
              />
            </div>
          </React.Fragment>
        ) : null,
      )}
      <Tag x={1420} y={TOP.top + 152} anchor="left" size={40} weight={700} color={K.gap} opacity={v(st.divNote) * (1 - step)}>
        <MathText text={"mẫu lớn hơn $1\\%$"} />
      </Tag>
    </div>
  );
};

// =====================================================================
// CẢNH 2 — nhìn gần gốc toạ độ
// =====================================================================
const P2 = { left: 1060, top: 165 };
/** b06–b09: khung gần (chỉ nhánh phải, đoạn MH đủ lớn để nhìn); b10: mở rộng sang trái để thấy nhánh trái */
const NEAR = { xMin: -0.4, xMax: 7, yMin: -0.6, yMax: 6.8 };
const WIDE = { xMin: -5.5, xMax: 6.5, yMin: -6.5, yMax: 5.5 };
const scale2 = (w: number) =>
  makeScale({
    xMin: lerp(NEAR.xMin, WIDE.xMin, w),
    xMax: lerp(NEAR.xMax, WIDE.xMax, w),
    yMin: lerp(NEAR.yMin, WIDE.yMin, w),
    yMax: lerp(NEAR.yMax, WIDE.yMax, w),
    width: 744,
    height: 744,
  });
const XT2 = [-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6];
const YT2 = [-6, -5, -4, -3, -2, -1, 1, 2, 3, 4, 5];
const COL = { left: 100 };

export type St2 = Partial<{
  /** 0: khung gần · 1: khung rộng */
  wide: number;
  base: number; // trục, nhánh phải, hai đường
  yxO: number; // đường y = x (mờ, màu bẫy)
  yxHi: number;
  yxWrong: number;
  // M, H bên phải
  mh: number; // điểm M
  hh: number; // điểm H
  xm: number; // hoành độ M, H
  colM: number;
  colH: number;
  colDim: number;
  seg: number; // đoạn MH
  segHi: number;
  labFx: number;
  labHx: number;
  labMH: number;
  labMHstep: number; // 0: f(x) − (x − 1) · 1: 1/(x + 1)
  lineLabStep: number; // 0: y = x − 1 · 1: tiệm cận xiên · 2: y = x − 1 (−1 sáng) · 3: y = x − 1
  lineHi: number;
  // thẻ định nghĩa
  def: number;
  defLow: number; // 0: ở trên · 1: thu nhỏ xuống dưới
  defHi: number; // 1 f(x) · 2 ax+b · 3 hiệu · 4 lim=0
  defA: number; // a ≠ 0
  defMinus: number; // hoặc x → −∞
  hline: number; // đường ngang thoáng hiện
  // công thức hàm
  formula: number;
  formSplit: number; // 0: x²/(x+1) · 1: x − 1 + 1/(x+1)
  formSmall: number;
  splitHi: number; // 1: x − 1 · 2: 1/(x+1)
  // b08 phép nhân
  q: number;
  r1: number;
  r1dim: number;
  over: number;
  r2: number;
  r2step: number;
  rowsOut: number;
  // b10 nhánh trái
  vline: number;
  leftDraw: number;
  m2: number;
  xm2: number;
  // b11–b12 đề thi
  ex: number[]; // 0 đề · 1 a · 2 thay · 3 b · 4 quy đồng · 5 b = −1
  aCollapse: number;
  noteA: number;
  gapYX: number;
  splitBack: number;
}>;

export const Scene2: React.FC<{ st: St2 }> = ({ st }) => {
  const w = clamp01(v(st.wide));
  const s = scale2(w);
  const xt = XT2.filter((t) => t > s.xMin + 0.2 && t < s.xMax - 0.2);
  const yt = YT2.filter((t) => t > s.yMin + 0.2 && t < s.yMax - 0.2);
  // hai đường cắt theo khung
  const L0 = s.xMin;
  const L1 = s.xMax;
  const xm = v(st.xm) || 3;
  const xm2 = v(st.xm2) || -3;
  const fm = f(xm);
  const hm = xm - 1;
  const gapC = K.gap;
  const items: AutoLabelItem[] = [
    { id: "graph", x: 0.7, y: f(0.7), text: "đồ thị", color: K.main, size: 38, weight: 700, opacity: v(st.base) * (1 - w), prefer: ["nw", "n"], anchor: "region" },
    { id: "M", x: xm, y: fm, text: "$M$", color: K.main, size: 36, weight: 800, opacity: v(st.mh), prefer: ["nw", "w", "n"] },
    { id: "H", x: xm, y: hm, text: "$H$", color: K.focus, size: 36, weight: 800, opacity: v(st.hh), prefer: ["se", "s", "e"] },
  ];
  const obst: Rect[] = [
    ...axesObstacles(s, xt, yt),
    ...curveObstacles(s, f, -0.97, L1),
    ...segmentObstacles(s.x(L0), s.y(L0 - 1), s.x(L1), s.y(L1 - 1), 8),
  ];
  if (v(st.yxO) > 0) obst.push(...segmentObstacles(s.x(L0), s.y(L0), s.x(L1), s.y(L1), 6));
  if (v(st.seg) > 0) obst.push(...segmentObstacles(s.x(xm), s.y(hm), s.x(xm), s.y(fm), 8));
  const mhX = s.x(0) + 60;
  const mhTop = Math.max(s.y(fm) - 275, 46);
  if (v(st.labMH) > 0) obst.push({ x: mhX, y: mhTop - 30, w: 400, h: 110 });
  if (v(st.colM) > 0) obst.push({ x: s.x(xm) - 16, y: s.y(fm), w: 32, h: s.y(0) - s.y(fm) });
  if (v(st.labFx) > 0) obst.push({ x: s.x(xm) - 130, y: s.y(fm * 0.28) - 28, w: 106, h: 60 });
  if (v(st.labHx) > 0) obst.push({ x: s.x(xm) + 24, y: s.y(hm * 0.4) - 28, w: 130, h: 60 });
  if (v(st.leftDraw) > 0) obst.push(...curveObstacles(s, f, L0, -1.05));
  if (v(st.vline) > 0) obst.push(...segmentObstacles(s.x(-1), 0, s.x(-1), s.height, 6));
  const ld = clamp01(v(st.leftDraw));
  const fm2 = f(xm2);

  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Plot scale={s} left={P2.left} top={P2.top} style={{ opacity: v(st.base) }} overlay={<AutoLabels scale={s} items={items} obstacles={obst} bounds={{ x: 0, y: 0, w: s.width, h: s.height }} />}>
        <Axes scale={s} xTicks={xt} yTicks={yt} hideXLabels={v(st.vline) > 0 ? [-1] : []} hideYLabels={w > 0.5 ? [-5, -3, -1, 1, 3, 5] : []} xLabel="x" yLabel="y" />
        {/* đường ngang thoáng hiện (gợi tiệm cận ngang, a = 0) */}
        {v(st.hline) > 0 ? <line x1={0} x2={s.width} y1={s.y(2)} y2={s.y(2)} stroke={K.dim} strokeWidth={4} strokeDasharray="14 10" opacity={st.hline} /> : null}
        {v(st.vline) > 0 ? <line x1={s.x(-1)} x2={s.x(-1)} y1={0} y2={s.height} stroke={colors.axis} strokeWidth={4} strokeDasharray="14 10" opacity={st.vline} /> : null}
        {v(st.yxO) > 0 ? (
          <line x1={s.x(L0)} y1={s.y(L0)} x2={s.x(Math.min(L1, s.yMax))} y2={s.y(Math.min(L1, s.yMax))} stroke={K.trap} strokeWidth={4 + 3 * v(st.yxHi)} opacity={v(st.yxO) * (0.45 + 0.55 * Math.max(v(st.yxHi), v(st.yxWrong)))} />
        ) : null}
        <line x1={s.x(Math.max(L0, s.yMin + 1))} y1={s.y(Math.max(L0, s.yMin + 1) - 1)} x2={s.x(L1)} y2={s.y(L1 - 1)} stroke={K.focus} strokeWidth={5 + 4 * v(st.lineHi)} strokeDasharray="20 12" />
        {/* cột độ cao của M (đồ thị) và H (đường thẳng), lệch nhau vài px để thấy cả hai */}
        {v(st.colM) > 0 ? <rect x={s.x(xm) - 14} y={s.y(fm)} width={28} height={s.y(0) - s.y(fm)} rx={4} fill={tint(K.main, 0.4)} opacity={v(st.colM) * (1 - 0.6 * v(st.colDim))} /> : null}
        {v(st.colH) > 0 ? <rect x={s.x(xm) - 6} y={s.y(hm)} width={12} height={s.y(0) - s.y(hm)} rx={3} fill={tint(K.hH, 0.85)} opacity={v(st.colH) * (1 - 0.6 * v(st.colDim))} /> : null}
        <FunctionPlot scale={s} f={f} from={-0.985} to={L1} width={7} samples={600} />
        {ld > 0 ? <FunctionPlot scale={s} f={f} from={-1.015} to={L0} progress={ld} width={7} samples={600} /> : null}
        {v(st.seg) > 0 ? <line x1={s.x(xm)} y1={s.y(hm)} x2={s.x(xm)} y2={s.y(fm)} stroke={gapC} strokeWidth={9 + 5 * v(st.segHi)} strokeLinecap="round" opacity={st.seg} /> : null}
        {v(st.gapYX) > 0 ? <line x1={s.x(4.6)} y1={s.y(f(4.6))} x2={s.x(4.6)} y2={s.y(4.6)} stroke={gapC} strokeWidth={9} strokeLinecap="round" opacity={st.gapYX} /> : null}
        {v(st.m2) > 0 ? (
          <>
            <line x1={s.x(xm2)} y1={s.y(xm2 - 1)} x2={s.x(xm2)} y2={s.y(fm2)} stroke={gapC} strokeWidth={9} strokeLinecap="round" opacity={st.m2} />
            <Point scale={s} x={xm2} y={fm2} color={K.main} opacity={st.m2} r={10} />
            <Point scale={s} x={xm2} y={xm2 - 1} color={K.focus} opacity={st.m2} r={10} />
          </>
        ) : null}
        {v(st.labMH) > 0 ? (
          <line x1={Math.min(s.x(xm), mhX + 380)} y1={mhTop + 56} x2={s.x(xm)} y2={s.y(fm) - 16} stroke={gapC} strokeWidth={2.5} strokeDasharray="6 6" opacity={0.7 * v(st.labMH)} />
        ) : null}
        {v(st.hh) > 0 ? <Point scale={s} x={xm} y={hm} color={K.focus} opacity={st.hh} r={10} /> : null}
        {v(st.mh) > 0 ? <Point scale={s} x={xm} y={fm} color={K.main} opacity={st.mh} r={10} /> : null}
      </Plot>
      {v(st.labMH) > 0
        ? [0, 1].map((i) => {
            const k = i === 0 ? 1 - clamp01(v(st.labMHstep)) : clamp01(v(st.labMHstep));
            return k > 0 ? (
              <Tag key={i} x={P2.left + mhX} y={P2.top + mhTop - (i === 0 ? 0 : 30)} anchor="left" size={36} weight={800} color={gapC} opacity={v(st.labMH) * k}>
                <MathText text={i === 0 ? "$MH = f(x) - (x - 1)$" : "$MH = \\dfrac{1}{x + 1}$"} />
              </Tag>
            ) : null;
          })
        : null}
      {/* nhãn hai cột: sát hai bên cột, ở phần thấp (đồ thị đi qua phía trên-trái) */}
      <Tag x={P2.left + s.x(xm) - 24} y={P2.top + s.y(fm * 0.28) - 28} anchor="right" size={44} weight={700} color={K.main} opacity={v(st.labFx) * (1 - v(st.colDim))}>
        <MathText text={"$f(x)$"} />
      </Tag>
      <Tag x={P2.left + s.x(xm) + 24} y={P2.top + s.y(hm * 0.4) - 28} anchor="left" size={44} weight={700} color={K.hH} opacity={v(st.labHx) * (1 - v(st.colDim))}>
        <MathText text={"$x - 1$"} />
      </Tag>
      <Tag x={P2.left + s.x(-1) - 22} y={P2.top + s.y(4.8)} anchor="right" size={42} weight={700} color={colors.muted} opacity={v(st.vline)}>
        <MathText text={"$x = -1$"} />
      </Tag>
      <LineLabel
        x={P2.left + s.x(lerp(6.25, 4.6, w))}
        y={P2.top + s.y(lerp(6.25, 4.6, w) - 1)}
        text=""
        steps={["$y = x - 1$", "tiệm cận xiên", `$y = x \\textcolor{${K.trap}}{-\\, 1}$`, "$y = x - 1$"]}
        step={v(st.lineLabStep)}
        color={K.focus}
        o={v(st.base)}
        side={1}
      />
      <Tag x={P2.left + s.x(3.6)} y={P2.top + s.y(-3.0)} anchor="center" size={38} weight={700} color={K.focus} opacity={v(st.noteA)}>
        <MathText text={"$\\dfrac{ax + b}{x} = a + \\dfrac{b}{x} \\to a$"} />
      </Tag>
      <LineLabel x={P2.left + s.x(-3.2)} y={P2.top + s.y(-3.2)} text="" steps={["$y = x$", "$y = x$: sai"]} step={v(st.yxWrong)} color={K.trap} o={v(st.yxO)} side={-1} />
      {v(st.q) > 0 ? (
        <Tag x={P2.left + s.x(5.3)} y={P2.top + s.y(6.6)} anchor="center" size={72} weight={800} color={K.trap} opacity={st.q} name="q">
          ?
        </Tag>
      ) : null}
      <LeftCol st={st} />
    </div>
  );
};

const LeftCol: React.FC<{ st: St2 }> = ({ st }) => {
  const split = v(st.formSplit);
  const small = v(st.formSmall);
  const fsz = lerp(54, 44, small);
  const hiSplit = v(st.splitHi);
  const dh = v(st.defHi);
  const dimOthers = dh > 0;
  const defSize = lerp(48, 40, v(st.defLow));
  const ex = st.ex ?? [];
  const r2step = v(st.r2step);
  return (
    <>
      {/* công thức hàm */}
      {v(st.formula) > 0 ? (
        <Card style={{ left: COL.left, top: 175, padding: "12px 26px", opacity: st.formula }}>
          <div data-text="formula" style={{ position: "relative", fontSize: fsz }}>
            <div style={{ opacity: 1 - split }}>
              <Frac size={fsz} pre={<T t="f(x) =" />} num={<T t="x^2" />} den={<T t="x + 1" />} />
            </div>
            {split > 0 ? (
              <div style={{ position: "absolute", left: 0, top: "50%", translate: "0 -50%", opacity: split, display: "flex", alignItems: "center", gap: 10, fontSize: fsz, whiteSpace: "nowrap" }}>
                <T t="f(x) =" />
                <Hi on={hiSplit === 1 ? 1 : 0} dim={false} color={K.focus}>
                  <Tex tex="x - 1" />
                </Hi>
                <T t="+" />
                <Hi on={hiSplit === 2 || v(st.splitBack) > 0 ? 1 : 0} dim={false} color={K.gap}>
                  <Tex tex="\dfrac{1}{x + 1}" />
                </Hi>
              </div>
            ) : null}
          </div>
        </Card>
      ) : null}

      {/* thẻ định nghĩa */}
      {v(st.def) > 0 ? (
        <Card style={{ left: COL.left, top: lerp(370, 730, v(st.defLow)), padding: "16px 26px", opacity: v(st.def) * (1 - 0.35 * v(st.defLow)) }}>
          <div data-text="formula" style={{ display: "flex", alignItems: "center", gap: 6, fontSize: defSize, whiteSpace: "nowrap" }}>
            <Hi on={dh === 4 ? 1 : 0} dim={dimOthers} color={K.gap}>
              <Tex tex="\lim\limits_{x \to +\infty}" />
            </Hi>
            <Hi on={dh === 3 ? 1 : 0} dim={dimOthers} color={K.gap}>
              <Tex tex="\Big[" />
            </Hi>
            <Hi on={dh === 1 ? 1 : 0} dim={dimOthers} color={K.main}>
              <Tex tex="f(x)" />
            </Hi>
            <Hi on={dh === 3 ? 1 : 0} dim={dimOthers} color={K.gap}>
              <Tex tex="-" />
            </Hi>
            <Hi on={dh === 2 ? 1 : 0} dim={dimOthers} color={K.hH}>
              <Tex tex="(ax + b)" />
            </Hi>
            <Hi on={dh === 3 ? 1 : 0} dim={dimOthers} color={K.gap}>
              <Tex tex="\Big]" />
            </Hi>
            <Hi on={dh === 4 ? 1 : 0} dim={dimOthers} color={K.gap}>
              <Tex tex="= 0" />
            </Hi>
          </div>
          {v(st.defMinus) > 0 ? (
            <div data-text="label" style={{ fontSize: 36, fontWeight: 600, color: K.focus, opacity: st.defMinus, marginTop: 14 }}>
              <MathText text={"hoặc $x \\to -\\infty$"} />
            </div>
          ) : null}
        </Card>
      ) : null}
      {v(st.def) > 0 && dh === 2 ? (
        <Tag x={COL.left + 470} y={370 + 160} anchor="left" size={40} weight={700} color={K.hH} opacity={st.def}>
          <MathText text={"ở đây: $x - 1$"} />
        </Tag>
      ) : null}
      <Tag x={COL.left + 30} y={370 + 160} anchor="left" size={44} weight={700} color={K.focus} opacity={v(st.defA) * v(st.def) * (1 - v(st.defLow))}>
        <MathText text={"$a \\neq 0$"} />
      </Tag>

      {/* b08: phép nhân thử */}
      {v(st.r1) > 0 ? (
        <div data-text="formula" style={{ position: "absolute", left: COL.left + 10, top: 380, fontSize: 50, fontFamily: fontText, color: colors.text, opacity: v(st.r1) * (1 - 0.6 * v(st.r1dim)) * (1 - v(st.rowsOut)), whiteSpace: "nowrap" }}>
          <Tex tex="(x + 1) \cdot x = x^2" />{" "}
          <span style={{ color: v(st.over) > 0 ? K.trap : undefined, background: tint(K.trap, 0.16 * v(st.over)), borderRadius: 8, padding: "0 6px" }}>
            <Tex tex="+\, x" />
          </span>
        </div>
      ) : null}
      <Tag x={COL.left + 10} y={470} anchor="left" size={44} weight={700} color={K.trap} opacity={v(st.over) * (1 - 0.6 * v(st.r1dim)) * (1 - v(st.rowsOut))}>
        <MathText text={"thừa $x$, gần bằng mẫu"} />
      </Tag>
      {v(st.r2) > 0 ? (
        <div data-text="formula" style={{ position: "absolute", left: COL.left + 10, top: 580, fontSize: 50, fontFamily: fontText, color: colors.text, opacity: v(st.r2) * (1 - v(st.rowsOut)), whiteSpace: "nowrap" }}>
          <span style={{ opacity: 1 - r2step }}>
            <Tex tex="(x + 1)(x - 1) = x^2" />{" "}
            <span style={{ color: K.focus }}>
              <Tex tex="-\, 1" />
            </span>
          </span>
          {r2step > 0 ? (
            <span style={{ position: "absolute", left: 0, top: 0, opacity: r2step }}>
              <Tex tex="x^2 = (x + 1)(x - 1)" />{" "}
              <span style={{ color: K.gap }}>
                <Tex tex="+\, 1" />
              </span>
            </span>
          ) : null}
        </div>
      ) : null}

      {/* b11–b12: đề thi */}
      <ExamCol ex={ex} collapse={v(st.aCollapse)} />
    </>
  );
};

const ExamCol: React.FC<{ ex: number[]; collapse: number }> = ({ ex, collapse }) => {
  const row = (i: number, top: number, text: string, color: string = colors.text, size = 44) =>
    v(ex[i]) > 0 ? (
      <div key={i} data-text="formula" style={{ position: "absolute", left: COL.left + 10, top, fontFamily: fontText, fontSize: size, fontWeight: 600, color, opacity: ex[i], whiteSpace: "nowrap" }}>
        <MathText text={text} />
      </div>
    ) : null;
  const c = collapse;
  return (
    <>
      {row(0, 370, "Tìm tiệm cận xiên của $y = \\dfrac{x^2}{x + 1}$", colors.text, 42)}
      {c < 1 ? (
        <div style={{ opacity: 1 - c }}>
          {row(1, 500, "$a = \\lim\\limits_{x \\to +\\infty} \\dfrac{f(x)}{x}$")}
          {row(2, 635, "$\\dfrac{f(x)}{x} = \\dfrac{x}{x + 1} \\to 1$", K.focus)}
        </div>
      ) : null}
      {c > 0 ? (
        <div style={{ position: "absolute", left: COL.left + 10, top: 500, fontSize: 44, fontWeight: 700, color: K.focus, opacity: c, fontFamily: fontText }} data-text="formula">
          <Tex tex="a = 1" />
        </div>
      ) : null}
      {row(3, 585, "$b = \\lim\\limits_{x \\to +\\infty} \\Big[f(x) - ax\\Big]$")}
      {row(4, 710, "$\\dfrac{x^2}{x + 1} - x = \\dfrac{-x}{x + 1}$")}
      {row(5, 860, "$b = -1$", K.gap, 48)}
    </>
  );
};
