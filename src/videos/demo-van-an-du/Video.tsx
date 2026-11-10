import { loadFont } from "@remotion/google-fonts/Lora";
import React from "react";
import { AbsoluteFill, Composition, Easing, interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { BrandFrame } from "../../components/BrandFrame";
import { KeyTakeaway } from "../../components/KeyTakeaway";
import { AutoLabels, Rect } from "../../components/labels";
import { LayoutProbe } from "../../components/LayoutProbe";
import { MathText, useKatexFonts } from "../../components/MathText";
import { role } from "../../components/roles";
import { colors, fontText, layout, tint } from "../../components/theme";

// Demo môn Văn theo gói Văn mới (10/11/2026): hình trung tâm + minh hoạ hình ảnh tác phẩm bằng nét phẳng
// + mổ xẻ câu chữ ngay trong cảnh. Chỉ hình, không tiếng. Không phải video đăng.
// Ngữ liệu: ca dao "Thuyền về có nhớ bến chăng / Bến thì một dạ khăng khăng đợi thuyền" — ẩn dụ.

const { fontFamily: fontPoem } = loadFont("italic", { weights: ["500", "600"], subsets: ["latin", "latin-ext", "vietnamese"] });

const FPS = 30;
const DURATION = 540; // 18 s

/** Mốc (frame). Mỗi mốc đúng một thay đổi trên hình. */
const T = {
  scene: 0,
  poem1: 15,
  poem2: 40,
  note: 62,
  hlThuyen: 90,
  boatGo: 115,
  boatArrive: 205,
  hlBen: 225,
  divider: 275,
  boy: 300,
  girl: 355,
  hlDoi: 410,
  take: 460,
};

// Bố cục (px)
const RIVER_TOP = 420;
const RIVER_BOTTOM = 624;
const WATER_Y = 534; // mặt nước dưới thân thuyền
const BOAT_START = 1050;
const BOAT_END = 500;
const DOCK = { x1: 1330, x2: 1610, deck: 486 };
const DIVIDER_Y = 662;
const PEOPLE_TOP = 734;
const BOY_X = BOAT_END;
const GIRL_X = 1560;

const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
const ramp = (f: number, a: number, b: number, easing = Easing.inOut(Easing.cubic)) => interpolate(f, [a, b], [0, 1], { ...clamp, easing });
const fade = (f: number, a: number, d = 12) => ramp(f, a, a + d, Easing.out(Easing.quad));

const usePop = (at: number) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 140 } });
};

// ---------- Câu ca dao, từng từ có thể quét highlight ----------

type Word = { w: string; hl?: { color: string; at: number } };

const LINE1: Word[] = [
  { w: "Thuyền", hl: { color: role.pairA, at: T.hlThuyen } },
  { w: "về" },
  { w: "có" },
  { w: "nhớ" },
  { w: "bến", hl: { color: role.pairB, at: T.hlBen } },
  { w: "chăng" },
];
const LINE2: Word[] = [
  { w: "Bến", hl: { color: role.pairB, at: T.hlBen } },
  { w: "thì" },
  { w: "một", hl: { color: role.focus, at: T.hlDoi } },
  { w: "dạ", hl: { color: role.focus, at: T.hlDoi + 4 } },
  { w: "khăng", hl: { color: role.focus, at: T.hlDoi + 8 } },
  { w: "khăng", hl: { color: role.focus, at: T.hlDoi + 12 } },
  { w: "đợi", hl: { color: role.focus, at: T.hlDoi + 16 } },
  { w: "thuyền", hl: { color: role.pairA, at: T.hlThuyen } },
];

const PoemWord: React.FC<{ word: Word }> = ({ word }) => {
  const frame = useCurrentFrame();
  const p = word.hl ? ramp(frame, word.hl.at, word.hl.at + 14) : 0;
  const c = word.hl?.color ?? colors.text;
  return (
    <span
      style={{
        padding: "0 8px",
        borderRadius: 10,
        // vệt quét từ trái sang phải
        background: p > 0 ? `linear-gradient(90deg, ${tint(c, 0.18)} ${p * 100}%, transparent ${p * 100}%)` : "none",
        color: p > 0.5 ? c : colors.text,
        fontWeight: p > 0.5 ? 600 : 500,
      }}
    >
      <MathText text={word.w} />
    </span>
  );
};

