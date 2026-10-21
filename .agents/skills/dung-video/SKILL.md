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
| `style.md` (gốc project) | người dùng | màu, font, layout theo brand 9Study (nền sáng); token ở `src/components/theme.ts` |
| `src/videos/<slug>/FEEDBACK.md` | người dùng | nếu có: đang sửa theo góp ý — sửa **mọi** mục chưa ✅ một lần, cập nhật cột "đã sửa video" |

`speak` **không** dùng ở B3 (chỉ dành cho TTS). Trên màn hình luôn hiện `text`.

## Bước 0 — Kiểm tra đầu vào (dừng nếu lỗi)

- Hai file JSON tồn tại và parse được.
- Mỗi dòng trong `script.json` có đúng một mục trong manifest (khớp `beat` + `line`), và file mp3 tồn tại.
- `text` trong manifest khớp `text` trong script. Lệch → kịch bản đã sửa sau khi tạo audio → **yêu cầu chạy lại B2**, không tự đoán thời gian.
- Thiếu file nào thì liệt kê đủ rồi dừng.
- **Đọc lướt `visual` cả bài trước khi dựng** theo quy tắc 8–10 dưới đây. Lỗi cấu trúc (nhiều thay đổi dồn một dòng, số đổi mà hình không đổi, nhân vật không vai trò, khái niệm dùng trước khi dạy, bảng xét dấu…) → báo người dùng **trước** khi dựng, không dựng xong mới báo.

## Bước 1 — Timeline

Dùng chung `buildTimeline` trong `src/components/timeline.ts` (đo mp3, đối chiếu manifest, tính frame). `src/videos/<slug>/timeline.ts` chỉ bọc lại thành `calculateMetadata` (mẫu: `src/videos/don-dieu/timeline.ts`). Không viết lại bộ đo.

Hằng số (ở đầu `src/components/timeline.ts`):
```
FPS = 30, INTRO = 1.6s, LEAD_IN = 0.3s, GAP_LINE = 0.25s, GAP_BEAT = 0.6s, TAIL = 1.0s, OUTRO = 2.5s
```
- `BrandIntro` chiếm `[0, INTRO)`. Dòng đầu bắt đầu ở `INTRO + LEAD_IN`. Dòng sau = kết thúc dòng trước + `GAP_LINE` (cùng beat; beat có `lineGap` thì dùng giá trị đó) hoặc + `GAP_BEAT` (sang beat mới).
- `BrandOutro` bắt đầu ở end dòng cuối + `TAIL`. `durationInFrames` = mốc đó + `OUTRO`.
- Trường `speed` của beat chỉ ảnh hưởng B2 (độ dài audio); B3 không cần làm gì thêm.

## Bước 2 — Map script.json → màn hình

Mỗi beat là một `<Sequence>` từ `startFrame` đến `endFrame`, gồm 4 lớp:

| Trường | Hiện thế nào | Lúc nào |
|---|---|---|
| `section` | **không hiện thường trực.** Chỉ `TRONG ĐỀ THI`, `BẪY THƯỜNG GẶP` và `GIẢI ĐÁP` (có nghĩa với người xem) hiện thành thẻ mở beat: chữ to giữa vùng hình, ~1,2s, rồi biến mất trước khi hình chính vào. Các nhãn khác chỉ dùng nội bộ. | đầu beat |
| `visual` | vùng hình chính (chiếm phần lớn khung) | đầu beat, diễn biến theo mô tả |
| `keyword` | **câu chốt của beat**, không phải tag ở góc. Chữ to, đặt trong vùng hình cạnh trọng tâm (không che hình), giữ tới hết beat | lúc ý của beat vừa rõ, mặc định = `startFrame` dòng cuối |
| `lines[i].text` | dòng ghi chú ngắn (không phải bản chép lời đọc); `""` → không hiện gì | đúng `startFrame` của dòng i; **chỉ hiện dòng đang đọc**, dòng trước biến mất (không giữ bản mờ) |
| audio dòng i | `<Audio>` | đúng `startFrame` của dòng i |

