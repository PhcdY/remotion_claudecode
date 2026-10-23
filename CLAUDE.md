# Video AI — video giải thích bản chất (Remotion, nhiều môn)

Video 2:30–4:00 (ưu tiên số một là dễ hiểu, không nhảy bước: bước khó được thêm thời gian, thiếu nữa thì cắt ý phụ), mở bằng một hiện tượng thật và kết bằng lời giải cho nó, **ngang 16:9 (1920×1080, 30fps)**, giọng đọc tiếng Việt, giải thích *vì sao* chứ không chỉ *cái gì*.
Dùng cho Toán, Lý, Hóa, Sinh, Sử, Địa…: luật riêng từng môn ở **gói môn** `.claude/mon/<mon>.md` (Toán: `toan.md`; môn mới tạo từ `_mau.md` cùng người dùng).
**Mục tiêu duy nhất là trải nghiệm người xem.** Trước khi đề xuất hướng thiết kế mới: xem video mẫu được khen và nghiên cứu liên quan, tự phản biện.
Dùng skill `remotion-best-practices` (đã cài trong `.agents/skills/`) cho mọi việc liên quan Remotion.

## Workflow (theo đúng thứ tự)

Mỗi bước có một skill riêng, đọc skill (và gói môn) trước khi làm bước đó:
B1 `viet-kich-ban` → B2 `tao-audio` → B3 `dung-video`.

1. **Kịch bản** → skill `viet-kich-ban`: chủ đề + ý bản chất → tìm ý (hook, hình trung tâm) → dàn ý (người dùng duyệt)
   → `src/videos/<slug>/script.json` → `python scripts/check_script.py <slug>` (0 lỗi). Người dùng chốt trước khi sang B2.
   (`src/videos/dao-ham-tiep-tuyen/` chỉ là dữ liệu mẫu để test B2/B3.)
2. **Audio** → skill `tao-audio`: giọng clone trên Vivibe qua API, chạy `scripts/vivibe_tts.py`
   - Sinh `public/audio/<slug>/<beatId>-lNN.mp3` (mỗi dòng 1 file) + `manifest.json`.
   - Giọng: hỏi người dùng mỗi lần chạy (`--voice`). Tốc độ trong `scripts/tts_config.json`, API key `VIVIBE_API_KEY` trong `.env`.
     `scripts/tts.py` (Edge TTS) chỉ để test nhanh.
3. **Dựng video** → `src/videos/<slug>/` chứa composition, đăng ký trong `src/Root.tsx`.
4. **Duyệt** → `npm run dev` (Remotion Studio).
   Góp ý của người dùng ghi vào `src/videos/<slug>/FEEDBACK.md` (cột "đã sửa skill" / "đã sửa video"): sửa skill ngay cho từng mục
   (và thêm một dòng vào `.claude/lessons.md`), gom sửa video một lần khi người dùng bảo. Lỗi cấu trúc kịch bản → quay lại B1 (duyệt dàn ý), không vá trên video cũ.
5. **Render** → `npx remotion render <compositionId> out/<slug>.mp4`; phụ đề riêng: `node scripts/export-captions.mjs <slug>`.

## Schema `script.json`

```jsonc
{
  "slug": "don-dieu",                  // chỉ chữ thường, số, '-'
  "title": "...",
  "subject": "toan",                   // gói môn trong .claude/mon/ (thiếu = toan)
  "beats": [
    {
      "id": "b01",
      "section": "HIỆN TƯỢNG",         // cấu trúc; chỉ TRONG ĐỀ THI / BẪY THƯỜNG GẶP / GIẢI ĐÁP hiện trên video
      "keyword": "Nhưng TẠI SAO?",      // câu chốt của beat, hiện lúc đọc dòng cuối, được dùng $...$
      "visual": "mô tả hình cho beat",  // Claude dựng hình theo mô tả này
      "lineGap": 0.5,                   // (tuỳ chọn) nghỉ giữa các dòng, chỉ cho chuỗi "vì sao"
      "lines": [
        {
          "text": "chữ mới hiện TRONG CẢNH ở dòng này, cạnh vật nó nói tới (≤ ~35 ký tự, ký hiệu/số, LaTeX trong $...$); \"\" nếu không có",
          "speak": "lời đọc, không ký hiệu; '...' trước chỗ cần nhấn",
          "caption": "(tuỳ chọn) phụ đề khi speak có phiên âm ký hiệu",
          "pauseAfter": 1.5             // (tuỳ chọn) nghỉ sau câu hỏi đoán, ≤ 2 s
        }
      ]
    }
  ]
}
```

