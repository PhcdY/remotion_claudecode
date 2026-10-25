---
name: dung-video
description: B3 của pipeline video giải thích bản chất (mọi môn) — dựng video Remotion từ script.json (B1) — bản nháp + storyboard trước khi có audio, rồi hoàn thiện theo audio trong public/audio/<slug>/ (B2). Dùng khi kịch bản đã chốt và cần dựng/storyboard/sửa/render video, hoặc gõ /dung-video <slug>.
---

# B3 — Dựng video Remotion

Luôn dùng kèm skill `remotion-best-practices` cho mọi chi tiết API Remotion (đo audio, font, Sequence, render…).
Đọc gói môn `.claude/mon/<subject>.md` (trường `subject` của `script.json`, thiếu = `toan`), mục "Mẫu dựng khái niệm" và "Dựng hình": hình chuẩn và component có sẵn của môn đó.
Mục tiêu duy nhất là trải nghiệm người xem; lý do của từng luật ở `.claude/lessons.md`.

**Thứ tự (video mới):** B1 chốt kịch bản → **B3 nháp**: dựng hình với thời gian ước tính, xuất storyboard, người dùng duyệt hình (Bước 2b) → B2 tạo audio → **B3 hoàn thiện**: thời gian thật, `check-layout`, render. Sửa hình hoặc chữ ở storyboard thì chưa tốn credit giọng đọc; sửa sau B2 thì phải tạo lại audio dòng đó.

## Đầu vào (contract với B1, B2)

| File | Từ | Dùng để |
|---|---|---|
| `src/videos/<slug>/script.json` | B1 | nội dung: section, keyword, visual, lines[].text |
| `public/audio/<slug>/manifest.json` | B2 | thứ tự + tên file audio từng dòng (chưa cần ở bản nháp) |
| `public/audio/<slug>/<beatId>-lNN.mp3` | B2 | giọng đọc; **độ dài file quyết định thời gian** (bản nháp: ước tính theo số chữ) |
| `style.md` (gốc project) | người dùng | màu, font, layout theo brand 9Study (nền sáng); token ở `src/components/theme.ts` |
| `src/videos/<slug>/FEEDBACK.md` | người dùng | nếu có: đang sửa theo góp ý — sửa **mọi** mục chưa ✅ một lần, cập nhật cột "đã sửa video" |

`speak` **không** dùng trên hình (chỉ cho TTS và file phụ đề). Trên màn hình chỉ hiện `text`, `keyword` và chữ ghi trong `visual`.

## Bước 0 — Kiểm tra đầu vào (dừng nếu lỗi)

- `python scripts/check_script.py <slug>` không có lỗi.
- Bản nháp (chưa có audio) chỉ cần bước trên và bước đọc lướt `visual` cuối mục này; các bước manifest dưới đây làm ở bản hoàn thiện.
- Hai file JSON tồn tại và parse được.
- Mỗi dòng trong `script.json` có đúng một mục trong manifest (khớp `beat` + `line`), và file mp3 tồn tại.
- `text` trong manifest khớp `text` trong script. Lệch → kịch bản đã sửa sau khi tạo audio → **yêu cầu chạy lại B2**, không tự đoán thời gian.
- Thiếu file nào thì liệt kê đủ rồi dừng.
- **Đọc lướt `visual` cả bài trước khi dựng** theo quy tắc 8–10 dưới đây. Lỗi cấu trúc (nhiều thay đổi dồn một dòng, số đổi mà hình không đổi, nhân vật không vai trò, khái niệm dùng trước khi dạy, bảng xét dấu…) → báo người dùng **trước** khi dựng, không dựng xong mới báo.

## Bước 1 — Timeline

Video mới dùng `ExplainerVideo` + `explainerMetadata(script)` (`src/components/ExplainerVideo.tsx`, mẫu: `src/videos/lab-thanh-phan/Video.tsx`): gọi `buildTimeline` (đo mp3, đối chiếu manifest, tính frame), nối các beat, audio, intro/outro, cảnh liền mạch. Prop `draft: true` → timeline nháp: mỗi dòng dài ≈ số ký tự `speak` / 20 giây, không có audio, góc phải có nhãn "NHÁP". Không viết lại bộ đo. (Video cũ giữ `Video.tsx` + `timeline.ts` riêng.)

