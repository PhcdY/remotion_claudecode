import { CalculateMetadataFunction } from "remotion";
import { Script, Timeline, buildTimeline } from "../../components/timeline";
import scriptJson from "./script.json";

export const script = scriptJson as Script;

export type VideoProps = { timeline: Timeline | null };

// Thời lượng lấy từ độ dài audio thật (public/audio/ban-chat-dao-ham/).
export const calculateMetadata: CalculateMetadataFunction<VideoProps> = async () => {
  const timeline = await buildTimeline(script);
  return { durationInFrames: timeline.durationInFrames, props: { timeline } };
};
