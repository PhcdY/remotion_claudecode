import React from "react";
import { AbsoluteFill, Composition, interpolate, Sequence, useCurrentFrame } from "remotion";
import { BrandBackground } from "../../components/BrandFrame";
import { MathText, useKatexFonts } from "../../components/MathText";
import { PhysicsVector } from "../../components/physics/PhysicsVector";
import { colors, fontText, halo, layout } from "../../components/theme";

// ============================================================================
// HEADER CHUNG CHO MỖI CẢNH SHOWCASE
// ============================================================================
const SceneHeader: React.FC<{ title: string; subtitle: string }> = ({ title, subtitle }) => (
  <div style={{ position: "absolute", left: layout.side, top: 40, zIndex: 10 }}>
    <div
      style={{
        fontFamily: fontText,
        fontSize: 38,
        fontWeight: 800,
        color: colors.text,
        textShadow: halo("#FFFFFF"),
        display: "flex",
        alignItems: "center",
        gap: 16,
      }}
    >
      <div
        style={{
          width: 14,
          height: 38,
          borderRadius: 4,
          background: `linear-gradient(180deg, ${colors.brandBlue}, ${colors.brandIndigo})`,
        }}
      />
      <MathText text={title} />
    </div>
    <div
      style={{
        fontFamily: fontText,
        fontSize: 22,
        color: colors.muted,
        marginTop: 6,
        marginLeft: 30,
        fontWeight: 600,
      }}
    >
      <MathText text={subtitle} />
    </div>
  </div>
);

