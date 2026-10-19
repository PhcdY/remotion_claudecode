# Video AI — video giải thích bản chất toán (Remotion)

Video 2:30–3:00 (ưu tiên dễ hiểu, thiếu thời gian thì cắt ý), mở bằng một hiện tượng thật và kết bằng lời giải cho nó, **ngang 16:9 (1920×1080, 30fps)**, giọng đọc tiếng Việt, giải thích *vì sao* chứ không chỉ *cái gì*.
Dùng skill `remotion-best-practices` (đã cài trong `.agents/skills/`) cho mọi việc liên quan Remotion.

## Workflow (theo đúng thứ tự)

Mỗi bước có một skill riêng, đọc skill trước khi làm bước đó:
B1 `viet-kich-ban` → B2 `tao-audio` → B3 `dung-video`.

1. **Kịch bản** → dùng skill `viet-kich-ban` (`.claude/skills/viet-kich-ban/SKILL.md`): chủ đề + ý bản chất
   → dàn ý (người dùng duyệt) → `src/videos/<slug>/script.json`. Người dùng chốt trước khi sang B2.
   (`src/videos/dao-ham-tiep-tuyen/` chỉ là dữ liệu mẫu để test B2/B3.)
2. **Audio** → skill `tao-audio`: giọng clone trên Vivibe qua API, chạy `scripts/vivibe_tts.py`
   - Sinh `public/audio/<slug>/<beatId>-lNN.mp3` (mỗi dòng 1 file) + `manifest.json`.
   - Giọng: hỏi người dùng mỗi lần chạy (`--voice`). Tốc độ trong `scripts/tts_config.json`, API key `VIVIBE_API_KEY` trong `.env`.
     `scripts/tts.py` (Edge TTS) chỉ để test nhanh.
3. **Dựng video** → `src/videos/<slug>/` chứa composition, đăng ký trong `src/Root.tsx`.
4. **Duyệt** → `npm run dev` (Remotion Studio).
5. **Render** → `npx remotion render <compositionId> out/<slug>.mp4`

## Schema `script.json`

```jsonc
{
  "slug": "dao-ham-tiep-tuyen",        // chỉ chữ thường, số, '-'
  "title": "...",
  "beats": [
    {
      "id": "b01",
      "section": "HIỆN TƯỢNG",         // cấu trúc; chỉ TRONG ĐỀ THI / BẪY THƯỜNG GẶP / GIẢI ĐÁP hiện trên video
      "keyword": "Nhưng TẠI SAO?",      // câu chốt của beat, hiện lúc đọc dòng cuối, được dùng $...$
      "visual": "mô tả hình cho beat",  // Claude dựng hình theo mô tả này
      "lines": [
        { "text": "chữ trên màn hình, LaTeX trong $...$; số kèm tên đại lượng + đơn vị", "speak": "lời đọc, viết toán bằng chữ; '...' trước chỗ cần nhấn" }
      ]
    }
  ]
}
```

## Quy tắc khi dựng video

- **Thời gian lấy từ audio, không đoán.** Đọc `public/audio/<slug>/manifest.json`, đo độ dài từng file
  (trong `calculateMetadata`), mỗi dòng `text` hiện lên đúng lúc file audio của nó bắt đầu.
  Tổng thời lượng composition = tổng audio + khoảng nghỉ.
- Khoảng nghỉ: 0.25s giữa các dòng, 0.6s giữa các beat. Để thành hằng số dễ chỉnh.
- **Không sửa nội dung `text`/`speak` khi dựng.** Thấy sai thì báo người dùng.
- Công thức render bằng KaTeX. Phải chờ font KaTeX load xong (`delayRender`/`continueRender`) trước khi render frame.
- Font: Plus Jakarta Sans (brand 9Study) qua `@remotion/google-fonts`. Mọi video bọc trong `BrandFrame`.
- Component dùng lại đặt ở `src/components/` (SectionCard, KeyTakeaway, Subtitle, MathText, Axes, FunctionPlot, TangentLine, ZoomInset…).
  Ưu tiên dùng lại, chỉ tạo mới khi thật cần.
- Đồ thị vẽ bằng SVG, toạ độ toán → pixel qua một hàm scale chung, không hardcode pixel.
- Mọi animation dựa trên `useCurrentFrame()` + `interpolate`/`spring`. Không dùng CSS transition hay `setTimeout`.
- Không sửa file trong `public/audio/` bằng tay — tạo lại theo skill `tao-audio`.

## Kiểm tra trước khi báo xong

- `npm run lint` không lỗi.
- Đối chiếu toán trên hình (toạ độ điểm, hệ số góc, công thức) với kịch bản. Sai toán là lỗi nghiêm trọng nhất.
- Xuất vài frame bằng `npx remotion still` ở các mốc quan trọng để soát bố cục.

## Style

Theo brand 9Study, chi tiết ở `style.md`: nền sáng, xanh `#4B87F4` / chàm `#3D4AEF`, chữ navy, font Plus Jakarta Sans, logo góc trên trái. Token màu/bố cục trong `src/components/theme.ts`.
