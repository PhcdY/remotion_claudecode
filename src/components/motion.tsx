import { CameraMotionBlur } from "@remotion/motion-blur";
import { noise2D } from "@remotion/noise";
import React, { createContext, useContext } from "react";
import { AbsoluteFill, Easing, getInputProps, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";

// Bộ chuyển động dùng chung (.agents/chuan-thi-giac.md › 6, 8): camera, chiều sâu, bật vào, trôi, chữ hiện từng từ.
// Mọi thứ đi từ useCurrentFrame(), không CSS transition.

export const EASE = {
  /** vào nhanh, dừng êm — mặc định cho vật xuất hiện / dịch chỗ */
  out: Easing.bezier(0.16, 1, 0.3, 1),
  /** tăng tốc rồi hãm — camera, vật đi một quãng dài */
  inOut: Easing.bezier(0.65, 0, 0.35, 1),
  /** rời đi */
  in: Easing.bezier(0.7, 0, 0.84, 0),
};

/** from → to trong khoảng frame [a, b], có kẹp hai đầu. */
export const tween = (frame: number, [a, b]: [number, number], [from, to]: [number, number], easing = EASE.out) =>
  interpolate(frame, [a, Math.max(b, a + 1)], [from, to], { extrapolateLeft: "clamp", extrapolateRight: "clamp", easing });

/** 0 → 1 kiểu lò xo bắt đầu ở `start`. bounce: nảy nhẹ (~6% quá đà) cho vật bật vào; false: êm, không nảy. */
export const pop = (frame: number, start: number, fps: number, bounce = true) =>
  spring({
    frame: frame - start,
    fps,
    config: bounce ? { damping: 12, stiffness: 170, mass: 0.6 } : { damping: 200 },
  });

/** Trôi lơ lửng đều (lên–xuống theo chu kỳ). Trả về độ lệch px. */
export const bob = (frame: number, amp = 6, period = 120, phase = 0) =>
  Math.sin((frame / period) * 2 * Math.PI + phase) * amp;

/**
 * Trôi hữu cơ (nhiễu Perlin, @remotion/noise): lệch {x, y} px không lặp đều như sin — cho vật lơ lửng, bụi, máy thở.
 * `speed`: số vòng nhiễu mỗi frame (0,004–0,01 là chậm, êm). Mỗi vật một `seed` để không trôi cùng nhịp.
 */
export const wander = (frame: number, seed: string, amp = 6, speed = 0.006) => ({
  x: noise2D(`${seed}x`, frame * speed, 0) * amp,
  y: noise2D(`${seed}y`, 0, frame * speed) * amp,
});

// ---------------- Camera + chiều sâu ----------------

/** Một cú máy: từ frame `at`, trong `dur` frame, camera chuyển tới nhìn vào điểm (x, y) của thế giới với độ phóng `zoom`. */
export type Shot = { at: number; dur?: number; x: number; y: number; zoom?: number };

type CameraState = { x: number; y: number; zoom: number; x0: number; y0: number };
const CameraCtx = createContext<CameraState>({ x: 960, y: 540, zoom: 1, x0: 960, y0: 540 });

/** Số frame của một cú máy (mặc định 1,2 s). */
const shotDur = (s: Shot, fps: number) => s.dur ?? Math.round(1.2 * fps);

/** Vị trí camera ở frame hiện tại. Zoom nội suy theo log để phóng đều mắt. */
export const cameraAt = (frame: number, shots: Shot[], fps: number) => {
  let x = shots[0].x;
  let y = shots[0].y;
  let zoom = shots[0].zoom ?? 1;
  for (let i = 1; i < shots.length; i++) {
    const s = shots[i];
    const t = tween(frame, [s.at, s.at + shotDur(s, fps)], [0, 1], EASE.inOut);
    if (t <= 0) break;
    const z1 = s.zoom ?? 1;
    x += (s.x - x) * t;
    y += (s.y - y) * t;
    zoom = Math.exp(Math.log(zoom) + (Math.log(z1) - Math.log(zoom)) * t);
  }
  return { x, y, zoom };
};

/**
 * Camera nhìn vào "thế giới" (toạ độ px như khung 1920×1080, được vẽ tràn ra ngoài khung).
 * Đẩy vào chi tiết đang nói, kéo ra để thấy toàn cảnh, lia sang vùng mới — thay cho việc vẽ chồng thứ mới lên.
 * `drift`: camera thở rất nhẹ (vài px, nhiễu hữu cơ) để khung không đứng chết; 0 để tắt.
 * `blur`: nhoè chuyển động (@remotion/motion-blur) trong lúc máy đang đi; tốn thời gian render ×`samples`
 * ở các đoạn đó. Tự tắt khi chạy check-layout (bản sao nhoè sẽ bị đo nhầm là chữ chồng nhau).
 */
export const Camera: React.FC<{
  shots: Shot[];
  drift?: number;
  blur?: boolean;
  samples?: number;
  children: React.ReactNode;
}> = ({ shots, drift = 1, blur = true, samples = 6, children }) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const checking = Boolean((getInputProps() as { layoutCheck?: boolean }).layoutCheck);
  const moving = shots.slice(1).some((s) => frame >= s.at && frame <= s.at + shotDur(s, fps));
  const view = (
    <CameraView shots={shots} drift={drift}>
      {children}
    </CameraView>
  );
  if (!blur || checking || !moving) return view;
  return (
    <CameraMotionBlur shutterAngle={180} samples={samples}>
      {view}
    </CameraMotionBlur>
  );
};