// ============================================================================
// CẢNH 1: SÓNG CƠ HỌC — HIỆN TƯỢNG SÓNG DỪNG TRÊN SỢI DÂY (LỚP 11)
// ============================================================================
const StandingWaveScene: React.FC = () => {
  const frame = useCurrentFrame();
  const time = frame / 30; // giây

  const xStart = 280;
  const xEnd = 1640;
  const length = xEnd - xStart; // 1360 px
  const numLoops = 4; // 4 bụng sóng
  const loopWidth = length / numLoops; // 340 px
  const wavelength = loopWidth * 2; // 680 px
  const baseY = 600;
  const maxAmp = 95; // Biên độ cực đại bụng sóng
  const omega = 2 * Math.PI * 1.5; // Tần số góc 1.5 Hz

  // Tính chuỗi điểm của sợi dây tại thời điểm hiện tại
  const numPoints = 200;
  const pathD = Array.from({ length: numPoints + 1 }, (_, i) => {
    const x = xStart + (i / numPoints) * length;
    const kx = (2 * Math.PI * (x - xStart)) / wavelength;
    // Sóng dừng 2 đầu cố định: y(x, t) = 2A * sin(kx) * cos(omega * t)
    const yOffset = maxAmp * Math.sin(kx) * Math.cos(omega * time);
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${(baseY + yOffset).toFixed(1)}`;
  }).join(" ");

  // Đường bao biên độ cực đại trên và dưới (Envelope)
  const envTop = Array.from({ length: numPoints + 1 }, (_, i) => {
    const x = xStart + (i / numPoints) * length;
    const kx = (2 * Math.PI * (x - xStart)) / wavelength;
    const yOffset = -maxAmp * Math.abs(Math.sin(kx));
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${(baseY + yOffset).toFixed(1)}`;
  }).join(" ");

  const envBottom = Array.from({ length: numPoints + 1 }, (_, i) => {
    const x = xStart + (i / numPoints) * length;
    const kx = (2 * Math.PI * (x - xStart)) / wavelength;
    const yOffset = maxAmp * Math.abs(Math.sin(kx));
    return `${i === 0 ? "M" : "L"} ${x.toFixed(1)} ${(baseY + yOffset).toFixed(1)}`;
  }).join(" ");

  // Vị trí các nút sóng (Nodes)
  const nodes = Array.from({ length: numLoops + 1 }, (_, i) => xStart + i * loopWidth);
  // Vị trí các bụng sóng (Antinodes)
  const antinodes = Array.from({ length: numLoops }, (_, i) => xStart + (i + 0.5) * loopWidth);

  // Animation vươn vào
  const enterProgress = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: "clamp" });

  return (
    <AbsoluteFill>
      <SceneHeader
        subtitle="Nút sóng đứng yên — Bụng sóng dao động cực đại — Bề rộng một bụng sóng $\\frac{\\lambda}{2}$"
        title="1. Sóng cơ học: Hiện tượng sóng dừng trên sợi dây đàn hồi"
      />

      <svg height={1080} style={{ position: "absolute", left: 0, top: 0 }} width={1920}>
        {/* Giá cố định hai đầu dây */}
        <rect
          fill="#334155"
          height={160}
          rx={4}
          width={18}
          x={xStart - 18}
          y={baseY - 80}
        />
        <rect
          fill="#334155"
          height={160}
          rx={4}
          width={18}
          x={xEnd}
          y={baseY - 80}
        />
        {/* Nét gạch đế giá đỡ */}
        <line stroke="#64748B" strokeWidth={3} x1={xStart - 35} x2={xStart} y1={baseY + 80} y2={baseY + 80} />
        <line stroke="#64748B" strokeWidth={3} x1={xEnd} x2={xEnd + 35} y1={baseY + 80} y2={baseY + 80} />

        {/* Trục cân bằng nét đứt */}
        <line
          stroke={colors.axis}
          strokeDasharray="6 6"
          strokeWidth={1.5}
          x1={xStart}
          x2={xEnd}
          y1={baseY}
          y2={baseY}
        />

        {/* Vùng mờ bao hình dao động (Envelope bóng mờ) */}
        <path
          d={`${envTop} L ${xEnd} ${baseY} ${envBottom.replace("M", "L")} Z`}
          fill={colors.brandBlue}
          opacity={0.08}
        />
        {/* Đường bao biên độ cực đại nét đứt */}
        <path d={envTop} fill="none" opacity={0.4} stroke={colors.brandIndigo} strokeDasharray="4 4" strokeWidth={2} />
        <path d={envBottom} fill="none" opacity={0.4} stroke={colors.brandIndigo} strokeDasharray="4 4" strokeWidth={2} />

        {/* Sợi dây sóng dừng dao động */}
        <path
          d={pathD}
          fill="none"
          opacity={enterProgress}
          stroke={colors.brandBlue}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={6}
        />

        {/* Các nút sóng (Nodes) */}
        {nodes.map((nx, idx) => (
          <g key={`node-${idx}`}>
            <circle cx={nx} cy={baseY} fill="#FFFFFF" r={7} stroke={colors.decrease} strokeWidth={3.5} />
            {idx === 2 && (
              <foreignObject height={40} width={100} x={nx - 50} y={baseY + 16}>
                <div style={{ textAlign: "center", fontSize: 22, fontWeight: 700, color: colors.decrease, textShadow: halo("#FFFFFF") }}>
                  <MathText text="Nút" />
                </div>
              </foreignObject>
            )}
          </g>
        ))}

        {/* Các bụng sóng (Antinodes) */}
        {antinodes.map((ax, idx) => (
          <g key={`antinode-${idx}`}>
            {/* Mũi tên biên độ dao động cực đại ở bụng số 1 */}
            {idx === 0 && (
              <>
                <line
                  stroke={colors.increase}
                  strokeWidth={2.5}
                  x1={ax}
                  x2={ax}
                  y1={baseY - maxAmp + 6}
                  y2={baseY + maxAmp - 6}
                />
                <foreignObject height={40} width={120} x={ax + 15} y={baseY - 20}>
                  <div style={{ fontSize: 22, fontWeight: 700, color: colors.increase, textShadow: halo("#FFFFFF") }}>
                    <MathText text="Bụng ($2A$)" />
                  </div>
                </foreignObject>
              </>
            )}
          </g>
        ))}

        {/* Thước đo bước sóng và bề rộng bụng sóng ở dưới */}
        {/* Thước đo lambda / 2 (1 bụng) */}
        <g opacity={enterProgress}>
          <line stroke={colors.muted} strokeWidth={1.5} x1={nodes[1]} x2={nodes[1]} y1={baseY + 130} y2={baseY + 180} />
          <line stroke={colors.muted} strokeWidth={1.5} x1={nodes[2]} x2={nodes[2]} y1={baseY + 130} y2={baseY + 180} />
          <line stroke={colors.text} strokeWidth={2} x1={nodes[1]} x2={nodes[2]} y1={baseY + 165} y2={baseY + 165} />
          <circle cx={nodes[1]} cy={baseY + 165} fill={colors.text} r={3} />
          <circle cx={nodes[2]} cy={baseY + 165} fill={colors.text} r={3} />
          <foreignObject height={50} width={200} x={(nodes[1] + nodes[2]) / 2 - 100} y={baseY + 175}>
            <div style={{ textAlign: "center", fontSize: 24, fontWeight: 700, color: colors.text, textShadow: halo("#FFFFFF") }}>
              <MathText text="Bề rộng bụng: $\\frac{\\lambda}{2}$" />
            </div>
          </foreignObject>
        </g>

        {/* Thước đo 1 bước sóng lambda (2 bụng) */}
        <g opacity={enterProgress}>
          <line stroke={colors.muted} strokeWidth={1.5} x1={nodes[2]} x2={nodes[2]} y1={baseY + 130} y2={baseY + 260} />
          <line stroke={colors.muted} strokeWidth={1.5} x1={nodes[4]} x2={nodes[4]} y1={baseY + 130} y2={baseY + 260} />
          <line stroke={colors.brandBlue} strokeWidth={2.5} x1={nodes[2]} x2={nodes[4]} y1={baseY + 245} y2={baseY + 245} />
          <circle cx={nodes[2]} cy={baseY + 245} fill={colors.brandBlue} r={4} />
          <circle cx={nodes[4]} cy={baseY + 245} fill={colors.brandBlue} r={4} />
          <foreignObject height={50} width={260} x={(nodes[2] + nodes[4]) / 2 - 130} y={baseY + 255}>
            <div style={{ textAlign: "center", fontSize: 26, fontWeight: 800, color: colors.brandBlue, textShadow: halo("#FFFFFF") }}>
              <MathText text="1 bước sóng: $\\lambda$" />
            </div>
          </foreignObject>
        </g>
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// CẢNH 2: QUANG HÌNH — KHÚC XẠ VÀ PHẢN XẠ TOÀN PHẦN (LỚP 11 & TSA)
// ============================================================================
const TotalInternalReflectionScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Mặt phân cách ở Y = 560
  const boundaryY = 560;
  const pointO = { x: 960, y: boundaryY };

  // Chiết suất
  const n1 = 1.33; // Nước (dưới)
  const n2 = 1.0; // Không khí (trên)
  const criticalAngleDeg = (Math.asin(n2 / n1) * 180) / Math.PI; // ~48.75 độ

  // Góc tới i tăng dần từ 28 độ lên 65 độ theo frame (0 -> 75 frame)
  const currentAngleDeg = interpolate(frame, [5, 70], [28, 65], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  const currentAngleRad = (currentAngleDeg * Math.PI) / 180;

  // Tính góc khúc xạ r theo định luật Snell: n1 * sin(i) = n2 * sin(r)
  const sinR = (n1 / n2) * Math.sin(currentAngleRad);
  const isTIR = sinR >= 1.0; // Phản xạ toàn phần khi sinR >= 1
  const refrAngleRad = !isTIR ? Math.asin(sinR) : Math.PI / 2;
  const refrAngleDeg = (!isTIR ? (refrAngleRad * 180) / Math.PI : 90);

  // Độ dài tia sáng
  const rayLen = 380;

  // Tia tới S -> O (từ dưới nước lên)
  const sourceS = {
    x: pointO.x - rayLen * Math.sin(currentAngleRad),
    y: pointO.y + rayLen * Math.cos(currentAngleRad),
  };

  // Tia phản xạ O -> R (hắt ngược xuống nước với góc phản xạ i' = i)
  const rayR = {
    x: pointO.x + rayLen * Math.sin(currentAngleRad),
    y: pointO.y + rayLen * Math.cos(currentAngleRad),
  };

  // Tia khúc xạ O -> K (loe ra không khí với góc r > i)
  const rayK = {
    x: pointO.x + rayLen * Math.sin(refrAngleRad),
    y: pointO.y - rayLen * Math.cos(refrAngleRad),
  };

  // Cường độ sáng (Opacity) tia khúc xạ và phản xạ
  const refrOpacity = isTIR ? 0 : Math.max(0, 1 - (sinR - 0.7) / 0.3);
  const reflOpacity = isTIR ? 1 : 0.25 + 0.75 * Math.pow(Math.sin(currentAngleRad), 2);

  return (
    <AbsoluteFill>
      <SceneHeader
        subtitle="Góc tới $i$ vượt qua góc giới hạn $i_{gh} \\approx 48{,}7^\\circ \\to$ Toàn bộ ánh sáng bị phản xạ ngược lại"
        title="2. Quang hình học: Hiện tượng Phản xạ toàn phần"
      />

      <svg height={1080} style={{ position: "absolute", left: 0, top: 0 }} width={1920}>
        {/* Vùng môi trường 1: Nước (n1 = 1.33) */}
        <rect fill="#EBF3FE" height={1080 - boundaryY} width={1920} x={0} y={boundaryY} />
        {/* Nhãn môi trường 1 */}
        <foreignObject height={80} width={360} x={layout.side} y={boundaryY + 40}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.brandBlue }}>
              <MathText text="Nước: $n_1 = 1{,}33$" />
            </div>
            <div style={{ fontSize: 18, color: colors.muted, marginTop: 4 }}>Môi trường chiết quang hơn</div>
          </div>
        </foreignObject>

        {/* Vùng môi trường 2: Không khí (n2 = 1.00) */}
        <foreignObject height={80} width={360} x={layout.side} y={boundaryY - 100}>
          <div>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.text }}>
              <MathText text="Không khí: $n_2 = 1{,}00$" />
            </div>
            <div style={{ fontSize: 18, color: colors.muted, marginTop: 4 }}>Môi trường chiết quang kém</div>
          </div>
        </foreignObject>

        {/* Mặt phân cách hai môi trường */}
        <line stroke={colors.brandBlue} strokeWidth={3} x1={0} x2={1920} y1={boundaryY} y2={boundaryY} />

        {/* Pháp tuyến NN' thẳng đứng nét đứt */}
        <line
          stroke={colors.muted}
          strokeDasharray="8 8"
          strokeWidth={2}
          x1={pointO.x}
          x2={pointO.x}
          y1={boundaryY - 400}
          y2={boundaryY + 400}
        />
        <foreignObject height={30} width={40} x={pointO.x + 10} y={boundaryY - 400}>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.muted }}><MathText text="N" /></div>
        </foreignObject>
        <foreignObject height={30} width={40} x={pointO.x + 10} y={boundaryY + 370}>
          <div style={{ fontSize: 20, fontWeight: 700, color: colors.muted }}><MathText text="N'" /></div>
        </foreignObject>

        {/* Tia tới (Incident Ray: S -> O) */}
        <line
          stroke={colors.warn}
          strokeLinecap="round"
          strokeWidth={4.5}
          x1={sourceS.x}
          x2={pointO.x}
          y1={sourceS.y}
          y2={pointO.y}
        />
        {/* Nguồn phát laser */}
        <circle cx={sourceS.x} cy={sourceS.y} fill={colors.warn} r={9} />
        <foreignObject height={40} width={140} x={sourceS.x - 150} y={sourceS.y - 15}>
          <div style={{ textAlign: "right", fontSize: 22, fontWeight: 700, color: colors.warn, textShadow: halo("#FFFFFF") }}>
            <MathText text="Tia tới" />
          </div>
        </foreignObject>

        {/* Cung đo góc tới i */}
        {(() => {
          const arcR = 75;
          const arcStartX = pointO.x;
          const arcStartY = pointO.y + arcR;
          const arcEndX = pointO.x - arcR * Math.sin(currentAngleRad);
          const arcEndY = pointO.y + arcR * Math.cos(currentAngleRad);
          return (
            <path
              d={`M ${arcStartX} ${arcStartY} A ${arcR} ${arcR} 0 0 0 ${arcEndX} ${arcEndY}`}
              fill="none"
              stroke={colors.warn}
              strokeWidth={2.5}
            />
          );
        })()}
        <foreignObject height={40} width={120} x={pointO.x - 90} y={pointO.y + 60}>
          <div style={{ fontSize: 22, fontWeight: 800, color: colors.warn, textShadow: halo("#FFFFFF") }}>
            <MathText text={`$i = ${currentAngleDeg.toFixed(0)}^\\circ$`} />
          </div>
        </foreignObject>

        {/* Tia khúc xạ (Refracted Ray: O -> K) */}
        {!isTIR && (
          <g opacity={refrOpacity}>
            <line
              stroke={colors.increase}
              strokeLinecap="round"
              strokeWidth={4.5}
              x1={pointO.x}
              x2={rayK.x}
              y1={pointO.y}
              y2={rayK.y}
            />
            {/* Cung đo góc khúc xạ r */}
            {(() => {
              const arcR = 60;
              const arcStartX = pointO.x;
              const arcStartY = pointO.y - arcR;
              const arcEndX = pointO.x + arcR * Math.sin(refrAngleRad);
              const arcEndY = pointO.y - arcR * Math.cos(refrAngleRad);
              return (
                <path
                  d={`M ${arcStartX} ${arcStartY} A ${arcR} ${arcR} 0 0 1 ${arcEndX} ${arcEndY}`}
                  fill="none"
                  stroke={colors.increase}
                  strokeWidth={2}
                />
              );
            })()}
            <foreignObject height={40} width={140} x={pointO.x + 70} y={pointO.y - 75}>
              <div style={{ fontSize: 22, fontWeight: 800, color: colors.increase, textShadow: halo("#FFFFFF") }}>
                <MathText text={`$r = ${refrAngleDeg.toFixed(0)}^\\circ$`} />
              </div>
            </foreignObject>
            <foreignObject height={40} width={150} x={rayK.x + 10} y={rayK.y - 15}>
              <div style={{ fontSize: 22, fontWeight: 700, color: colors.increase, textShadow: halo("#FFFFFF") }}>
                <MathText text="Tia khúc xạ" />
              </div>
            </foreignObject>
          </g>
        )}

        {/* Tia phản xạ (Reflected Ray: O -> R) */}
        <g opacity={reflOpacity}>
          <line
            stroke={isTIR ? colors.decrease : colors.warn}
            strokeLinecap="round"
            strokeWidth={isTIR ? 6 : 3}
            x1={pointO.x}
            x2={rayR.x}
            y1={pointO.y}
            y2={rayR.y}
          />
          <foreignObject height={50} width={260} x={rayR.x + 15} y={rayR.y - 10}>
            <div style={{ fontSize: 22, fontWeight: 700, color: isTIR ? colors.decrease : colors.warn, textShadow: halo("#FFFFFF") }}>
              <MathText text={isTIR ? "Phản xạ toàn phần!" : "Tia phản xạ mờ"} />
            </div>
          </foreignObject>
        </g>

        {/* Điểm tới O */}
        <circle cx={pointO.x} cy={pointO.y} fill={colors.text} r={5} />
        <foreignObject height={30} width={30} x={pointO.x + 8} y={pointO.y + 6}>
          <div style={{ fontSize: 20, fontWeight: 800, color: colors.text }}><MathText text="O" /></div>
        </foreignObject>

        {/* Badge trạng thái ở góc phải */}
        <foreignObject height={130} width={420} x={1420} y={130}>
          <div
            style={{
              padding: "16px 22px",
              borderRadius: 14,
              border: `2px solid ${isTIR ? colors.decrease : colors.brandBlue}`,
              backgroundColor: isTIR ? "#FEF2F2" : "#F0F7FF",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 18, color: colors.muted, fontWeight: 600 }}>
              <MathText text={`Góc giới hạn: $i_{gh} = \\arcsin\\left(\\frac{1}{1{,}33}\\right) \\approx ${criticalAngleDeg.toFixed(1)}^\\circ$`} />
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: isTIR ? colors.decrease : colors.brandBlue,
                marginTop: 8,
              }}
            >
              <MathText text={isTIR ? "ĐANG PHẢN XẠ TOÀN PHẦN" : "ĐANG CÓ KHÚC XẠ ($r > i$)"} />
            </div>
          </div>
        </foreignObject>
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// CẢNH 3: NHIỆT HỌC — ĐỊNH LUẬT BOYLE & ÁP SUẤT PHÂN TỬ KHÍ (LỚP 12)
// ============================================================================
// Danh sách 24 hạt phân tử khí với vận tốc ngẫu nhiên cố định
const GAS_PARTICLES = Array.from({ length: 26 }, (_, i) => ({
  id: i,
  xFrac: 0.1 + (i % 5) * 0.18 + (Math.sin(i * 11) * 0.05),
  yFrac: 0.15 + Math.floor(i / 5) * 0.15 + (Math.cos(i * 7) * 0.04),
  vx: (Math.sin(i * 13) > 0 ? 1 : -1) * (140 + (i % 6) * 30),
  vy: (Math.cos(i * 17) > 0 ? 1 : -1) * (120 + (i % 5) * 25),
}));

