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
  // vật đang di chuyển (gắn data-moving lúc chạy): lướt ngang qua thứ khác là chấp nhận được nếu ngắn
  // (skill dung-video › quy tắc 1, ngoại lệ "lướt qua") → ghi tiền tố "lướt qua", check-layout hạ thành cảnh báo.
  const moving = (x: Element) => x.closest("[data-moving]") !== null;
  const tag = (a: Element, b: Element, msg: string) => (moving(a) || moving(b) ? `lướt qua — ${msg}` : msg);
  items.forEach((a) => {
    boxes.forEach((b) => {
      if (b.el.contains(a.el) || a.el.contains(b.el)) return;
      if (gap(a.r, b.r) < 0) issues.push(tag(a.el, b.el, `chạm khung chứa — ${a.label}`));
    });
  });
  // khối chồng khối (thẻ ý liệt kê hiện đè lên nhau). Bỏ qua: khối lồng nhau, sân khấu nền (data-box="stage"),
  // khối đang mờ làm nền (< 0,5, vd. sân khấu sau thẻ bài thi), các ô sát nhau trong cùng data-group.
  const boxLabel = (el: Element) => `${el.getAttribute("data-box") || "khối"}: ${(el.textContent ?? "").trim().slice(0, 30)}`;
  const solid = boxes.filter((b) => b.el.getAttribute("data-box") !== "stage" && effectiveOpacity(b.el) >= 0.5);
  for (let i = 0; i < solid.length; i++) {
    for (let j = i + 1; j < solid.length; j++) {
      const a = solid[i];
      const b = solid[j];
      if (a.el.contains(b.el) || b.el.contains(a.el)) continue;
      const g = gap(a.r, b.r);
      const ga = a.el.closest("[data-group]");
      if (ga && ga === b.el.closest("[data-group]") && g >= 0) continue;
      if (g < 0) issues.push(`khối chồng khối (${Math.round(g)}px) — [${boxLabel(a.el)}] × [${boxLabel(b.el)}]`);
    }
  }
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
        if (!isPoint(a) && !isPoint(b) && gap(a.r, b.r) < 0) issues.push(tag(a.el, b.el, `chồng — [${a.label}] × [${b.label}]`));
        continue;
      }
      const g = gap(a.r, b.r);
      const limit = a.kind === "text" && b.kind === "text" ? 12 : 0;
      if (g < limit) issues.push(tag(a.el, b.el, `${g < 0 ? "chồng" : "sát"} (${Math.round(g)}px) — [${a.label}] × [${b.label}]`));
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

  issues.push(...renderIssues());
  return issues;
};

// --- Lỗi hiển thị bắt được bằng máy (phép thử P5 "chữ đọc được"; skill dung-video › mục 0) ---
// Nhãn "mô hình" người xem không cần (lessons.md 10/11/2026); không bắt "mô hình nguyên tử" là kiến thức thật.
// Bắt: "mô hình" đứng riêng, "Mô hình: …", "… mô hình, không phải Bolt", "mô hình giản lược/minh hoạ", "không phải số liệu thật".
// Thay bằng nhãn nhỏ "Số liệu minh họa" / "Ảnh minh họa" (data-text="note") khi cần — viet-kich-ban › Hình và số tượng trưng.
const MODEL_LABEL = /mô hình\s+(giản lược|minh ho[ạa]|đơn giản)|không phải số liệu thật|^\s*mô hình\s*(:|$)|mô hình\s*[,:]?\s*không phải/i;
// Công thức chưa được dựng: còn cặp $…$ hoặc lệnh \abc trong chữ thường (thiếu MathText)
const RAW_MATH = /\$[^$\s][^$]*\$|\\[a-zA-Z]{2,}/;

/** Các nút chữ đang hiện, bỏ phần bên trong KaTeX (MathML ẩn chứa TeX gốc). */
const visibleTextNodes = () => {
  const out: { node: Text; el: Element; text: string }[] = [];
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  while (walker.nextNode()) {
    const node = walker.currentNode as Text;
    const el = node.parentElement;
    const text = (node.textContent ?? "").trim();
    if (!el || !text || el.closest(".katex, .katex-error, script, style")) continue;
    if (effectiveOpacity(el) < 0.05) continue;
    out.push({ node, el, text });
  }
  return out;
};

