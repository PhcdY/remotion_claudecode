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
  items.forEach((a) => {
    boxes.forEach((b) => {
      if (b.el.contains(a.el) || a.el.contains(b.el)) return;
      if (gap(a.r, b.r) < 0) issues.push(`chạm khung chứa — ${a.label}`);
    });
  });
  // chế độ chữ trong cảnh (BeatShell subtitle={false}): không có dải phụ đề, chỉ cấm lấn xuống dưới sceneBottom
  const sceneMode = document.querySelector('[data-layout="scene"]') !== null;
  const bottomLimit = sceneMode ? layout.sceneBottom : layout.subtitleTop - 20;
  items.forEach((a) => {
    if (a.r.left < 0 || a.r.right > layout.width || a.r.top < 0) issues.push(`tràn khung — ${a.label}`);
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
  return issues;
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
          console.log("LAYOUT_RESULT " + JSON.stringify(measure()));
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