const PoemLine: React.FC<{ words: Word[]; top: number; at: number; tail?: React.ReactNode }> = ({ words, top, at, tail }) => {
  const frame = useCurrentFrame();
  const o = fade(frame, at, 15);
  return (
    <div style={{ position: "absolute", left: 0, width: layout.width, top, display: "flex", justifyContent: "center", opacity: o, translate: `0 ${(1 - o) * 14}px` }}>
      <div data-text="label" style={{ position: "relative", fontFamily: fontPoem, fontSize: 56, color: colors.text, whiteSpace: "nowrap", display: "flex", gap: 2 }}>
        {words.map((w, i) => (
          <PoemWord key={i} word={w} />
        ))}
        {tail}
      </div>
    </div>
  );
};

// ---------- Hình: sông, bến, thuyền, người ----------

const River: React.FC<{ o: number }> = ({ o }) => {
  const frame = useCurrentFrame();
  const wave = (y: number, amp: number, ph: number) => {
    let d = `M ${layout.side} ${y}`;
    for (let x = layout.side; x <= layout.width - layout.side; x += 40) {
      d += ` L ${x} ${y + Math.sin(x / 70 + frame * 0.05 + ph) * amp}`;
    }
    return d;
  };
  return (
    <g opacity={o}>
      <rect x={layout.side} y={RIVER_TOP} width={layout.width - layout.side * 2} height={RIVER_BOTTOM - RIVER_TOP} rx={36} fill={tint(colors.brandBlue, 0.14)} />
      {[470, 600].map((y, i) => (
        <path key={y} d={wave(y, 5, i * 2)} fill="none" stroke={tint(colors.brandBlue, 0.3)} strokeWidth={3} strokeLinecap="round" />
      ))}
    </g>
  );
};

const Dock: React.FC<{ o: number; hl: number }> = ({ o, hl }) => (
  <g opacity={o} data-mark="ben">
    {/* bờ đất */}
    <path d={`M 1590 ${RIVER_TOP - 40} H 1830 V ${RIVER_BOTTOM + 20} H 1600 Q 1560 ${(RIVER_TOP + RIVER_BOTTOM) / 2} 1590 ${RIVER_TOP - 40} Z`} fill="#E3EED3" stroke="#B9CFA0" strokeWidth={3} />
    {/* mép đất ẩm sát nước, đá, cỏ */}
    <path d={`M 1590 ${RIVER_TOP - 40} Q 1560 ${(RIVER_TOP + RIVER_BOTTOM) / 2} 1600 ${RIVER_BOTTOM + 20}`} fill="none" stroke="#CDB98F" strokeWidth={14} strokeLinecap="round" />
    {[
      [1612, RIVER_BOTTOM - 6, 16],
      [1640, RIVER_BOTTOM + 6, 11],
      [1596, RIVER_TOP + 70, 12],
    ].map(([cx, cy, r]) => (
      <ellipse key={`${cx}-${cy}`} cx={cx} cy={cy} rx={r} ry={r * 0.7} fill="#B7B2A5" stroke="#8F8A7D" strokeWidth={2} />
    ))}
    {[1680, 1740, 1790, 1700, 1770].map((gx, i) => {
      const gy = i < 3 ? RIVER_TOP + 10 + i * 22 : RIVER_BOTTOM - 40 - (i - 3) * 30;
      return <path key={gx} d={`M ${gx - 10} ${gy} L ${gx - 4} ${gy - 18} M ${gx} ${gy} L ${gx} ${gy - 24} M ${gx + 10} ${gy} L ${gx + 5} ${gy - 18}`} stroke="#8DB36E" strokeWidth={3} strokeLinecap="round" />;
    })}
    {/* cọc, có vạch nước */}
    {[1360, 1440, 1520].map((x) => (
      <g key={x}>
        <rect x={x - 9} y={DOCK.deck} width={18} height={96} rx={4} fill={WOOD.mid} />
        <rect x={x - 9} y={DOCK.deck} width={6} height={96} rx={3} fill={WOOD.dark} opacity={0.5} />
        <line x1={x - 14} y1={DOCK.deck + 64} x2={x + 14} y2={DOCK.deck + 64} stroke={tint(colors.brandBlue, 0.6)} strokeWidth={4} strokeLinecap="round" />
      </g>
    ))}
    {/* sàn gỗ ghép ván */}
    <rect x={DOCK.x1} y={DOCK.deck - 20} width={DOCK.x2 - DOCK.x1} height={24} rx={5} fill={WOOD.light} stroke={WOOD.line} strokeWidth={3} />
    {Array.from({ length: 6 }, (_, i) => DOCK.x1 + 40 + i * 40).map((px) => (
      <line key={px} x1={px} y1={DOCK.deck - 18} x2={px} y2={DOCK.deck + 2} stroke={WOOD.line} strokeWidth={2} opacity={0.6} />
    ))}
    <rect x={DOCK.x1} y={DOCK.deck + 4} width={DOCK.x2 - DOCK.x1} height={8} rx={3} fill={WOOD.dark} />
    {/* cọc buộc thuyền + vòng dây */}
    <rect x={DOCK.x1 + 12} y={DOCK.deck - 62} width={20} height={46} rx={6} fill={WOOD.mid} stroke={WOOD.line} strokeWidth={2} />
    {[-48, -40].map((dy) => (
      <ellipse key={dy} cx={DOCK.x1 + 22} cy={DOCK.deck + dy} rx={14} ry={5} fill="none" stroke="#D9C089" strokeWidth={4} />
    ))}
    {/* viền sáng khi "bến" được gọi tên */}
    <rect x={DOCK.x1 - 18} y={DOCK.deck - 76} width={DOCK.x2 - DOCK.x1 + 36} height={190} rx={22} fill="none" stroke={role.pairB} strokeWidth={5} opacity={hl} />
  </g>
);

