import React from "react";
import { interpolate, useCurrentFrame } from "remotion";
import { BeatProps, clamp } from "../../components/BeatShell";
import { fadeIn } from "../../components/parts";
import {
  Scene1,
  Scene2,
  StScene1,
  StScene2,
  ZERO1,
  ZERO2,
} from "./scene";

const END = 1e9;
const Z = new Array(12).fill(0);
const In = (fr: number, a: number, d = 15) => fadeIn(fr, a, d);
const Out = (fr: number, a: number, d = 12) => 1 - fadeIn(fr, a, d);
const lin = (fr: number, a: number, d: number) =>
  interpolate(fr, [a, a + Math.max(d, 1)], [0, 1], {
    ...clamp,
    easing: (u) => u * u * (3 - 2 * u),
  });

type Fn<S> = (fr: number, L: number[], C: number[]) => S;
const last = <S,>(fn: Fn<S>) => fn(END, Z, Z);

const make =
  <S,>(fn: Fn<S>, Scene: React.FC<{ st: S }>): React.FC<BeatProps> =>
  (p) => {
    const fr = useCurrentFrame();
    const o = p.T0 > 0 ? In(fr, p.T0, 8) : 1;
    return (
      <div style={{ position: "absolute", inset: 0, opacity: o }}>
        <Scene st={fn(fr, p.L, p.C ?? p.L)} />
      </div>
    );
  };

// ==========================================
// CẢNH 1 — BUỒNG LÁI & RADAR BAY
// ==========================================

// b01: Máy bay v1, gió v2, máy tính buồng lái tính ra v
const s01: Fn<StScene1> = (fr, L) => {
  const planeProgress = lin(fr, L[0], 40);
  return {
    ...ZERO1,
    radarOp: In(fr, 0, 12),
    planeX: 420 + planeProgress * 60,
    planeY: 540,
    planeAngle: lin(fr, L[2], 25) * 17.65, // Xoay đồng bộ theo vectơ vận tốc thực tế v
    engineVecOp: In(fr, L[0], 15),
    windVecOp: In(fr, L[1], 15),
    flightDisplayOp: In(fr, L[2], 18),
    actualVecOp: In(fr, L[2], 18),
  };
};

// b02: Câu hỏi vì sao không cần hình bình hành mà chỉ cần 3 phép cộng?
const s02: Fn<StScene1> = (fr, L) => {
  const p = last(s01);
  return {
    ...p,
    parallelogramOp: In(fr, L[0], 18),
    calcStepsOp: In(fr, L[1], 15),
  };
};

// ==========================================
// CẢNH 2 — HỆ TỌA ĐỘ Oxyz & CÁC PHÉP TOÁN
// ==========================================

// b03: Ba vectơ đơn vị và vectơ u (ba bước đi độc lập)
const s03: Fn<StScene2> = (fr, L) => ({
  ...ZERO2,
  stageOp: 1,
  axesOp: In(fr, L[0], 15),
  unitVectorsOp: In(fr, L[0], 20),
  vectorUOp: In(fr, L[1], 18),
  uStep: 0,
  uDashedOp: In(fr, L[2], 18),
});

// b04: Bản chất phép cộng (nối tiếp mượt mà và cộng dồn)
const s04: Fn<StScene2> = (fr, L) => {
  const p = last(s03);
  return {
    ...p,
    unitVectorsOp: Out(fr, 0, 10), // Dọn sạch ba vectơ đơn vị để nhường chỗ cho u và v
    uStep: 1, // Thu gọn nhãn u để không tranh chỗ
    uDashedOp: Out(fr, L[0], 10), // Dọn sạch nét dóng khi cộng vectơ
    vSlide: lin(fr, L[0], 25), // Tịnh tiến trượt từ gốc O sang ngọn u
    vectorVOp: In(fr, L[0], 15) * Out(fr, L[3], 12),
    vWalkStepsOp: In(fr, L[1], 18),
    sumFormulaOp: In(fr, L[2], 20),
    sumVectorOp: In(fr, L[3], 20),
  };
};

