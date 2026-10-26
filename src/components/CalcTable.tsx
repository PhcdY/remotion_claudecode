import React from "react";
import { Card } from "./Card";
import { MathText } from "./MathText";
import { colors } from "./theme";

// Bảng giá trị kiểu màn hình máy tính bỏ túi (TABLE): tiêu đề cột bằng KaTeX, từng hàng hiện dần.
// Cả lưới là một khối chữ (data-text="table") để check-layout không coi các ô liền nhau là chồng lấn.

export type CalcRow = {
  cells: string[];
  /** độ mờ của hàng (0 = chưa hiện) */
  o: number;
  /** màu chữ của cả hàng (vd. hàng tính thêm) */
  color?: string;
};

export const CalcTable: React.FC<{
  left: number;
  top: number;
  width: number;
  headers: string[];
  rows: CalcRow[];
  /** màu riêng từng cột (ghi đè màu hàng), vd. cột f'(x) màu giảm */
  colColors?: (string | undefined)[];
  opacity?: number;
  fontSize?: number;
}> = ({ left, top, width, headers, rows, colColors = [], opacity = 1, fontSize = 44 }) =>
  opacity <= 0 ? null : (
    <Card style={{ left, top, width, padding: "16px 0", opacity, background: "#EEF1F6" }}>
      <div data-text="table" style={{ display: "grid", gridTemplateColumns: `repeat(${headers.length}, 1fr)`, fontSize, textAlign: "center" }}>
        {headers.map((h, i) => (
          <div key={`h${i}`} style={{ fontWeight: 700, color: colors.muted, paddingBottom: 8, borderBottom: `2px solid ${colors.panelBorder}` }}>
            <MathText text={h} />
          </div>
        ))}
        {rows.map((r, ri) =>
          r.o > 0
            ? r.cells.map((c, ci) => (
                <div
                  key={`${ri}-${ci}`}
                  style={{
                    padding: "6px 0",
                    opacity: r.o,
                    color: colColors[ci] ?? r.color ?? colors.text,
                    fontWeight: ci > 0 ? 700 : 400,
                    fontVariantNumeric: "tabular-nums",
                  }}
                >
                  {c}
                </div>
              ))
            : null,
        )}
      </div>
    </Card>
  );