// Bảng màu tranh phẳng (gỗ, tre, da, tóc, vải) — màu vai trò giữ cho áo / viền để nối vật ↔ người.
const WOOD = { light: "#C9925A", mid: "#9A6233", dark: "#6E4020", line: "#5A3318" };
const BAMBOO = { fill: "#E6C98F", rib: "#C29E62", edge: "#9C7640", hole: "#7A5530" };
const SKIN = "#E9B98C";
const HAIR = "#2A1E17";
const CLOTH = "#F4EFE4";

/** Mép trên của mui (nửa elip) tại x — dùng để vẽ nan tre. */
const muiTop = (x: number, cx = -6, rx = 68, ry = 76, base = -8) => base - ry * Math.sqrt(Math.max(0, 1 - ((x - cx) / rx) ** 2));

/** Con đò: mũi cong (bên trái, hướng đi), mui tre đan, mái chèo ở đuôi. Gốc toạ độ = mặt nước giữa thuyền. */
const Boat: React.FC<{ x: number; o: number; hl: number; moving: number }> = ({ x, o, hl, moving }) => {
  const frame = useCurrentFrame();
  const bob = Math.sin(frame * 0.12) * 4;
  const tilt = Math.sin(frame * 0.12 + 1) * 1.2;
  const oar = Math.sin(frame * 0.22) * 7 * moving; // chèo khua khi thuyền đi
  const hull = "M -178 -38 Q -160 -10 -124 -8 L 136 -8 Q 166 -12 182 -30 Q 168 32 0 42 Q -150 38 -178 -38 Z";
  return (
    <g opacity={o} transform={`translate(${x} ${WATER_Y + bob}) rotate(${tilt})`}>
      {/* vệt nước sau đuôi thuyền (chỉ khi đang đi) */}
      <g opacity={moving} stroke={tint(colors.brandBlue, 0.6)} strokeWidth={4} fill="none" strokeLinecap="round">
        <path d="M 196 16 Q 240 6 280 20" />
        <path d="M 186 36 Q 250 28 320 42" />
      </g>
      {/* bóng thuyền dưới nước */}
      <ellipse cx={0} cy={46} rx={160} ry={9} fill={tint(colors.brandBlue, 0.28)} />
      <g data-mark="thuyen" data-moving={moving > 0 ? "" : undefined}>
        {/* mái chèo ở đuôi */}
        <g transform={`rotate(${oar} 140 -40)`}>
          <line x1={128} y1={-62} x2={206} y2={30} stroke={WOOD.mid} strokeWidth={7} strokeLinecap="round" />
          <ellipse cx={210} cy={36} rx={9} ry={22} transform="rotate(-40 210 36)" fill={WOOD.light} stroke={WOOD.line} strokeWidth={2} />
        </g>
        {/* mui tre: khung, nan đan, lòng mui tối */}
        <path d="M -74 -8 Q -76 -84 -6 -84 Q 64 -84 62 -8 Z" fill={BAMBOO.fill} stroke={BAMBOO.edge} strokeWidth={4} strokeLinejoin="round" />
        {[-54, -38, -22, 10, 26, 42].map((nx) => (
          <line key={nx} x1={nx} y1={-10} x2={nx} y2={muiTop(nx) + 6} stroke={BAMBOO.rib} strokeWidth={3} />
        ))}
        {[-30, -52].map((ny) => (
          <path key={ny} d={`M -70 ${ny} Q -6 ${ny - 10} 58 ${ny}`} fill="none" stroke={BAMBOO.rib} strokeWidth={2.5} />
        ))}
        <path d="M -30 -8 Q -30 -50 -6 -50 Q 18 -50 18 -8 Z" fill={BAMBOO.hole} />
        {/* thân: ván gỗ nhiều lớp */}
        <path d={hull} fill={WOOD.mid} />
        <path d="M -160 2 Q 0 24 168 -2" fill="none" stroke={WOOD.light} strokeWidth={5} />
        <path d="M -138 20 Q 0 38 146 16" fill="none" stroke={WOOD.dark} strokeWidth={5} />
        {[-100, -40, 20, 80].map((px) => (
          <line key={px} x1={px} y1={-6} x2={px + 4} y2={34} stroke={WOOD.line} strokeWidth={2} opacity={0.5} />
        ))}
        {/* mép mạn thuyền */}
        <path d="M -178 -38 Q -160 -10 -124 -8 L 136 -8 Q 166 -12 182 -30" fill="none" stroke={WOOD.light} strokeWidth={7} strokeLinecap="round" />
        {/* nước liếm mạn */}
        <path d="M -150 24 Q -120 18 -90 24 T -30 24 T 30 24 T 90 24 T 150 22" fill="none" stroke={tint(colors.brandBlue, 0.55)} strokeWidth={4} strokeLinecap="round" />
        {/* viền sáng khi "thuyền" được gọi tên */}
        <path d={hull} fill="none" stroke={role.pairA} strokeWidth={6} opacity={hl} />
      </g>
    </g>
  );
};

