import React from "react";
import { fontText } from "../theme";

export interface HeartPumpProps {
  /** 0 -> 1 tương ứng với 1 chu kì tim (0.8s) */
  cycleProgress: number;
  width?: number;
  height?: number;
  showLabels?: boolean;
  showBloodFlow?: boolean;
}

export const HeartPump: React.FC<HeartPumpProps> = ({
  cycleProgress,
  width = 700,
  height = 560,
  showLabels = true,
  showBloodFlow = true,
}) => {
  const normProg = ((cycleProgress % 1) + 1) % 1;

  let phaseName = "GIÃN CHUNG (0.4s)";
  let atrialContract = 0;
  let ventContract = 0;
  let avValveOpen = 0.75;
  let slValveOpen = 0.05;

  if (normProg < 0.125) {
    const p = normProg / 0.125;
    phaseName = "CO TÂM NHĨ (0.1s)";
    atrialContract = Math.sin(p * Math.PI);
    avValveOpen = 1.0;
    slValveOpen = 0.0;
  } else if (normProg < 0.5) {
    const p = (normProg - 0.125) / 0.375;
    phaseName = "CO TÂM THẤT (0.3s)";
    ventContract = Math.sin(p * Math.PI);
    avValveOpen = 0.0;
    slValveOpen = 1.0;
  } else {
    phaseName = "GIÃN CHUNG (0.4s)";
    avValveOpen = 0.65;
    slValveOpen = 0.0;
  }

  const cx = width / 2;
  const cy = height / 2 - 20;

  // Màu sắc y học chuẩn
  const o2RichColor = "#EF4444"; // Đỏ tươi (máu giàu oxy)
  const o2PoorColor = "#2563EB"; // Xanh dương (máu nghèo oxy)
  const myocardiumColor = "#FECDD3"; // Cơ tim hồng nhạt
  const myocardiumBorder = "#E11D48"; // Viền cơ tim đỏ đậm

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
          <filter id="heartShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="8" stdDeviation="16" floodColor="#9F1239" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* ================================================================= */}
        {/* 1. MẠCH MÁU PHÍA TRÊN (ĐỘC LẬP, RÕ RÀNG, KHÔNG GIAO CẮT BẤT HỢP LÝ) */}
        {/* ================================================================= */}

        {/* A. Tĩnh mạch chủ trên (Superior Vena Cava) - Ống xanh đứng bên trái */}
        <rect
          x={cx - 145}
          y={cy - 165}
          width={24}
          height={95}
          rx={12}
          fill="#3B82F6"
          stroke="#1D4ED8"
          strokeWidth="3"
        />

        {/* B. Cung Động mạch chủ (Aortic Arch) - Đường cong vắt qua đỉnh tim */}
        <g>
          {/* Cung đỏ uốn cong sang phải */}
          <path
            d={`
              M ${cx - 5} ${cy - 70}
              C ${cx - 5} ${cy - 135}, ${cx + 15} ${cy - 175}, ${cx + 65} ${cy - 175}
              C ${cx + 115} ${cy - 175}, ${cx + 130} ${cy - 135}, ${cx + 130} ${cy - 70}
            `}
            fill="none"
            stroke="#EF4444"
            strokeWidth="24"
            strokeLinecap="round"
          />

          {/* 3 nhánh động mạch cảnh nhô lên từ đỉnh cung */}
          <line x1={cx + 40} y1={cy - 175} x2={cx + 38} y2={cy - 205} stroke="#EF4444" strokeWidth="9" strokeLinecap="round" />
          <line x1={cx + 65} y1={cy - 175} x2={cx + 65} y2={cy - 210} stroke="#EF4444" strokeWidth="9" strokeLinecap="round" />
          <line x1={cx + 90} y1={cy - 172} x2={cx + 92} y2={cy - 205} stroke="#EF4444" strokeWidth="9" strokeLinecap="round" />
        </g>

        {/* C. Động mạch phổi (Pulmonary Trunk) - Chữ Y mềm mại, hoàn toàn không chạm Vena Cava */}
        <g>
          {/* Nhánh phổi phải (về bên trái, dừng cách xa tĩnh mạch chủ) */}
          <path
            d={`M ${cx - 20} ${cy - 110} Q ${cx - 55} ${cy - 115} ${cx - 85} ${cy - 115}`}
            fill="none"
            stroke="#2563EB"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Nhánh phổi trái (về bên phải, luồn dưới cung động mạch chủ) */}
          <path
            d={`M ${cx - 20} ${cy - 110} Q ${cx + 20} ${cy - 110} ${cx + 55} ${cy - 105}`}
            fill="none"
            stroke="#2563EB"
            strokeWidth="18"
            strokeLinecap="round"
          />
          {/* Thân chính nối từ Thất Phải đi lên */}
          <path
            d={`M ${cx - 35} ${cy - 65} Q ${cx - 28} ${cy - 90} ${cx - 20} ${cy - 110}`}
            fill="none"
            stroke="#2563EB"
            strokeWidth="22"
            strokeLinecap="round"
          />
        </g>

        {/* ================================================================= */}
        {/* 2. THÀNH CƠ TIM CHÍNH (ĐƯỜNG CONG LIỀN MẠCH THỐNG NHẤT) */}
        {/* ================================================================= */}
        <g filter="url(#heartShadow)">
          {/* Thân cơ tim trọn vẹn */}
          <path
            d={`
              M ${cx} ${cy - 75}
              C ${cx - 80} ${cy - 95}, ${cx - 175} ${cy - 70}, ${cx - 175} ${cy}
              C ${cx - 175} ${cy + 70}, ${cx - 110 + ventContract * 10} ${cy + 150}, ${cx - 15} ${cy + 195 - ventContract * 12}
              C ${cx + 70 - ventContract * 10} ${cy + 155}, ${cx + 175} ${cy + 75}, ${cx + 175} ${cy}
              C ${cx + 175} ${cy - 70}, ${cx + 80} ${cy - 95}, ${cx} ${cy - 75}
              Z
            `}
            fill={myocardiumColor}
            stroke={myocardiumBorder}
            strokeWidth="5"
            strokeLinejoin="round"
          />

          {/* Vách liên thất & liên nhĩ dày dặn ở giữa */}
          <path
            d={`
              M ${cx - 10} ${cy - 70}
              L ${cx - 10} ${cy + 185}
              L ${cx + 10} ${cy + 185}
              L ${cx + 10} ${cy - 70}
              Z
            `}
            fill="#E11D48"
            opacity="0.85"
          />
        </g>

        {/* ================================================================= */}
        {/* 3. BỐN BUỒNG TIM NỘI BỘ (KHỚP HOÀN TOÀN VỚI THÀNH CƠ TIM) */}
        {/* ================================================================= */}

        {/* A. Tâm Nhĩ Phải (Right Atrium - Trên Trái hình) */}
        <path
          d={`
            M ${cx - 15} ${cy - 65}
            C ${cx - 70} ${cy - 75}, ${cx - 150} ${cy - 50}, ${cx - 150} ${cy - 10}
            C ${cx - 150} ${cy + 15}, ${cx - 80} ${cy + 15}, ${cx - 15} ${cy + 15}
            Z
          `}
          fill="#DBEAFE"
          stroke={o2PoorColor}
          strokeWidth="3"
        />

        {/* B. Tâm Nhĩ Trái (Left Atrium - Trên Phải hình) */}
        <path
          d={`
            M ${cx + 15} ${cy - 65}
            C ${cx + 70} ${cy - 75}, ${cx + 150} ${cy - 50}, ${cx + 150} ${cy - 10}
            C ${cx + 150} ${cy + 15}, ${cx + 80} ${cy + 15}, ${cx + 15} ${cy + 15}
            Z
          `}
          fill="#FFE4E6"
          stroke={o2RichColor}
          strokeWidth="3"
        />

        {/* C. Tâm Thất Phải (Right Ventricle - Dưới Trái hình) */}
        <path
          d={`
            M ${cx - 15} ${cy + 25}
            L ${cx - 145} ${cy + 25}
            C ${cx - 150} ${cy + 75}, ${cx - 100 + ventContract * 15} ${cy + 130}, ${cx - 15} ${cy + 165 - ventContract * 10}
            Z
          `}
          fill="#BFDBFE"
          stroke={o2PoorColor}
          strokeWidth="3"
        />

        {/* D. Tâm Thất Trái (Left Ventricle - Dưới Phải hình) */}
        <path
          d={`
            M ${cx + 15} ${cy + 25}
            L ${cx + 145} ${cy + 25}
            C ${cx + 150} ${cy + 75}, ${cx + 100 - ventContract * 15} ${cy + 130}, ${cx + 15} ${cy + 165 - ventContract * 10}
            Z
          `}
          fill="#FECDD3"
          stroke={o2RichColor}
          strokeWidth="3.5"
        />

        {/* ================================================================= */}
        {/* 4. VAN TIM 1 CHIỀU (GẮN KHỚP VÀO RÃNH NGĂN BUỒNG) */}
        {/* ================================================================= */}

        {/* Van 3 lá bên Phải (Nhĩ - Thất Phải) */}
        <g transform={`translate(${cx - 80}, ${cy + 23})`}>
          <line
            x1="-40"
            y1="0"
            x2={-12 + avValveOpen * 12}
            y2={avValveOpen * 18}
            stroke="#0F172A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="40"
            y1="0"
            x2={12 - avValveOpen * 12}
            y2={avValveOpen * 18}
            stroke="#0F172A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* Van 2 lá bên Trái (Nhĩ - Thất Trái) */}
        <g transform={`translate(${cx + 80}, ${cy + 23})`}>
          <line
            x1="-40"
            y1="0"
            x2={-12 + avValveOpen * 12}
            y2={avValveOpen * 18}
            stroke="#0F172A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <line
            x1="40"
            y1="0"
            x2={12 - avValveOpen * 12}
            y2={avValveOpen * 18}
            stroke="#0F172A"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </g>

        {/* Van tổ chim Động mạch */}
        <g transform={`translate(${cx - 30}, ${cy - 50})`}>
          <line x1="-10" y1="0" x2={-2 - slValveOpen * 6} y2={-slValveOpen * 10} stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
          <line x1="10" y1="0" x2={2 + slValveOpen * 6} y2={-slValveOpen * 10} stroke="#0F172A" strokeWidth="3" strokeLinecap="round" />
        </g>

        {/* ================================================================= */}
        {/* 5. DÒNG MÁU TUẦN HOÀN THEO CHU KÌ */}
        {/* ================================================================= */}
        {showBloodFlow && (
          <g>
            {ventContract > 0.35 ? (
              // Khi tâm thất co: Máu phun vọt lên động mạch
              <>
                <circle cx={cx - 20} cy={cy - 105} r="10" fill="#2563EB" />
                <circle cx={cx - 75} cy={cy - 114} r="9" fill="#2563EB" />
                <circle cx={cx + 60} cy={cy - 165} r="10" fill="#EF4444" />
                <circle cx={cx + 120} cy={cy - 110} r="10" fill="#EF4444" />
              </>
            ) : (
              // Khi nhĩ co / giãn chung: Máu chảy từ nhĩ xuống thất
              <>
                <circle cx={cx - 80} cy={cy - 15 + atrialContract * 25} r="9" fill="#2563EB" opacity="0.9" />
                <circle cx={cx + 80} cy={cy - 15 + atrialContract * 25} r="9" fill="#EF4444" opacity="0.9" />
              </>
            )}
          </g>
        )}

        {/* ================================================================= */}
        {/* 6. CHỮ & NHÃN CHÚ THÍCH CÓ ĐIỂM NEO KHỚP NHAU HOÀN TOÀN */}
        {/* ================================================================= */}
        <g fontFamily={fontText} fontWeight="800" fontSize="14">
          <text x={cx - 80} y={cy - 25} textAnchor="middle" fill="#1E40AF">
            TÂM NHĨ PHẢI
          </text>
          <text x={cx + 80} y={cy - 25} textAnchor="middle" fill="#9F1239">
            TÂM NHĨ TRÁI
          </text>
          <text x={cx - 80} y={cy + 95} textAnchor="middle" fill="#1E40AF">
            TÂM THẤT PHẢI
          </text>
          <text x={cx + 80} y={cy + 95} textAnchor="middle" fill="#9F1239">
            TÂM THẤT TRÁI
          </text>
        </g>

        {/* Đường nối và nhãn động mạch */}
        {showLabels && (
          <g fontFamily={fontText} fontSize="13" fontWeight="700">
            {/* Nhãn Động mạch phổi */}
            <g>
              <text x={cx - 160} y={cy - 115} fill="#2563EB" textAnchor="end">
                Động mạch phổi (máu nghèo O₂)
              </text>
              <line x1={cx - 150} y1={cy - 118} x2={cx - 85} y2={cy - 115} stroke="#2563EB" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx={cx - 85} cy={cy - 115} r="3.5" fill="#2563EB" />
            </g>

            {/* Nhãn Động mạch chủ */}
            <g>
              <text x={cx + 175} y={cy - 140} fill="#EF4444" textAnchor="start">
                Động mạch chủ (máu giàu O₂)
              </text>
              <line x1={cx + 165} y1={cy - 145} x2={cx + 120} y2={cy - 115} stroke="#EF4444" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx={cx + 120} cy={cy - 115} r="3.5" fill="#EF4444" />
            </g>

            {/* Nhãn van nhĩ - thất */}
            <g>
              <text x={cx - 190} y={cy + 25} fill="#475569" textAnchor="end">
                Van nhĩ - thất
              </text>
              <line x1={cx - 180} y1={cy + 23} x2={cx - 125} y2={cy + 23} stroke="#475569" strokeWidth="1.5" strokeDasharray="3 3" />
              <circle cx={cx - 125} cy={cy + 23} r="3" fill="#475569" />
            </g>
          </g>
        )}

        {/* ================================================================= */}
        {/* 7. HUY HIỆU PHA CHU KÌ TIM Ở ĐÁY */}
        {/* ================================================================= */}
        <g transform={`translate(${cx}, ${height - 25})`} fontFamily={fontText}>
          <rect
            x="-170"
            y="-20"
            width="340"
            height="40"
            rx="20"
            fill="#FFFFFF"
            stroke="#CBD5E1"
            strokeWidth="1.5"
            filter="url(#heartShadow)"
          />
          <circle
            cx="-130"
            cy="0"
            r="6"
            fill={normProg < 0.5 ? (normProg < 0.125 ? o2PoorColor : o2RichColor) : "#10B981"}
          />
          <text
            x="0"
            y="5"
            textAnchor="middle"
            fill="#0E1046"
            fontWeight="800"
            fontSize="15"
            letterSpacing="0.02em"
          >
            {phaseName}
          </text>
        </g>
      </svg>
    </div>
  );
};
