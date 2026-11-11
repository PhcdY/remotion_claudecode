# Video AI — video giải thích bản chất (Remotion, nhiều môn)

Video 2:30–4:00 (ưu tiên số một là dễ hiểu, không nhảy bước: bước khó được thêm thời gian, thiếu nữa thì cắt ý phụ), mở bằng một hook và kết bằng lời giải cho nó, **ngang 16:9 (1920×1080, 30fps)**, giọng đọc tiếng Việt, giải thích *vì sao* chứ không chỉ *cái gì*.
Hai loại video (`"loai"` trong `script.json`, không chắc thì hỏi): **video bài học** — dạy đủ một bài SGK theo *thẻ bài học* `references/<môn>/lop-<lớp>/bai-<NN>-….md`, tiêu đề chứa tên bài, hook ≤ 20 s chỉ là cửa vào; **video hiện tượng** — trả lời một câu "vì sao".
Dùng cho Toán, Lý, Hóa, Sinh, Sử, Địa…: luật riêng từng môn ở **gói môn** `.agents/mon/<mon>.md` (Toán: `toan.md`; môn mới tạo từ `_mau.md` cùng người dùng).
**Mục tiêu duy nhất là trải nghiệm người xem.** Trước khi đề xuất hướng thiết kế mới: xem video mẫu được khen và nghiên cứu liên quan, tự phản biện.

**Ba tầng luật** (chi tiết: skill `viet-kich-ban` › mục 0):
- **Tầng 1 — sáu phép thử, CỨNG**: P0 đúng và đủ nội dung đã duyệt · P1 không nhảy bước (thấy trước, gọi tên sau) · P2 lúc nào cũng biết đang xem gì · P3 tắt tiếng vẫn hiểu đúng điều lời đọc khẳng định (khái niệm mới → hình mới) · P4 một khái niệm một tên · P5 chữ đọc được. Không gói môn, không ngoại lệ nào tắt được.
- **Tầng 2 — mặc định**: mọi luật khác (số cảnh, thời lượng, bố cục…). Gói môn chỉ thay được trong mục **"Thay luật chung"** của gói; không ghi ở đó thì luật chung thắng.
- **Tầng 3 — gợi ý**: thực đơn hình, component, mẫu câu.
- **Lối thoát**: thấy cách hay hơn mà luật chặn, công cụ báo nhầm, hoặc **người dùng yêu cầu điều trái luật** → nêu luật + lý do, đề xuất ở điểm duyệt (Bảng nội dung, storyboard), người dùng chọn. Không im lặng làm khác, không im lặng làm theo, không đoán.
Dùng skill `remotion-best-practices` (đã cài trong `.agents/skills/`) cho mọi việc liên quan Remotion.

## Môi trường thực thi & Lưu ý Windows
- **Python**: Trên Windows, dùng `py scripts/...` thay vì `python scripts/...`.
- **Node / Remotion**: Chạy `npm run dev` để mở Studio, `npm run lint` để kiểm tra TypeScript/ESLint.

## Workflow (theo đúng thứ tự)

Mỗi bước có một skill riêng trong `.agents/skills/`, đọc skill (và gói môn) trước khi làm bước đó:
B1 `viet-kich-ban` → B3 nháp + storyboard (`dung-video` › Bước 2b) → B2 `tao-audio` → B3 hoàn thiện (`dung-video`).

1. **Kịch bản** → skill `viet-kich-ban`: chủ đề + ý bản chất → loại video + thẻ bài học (chưa có thì soạn, người dùng duyệt) → tìm ý (hook, hình trung tâm) → dàn ý mở đầu bằng *Bảng nội dung* (người dùng duyệt)
   → `src/videos/<slug>/script.json` → `py scripts/check_script.py <slug>` (0 lỗi). Người dùng chốt trước khi sang B2.
   (`src/videos/dao-ham-tiep-tuyen/` chỉ là dữ liệu mẫu để test B2/B3.)
2. **Audio** → skill `tao-audio`: giọng clone trên Vivibe qua API, chạy `scripts/vivibe_tts.py`
   - Sinh `public/audio/<slug>/<beatId>-lNN.mp3` (mỗi dòng 1 file) + `manifest.json`; rồi `py scripts/align_words.py <slug>` → `words.json` (mốc từng từ cho `cue`).
   - Giọng: hỏi người dùng mỗi lần chạy (`--voice`). Tốc độ trong `scripts/tts_config.json`, API key `VIVIBE_API_KEY` trong `.env`.
     `scripts/tts.py` (Edge TTS) chỉ để test nhanh.
   Trước B2: dựng bản nháp (thời gian ước tính, `draft: true`) và `node scripts/storyboard.mjs <id>` → người dùng duyệt hình; sửa chữ/lời lúc này chưa tốn credit.