## Quy tắc khi dựng video

- **Thời gian lấy từ audio, không đoán.** Đọc `public/audio/<slug>/manifest.json`, đo độ dài từng file
  (trong `calculateMetadata`), mỗi dòng `text` hiện lên đúng lúc file audio của nó bắt đầu.
  Tổng thời lượng composition = tổng audio + khoảng nghỉ.
- Khoảng nghỉ: 0.25s giữa các dòng, 0.6s giữa các beat (hằng số ở `src/components/timeline.ts`). Beat có `lineGap` thì dùng giá trị đó giữa các dòng; dòng có `pauseAfter` thì nghỉ thêm.
- **Chữ sống trong cảnh**: video mới không có dải phụ đề (`BeatShell subtitle={false}`); `text` đặt cạnh vật nó nói tới. Video cũ (trước 23/10/2026) giữ `Subtitle`.
- **Không sửa nội dung `text`/`speak` khi dựng.** Thấy sai thì báo người dùng.
- Công thức render bằng KaTeX. Phải chờ font KaTeX load xong (`delayRender`/`continueRender`) trước khi render frame.
- Font: Plus Jakarta Sans (brand 9Study) qua `@remotion/google-fonts`. Mọi video bọc trong `BrandFrame`.
- Component dùng lại đặt ở `src/components/` (BeatShell, SectionCard, KeyTakeaway, MathText, plot.tsx: Axes/FunctionPlot/TangentLine…, ZoomInset, timeline.ts).
  Xem cả thư mục các video trước; thứ cần lại lần hai thì chuyển vào `src/components/`, không chép.
  Ưu tiên dùng lại, chỉ tạo mới khi thật cần.
- Đồ thị vẽ bằng SVG, toạ độ → pixel qua một hàm scale chung, không hardcode pixel.
- Một ví dụ xuyên suốt cả video; ít chữ trên hình; mỗi dòng tối đa một thay đổi trên hình và số đổi thì hình đổi theo (chi tiết: skill `viet-kich-ban` yêu cầu 3, 6, 7, 9, 10; skill `dung-video` quy tắc 6, 8–10).
- Không nhảy bước: ký hiệu/khái niệm nào cũng được giải thích riêng (nghĩa + chỗ trên hình) trước khi đem ghép; không dùng phép biến hình lạ mắt để chuyển cảnh.
- Mọi animation dựa trên `useCurrentFrame()` + `interpolate`/`spring`. Không dùng CSS transition hay `setTimeout`.
- Không sửa file trong `public/audio/` bằng tay — tạo lại theo skill `tao-audio`.

## Kiểm tra trước khi báo xong

- `python scripts/check_script.py <slug>` không lỗi; `npm run lint` không lỗi.
- Đối chiếu toán/khoa học trên hình (toạ độ điểm, hệ số góc, công thức, số liệu) với kịch bản. Sai nội dung là lỗi nghiêm trọng nhất.
- `node scripts/check-layout.mjs <slug>` rỗng; xuất ảnh tĩnh bằng `node scripts/stills.mjs <id> <frame...>` ở các mốc quan trọng để soát bố cục.

## Style

Theo brand 9Study, chi tiết ở `style.md`: nền sáng, xanh `#4B87F4` / chàm `#3D4AEF`, chữ navy, font Plus Jakarta Sans, logo góc trên trái. Token màu/bố cục trong `src/components/theme.ts`.
