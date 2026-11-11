/**
 * Dữ liệu bảng tuần hoàn dùng chung cho video Hóa (gói môn `.agents/mon/hoa.md` › mục 7).
 * - Tên nguyên tố: tên IUPAC tiếng Anh theo SGK GDPT 2018 (aluminium, sulfur, caesium…).
 * - Nhóm: cách gọi SGK THPT — IA…VIIIA (nhóm A) và IIIB…IIB (nhóm B). KHÔNG dùng số cột 1–18 trên hình hay lời đọc.
 * - Khối lượng nguyên tử: chỉ ghi những nguyên tố thường gặp (4 chữ số có nghĩa); thiếu thì KHÔNG tự bịa, tra SGK rồi thêm vào đây.
 * Không sửa số liệu ở đây khi dựng một video cụ thể.
 */

const SYMBOLS = (
  "H He Li Be B C N O F Ne Na Mg Al Si P S Cl Ar K Ca Sc Ti V Cr Mn Fe Co Ni Cu Zn Ga Ge As Se Br Kr " +
  "Rb Sr Y Zr Nb Mo Tc Ru Rh Pd Ag Cd In Sn Sb Te I Xe Cs Ba La Ce Pr Nd Pm Sm Eu Gd Tb Dy Ho Er Tm Yb Lu " +
  "Hf Ta W Re Os Ir Pt Au Hg Tl Pb Bi Po At Rn Fr Ra Ac Th Pa U Np Pu Am Cm Bk Cf Es Fm Md No Lr " +
  "Rf Db Sg Bh Hs Mt Ds Rg Cn Nh Fl Mc Lv Ts Og"
).split(" ");

const NAMES = (
  "Hydrogen Helium Lithium Beryllium Boron Carbon Nitrogen Oxygen Fluorine Neon Sodium Magnesium Aluminium Silicon " +
  "Phosphorus Sulfur Chlorine Argon Potassium Calcium Scandium Titanium Vanadium Chromium Manganese Iron Cobalt Nickel " +
  "Copper Zinc Gallium Germanium Arsenic Selenium Bromine Krypton Rubidium Strontium Yttrium Zirconium Niobium Molybdenum " +
  "Technetium Ruthenium Rhodium Palladium Silver Cadmium Indium Tin Antimony Tellurium Iodine Xenon Caesium Barium " +
  "Lanthanum Cerium Praseodymium Neodymium Promethium Samarium Europium Gadolinium Terbium Dysprosium Holmium Erbium " +
  "Thulium Ytterbium Lutetium Hafnium Tantalum Tungsten Rhenium Osmium Iridium Platinum Gold Mercury Thallium Lead " +
  "Bismuth Polonium Astatine Radon Francium Radium Actinium Thorium Protactinium Uranium Neptunium Plutonium Americium " +
  "Curium Berkelium Californium Einsteinium Fermium Mendelevium Nobelium Lawrencium Rutherfordium Dubnium Seaborgium " +
  "Bohrium Hassium Meitnerium Darmstadtium Roentgenium Copernicium Nihonium Flerovium Moscovium Livermorium Tennessine Oganesson"
).split(" ");

/** Khối lượng nguyên tử trung bình (làm tròn 4 chữ số có nghĩa) — chỉ các nguyên tố hay dùng trong bài THPT. */
export const ATOMIC_MASS: Record<string, number> = {
  H: 1.008, He: 4.003, Li: 6.94, Be: 9.012, B: 10.81, C: 12.01, N: 14.01, O: 16.0, F: 19.0, Ne: 20.18,
  Na: 22.99, Mg: 24.31, Al: 26.98, Si: 28.09, P: 30.97, S: 32.06, Cl: 35.45, Ar: 39.95, K: 39.1, Ca: 40.08,
  Sc: 44.96, Ti: 47.87, V: 50.94, Cr: 52.0, Mn: 54.94, Fe: 55.85, Co: 58.93, Ni: 58.69, Cu: 63.55, Zn: 65.38,
  Ga: 69.72, Ge: 72.63, As: 74.92, Se: 78.97, Br: 79.9, Kr: 83.8, Rb: 85.47, Sr: 87.62, Ag: 107.9, I: 126.9,
  Cs: 132.9, Ba: 137.3, Au: 197.0, Hg: 200.6, Pb: 207.2,
};

