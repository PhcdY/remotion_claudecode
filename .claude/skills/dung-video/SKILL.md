---
name: dung-video
description: B3 của pipeline video toán — dựng video Remotion từ script.json (B1) và audio trong public/audio/<slug>/ (B2). Dùng khi đã có kịch bản và audio, cần dựng/sửa/render video, hoặc gõ /dung-video <slug>.
---

# B3 — Dựng video Remotion

Luôn dùng kèm skill `remotion-best-practices` cho mọi chi tiết API Remotion (đo audio, font, Sequence, render…).

## Đầu vào (contract với B1, B2)

| File | Từ | Dùng để |
|---|---|---|
| `src/videos/<slug>/script.json` | B1 | nội dung: section, keyword, visual, lines[].text |
| `public/audio/<slug>/manifest.json` | B2 | thứ tự + tên file audio từng dòng |
| `public/audio/<slug>/<beatId>-lNN.mp3` | B2 | giọng đọc; **độ dài file quyết định thời gian** |
| `style.md` (gốc project) | người dùng | màu, font, layout. Chưa có → nền tối, chữ sáng, bố cục sạch |

`speak` **không** dùng ở B3 (chỉ dành cho TTS). Trên màn hình luôn hiện `text`.

## Bước 0 — Kiểm tra đầu vào (dừng nếu lỗi)

- Hai file JSON tồn tại và parse được.
- Mỗi dòng trong `script.json` có đúng một mục trong manifest (khớp `beat` + `line`), và file mp3 tồn tại.
- `text` trong manifest khớp `text` trong script. Lệch → kịch bản đã sửa sau khi tạo audio → **yêu cầu chạy lại B2**, không tự đoán thời gian.
- Thiếu file nào thì liệt kê đủ rồi dừng.

## Bước 1 — Tính timeline (hàm thuần, file `src/videos/<slug>/timeline.ts`)

Hằng số (để ở đầu file, dễ chỉnh):
```
FPS = 30, INTRO = 1.6s, LEAD_IN = 0.3s, GAP_LINE = 0.25s, GAP_BEAT = 0.6s, TAIL = 1.0s, OUTRO = 2.5s
```
- Đo độ dài từng mp3 trong `calculateMetadata` (cách đo theo skill remotion-best-practices).
- `BrandIntro` chiếm `[0, INTRO)`. Dòng đầu bắt đầu ở `INTRO + LEAD_IN`. Dòng sau = kết thúc dòng trước + `GAP_LINE` (cùng beat) hoặc + `GAP_BEAT` (sang beat mới).
- Mỗi beat: `start` = start dòng đầu, `end` = end dòng cuối + gap.
- `BrandOutro` bắt đầu ở end dòng cuối + `TAIL`. `durationInFrames` = mốc đó + `OUTRO`, làm tròn lên theo FPS.
- Output: `{ beats: [{ id, startFrame, endFrame, lines: [{ startFrame, endFrame, audioSrc }] }], durationInFrames }`.

## Bước 2 — Map script.json → màn hình

Mỗi beat là một `<Sequence>` từ `startFrame` đến `endFrame`, gồm 4 lớp:

| Trường | Hiện thế nào | Lúc nào |
|---|---|---|
| `section` | **không hiện thường trực.** Chỉ `TRONG ĐỀ THI` và `BẪY THƯỜNG GẶP` (có nghĩa với người xem) hiện thành thẻ mở beat: chữ to giữa vùng hình, ~1,2s, rồi biến mất trước khi hình chính vào. Các nhãn khác chỉ dùng nội bộ. | đầu beat |
| `visual` | vùng hình chính (chiếm phần lớn khung) | đầu beat, diễn biến theo mô tả |
| `keyword` | **câu chốt của beat**, không phải tag ở góc. Chữ to, đặt trong vùng hình cạnh trọng tâm (không che hình), giữ tới hết beat | lúc ý của beat vừa rõ, mặc định = `startFrame` dòng cuối |
| `lines[i].text` | dòng phụ đề | đúng `startFrame` của dòng i; **chỉ hiện dòng đang đọc**, dòng trước biến mất (không giữ bản mờ) |
| audio dòng i | `<Audio>` | đúng `startFrame` của dòng i |

- `text` / `keyword`: tách theo `$...$` → đoạn thường render chữ, đoạn trong `$` render KaTeX inline. Dòng chỉ có công thức → KaTeX display, cỡ lớn hơn.
- `visual`: dựng đúng mô tả. Cụm "khi đọc dòng N" → animation bắt đầu ở `startFrame` dòng N. Mô tả mơ hồ → chọn cách đơn giản nhất và ghi giả định vào báo cáo.
- Màu ghi theo vai trò ("màu nhấn", "màu cảnh báo") → lấy từ `style.md`.