const renderIssues = () => {
  const issues: string[] = [];
  document.querySelectorAll(".katex-error").forEach((el) => {
    if (effectiveOpacity(el) < 0.05) return;
    issues.push(`công thức KaTeX lỗi (hiện chữ đỏ) — "${(el.textContent ?? "").trim().slice(0, 60)}": ${(el.getAttribute("title") ?? "").slice(0, 120)}`);
  });
  for (const { text } of visibleTextNodes()) {
    if (MODEL_LABEL.test(text)) issues.push(`nhãn "mô hình" thừa (người xem tự hiểu hình tượng trưng) — "${text.slice(0, 60)}"`);
    if (RAW_MATH.test(text)) issues.push(`công thức chưa dựng, còn chữ thô (bọc bằng MathText) — "${text.slice(0, 60)}"`);
  }
  // gạch ngang đè lên số/ký tự đơn tạo ký tự méo (lessons.md 06/11/2026); gạch cả từ thì được
  document.querySelectorAll("body *").forEach((el) => {
    if (!getComputedStyle(el).textDecorationLine.includes("line-through")) return;
    const t = (el.textContent ?? "").trim();
    if (t && (t.length <= 2 || /^[\d\s.,+−-]+$/.test(t)) && effectiveOpacity(el) >= 0.05)
      issues.push(`gạch ngang đè lên số/ký tự đơn "${t}" — dùng hai khối SAI ✗ / ĐÚNG ✓`);
  });
  return issues;
};

const isPainted = (cs: CSSStyleDeclaration) => {
  const bg = cs.backgroundColor;
  const hasBg = bg && bg !== "transparent" && !/rgba\([^)]*,\s*0\)$/.test(bg);
  const hasBorder = ["Top", "Right", "Bottom", "Left"].some(
    (s) => parseFloat(cs.getPropertyValue(`border-${s.toLowerCase()}-width`)) > 0 && cs.getPropertyValue(`border-${s.toLowerCase()}-style`) !== "none",
  );
  return hasBg || hasBorder;
};
const exceeds = (a: DOMRect, b: DOMRect) => a.left < b.left - 2 || a.right > b.right + 2 || a.top < b.top - 2 || a.bottom > b.bottom + 2;

/** Cảnh báo: chữ tràn khỏi một khung có viền/nền mà khung chưa gắn data-box (check-layout không đo được khung đó). */
const unboxedOverflow = () => {
  const warns = new Set<string>();
  for (const { node, el, text } of visibleTextNodes()) {
    if (el.closest("[data-box]")) continue;
    const range = document.createRange();
    range.selectNodeContents(node);
    const r = range.getBoundingClientRect();
    if (r.width < 1 || r.height < 1) continue;
    let p: Element | null = el;
    for (let depth = 0; p && depth < 6; depth++, p = p.parentElement) {
      if (p instanceof SVGElement) break;
      const b = p.getBoundingClientRect();
      if (b.width >= 1500 || p === document.body) break; // sân khấu, không phải hộp chứa
      if (isPainted(getComputedStyle(p))) {
        if (exceeds(r, b)) warns.add(`chữ tràn khỏi khung có viền/nền chưa gắn data-box — "${text.slice(0, 40)}"`);
        break;
      }
    }
  }
  // SVG tự vẽ: <text> nằm trên một <rect> (ô bảng, thẻ) mà to hơn rect đó
  document.querySelectorAll<SVGTextElement>("svg text").forEach((t) => {
    if (t.closest(".katex") || effectiveOpacity(t) < 0.05) return;
    const r = t.getBoundingClientRect();
    if (r.width < 1) return;
    const cx = (r.left + r.right) / 2;
    const cy = (r.top + r.bottom) / 2;
    let best: DOMRect | null = null;
    for (const rect of Array.from(t.ownerSVGElement?.querySelectorAll<SVGRectElement>("rect") ?? [])) {
      const cs = getComputedStyle(rect);
      if ((cs.fill === "none" && cs.stroke === "none") || effectiveOpacity(rect) < 0.05) continue;
      const b = rect.getBoundingClientRect();
      if (b.width >= 1500 || cx < b.left || cx > b.right || cy < b.top || cy > b.bottom) continue;
      if (!best || b.width * b.height < best.width * best.height) best = b;
    }
    if (best && exceeds(r, best)) warns.add(`chữ SVG to hơn ô/khung bên dưới — "${(t.textContent ?? "").trim().slice(0, 40)}" (dùng component tính cỡ chữ theo ô)`);
  });
  return [...warns];
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

/** Cảnh báo (không chặn): khung lệch, nửa khung trống, nội dung co cụm quá nhỏ. */
const composition = () => {
  const warns: string[] = [];
  const boxes: DOMRect[] = [];
  const texts: { k: string; n: number }[] = [];
  const add = (el: Element) => {
    if (el.closest("[data-deco]") || effectiveOpacity(el) < 0.05) return;
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
  }
  warns.push(...unboxedOverflow());
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
          console.log("LAYOUT_RESULT " + JSON.stringify({ issues: measure(), ...composition() }));
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