- `text` / `keyword`: tách theo `$...$` → đoạn thường render chữ, đoạn trong `$` render KaTeX inline. Dòng chỉ có công thức → KaTeX display, cỡ lớn hơn.
- `visual`: dựng đúng mô tả. Cụm "khi đọc dòng N" → animation bắt đầu ở `startFrame` dòng N. Mô tả mơ hồ → chọn cách đơn giản nhất và ghi giả định vào báo cáo.
- `visual` vi phạm quy tắc 8–10 dưới đây: nhãn dài → tự rút gọn theo quy tắc 8 và ghi vào báo cáo; còn nhiều thay đổi dồn vào một dòng, số đổi mà hình không có gì đổi theo, nhân vật không có vai trò → **báo người dùng để sửa ở B1** (vì phải chia lại dòng/lời đọc), không tự dựng cho đủ.
- Beat `GIẢI ĐÁP` dùng lại đúng hình của beat `HIỆN TƯỢNG` (cùng component, cùng bố cục) rồi thêm lớp giải thích lên trên, để người xem nhận ra ngay "đây là câu hỏi lúc đầu".
- **Kết có cảm giác kết**: đáp án cụ thể của câu hỏi mở đầu (con số) hiện to, rõ ở trọng tâm hình. Trong dòng cuối, hình **đứng yên** (không chuyển động mới), chỉ câu kết luận/`keyword` hiện lên; giữ nguyên khung đó hết `TAIL` rồi mới sang `BrandOutro`. Không cắt sang outro khi hình còn đang chạy.
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

Vật minh hoạ cũng có cỡ tối thiểu: vật chính (người chạy, quả bóng…) cao ≥ 140px, vật phụ (xe đạp, biểu tượng) ≥ 100px, đủ để nhận ra trong một cái liếc. Không đủ chỗ cho cỡ đó → bỏ vật phụ, không vẽ bé.

**5. Mỗi thành phần phải có nghĩa với người xem.**
- Trước khi đặt bất kỳ thứ gì lên màn hình, trả lời: *người xem cần nó để hiểu điều gì?* Không trả lời được → bỏ.
- Không có thẻ/tag trang trí, không thẻ thông số đứng riêng một góc. Chỉ số phụ (mức phóng to, giá trị đang chạy…) chỉ dùng khi nó **gắn ngay cạnh** thứ nó mô tả (vd. "×10" sát ô kính lúp, "4,01 m/s" sát cát tuyến), và chỉ khi lời đọc đang nói tới nó.

**6. Biến đổi phải có mốc tham chiếu.**
Người xem phải nhận ra *cái gì đang thay đổi*. Nếu khung nhìn đổi mà không có mốc, hình sẽ trông như bị biến dạng.
- **Phóng to (zoom)** dựng theo kiểu **kính lúp** (dùng nó mỗi khi giải thích tiếp tuyến, giới hạn, "rất gần"):
  - hình gốc giữ nguyên, đường cong vẫn cong rõ;
  - trên hình gốc có một khung nhỏ đánh dấu vùng đang soi, khung này **co dần** quanh điểm;
  - một ô phóng to lớn (kích thước cố định) nối với khung bằng hai đường dẫn, hiện nội dung bên trong khung;
  - trong ô có lưới và vạch chia ghi số, các số đổi theo mức phóng (2 → 2,1 → 2,01), mức phóng ghi sát ô.
  
  Không zoom bằng cách đổi miền vẽ của chính đồ thị mà bỏ hết trục và lưới.
- Dịch khung, đổi tỉ lệ trục: giữ trục và vạch chia có số để người xem thấy khung đang đổi chứ không phải hình đang đổi.

**7. Mọi thứ trên màn hình đều có chú thích.**
Phép thử: **tắt tiếng, chỉ nhìn khung hình**, người xem vẫn biết từng con số, ký hiệu, hình là gì. Không biết → thiếu chú thích.
- Trục, thước đo: tên đại lượng + đơn vị ở đầu trục ("quãng đường $s$ (m)", "thời gian $t$ (s)"), không chỉ "m" hay "s".
- Con số hiện trên hình (nhãn, ô bảng, giá trị đang chạy): có đơn vị nếu kịch bản dùng đơn vị (mô hình toán có thể là số trơn, không đơn vị — skill `viet-kich-ban` › `text`); tên đại lượng ở tiêu đề cột ("Vận tốc trung bình (m/s)", không chỉ "Trung bình") hoặc bằng ký hiệu đã chú giải ($v$, $\Delta t$), **không viết lại cả cụm tên ở mỗi nhãn** (quy tắc 8).
- Công thức xuất hiện lần đầu: ký hiệu được chú giải bằng cụm đọc lên có nghĩa (tên trục "quãng đường $s$ (m)", hoặc "$s$ là quãng đường"). Không dùng chú giải viết tắt kiểu "$s$: m · $t$: s".
- Đoạn tô màu, mũi tên, vạch nhấn: có nhãn nói nó biểu diễn gì ("rơi thêm 15 m trong 1 s"). Màu dùng lại ở beat sau với cùng nghĩa thì giữ cùng màu.
- Điểm, vật minh hoạ (quả bóng ở các thời điểm): mỗi cái cần thiết có nhãn; vật trùng hoặc quá gần nhau thì bỏ bớt hoặc dàn ra, không xếp chồng — mọi vật này cũng gắn `data-mark` để `check-layout` bắt được chồng lấn.
- Chú thích tuân theo quy tắc 1 (không đè, có halo) và quy tắc 4 (cỡ chữ tối thiểu). Thiếu chỗ → bớt thành phần, không bỏ chú thích.
- `visual` trong kịch bản thiếu chú thích cho một thành phần → vẫn thêm chú thích theo đúng toán, ghi vào báo cáo; thấy cần đổi `text` thì báo người dùng (không tự sửa kịch bản).

