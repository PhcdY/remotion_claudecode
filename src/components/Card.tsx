import React from "react";
import { colors, fontText, layout, shadow } from "./theme";

// Khối bo góc chuẩn style.md (dành cho SideCard, Thẻ tổng kết, Bẫy)
export const Card: React.FC<{
  children?: React.ReactNode;
  style?: React.CSSProperties;
  group?: string;
  theme?: "light" | "dark";
}> = ({ children, style, group, theme = "light" }) => {
  const isDark = theme === "dark";
  return (
    <div
      data-box
      data-group={group}
      style={{
        position: "absolute",
        boxSizing: "border-box",
        background: isDark ? "#0F172A" : colors.panel,
        border: `2px solid ${isDark ? "#334155" : colors.panelBorder}`,
        borderRadius: 24,
        boxShadow: isDark ? "0 12px 32px rgba(0, 0, 0, 0.35)" : shadow,
        fontFamily: fontText,
        color: isDark ? "#F8FAFC" : colors.text,
        ...style,
      }}
    >
      {children}
    </div>
  );
};

/**
 * Vùng sân khấu toàn khung (1740 × 930px, hoặc 1740 × 800px khi có câu chốt) — chỉ là hệ toạ độ cho hình chính,
 * KHÔNG vẽ hộp trắng hay dải tiêu đề (.agents/chuan-thi-giac.md › 1: khung trắng + badge + tiêu đề là "trang slide").
 * `framed`: chỉ dùng khi chính nội dung là một vật có mặt phẳng thật (bàn sa bàn, tờ giấy lớn) — vẽ nền + viền nhẹ.
 * `title`, `badge`: đã bỏ (10/11/2026), truyền vào cũng không hiện; tên phần dùng thẻ mở beat của BeatShell.
 */
export const StagePanel: React.FC<{
  children?: React.ReactNode;
  framed?: boolean;
  /** @deprecated không còn hiện — xem chú thích component */
  title?: string;
  /** @deprecated không còn hiện — xem chú thích component */
  badge?: string;
  /** @deprecated */
  badgeColor?: string;
  theme?: "light" | "dark";
  hasTakeaway?: boolean;
  style?: React.CSSProperties;
}> = ({ children, framed = false, theme = "light", hasTakeaway = false, style }) => {
  const isDark = theme === "dark";
  const stageTop = layout.visualTop; // 110
  const stageHeight = hasTakeaway ? layout.sceneTakeawayTop - stageTop - 20 : layout.sceneBottom - stageTop; // 800 hoặc 930
  const stageWidth = layout.width - layout.side * 2; // 1740

  return (
    <div
      data-box="stage"
      style={{
        position: "absolute",
        left: layout.side,
        top: stageTop,
        width: stageWidth,
        height: stageHeight,
        boxSizing: "border-box",
        fontFamily: fontText,
        color: isDark ? "#F8FAFC" : colors.text,
        ...(framed
          ? {
              background: isDark ? "linear-gradient(180deg, #0B1120 0%, #0F172A 100%)" : colors.panel,
              border: `2px solid ${isDark ? "#1E293B" : colors.panelBorder}`,
              borderRadius: 28,
              boxShadow: isDark ? "0 20px 50px rgba(0, 0, 0, 0.4)" : shadow,
              overflow: "hidden",
            }
          : {}),
        ...style,
      }}
    >
      {children}
    </div>
  );
};
