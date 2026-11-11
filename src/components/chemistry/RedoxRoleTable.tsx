import "./mhchem";
import React from "react";
import { MathText } from "../MathText";
import { role } from "../roles";
import { colors, fontText, tint } from "../theme";

/**
 * Bảng vai trò trong phản ứng oxi hoá – khử: hai cột (chất khử | chất oxi hoá), mỗi hàng một cách gọi.
 * Chặn bẫy "tên gọi chéo": chất khử thì BỊ OXI HOÁ, chất oxi hoá thì BỊ KHỬ. Gói môn Hóa › mục 6.7.
 * Hàng hiện dần theo lời đọc (`rows`), `trap` tô cam hai hàng dễ nhầm.
 *
 * Dùng: <RedoxRoleTable left={360} top={200} reducer="$\ce{Fe}$" oxidant="$\ce{Cu^2+}$"
 *         rows={[1, fadeIn(fr, L[1]), fadeIn(fr, L[2]), fadeIn(fr, L[3]), fadeIn(fr, L[4])]} trap={fr > L[5]} />
 */

const ROWS: [string, string][] = [
  ["nhường electron", "nhận electron"],
  ["số oxi hoá tăng", "số oxi hoá giảm"],
  ["bị oxi hoá", "bị khử"],
  ["quá trình oxi hoá", "quá trình khử"],
];

export const RedoxRoleTable: React.FC<{
  left: number;
  top: number;
  /** rộng toàn bảng, mặc định 1200 */
  width?: number;
  /** ví dụ cụ thể cho từng cột, vd. "$\ce{Fe}$" và "$\ce{Cu^2+}$" */
  reducer?: string;
  oxidant?: string;
  /** độ hiện từng hàng: [tiêu đề, nhường/nhận, số oxi hoá, bị…, quá trình…] */
  rows?: number[];
  /** tô cam hai hàng "bị oxi hoá / bị khử" và "quá trình…" (chỗ dễ nhầm) */
  trap?: boolean;
  opacity?: number;
}> = ({ left, top, width = 1200, reducer, oxidant, rows = [1, 1, 1, 1, 1], trap = false, opacity = 1 }) => {
  const colW = (width - 24) / 2;
  const rowH = 92;
  const headH = reducer || oxidant ? 150 : 100;
  const cols = [
    { title: "Chất khử", ex: reducer, c: role.pairA },
    { title: "Chất oxi hoá", ex: oxidant, c: role.pairB },
  ];
  return (
    <div data-group="redox-table" style={{ position: "absolute", left, top, width, fontFamily: fontText, opacity }}>
      {cols.map((col, ci) => (
        <div key={ci} style={{ position: "absolute", left: ci * (colW + 24), top: 0, width: colW }}>
          <div
            data-box="head"
            style={{
              height: headH,
              borderRadius: 18,
              background: tint(col.c, 0.12),
              border: `3px solid ${col.c}`,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              opacity: rows[0] ?? 1,
            }}
          >
            <div data-text="label" style={{ fontSize: 48, fontWeight: 800, color: col.c }}>
              <MathText text={col.title} />
            </div>
            {col.ex && (
              <div data-text="label" style={{ fontSize: 44, fontWeight: 700, color: colors.text, marginTop: 6 }}>
                <MathText text={col.ex} />
              </div>
            )}
          </div>
          {ROWS.map((r, ri) => {
            const isTrap = trap && ri >= 2;
            return (
              <div
                key={ri}
                data-box="cell"
                style={{
                  marginTop: 14,
                  height: rowH,
                  borderRadius: 14,
                  boxSizing: "border-box",
                  border: `${isTrap ? 4 : 2}px solid ${isTrap ? colors.warn : tint(col.c, 0.45)}`,
                  background: isTrap ? tint(colors.warn, 0.1) : "#FFFFFF",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  opacity: rows[ri + 1] ?? 1,
                }}
              >
                <div data-text="label" style={{ fontSize: 42, fontWeight: 700, color: isTrap ? colors.warn : col.c }}>
                  <MathText text={r[ci]} />
                </div>
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};