**8. Ít chữ trên hình.** Người xem nhìn hình, không phải đọc.
- Nhãn ≤ ~5 từ, ưu tiên ký hiệu/số + đơn vị/mũi tên: "0,81 s · 44 km/h", không phải "đoạn 60 → 70 m: 0,81 s · tốc độ ≈ 44 km/h".
- **Không lặp thứ đã nhìn thấy**: vạch chia đã ghi 60, 70 thì nhãn đoạn tô không ghi lại "60 → 70 m"; phụ đề đã ghi số thì nhãn trên hình không ghi lại số đó (và ngược lại). Một thông tin — một chỗ.
- **Gỡ thông tin hết vai trò**: badge/nhãn lời đọc không còn nói tới (vd. "vận tốc trung bình cả bài" khi đã sang đoạn 60–70 m) mờ đi trong ~0,5 s. Chỉ giữ thứ đang nói tới và mốc tham chiếu cần thiết.
- **Chữ nằm gọn trong khung chứa** của nó (thẻ, ô bảng, khung hình bên trái…), không tràn ra ngoài viền. Nhãn dài hơn khung → rút chữ hoặc đặt nhãn ra ngoài khung hẳn, có đường dẫn.
- Đếm nhanh mỗi frame: ngoài phụ đề và câu chốt, chữ mới xuất hiện trong dòng đang đọc ≤ ~8 từ.

**9. Nhịp hình: một thay đổi mỗi lần, và thay đổi là lời giải thích.**
- Mỗi dòng **tối đa một thay đổi chính** trên hình. Thay đổi vào trong 0,5–1 s đầu dòng rồi **đứng yên** để người xem nhìn; không xếp nhiều điểm/hàng/nhãn hiện nối nhau trong một dòng.
- **Số đổi ⇔ hình đổi, cùng lúc**: bảng nhảy sang hàng mới thì vạch/đoạn tô tương ứng trên hình co lại (hoặc giãn ra) đúng lúc đó, nhãn số đi theo vạch; con số mới phải trông như *sinh ra* từ chuyển động trên hình (đoạn co lại → giá trị chạy tới số mới), không tự hiện ở một chỗ khác.
- Không mở một hình biểu diễn mới (trục số, bảng, đồ thị khác) khi hình đang có biểu diễn được điều đó. Cần hình mới thì nối với hình cũ bằng bước người xem tự hiểu (lấy số từ hình cũ → bảng nhỏ → chấm từng điểm → nối đồ thị), hình cũ vẫn thấy trong lúc nối.
- **Không dùng phép biến hình lạ mắt** (xoay đường chạy thành trục, nhân vật nằm ngang, gập/cuộn hình). Đã thử 20/10/2026: người xem không hiểu. Trục, đồ thị, nhân vật luôn ở tư thế quen thuộc.