3. **Dựng video** → `src/videos/<slug>/` (Video.tsx dùng `ExplainerVideo`, beats.tsx, scene.tsx), đăng ký trong `src/Root.tsx`. `src/videos/lab-thanh-phan/` là composition thử thành phần dùng chung, không phải video đăng.
4. **Duyệt** → `npm run dev` (Remotion Studio).
   Góp ý của người dùng ghi vào `src/videos/<slug>/FEEDBACK.md` (cột "đã sửa skill" / "đã sửa video"): sửa skill ngay cho từng mục
   (và thêm một dòng vào `.agents/lessons.md`), gom sửa video một lần khi người dùng bảo. Lỗi cấu trúc kịch bản → quay lại B1 (duyệt dàn ý), không vá trên video cũ.
5. **Render** → `npx remotion render <compositionId> "$(node scripts/out-path.mjs <slug> --id <compositionId>)"`; phụ đề riêng + mốc từng dòng: `node scripts/export-captions.mjs <slug>`.
   `out/<Môn>/Lớp <lop>/<chuong>/<bai>/`: video + phụ đề (người dùng xem). `out/_lam-viec/<id>/`: stills, storyboard (agent dùng). Không để file nào khác ở gốc `out/`.
6. **Người xem thật** → học sinh xem thử, số liệu giữ chân người xem; thời điểm → câu: `py scripts/beat_at.py <id> 1:23`. Soát kịch bản/storyboard bằng agent/skill `hoc-sinh-ao`.

## Schema `script.json`

