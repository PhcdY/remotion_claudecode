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
 * Khung Sân khấu Chính (Hero Stage Panel) — Giải quyết triệt để lỗi "hình bé tí giữa khung to".
 * Tự động chiếm trọn không gian khả dụng của màn hình 1920x1080 (1740x820px hoặc 1740x930px).
 * Mọi sa bàn quân sự, bản đồ địa lý, phòng thí nghiệm hóa học, sơ đồ tế bào... BẮT BUỘC dùng khung này.
 */
export const StagePanel: React.FC<{
  children?: React.ReactNode;
  title?: string;
  badge?: string;
  badgeColor?: string;
  theme?: "light" | "dark";
  hasTakeaway?: boolean;
  style?: React.CSSProperties;
}> = ({
  children,
  title,
  badge,
  badgeColor = "#DC2626",
  theme = "light",
  hasTakeaway = false,
  style,
}) => {
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
        background: isDark ? "linear-gradient(180deg, #0B1120 0%, #0F172A 100%)" : colors.panel,
        border: `2px solid ${isDark ? "#1E293B" : colors.panelBorder}`,
        borderRadius: 28,
        boxShadow: isDark ? "0 20px 50px rgba(0, 0, 0, 0.4)" : shadow,
        fontFamily: fontText,
        color: isDark ? "#F8FAFC" : colors.text,
        overflow: "hidden",
        ...style,
      }}
    >
      {/* Header của Sa bàn / Sân khấu (nếu có) */}
      {(title || badge) && (
        <div
          style={{
            position: "absolute",
            left: 36,
            top: 28,
            display: "flex",
            alignItems: "center",
            gap: 16,
            zIndex: 10,
          }}
        >
          {badge && (
            <span
              style={{
                padding: "6px 14px",
                borderRadius: 8,
                backgroundColor: badgeColor,
                color: "#FFFFFF",
                fontSize: 18,
                fontWeight: 800,
                letterSpacing: 1.2,
                textTransform: "uppercase",
              }}
            >
              {badge}
            </span>
          )}
          {title && (
            <span
              style={{
                fontSize: 28,
                fontWeight: 700,
                color: isDark ? "#F1F5F9" : colors.text,
              }}
            >
              {title}
            </span>
          )}
        </div>
      )}

      {/* Nội dung sân khấu bên trong */}
      <div style={{ position: "absolute", inset: 0 }}>{children}</div>
    </div>
  );
};
