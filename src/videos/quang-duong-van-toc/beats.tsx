import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, clamp } from "../../components/BeatShell";
import { fadeIn, lerp } from "../../components/parts";
import { Desert, Life, S0, St, U_EXC, U_END, U_FOOD, U_NEAR } from "./scene";

// Mỗi beat dựng trạng thái từ trạng thái CUỐI của beat trước (gọi hàm beat trước với frame rất lớn),
// nên các beat cùng cảnh nối liền, không nháy (skill dung-video › Cảnh liền mạch).

const END = 1e9;
const Z = new Array(12).fill(0);
const In = (fr: number, a: number, d = 15) => fadeIn(fr, a, d);
const Out = (fr: number, a: number, d = 12) => 1 - fadeIn(fr, a, d);
const lin = (fr: number, a: number, b: number) => interpolate(fr, [a, Math.max(b, a + 1)], [0, 1], clamp);
/** nhấp sáng: 0 → 2 trong khoảng [a, a + d] (hai nhịp) */
const beat2 = (fr: number, a: number, d = 40) => (fr < a ? 0 : fr > a + d ? 0 : (2 * (fr - a)) / d);

type Fn = (fr: number, L: number[], E: number[]) => St;
const last = (fn: Fn) => fn(END, Z, Z);
const e = (E: number[], i: number, L: number[], d = 90) => E[i] || L[i] + d;

/** Đưa kiến về chỗ khác: mờ đi rồi hiện lại (không đi lùi). */
const hop = (fr: number, a: number) => (fr < a + 8 ? Out(fr, a, 8) : In(fr, a + 8, 8));

const make =
  (fn: Fn, View: React.FC<{ st: St }>): React.FC<BeatProps> =>
  (p) => {
    const fr = useCurrentFrame();
    const o = p.T0 > 0 ? In(fr, p.T0, 8) : 1;
    return (
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        <View st={fn(fr, p.C ?? p.L, p.E)} />
      </div>
    );
  };

const U0 = 0.55; // kiến vừa bước ra khỏi tổ (để dây chun có độ dài khi mới buộc)
const FAR = 0.55; // camera kéo ra: bản kéo thẳng (cùng tỉ lệ) nằm gọn trên bầu trời
/** kiến về tới tổ thì chui vào (để thấy dây chun co thành chấm) */
const intoNest = (homeR: number) => 1 - Math.min(1, Math.max(0, (homeR - 0.9) / 0.1));

// ---------------- CẢNH 1: sa mạc ----------------
// b01: rời tổ → đi lòng vòng → gió xoá vết → mồi → về thẳng tổ → dấu hỏi
const s01: Fn = (fr, L, E) => {
  let u = lerp(0, 0.9, lin(fr, L[0] + 4, e(E, 0, L)));
  if (fr >= L[1]) u = lerp(0.9, U_FOOD * 0.72, lin(fr, L[1], e(E, 1, L)));
  if (fr >= L[2]) u = lerp(U_FOOD * 0.72, U_FOOD * 0.86, lin(fr, L[2], e(E, 2, L)));
  if (fr >= L[3]) u = lerp(U_FOOD * 0.86, U_FOOD, lin(fr, L[3], e(E, 3, L) - 10));
  const home = fr >= L[4];
  return {
    ...S0,
    fr,
    u,
    mode: home ? "home" : "path",
    homeR: home ? lin(fr, L[4] + 4, e(E, 4, L) - 2) : 0,
    carry: home ? 1 : 0,
    antO: home ? intoNest(lin(fr, L[4] + 4, e(E, 4, L) - 2)) : 1,
    nestLab: In(fr, L[0]),
    footO: fr < L[2] ? 1 : 1 - lin(fr, L[2] + 6, e(E, 2, L) - 4),
    wind: fr >= L[2] ? lin(fr, L[2], e(E, 2, L)) : 0,
    foodO: fr < L[3] ? 0 : home ? 0 : In(fr, L[3]),
    foodLab: In(fr, L[3]) * Out(fr, L[5]),
    q: lin(fr, L[5], L[5] + 20),
  };
};

// b02: tua lại → cuộn chỉ → sợi chỉ nhả theo đường đi → gọi tên → kéo thẳng → đi thêm, chỉ dài thêm
const s02: Fn = (fr, L, E) => {
  const p = last(s01);
  let u = 0;
  if (fr >= L[2]) u = lerp(0, U_FOOD, lin(fr, L[2] + 4, e(E, 2, L) - 4));
  if (fr >= L[5]) u = lerp(U_FOOD, U_END, lin(fr, L[5] + 4, e(E, 5, L) - 4));
  const reset = fr < L[0] + 8;
  return {
    ...p,
    fr,
    mode: reset ? "home" : "path",
    homeR: 1,
    u,
    antO: hop(fr, L[0]),
    carry: reset ? 1 : 0,
    q: 1 - lin(fr, 0, 10),
    foodO: reset ? 0 : In(fr, L[0] + 8),
    // tắt khi kiến bò ngang qua mồi (dòng 6), để nhãn không nhảy phía
    foodLab: reset ? 0 : In(fr, L[0] + 8) * Out(fr, L[5]),
    footO: 0,
    wind: 0,
    spoolO: In(fr, L[1]),
    spoolLab: In(fr, L[1]),
    threadO: fr >= L[1] ? 1 : 0,
    threadU: u,
    threadHi: fr >= L[3] ? In(fr, L[3]) : 0,
    threadLab: In(fr, L[3]) * Out(fr, L[4]),
    // bản kéo thẳng hiện khi camera đã lùi gần xong
    copyS: In(fr, L[4] + 14),
    copySLab: In(fr, L[4] + 14),
    zoom: lerp(1, FAR, lin(fr, L[4], L[4] + 20)),
  };
};