/** Chân: ống quần xắn tới gối, cẳng chân trần. */
const Leg: React.FC<{ hip: [number, number]; knee: [number, number]; foot: [number, number] }> = ({ hip, knee, foot }) => (
  <>
    <line x1={hip[0]} y1={hip[1]} x2={knee[0]} y2={knee[1]} stroke={CLOTH} strokeWidth={18} strokeLinecap="round" />
    <line x1={knee[0]} y1={knee[1]} x2={foot[0]} y2={foot[1]} stroke={SKIN} strokeWidth={11} strokeLinecap="round" />
    <ellipse cx={foot[0] - 6} cy={foot[1] + 3} rx={11} ry={5} fill={SKIN} />
  </>
);

/** Người ra đi: dáng bước sang trái (cùng hướng thuyền), áo cánh, quần xắn, gánh tay nải. Không vẽ mặt (gói Văn › Tránh). */
const Boy: React.FC<{ o: number }> = ({ o }) => {
  const frame = useCurrentFrame();
  const step = Math.sin(frame * 0.18) * 5; // bước chân nhẹ
  const shirt = role.pairA;
  return (
    <g opacity={o} transform={`translate(${BOY_X} ${PEOPLE_TOP})`} data-mark="nguoi-di">
      {/* tay nải sau lưng, treo đầu gậy */}
      <line x1={-22} y1={80} x2={62} y2={10} stroke={WOOD.mid} strokeWidth={6} strokeLinecap="round" />
      <g transform={`rotate(${step * 0.6} 64 12)`}>
        <path d="M 44 34 Q 40 6 64 4 Q 90 6 86 34 Q 84 58 64 58 Q 46 58 44 34 Z" fill="#D7A256" stroke={WOOD.dark} strokeWidth={3} />
        {[
          [56, 24],
          [72, 22],
          [60, 42],
          [76, 40],
        ].map(([cx, cy]) => (
          <circle key={`${cx}-${cy}`} cx={cx} cy={cy} r={3.5} fill="#A8742F" />
        ))}
        <path d="M 54 6 L 64 -10 L 74 6" fill="#D7A256" stroke={WOOD.dark} strokeWidth={3} strokeLinejoin="round" />
      </g>
      {/* chân sau rồi chân trước */}
      <Leg hip={[8, 116]} knee={[18 - step, 142]} foot={[28 - step, 168]} />
      <Leg hip={[-6, 116]} knee={[-18 + step, 142]} foot={[-28 + step, 168]} />
      {/* thân áo cánh + thắt lưng */}
      <path d="M -24 58 Q -30 88 -26 118 L 26 118 Q 30 88 22 58 Q 0 50 -24 58 Z" fill={shirt} />
      <path d="M -10 56 L 0 72 L 8 56" fill="none" stroke="#0B6F6B" strokeWidth={3} strokeLinejoin="round" />
      <line x1={0} y1={72} x2={0} y2={104} stroke="#0B6F6B" strokeWidth={2} opacity={0.6} />
      <rect x={-27} y={104} width={54} height={9} rx={4} fill="#7A4A26" />
      {/* tay trước vung, tay sau giữ gậy */}
      <path d={`M -18 64 Q -32 84 ${-36 - step} 104`} fill="none" stroke={shirt} strokeWidth={14} strokeLinecap="round" />
      <circle cx={-36 - step} cy={108} r={7} fill={SKIN} />
      <path d="M 14 64 Q 4 76 -16 80" fill="none" stroke={shirt} strokeWidth={13} strokeLinecap="round" />
      <circle cx={-20} cy={80} r={7} fill={SKIN} />
      {/* cổ, đầu nhìn nghiêng sang trái, tóc */}
      <rect x={-7} y={44} width={14} height={14} fill={SKIN} />
      <circle cx={-2} cy={30} r={21} fill={SKIN} />
      <path d="M -22 26 Q -22 6 -2 6 Q 20 6 20 28 Q 20 40 14 44 Q 12 30 2 22 Q -10 18 -22 26 Z" fill={HAIR} />
    </g>
  );
};

