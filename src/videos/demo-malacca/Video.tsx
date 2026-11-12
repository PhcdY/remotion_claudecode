import React from "react";
import { AbsoluteFill, Composition, Easing, interpolate, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandFrame } from "../../components/BrandFrame";
import { LayoutProbe } from "../../components/LayoutProbe";
import { MathText } from "../../components/MathText";
import { colors, fontSize, fontText } from "../../components/theme";
import map from "./map-data.json";

// Đường bờ Natural Earth 1:10m, cắt theo vùng minh họa, không có biên giới hành chính.
// Tuyến đi là đường minh họa qua hai eo biển.
const WIDTH = 1920;
const HEIGHT = 1080;
const MAP_HEIGHT = 1074;
const FPS = 30;
const DURATION = 14 * FPS;
const ROUTE_COLOR = "#BA5814";
type Point = { x: number; y: number };
const project = (longitude: number, latitude: number): Point => ({
  x: (longitude - 92) * 120,
  y: (7.25 - latitude) * 120,
});

const route = map.route.map(([lon, lat]) => project(lon, lat));
const lengths = [0];
for (let i = 1; i < route.length; i++) {
  const a = route[i - 1];
  const b = route[i];
  lengths.push(lengths[i - 1] + Math.hypot(b.x - a.x, b.y - a.y));
}
const routePath = route.map(({ x, y }, i) => `${i === 0 ? "M" : "L"}${x},${y}`).join(" ");
const routeLength = lengths[lengths.length - 1];
const landPath = map.land.join("");
const ease = Easing.inOut(Easing.cubic);
const clamped = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;

const shipAt = (distance: number) => {
  const end = lengths.findIndex((length, i) => i > 0 && length >= distance);
  const index = end < 0 ? route.length - 1 : end;
  const a = route[index - 1];
  const b = route[index];
  const fraction = (distance - lengths[index - 1]) / (lengths[index] - lengths[index - 1]);
  return {
    x: a.x + (b.x - a.x) * fraction,
    y: a.y + (b.y - a.y) * fraction,
    heading: Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI,
  };
};

const labels = [
  { name: "Ấn Độ Dương", lon: 94.12, lat: 2.13, tone: "#376486", overview: true },
  { name: "Biển Đông", lon: 105.72, lat: 5.14, tone: "#376486", overview: true },
  { name: "Sumatra", lon: 100.23, lat: 0.65, tone: "#545638", overview: false },
  { name: "Bán đảo Mã Lai", lon: 102.16, lat: 3.96, tone: "#545638", overview: false },
];

const MapLabel: React.FC<{
  point: Point;
  name: string;
  tone: string;
  opacity?: number;
  align?: "center" | "left" | "right";
}> = ({ point, name, tone, opacity = 1, align = "center" }) => {
  const edge = Math.min(point.x - 200, WIDTH - 200 - point.x, point.y - 45, MAP_HEIGHT - 60 - point.y);
  const visible = opacity * interpolate(edge, [-15, 50], [0, 1], clamped);
  return (
    <div
      data-text="label"
      style={{
        position: "absolute", left: point.x, top: point.y, opacity: visible, color: tone,
        translate: align === "center" ? "-50% -50%" : align === "left" ? "0 -50%" : "-100% -50%",
        whiteSpace: "nowrap", fontSize: 36, fontWeight: 750, lineHeight: 1.15,
        textShadow: "0 0 4px #fff, 0 0 12px #fff, 0 0 18px #fff",
      }}
    >
      <MathText text={name} />
    </div>
  );
};

