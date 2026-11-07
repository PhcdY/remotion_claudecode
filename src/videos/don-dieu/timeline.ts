import { CalculateMetadataFunction } from "remotion";
import { Script, Timeline, buildTimeline } from "../../components/timeline";
import scriptJson from "./script.json";

export const script = scriptJson as Script;

export type VideoProps = { timeline: Timeline | null; audioDir?: string };

// Thời lượng lấy từ độ dài audio thật (public/audio/<audioDir>/, mặc định don-dieu).
export const calculateMetadata: CalculateMetadataFunction<VideoProps> = async ({ props }) => {
  const timeline = await buildTimeline(script, props.audioDir);
  return { durationInFrames: timeline.durationInFrames, props: { ...props, timeline } };
};