/** Người ở lại: đứng nhìn theo thuyền (sang trái), áo dài tà bay, tóc dài, nón lá. Không vẽ mặt. */
const Girl: React.FC<{ o: number }> = ({ o }) => {
  const frame = useCurrentFrame();
  const sway = Math.sin(frame * 0.07) * 6; // tà áo bay nhẹ trong gió
  const dress = role.pairB;
  const dressDark = "#9C1FAD";
  return (
    <g opacity={o} transform={`translate(${GIRL_X} ${PEOPLE_TOP})`} data-mark="nguoi-o">
      {/* tóc dài sau lưng */}
      <path d="M 4 34 Q 26 40 24 76 Q 22 104 30 120 Q 14 116 10 96 Q 6 70 4 34 Z" fill={HAIR} />
      {/* quần trắng ống rộng */}
      <path d="M -18 104 L -24 166 L -4 166 L 0 120 L 4 166 L 24 166 L 18 104 Z" fill={CLOTH} />
      {/* tà sau, rồi thân áo, rồi tà trước */}
      <path d={`M 2 104 Q 24 130 ${30 + sway} 168 L ${8 + sway * 0.5} 168 Q 4 136 -4 106 Z`} fill={dressDark} />
      <path d="M -18 58 Q -24 84 -18 108 L 18 108 Q 22 84 16 58 Q 0 50 -18 58 Z" fill={dress} />
      <path d={`M -2 104 Q -24 130 ${-32 + sway} 168 L ${-8 + sway * 0.5} 168 Q -6 136 6 106 Z`} fill={dress} />
      {/* cổ áo, đường khuy chéo */}
      <rect x={-6} y={46} width={12} height={14} rx={4} fill={dress} />
      <path d="M -2 60 Q 8 66 14 74" fill="none" stroke={dressDark} strokeWidth={3} />
      {/* hai tay đan trước bụng */}
      <path d="M -14 64 Q -26 84 -8 96" fill="none" stroke={dress} strokeWidth={12} strokeLinecap="round" />
      <circle cx={-4} cy={96} r={7} fill={SKIN} />
      {/* đầu nhìn nghiêng sang trái */}
      <circle cx={-2} cy={32} r={19} fill={SKIN} />
      <path d="M -18 30 Q -14 16 2 16 Q 16 18 16 34 L 10 36 Q 4 24 -18 30 Z" fill={HAIR} />
      {/* nón lá: vành, gân lá, quai */}
      <g transform="rotate(-6 0 20)">
        <path d="M -58 24 L 0 -16 L 58 24 Q 0 34 -58 24 Z" fill={BAMBOO.fill} stroke={BAMBOO.edge} strokeWidth={3} strokeLinejoin="round" />
        {[-36, -18, 0, 18, 36].map((rx) => (
          <line key={rx} x1={0} y1={-14} x2={rx} y2={27} stroke={BAMBOO.rib} strokeWidth={2} />
        ))}
        <path d="M -40 13 Q 0 22 40 13" fill="none" stroke={BAMBOO.rib} strokeWidth={2} />
      </g>
      <path d="M -16 30 Q -10 54 4 50" fill="none" stroke={dressDark} strokeWidth={2} />
    </g>
  );
};