## Quy tắc bố cục (bắt buộc, khung 1920×1080)

**Mọi video bọc trong `BrandFrame`** (nền, logo, thanh tiến độ theo `style.md`), có `BrandIntro` ở đầu và `BrandOutro` ở cuối.

**Các vùng cố định, không lấn sang nhau:**

| Vùng | Toạ độ y | Chứa |
|---|---|---|
| Logo | 30 – 90, x ≤ 260 | logo 9Study (do `BrandFrame` vẽ), không đặt gì khác vào đây |
| Hình | 110 – 820 | toàn bộ `visual`, câu chốt `keyword` (dải 730 – 820), thẻ mở beat, mọi nhãn/chú thích |
| Phụ đề | 860 – 1040 | một dòng `text` đang đọc |
| Thanh tiến độ | 1074 – 1080 | do `BrandFrame` vẽ |

Lề trái/phải tối thiểu 90px. Không thành phần nào của hình được thò xuống vùng phụ đề. Ngoài logo, không có tag/nhãn thường trực ở các góc.

**1. Không chồng lấn, không dính sát.**
- Hai thành phần bất kỳ (badge, nhãn, thẻ, dấu `?`, hình) không đè lên nhau và không chạm viền nhau. Khoảng hở tối thiểu **40px** giữa hai khối; nhãn gắn vào một điểm cách điểm đó 16–30px.
- Badge/chú thích của một hình (vd. "đúng một khoảnh khắc" trên đồng hồ) đặt **ngoài viền** hình đó với khoảng hở, hoặc nằm hẳn bên trong ở vùng trống, không đặt vắt ngang viền.
- Nhãn không được đè lên **số trên trục**. Điểm đánh dấu nằm trên trục (vd. nghiệm của $f'$) mà che số vạch chia → dời số đó sang phía bên kia trục hoặc ẩn số đó, không để điểm đè lên số.
- Đặt nhãn theo thứ tự ưu tiên: (a) vùng trống xa mọi đường; (b) phía lõm/ngoài của đường cong; (c) kéo ra xa và nối bằng đường dẫn mảnh. Không bao giờ đặt nhãn ngay trên đường đứt nét, đường cong hay điểm khác.
- Mọi chữ nằm trong vùng có đường vẽ đều có **viền nền** (halo) cùng màu nền, dày 6–8px (`paint-order: stroke` cho SVG, `text-shadow` nhiều lớp cho HTML), để chữ không lẫn vào nét vẽ.
- Hai nhãn cùng hiện một lúc quanh một điểm hoặc một đường dọc: tách hẳn sang hai phía, không xếp chồng.

**2. Kim, con trỏ, đường thẳng không được đè lên chữ.**
- Đồng hồ/thước đo: số ghi **ngoài** vòng vạch chia, kim **ngắn hơn** vòng vạch, nên kim không bao giờ cắt qua số. Giá trị kim chỉ được hiện rõ ở chỗ khác (số lớn giữa mặt đồng hồ).
- Đồ thị: nhãn hàm số, nhãn điểm, nhãn giá trị đặt ở vùng trống mà đường cong, tiếp tuyến, điểm di chuyển **không đi qua** trong suốt beat (kiểm theo cả quỹ đạo, không chỉ một frame).

**3. Cân bố cục theo từng thời điểm.**
- Ở mọi frame, cụm hình đang hiện phải cân trong vùng hình. Không để một nửa vùng hình trống quá ~1 giây.
- Thành phần xuất hiện muộn (thẻ, bảng, dấu `?`): thiết kế vị trí cho **trạng thái cuối** trước, rồi cho cụm đang có **dịch dần** (`interpolate`/`spring`) từ vị trí giữa sang vị trí cuối đúng lúc thành phần mới vào.
- Mỗi beat có một trọng tâm thị giác. Các thành phần phụ nhỏ hơn và ở rìa.

**4. Cỡ chữ tối thiểu.**

| Loại chữ | Tối thiểu |
|---|---|
| Phụ đề | 52px (dòng chỉ có công thức: 48px) |
| Câu chốt `keyword`, thẻ mở beat | 56px |
| Badge, nhãn, chú thích, chữ trong thẻ | 36px |
| Số trên trục, vạch chia đồng hồ | 28px |

Thiếu chỗ thì bớt chữ hoặc bớt thành phần, không thu nhỏ chữ dưới mức này.

**5. Mỗi thành phần phải có nghĩa với người xem.**
- Trước khi đặt bất kỳ thứ gì lên màn hình, trả lời: *người xem cần nó để hiểu điều gì?* Không trả lời được → bỏ.
- Không có thẻ/tag trang trí, không thẻ thông số đứng riêng một góc. Chỉ số phụ (mức phóng to, giá trị đang chạy…) chỉ dùng khi nó **gắn ngay cạnh** thứ nó mô tả (vd. "×10" sát ô kính lúp, "4,01 m/s" sát cát tuyến), và chỉ khi lời đọc đang nói tới nó.

**6. Biến đổi phải có mốc tham chiếu.**
Người xem phải nhận ra *cái gì đang thay đổi*. Nếu khung nhìn đổi mà không có mốc, hình sẽ trông như bị biến dạng.
- **Phóng to (zoom)** dựng theo kiểu **kính lúp**:
  - hình gốc giữ nguyên, đường cong vẫn cong rõ;
  - trên hình gốc có một khung nhỏ đánh dấu vùng đang soi, khung này **co dần** quanh điểm;
  - một ô phóng to lớn (kích thước cố định) nối với khung bằng hai đường dẫn, hiện nội dung bên trong khung;
  - trong ô có lưới và vạch chia ghi số, các số đổi theo mức phóng (2 → 2,1 → 2,01), mức phóng ghi sát ô.
  
  Không zoom bằng cách đổi miền vẽ của chính đồ thị mà bỏ hết trục và lưới.
- Dịch khung, đổi tỉ lệ trục: giữ trục và vạch chia có số để người xem thấy khung đang đổi chứ không phải hình đang đổi.

## Bước 3 — Cấu trúc code

```
src/components/          dùng chung: BrandFrame/BrandIntro/BrandOutro (khung 9Study),
                         SectionCard (thẻ mở beat), KeyTakeaway (câu chốt),
                         Subtitle, MathText, Axes, FunctionPlot, TangentLine, Point,
                         ZoomInset (kính lúp), ... (ưu tiên dùng lại)
src/videos/<slug>/
  script.json            (B1 — không sửa)
  timeline.ts            tính thời gian
  Video.tsx              composition, mỗi beat một component Beat01, Beat02...
src/Root.tsx             đăng ký <Composition id="<slug>" ...> 1920×1080, 30fps
```
- Toạ độ toán → pixel qua một hàm scale chung; không hardcode pixel cho điểm trên đồ thị.
- Animation chỉ dùng `useCurrentFrame()` + `interpolate` / `spring`.
- Font KaTeX và font chữ phải load xong trước khi render frame.

## Bước 4 — Kiểm tra

- `npm run lint` sạch.
- Xuất ảnh tĩnh bằng `node scripts/stills.mjs <slug> <frame...>` (bundle một lần).
- Xuất ảnh tĩnh **cho từng dòng** (frame ngay trước khi dòng kết thúc, lúc mọi thành phần của dòng đó đã hiện đủ), không chỉ giữa beat. Nhiều frame thì bundle một lần rồi gọi `renderStill` lặp lại, thay vì gọi `npx remotion still` từng frame.
- **Kiểm chồng lấn bằng code trước, mắt sau.** Mọi khối chữ trên hình (nhãn, chú thích, số trục, câu chốt) gắn `data-text`, mọi điểm đánh dấu gắn `data-mark`. Chạy `node scripts/check-layout.mjs <slug>`: script mở từng frame kiểm tra, lấy khung bao (`getBoundingClientRect`) của các phần tử đó và báo mọi cặp chồng nhau hoặc cách nhau < 16px, kèm frame và nội dung chữ. Danh sách phải rỗng mới sang bước soát bằng mắt.
- Soát từng ảnh theo **Quy tắc bố cục**: (1) có gì chồng lấn hay dính sát không; (2) kim/đường có đè lên chữ không; (3) cụm hình có cân không, có nửa khung trống không; (4) có chữ nào dưới cỡ tối thiểu không; (5) có gì lấn vùng phụ đề không; (6) có thành phần nào người xem không cần không; (7) phóng to hay dịch khung có mốc tham chiếu không. Sửa hết rồi xuất lại để kiểm.
- **Soát toán trên hình**: điểm nằm đúng trên đồ thị, hệ số góc, nghiệm, nhãn trục. Sai toán là lỗi nghiêm trọng nhất.
- Báo cáo: tổng thời lượng, các giả định khi dựng visual, chỗ cần người dùng xem.

## Bước 5 — Render (khi người dùng duyệt trong Studio)

```
npx remotion render <slug> out/<slug>.mp4
```

## Không được

- Sửa `script.json` hay file audio. Thấy sai → báo, quay lại B1/B2.
- Tự đặt thời gian cho dòng thay vì lấy từ độ dài audio.