// b05: Phép trừ và nhân số k
const s05: Fn<StScene2> = (fr, L) => {
  const p = last(s04);
  return {
    ...p,
    vWalkStepsOp: Out(fr, 0, 10),
    sumVectorOp: Out(fr, 0, 10),
    vectorVOp: 0,
    negVectorVOp: In(fr, L[0], 15) * Out(fr, L[2], 12),
    diffVectorOp: In(fr, L[1], 18),
    unitVectorsOp: Out(fr, L[2], 12), // Ẩn i, j, k khi sang nhân ku để không nhầm k với vec_k
    scalarKOp: In(fr, L[2], 20),
  };
};

// b06: Câu hỏi đoán về tích vô hướng (9 số hạng, có tích chéo không?)
const s06: Fn<StScene2> = (fr, L) => ({
  ...ZERO2,
  stageOp: 1,
  axesOp: 1,
  unitVectorsOp: 1,
  vectorUOp: 1,
  uStep: 1,
  dotProductFormulaOp: In(fr, L[0], 18),
});

// b07: Bản chất tích vô hướng: 6 cặp vuông góc = 0, 3 cặp cùng trục = 1
const s07: Fn<StScene2> = (fr, L) => ({
  ...ZERO2,
  stageOp: 1,
  axesOp: 1,
  unitVectorsOp: 1,
  vectorUOp: 1,
  uStep: 1,
  dotProductFormulaOp: 1,
  dotCrossTermsFadeOp: In(fr, L[0], 18),
  dotSquareTermsOp: In(fr, L[1], 18),
  dotResultFormulaOp: In(fr, L[2], 20),
});

// b08: Hệ quả: Độ dài và hai vectơ vuông góc (Clean State Transition)
const s08: Fn<StScene2> = (fr, L) => ({
  ...ZERO2,
  stageOp: 1,
  axesOp: 1,
  // Khi giải thích độ dài (L[0]): hiện u và nét dóng
  vectorUOp: Out(fr, L[1], 10),
  uDashedOp: In(fr, L[0], 18) * Out(fr, L[1], 10),
  lengthFormulaOp: In(fr, L[0], 18),
  // Khi sang vuông góc (L[1]): dọn sạch nét dóng cũ, hiện 2 vectơ vuông góc
  perpendicularOp: In(fr, L[1], 20),
});

// b09: Bẫy thường gặp: Nhầm tích vô hướng thành vectơ (Đúng/Sai)
const s09: Fn<StScene2> = (fr, L) => ({
  ...ZERO2,
  stageOp: 1,
  axesOp: 0, // Tắt nhãn trục để thẻ so sánh độc lập không bị đè
  unitVectorsOp: 0,
  trapCompareCardOp: In(fr, L[0], 15),
});

// ==========================================
// CẢNH 1 QUAY LẠI — GIẢI ĐÁP
// ==========================================

// b10: Thay số cụ thể cho máy bay và hạ cánh an toàn
const s10: Fn<StScene1> = (fr, L) => ({
  ...ZERO1,
  radarOp: 1,
  planeX: 480 + lin(fr, L[2], 40) * 120,
  planeY: 540,
  planeAngle: 17.65, // Bay theo hướng vectơ v
  engineVecOp: 1,
  windVecOp: 1,
  actualVecOp: 1,
  flightDisplayOp: 1,
  calcStepsOp: 1,
  safeStatusOp: In(fr, L[2], 18),
});

// ==========================================
// CẢNH 2 QUAY LẠI — TỔNG KẾT
// ==========================================

// b11: Thẻ tổng kết 4 phép toán và hệ tọa độ Oxyz rực rỡ
const s11: Fn<StScene2> = (fr, L) => ({
  ...ZERO2,
  stageOp: 1,
  axesOp: 0, // Tắt nhãn trục để thẻ tổng kết toàn cảnh hiển thị thoáng đãng
  unitVectorsOp: 0,
  summaryCardOp: In(fr, L[0], 18),
});

export const BEATS: Record<string, React.FC<BeatProps>> = {
  b01: make(s01, Scene1),
  b02: make(s02, Scene1),
  b03: make(s03, Scene2),
  b04: make(s04, Scene2),
  b05: make(s05, Scene2),
  b06: make(s06, Scene2),
  b07: make(s07, Scene2),
  b08: make(s08, Scene2),
  b09: make(s09, Scene2),
  b10: make(s10, Scene1),
  b11: make(s11, Scene2),
};
