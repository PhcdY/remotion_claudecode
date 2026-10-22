import React from "react";
import { Card } from "./Card";
import { ramp } from "./BeatShell";
import { colors, fontSize, fontText, halo, tint } from "./theme";

// Mảnh ghép dùng chung giữa các video: nhãn, badge, thẻ bên phải, tô màu KaTeX, mốc dòng.

export const label: React.CSSProperties = {
  fontFamily: fontText,
  fontWeight: 600,
  fontSize: fontSize.label,
  color: colors.text,
};

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

/** Số dòng đã bắt đầu (0 trước dòng đầu). */
export const lineAt = (f: number, L: number[]) => L.filter((l) => f >= l).length;

/** 0 → 1 trong d frame kể từ a. */
export const fadeIn = (f: number, a: number, d = 12) => ramp(f, a, a + d);

/** Nhãn HTML đặt tuyệt đối (toạ độ trang), có halo. */
export const Tag: React.FC<{
  x: number;
  y: number;
  anchor?: "center" | "left" | "right";
  color?: string;
  weight?: number;
  size?: number;
  opacity?: number;
  name?: string;
  children: React.ReactNode;
}> = ({ x, y, anchor = "center", color = colors.text, weight = 600, size = fontSize.label, opacity = 1, name = "label", children }) =>
  opacity <= 0 ? null : (
    <div
      data-text={name}
      style={{
        ...label,
        position: "absolute",
        left: x,
        top: y,
        translate: anchor === "center" ? "-50% 0" : anchor === "right" ? "-100% 0" : "0 0",
        whiteSpace: "nowrap",
        color,
        fontWeight: weight,
        fontSize: size,
        opacity,
        textShadow: halo(),
      }}
    >
      {children}
    </div>
  );

/** Nhãn nhỏ dạng viên thuốc ("mô hình", "đề bài"). */
export const Badge: React.FC<{ x: number; y: number; text: string; color?: string; opacity?: number; anchor?: "left" | "right" | "center" }> = ({
  x,
  y,
  text,
  color = colors.brandBlue,
  opacity = 1,
  anchor = "right",
}) =>
  opacity <= 0 ? null : (
    <div
      data-text="badge"
      style={{
        ...label,
        position: "absolute",
        left: x,
        top: y,
        translate: anchor === "center" ? "-50% 0" : anchor === "right" ? "-100% 0" : "0 0",
        padding: "2px 18px",
        borderRadius: 999,
        border: `2px solid ${color}`,
        background: tint(color, 0.08),
        color,
        fontWeight: 700,
        whiteSpace: "nowrap",
        opacity,
      }}
    >
      {text}
    </div>
  );

/** Viên thuốc nội tuyến (đặt trong nhãn/thẻ). */
export const Pill: React.FC<{ text: string; color?: string }> = ({ text, color = colors.brandBlue }) => (
  <span style={{ padding: "0 16px", border: `2px solid ${color}`, borderRadius: 999, background: tint(color, 0.08), color, fontWeight: 700 }}>{text}</span>
);

/** Thẻ trắng đặt tuyệt đối (thẻ bên phải đồ thị). */
export const PanelCard: React.FC<{ top: number; left: number; width: number; opacity?: number; children: React.ReactNode; group?: string }> = ({
  top,
  left,
  width,
  opacity = 1,
  children,
  group,
}) =>
  opacity <= 0 ? null : (
    <Card group={group} style={{ left, top, width, padding: "18px 28px", opacity }}>
      {children}
    </Card>
  );

/** KaTeX tô màu một cụm. */
export const col = (color: string | null, t: string) => (color ? `\\textcolor{${color}}{${t}}` : t);

/** Một cụm trong câu định nghĩa/định lý: sáng màu khi on > 0, mờ khi đang giải phẫu cụm khác. */
export const Hi: React.FC<{ on: number; dim: boolean; color: string; children: React.ReactNode }> = ({ on, dim, color, children }) => (
  <span
    style={{
      color: on > 0 ? color : colors.text,
      background: on > 0 ? tint(color, 0.14 * on) : undefined,
      borderRadius: 10,
      padding: "0 6px",
      opacity: dim && on <= 0 ? 0.4 : 1,
    }}
  >
    {children}
  </span>
);
