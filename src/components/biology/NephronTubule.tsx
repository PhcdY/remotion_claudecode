import React from "react";
import { fontText } from "../theme";

export interface NephronTubuleProps {
  /** 0 -> 1 tiến trình dòng dịch lọc chạy dọc nephron */
  flowProgress: number;
  width?: number;
  height?: number;
  showLabels?: boolean;
  showReabsorption?: boolean;
}

export const NephronTubule: React.FC<NephronTubuleProps> = ({
  flowProgress,
  width = 660,
  height = 540,
  showLabels = true,
  showReabsorption = true,
}) => {
  const normProg = ((flowProgress % 1) + 1) % 1;

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
          <filter id="nephronGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="6" stdDeviation="12" floodColor="#0284C7" floodOpacity="0.1" />
          </filter>
        </defs>

        {/* 1. Mạch máu đến & Cuộn mao mạch cầu thận (Glomerulus) */}
        <g transform="translate(100, 110)">
          {/* Nang Bowman hình chén */}
          <path
            d="M 60 -25 C 20 -40, -30 -10, -30 40 C -30 90, 20 120, 60 105"
            fill="none"
            stroke="#0284C7"
            strokeWidth="12"
            strokeLinecap="round"
          />

          {/* Cuộn mao mạch đỏ bên trong */}
          <circle cx="20" cy="40" r="32" fill="#FEE2E2" stroke="#EF4444" strokeWidth="4" />
          <path
            d="M 5 25 Q 25 15, 30 35 Q 15 55, 35 55"
            fill="none"
            stroke="#EF4444"
            strokeWidth="5"
            strokeLinecap="round"
          />

          {showLabels && (
            <text
              x="20"
              y="-45"
              textAnchor="middle"
              fill="#0E1046"
              fontFamily={fontText}
              fontSize="14"
              fontWeight="700"
            >
              Cầu thận (Lọc máu)
            </text>
          )}
        </g>

        {/* 2. Toàn bộ đường ống dẫn Nephron: Ống lượn gần -> Quai Henle -> Ống lượn xa -> Ống góp */}
        <g filter="url(#nephronGlow)">
          {/* Lớp nền ống thận */}
          <path
            d="M 160 215 
               C 210 240, 210 120, 280 150 
               C 320 170, 310 320, 310 400 
               C 310 450, 380 450, 380 400 
               C 380 320, 380 180, 440 150 
               C 490 120, 500 220, 540 220
               L 540 450"
            fill="none"
            stroke="#E0F2FE"
            strokeWidth="28"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Lòng ống thận */}
          <path
            d="M 160 215 
               C 210 240, 210 120, 280 150 
               C 320 170, 310 320, 310 400 
               C 310 450, 380 450, 380 400 
               C 380 320, 380 180, 440 150 
               C 490 120, 500 220, 540 220
               L 540 450"
            fill="none"
            stroke="#0284C7"
            strokeWidth="4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dòng chất lỏng chuyển động dọc ống */}
          <path
            d="M 160 215 
               C 210 240, 210 120, 280 150 
               C 320 170, 310 320, 310 400 
               C 310 450, 380 450, 380 400 
               C 380 320, 380 180, 440 150 
               C 490 120, 500 220, 540 220
               L 540 450"
            fill="none"
            stroke="#F59E0B"
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray="18 16"
            strokeDashoffset={-normProg * 68}
            opacity="0.8"
          />
        </g>

        {/* 3. Tái hấp thu vật chất (Mũi tên sinh học) */}
        {showReabsorption && (
          <g fontFamily={fontText} fontSize="12" fontWeight="700">
            {/* Tái hấp thu H2O ở quai Henle nhánh xuống */}
            <g transform="translate(250, 340)">
              <line x1="50" y1="0" x2="0" y2="0" stroke="#0284C7" strokeWidth="2.5" markerEnd="url(#arrow)" />
              <text x="-5" y="4" textAnchor="end" fill="#0284C7">
                H₂O (99%)
              </text>
            </g>

            {/* Tái hấp thu Na+, Cl- ở quai Henle nhánh lên */}
            <g transform="translate(440, 340)">
              <line x1="-50" y1="0" x2="0" y2="0" stroke="#EA580C" strokeWidth="2.5" />
              <text x="10" y="4" textAnchor="start" fill="#EA580C">
                Na⁺, Cl⁻
              </text>
            </g>

            {/* Tái hấp thu Glucose & Acid amin ở ống lượn gần */}
            <g transform="translate(240, 100)">
              <text x="0" y="0" textAnchor="middle" fill="#16A34A">
                Glucose 100%
              </text>
              <line x1="0" y1="5" x2="0" y2="25" stroke="#16A34A" strokeWidth="2" strokeDasharray="3 3" />
            </g>
          </g>
        )}

        {/* 4. Nhãn giải phẫu các đoạn ống */}
        {showLabels && (
          <g fontFamily={fontText} fontSize="13" fontWeight="600" fill="#475569">
            <text x="230" y="270" textAnchor="middle">
              Ống lượn gần
            </text>
            <text x="345" y="490" textAnchor="middle" fontWeight="700" fill="#0369A1">
              Quai Henle
            </text>
            <text x="470" y="90" textAnchor="middle">
              Ống lượn xa
            </text>
            <text x="540" y="480" textAnchor="middle" fontWeight="700" fill="#0F172A">
              Ống góp
            </text>
          </g>
        )}
      </svg>
    </div>
  );
};