const GasBoyleScene: React.FC = () => {
  const frame = useCurrentFrame();
  const time = frame / 30;

  // Xilanh nằm ở X: [340, 1140], Y: [420, 760]
  const cylX = 340;
  const cylY = 420;
  const cylW = 760;
  const cylH = 340;

  // Pít-tông nén khí từ phải sang trái: ban đầu ở mép phải (thể tích V0), sau đó nén lại một nửa (V0 / 2)
  const compressProgress = interpolate(frame, [15, 60], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });
  // Độ rộng buồng chứa khí co từ cylW xuống cylW * 0.52
  const chamberW = cylW * (1 - 0.48 * compressProgress);
  const pistonX = cylX + chamberW;

  // Áp suất p tăng từ 1.0 atm lên 1.92 atm
  const pressureAtm = 1.0 + 0.92 * compressProgress;

  return (
    <AbsoluteFill>
      <SceneHeader
        subtitle="Nén thể tích $V$ giảm một nửa $\\to$ Mật độ va chạm phân tử tăng gấp đôi $\\to$ Áp suất $p$ tăng gấp đôi"
        title="3. Nhiệt học: Bản chất phân tử của Áp suất & Định luật Boyle"
      />

      <svg height={1080} style={{ position: "absolute", left: 0, top: 0 }} width={1920}>
        {/* Vỏ Xilanh thành kim loại dày */}
        {/* Nền trong suốt xilanh */}
        <rect
          fill="#F8FAFC"
          height={cylH}
          stroke={colors.axis}
          strokeWidth={3}
          width={cylW}
          x={cylX}
          y={cylY}
        />
        {/* Thành trên xilanh */}
        <rect fill="#475569" height={16} width={cylW + 20} x={cylX - 10} y={cylY - 16} />
        {/* Thành dưới xilanh */}
        <rect fill="#475569" height={16} width={cylW + 20} x={cylX - 10} y={cylY + cylH} />
        {/* Đáy cố định bên trái xilanh */}
        <rect fill="#475569" height={cylH + 32} width={20} x={cylX - 20} y={cylY - 16} />

        {/* Các hạt phân tử khí nảy trong buồng chứa [cylX, pistonX] */}
        {GAS_PARTICLES.map((p) => {
          // Tính toạ độ nảy trong buồng chamberW x cylH
          const spanX = chamberW - 28;
          const spanY = cylH - 28;
          // Sử dụng hàm triangle wave để mô phỏng hạt nảy qua lại đàn hồi
          const rawX = (p.xFrac * spanX + p.vx * time) % (2 * spanX);
          const bounceX = rawX < 0 ? rawX + 2 * spanX : rawX;
          const posX = cylX + 14 + (bounceX > spanX ? 2 * spanX - bounceX : bounceX);

          const rawY = (p.yFrac * spanY + p.vy * time) % (2 * spanY);
          const bounceY = rawY < 0 ? rawY + 2 * spanY : rawY;
          const posY = cylY + 14 + (bounceY > spanY ? 2 * spanY - bounceY : bounceY);

          return (
            <circle
              cx={posX}
              cy={posY}
              fill={colors.brandBlue}
              key={p.id}
              opacity={0.85}
              r={7}
            />
          );
        })}

        {/* Pít-tông trượt kim loại */}
        <rect
          fill="#334155"
          height={cylH - 4}
          rx={3}
          stroke="#1E293B"
          strokeWidth={2}
          width={28}
          x={pistonX - 28}
          y={cylY + 2}
        />
        {/* Cần đẩy pít-tông vươn ra ngoài bên phải */}
        <rect
          fill="#64748B"
          height={32}
          rx={4}
          width={cylW + 120 - chamberW}
          x={pistonX}
          y={cylY + cylH / 2 - 16}
        />
        {/* Mũi tên lực nén F_nén */}
        {compressProgress > 0 && compressProgress < 1 && (
          <PhysicsVector
            angleDeg={180}
            color={colors.decrease}
            from={{ x: pistonX + 180, y: cylY + cylH / 2 }}
            label="\\vec{F}_{nén}"
            length={120}
          />
        )}

        {/* Thước đo thể tích V dưới xilanh */}
        <line stroke={colors.muted} strokeWidth={1.5} x1={cylX} x2={cylX} y1={cylY + cylH + 30} y2={cylY + cylH + 70} />
        <line stroke={colors.muted} strokeWidth={1.5} x1={pistonX} x2={pistonX} y1={cylY + cylH + 30} y2={cylY + cylH + 70} />
        <line stroke={colors.brandBlue} strokeWidth={2.5} x1={cylX} x2={pistonX} y1={cylY + cylH + 55} y2={cylY + cylH + 55} />
        <circle cx={cylX} cy={cylY + cylH + 55} fill={colors.brandBlue} r={4} />
        <circle cx={pistonX} cy={cylY + cylH + 55} fill={colors.brandBlue} r={4} />
        <foreignObject height={40} width={240} x={cylX + chamberW / 2 - 120} y={cylY + cylH + 65}>
          <div style={{ textAlign: "center", fontSize: 24, fontWeight: 800, color: colors.brandBlue, textShadow: halo("#FFFFFF") }}>
            <MathText text={`Thể tích: $V = ${(100 * (1 - 0.48 * compressProgress)).toFixed(0)}\\%$`} />
          </div>
        </foreignObject>

        {/* ĐỒNG HỒ ĐO ÁP SUẤT (MANOMETER) BÊN PHẢI */}
        {(() => {
          const gaugeC = { x: 1480, y: 580 };
          const gaugeR = 125;
          // Góc kim đồng hồ: 1.0 atm -> -130 độ, 2.0 atm -> +20 độ
          const needleDeg = interpolate(pressureAtm, [1.0, 2.0], [-135, 15]);
          const needleRad = (needleDeg * Math.PI) / 180;
          const needleLen = 95;

          return (
            <g>
              {/* Mặt đồng hồ viền kim loại */}
              <circle cx={gaugeC.x} cy={gaugeC.y} fill="#FFFFFF" r={gaugeR} stroke="#475569" strokeWidth={6} />
              <circle cx={gaugeC.x} cy={gaugeC.y} fill="none" r={gaugeR - 10} stroke={colors.grid} strokeWidth={1.5} />

              {/* Vạch chia áp suất */}
              {Array.from({ length: 9 }, (_, i) => {
                const pVal = 0.8 + i * 0.15;
                const aDeg = interpolate(pVal, [1.0, 2.0], [-135, 15]);
                const aRad = (aDeg * Math.PI) / 180;
                const p1 = { x: gaugeC.x + (gaugeR - 22) * Math.cos(aRad), y: gaugeC.y + (gaugeR - 22) * Math.sin(aRad) };
                const p2 = { x: gaugeC.x + (gaugeR - 10) * Math.cos(aRad), y: gaugeC.y + (gaugeR - 10) * Math.sin(aRad) };
                return (
                  <line
                    key={`tick-${i}`}
                    stroke={pVal > 1.8 ? colors.decrease : colors.text}
                    strokeWidth={i % 2 === 0 ? 3 : 1.5}
                    x1={p1.x}
                    x2={p2.x}
                    y1={p1.y}
                    y2={p2.y}
                  />
                );
              })}

              {/* Kim đồng hồ màu đỏ */}
              <line
                stroke={colors.decrease}
                strokeLinecap="round"
                strokeWidth={4}
                x1={gaugeC.x}
                x2={gaugeC.x + needleLen * Math.cos(needleRad)}
                y1={gaugeC.y}
                y2={gaugeC.y + needleLen * Math.sin(needleRad)}
              />
              <circle cx={gaugeC.x} cy={gaugeC.y} fill="#1E293B" r={9} />

              {/* Nhãn đồng hồ */}
              <foreignObject height={40} width={140} x={gaugeC.x - 70} y={gaugeC.y + 40}>
                <div style={{ textAlign: "center", fontSize: 18, color: colors.muted, fontWeight: 700 }}>
                  Áp kế (atm)
                </div>
              </foreignObject>

              {/* Giá trị số áp suất hiển thị to */}
              <foreignObject height={50} width={240} x={gaugeC.x - 120} y={gaugeC.y + gaugeR + 25}>
                <div style={{ textAlign: "center", fontSize: 32, fontWeight: 800, color: colors.decrease, textShadow: halo("#FFFFFF") }}>
                  <MathText text={`$p = ${pressureAtm.toFixed(2).replace(".", ",")}\\text{ atm}$`} />
                </div>
              </foreignObject>

              {/* Công thức Định luật Boyle */}
              <foreignObject height={80} width={380} x={gaugeC.x - 190} y={gaugeC.y - gaugeR - 110}>
                <div
                  style={{
                    padding: "12px 20px",
                    borderRadius: 12,
                    backgroundColor: "#F1F5F9",
                    border: `1.5px solid ${colors.axis}`,
                    textAlign: "center",
                    fontSize: 24,
                    fontWeight: 800,
                    color: colors.brandIndigo,
                  }}
                >
                  <MathText text="Định luật Boyle: $p \\cdot V = \\text{const}$" />
                </div>
              </foreignObject>
            </g>
          );
        })()}
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// CẢNH 4: TỪ TRƯỜNG — LỰC LORENTZ VÀ QUỸ ĐẠO TRÒN CỦA HẠT ĐIỆN TÍCH (LỚP 11)
// ============================================================================
const LorentzForceScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Tâm quỹ đạo tròn C = (960, 600), bán kính R = 240px
  const centerC = { x: 960, y: 600 };
  const radiusR = 240;

  // Hạt bắt đầu từ mép dưới góc -90 độ quay cùng chiều kim đồng hồ
  // Góc theta biến thiên từ -Math.PI / 2 đến Math.PI / 2 + Math.PI = 3*Math.PI/2
  const angleTheta = interpolate(frame, [0, 75], [-Math.PI / 2, (3 * Math.PI) / 2]);

  // Vị trí hạt mang điện trên đường tròn
  const particleX = centerC.x + radiusR * Math.cos(angleTheta);
  const particleY = centerC.y + radiusR * Math.sin(angleTheta);

  // Vectơ vận tốc v tiếp tuyến đường tròn (hướng theo chiều quay dTheta > 0)
  // v = (-sin(theta), cos(theta))
  const velAngle = angleTheta + Math.PI / 2;

  // Vectơ lực Lorentz F_L luôn hướng về tâm C: F = (-cos(theta), -sin(theta))
  const forceAngle = angleTheta + Math.PI;

  return (
    <AbsoluteFill>
      <SceneHeader
        subtitle="Lực $\\vec{F}_L \\perp \\vec{v}$ đóng vai trò lực hướng tâm $\\to$ Hạt chuyển động tròn đều với bán kính $R = \\frac{mv}{|q|B}$"
        title="4. Từ trường: Lực Lorentz uốn cong quỹ đạo hạt mang điện"
      />

      <svg height={1080} style={{ position: "absolute", left: 0, top: 0 }} width={1920}>
        {/* VÙNG TỪ TRƯỜNG ĐỀU B HƯỚNG VÀO TRANG GIẤY (KÝ HIỆU DẤU NHÂN TRONG TRÒN) */}
        {/* Khung vùng từ trường */}
        <rect
          fill="#F8FAFC"
          height={680}
          rx={16}
          stroke={colors.axis}
          strokeDasharray="6 6"
          strokeWidth={2}
          width={1320}
          x={300}
          y={250}
        />
        <foreignObject height={40} width={260} x={320} y={260}>
          <div style={{ fontSize: 22, fontWeight: 700, color: colors.muted }}>
            <MathText text="Từ trường đều: $\\vec{B} \\otimes$" />
          </div>
        </foreignObject>

        {/* Lưới các ký hiệu từ trường B hướng vào trong */}
        {Array.from({ length: 6 }, (_, row) =>
          Array.from({ length: 11 }, (_, col) => {
            const bx = 370 + col * 118;
            const by = 320 + row * 105;
            return (
              <g key={`b-field-${row}-${col}`} opacity={0.35}>
                <circle cx={bx} cy={by} fill="none" r={10} stroke="#94A3B8" strokeWidth={1.5} />
                <line stroke="#94A3B8" strokeWidth={1.5} x1={bx - 6} x2={bx + 6} y1={by - 6} y2={by + 6} />
                <line stroke="#94A3B8" strokeWidth={1.5} x1={bx + 6} x2={bx - 6} y1={by - 6} y2={by + 6} />
              </g>
            );
          })
        )}

        {/* Quỹ đạo tròn của hạt */}
        <circle
          cx={centerC.x}
          cy={centerC.y}
          fill="none"
          r={radiusR}
          stroke={colors.brandBlue}
          strokeDasharray="8 6"
          strokeWidth={2.5}
        />

        {/* Tâm đường tròn C */}
        <circle cx={centerC.x} cy={centerC.y} fill={colors.brandIndigo} r={6} />
        <foreignObject height={30} width={40} x={centerC.x + 10} y={centerC.y - 12}>
          <div style={{ fontSize: 22, fontWeight: 800, color: colors.brandIndigo }}><MathText text="C" /></div>
        </foreignObject>

        {/* Đường nối bán kính R từ tâm tới hạt */}
        <line
          stroke={colors.muted}
          strokeDasharray="4 4"
          strokeWidth={1.5}
          x1={centerC.x}
          x2={particleX}
          y1={centerC.y}
          y2={particleY}
        />
        {/* Nhãn bán kính R lệch an toàn khỏi thân vectơ F_L */}
        {(() => {
          // Điểm gần tâm C (khoảng 35% từ C đến hạt) và offset vuông góc với bán kính
          const rx = centerC.x + (particleX - centerC.x) * 0.35 + 20 * Math.sin(angleTheta);
          const ry = centerC.y + (particleY - centerC.y) * 0.35 - 20 * Math.cos(angleTheta);
          return (
            <foreignObject height={35} width={60} x={rx - 15} y={ry - 18}>
              <div style={{ fontSize: 22, fontWeight: 800, color: colors.brandIndigo, textShadow: halo("#FFFFFF") }}>
                <MathText text="R" />
              </div>
            </foreignObject>
          );
        })()}

        {/* Vectơ lực Lorentz F_L (hướng về tâm C) */}
        <PhysicsVector
          angleDeg={(forceAngle * 180) / Math.PI}
          color={colors.decrease}
          from={{ x: particleX, y: particleY }}
          label="\\vec{F}_L"
          length={135}
        />

        {/* Vectơ vận tốc v (tiếp tuyến đường tròn) */}
        <PhysicsVector
          angleDeg={(velAngle * 180) / Math.PI}
          color={colors.increase}
          from={{ x: particleX, y: particleY }}
          label="\\vec{v}"
          length={125}
        />

        {/* Hạt điện tích q+ */}
        <circle cx={particleX} cy={particleY} fill={colors.brandBlue} r={18} stroke="#FFFFFF" strokeWidth={3} />
        <foreignObject height={30} width={36} x={particleX - 18} y={particleY - 14}>
          <div style={{ textAlign: "center", fontSize: 18, fontWeight: 800, color: "#FFFFFF" }}>
            <MathText text="q+" />
          </div>
        </foreignObject>

        {/* Hộp công thức bán kính quỹ đạo ở góc phải */}
        <foreignObject height={130} width={400} x={1440} y={130}>
          <div
            style={{
              padding: "16px 22px",
              borderRadius: 14,
              border: `2px solid ${colors.brandBlue}`,
              backgroundColor: "#F0F7FF",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 18, color: colors.muted, fontWeight: 600 }}>
              <MathText text="Cân bằng lực hướng tâm: $F_L = F_{ht}$" />
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.brandBlue, marginTop: 8 }}>
              <MathText text="Bán kính: $R = \\frac{m v}{|q| B}$" />
            </div>
          </div>
        </foreignObject>
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// CẢNH 5: THIÊN VĂN HỌC (TSA) — ĐỊNH LUẬT 2 KEPLER VỀ BẢO TOÀN DIỆN TÍCH QUÉT
// ============================================================================
const KeplerLawScene: React.FC = () => {
  const frame = useCurrentFrame();

  // Tâm elip O = (960, 600), bán trục lớn a = 460, bán trục nhỏ b = 280
  const centerO = { x: 960, y: 600 };
  const a = 460;
  const b = 280;
  // Tiêu cự c = sqrt(a^2 - b^2) ~ 364 px
  const c = Math.sqrt(a * a - b * b);
  // Mặt Trời đặt tại tiêu điểm F1 bên trái: (centerO.x - c, centerO.y)
  const sunF1 = { x: centerO.x - c, y: centerO.y };

  // Định luật 2 Kepler: Hành tinh chạy nhanh ở cận nhật (bên trái elip, gần Sun), chậm ở viễn nhật (bên phải elip)
  // Ta mô phỏng góc dị thường u theo thời gian:
  // Hành tinh hoàn thành 1 vòng qua 75 frame:
  const tFrac = frame / 75;
  // Dùng hàm biến thiên tốc độ mượt mà (nhanh ở cận nhật, chậm ở viễn nhật)
  // Góc tham số u từ PI (cận nhật) quay theo chiều kim đồng hồ qua viễn nhật (0) về PI
  const anomalyU = Math.PI + 2 * Math.PI * tFrac + 0.35 * Math.sin(2 * Math.PI * tFrac);

  // Toạ độ hành tinh trên Elip: x = a * cos(u), y = b * sin(u)
  const planetX = centerO.x + a * Math.cos(anomalyU);
  const planetY = centerO.y + b * Math.sin(anomalyU);

  // VÙNG QUÉT 1 (Cận nhật - Perihelion): góc hẹp hơn về bán kính nhưng quét góc rộng hơn
  // Góc u từ 0.75*PI đến 1.25*PI
  const sector1Pts = Array.from({ length: 25 }, (_, i) => {
    const ang = 0.75 * Math.PI + (i / 24) * 0.5 * Math.PI;
    return `${centerO.x + a * Math.cos(ang)} ${centerO.y + b * Math.sin(ang)}`;
  });
  const sector1Path = `M ${sunF1.x} ${sunF1.y} L ${sector1Pts.join(" L ")} Z`;

  // VÙNG QUÉT 2 (Viễn nhật - Aphelion): bán kính vươn rất dài nhưng góc quét hẹp hơn
  // Góc u từ -0.16*PI đến 0.16*PI
  const sector2Pts = Array.from({ length: 25 }, (_, i) => {
    const ang = -0.16 * Math.PI + (i / 24) * 0.32 * Math.PI;
    return `${centerO.x + a * Math.cos(ang)} ${centerO.y + b * Math.sin(ang)}`;
  });
  const sector2Path = `M ${sunF1.x} ${sunF1.y} L ${sector2Pts.join(" L ")} Z`;

  return (
    <AbsoluteFill>
      <SceneHeader
        subtitle="Bán kính vectơ quét những diện tích bằng nhau trong cùng khoảng thời gian $\\Delta t$: $S_1 = S_2$"
        title="5. Thiên văn học (TSA): Định luật 2 Kepler về chuyển động hành tinh"
      />

      <svg height={1080} style={{ position: "absolute", left: 0, top: 0 }} width={1920}>
        {/* VÙNG QUÉT S1 TẠI ĐIỂM CẬN NHẬT (GẦN MẶT TRỜI - CHẠY NHANH) */}
        <path d={sector1Path} fill={colors.warn} opacity={0.25} />
        <path d={sector1Path} fill="none" stroke={colors.warn} strokeWidth={2} />
        <foreignObject height={50} width={160} x={sunF1.x - 220} y={centerO.y - 25}>
          <div style={{ textAlign: "center", fontSize: 24, fontWeight: 800, color: colors.warn, textShadow: halo("#FFFFFF") }}>
            <MathText text="Diện tích $S_1$" />
          </div>
        </foreignObject>

        {/* VÙNG QUÉT S2 TẠI ĐIỂM VIỄN NHẬT (XA MẶT TRỜI - CHẠY CHẬM) */}
        <path d={sector2Path} fill={colors.brandBlue} opacity={0.2} />
        <path d={sector2Path} fill="none" stroke={colors.brandBlue} strokeWidth={2} />
        <foreignObject height={50} width={160} x={centerO.x + 180} y={centerO.y - 30}>
          <div style={{ textAlign: "center", fontSize: 24, fontWeight: 800, color: colors.brandBlue, textShadow: halo("#FFFFFF") }}>
            <MathText text="Diện tích $S_2$" />
          </div>
        </foreignObject>

        {/* QUỸ ĐẠO ELIP */}
        <ellipse
          cx={centerO.x}
          cy={centerO.y}
          fill="none"
          rx={a}
          ry={b}
          stroke={colors.axis}
          strokeDasharray="6 6"
          strokeWidth={2.5}
        />

        {/* TRỤC LỚN NÉT ĐỨT MỜ */}
        <line
          stroke={colors.grid}
          strokeDasharray="4 4"
          strokeWidth={1.5}
          x1={centerO.x - a}
          x2={centerO.x + a}
          y1={centerO.y}
          y2={centerO.y}
        />

        {/* Bán kính vectơ nối từ Mặt Trời tới Hành tinh hiện tại */}
        <line
          stroke={colors.brandIndigo}
          strokeWidth={2.5}
          x1={sunF1.x}
          x2={planetX}
          y1={sunF1.y}
          y2={planetY}
        />

        {/* MẶT TRỜI TẠI TIÊU ĐIỂM F1 */}
        {/* Vầng hào quang Mặt Trời */}
        <circle cx={sunF1.x} cy={sunF1.y} fill={colors.warn} opacity={0.2} r={38} />
        <circle cx={sunF1.x} cy={sunF1.y} fill="#F59E0B" r={22} stroke="#FFFFFF" strokeWidth={3} />
        <foreignObject height={35} width={120} x={sunF1.x - 60} y={sunF1.y + 35}>
          <div style={{ textAlign: "center", fontSize: 20, fontWeight: 800, color: "#D97706", textShadow: halo("#FFFFFF") }}>
            <MathText text="Mặt Trời" />
          </div>
        </foreignObject>

        {/* HÀNH TINH (TRÁI ĐẤT) CHUYỂN ĐỘNG TRÊN ELIP */}
        <circle cx={planetX} cy={planetY} fill={colors.brandBlue} r={14} stroke="#FFFFFF" strokeWidth={2.5} />
        <circle cx={planetX - 4} cy={planetY - 4} fill="#60A5FA" r={5} />
        <foreignObject height={35} width={130} x={planetX - 65} y={planetY - 42}>
          <div style={{ textAlign: "center", fontSize: 18, fontWeight: 800, color: colors.brandBlue, textShadow: halo("#FFFFFF") }}>
            <MathText text="Hành tinh" />
          </div>
        </foreignObject>

        {/* GHI CHÚ ĐIỂM CẬN NHẬT VÀ VIỄN NHẬT */}
        <foreignObject height={40} width={180} x={centerO.x - a - 40} y={centerO.y - 65}>
          <div style={{ fontSize: 18, color: colors.muted, fontWeight: 700, textShadow: halo("#FFFFFF") }}>
            <MathText text="Cận nhật (nhanh)" />
          </div>
        </foreignObject>
        <foreignObject height={40} width={180} x={centerO.x + a - 140} y={centerO.y + 15}>
          <div style={{ textAlign: "right", fontSize: 18, color: colors.muted, fontWeight: 700, textShadow: halo("#FFFFFF") }}>
            <MathText text="Viễn nhật (chậm)" />
          </div>
        </foreignObject>

        {/* HỘP KẾT LUẬN ĐỊNH LUẬT 2 KEPLER */}
        <foreignObject height={130} width={420} x={1420} y={130}>
          <div
            style={{
              padding: "16px 22px",
              borderRadius: 14,
              border: `2px solid ${colors.brandIndigo}`,
              backgroundColor: "#F8FAFC",
              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
            }}
          >
            <div style={{ fontSize: 18, color: colors.muted, fontWeight: 600 }}>
              <MathText text="Cùng khoảng thời gian: $\\Delta t_1 = \\Delta t_2$" />
            </div>
            <div style={{ fontSize: 26, fontWeight: 800, color: colors.brandIndigo, marginTop: 8 }}>
              <MathText text="Bảo toàn: $S_1 = S_2$" />
            </div>
          </div>
        </foreignObject>
      </svg>
    </AbsoluteFill>
  );
};

