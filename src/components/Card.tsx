import React from "react";
import { colors, fontText, shadow } from "./theme";

// Khối trắng bo góc theo style.md.
export const Card: React.FC<{ children?: React.ReactNode; style?: React.CSSProperties; group?: string }> = ({ children, style, group }) => (
  <div
    data-group={group}
    style={{
      position: "absolute",
      background: colors.panel,
      border: `2px solid ${colors.panelBorder}`,
      borderRadius: 24,
      boxShadow: shadow,
      fontFamily: fontText,
      color: colors.text,
      ...style,
    }}
  >
    {children}
  </div>
);
