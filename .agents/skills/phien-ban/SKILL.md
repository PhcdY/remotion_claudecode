---
name: phien-ban
description: Xem và đổi phiên bản bộ công cụ làm video cho người dùng không rành Git. Dùng khi người dùng hỏi "đang dùng bản nào", "bản này cập nhật gì", "có bản mới chưa", "cập nhật bản mới nhất", "cập nhật/chuyển sang bản <số hoặc tên>", "quay lại bản cũ", hoặc gõ $phien-ban. Không dùng để phát hành bản mới (việc đó chỉ làm khi chủ dự án bảo push release, xem docs/git-branching.md mục 4).
---

# Phiên bản: xem, cập nhật, quay lại

Người dùng làm video không biết Git và không lên GitHub. Họ chỉ nói bằng lời trong khung chat. Việc của bạn: chạy Git thay họ, **không bao giờ làm mất bài của họ**, và báo lại bằng lời thường.

## Khái niệm

- **Bản phát hành** = một tag trên GitHub mà tên là số: `1`, `2`, `3`… (tag cũ `v1.0.0` tính là bản 1). Bỏ qua mọi tag khác (`old/*`, `archive/*`, `ban-cu-...`).
  Bản mới nhất = số lớn nhất, **so theo số chứ không theo chữ** (`10` > `9`). Mọi bản phát hành đều dùng được, không cần kiểm tra thêm.
- Tag chỉ gồm số dễ bị Git hiểu nhầm thành mã commit, nên **luôn gọi đầy đủ** `refs/tags/<tên>` trong lệnh.
- **Mô tả của từng bản** nằm trong `CHANGELOG.md`, mục `## Bản <số> — <ngày>`. Bản mới chưa tải về thì đọc bằng `git show refs/tags/<số>:CHANGELOG.md`.
- **Bài của người dùng** nằm trong code, không chỉ ở thư mục xuất video:
  - `src/videos/<slug>/` là thư mục mới chưa được Git theo dõi. Đổi bản không đụng tới.
  - `src/Root.tsx` có dòng đăng ký video của họ. Bản mới cũng hay sửa file này.
  - `.agents/skills/`, `.agents/lessons.md`, `.agents/mon/` có bài học Codex đã ghi theo góp ý của họ. Bản mới hay sửa các file này.
  - `out/`, `OUTPUT_DIR` trong `.env`, `public/audio/`, `.env` nằm ngoài Git, an toàn.

## Cấm tuyệt đối

`git reset --hard`, `git checkout -f`, `git switch --discard-changes`, `git clean`, `git stash drop`/`pop`/`clear`, `git checkout -- <file>` và `git restore <file>` (ngoại lệ duy nhất: bước 4d.2, cho file đang đụng nhau sau khi đã có stash), xoá file hoặc thư mục của người dùng, `git commit`, `git push`.
Nếu Git từ chối một lệnh: **dừng lại, đọc lỗi**, xử lý theo mục "Khi gặp sự cố". Không thử lệnh mạnh hơn.

## Bước chung: xác định bản đang dùng

```bash
git fetch origin --tags --force
git branch --show-current
git tag --points-at HEAD
git describe --tags --match "[0-9]*" --match "v[0-9]*"
```
- Lệnh 2 in tên nhánh, hoặc rỗng nếu đang đứng trên một bản phát hành.
- Lệnh 3 in mọi tag trên commit đang dùng. Có tag là số → đang ở đúng bản đó.
- Lệnh 3 không có tag số → lệnh 4 cho dạng `<bản gần nhất>-<số thay đổi>-g<mã>`, tức là đang ở bản đang phát triển hoặc thử nghiệm, mới hơn bản đó N thay đổi.
- `fetch` lỗi → báo "Máy chưa kết nối được GitHub, bạn kiểm tra mạng rồi nói lại mình nhé" rồi dừng (vẫn trả lời được câu "đang dùng bản nào" từ máy).

## 1. "Đang dùng bản nào?"

Trả lời 1–2 câu. Ví dụ:
- "Bạn đang dùng **bản 2** (phát hành 15/11/2026)."
- "Bạn đang dùng bản thử nghiệm `toan_feature_truc-3d`, dựa trên bản 2 và có thêm 5 thay đổi."

Nếu có bản mới hơn thì thêm một câu: "Đã có bản 3, bạn muốn cập nhật không?"

## 2. "Bản này cập nhật gì?" / "Bản <số> có gì?"