const CameraView: React.FC<{ shots: Shot[]; drift: number; children: React.ReactNode }> = ({ shots, drift, children }) => {
  const frame = useCurrentFrame();
  const { fps, width, height } = useVideoConfig();
  const c = cameraAt(frame, shots, fps);
  const w = wander(frame, "camera", 4 * drift, 0.005);
  const x = c.x + w.x;
  const y = c.y + w.y;
  const zoom = c.zoom * (1 + noise2D("camera-zoom", frame * 0.004, 0) * 0.004 * drift);
  return (
    <CameraCtx.Provider value={{ x, y, zoom, x0: shots[0].x, y0: shots[0].y }}>
      <AbsoluteFill style={{ overflow: "hidden" }}>
        <AbsoluteFill
          style={{
            transformOrigin: "0 0",
            transform: `translate(${width / 2}px, ${height / 2}px) scale(${zoom}) translate(${-x}px, ${-y}px)`,
          }}
        >
          {children}
        </AbsoluteFill>
      </AbsoluteFill>
    </CameraCtx.Provider>
  );
};

/**
 * Lớp có chiều sâu trong Camera. depth 1 = mặt phẳng nội dung; nhỏ hơn = xa hơn: lia ít hơn, phóng ít hơn (parallax);
 * 0 = dính vào màn hình. Dùng cho trời, núi xa, bụi sáng.
 */
export const Layer: React.FC<{ depth: number; children: React.ReactNode }> = ({ depth, children }) => {
  const c = useContext(CameraCtx);
  const s = Math.pow(c.zoom, depth - 1);
  const tx = (c.x - c.x0) * (1 - depth);
  const ty = (c.y - c.y0) * (1 - depth);
  return (
    <AbsoluteFill
      style={{
        transformOrigin: "0 0",
        transform: `translate(${c.x}px, ${c.y}px) scale(${s}) translate(${-c.x + tx}px, ${-c.y + ty}px)`,
      }}
    >
      {children}
    </AbsoluteFill>
  );
};

// ---------------- Chữ ----------------

/**
 * Chữ hiện từng từ: mỗi từ trồi lên + rõ dần, cách nhau `stagger` frame. Dùng cho câu trích dẫn, câu kết luận lớn.
 * `dim`: độ đậm của cả câu (lùi về hậu cảnh khi chuyển trọng tâm sang chỗ khác).
 */
export const Words: React.FC<{
  text: string;
  start: number;
  stagger?: number;
  style?: React.CSSProperties;
  dim?: number;
}> = ({ text, start, stagger = 5, style, dim = 1 }) => {
  const frame = useCurrentFrame();
  const words = text.split(/\s+/).filter(Boolean);
  return (
    <span style={{ ...style, opacity: dim }}>
      {words.map((w, i) => {
        const t = tween(frame, [start + i * stagger, start + i * stagger + 14], [0, 1]);
        return (
          <span
            key={i}
            style={{ display: "inline-block", opacity: t, translate: `0 ${(1 - t) * 0.35}em`, whiteSpace: "pre" }}
          >
            {w + (i < words.length - 1 ? " " : "")}
          </span>
        );
      })}
    </span>
  );
};

/** Số chạy từ `from` tới `to` (dấu phẩy thập phân kiểu Việt). */
export const CountUp: React.FC<{
  from: number;
  to: number;
  start: number;
  dur: number;
  decimals?: number;
  style?: React.CSSProperties;
}> = ({ from, to, start, dur, decimals = 0, style }) => {
  const frame = useCurrentFrame();
  const v = tween(frame, [start, start + dur], [from, to]);
  return <span style={style}>{v.toFixed(decimals).replace(".", ",")}</span>;
};