Hằng số (ở đầu `src/components/timeline.ts`):
```
FPS = 30, INTRO = 1.6s, LEAD_IN = 0.3s, GAP_LINE = 0.25s, GAP_BEAT = 0.6s, TAIL = 1.0s, OUTRO = 2.5s
```
- `BrandIntro` chiếm `[0, INTRO)`. Dòng đầu bắt đầu ở `INTRO + LEAD_IN`. Dòng sau = kết thúc dòng trước + `pauseAfter` của dòng trước (nếu có, ≤ 2 s) + `GAP_LINE` (cùng beat; beat có `lineGap` thì dùng giá trị đó) hoặc + `GAP_BEAT` (sang beat mới).
- Khoảng `pauseAfter` (sau câu hỏi đoán): hình chỉ làm sáng lần lượt các khả năng đang hỏi, không lộ đáp án; đáp án vào ở đầu dòng sau.
- `BrandOutro` bắt đầu ở end dòng cuối + `TAIL`. `durationInFrames` = mốc đó + `OUTRO`.
- Trường `speed` của beat chỉ ảnh hưởng B2 (độ dài audio); B3 không cần làm gì thêm.

## Bước 2 — Map script.json → màn hình

Mỗi beat là một `<Sequence>` từ `startFrame` đến `endFrame`, gồm 4 lớp:

| Trường | Hiện thế nào | Lúc nào |
|---|---|---|
| `section` | **không hiện thường trực.** Chỉ `TRONG ĐỀ THI`, `BẪY THƯỜNG GẶP` và `GIẢI ĐÁP` (có nghĩa với người xem) hiện thành thẻ mở beat: chữ to giữa vùng hình, ~1,2s, rồi biến mất trước khi hình chính vào. Các nhãn khác chỉ dùng nội bộ. | đầu beat |
| `scene` + `visual` | cảnh, bố cục, thành phần của beat | đầu beat |
| `lines[i].show` (+ `cue`) | **thay đổi duy nhất** trên hình ở dòng i | bắt đầu ở `C[i]` (lúc giọng nói tới cụm `cue`; không có `cue` thì đầu dòng), vào trong 0,5–1 s rồi đứng yên |
| `keyword` | **câu chốt của beat**, không phải tag ở góc. Chữ to, dải dưới cùng vùng hình (không che hình), giữ tới hết beat | lúc ý của beat vừa rõ, mặc định = `startFrame` dòng cuối |
| `lines[i].text` + `at` | **chữ trong cảnh**: nhãn/công thức/kết quả gắn vào vật ghi ở `at`, đặt bằng `AutoLabels` (quy tắc 12) hoặc trong thẻ/công thức đang có; `""` → dòng không thêm chữ | vào đúng `startFrame` của dòng i; ở lại khi còn được nói tới, mờ đi khi hết vai trò |
| audio dòng i | `<Audio>` | đúng `startFrame` của dòng i |

**Chữ trong cảnh (video mới):** `BeatShell subtitle={false}` — không dải phụ đề ở đáy; vùng hình kéo tới y = 1040, câu chốt ở dải 950–1040. Lý do: người xem hiểu tốt hơn khi chữ nằm sát hình liên quan và màn hình không in lại câu đang đọc; dải ghi chú tách khỏi hình làm chữ lúc nhiều lúc ít, mắt phải nhảy qua lại. Phụ đề đầy đủ xuất thành file riêng (Bước 5). Các video dựng trước 23/10/2026 giữ chế độ cũ (`Subtitle`), chỉ đổi khi người dùng bảo dựng lại.
Kịch bản cũ không có `at` → đặt `text` cạnh thứ sinh ra con số/kết luận đó, ghi giả định vào báo cáo.

**Hình đổi đúng lúc lời nói tới (`cue`):** beat nhận `C[i]` = frame giọng bắt đầu nói cụm `cue` của dòng i (bằng `L[i]` nếu dòng không có `cue`) và hàm `cue(i, "cụm")` cho cụm bất kỳ trong dòng — dùng `C[i]` thay `L[i]` làm mốc cho thay đổi của `show`. Mốc từng từ lấy từ `public/audio/<dir>/words.json` (`python scripts/align_words.py <slug> [--audio-dir <dir>]`, chạy sau mỗi lần tạo/sửa audio); thiếu file hoặc bản nháp thì ước tính theo số âm tiết. Cách căn: dò khoảng lặng trong audio (ffmpeg) ở chỗ có dấu câu, chia đều âm tiết giữa các khoảng lặng — sai số ~0,1–0,3 s; thấy lệch rõ khi xem thì báo người dùng (có thể nâng lên nhận dạng giọng nói Whisper, phải tải model ~470MB).

