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
// CẢNH 1 — RADAR 2D
// ==========================================

// b01: Hai chuyến bay tiến lại và chồng khít trên màn radar lúc 10:15
const s01: Fn<StScene1> = (fr, L) => {
  const flyProgress = lin(fr, L[0], 50) * 0.7 + lin(fr, L[1], 30) * 0.3;
  return {
    ...ZERO1,
    radarOp: In(fr, 0, 12),
    planeA_t: flyProgress,
    planeB_t: flyProgress,
    // Nhãn 2 máy bay chỉ hiện lúc đang bay vào, tắt khi chồng khít
    planeLabelsOp: In(fr, L[0], 12) * Out(fr, L[1], 8),
    contactOp: In(fr, L[1], 15),
    safeCircleOp: In(fr, L[2], 18),
  };
};

// b02: Màn phẳng Oxy, hai số (40; 60)
const s02: Fn<StScene1> = (fr, L) => {
  const p = last(s01);
  return {
    ...p,
    // Giữ máy bay ở điểm giao
    planeA_t: 1,
    planeB_t: 1,
    planeLabelsOp: 0,
    // Tắt nhãn cảnh báo cũ để nhường chỗ cho tọa độ
    contactOp: Out(fr, 0, 10),
    safeCircleOp: Out(fr, 0, 10),
    grid2DOp: In(fr, L[0], 20),
    coords2DOp: In(fr, L[1], 15),
    dist2DOp: In(fr, L[2], 15),
  };
};

// ==========================================
// CẢNH 2 — KHÔNG GIAN BẦU TRỜI 3D
// ==========================================

// b03: Radar ngả xuống thành sàn Oxy, cần chiều thứ ba
const s03: Fn<StScene2> = (fr, L) => ({
  ...ZERO2,
  stageOp: 1,
  tiltTo3D: In(fr, L[0], 25),
  axesOxyOp: In(fr, L[0], 20),
  planesAB_b03Op: In(fr, L[1], 20),
  verticalArrowOp: In(fr, L[2], 15),
});

// b04: Hệ trục Oxyz vuông góc từng đôi
const s04: Fn<StScene2> = (fr, L) => {
  const p = last(s03);
  return {
    ...p,
    // Tắt mũi tên đứng và máy bay tạm thời để tập trung vào 3 trục
    verticalArrowOp: Out(fr, 0, 10),
    planesAB_b03Op: Out(fr, 0, 10),
    axesOxyOp: 1,
    axisOzOp: In(fr, L[1], 20),
    rightAnglesOp: In(fr, L[2], 18),
  };
};

// b05: Ba vectơ đơn vị i, j, k
const s05: Fn<StScene2> = (fr, L) => {
  const p = last(s04);
  return {
    ...p,
    // Làm mờ dấu góc vuông để ba vectơ đơn vị nổi bật
    rightAnglesOp: Out(fr, 0, 10),
    unitVectorsOp: In(fr, L[0], 18),
    unitLabelsOp: In(fr, L[1], 15),
  };
};

// b06: Định nghĩa tọa độ điểm M qua vector OM
const s06: Fn<StScene2> = (fr, L) => {
  const p = last(s05);
  return {
    ...p,
    unitLabelsOp: 0, // Tắt chữ ba vectơ đơn vị để nhường chỗ cho đường đi bộ
    pointMOp: In(fr, L[0], 12),
    walkStepX: lin(fr, L[1], 20),
    walkStepY: lin(fr, L[2], 20),
    walkStepZ: lin(fr, L[3], 20),
    vectorOMOp: In(fr, L[4], 18),
    vecOMTextOp: In(fr, L[4], 18),
  };
};

// b07: Hình hộp chữ nhật và hình chiếu M'(x; y; 0)
const s07: Fn<StScene2> = (fr, L) => {
  const p = last(s06);
  return {
    ...p,
    // Tắt đường đi bộ 3 bước và chữ vecOM để hình hộp không bị đè nét
    unitLabelsOp: 0,
    vecOMTextOp: 0,
    vectorOMOp: Out(fr, 0, 10),
    walkStepX: 0,
    walkStepY: 0,
    walkStepZ: 0,
    boxMeshOp: In(fr, L[0], 20),
    projectMprimeOp: In(fr, L[1], 15),
    zZeroOp: In(fr, L[2], 15),
  };
};

// b08: Hai máy bay A(40; 60; 100) và B(40; 60; 103)
const s08: Fn<StScene2> = (fr, L) => {
  const p = last(s07);
  return {
    ...p,
    // TẮT HẲN điểm M, hình hộp và vector OM để quay lại với 2 máy bay thực tế
    pointMOp: Out(fr, 0, 10),
    boxMeshOp: Out(fr, 0, 10),
    vectorOMOp: 0,
    vecOMTextOp: 0,
    unitLabelsOp: 0,
    unitVectorsOp: Out(fr, 0, 10),
    projectMprimeOp: 0,
    zZeroOp: 0,
    planesAB3DOp: In(fr, L[0], 15),
    planeCoordsOp: In(fr, L[0], 15),
    altitudesOp: In(fr, L[1], 15),
  };
};

// b09: Giải đáp — Chiếu thẳng đứng ép z về 0, khoảng cách 300m
const s09: Fn<StScene2> = (fr, L) => {
  const p = last(s08);
  return {
    ...p,
    // Ẩn các nhãn chi tiết b08 (độ cao, tọa độ dài) để màn hình thoáng đãng, chỉ tập trung vào 300m và an toàn ICAO
    altitudesOp: Out(fr, 0, 10),
    planeCoordsOp: Out(fr, 0, 10),
    diff300mOp: In(fr, L[2], 18),
    safeICAOOp: In(fr, L[3], 15),
  };
};

// b10: Trong đề thi — Chiếu M(2; -3; 5) lên (Oyz)
const s10: Fn<StScene2> = (fr, L) => {
  const p = last(s09);
  return {
    ...p,
    // Tắt máy bay và thước đo
    planesAB3DOp: Out(fr, 0, 10),
    planeCoordsOp: 0,
    diff300mOp: 0,
    safeICAOOp: 0,
    altitudesOp: 0,
    // Làm mờ nền 3D để thẻ đề thi nổi bật tuyệt đối
    stageOp: 0.25,
    examCardOp: In(fr, L[0], 15),
    examAnswerOp: In(fr, L[2], 18),
  };
};

// b11: Bẫy thường gặp — Chiếu lên trục Ox thành (2; 0; 0)
const s11: Fn<StScene2> = (fr, L) => {
  const p = last(s10);
  return {
    ...p,
    examCardOp: Out(fr, 0, 8),
    examAnswerOp: 0,
    stageOp: 0.25,
    trapCardOp: In(fr, L[0], 15),
  };
};

// b12: Tổng kết bản chất 3 trục trong không gian
const s12: Fn<StScene2> = (fr, L) => {
  const p = last(s11);
  return {
    ...p,
    trapCardOp: Out(fr, 0, 10),
    // Sân khấu 3D sáng rực trở lại
    stageOp: 1,
    axesOxyOp: 1,
    axisOzOp: 1,
    unitVectorsOp: 1,
    planesAB3DOp: In(fr, L[0], 15),
    planeCoordsOp: 0, // Không hiện nhãn số A(40;60;100) ở tổng kết để giữ sân khấu 3D tinh gọn
    summaryAllOp: In(fr, L[1], 20),
  };
};

// ==========================================
// XUẤT COMPONENT TỪNG BEAT
// ==========================================

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
  b10: make(s10, Scene2),
  b11: make(s11, Scene2),
  b12: make(s12, Scene2),
};
