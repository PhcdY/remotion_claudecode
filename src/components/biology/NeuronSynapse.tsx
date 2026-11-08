import React from "react";
import { fontText } from "../theme";

export interface NeuronSynapseProps {
  /** 0 -> 1 tiến trình truyền xung qua cúc synapse */
  progress: number;
  width?: number;
  height?: number;
  showLabels?: boolean;
}

export const NeuronSynapse: React.FC<NeuronSynapseProps> = ({
  progress,
  width = 640,
  height = 500,
  showLabels = true,
}) => {
  const normProg = Math.max(0, Math.min(1, progress));

  // Khi progress > 0.4: Túi bóng hòa màng và giải phóng chất dẫn truyền (neurotransmitter)
  const isReleasing = normProg > 0.4;
  const releaseProgress = isReleasing ? (normProg - 0.4) / 0.6 : 0;

  return (
    <div
      style={{
        position: "relative",
        width,
        height,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${width} ${height}`}
        style={{ overflow: "visible" }}
      >
        <defs>
          <filter id="synapseGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="14" floodColor="#F59E0B" floodOpacity="0.15" />
          </filter>
        </defs>

        {/* 1. Màng sau synapse (Postsynaptic Membrane - Bên dưới) */}
        <g transform="translate(0, 360)">
          {/* Màng kép tế bào sau */}
          <rect x="60" y="0" width="520" height="70" rx="16" fill="#F1F5F9" stroke="#94A3B8" strokeWidth="3" />

          {/* Các thụ thể màng sau (Receptors) */}
          {[140, 240, 340, 440].map((rx, idx) => {
            const isBound = releaseProgress > 0.6;
            return (
              <g key={`receptor-${idx}`} transform={`translate(${rx}, 0)`}>
                {/* Đế thụ thể */}
                <path d="M -16 0 L -16 -16 Q 0 -26 16 -16 L 16 0 Z" fill={isBound ? "#10B981" : "#0284C7"} />
                {isBound && (
                  // Hạt chất dẫn truyền gắn vào thụ thể
                  <circle cx="0" cy="-22" r="6" fill="#F59E0B" />
                )}
              </g>
            );
          })}
        </g>

        {/* 2. Cúc tận cùng nơron trước (Presynaptic Terminal - Bên trên) */}
        <g filter="url(#synapseGlow)">
          <path
            d="M 270 40 
               L 270 120 
               C 270 160, 80 180, 80 270 
               C 80 295, 560 295, 560 270 
               C 560 180, 370 160, 370 120 
               L 370 40 
               Z"
            fill="#FEF3C7"
            stroke="#F59E0B"
            strokeWidth="4"
            strokeLinejoin="round"
          />

          {/* Sóng điện thế hoạt động (Action Potential Impulse) chạy xuống sợi trục */}
          <g transform={`translate(320, ${40 + normProg * 140})`}>
            <circle cx="0" cy="0" r="16" fill="#EF4444" opacity="0.9" />
            <circle cx="0" cy="0" r="24" fill="#F87171" opacity="0.4" />
            <text
              x="0"
              y="5"
              textAnchor="middle"
              fill="#FFFFFF"
              fontFamily={fontText}
              fontSize="12"
              fontWeight="800"
            >
              +30mV
            </text>
          </g>
        </g>

        {/* 3. Túi bóng chứa chất dẫn truyền (Synaptic Vesicles) */}
        <g>
          {/* Các túi bóng bên trong cúc tận cùng */}
          {[
            { cx: 180, cy: 230 },
            { cx: 250, cy: 245 },
            { cx: 330, cy: 250 },
            { cx: 410, cy: 245 },
            { cx: 470, cy: 220 },
          ].map((v, i) => (
            <g key={`vesicle-${i}`}>
              <circle cx={v.cx} cy={v.cy} r="14" fill="#FBBF24" stroke="#D97706" strokeWidth="2" />
              <circle cx={v.cx - 3} cy={v.cy - 3} r="3" fill="#D97706" />
              <circle cx={v.cx + 3} cy={v.cy + 3} r="3" fill="#D97706" />
            </g>
          ))}

          {/* Dòng phân tử dẫn truyền (Acetylcholine) rơi qua khe synapse khi kích hoạt */}
          {isReleasing && (
            <g>
              {[140, 240, 340, 440].map((dropX, idx) => (
                <circle
                  key={`drop-${idx}`}
                  cx={dropX}
                  cy={295 + releaseProgress * 65}
                  r="6"
                  fill="#F59E0B"
                  opacity={releaseProgress}
                />
              ))}
            </g>
          )}
        </g>

        {/* 4. Nhãn chú thích với ĐƯỜNG NỐI CÓ ĐIỂM NEO KHỚP */}
        {showLabels && (
          <g fontFamily={fontText} fontSize="13" fontWeight="700">
            {/* Nhãn cúc synapse */}
            <g>
              <text x="70" y="150" fill="#B45309" textAnchor="end">
                Cúc synapse
              </text>
              <line x1="75" y1="145" x2="160" y2="180" stroke="#F59E0B" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="160" cy="180" r="3.5" fill="#F59E0B" />
            </g>

            {/* Nhãn khe synapse */}
            <g>
              <text x="575" y="330" fill="#64748B" textAnchor="start">
                Khe synapse (20-30nm)
              </text>
              <line x1="570" y1="325" x2="480" y2="325" stroke="#94A3B8" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="480" cy="325" r="3.5" fill="#94A3B8" />
            </g>

            {/* Nhãn màng sau */}
            <g>
              <text x="70" y="450" fill="#0369A1" textAnchor="end">
                Màng sau synapse (Thụ thể)
              </text>
              <line x1="75" y1="445" x2="140" y2="375" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx="140" cy="375" r="3.5" fill="#0284C7" />
            </g>
          </g>
        )}
      </svg>
    </div>
  );
};