**Cảnh liền mạch:** beat liền nhau cùng `scene` thì hình **không mờ đi rồi hiện lại** ở ranh giới (`ExplainerVideo` tự lo bằng `BeatShell sceneIn/sceneOut`); chỉ câu chốt của beat cũ mờ đi. Vì vậy frame đầu của beat sau phải vẽ **đúng** trạng thái cuối của beat trước: dựng mỗi cảnh thành một component dùng chung cho các beat của cảnh đó, mỗi beat truyền trạng thái (mẫu: `Scene1` trong `lab-thanh-phan`). Vật đã có trên sân khấu thì ở lại và biến đổi (dịch, đổi màu, mờ bớt), không xoá đi vẽ lại. Đổi cảnh (khác `scene`) mới mờ hẳn.

- `text` / `keyword`: tách theo `$...$` → đoạn thường render chữ, đoạn trong `$` render KaTeX inline. Dòng chỉ có công thức → KaTeX display, cỡ lớn hơn.
- `visual`: dựng đúng mô tả. Cụm "khi đọc dòng N" → animation bắt đầu ở `startFrame` dòng N. Mô tả mơ hồ → chọn cách đơn giản nhất và ghi giả định vào báo cáo.
- `visual` vi phạm quy tắc 8–10 dưới đây: nhãn dài → tự rút gọn theo quy tắc 8 và ghi vào báo cáo; còn nhiều thay đổi dồn vào một dòng, số đổi mà hình không có gì đổi theo, nhân vật không có vai trò → **báo người dùng để sửa ở B1** (vì phải chia lại dòng/lời đọc), không tự dựng cho đủ.
- Beat `GIẢI ĐÁP` dùng lại đúng hình của beat `HIỆN TƯỢNG` (cùng component, cùng bố cục) rồi thêm lớp giải thích lên trên, để người xem nhận ra ngay "đây là câu hỏi lúc đầu".
- **Kết có cảm giác kết**: đáp án cụ thể của câu hỏi mở đầu (con số) hiện to, rõ ở trọng tâm hình. Trong dòng cuối, hình **đứng yên** (không chuyển động mới), chỉ câu kết luận/`keyword` hiện lên; giữ nguyên khung đó hết `TAIL` rồi mới sang `BrandOutro`. Không cắt sang outro khi hình còn đang chạy.
- Màu ghi theo vai trò → `role` trong `src/components/roles.ts` (quy tắc 11).

## Quy tắc bố cục (bắt buộc, khung 1920×1080)

**Mọi video bọc trong `BrandFrame`** (nền, logo, thanh tiến độ theo `style.md`), có `BrandIntro` ở đầu và `BrandOutro` ở cuối.

**Các vùng cố định, không lấn sang nhau:**

| Vùng | Toạ độ y | Chứa |
|---|---|---|
| Logo | 30 – 90, x ≤ 260 | logo 9Study (do `BrandFrame` vẽ), không đặt gì khác vào đây |
| Hình | 110 – 1040 | toàn bộ `visual`, `text` từng dòng, thẻ mở beat, mọi nhãn/chú thích; câu chốt `keyword` ở dải 950 – 1040 |
| Thanh tiến độ | 1074 – 1080 | do `BrandFrame` vẽ |

(Video cũ, chế độ `Subtitle`: hình 110 – 820, câu chốt 730 – 820, phụ đề 860 – 1040.)
Lề trái/phải tối thiểu 90px. Ngoài logo, không có tag/nhãn/cột chữ thường trực — cả khung là sân khấu của hình.

