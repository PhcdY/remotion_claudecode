import { useEffect, useState } from "react";
import { continueRender, delayRender, getInputProps } from "remotion";
import { layout } from "./theme";

// Chỉ chạy khi render với inputProps { layoutCheck: true } (scripts/check-layout.mjs).
// Đo khung bao mọi [data-text] / [data-mark], in kết quả ra console để script đọc.

type Item = { el: Element; kind: string; label: string; r: DOMRect; zone: string };

const effectiveOpacity = (el: Element) => {
  let o = 1;
  let n: Element | null = el;
  while (n) {
    const cs = getComputedStyle(n);
    if (cs.display === "none" || cs.visibility === "hidden") return 0;
    o *= parseFloat(cs.opacity || "1");
    n = n.parentElement;
  }
  return o;
};

const gap = (a: DOMRect, b: DOMRect) => {
  const dx = Math.max(a.left - b.right, b.left - a.right);
  const dy = Math.max(a.top - b.bottom, b.top - a.bottom);
  return Math.max(dx, dy); // < 0 là chồng nhau
};

const boxLabel = (el: Element) => (el.textContent ?? "").trim().replace(/\s+/g, " ").slice(0, 30) || el.tagName.toLowerCase();

/** Cỡ chữ thật trên khung (đã nhân phép phóng/thu của CSS transform, viewBox SVG). */
const effectiveFont = (el: Element) => {
  const fs = parseFloat(getComputedStyle(el).fontSize || "0");
  const r = el.getBoundingClientRect();
  if (el instanceof HTMLElement && el.offsetWidth > 0) return fs * (r.width / el.offsetWidth);
  if (el instanceof SVGGraphicsElement) {
    try {
      const bb = el.getBBox();
      if (bb.height > 0) return fs * (r.height / bb.height);
    } catch {
      return fs;
    }
  }
  return fs;
};

/** Chữ nằm ngoài mọi [data-text] mà nhỏ hơn sàn 36px. Công thức KaTeX đo theo cỡ gốc, không theo chỉ số trên/dưới. */
const unmarkedSmallText = () => {
  const out: string[] = [];
  const seen = new Set<Element>();
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode;
    const txt = (node.textContent ?? "").trim();
    if (!txt) continue;
    let el = node.parentElement;
    if (!el) continue;
    el = el.closest(".katex") ?? el;
    if (seen.has(el)) continue;
    seen.add(el);
    if (el.closest("[data-text],[data-deco],style,script,title,defs")) continue;
    if (effectiveOpacity(el) < 0.05) continue;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1 || r.right < 0 || r.bottom < 0 || r.left > layout.width || r.top > layout.height) continue;
    const fs = effectiveFont(el);
    if (fs > 0 && fs < MIN_FONT.default - 0.5) {
      out.push(`chữ nhỏ (${Math.round(fs)}px < ${MIN_FONT.default}px, chưa gắn data-text) — ${txt.slice(0, 40)}`);
    }
  }
  return out;
};

