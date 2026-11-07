import React from "react";
import { Composition } from "remotion";
import {
  ExplainerProps,
  ExplainerVideo,
  explainerMetadata,
} from "../../components/ExplainerVideo";
import { FPS, Script } from "../../components/timeline";
import { BEATS } from "./beats";
import scriptJson from "./script.json";

// Video Lý 10 "Kiến sa mạc đi lòng vòng, sao vẫn về thẳng tổ?": quãng đường = sợi chỉ (cộng mọi đoạn đã đi),
// độ dịch chuyển = dây chun (nối tổ với chỗ đang đứng); vận tốc theo hướng dây chun.
const script = scriptJson as Script;

const QuangDuongVanToc: React.FC<ExplainerProps> = ({ timeline, draft }) => (
  <ExplainerVideo
    script={script}
    timeline={timeline}
    beats={BEATS}
    draft={draft}
  />
);

export const QuangDuongVanTocComposition: React.FC = () => (
  <Composition
    id="quang-duong-van-toc"
    component={QuangDuongVanToc}
    durationInFrames={300}
    fps={FPS}
    width={1920}
    height={1080}
    defaultProps={{ timeline: null } as ExplainerProps}
    calculateMetadata={explainerMetadata(script)}
  />
);
