import React from "react";
import { Card } from "../Card";
import { MathText } from "../MathText";
import { colors, tint } from "../theme";

/**
 * Thẻ hồ sơ tư liệu lịch sử / Trích dẫn SGK / Chân dung danh nhân.
 */
export const DossierCard: React.FC<{
  title: string;
  source?: string;
  quote?: string;
  bulletPoints?: string[];
  theme?: "light" | "dark";
  width?: number;
  style?: React.CSSProperties;
}> = ({
  title,
  source,
  quote,
  bulletPoints = [],
  theme = "dark",
  width = 680,
  style,
}) => {
  const isDark = theme === "dark";
  return (
    <Card
      theme={theme}
      style={{
        width,
        padding: "28px 32px",
        display: "flex",
        flexDirection: "column",
        gap: 18,
        ...style,
      }}
    >
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span
          data-text="dossier-title"
          style={{
            fontSize: 26,
            fontWeight: 800,
            color: isDark ? "#F8FAFC" : colors.text,
          }}
        >
          <MathText text={title} />
        </span>
        {source && (
          <span style={{ fontSize: 16, color: isDark ? "#94A3B8" : colors.muted, fontStyle: "italic" }}>
            {source}
          </span>
        )}
      </div>

      {quote && (
        <div
          data-box
          style={{
            padding: "16px 20px",
            borderRadius: 14,
            background: isDark ? "rgba(59, 130, 246, 0.12)" : tint(colors.brandBlue, 0.08),
            borderLeft: `4px solid ${colors.brandBlue}`,
            fontSize: 20,
            lineHeight: 1.5,
            color: isDark ? "#E2E8F0" : colors.text,
            fontStyle: "italic",
          }}
        >
          “<MathText text={quote} />”
        </div>
      )}

      {bulletPoints.length > 0 && (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {bulletPoints.map((bp, i) => (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 10, fontSize: 20, lineHeight: 1.45 }}>
              <span style={{ color: colors.brandBlue, fontWeight: 800 }}>•</span>
              <MathText text={bp} />
            </div>
          ))}
        </div>
      )}
    </Card>
  );
};