1. Đọc mục `## Bản <số>` trong `CHANGELOG.md` của chính bản đó (`git show refs/tags/<số>:CHANGELOG.md`).
2. Không có mục đó thì đọc lời ghi của tag: `git tag -l --format="%(contents)" <số>`.
3. Vẫn không có thì tóm tắt danh sách thay đổi so với bản trước: `git log --oneline --no-merges refs/tags/<bản trước>..refs/tags/<số>`.

Đang ở bản thử nghiệm hoặc nhánh thì đọc mục `## Chưa phát hành` và tóm tắt `git log --oneline --no-merges <bản gần nhất>..HEAD`.

Cách trả lời: 3–5 gạch đầu dòng, viết theo việc người dùng làm được ("Thêm môn Sinh", "Chữ không còn tràn khỏi khung"). Không dùng tên file hay thuật ngữ code. Nếu mục "Cần làm sau khi cập nhật" có nội dung thì luôn nêu ra.

## 3. "Có bản mới chưa?"

Chỉ kiểm tra, **không đổi gì**. So bản đang dùng với bản số lớn nhất. Có bản mới thì kể ngắn bản mới có gì (cách ở mục 2, đọc bằng `git show refs/tags/<số>:CHANGELOG.md`), rồi hỏi có muốn cập nhật không.

## 4. Đổi bản: "Cập nhật bản mới nhất" / "Cập nhật lên bản <tên>" / "Quay lại bản cũ"

### 4a. Tìm đích
- **Mới nhất**: tag là số lớn nhất. Nếu đang ở đúng bản đó → báo "Bạn đang dùng bản mới nhất rồi (bản N)" rồi dừng.
- **Theo tên** người dùng gõ (`3`, `bản 3`, `v3`, hay tên nhánh):
  1. Tag số trùng tên → `refs/tags/<số>`.
  2. Không có thì tìm nhánh: `git branch -r --list "origin/*<tên>*"`. Có đúng một nhánh khớp → dùng nhánh đó. Có nhiều nhánh → liệt kê và hỏi người dùng chọn.
  3. Không thấy gì → liệt kê các bản phát hành đang có, kèm nhánh có tên gần giống, rồi hỏi lại.
- **Quay lại bản cũ/bản trước**: đọc `git reflog -n 30`, tìm dòng `checkout: moving from <A> to <B>` gần nhất, lấy `<A>`. Nếu `<A>` là mã commit trùng một tag số thì gọi bằng tên bản. Không chắc thì hỏi "Bạn muốn quay về bản mấy?".
- Đích là nhánh → nói trước một câu: "Đây là bản thử nghiệm, có thể còn lỗi. Muốn quay lại thì bảo mình 'quay lại bản cũ'."

### 4b. Cất bài đang làm
```bash
git status --porcelain
```
- **Không có dòng nào**, hoặc chỉ có dòng bắt đầu bằng `??` (thư mục video mới) → không cần cất, sang 4c.
- **Có dòng khác** (file bị sửa) → cất vào stash có tên, **không dùng `-u`** để thư mục video mới vẫn nằm yên:
  ```bash
  git stash push -m "phien-ban: bai dang lam truoc khi doi sang <đích> <YYYY-MM-DD HH:mm>"
  git stash list
  ```
  Ghi lại vị trí `stash@{n}` vừa tạo (dòng có đúng tên trên) để dùng ở 4d.
- **Giữ commit riêng nếu có.** Chạy `git log --oneline HEAD --not --remotes --tags`. Nếu in ra commit nào thì đó là commit chỉ có trên máy, đổi bản xong sẽ khó tìm lại. Tạo nhánh giữ chúng: `git branch luu-may/<YYYY-MM-DD-HHmm>`.

### 4c. Đổi bản
```bash
# Đích là bản phát hành:
git switch --detach refs/tags/<số>
# Đích là nhánh trên GitHub (chưa có trên máy thì Git tự tạo nhánh theo dõi):
git switch <tên-nhánh>
git pull --ff-only
```
Git báo "untracked working tree files would be overwritten" → bản mới có thư mục trùng tên với bài của người dùng. Xử lý theo mục "Khi gặp sự cố".