**10. Nhân vật do toán điều khiển; công thức chỉ lên hình.**
- Nhân vật/vật minh hoạ (người chạy, flycam…) chỉ có mặt khi biểu diễn một đại lượng: vị trí = $f(x)$ (qua hàm scale chung), tốc độ chuyển động tỉ lệ với $f'(x)$, $f' = 0$ → đứng yên, $f'$ đổi dấu → quay đầu (lật hình). Nhãn nói rõ nó là gì ("người chạy: vị trí = $f(x)$"). Không có nhân vật đứng trên đồ thị cho vui.
- Đồ thị $f'$ (dạng bài đề thi) đi kèm nhân vật của ví dụ xuyên suốt, di chuyển theo $f'$ khi điểm quét chạy trên đồ thị: nhanh nhất ở đỉnh $f'$, chậm dần về 0, dừng rồi quay đầu khi $f'$ đổi dấu, dừng mà không quay đầu khi $f'$ chạm trục không đổi dấu.
- **Từ $f'$ sang $f$**: hai tầng, $f$ trên, $f'$ dưới, **cùng tỉ lệ trục ngang, thẳng hàng theo chiều dọc**; mỗi khoảng: đoạn $f'$ trên/dưới trục và đoạn $f$ tương ứng sáng cùng màu (leo/hạ), trên đoạn $f$ có hai điểm so sánh (sau cao hơn/thấp hơn trước).
- Bảng xét dấu, bảng biến thiên không dựng (kiến thức bài khác — skill `viet-kich-ban` › Phạm vi kiến thức); dấu của $f'$ thể hiện bằng tô màu trên đồ thị.
- **Giải phẫu công thức**: khi lời đọc giải thích một cụm trong công thức, cụm đó trên công thức và thứ tương ứng trên hình **cùng sáng lên một màu**, các phần khác mờ đi. Công thức và hình phải cùng nằm trên màn hình lúc đó (công thức thu nhỏ ở cạnh, không thay hẳn hình).
- **Dựng phép tính từ thành phần, không nhảy bước**: hiệu $f(x)-f(x_0)$ chỉ hiện sau khi hai **cột dọc** $f(x_0)$ và $f(x)$ (từ trục ngang lên đồ thị, có số) đã hiện và được nói riêng; khi tới phép trừ, kẻ ngang từ đỉnh cột thấp sang cột cao, phần chênh sáng lên. Tương tự $x - x_0$ là khoảng giữa hai chân cột. Không vẽ một đoạn ngắn lơ lửng mà người xem không biết nó từ đâu ra.
- **Khái niệm hình học mới hiện riêng trước khi dùng**: cát tuyến (đường qua hai điểm của đồ thị, hai điểm sáng lên trước), độ dốc (tam giác ngang–dọc có số), tiếp tuyến dạy bằng **kính lúp** (quy tắc 6): phóng to quanh điểm tới khi đồ thị trông thẳng, đường thẳng đó là tiếp tuyến.

## Bước 3 — Cấu trúc code

```
src/components/          dùng chung (ưu tiên dùng lại):
  BrandFrame.tsx         BrandFrame, BrandIntro, BrandOutro (khung 9Study)
  BeatShell.tsx          BeatShell (thẻ mở beat + câu chốt + phụ đề cho một beat), ramp, clamp
  timeline.ts            buildTimeline, hằng số nhịp
  plot.tsx               makeScale, Plot, Axes, FunctionPlot, Point, Segment, TangentLine, PlotLabel
  ZoomInset.tsx          kính lúp; MathText.tsx: MathText, Tex, useKatexFonts
  Card, KeyTakeaway, SectionCard, Subtitle, Speedometer, theme.ts (màu, cỡ chữ, halo)
src/videos/<slug>/
  script.json            (B1 — không sửa)
  timeline.ts            bọc buildTimeline thành calculateMetadata
  Video.tsx              composition; beats.tsx mỗi beat một component; scene.tsx hình riêng của video
src/Root.tsx             đăng ký <Composition id="<slug>" ...> 1920×1080, 30fps
```
- Trước khi viết component mới, xem `src/components/` **và thư mục các video trước** (`ban-chat-dao-ham/parts.tsx`: người chạy, đường chạy, đồng hồ bấm giờ; `ban-chat-dao-ham/graph.tsx`: đồ thị mô hình, cát tuyến, tam giác độ dốc; `don-dieu/scene.tsx`: flycam trên đồi, đồ thị hai tầng, cột dọc, mũi tên dọc đường cong, thẻ bên phải). Thứ đã dùng ở video trước và cần lại (vd. `Tag`, `label`, `lerp`, bảng màu vai trò `C` đang chép ở cả hai video) → chuyển sang `src/components/` rồi import, không chép lần ba.
- Toạ độ toán → pixel qua một hàm scale chung (`makeScale`); không hardcode pixel cho điểm trên đồ thị.
- Animation chỉ dùng `useCurrentFrame()` + `interpolate` / `spring`.
- Font KaTeX và font chữ phải load xong trước khi render frame.

## Bước 4 — Kiểm tra