/** Tên nhóm theo SGK THPT cho cột 1…18 của bảng dạng dài. */
export const GROUP_OF_COLUMN = [
  "", "IA", "IIA", "IIIB", "IVB", "VB", "VIB", "VIIB", "VIIIB", "VIIIB", "VIIIB", "IB", "IIB",
  "IIIA", "IVA", "VA", "VIA", "VIIA", "VIIIA",
] as const;

export type GroupName = Exclude<(typeof GROUP_OF_COLUMN)[number], "">;

export type Block = "s" | "p" | "d" | "f";

export interface PTElement {
  z: number;
  symbol: string;
  name: string;
  period: number;
  /** cột 1–18 trong bảng chính; nguyên tố họ lanthanide/actinide: 0 (nằm ở hàng tách riêng) */
  column: number;
  /** "IA"…"VIIIA", "IIIB"…"IIB"; họ lanthanide/actinide: "IIIB" */
  group: GroupName;
  block: Block;
  /** vị trí vẽ: hàng 1–7 = bảng chính, 8 = hàng lanthanide, 9 = hàng actinide */
  row: number;
  /** vị trí vẽ theo cột (1–18); hàng f bắt đầu từ cột 3 */
  col: number;
  mass?: number;
}

const PERIOD_START = [1, 3, 11, 19, 37, 55, 87, 119];

const place = (z: number): Omit<PTElement, "symbol" | "name" | "mass"> => {
  const period = PERIOD_START.findIndex((s, i) => z >= s && z < PERIOD_START[i + 1]) + 1;
  const k = z - PERIOD_START[period - 1]; // 0-based trong chu kì
  const len = PERIOD_START[period] - PERIOD_START[period - 1];
  let column: number;
  let row = period;
  let col: number;
  if (period === 1) column = z === 1 ? 1 : 18;
  else if (len === 8) column = k < 2 ? k + 1 : k + 11;
  else if (len === 18) column = k + 1;
  else {
    // chu kì 6, 7 (32 nguyên tố): 2 đầu → cột 1, 2; 15 nguyên tố f → hàng riêng; 15 sau → cột 4–18
    if (k < 2) column = k + 1;
    else if (k < 17) column = 0;
    else column = k - 13;
  }
  if (column === 0) {
    row = period === 6 ? 8 : 9;
    col = 3 + (k - 2);
  } else col = column;
  const group = (column === 0 ? "IIIB" : GROUP_OF_COLUMN[column]) as GroupName;
  const block: Block = column === 0 ? "f" : column <= 2 || z === 2 ? "s" : column >= 13 ? "p" : "d";
  return { z, period, column, group, block, row, col };
};

export const ELEMENTS: PTElement[] = SYMBOLS.map((symbol, i) => ({
  ...place(i + 1),
  symbol,
  name: NAMES[i],
  mass: ATOMIC_MASS[symbol],
}));

export const ELEMENT_BY_SYMBOL: Record<string, PTElement> = Object.fromEntries(ELEMENTS.map((e) => [e.symbol, e]));

/** Lấy nguyên tố theo ký hiệu; sai ký hiệu thì báo lỗi ngay khi dựng (không âm thầm vẽ sai). */
export const element = (symbol: string): PTElement => {
  const e = ELEMENT_BY_SYMBOL[symbol];
  if (!e) throw new Error(`Không có nguyên tố "${symbol}" — kiểm tra ký hiệu (phân biệt hoa/thường, vd. "Na", "Cl")`);
  return e;
};

/** Khối lượng viết kiểu Việt Nam: 22,99 (dấu phẩy thập phân). */
export const formatMass = (m: number) => (Number.isInteger(m) ? m.toFixed(2) : String(m)).replace(".", ",");

/** Lời đọc tên nhóm cho `speak`: "IA" → "nhóm một A", "VIIIB" → "nhóm tám B". */
export const speakGroup = (g: GroupName) => {
  const roman: Record<string, string> = { I: "một", II: "hai", III: "ba", IV: "bốn", V: "năm", VI: "sáu", VII: "bảy", VIII: "tám" };
  return `nhóm ${roman[g.slice(0, -1)]} ${g.slice(-1)}`;
};