```jsonc
{
  "slug": "don-dieu",                  // chỉ chữ thường, số, '-'
  "title": "...",
  "subject": "toan",                   // gói môn trong .agents/mon/ (thiếu = toan)
  "lop": 12, "chuong": "Chương I. …", "bai": "Bài 1. …",  // theo SGK → thư mục video trong out/
  "beats": [
    {
      "id": "b01",
      "scene": 1,                       // số cảnh; beat liền nhau cùng cảnh thì hình nối liền
      "section": "HIỆN TƯỢNG",         // cấu trúc; chỉ TRONG ĐỀ THI / BẪY THƯỜNG GẶP / GIẢI ĐÁP hiện trên video
      "keyword": "Nhưng TẠI SAO?",      // câu chốt của beat, hiện lúc đọc dòng cuối, được dùng $...$
      "visual": "cảnh, bố cục, thành phần lúc beat bắt đầu",
      "lineGap": 0.5,                   // (tuỳ chọn) nghỉ giữa các dòng, chỉ cho chuỗi "vì sao"
      "lines": [
        {
          "show": "MỘT thay đổi trên hình ở dòng này ('giữ nguyên' nếu không đổi)",
          "cue": "(tuỳ chọn) cụm nguyên văn trong speak: thay đổi vào đúng lúc giọng nói tới",
          "at": "vật mà text gắn vào (bắt buộc khi có text)",
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
- **Chữ sống trong cảnh**: video mới không có dải phụ đề; `text` đặt cạnh vật ghi ở `at` bằng `AutoLabels` (nhãn neo tự tránh nhau). Video cũ (trước 23/10/2026) giữ `Subtitle`.
- **Một sân khấu toàn khung** *(mặc định — tầng 2; chi tiết `dung-video` quy tắc 1)*: toàn bộ khung 1920×1080 là sân khấu. Hình chính (đồ thị, sa bàn, sơ đồ, tế bào, thí nghiệm) chiếm ≥ 75% diện tích khả dụng (rộng ≥ 1500px, cao ≥ 750px), không co cụm vào một thẻ nhỏ 800–1000px giữa màn hình (`check-layout` cảnh báo). Bố cục khác hay hơn → đề xuất ở storyboard. Beat cùng `scene` nối liền (không mờ ở ranh giới); màu theo vai trò `role` (`src/components/roles.ts`), ≤ 5 màu nhấn mỗi cảnh.
- **Không cắt cụt chữ ở mép** *(P5 — chữ đọc được; `check-layout` chặn)*: không ký tự nào sát mép khung (< 30px). Cách thường làm: nhãn neo ở phía phải (x > 1400px hoặc sát mép panel) đặt chữ dạt sang trái (anchor left / textAnchor end) để thân chữ vào trong sân khấu.
- **Mũi tên không đè mục tiêu** *(mặc định — tầng 2)*: mũi tên chỉ dẫn / tác động dừng cách mục tiêu ≥ 24px; nhãn của mũi tên đặt ở gốc hoặc giữa thân, không đè lên ngọn nơi mục tiêu đứng.
- **Mọi chữ hiển thị qua `MathText`** *(P5 — chữ đọc được; `check-layout` báo lỗi khi công thức chưa dựng hoặc KaTeX lỗi)*: không render text thô `<span>{text}</span>` / `<div>{item}</div>`; bọc qua `<MathText text={...} />` (khung chứa chữ tự vẽ: `TextBox`). Trong kịch bản môn xã hội, dùng trực tiếp ký tự Unicode `→` (hoặc `->`), cấm gõ `$\to$` để tránh rụng lệnh thành `$ o$`.
- **Không sửa nội dung `text`/`speak` khi dựng.** Thấy sai thì báo người dùng.
- Công thức render bằng KaTeX. Phải chờ font KaTeX load xong (`delayRender`/`continueRender`) trước khi render frame.
- Font: Plus Jakarta Sans (brand 9Study) qua `@remotion/google-fonts`. Mọi video bọc trong `BrandFrame`.
- Component dùng lại đặt ở `src/components/` (BeatShell, SectionCard, KeyTakeaway, MathText, plot.tsx: Axes/FunctionPlot/TangentLine…, ZoomInset, timeline.ts).
  Xem cả thư mục các video trước; thứ cần lại lần hai thì chuyển vào `src/components/`, không chép.
  Ưu tiên dùng lại, chỉ tạo mới khi thật cần.
- Đồ thị vẽ bằng SVG, toạ độ → pixel qua một hàm scale chung, không hardcode pixel.
- Một ví dụ xuyên suốt cả video (video bài học: hook mở–kết xuyên suốt, quy tắc nhiều trường hợp dùng nhiều ví dụ của thẻ); khái niệm mới → hình mới; ít chữ trên hình; mỗi dòng tối đa một thay đổi trên hình và số đổi thì hình đổi theo (chi tiết: skill `viet-kich-ban` yêu cầu 3, 6, 7, 9, 10; skill `dung-video` quy tắc 6, 8–10).
- Không nhảy bước: ký hiệu/khái niệm nào cũng được giải thích riêng (nghĩa + chỗ trên hình) trước khi đem ghép; không dùng phép biến hình lạ mắt để chuyển cảnh.
- Mọi animation dựa trên `useCurrentFrame()` + `interpolate`/`spring`. Không dùng CSS transition hay `setTimeout`.
- Không sửa file trong `public/audio/` bằng tay — tạo lại theo skill `tao-audio`.

## Kiểm tra trước khi báo xong

- `py scripts/check_script.py <slug>` không lỗi; `npm run lint` không lỗi. Dán checklist P0–P5 (mục 0 của `viet-kich-ban` / `dung-video`, có/không + frame) vào báo cáo.
- Đối chiếu toán/khoa học trên hình (toạ độ điểm, hệ số góc, công thức, số liệu) với kịch bản. Sai nội dung là lỗi nghiêm trọng nhất.
- `node scripts/check-layout.mjs <slug>` (bản nháp thêm `--draft`) không có lỗi, cảnh báo đã soát; xuất ảnh tĩnh bằng `node scripts/stills.mjs <id> <frame...>` ở các mốc quan trọng để soát bố cục.

## Style

Theo brand 9Study, chi tiết ở `style.md`: nền sáng, xanh `#4B87F4` / chàm `#3D4AEF`, chữ navy, font Plus Jakarta Sans, logo góc trên trái. Token màu/bố cục trong `src/components/theme.ts`.

## Quy ước đặt tên nhánh Git (Branching)

> Repo này là **bộ khung công cụ (Engine / Framework)**. Người dùng làm video mới **KHÔNG CẦN tạo nhánh Git** (làm trực tiếp trên local, video thành phẩm tự lưu máy cá nhân). Nhánh Git chỉ tạo khi phát triển hoặc nâng cấp chính hệ thống công cụ.