// ============================================================================
// COMPOSITION CHÍNH SHOWCASE 2 (12.5s = 375 frames)
// ============================================================================
export const PhysicsShowcase2: React.FC = () => {
  useKatexFonts();

  return (
    <AbsoluteFill style={{ backgroundColor: "#FFFFFF" }}>
      <BrandBackground />

      {/* Cảnh 1: Sóng dừng trên sợi dây (Frame 0 - 75) */}
      <Sequence durationInFrames={75}>
        <StandingWaveScene />
      </Sequence>

      {/* Cảnh 2: Khúc xạ và Phản xạ toàn phần (Frame 75 - 150) */}
      <Sequence durationInFrames={75} from={75}>
        <TotalInternalReflectionScene />
      </Sequence>

      {/* Cảnh 3: Nhiệt học & Định luật Boyle (Frame 150 - 225) */}
      <Sequence durationInFrames={75} from={150}>
        <GasBoyleScene />
      </Sequence>

      {/* Cảnh 4: Từ trường & Lực Lorentz (Frame 225 - 300) */}
      <Sequence durationInFrames={75} from={225}>
        <LorentzForceScene />
      </Sequence>

      {/* Cảnh 5: Thiên văn học & Định luật 2 Kepler (Frame 300 - 375) */}
      <Sequence durationInFrames={75} from={300}>
        <KeplerLawScene />
      </Sequence>
    </AbsoluteFill>
  );
};

export const PhysicsShowcase2Composition: React.FC = () => (
  <Composition
    component={PhysicsShowcase2}
    durationInFrames={375}
    fps={30}
    height={1080}
    id="physics-showcase-2"
    width={1920}
  />
);