const Malacca: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const time = frame / fps;
  const distance = interpolate(time, [1.2, 4.4, 7.7, 9.7, 12.8], [
    0, lengths[59], lengths[137], lengths[213], routeLength,
  ], clamped);
  const ship = shipAt(distance);
  const close = interpolate(time, [3.4, 7.5, 9.25, 12.6], [0, 1, 1, 0], { ...clamped, easing: ease });
  const zoom = 1 + 1.75 * close;
  const cameraX = WIDTH / 2 + (ship.x - WIDTH / 2) * close;
  const cameraY = MAP_HEIGHT / 2 + (ship.y - MAP_HEIGHT / 2) * close;
  const left = WIDTH / 2 - cameraX * zoom;
  const top = MAP_HEIGHT / 2 - cameraY * zoom;
  const onScreen = ({ x, y }: Point): Point => ({ x: left + x * zoom, y: top + y * zoom });
  const boat = onScreen(ship);
  const singapore = onScreen(project(103.85, 1.29));
  const strait = onScreen(project(99.5, 4.35));
  const boatOpacity = interpolate(time, [0.85, 1.35], [0, 1], clamped);
  const locatorOpacity = interpolate(time, [0, 0.4, 3.1, 4.4], [0, 1, 1, 0], clamped);
  const detailOpacity = interpolate(time, [6.7, 7.5, 10, 11.1], [0, 1, 1, 0], clamped);
  const captionOpacity = interpolate(time, [6.3, 7.4, 10.3, 11.7], [0, 1, 1, 0], clamped);

  return (
    <BrandFrame>
      <AbsoluteFill data-layout="scene" style={{ fontFamily: fontText, color: colors.text }}>
        <div style={{ position: "absolute", top: 0, width: WIDTH, height: MAP_HEIGHT, overflow: "hidden" }}>
          <svg width={WIDTH} height={MAP_HEIGHT} style={{ position: "absolute" }}>
            <defs>
              <linearGradient id="sea" x2="0.8" y2="1">
                <stop stopColor="#D2EBF3" />
                <stop offset="1" stopColor="#B7DDEC" />
              </linearGradient>
              <linearGradient id="land" x2="0.2" y2="1">
                <stop stopColor="#F7EFDB" />
                <stop offset="1" stopColor="#E9E8CB" />
              </linearGradient>
              <pattern id="water-lines" width="124" height="105" patternUnits="userSpaceOnUse">
                <path d="M18 45h20m64 39h10" stroke="#FFF" strokeWidth="1.4" opacity=".33" />
              </pattern>
            </defs>
            <rect width={WIDTH} height={MAP_HEIGHT} fill="url(#sea)" />
            <g transform={`translate(${left} ${top}) scale(${zoom})`}>
              <rect x="-120" y="-120" width="2160" height="1200" fill="url(#water-lines)" />
              <path d={landPath} fill="url(#land)" stroke="#779FA3" strokeWidth="1.35" strokeLinejoin="round" fillRule="evenodd" vectorEffect="non-scaling-stroke" />
              <ellipse cx={project(99.5, 4.35).x} cy={project(99.5, 4.35).y} rx="108" ry="46"
                transform={`rotate(38 ${project(99.5, 4.35).x} ${project(99.5, 4.35).y})`}
                fill="#5B9EC0" fillOpacity=".28" stroke="#315E7A" strokeWidth="2.5" strokeDasharray="6 6" opacity={locatorOpacity} />
              <path d={routePath} fill="none" stroke="#42627C" strokeWidth="2" strokeDasharray="3 8" strokeLinecap="round" opacity=".32" vectorEffect="non-scaling-stroke" />
              {distance > 0 && (
                <path d={routePath} pathLength={routeLength} fill="none" stroke={ROUTE_COLOR} strokeWidth={4.4 / zoom}
                  strokeLinecap="round" strokeDasharray={routeLength} strokeDashoffset={routeLength - distance} />
              )}
            </g>
            <path d={`M${strait.x + 18} ${strait.y - 59} L${strait.x + 8} ${strait.y - 29}`}
              stroke="#315E7A" strokeWidth="2.5" fill="none" opacity={locatorOpacity} />
            <g opacity={detailOpacity}>
              <circle cx={singapore.x} cy={singapore.y} r="7" fill="#0E1046" stroke="#fff" strokeWidth="2.5" />
            </g>
            <g transform={`translate(${boat.x} ${boat.y}) rotate(${ship.heading})`} opacity={boatOpacity}>
              <path d="M-29 -9 Q-47 -12 -58 -19 M-29 9 Q-47 12 -58 19" stroke="#FDFEFF" strokeWidth="3" strokeLinecap="round" fill="none" />
              <path d="M-27 -12 H12 Q20 -10 31 0 Q20 10 12 12 H-27Z" fill="#263D5C" stroke="#FFF" strokeWidth="2.3" strokeLinejoin="round" />
              <rect x="-17" y="-7" width="10" height="14" rx="2" fill="#F5EACD" />
              <rect x="-3" y="-7" width="13" height="14" rx="2" fill="#E79448" />
              <path d="M15 -6L23 0L15 6Z" fill="#F5EACD" />
            </g>
          </svg>
          {labels.map((label) => (
            <MapLabel key={label.name} name={label.name} tone={label.tone}
              point={onScreen(project(label.lon, label.lat))} opacity={label.overview ? 1 - close : 1} />
          ))}
          <MapLabel point={{ x: strait.x + 35, y: strait.y - 86 }} name="Eo biển Malacca" tone="#244E69"
            opacity={locatorOpacity} />
          <MapLabel point={{ x: singapore.x - 18, y: singapore.y - 31 }} name="Singapore" tone="#243A5B"
            opacity={detailOpacity} align="right" />
          <div data-text="takeaway" style={{
            position: "absolute", left: "50%", translate: "-50% 0", bottom: 55, whiteSpace: "nowrap", fontWeight: 800,
            fontSize: fontSize.takeaway, lineHeight: 1.15, color: "#213655", opacity: captionOpacity,
            textShadow: "0 0 4px #fff, 0 0 15px #fff, 0 0 22px #fff",
          }}>
            <MathText text="Luồng tàu thu hẹp về phía Singapore" />
          </div>
        </div>
      </AbsoluteFill>
      <LayoutProbe />
    </BrandFrame>
  );
};

export const MalaccaDemoComposition: React.FC = () => (
  <Composition id="demo-malacca" component={Malacca} durationInFrames={DURATION} fps={FPS} width={WIDTH} height={HEIGHT} />
);