- `npm run lint` sạch.
- Xuất ảnh tĩnh bằng `node scripts/stills.mjs <slug> <frame...>` (bundle một lần).
- Xuất ảnh tĩnh **cho từng dòng** (frame ngay trước khi dòng kết thúc, lúc mọi thành phần của dòng đó đã hiện đủ), không chỉ giữa beat. Nhiều frame thì bundle một lần rồi gọi `renderStill` lặp lại, thay vì gọi `npx remotion still` từng frame.
- **Kiểm chồng lấn bằng code trước, mắt sau.** Mọi khối chữ trên hình (nhãn, chú thích, số trục, câu chốt) gắn `data-text`, mọi điểm đánh dấu gắn `data-mark`. Chạy `node scripts/check-layout.mjs <slug>`: script mở từng frame kiểm tra, lấy khung bao (`getBoundingClientRect`) của các phần tử đó và báo mọi cặp chồng nhau hoặc cách nhau < 16px, kèm frame và nội dung chữ; khung chứa (thẻ, ô bảng, `Card`) gắn `data-box`, script báo mọi `data-text` nằm trong `data-box` mà tràn ra ngoài viền, và mọi chữ/điểm **bên ngoài** chạm vào khung đó (đã gặp: nhãn đồ thị chạm mép thẻ bảng mà không bị bắt). Danh sách phải rỗng mới sang bước soát bằng mắt.
- Soát từng ảnh theo **Quy tắc bố cục**: (1) có gì chồng lấn hay dính sát không; (2) kim/đường có đè lên chữ không; (3) cụm hình có cân không, có nửa khung trống không; (4) có chữ nào dưới cỡ tối thiểu không; (5) có gì lấn vùng phụ đề không; (6) có thành phần nào người xem không cần không; (7) phóng to hay dịch khung có mốc tham chiếu không; (8) **phép thử tắt tiếng**: mỗi con số, ký hiệu, màu, vật trên ảnh có chú thích nói nó là gì không; (9) **ít chữ**: nhãn nào dài quá ~5 từ, lặp phụ đề hoặc lặp số trên trục, chữ nào tràn khỏi khung chứa, thông tin nào đã hết vai trò mà còn; (10) **nhịp**: so ảnh giữa dòng với ảnh cuối dòng — có quá một thay đổi không, số đổi mà hình có đổi theo không; vật minh hoạ đủ lớn chưa; (11) nhân vật có chuyển động đúng theo hàm không, cụm công thức đang giải thích có sáng cùng màu với thứ trên hình không. Sửa hết rồi xuất lại để kiểm.
- **Soát toán trên hình**: điểm nằm đúng trên đồ thị, hệ số góc, nghiệm, nhãn trục. Sai toán là lỗi nghiêm trọng nhất.
- **Thời lượng**: tổng phải nằm trong 2:30 – 4:00. Lệch → báo người dùng, đề xuất quay lại B1 (không kéo giãn khoảng nghỉ để bù).
- Báo cáo: tổng thời lượng, các giả định khi dựng visual, chú thích đã tự thêm, chỗ cần người dùng xem.

## Bước 5 — Xem trước, rồi render

- Người dùng muốn xem nhanh ("demo", "chưa cần render") → mở Remotion Studio (`preview_start` với cấu hình `remotion-studio` trong `.claude/launch.json`) ở trang composition, không render.
- Render khi người dùng bảo, **chạy nền và ghi tiến độ ra file** để trả lời được "đến đâu rồi":
  ```
  npx remotion render <id> out/<id>.mp4 > <scratchpad>/render-<id>.log 2>&1
  ```
  Không dùng `--log=error` (mất dòng tiến độ). Hỏi tiến độ → đọc dòng cuối của log (frame đã render / tổng), báo phần trăm và thời gian còn lại ước tính.
- Mốc thời gian (máy người dùng, 21/10/2026): video 3:53 (≈ 7000 frame) render ≈ 14–15 phút; 2:49 ≈ 6–8 phút. Báo mốc này lúc bắt đầu render.
- Xong: đo thời lượng file bằng `ffprobe`, gửi file cho người dùng. `out/` bị gitignore, không commit video.

## Bản giọng khác (không thay bản cũ)

Audio của bản giọng khác nằm ở `public/audio/<slug>-<hậu tố>/` (skill `tao-audio` › Bản giọng khác). Dựng thêm composition, không chép code beat:
- `calculateMetadata` nhận prop `audioDir` và gọi `buildTimeline(script, props.audioDir)` (mặc định = slug).
- Đăng ký thêm `<Composition id="<slug>-<hậu tố>" defaultProps={{ timeline: null, audioDir: "<slug>-<hậu tố>" }} …/>` cạnh composition gốc, cùng component (mẫu: `src/videos/ban-chat-dao-ham/Video.tsx`).
- Chạy `check-layout` cho id mới (nhịp đọc khác → mốc dòng khác), render ra `out/<slug>-<hậu tố>.mp4`.

## Không được

- Sửa `script.json` hay file audio. Thấy sai → báo, quay lại B1/B2.
- Tự đặt thời gian cho dòng thay vì lấy từ độ dài audio.