// b03: tua lại → dây chun → đi tới chỗ xa tổ → gọi tên → hai đầu → vòng lại gần tổ (hỏi) → so hai bản kéo thẳng → tới mồi
const s03: Fn = (fr, L, E) => {
  const p = last(s02);
  const pauseEnd = L[6] || END;
  const pauseMid = (e(E, 5, L) + pauseEnd) / 2;
  let u = U0;
  let threadU = lerp(U_END, U0, lin(fr, L[0], e(E, 0, L, 40)));
  if (fr >= L[2]) u = threadU = lerp(U0, U_EXC, lin(fr, L[2] + 4, e(E, 2, L) - 4));
  if (fr >= L[5]) u = threadU = lerp(U_EXC, U_NEAR, lin(fr, L[5] + 4, e(E, 5, L) - 2));
  if (fr >= L[7]) u = threadU = lerp(U_NEAR, U_FOOD, lin(fr, L[7] + 4, e(E, 7, L) - 4));
  const inPause = fr >= e(E, 5, L) && fr < pauseEnd;
  return {
    ...p,
    fr,
    u: fr < L[0] + 8 ? p.u : u,
    antO: hop(fr, L[0]),
    threadU,
    threadHi: inPause && fr < pauseMid ? 1 : 0,
    threadLab: 0,
    foodLab: 0,
    copyS: fr < L[6] ? Out(fr, L[0]) : In(fr, L[6] + 14),
    copySLab: Out(fr, L[0]),
    spoolLab: 0,
    spoolO: Out(fr, L[0]),
    bandO: In(fr, L[1]),
    bandLab: In(fr, L[1]) * Out(fr, L[2]),
    bandHi: fr >= L[3] && fr < L[5] ? In(fr, L[3]) : inPause && fr >= pauseMid ? 1 : 0,
    bandName: In(fr, L[3]) * Out(fr, L[5]),
    bandEnds: beat2(fr, L[4]),
    copyD: In(fr, L[6] + 14),
    zoom: fr < L[6] ? lerp(FAR, 1, lin(fr, L[0], L[0] + 20)) : lerp(1, FAR, lin(fr, L[6], L[6] + 20)),
  };
};

// b04: gắp mồi → mũi tên ngược dây chun → bò về dọc nó → sợi chỉ vẫn dài thêm → chấm ở tổ → sợi chỉ mờ
const s04: Fn = (fr, L, E) => {
  const p = last(s03);
  const homeR = fr < L[2] ? 0 : fr < L[3] ? lerp(0, 0.62, lin(fr, L[2] + 4, e(E, 2, L))) : lerp(0.62, 1, lin(fr, L[3], e(E, 3, L) - 4));
  return {
    ...p,
    fr,
    mode: fr >= L[2] ? "home" : "path",
    u: U_FOOD,
    threadU: U_FOOD,
    homeR,
    copyS: Out(fr, 0),
    copyD: Out(fr, 0),
    spoolO: 0,
    zoom: lerp(FAR, 1, lin(fr, 0, 20)),
    antO: fr >= L[2] ? intoNest(homeR) : 1,
    threadDim: fr < L[5] ? lerp(0, 0.4, lin(fr, 0, 12)) : lerp(0.4, 1, lin(fr, L[5], L[5] + 15)),
    threadHi: fr >= L[3] && fr < L[4] ? 1 : 0,
    foodO: Out(fr, L[0]),
    foodLab: Out(fr, L[0]),
    carry: In(fr, L[0]),
    homeArrow: In(fr, L[1]) * (fr < L[4] ? 1 : Out(fr, L[4])),
    homeLab: In(fr, L[1]) * Out(fr, L[2]),
    dot: In(fr, L[4]),
    dotLab: In(fr, L[4]),
  };
};

// b05: gỡ chỉ, chun, mồi → hai kiến ở tổ → bò về hai phía → mũi tên vận tốc → độ dài = tốc độ → hướng khác
const s05: Fn = (fr, L, E) => {
  const p = last(s04);
  return {
    ...p,
    fr,
    threadO: Out(fr, L[0]),
    bandO: Out(fr, L[0]),
    dot: Out(fr, L[0]),
    dotLab: Out(fr, L[0]),
    antO: 0,
    carry: 0,
    twoO: In(fr, L[1]),
    twoRun: lin(fr, L[2] + 4, e(E, 2, L) - 4),
    arrows: In(fr, L[3]),
    arrowLab: In(fr, L[3]),
    lenHi: beat2(fr, L[4], 30),
    lenLab: In(fr, L[4]),
    tipHi: beat2(fr, L[5], 30),
  };
};