const Arrow: React.FC<{ x: number; y1: number; y2: number; p: number; color: string }> = ({ x, y1, y2, p, color }) => {
  if (p <= 0) return null;
  const y = y1 + (y2 - y1) * p;
  return (
    <g stroke={color} strokeWidth={5} strokeLinecap="round" fill="none">
      <line x1={x} y1={y1} x2={x} y2={y} strokeDasharray="4 14" />
      <path d={`M ${x - 14} ${y - 16} L ${x} ${y} L ${x + 14} ${y - 16}`} opacity={p > 0.9 ? 1 : 0} />
    </g>
  );
};

// ---------- Cảnh ----------

const Scene: React.FC = () => {
  const frame = useCurrentFrame();
  const sceneO = fade(frame, T.scene, 15);
  const boatBob = Math.sin(frame * 0.12) * 4; // cùng nhịp nhấp nhô với <Boat>, để nhãn và vật cản đi theo thuyền
  const boatX = interpolate(frame, [T.boatGo, T.boatArrive], [BOAT_START, BOAT_END], { ...clamp, easing: Easing.inOut(Easing.sin) });
  const moving = frame > T.boatGo && frame < T.boatArrive ? Math.min(1, (frame - T.boatGo) / 10, (T.boatArrive - frame) / 10) : 0;
  const hlThuyen = fade(frame, T.hlThuyen);
  const hlBen = fade(frame, T.hlBen);
  const divider = fade(frame, T.divider);
  const boy = usePop(T.boy);
  const girl = usePop(T.girl);
  const doi = fade(frame, T.hlDoi + 18);

  const obstacles: Rect[] = [
    { x: 420, y: 110, w: 1080, h: 248, pad: 10 }, // câu ca dao + ghi nguồn (tới y ≈ 358)
    { x: boatX - 182, y: WATER_Y - 92 + boatBob, w: 400, h: 146, pad: 10 },
    { x: DOCK.x1 - 20, y: DOCK.deck - 80, w: 520, h: 200, pad: 10 },
    { x: BOY_X - 52, y: PEOPLE_TOP - 14, w: 146, h: 190, pad: 10 },
    { x: GIRL_X - 62, y: PEOPLE_TOP - 22, w: 124, h: 196, pad: 10 },
    { x: layout.side, y: DIVIDER_Y - 4, w: layout.width - 2 * layout.side, h: 8, pad: 6 },
  ];

  return (
    <>
      <svg width={layout.width} height={layout.height} style={{ position: "absolute", inset: 0 }}>
        <River o={sceneO} />
        <Dock o={sceneO} hl={hlBen} />
        <Boat x={boatX} o={sceneO} hl={hlThuyen} moving={moving} />
        {/* ranh giới hai tầng nghĩa */}
        <line x1={layout.side + 260} y1={DIVIDER_Y} x2={layout.width - layout.side} y2={DIVIDER_Y} stroke={colors.axis} strokeWidth={3} strokeDasharray="10 12" opacity={divider} />
        <Arrow x={BOY_X} y1={WATER_Y + 56} y2={PEOPLE_TOP - 26} p={ramp(frame, T.boy - 12, T.boy + 6)} color={role.pairA} />
        <Arrow x={GIRL_X} y1={DOCK.deck + 120} y2={PEOPLE_TOP - 34} p={ramp(frame, T.girl - 12, T.girl + 6)} color={role.pairB} />
        <Boy o={boy} />
        <Girl o={girl} />
      </svg>

      {/* tầng 1: câu chữ */}
      <PoemLine words={LINE1} top={124} at={T.poem1} />
      <PoemLine
        words={LINE2}
        top={214}
        at={T.poem2}
        tail={
          <span data-text="label" style={{ position: "absolute", left: "100%", marginLeft: 28, top: 10, fontFamily: fontText, fontStyle: "normal", fontWeight: 700, fontSize: 38, color: role.focus, opacity: doi }}>
            <MathText text="→ thủy chung" />
          </span>
        }
      />
      <div style={{ position: "absolute", left: 0, width: layout.width, top: 304, textAlign: "center", fontFamily: fontText, fontSize: 36, color: colors.muted, opacity: fade(frame, T.note) }}>
        <span data-text="label">
          <MathText text="— Ca dao —" />
        </span>
      </div>

      {/* tên tầng nghĩa ngầm, đầu ranh giới */}
      <div data-text="label" style={{ position: "absolute", left: layout.side, top: DIVIDER_Y - 24, fontFamily: fontText, fontWeight: 700, fontSize: 36, color: colors.muted, opacity: divider }}>
        <MathText text="nghĩa ngầm" />
      </div>

      <AutoLabels
        obstacles={obstacles}
        items={[
          { id: "thuyen", x: boatX, y: WATER_Y - 88 + boatBob, text: "rời bến, đi xa", color: role.pairA, weight: 700, opacity: fade(frame, T.boatGo + 10), prefer: ["n", "ne", "nw"] },
          { id: "ben", x: (DOCK.x1 + DOCK.x2) / 2, y: DOCK.deck - 76, text: "đứng yên một chỗ", color: role.pairB, weight: 700, opacity: fade(frame, T.hlBen + 10), prefer: ["n", "nw"] },
          { id: "trai", x: BOY_X + 90, y: PEOPLE_TOP + 90, text: "người con trai ra đi", color: role.pairA, weight: 700, opacity: fade(frame, T.boy + 8), prefer: ["e"] },
          { id: "gai", x: GIRL_X - 50, y: PEOPLE_TOP + 90, text: "người con gái ở lại chờ", color: role.pairB, weight: 700, opacity: fade(frame, T.girl + 8), prefer: ["w"] },
        ]}
      />

      <KeyTakeaway text="Ẩn dụ: gọi người bằng tên vật giống họ" from={T.take} top={layout.sceneTakeawayTop} bottom={layout.sceneBottom} />
      <div data-layout="scene" style={{ display: "none" }} />
    </>
  );
};

const DemoVanAnDu: React.FC = () => {
  useKatexFonts();
  return (
    <BrandFrame>
      <AbsoluteFill>
        <Scene />
      </AbsoluteFill>
      <LayoutProbe />
    </BrandFrame>
  );
};

export const DemoVanAnDuComposition: React.FC = () => (
  <Composition id="demo-van-an-du" component={DemoVanAnDu} durationInFrames={DURATION} fps={FPS} width={1920} height={1080} />
);
