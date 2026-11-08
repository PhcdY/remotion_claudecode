import React from "react";
import { StagePanel } from "../Card";
import { MathText } from "../MathText";
import { fontText } from "../theme";

export type ReformPolicyCardProps = {
  tag: string;
  tagColor?: string;
  year?: string | number;
  title: string;
  items: Array<{
    highlight: string;
    detail?: string;
  }>;
  conclusion?: {
    text: string;
    type?: "impact" | "limitation" | "highlight";
  };
};

/**
 * Thẻ đơn một lĩnh vực cải cách (Kinh tế / Xã hội / Quân sự / Văn hóa).
 * Đảm bảo 100% văn bản bọc qua MathText, chống lỗi escape $ o$ và ngắt rớt từ.
 */
export const ReformPolicyCard: React.FC<{
  card: ReformPolicyCardProps;
  width?: number;
}> = ({ card, width = 800 }) => {
  const tagColor = card.tagColor ?? "#3B82F6";
  const conclusionBg =
    card.conclusion?.type === "limitation"
      ? "rgba(185, 28, 28, 0.2)"
      : card.conclusion?.type === "impact"
      ? "rgba(217, 119, 6, 0.2)"
      : "rgba(16, 185, 129, 0.2)";
  const conclusionBorder =
    card.conclusion?.type === "limitation"
      ? "#EF4444"
      : card.conclusion?.type === "impact"
      ? "#F59E0B"
      : "#10B981";

  return (
    <div
      data-box
      style={{
        width,
        boxSizing: "border-box",
        background: "#1E293B",
        borderRadius: 24,
        border: "2px solid #334155",
        padding: "32px 36px",
        display: "flex",
        flexDirection: "column",
        gap: 24,
        boxShadow: "0 12px 30px rgba(0, 0, 0, 0.3)",
      }}
    >
      {/* Header thẻ: Tag + Năm */}
      <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
        <span
          style={{
            padding: "6px 14px",
            borderRadius: 8,
            backgroundColor: tagColor,
            color: "#FFFFFF",
            fontSize: 16,
            fontWeight: 800,
            letterSpacing: 1,
            textTransform: "uppercase",
          }}
        >
          {card.tag}
        </span>
        {card.year && (
          <span style={{ color: "#F59E0B", fontSize: 20, fontWeight: 700 }}>
            ({card.year})
          </span>
        )}
      </div>

      {/* Tiêu đề chính sách */}
      <div
        data-text="policy-title"
        style={{
          fontSize: 32,
          fontWeight: 800,
          color: "#F8FAFC",
          fontFamily: fontText,
        }}
      >
        <MathText text={card.title} />
      </div>

      {/* Danh sách các biện pháp */}
      <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
        {card.items.map((it, idx) => (
          <div key={idx} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <div
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                fontSize: 22,
                fontWeight: 600,
                color: "#E2E8F0",
                lineHeight: 1.4,
              }}
            >
              <span style={{ color: tagColor, fontWeight: 800 }}>→</span>
              <MathText text={it.highlight} />
            </div>
            {it.detail && (
              <div
                style={{
                  paddingLeft: 28,
                  fontSize: 18,
                  fontWeight: 400,
                  color: "#94A3B8",
                  lineHeight: 1.4,
                }}
              >
                <MathText text={it.detail} />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Box đúc kết hệ quả / hạn chế ở đáy thẻ */}
      {card.conclusion && (
        <div
          data-box
          style={{
            marginTop: 8,
            padding: "16px 20px",
            borderRadius: 14,
            background: conclusionBg,
            borderLeft: `6px solid ${conclusionBorder}`,
            fontSize: 20,
            fontWeight: 700,
            color: "#F1F5F9",
            lineHeight: 1.45,
          }}
        >
          <MathText text={card.conclusion.text} />
        </div>
      )}
    </div>
  );
};

/**
 * Sơ đồ So sánh Cải cách 2 Cột (Reform Diagram) chiếm trọn sân khấu Hero Stage 1740px.
 * Dùng cho các bài: Cải cách Hồ Quý Ly (Hạn điền vs Hạn nô), Cải cách Minh Mạng, Đổi mới 1986.
 */
export const ReformDiagram: React.FC<{
  leftCard: ReformPolicyCardProps;
  rightCard: ReformPolicyCardProps;
  hasTakeaway?: boolean;
}> = ({ leftCard, rightCard, hasTakeaway = false }) => {
  return (
    <StagePanel
      theme="dark"
      badge="Cải cách thể chế"
      badgeColor="#3B82F6"
      title="So sánh các chính sách trọng tâm"
      hasTakeaway={hasTakeaway}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          top: 90,
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          gap: 48,
          padding: "20px 40px",
          boxSizing: "border-box",
        }}
      >
        <ReformPolicyCard card={leftCard} width={810} />
        <ReformPolicyCard card={rightCard} width={810} />
      </div>
    </StagePanel>
  );
};