// b06: chuyến đi đầu hiện lại → đồng hồ → v = s/t → v = d/t → mẫu số t → hai bản kéo thẳng → s, d → mũi tên trên chữ
const s06: Fn = (fr, L) => {
  const p = last(s05);
  return {
    ...p,
    fr,
    twoO: Out(fr, L[0]),
    arrows: Out(fr, L[0]),
    arrowLab: Out(fr, L[0]),
    lenLab: Out(fr, L[0]),
    mode: "path",
    u: U_FOOD,
    homeR: 0,
    carry: 0,
    antO: In(fr, L[0] + 6),
    threadO: In(fr, L[0] + 6),
    threadU: U_FOOD,
    threadDim: 0,
    threadHi: 0,
    bandO: In(fr, L[0] + 6),
    bandHi: fr >= L[7] ? 1 : 0,
    homeArrow: 0,
    dot: 0,
    dotLab: 0,
    clockO: In(fr, L[1]),
    clockLab: In(fr, L[1]),
    f1: In(fr, L[2]),
    sHi: fr >= L[2] ? 1 : 0,
    sLab: In(fr, L[2]),
    f2: In(fr, L[3]),
    dHi: fr >= L[3] ? 1 : 0,
    dLab: In(fr, L[3]),
    tHi: fr >= L[4] ? 1 : 0,
    copyS: In(fr, L[5] + 14),
    copyD: In(fr, L[5] + 14),
    zoom: lerp(1, FAR, lin(fr, L[5], L[5] + 20)),
    vecHi: fr >= L[7] ? 1 : 0,
  };
};

// ---------------- CẢNH 2: đời sống ----------------
const s07: Fn = (fr, L, E) => ({
  ...S0,
  scene: 2,
  fr,
  antO: 0,
  phoneL: In(fr, L[0]),
  route: lin(fr, L[0] + 4, e(E, 0, L) - 4),
  routeHi: fr >= L[1] ? 1 : 0,
  phoneM: In(fr, L[2] + 10),
  slide1: lin(fr, L[2], L[2] + 15),
  slide2: lin(fr, L[4], L[4] + 15),
  line: lin(fr, L[2] + 4, L[2] + 30),
  lineHi: fr >= L[3] ? 1 : 0,
  pool: In(fr, L[4] + 10),
  swim: lin(fr, L[4] + 10, e(E, 4, L) - 4),
  poolDot: In(fr, L[5]),
});

// ---------------- CẢNH 3: quay lại sa mạc (GIẢI ĐÁP) ----------------
// b08: dây chun sáng → tua nhanh chuyến đi → về tổ theo mũi tên ngược → nhấc kiến sang chỗ khác → bò theo mũi tên cũ, loay hoay → tổ thật
const s08: Fn = (fr, L, E) => {
  const replay = fr >= L[1] && fr < L[2];
  const disp = fr >= L[3];
  let u = U_FOOD;
  if (replay) u = lerp(0, U_FOOD, lin(fr, L[1] + 4, e(E, 1, L) - 4));
  const homeR = fr >= L[2] && fr < L[3] ? lin(fr, L[2] + 12, e(E, 2, L)) : 0;
  const run = disp ? lin(fr, L[4] + 4, e(E, 4, L) - 40) : 0;
  return {
    ...S0,
    fr,
    mode: disp ? "disp" : fr >= L[2] ? "home" : "path",
    u,
    homeR,
    lift: disp ? lin(fr, L[3] + 16, e(E, 3, L) - 4) : 0,
    run,
    wander: disp && fr > e(E, 4, L) - 40 ? lin(fr, e(E, 4, L) - 40, e(E, 4, L) + 30) : 0,
    antO: disp ? hop(fr, L[3]) * (fr >= L[5] ? lerp(1, 0.45, lin(fr, L[5], L[5] + 15)) : 1) : fr >= L[2] ? intoNest(homeR) : 1,
    carry: replay ? 0 : 1,
    nestLab: 1,
    threadO: 1,
    threadU: replay ? u : U_FOOD,
    threadDim: lerp(0.4, 0.8, lin(fr, L[0], L[0] + 15)),
    bandO: disp ? 0 : 1,
    bandHi: In(fr, L[0]),
    homeArrow: fr >= L[2] ? In(fr, L[2]) * (run >= 1 ? Out(fr, e(E, 4, L) - 40) : 1) : 0,
    notHere: In(fr, e(E, 4, L) - 30),
    dot: In(fr, L[5]),
    memBand: In(fr, L[5]),
  };
};

export const BEATS: Record<string, React.FC<BeatProps>> = {
  b01: make(s01, Desert),
  b02: make(s02, Desert),
  b03: make(s03, Desert),
  b04: make(s04, Desert),
  b05: make(s05, Desert),
  b06: make(s06, Desert),
  b07: make(s07, Life),
  b08: make(s08, Desert),
};