### 4d. Lấy bài ra lại
Chỉ làm khi ở 4b có cất:
```bash
git stash apply stash@{n}
```
- **Không đụng nhau** → xong.
- **Có file đụng nhau** (Git báo `CONFLICT`, `git status --porcelain` có dòng `UU`). **Đừng giữ cả hai phía một cách máy móc.** Phía "Stashed changes" chứa cả những dòng của bản cũ quanh chỗ người dùng sửa, không chỉ dòng của họ. Ví dụ khi quay từ bản 3 về bản 2, giữ cả hai phía sẽ kéo theo dòng đăng ký video chỉ bản 3 mới có, và Studio báo lỗi. Làm như sau:
  1. Xem **chính xác phần người dùng đã sửa**: `git diff "stash@{n}^1" "stash@{n}" -- <file>`. Chỉ các dòng `+`/`-` trong đó là của họ.
  2. Lấy file của bản đích: `git checkout HEAD -- <file>`. Chỉ dùng lệnh này cho file đang đụng nhau, sau khi stash đã có. Phần của người dùng vẫn nằm an toàn trong stash.
  3. Thêm lại đúng các dòng của người dùng vào chỗ hợp lý:
     - `src/Root.tsx`: thêm `import` và `<…Composition />` của video họ, không trùng lặp.
     - Skill, `lessons.md`, gói môn: thêm lại bài học họ đã ghi. Nếu nó mâu thuẫn trực tiếp với luật của bản đích thì giữ luật bản đích, chép ý của họ xuống cuối `.agents/lessons.md` kèm dòng `(người dùng đã dặn trước khi đổi sang bản <số>: …)`.
     - Code khác: thêm lại phần sửa của họ. Không khớp được (bản đích đã viết lại chỗ đó) thì giữ bản đích, báo người dùng tên file. Phần của họ vẫn còn trong stash.
  4. Gỡ trạng thái đụng nhau mà **không commit**: `git restore --staged <file>`.
- **Kiểm tra `src/Root.tsx`**: mọi dòng `import … from "./videos/<thư mục>/…"` phải trỏ tới thư mục có thật trong `src/videos/`. Dòng nào trỏ tới thư mục không có thì bỏ cả `import` lẫn `<…Composition />` của nó.
- **Không xoá stash**: nó là bản sao lưu.

### 4e. Sau khi đổi
1. Nếu `package.json` hoặc `package-lock.json` khác giữa bản cũ và bản mới (`git diff --name-only <cũ> HEAD -- package.json package-lock.json`): nhắc người dùng tắt Remotion Studio nếu đang mở (Ctrl+C ở cửa sổ đang chạy `npm run dev`), rồi chạy `npm install`.
2. Nếu đang mở Studio thì nhắc mở lại để thấy bản mới.
3. Kiểm tra nhanh: `npm run lint`. Có lỗi ở file người dùng vừa gộp thì sửa. Có lỗi ở chỗ khác thì báo, không tự vá code của bản phát hành.

### 4f. Báo lại người dùng (lời thường, ngắn)
- "Đã cập nhật lên **bản 3**. Bài của bạn vẫn còn đủ: <liệt kê thư mục trong `src/videos/` chưa được Git theo dõi, nếu có>."
- 3–5 dòng "Bản 3 có gì mới" (theo mục 2), kèm phần "Cần làm sau khi cập nhật" nếu có.
- Nếu đã gộp file đụng nhau, nói 1 câu, ví dụ "Bản mới cũng sửa sổ tay bài học, mình đã giữ cả bài học cũ của bạn".
- Không dán lệnh Git, không nói "detached HEAD", "stash", "merge".

## Khi gặp sự cố

| Gặp | Làm |
| :--- | :--- |
| `untracked working tree files would be overwritten` khi đổi bản | Git đã tự dừng, chưa có gì mất. Bản đích có bài trùng tên thư mục với bài của người dùng. Đổi tên thư mục của họ: `src/videos/<slug>` → `src/videos/<slug>-cua-ban`, và `public/audio/<slug>` → `public/audio/<slug>-cua-ban` nếu có. Sửa `slug` trong `script.json` cho khớp. Rồi đổi bản lại (4c). Sau 4d, dòng `import` của họ trong `src/Root.tsx` vẫn trỏ `./videos/<slug>/`, tức thư mục của bản đích: sửa thành `./videos/<slug>-cua-ban/` và đổi tên component nếu trùng. Báo người dùng tên mới. Không xoá gì. |
| `Your local changes would be overwritten` | Bỏ sót bước 4b. Quay lại 4b. |
| `stash apply` lỗi không phải CONFLICT | Dừng, đừng thử lệnh khác. Báo người dùng: bài vẫn an toàn trong bản sao lưu `<tên stash>`, nhờ chủ dự án xem giúp. |
| Đang dở một lần gộp cũ (`git status` có "Unmerged paths" từ trước) | Không đổi bản. Gộp xong các file đó theo 4d trước. |
| Không tìm thấy bản người dùng nói | Liệt kê các bản đang có, hỏi lại. |
| Không có tag số nào | "Hiện chưa có bản phát hành nào." Không tự chọn nhánh thay. |