**1. Không chồng lấn, không dính sát.**
- Hai thành phần bất kỳ (badge, nhãn, thẻ, dấu `?`, hình) không đè lên nhau và không chạm viền nhau. Khoảng hở tối thiểu **40px** giữa hai khối; nhãn gắn vào một điểm cách điểm đó 16–30px.
- Badge/chú thích của một hình (vd. "đúng một khoảnh khắc" trên đồng hồ) đặt **ngoài viền** hình đó với khoảng hở, hoặc nằm hẳn bên trong ở vùng trống, không đặt vắt ngang viền.
- Nhãn không được đè lên **số trên trục**. Điểm đánh dấu nằm trên trục (vd. nghiệm của $f'$) mà che số vạch chia → dời số đó sang phía bên kia trục hoặc ẩn số đó, không để điểm đè lên số.
- Đặt nhãn theo thứ tự ưu tiên: (a) vùng trống xa mọi đường; (b) phía lõm/ngoài của đường cong; (c) kéo ra xa và nối bằng đường dẫn mảnh. Không bao giờ đặt nhãn ngay trên đường đứt nét, đường cong hay điểm khác. Nhãn gắn vào một điểm thì dùng `AutoLabels` (quy tắc 12), không tự đặt toạ độ.
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
| Câu chốt `keyword`, thẻ mở beat | 56px |
| `text` của dòng (kết quả chính đặt trong cảnh) | 44px |
| Phụ đề (chỉ video cũ) | 52px (dòng chỉ có công thức: 48px) |
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
- Con số hiện trên hình: theo skill `viet-kich-ban` › Số và đơn vị — đơn vị nói một lần ở tên trục/tiêu đề cột/câu "($t$ tính bằng giây)", số sát trục và ô bảng không lặp đơn vị; số đứng riêng (kết quả, đáp án, số liệu thật) luôn kèm đơn vị, số và đơn vị liền nhau, cách một khoảng trắng; đơn vị viết ngoài KaTeX cho cùng font. Tên đại lượng ở tiêu đề cột ("Vận tốc trung bình (m/s)", không chỉ "Trung bình") hoặc bằng ký hiệu đã chú giải ($v$, $\Delta t$), **không viết lại cả cụm tên ở mỗi nhãn** (quy tắc 8).
- Công thức xuất hiện lần đầu: ký hiệu được chú giải bằng cụm đọc lên có nghĩa (tên trục "quãng đường $s$ (m)", hoặc "$s$ là quãng đường"). Không dùng chú giải viết tắt kiểu "$s$: m · $t$: s".
- Đoạn tô màu, mũi tên, vạch nhấn: có nhãn nói nó biểu diễn gì ("rơi thêm 15 m trong 1 s"). Màu dùng lại ở beat sau với cùng nghĩa thì giữ cùng màu.
- Điểm, vật minh hoạ (quả bóng ở các thời điểm): mỗi cái cần thiết có nhãn; vật trùng hoặc quá gần nhau thì bỏ bớt hoặc dàn ra, không xếp chồng — mọi vật này cũng gắn `data-mark` để `check-layout` bắt được chồng lấn.
- Chú thích tuân theo quy tắc 1 (không đè, có halo) và quy tắc 4 (cỡ chữ tối thiểu). Thiếu chỗ → bớt thành phần, không bỏ chú thích.
- `visual` trong kịch bản thiếu chú thích cho một thành phần → vẫn thêm chú thích theo đúng toán, ghi vào báo cáo; thấy cần đổi `text` thì báo người dùng (không tự sửa kịch bản).

**8. Ít chữ trên hình.** Người xem nhìn hình, không phải đọc.
- Nhãn ≤ ~5 từ, ưu tiên ký hiệu/số + đơn vị/mũi tên: "0,81 s · 44 km/h", không phải "đoạn 60 → 70 m: 0,81 s · tốc độ ≈ 44 km/h".
- **Không lặp thứ đã nhìn thấy**: vạch chia đã ghi 60, 70 thì nhãn đoạn tô không ghi lại "60 → 70 m"; `text` của dòng đã ghi số thì nhãn khác không ghi lại số đó. Một thông tin — một chỗ.
- **Gỡ thông tin hết vai trò**: badge/nhãn lời đọc không còn nói tới (vd. "vận tốc trung bình cả bài" khi đã sang đoạn 60–70 m) mờ đi trong ~0,5 s. Chỉ giữ thứ đang nói tới và mốc tham chiếu cần thiết.
- **Chữ nằm gọn trong khung chứa** của nó (thẻ, ô bảng, khung hình bên trái…), không tràn ra ngoài viền. Nhãn dài hơn khung → rút chữ hoặc đặt nhãn ra ngoài khung hẳn, có đường dẫn.
- Đếm nhanh mỗi frame: ngoài câu chốt, chữ mới xuất hiện trong dòng đang đọc ≤ ~8 từ.

**9. Nhịp hình: một thay đổi mỗi lần, và thay đổi là lời giải thích.**
- Mỗi dòng **tối đa một thay đổi chính** trên hình. Thay đổi vào trong 0,5–1 s đầu dòng rồi **đứng yên** để người xem nhìn; không xếp nhiều điểm/hàng/nhãn hiện nối nhau trong một dòng.
- **Số đổi ⇔ hình đổi, cùng lúc**: bảng nhảy sang hàng mới thì vạch/đoạn tô tương ứng trên hình co lại (hoặc giãn ra) đúng lúc đó, nhãn số đi theo vạch; con số mới phải trông như *sinh ra* từ chuyển động trên hình (đoạn co lại → giá trị chạy tới số mới), không tự hiện ở một chỗ khác.
- Không mở một hình biểu diễn mới (trục số, bảng, đồ thị khác) khi hình đang có biểu diễn được điều đó. Cần hình mới thì nối với hình cũ bằng bước người xem tự hiểu (lấy số từ hình cũ → bảng nhỏ → chấm từng điểm → nối đồ thị), hình cũ vẫn thấy trong lúc nối.
- **Không dùng phép biến hình lạ mắt** (xoay đường chạy thành trục, nhân vật nằm ngang, gập/cuộn hình). Đã thử 20/10/2026: người xem không hiểu. Trục, đồ thị, nhân vật luôn ở tư thế quen thuộc.

**10. Nhân vật do quy luật điều khiển; công thức chỉ lên hình.**
- Nhân vật/vật minh hoạ (người chạy, flycam, phân tử…) chỉ có mặt khi biểu diễn một đại lượng, và chuyển động **theo đúng quy luật đó** (vị trí qua hàm scale chung, tốc độ theo đại lượng tương ứng). Nhãn nói rõ nó là gì. Không có nhân vật cho vui.
- **Giải phẫu công thức/định nghĩa**: khi lời đọc giải thích một cụm, cụm đó trên công thức và thứ tương ứng trên hình **cùng sáng lên một màu**, các phần khác mờ đi. Công thức và hình cùng nằm trên màn hình lúc đó (công thức thu nhỏ ở cạnh, không thay hẳn hình).
- **Công thức neo trong cảnh trong chuỗi "vì sao"**: công thức học sinh nhớ ở yên cạnh hình suốt chuỗi; mỗi mắt xích đánh dấu **lên chính công thức** (dấu (+)/(−) dưới tử, mẫu…) cùng màu với thứ trên hình. Mắt xích đã qua còn lại dưới dạng dấu trên công thức, không thành câu chữ.
- **Dựng phép tính từ thành phần, không nhảy bước**: kết quả của một phép ghép chỉ hiện sau khi từng thành phần đã hiện và được nói riêng, và hiện ra *từ* các thành phần đó (không vẽ một đoạn lơ lửng mà người xem không biết từ đâu ra).
- **Khái niệm mới hiện riêng trước khi dùng**, mẫu dựng của từng môn (cột dọc, cát tuyến, kính lúp, hai tầng $f$/$f'$…): gói môn › Mẫu dựng khái niệm.

**11. Màu theo vai trò, một màu một nghĩa.**
- Lấy từ `role` (`src/components/roles.ts`): `main` đồ thị/vật chính · `focus` thứ đang nói tới, kết quả chính · `up`/`down` **chỉ** cho tăng/giảm, dương/âm · `warn` bẫy, chỗ sai · `pairA`/`pairB` hai đại lượng của một cặp (mẫu/tử, ngang/dọc) · `dim` hết vai trò.
- Một cảnh **tối đa 5 màu nhấn**; cần thêm thì ghi lý do vào báo cáo. Màu đã gán nghĩa giữ nguyên nghĩa suốt video và giữa các video.
- Cụm trên công thức và thứ tương ứng trên hình cùng một màu (quy tắc 10).

**12. Nhãn neo vào vật (`AutoLabels`).**
- Mọi nhãn gắn vào một điểm/vật (`text` của dòng, tên điểm, giá trị) đặt bằng `AutoLabels` (`src/components/labels.tsx`): truyền điểm neo (toạ độ toán với `scale`, hoặc px trong khung), chữ, màu, độ mờ; truyền vật cản bằng `curveObstacles` (đường cong), `axesObstacles` (trục + số vạch chia), `segmentObstacles` (đoạn, tiếp tuyến), khung thẻ. Component tự chọn hướng không đè vật cản và nhãn khác, **gần điểm của mình hơn mọi điểm khác**; xa quá thì tự vẽ đường dẫn.
- Truyền **tất cả** nhãn của cảnh vào một `AutoLabels` (nhãn chưa hiện thì `opacity: 0`) để vị trí cố định suốt cảnh, không nhảy khi nhãn khác hiện. Nhãn quan trọng truyền trước; `prefer` để gợi hướng (vd. `["n"]` cho đỉnh).
- **Một vật một nhãn**: nhãn của cùng một điểm qua các dòng (vd. "$f'(3) = 0$" → "đỉnh" → "giá trị cực đại: 6") là **một** nhãn có `steps` + `step`, đổi chữ tại chỗ; không đặt nhiều nhãn chen nhau quanh một điểm.
- `phases` (vd. `["b02"]`): nhãn chỉ hiện trong các beat đó; hai nhãn không chung giai đoạn thì không giành chỗ của nhau.
- `anchor: "region"` cho nhãn của một vùng (đoạn cong tô màu, khoảng trên trục): gắn bằng màu, không cần luật "gần điểm mình hơn"; mặc định `"point"` cho nhãn của một chấm.
- Chữ cố định khác trong khung (công thức, "mô hình", tên trục, thẻ) truyền làm vật cản bằng `textObstacle` (giữ khoảng hở như giữa hai nhãn). Đặt chúng ở chỗ **không tranh vùng nhãn**: vùng quanh đỉnh/đáy/điểm đang xét để cho nhãn; công thức để góc trống (đã gặp ở demo: công thức góc trên phải chiếm chỗ của nhãn quanh đỉnh).
- Vật cản di chuyển trong beat (điểm chạy, flycam): truyền cả quỹ đạo, không chỉ vị trí hiện tại.
- Kích thước chữ chỉ là ước lượng → `check-layout` là bước kiểm cuối. Nhãn không có chỗ sạch (bị đẩy xa, `check-layout` báo "nhãn xa vật") thường nghĩa là **cảnh quá nhiều chữ**: bớt chữ (một thông tin một chỗ), dời chữ cố định, hoặc báo B1 rút `text` — không ép nhãn vào chỗ chật.

## Bước 2b — Storyboard (bản nháp, trước B2)

1. Dựng đủ các beat với `draft: true` (mặc định của composition cho tới khi có audio).
2. `node scripts/check-layout.mjs <id> --draft` → sửa hết lỗi.
3. `node scripts/storyboard.mjs <id>` → `out/_lam-viec/<id>/storyboard/index.html`: mỗi dòng một ảnh (cuối dòng, lúc thay đổi đã hiện đủ) kèm `show`, `text`, lời đọc. Tự soát từng ảnh theo Bước 4, rồi `node scripts/storyboard.mjs <id> --review` → `out/_lam-viec/<id>/storyboard/review/`: **mỗi beat một ảnh nhỏ** (cuối beat, scale 0,3) + `review.md` (lời đọc, thay đổi hình, chữ của từng dòng). Gọi agent `hoc-sinh-ao` với **đúng thư mục `review/`** + tiền đề, dặn **mỗi ảnh đọc đúng một lần**, theo thứ tự; không đưa thư mục ảnh đầy đủ. Agent dừng giữa chừng (lỗi, hết lượt) thì **không** cho chạy tiếp ngay: xem nó đã đọc bao nhiêu ảnh, có mở lại ảnh không, rồi mới quyết (24/10: agent xem 67 ảnh cỡ 0,5, mở lại mỗi ảnh ~20 lần, tốn 68% token cả phiên và chạm giới hạn hai lần). Sửa chỗ *nặng*/*vừa* về hình ở đây, chỗ về lời/chữ báo người dùng. Xong mới gửi trang cho người dùng (SendUserFile), kèm tóm tắt những gì học sinh ảo đã bắt và đã sửa.
4. Người dùng duyệt. Góp ý về hình → sửa code; về chữ/lời/nhịp → sửa ở B1 (chưa tốn audio). Duyệt xong mới sang B2.
5. Sau B2: `python scripts/align_words.py <slug>` (mốc từng từ cho `cue`), bỏ `draft` khỏi `defaultProps`, chạy lại Bước 0 đầy đủ + Bước 4 với thời gian thật.

## Bước 3 — Cấu trúc code

```
src/components/          dùng chung (ưu tiên dùng lại):
  BrandFrame.tsx         BrandFrame, BrandIntro, BrandOutro (khung 9Study)
  ExplainerVideo.tsx     ExplainerVideo, explainerMetadata — khung cả video (beats, audio, cảnh liền mạch, nháp)
  BeatShell.tsx          BeatShell (thẻ mở beat + câu chốt [+ phụ đề ở video cũ]), ramp, clamp
  labels.tsx             AutoLabels, curveObstacles, axesObstacles, segmentObstacles — nhãn neo tự đặt
  roles.ts               role — màu theo vai trò
  timeline.ts            buildTimeline (thật / nháp), hằng số nhịp
  plot.tsx               makeScale, Plot, Axes, FunctionPlot, Point, Segment, TangentLine, PlotLabel
  ZoomInset.tsx          kính lúp; MathText.tsx: MathText, Tex, useKatexFonts
  Card, KeyTakeaway, SectionCard, Subtitle, Speedometer, theme.ts (màu, cỡ chữ, halo)
src/videos/<slug>/
  script.json            (B1 — không sửa)
  Video.tsx              đăng ký Composition: ExplainerVideo + explainerMetadata(script); defaultProps { timeline: null, draft: true } tới khi có audio
  beats.tsx              mỗi beat một component; scene.tsx: mỗi cảnh một component dùng chung cho các beat của cảnh
src/Root.tsx             đăng ký <Composition id="<slug>" ...> 1920×1080, 30fps
```
- Trước khi viết component mới, xem `src/components/` **và thư mục các video trước** (`ban-chat-dao-ham/parts.tsx`: người chạy, đường chạy, đồng hồ bấm giờ; `ban-chat-dao-ham/graph.tsx`: đồ thị mô hình, cát tuyến, tam giác độ dốc; `don-dieu/scene.tsx`: flycam trên đồi, đồ thị hai tầng, cột dọc, mũi tên dọc đường cong, thẻ bên phải). Thứ đã dùng ở video trước và cần lại (vd. `Tag`, `label`, `lerp`, bảng màu vai trò `C` đang chép ở cả hai video) → chuyển sang `src/components/` rồi import, không chép lần ba.
- Toạ độ toán → pixel qua một hàm scale chung (`makeScale`); không hardcode pixel cho điểm trên đồ thị.
- Animation chỉ dùng `useCurrentFrame()` + `interpolate` / `spring`.
- Font KaTeX và font chữ phải load xong trước khi render frame.

## Bước 4 — Kiểm tra

- `npm run lint` sạch.
- Xuất ảnh tĩnh bằng `node scripts/stills.mjs <slug> <frame...>` (bundle một lần) → `out/_lam-viec/<id>/stills/`.
- Xuất ảnh tĩnh **cho từng dòng** (frame ngay trước khi dòng kết thúc, lúc mọi thành phần của dòng đó đã hiện đủ), không chỉ giữa beat. Nhiều frame thì bundle một lần rồi gọi `renderStill` lặp lại, thay vì gọi `npx remotion still` từng frame.
- **Kiểm bố cục bằng code trước, mắt sau.** `check-layout` báo LỖI (phải rỗng): chồng lấn/sát, tràn khung, lấn mép dưới, chữ dưới cỡ tối thiểu, nhãn neo cách vật > 130px; và CẢNH BÁO (soát bằng mắt): nửa khung trống, khung lệch, dòng nào thêm > 8 từ mới lên hình. Bản nháp thêm `--draft`.
- Chi tiết kiểm chồng lấn: Mọi khối chữ trên hình (nhãn, chú thích, số trục, câu chốt) gắn `data-text`, mọi điểm đánh dấu gắn `data-mark`. Chạy `node scripts/check-layout.mjs <slug>`: script mở từng frame kiểm tra, lấy khung bao (`getBoundingClientRect`) của các phần tử đó và báo mọi cặp chồng nhau hoặc cách nhau < 16px, kèm frame và nội dung chữ; khung chứa (thẻ, ô bảng, `Card`) gắn `data-box`, script báo mọi `data-text` nằm trong `data-box` mà tràn ra ngoài viền, và mọi chữ/điểm **bên ngoài** chạm vào khung đó (đã gặp: nhãn đồ thị chạm mép thẻ bảng mà không bị bắt). Danh sách phải rỗng mới sang bước soát bằng mắt.
- Soát từng ảnh theo **Quy tắc bố cục**: (1) có gì chồng lấn hay dính sát không; (2) kim/đường có đè lên chữ không; (3) cụm hình có cân không, có nửa khung trống không; (4) có chữ nào dưới cỡ tối thiểu không; (5) có gì lấn mép dưới (y > 1040) không; (6) có thành phần nào người xem không cần không; (7) phóng to hay dịch khung có mốc tham chiếu không; (8) **phép thử tắt tiếng**: mỗi con số, ký hiệu, màu, vật trên ảnh có chú thích nói nó là gì không; (9) **ít chữ**: nhãn nào dài quá ~5 từ, lặp `text` khác hoặc lặp số trên trục, `text` nào đặt xa vật nó nói tới, chữ nào tràn khỏi khung chứa, thông tin nào đã hết vai trò mà còn; (10) **nhịp**: so ảnh giữa dòng với ảnh cuối dòng — có quá một thay đổi không, số đổi mà hình có đổi theo không; vật minh hoạ đủ lớn chưa; (11) nhân vật có chuyển động đúng quy luật không, cụm công thức đang giải thích có sáng cùng màu với thứ trên hình không. Sửa hết rồi xuất lại để kiểm.
- **Soát toán trên hình**: điểm nằm đúng trên đồ thị, hệ số góc, nghiệm, nhãn trục. Sai toán là lỗi nghiêm trọng nhất.
- **Thời lượng**: tổng phải nằm trong 2:30 – 4:00. Lệch → báo người dùng, đề xuất quay lại B1 (không kéo giãn khoảng nghỉ để bù).
- Báo cáo: tổng thời lượng, các giả định khi dựng visual, chú thích đã tự thêm, chỗ cần người dùng xem.

## Bước 5 — Xem trước, rồi render

- Người dùng muốn xem nhanh ("demo", "chưa cần render") → mở Remotion Studio (`preview_start` với cấu hình `remotion-studio` trong `.claude/launch.json`) ở trang composition, không render.
- Render khi người dùng bảo, **chạy nền và ghi tiến độ ra file** để trả lời được "đến đâu rồi":
  ```
  npx remotion render <id> "$(node scripts/out-path.mjs <slug> --id <id>)" > <scratchpad>/render-<id>.log 2>&1
  ```
  `out-path.mjs` in đường dẫn `out/<Môn>/Lớp <lop>/<chuong>/<bai>/<id>.mp4` theo `lop`/`chuong`/`bai` trong `script.json` (thiếu thì ra `out/_lam-viec/<id>/`: điền cho đủ trước khi render bản đăng). Không ghi gì khác ra gốc `out/`: thứ người dùng xem nằm ở thư mục bài, thứ chỉ agent dùng ở `out/_lam-viec/<id>/`, log ở scratchpad; file nháp/thử cũ thì xóa.
  Không dùng `--log=error` (mất dòng tiến độ). Hỏi tiến độ → đọc dòng cuối của log (frame đã render / tổng), báo phần trăm và thời gian còn lại ước tính.
- Mốc thời gian (máy người dùng, 21/10/2026): video 3:53 (≈ 7000 frame) render ≈ 14–15 phút; 2:49 ≈ 6–8 phút. Báo mốc này lúc bắt đầu render.
- Xong: đo thời lượng file bằng `ffprobe`, gửi file cho người dùng. `out/` bị gitignore, không commit video.
- **Phụ đề**: `node scripts/export-captions.mjs <slug> [--id <compositionId>]` → `<id>.srt` + `<id>.vtt` + `<id>.timeline.json` cạnh video trong thư mục bài (từ `caption`, thiếu thì `speak`, đúng mốc thời gian của audio). Gửi kèm video để tải lên web/YouTube dạng phụ đề bật–tắt được; không in phụ đề lên hình.

## Bước 6 — Kiểm với người xem thật

Học sinh ảo chỉ là bước lọc; thước đo thật là người xem. Gợi ý cho người dùng khi gửi video (một lần, ngắn gọn):
- **Trước khi đăng (nếu được)**: 2–3 học sinh xem **một lần, không tua**, rồi trả lời 3 câu: (1) chỗ nào muốn tua lại / bị lạc — nói thời điểm; (2) kể lại ý chính bằng lời của mình; (3) giải câu hỏi mở đầu hoặc một câu áp dụng. Kể lại lệch ý bản chất → video chưa dạy được ý đó.
- **Sau khi đăng**: xem biểu đồ giữ chân người xem (YouTube Studio › Analytics › Giữ chân người xem, hoặc số liệu web 9Study): tìm chỗ tụt dốc đột ngột và chỗ người xem tua lại (đỉnh nhô lên).

Người dùng báo thời điểm ("1:23 khó hiểu", "tụt ở 0:40") → `python scripts/beat_at.py <id> 1:23 0:40` (cần `<id>.timeline.json` cạnh video, từ `export-captions.mjs` của đúng bản đã render) để biết beat, dòng, lời, hình ở đó; ghi vào `FEEDBACK.md` kèm beat/dòng, sửa theo quy trình góp ý như mọi lần, và thêm bài học vào `.claude/lessons.md`.

## Bản giọng khác (không thay bản cũ)

Audio của bản giọng khác nằm ở `public/audio/<slug>-<hậu tố>/` (skill `tao-audio` › Bản giọng khác). Dựng thêm composition, không chép code beat:
- `explainerMetadata` (video cũ: `calculateMetadata` riêng) nhận prop `audioDir` và gọi `buildTimeline(script, props.audioDir)` (mặc định = slug).
- Đăng ký thêm `<Composition id="<slug>-<hậu tố>" defaultProps={{ timeline: null, audioDir: "<slug>-<hậu tố>" }} …/>` cạnh composition gốc, cùng component (mẫu: `src/videos/ban-chat-dao-ham/Video.tsx`).
- Chạy `check-layout` cho id mới (nhịp đọc khác → mốc dòng khác), render bằng `out-path.mjs <slug> --id <slug>-<hậu tố>` (cùng thư mục bài với bản gốc).

## Không được

- Sửa `script.json` hay file audio. Thấy sai → báo, quay lại B1/B2.
- Tự đặt thời gian cho dòng thay vì lấy từ độ dài audio (bản nháp dùng ước tính của `buildTimeline`, không tự đặt).
- Render bản đăng từ timeline nháp.