Cấu trúc: `[môn]_[tag]_[describe]`
- **`[môn]`**: Mã môn (`toan`, `ly`, `hoa`, `sinh`, ...) hoặc `all` cho khung chung, công cụ, core components, skills.
- **`[tag]`**:
  - `feature`: Thêm tính năng/công cụ mới cho framework (component dùng chung mới, skill mới, gói môn mới).
  - `fix`: Sửa lỗi hệ thống, component dùng chung, layout core hoặc script tự động.
  - `refactor`: Tái cấu trúc mã nguồn, dọn dẹp hoặc tối ưu component cốt lõi.
  - `test`: Nhánh thử nghiệm kỹ thuật (thử thư viện mới, benchmark render).
  - `release`: Đóng gói và chuẩn bị phát hành phiên bản ổn định cho toàn bộ framework (VD: `all_release_v1.0.0`).
  - `docs`: Tài liệu, quy định, hướng dẫn và cập nhật tài liệu tham khảo SGK.
- **`[describe]`**: Mô tả ngắn gọn bằng tiếng Việt không dấu hoặc tiếng Anh, dùng dấu gạch ngang `-` (kebab-case). Ví dụ: `all_fix_de-nhan-autolabels`, `toan_feature_truc-khong-gian-3d`, `all_release_v1.0.0`.

### Phiên bản, Phát hành (Release) & Thử nghiệm Tính năng
- **Người làm video hỏi hoặc đổi phiên bản** ("đang dùng bản nào", "bản này cập nhật gì", "có bản mới chưa", "cập nhật bản mới nhất", "cập nhật lên bản <tên>", "quay lại bản cũ"): **luôn dùng skill `phien-ban`**. Không tự chạy `git pull`/`checkout`/`reset`, vì bài của họ nằm trong `src/videos/`, `src/Root.tsx` và sổ tay `.agents/`.
- **Bản ổn định (Git Tag)**: tag chỉ là số (`1`, `2`, `3`…, `v1.0.0` tính là bản 1), gắn trên commit của `main-codex`. Bản mới nhất là số lớn nhất.
- **`CHANGELOG.md`**: thay đổi người dùng cảm nhận được thì thêm một dòng vào mục `## Chưa phát hành` khi merge vào `main-codex`, viết bằng lời thường.
- **Quy trình Release** (chỉ làm khi chủ dự án bảo "push release"): nhánh `all_release_<số>` → thẩm định (lint, check_script, render thử) → đổi `## Chưa phát hành` thành `## Bản <số> — <ngày>` → merge vào `main-codex` → gắn tag `<số>` trên `main-codex` và push. Chi tiết ở `docs/git-branching.md` mục 4.4.
- **Thử nghiệm tính năng**: người dùng nói "chuyển sang bản <tên nhánh>" (skill `phien-ban`), thử trong phòng lab `src/videos/lab-thanh-phan/`, xong thì "quay lại bản cũ".

## Chiến lược Chất lượng & Tiết kiệm Token (AI Pair-Programming)
1. **Chất lượng là số một**:
   - **Zero Guesswork**: Các toạ độ, hàm số, đạo hàm phải được tính chính xác bằng công thức toán/script trước khi code SVG.
   - **Thẩm định 3 cổng**: `check_script.py` (0 lỗi) → `hoc-sinh-ao` (soát nhảy bước sư phạm) → Storyboard nháp `storyboard.mjs` (duyệt hình trước khi tạo Audio).
   - **Tham chiếu chuẩn**: Chỉ tham chiếu 1 video mẫu hoàn chỉnh (`tich-vo-huong` hoặc `dao-ham-tiep-tuyen`) và components cốt lõi (`ExplainerVideo.tsx`, `plot.tsx`, `AutoLabels.tsx`).
2. **Tiết kiệm token & Context Budget**:
   - Chia phiên làm việc theo từng trạm (Trạm 1: Kịch bản `script.json` → Trạm 2: Nháp Storyboard → Trạm 3: Audio TTS & Render hoàn thiện).
   - Tận dụng `/compact` sau khi xong mỗi trạm để giữ context gọn gàng.
   - Không nạp các tài liệu 3D/Maps không liên quan của `remotion-best-practices` khi chỉ dựng 2D SVG/Math.