const measure = () => {
  const items: Item[] = [];
  document.querySelectorAll("[data-text],[data-mark]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1 || effectiveOpacity(el) < 0.05) return;
    items.push({
      el,
      kind: el.hasAttribute("data-mark") ? "mark" : "text",
      label: `${el.getAttribute("data-text") ?? el.getAttribute("data-mark")}: ${(el.textContent ?? "").trim().slice(0, 40)}`,
      r,
      zone: el.getAttribute("data-zone") ?? "visual",
    });
  });

  const issues: string[] = [];
  // khung chứa (thẻ, ô bảng) là vật cản: chữ/điểm bên ngoài không được chạm vào
  const boxes: { el: Element; r: DOMRect }[] = [];
  document.querySelectorAll("[data-box]").forEach((el) => {
    const r = el.getBoundingClientRect();
    if (r.width >= 1 && r.height >= 1 && effectiveOpacity(el) >= 0.05) boxes.push({ el, r });
  });
  items.forEach((a) => {
    boxes.forEach((b) => {
      // vùng sân khấu (StagePanel) không vẽ gì, chỉ là hệ toạ độ → không là vật cản
      if (b.el.getAttribute("data-box") === "stage") return;
      if (b.el.contains(a.el) || a.el.contains(b.el)) return;
      if (gap(a.r, b.r) < 0) issues.push(`chạm khung chứa — ${a.label}`);
    });
  });
  // khung chồng khung: thẻ/ảnh mới vẽ đè lên thẻ cũ còn hiện (.agents/chuan-thi-giac.md › 2)
  const solid = boxes.filter((b) => b.el.getAttribute("data-box") !== "stage");
  for (let i = 0; i < solid.length; i++) {
    for (let j = i + 1; j < solid.length; j++) {
      const a = solid[i];
      const b = solid[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const ga = a.el.closest("[data-group]");
      if (ga && ga === b.el.closest("[data-group]")) continue;
      if (gap(a.r, b.r) < 0) issues.push(`khung chồng khung — [${boxLabel(a.el)}] × [${boxLabel(b.el)}]`);
    }
  }
  // ảnh khai báo trong kịch bản mà chưa có file (Photo vẽ ô "THIẾU ẢNH")
  document.querySelectorAll("[data-missing-image]").forEach((el) => {
    if (effectiveOpacity(el) >= 0.05) issues.push(`thiếu ảnh — public/${el.getAttribute("data-missing-image")}`);
  });
  // chữ không gắn data-text vẫn phải đủ cỡ (trước 10/11 chữ trong thẻ lọt lưới, có chỗ chỉ 18–23px)
  unmarkedSmallText().forEach((t) => issues.push(t));
  // chế độ chữ trong cảnh (BeatShell subtitle={false}): không có dải phụ đề, chỉ cấm lấn xuống dưới sceneBottom
  const sceneMode = document.querySelector('[data-layout="scene"]') !== null;
  const bottomLimit = sceneMode ? layout.sceneBottom : layout.subtitleTop - 20;
  items.forEach((a) => {
    // Chặn nghiêm ngặt việc chữ thò ra ngoài hoặc dính sát mép video (< 24px)
    if (a.r.left < 24 || a.r.right > layout.width - 24 || a.r.top < 24) {
      issues.push(`tràn mép khung (${Math.round(a.r.left)}px..${Math.round(a.r.right)}px) — ${a.label}`);
    }
    // chữ phải nằm gọn trong khung chứa (thẻ, ô bảng) gắn data-box
    const box = a.el.closest("[data-box]");
    if (box && a.kind === "text") {
      const b = box.getBoundingClientRect();
      if (a.r.left < b.left - 1 || a.r.right > b.right + 1 || a.r.top < b.top - 1 || a.r.bottom > b.bottom + 1) {
        issues.push(`tràn khỏi khung chứa — ${a.label}`);
      }
    }
    if (a.zone !== "subtitle" && a.r.bottom > bottomLimit)
      issues.push(`${sceneMode ? "lấn mép dưới" : "lấn vùng phụ đề"} — ${a.label}`);
  });
  for (let i = 0; i < items.length; i++) {
    for (let j = i + 1; j < items.length; j++) {
      const a = items[i];
      const b = items[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      // các ô trong cùng một bảng/nhóm (data-group) được phép nằm sát nhau
      const ga = a.el.closest("[data-group]");
      if (ga && ga === b.el.closest("[data-group]") && a.kind === "text" && b.kind === "text" && gap(a.r, b.r) >= 0) continue;
      // hai điểm trên đồ thị được phép sát nhau; vật minh hoạ (bóng, người, xe) thì không được chồng
      if (a.kind === "mark" && b.kind === "mark") {
        const isPoint = (x: Item) => x.el.getAttribute("data-mark") === "point";
        if (!isPoint(a) && !isPoint(b) && gap(a.r, b.r) < 0) issues.push(`chồng — [${a.label}] × [${b.label}]`);
        continue;
      }
      const g = gap(a.r, b.r);
      const limit = a.kind === "text" && b.kind === "text" ? 12 : 0;
      if (g < limit) issues.push(`${g < 0 ? "chồng" : "sát"} (${Math.round(g)}px) — [${a.label}] × [${b.label}]`);
    }
  }

  // cỡ chữ tối thiểu (skill dung-video › quy tắc 4)
  items.forEach((a) => {
    if (a.kind !== "text") return;
    const kind = a.el.getAttribute("data-text") ?? "";
    const min = MIN_FONT[kind] ?? MIN_FONT.default;
    const fs = parseFloat(getComputedStyle(a.el).fontSize || "0");
    if (fs > 0 && fs < min - 0.5) issues.push(`chữ nhỏ (${Math.round(fs)}px < ${min}px) — ${a.label}`);
  });

  // nhãn neo (AutoLabels) phải ở gần vật của nó
  document.querySelectorAll("[data-label-id]").forEach((el) => {
    if (effectiveOpacity(el) < 0.05) return;
    const id = el.getAttribute("data-label-id");
    const anchor = document.querySelector(`[data-anchor-for="${id}"]`);
    if (!anchor) return;
    const r = el.getBoundingClientRect();
    const p = anchor.getBoundingClientRect();
    const d = Math.hypot(Math.max(r.left - p.left, 0, p.left - r.right), Math.max(r.top - p.top, 0, p.top - r.bottom));
    if (d > 130) issues.push(`nhãn xa vật ${Math.round(d)}px — ${(el.textContent ?? "").trim().slice(0, 40)}`);
  });

  return issues;
};

/** Số từ nhìn thấy: mỗi công thức KaTeX tính một từ, bỏ phần MathML ẩn. */
const wordsOf = (el: Element) => {
  let n = el.querySelectorAll(".katex").length;
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  let s = "";
  while (walker.nextNode()) {
    const t = walker.currentNode;
    if (t.parentElement?.closest(".katex")) continue;
    s += (t.textContent ?? "") + " ";
  }
  n += s.trim().split(/\s+/).filter(Boolean).length;
  return n;
};

// note: nhãn nhỏ "Ảnh minh họa" / "Số liệu minh họa" ở góc (cố ý nhỏ, mờ; không tính là nội dung)
const MIN_FONT: Record<string, number> = { tick: 28, axis: 28, takeaway: 56, subtitle: 48, note: 22, default: 36 };
const NOT_CONTENT = ["takeaway", "subtitle", "title", "url", "note"];

const SVG_ATTRS = ["d", "cx", "cy", "r", "x", "y", "x1", "y1", "x2", "y2", "points", "transform", "opacity", "stroke-dashoffset", "width", "height", "fill"];

/**
 * "Dấu vân" của khung hình: thay đổi khi bất kỳ vật nào nhúc nhích, đổi màu, đổi chữ.
 * Bỏ phần khung 9Study ([data-chrome]: nền trôi nhẹ, thanh tiến độ) vì nó đổi ở mọi frame.
 * check-layout so dấu vân các frame liên tiếp để cảnh báo khung đứng yên quá lâu.
 */
const signature = () => {
  let h = 5381;
  const add = (s: string) => {
    for (let i = 0; i < s.length; i++) h = ((h << 5) + h + s.charCodeAt(i)) | 0;
  };
  document.querySelectorAll("body *").forEach((el) => {
    if (el.closest("[data-chrome],.katex,style,script")) return;
    add(el.tagName);
    const st = el.getAttribute("style");
    if (st) add(st);
    if (el instanceof SVGElement) {
      for (const a of SVG_ATTRS) {
        const v = el.getAttribute(a);
        if (v) add(v);
      }
    }
    el.childNodes.forEach((n) => {
      if (n.nodeType === Node.TEXT_NODE) add(n.textContent ?? "");
    });
  });
  return h;
};

/** Chữ nội dung lớn nhất (px thật) và hình/khối lớn nhất (diện tích px²) đang hiện trong vùng hình. */
const focal = () => {
  let font = 0;
  let area = 0;
  const inVisual = (r: DOMRect) => r.width >= 1 && r.height >= 1 && r.bottom > layout.visualTop && r.top < layout.sceneBottom;
  document.querySelectorAll("[data-text]").forEach((el) => {
    const kind = el.getAttribute("data-text") ?? "";
    if (NOT_CONTENT.includes(kind) || kind === "tick" || kind === "axis" || effectiveOpacity(el) < 0.05) return;
    if (inVisual(el.getBoundingClientRect())) font = Math.max(font, effectiveFont(el));
  });
  document.querySelectorAll("[data-mark],[data-box],img,svg").forEach((el) => {
    if (el.closest("[data-deco],.katex") || el.getAttribute("data-box") === "stage" || effectiveOpacity(el) < 0.05) return;
    const r = el.getBoundingClientRect();
    if (inVisual(r)) area = Math.max(area, r.width * r.height);
  });
  return { font, area };
};

/** Cảnh báo (không chặn): khung lệch, nửa khung trống, nội dung co cụm quá nhỏ, phủ ít, thiếu trọng tâm. */
const composition = () => {
  const warns: string[] = [];
  const boxes: DOMRect[] = [];
  const texts: { k: string; n: number }[] = [];
  const add = (el: Element) => {
    // vùng sân khấu (StagePanel) chỉ là hệ toạ độ, không phải nội dung
    if (el.closest("[data-deco]") || el.getAttribute("data-box") === "stage" || effectiveOpacity(el) < 0.05) return;
    const r = el.getBoundingClientRect();
    if (r.width < 1 || r.height < 1 || r.bottom < layout.visualTop || r.top > layout.sceneBottom) return;
    boxes.push(r);
  };
  document.querySelectorAll("[data-text],[data-mark],[data-box]").forEach((el) => {
    const kind = el.getAttribute("data-text");
    if (kind && NOT_CONTENT.includes(kind)) return;
    add(el);
    if (kind && kind !== "tick" && kind !== "axis" && effectiveOpacity(el) >= 0.05) {
      const n = wordsOf(el);
      if (n) texts.push({ k: el.getAttribute("data-label-id") ?? (el.textContent ?? "").trim().slice(0, 60), n });
    }
  });
  // bỏ SVG bên trong công thức KaTeX
  document.querySelectorAll("svg path, svg line, svg circle, svg polygon, svg polyline, svg rect").forEach((el) => {
    if (!el.closest(".katex")) add(el);
  });
  if (boxes.length) {
    const left = Math.min(...boxes.map((b) => b.left));
    const right = Math.max(...boxes.map((b) => b.right));
    const contentWidth = right - left;
    const cx = (left + right) / 2;
    const mid = layout.width / 2;

    // Phát hiện lỗi hình bé tí lọt thỏm giữa khung 1920x1080
    if (boxes.length >= 4 && contentWidth < 1100) {
      warns.push(`nội dung co cụm quá nhỏ (rộng ${Math.round(contentWidth)}px < 1100px trên khung 1920) — cần mở rộng sân khấu toàn khung`);
    }

    if (right < mid + 60) warns.push(`nửa phải khung trống (nội dung tới x = ${Math.round(right)})`);
    else if (left > mid - 60) warns.push(`nửa trái khung trống (nội dung từ x = ${Math.round(left)})`);
    else if (Math.abs(cx - mid) > 280) warns.push(`khung lệch ${cx < mid ? "trái" : "phải"} (tâm nội dung x = ${Math.round(cx)})`);

    // .agents/chuan-thi-giac.md › 4: nội dung phủ ≥ 45% vùng hình, có một trọng tâm đủ lớn
    const top = Math.max(Math.min(...boxes.map((b) => b.top)), layout.visualTop);
    const bottom = Math.min(Math.max(...boxes.map((b) => b.bottom)), layout.sceneBottom);
    const visualArea = (layout.width - layout.side * 2) * (layout.sceneBottom - layout.visualTop);
    const cover = (contentWidth * Math.max(bottom - top, 0)) / visualArea;
    if (boxes.length >= 2 && cover < 0.45) warns.push(`nội dung chỉ phủ ${Math.round(cover * 100)}% vùng hình (nên ≥ 45%)`);
    const { font, area } = focal();
    if (font < 56 && area / visualArea < 0.25) {
      warns.push(`không có trọng tâm đủ lớn (chữ lớn nhất ${Math.round(font)}px, hình lớn nhất ${Math.round((area / visualArea) * 100)}% vùng hình)`);
    }
  }
  return { warns, texts };
};

export const LayoutProbe: React.FC = () => {
  const enabled = Boolean((getInputProps() as { layoutCheck?: boolean }).layoutCheck);
  const [handle] = useState(() => (enabled ? delayRender("Đo bố cục") : null));
  useEffect(() => {
    if (handle === null) return;
    let cancelled = false;
    document.fonts.ready.then(() =>
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (cancelled) return;
          console.log("LAYOUT_RESULT " + JSON.stringify({ issues: measure(), ...composition(), sig: signature() }));
          continueRender(handle);
        }),
      ),
    );
    return () => {
      cancelled = true;
    };
  }, [handle]);
  return null;
};
