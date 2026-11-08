import React from "react";
import { Composition, Sequence } from "remotion";
import { BrandFrame } from "../../components/BrandFrame";
import { KeyTakeaway } from "../../components/KeyTakeaway";
import { TacticalMap, ReformDiagram } from "../../components/su";

// Composition phòng lab thử nghiệm chuẩn Hero Stage Canvas, AutoLabels và Text Pipeline
export const LabVideo: React.FC = () => {
  return (
    <BrandFrame>
      {/* Cảnh 1 (Frame 0 - 60): Sa bàn Chiến sự Phòng tuyến Đa Bang chuẩn Hero Stage */}
      <Sequence durationInFrames={60}>
        <TacticalMap
          title="Phòng tuyến Đa Bang"
          timeTag="Tháng 11/1406"
          hasTakeaway={true}
          arrows={[
            {
              id: "arr-truong-phu-1",
              x1: 760,
              y1: 170,
              x2: 800,
              y2: 290,
              label: "20 vạn quân Minh (Trương Phụ)",
              color: "#EF4444",
              progress: 1,
            },
            {
              id: "arr-truong-phu-2",
              x1: 940,
              y1: 170,
              x2: 900,
              y2: 290,
              color: "#EF4444",
              progress: 1,
            },
          ]}
          points={[
            {
              id: "pt-da-bang",
              x: 850,
              y: 405,
              label: "Chiến lũy Đa Bang",
              sublabel: "Phòng tuyến trung tâm",
              color: "#F59E0B",
              anchor: "bottom", // Nhãn dạt xuống dưới thanh thành luỹ, không đè nét
            },
            {
              id: "pt-dong-do",
              x: 1460,
              y: 640,
              label: "Đông Đô (Thăng Long)",
              sublabel: "Kinh đô Đại Ngu",
              color: "#F59E0B",
              anchor: "left", // Chống tràn mép: nhãn dạt sang Tây (trái), cách xa mép phải
            },
          ]}
        >
          {/* Nét vẽ Sông Hồng (Nhị Hà) uốn lượn chéo góc bản đồ */}
          <path
            d="M 160 130 C 580 340, 1080 520, 1680 750"
            fill="none"
            stroke="#1E40AF"
            strokeWidth={36}
            strokeLinecap="round"
            opacity={0.8}
          />
          <path
            d="M 160 130 C 580 340, 1080 520, 1680 750"
            fill="none"
            stroke="#60A5FA"
            strokeWidth={6}
            strokeDasharray="16 12"
            strokeLinecap="round"
            opacity={0.7}
          />
          <text
            x={1160}
            y={590}
            fill="#93C5FD"
            fontSize={22}
            fontWeight={700}
            fontFamily="Plus Jakarta Sans"
            style={{ textShadow: "0 2px 8px rgba(0,0,0,0.9)" }}
          >
            Sông Hồng (Nhị Hà)
          </text>

          {/* Công trình Phòng tuyến Chiến lũy Đa Bang */}
          <g transform="translate(850, 340)">
            <rect
              x={-150}
              y={-14}
              width={300}
              height={28}
              rx={6}
              fill="#D97706"
              stroke="#FDE68A"
              strokeWidth={3}
            />
            {/* Hàng chông gỗ phòng ngự mặt bắc */}
            {[-130, -90, -50, -10, 30, 70, 110, 130].map((cx, i) => (
              <line
                key={i}
                x1={cx}
                y1={-14}
                x2={cx}
                y2={-28}
                stroke="#DC2626"
                strokeWidth={4}
                strokeLinecap="round"
              />
            ))}
          </g>
        </TacticalMap>

        {/* Câu chốt của beat sa bàn */}
        <KeyTakeaway
          text="Thành cao lũy sâu, nhưng then chốt là lòng dân"
          from={0}
          top={930}
          bottom={1030}
        />
      </Sequence>

      {/* Cảnh 2 (Frame 61 - 120): Sơ đồ Cải cách 2 cột sạch bóng lỗi LaTeX $ o$ */}
      <Sequence from={61} durationInFrames={60}>
        <ReformDiagram
          hasTakeaway={true}
          leftCard={{
            tag: "Kinh tế",
            tagColor: "#3B82F6",
            year: "1397",
            title: "Chính sách Hạn điền",
            items: [
              {
                highlight: "Hạn chế sở hữu: Tối đa 10 mẫu/người",
                detail: "Trừ đại vương và công chúa tôn thất triều Trần",
              },
              {
                highlight: "Ruộng thừa sung công",
                detail: "Nhà nước tịch thu ruộng đất vượt hạn mức làm ruộng công",
              },
            ],
            conclusion: {
              type: "impact",
              text: "Đánh thẳng vào đặc quyền kinh tế quý tộc Trần, nhưng ruộng chưa kịp chia cho dân cày nghèo",
            },
          }}
          rightCard={{
            tag: "Xã hội",
            tagColor: "#10B981",
            year: "1401",
            title: "Chính sách Hạn nô",
            items: [
              {
                highlight: "Hạn chế số lượng gia nô quý tộc",
                detail: "Số nô tì dư thừa phải nộp thuế cho triều đình nhà Hồ",
              },
              {
                highlight: "Giải phóng nô tì → dân tự do",
                detail: "Biến nô tì thành nông dân đóng thuế trực tiếp cho nhà nước",
              },
            ],
            conclusion: {
              type: "limitation",
              text: "Tăng nguồn thuế cho ngân khố → Khiến tầng lớp quý tộc căm thù triều đình sâu sắc",
            },
          }}
        />
        <KeyTakeaway
          text="Đổi mới quyết liệt nhưng mất đi khối đại đoàn kết"
          from={61}
          top={930}
          bottom={1030}
        />
      </Sequence>
    </BrandFrame>
  );
};

export const LabComposition: React.FC = () => (
  <Composition
    id="lab-thanh-phan"
    component={LabVideo}
    durationInFrames={120}
    fps={30}
    width={1920}
    height={1080}
  />
);
