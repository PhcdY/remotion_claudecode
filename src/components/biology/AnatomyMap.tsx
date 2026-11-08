import React from "react";
import { fontText, tint } from "../theme";

export type OrganType = "heart" | "kidney" | "brain" | "leaf" | "cell";

export interface AnatomyMapProps {
  organ: OrganType;
  label: string;
  subLabel?: string;
  position?: "top-right" | "top-left" | "bottom-right";
  scale?: number;
  highlightColor?: string;
}

export const AnatomyMap: React.FC<AnatomyMapProps> = ({
  organ,
  label,
  subLabel,
  position = "top-right",
  scale = 1,
  highlightColor = "#3D4AEF",
}) => {
  const posStyle: React.CSSProperties =
    position === "top-right"
      ? { top: 32, right: 48 }
      : position === "top-left"
      ? { top: 32, left: 48 }
      : { bottom: 48, right: 48 };

  const renderIcon = () => {
    switch (organ) {
      case "heart":
        return (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"
              fill="#EF4444"
            />
            <circle cx="12" cy="11" r="3" fill="#FFFFFF" fillOpacity="0.8" />
          </svg>
        );
      case "leaf":
        return (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M17 8C8 10 5.9 16.17 3.82 21.34L5.71 22l1-2.3A4.49 4.49 0 0 0 8 20C19 20 22 3 22 3c-1 2-8 2.52-11 4 2 2 4.14 3.47 6 1z"
              fill="#10B981"
            />
            <circle cx="12" cy="12" r="3" fill="#FFFFFF" fillOpacity="0.8" />
          </svg>
        );
      case "kidney":
        return (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2C7 2 4 6 4 11c0 6 3 11 8 11s8-5 8-11c0-5-3-9-8-9zm-1 14c-1.5 0-3-1.5-3-3s1.5-3 3-3c.5 0 1 .1 1.5.4-.3.8-.5 1.7-.5 2.6 0 1.2.4 2.2 1 3h-2z"
              fill="#F59E0B"
            />
            <circle cx="12" cy="12" r="3" fill="#FFFFFF" fillOpacity="0.8" />
          </svg>
        );
      case "brain":
        return (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 3c-4.97 0-9 4.03-9 9 0 2.12.74 4.07 1.97 5.61L4.35 19.4c-.39.39-.39 1.02 0 1.41.39.39 1.02.39 1.41 0l2.12-2.12C9.28 19.47 10.59 20 12 20c4.97 0 9-4.03 9-9s-4.03-9-9-9z"
              fill="#06B6D4"
            />
            <circle cx="12" cy="11" r="3" fill="#FFFFFF" fillOpacity="0.8" />
          </svg>
        );
      case "cell":
        return (
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="9" fill="#8B5CF6" fillOpacity="0.85" />
            <circle cx="12" cy="12" r="4" fill="#3D4AEF" />
            <circle cx="11" cy="11" r="1.5" fill="#FFFFFF" />
          </svg>
        );
    }
  };

  return (
    <div
      style={{
        position: "absolute",
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        gap: 14,
        padding: "10px 18px",
        borderRadius: 20,
        backgroundColor: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(8px)",
        boxShadow: "0 8px 24px rgba(14, 16, 70, 0.08)",
        border: `1.5px solid ${tint(highlightColor, 0.2)}`,
        transform: `scale(${scale})`,
        transformOrigin: position === "top-right" ? "top right" : "top left",
        fontFamily: fontText,
        ...posStyle,
      }}
    >
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: 14,
          backgroundColor: tint(highlightColor, 0.1),
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {renderIcon()}
      </div>

      <div style={{ display: "flex", flexDirection: "column" }}>
        <span
          style={{
            fontSize: 15,
            fontWeight: 800,
            color: "#0E1046",
            letterSpacing: "-0.01em",
            textTransform: "uppercase",
          }}
        >
          {label}
        </span>
        {subLabel && (
          <span
            style={{
              fontSize: 13,
              fontWeight: 500,
              color: "#5E6785",
              marginTop: 1,
            }}
          >
            {subLabel}
          </span>
        )}
      </div>

      <div
        style={{
          width: 8,
          height: 8,
          borderRadius: "50%",
          backgroundColor: highlightColor,
          boxShadow: `0 0 10px ${highlightColor}`,
          marginLeft: 4,
        }}
      />
    </div>
  );
};
