import React from "react";
import { Composition, Sequence } from "remotion";
import { BrandFrame } from "../../components/BrandFrame";
import { KeyTakeaway } from "../../components/KeyTakeaway";
import {
  TacticalMap,
  TacticalFortress,
  TacticalRiver,
  ReformDiagram,
} from "../../components/su";

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
          forces={[
            {
              id: "fc-truong-phu",
              x: 850, // Căn giữa hoàn hảo trên trục đối xứng giữa 2 mũi tên
              y: 175,
              title: "20 vạn quân Minh (Trương Phụ)",
              color: "#EF4444",
            },
          ]}
          arrows={[
            {
              id: "arr-truong-phu-1",
              x1: 760,
              y1: 205,
              x2: 800,
              y2: 300,
              color: "#EF4444",
              progress: 1,
            },
            {
              id: "arr-truong-phu-2",
              x1: 940,
              y1: 205,
              x2: 900,
              y2: 300,
              color: "#EF4444",
              progress: 1,
            },
          ]}
          points={[
            {
              id: "pt-dong-do",
              x: 1460,
              y: 620,
              label: "Đông Đô (Thăng Long)",
              sublabel: "Kinh đô Đại Ngu",
              color: "#F59E0B",
              anchor: "left", // Chống tràn mép: nhãn dạt sang Tây (trái), cách xa mép phải
            },
          ]}
        >
          {/* Dòng Sông Hồng (Nhị Hà) uốn lượn tự nhiên mềm mại */}
          <TacticalRiver
            d="M 120 140 C 560 340, 1060 510, 1660 720"
            name="Sông Hồng (Nhị Hà)"
            nameX={1120}
            nameY={565}
          />

          {/* Công trình phòng ngự Chiến lũy Đa Bang kiên cố có chông gỗ */}
          <TacticalFortress
            x={850}
            y={340}
            width={340}
            label="Chiến lũy Đa Bang"
          />
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
