# Quy định Đặt tên Nhánh, Quản lý Git & Phát hành Phiên bản (Git Branching & Release Guide)

> [!IMPORTANT]
> **Triết lý Dự án: Engine / Framework chứ không phải Kho chứa Video**
> - Repo này là **bộ khung công cụ (Engine / Framework)** sản xuất video: core components, scripts, skills, rules và gói môn.
> - **Làm video mới KHÔNG CẦN chia nhánh Git**: Creator/User chỉ cần clone nhánh chính hoặc checkout bản Release ổn định về, tạo kịch bản, render ra file MP4 rồi tự lưu trữ vào máy cá nhân. Video thành phẩm (`out/`) không phải là tính năng của repo và không đưa lên Git.
> - **Nhánh Git CHỈ TẠO KHI**: Phát triển, nâng cấp hoặc sửa đổi chính bộ công cụ/hệ thống (thêm component dùng chung, bổ sung skill mới, sửa lỗi script tự động, đóng gói release hoặc nâng cấp quy chuẩn môn học).

---

## 1. Cấu trúc Tên Nhánh (Naming Convention)

Tên nhánh phải tuân theo cấu trúc 3 phần:

```text
[môn]_[tag]_[describe]
```
*(Hoặc có thể dùng cú pháp phân cấp thư mục Git `[môn]/[tag]/[describe]` để GitHub và VS Code tự động nhóm nhánh vào folder).*

### 1.1. Mã môn (`[môn]`)
- **Môn học cụ thể**: `toan`, `ly`, `hoa`, `sinh`, `su`, `dia`, `van`, `ktpl`, `anh`... (khi thay đổi gói quy chuẩn môn hoặc component đặc thù của môn đó).
- **Khung chung toàn dự án**: `all` (áp dụng cho core components, Remotion config, skills, agents, scripts, rules, styles).

### 1.2. Phân loại công việc (`[tag]`)
Chỉ sử dụng các tag chuẩn sau (viết thường):

| Tag | Ý nghĩa | Khi nào dùng? (Chỉ cho quá trình phát triển Engine) |
| :--- | :--- | :--- |
| `feature` | Tính năng mới cho hệ thống | Thêm component dùng chung mới (ví dụ: đồ thị 3D, thanh thước đo), thêm skill mới, thêm gói môn mới |
| `fix` | Sửa lỗi hệ thống / core | Sửa lỗi component dùng chung (lỗi nhãn đè nhau trong `AutoLabels`, lỗi tràn thẻ `SectionCard`), sửa script TTS/alignment |
| `refactor` | Tái cấu trúc mã nguồn | Gom component trùng lặp vào `src/components/`, tối ưu code SVG, dọn dẹp import (không đổi giao diện) |
| `test` | Thử nghiệm kỹ thuật | Thử nghiệm hiệu ứng Remotion mới, benchmark tốc độ render, test model TTS mới |
| `release` | Chuẩn bị phát hành phiên bản mới | Đóng gói một mốc phiên bản ổn định (VD: bản `2`), kiểm thử toàn diện toàn bộ pipeline trước khi gắn Git Tag chính thức |
| `docs` | Tài liệu & Quy định | Cập nhật hướng dẫn sử dụng, sửa quy chuẩn gói môn `.agents/mon/`, bổ sung tài liệu SGK |

> [!NOTE]
> Lưu ý chính tả: Luôn dùng `refactor` (không dùng *refractor*).

### 1.3. Mô tả ngắn (`[describe]`)
- **Bắt buộc**: Viết bằng **tiếng Việt không dấu** hoặc **tiếng Anh**, nối nhau bằng dấu gạch ngang `-` (`kebab-case`).
- **Tuyệt đối không**:
  - Không dùng tiếng Việt có dấu (`sua-loi`, KHÔNG dùng `sửa-lỗi`).
  - Không chứa khoảng trắng (dấu cách).
  - Không dùng ký tự đặc biệt (`!@#$%^&*()_+`).

---

## 2. Bảng Ví dụ Mẫu Chuẩn

| Mục tiêu phát triển hệ thống | Tên nhánh chuẩn (`_`) | Tên nhánh dạng Folder (`/`) |
| :--- | :--- | :--- |
| Thêm component vẽ trục không gian 3D cho Toán | `toan_feature_truc-khong-gian-3d` | `toan/feature/truc-khong-gian-3d` |
| Sửa lỗi chữ bị đè trong nhãn tự động (`AutoLabels`) | `all_fix_de-nhan-autolabels` | `all/fix/de-nhan-autolabels` |
| Tái cấu trúc bộ component `plot.tsx` | `all_refactor_plot-components` | `all/refactor/plot-components` |
| Thử nghiệm tích hợp Remotion Three | `all_test_remotion-three` | `all/test/remotion-three` |
| Đóng gói và chuẩn bị phát hành bản 2 | `all_release_2` | `all/release/2` |
| Bổ sung quy chuẩn gói môn Hoá học | `hoa_docs_goi-mon-hoa-hoc` | `hoa/docs/goi-mon-hoa-hoc` |
| Bổ sung gói môn Tiếng Anh và 5 Archetypes | `anh_feature_goi-mon-anh` | `anh/feature/goi-mon-anh` |
| Khởi tạo gói môn Kinh tế và Pháp luật | `ktpl_feature_goi-mon-ktpl` | `ktpl/feature/goi-mon-ktpl` |
| Cập nhật hướng dẫn người dùng và quy chuẩn PR | `all_docs_cap-nhat-huong-dan-pr` | `all/docs/cap-nhat-huong-dan-pr` |
| Sửa script `vivibe_tts.py` hỗ trợ multi-voice | `all_fix_vivibe-multi-voice` | `all/fix/vivibe-multi-voice` |

---

## 3. Vòng đời Nhánh & Quản lý Nhánh (Branch Lifecycle)

### 3.1. Nhánh chính (`main-codex`)
- Là nguồn chân lý (Source of Truth) và nhánh tích hợp liên tục (CI) của toàn bộ dự án.
- Code trên nhánh chính luôn phải qua kiểm tra:
  - `py scripts/check_script.py <slug>`: 0 lỗi.
  - `npm run lint`: 0 lỗi.
  - Không có file rác chưa commit.

### 3.2. Nhánh phát hành (`[môn]_release_[describe]`)
- Nhánh tạm thời dùng để đóng băng (feature freeze), kiểm thử lần cuối toàn diện (lint, render thử, đối soát kịch bản) và chuẩn bị ghi chú phát hành trước khi gắn Git Tag.
- Sau khi gắn Git Tag và merge vào nhánh chính, nhánh release có thể xoá hoặc chuyển vào lưu trữ.

### 3.3. Nhánh lưu trữ cũ (`archive/*`)
- Các nhánh thử nghiệm cũ hoặc phiên bản lịch sử không còn phát triển tiếp nhưng cần giữ lại tham khảo sẽ được gom vào tiền tố `archive/`:
  - Ví dụ: `archive/main-cu`, `archive/commit-dau`, `archive/test-chia-model`.
- **Cách lưu trữ nhanh bằng Tag**:
  - Gắn tag vĩnh viễn: `git tag archive/<ten-nhanh> <branch>`
  - Sau đó có thể xoá nhánh làm việc trên GitHub để giữ danh sách nhánh luôn gọn gàng.

---

## 4. Quy trình Phát hành Phiên bản & Thử nghiệm Tính năng (Release & Testing Guide)

### 4.1. Phân biệt Nhánh Tích hợp (`main-codex`) vs Bản Phát hành (Git Tag)

| Tiêu chí | Nhánh Chính (`main-codex`) | Bản Phát hành (Git Tag là số: `1`, `2`, `3`…) |
| :--- | :--- | :--- |
| **Bản chất** | Nhánh làm việc liên tục (Living branch), nơi tích hợp các PR tính năng và sửa lỗi mới nhất. | Cột mốc đóng băng (Snapshot) được đánh số (VD: `2`), không thay đổi mã nguồn. |
| **Mục đích** | Phục vụ lập trình viên tiếp tục phát triển framework. | Phục vụ người làm video: có tag là dùng được. |
| **Người dùng đổi bản thế nào** | (Không dùng trực tiếp) | Nói với Codex trong khung chat, skill `phien-ban` lo phần Git (mục 4.5). |

### 4.2. Đánh số Phiên bản
- Tag phát hành **chỉ là số**, tăng dần 1 đơn vị: `1`, `2`, `3`… Bản mới nhất là số lớn nhất.
- Tag cũ `v1.0.0` được tính là **bản 1**, nên bản phát hành tiếp theo là `2`.
- Không dùng tên tag dạng số cho việc khác. Tag lưu trữ dùng tiền tố chữ (`archive/...`, `old/...`), skill `phien-ban` tự bỏ qua chúng.
- **Mỗi bản phải có mục mô tả trong `CHANGELOG.md`**. Người làm video không lên GitHub, nên Codex chỉ đọc được mô tả từ file này.

### 4.3. Quy trình Thử nghiệm Tính năng Mới (Feature Testing)
Khi bạn muốn thêm một tính năng hoặc thử nghiệm kỹ thuật mới:

1. **Người phát triển**: Tạo nhánh theo quy ước (VD: `toan_feature_truc-khong-gian-3d` hoặc `all_test_remotion-three`), commit code và push lên GitHub.
2. **Người muốn trải nghiệm**: Không cần đợi merge vào `main-codex`, chỉ cần nói với Codex: *"Chuyển sang bản toan_feature_truc-khong-gian-3d"*. Thử xong thì nói *"Quay lại bản cũ"*.
3. **Thử nghiệm an toàn tại Phòng Lab**:
   - Mở composition `LabThanhPhan` (`src/videos/lab-thanh-phan/`) trên Remotion Studio để xem tương tác đồ hoạ và chuyển động.
   - Góp ý hoặc báo lỗi trực tiếp cho người phát triển. Nhánh chính (`main-codex`) hoàn toàn không bị ảnh hưởng.
4. **Sau khi hoàn thiện & kiểm thử đạt chuẩn**: Tạo Pull Request để merge vào nhánh chính, nhớ thêm dòng vào mục `## Chưa phát hành` của `CHANGELOG.md`.

### 4.4. Quy trình Phát hành Release (chỉ làm khi chủ dự án bảo "push release")
Ví dụ dưới phát hành bản `2`.

* **Bước 1: Tạo nhánh phát hành**
  ```bash
  git checkout main-codex
  git pull origin main-codex
  git checkout -b all_release_2
  ```
* **Bước 2: Thẩm định toàn diện (Verification Gate)**
  - Chạy `npm run lint`: Phải đạt 0 lỗi.
  - Chạy `py scripts/check_script.py <slug>` trên các video mẫu.
  - Render thử nghiệm 1 video hoàn chỉnh để đảm bảo âm thanh Vivibe, subtitle và font chữ KaTeX render trơn tru.
* **Bước 3: Viết mô tả bản trong `CHANGELOG.md`**
  - Đổi tiêu đề `## Chưa phát hành` thành `## Bản 2 — <YYYY-MM-DD>`, rồi thêm lại một mục `## Chưa phát hành` trống ở trên.
  - Đối chiếu với `git log --oneline --no-merges <tag bản trước>..HEAD`: thay đổi nào người dùng cảm nhận được mà chưa có dòng thì bổ sung. Viết bằng lời thường (cách viết ở đầu `CHANGELOG.md`).
  - Có việc người dùng phải tự làm sau khi cập nhật (thêm key vào `.env`, cài thêm công cụ…) thì ghi vào phần **Cần làm sau khi cập nhật**.
  - Commit, push nhánh, tạo PR vào `main-codex` và merge (dùng merge commit hoặc rebase, để commit gắn tag nằm trên `main-codex`).
* **Bước 4: Gắn Git Tag trên `main-codex` & Đẩy lên GitHub**
  ```bash
  git checkout main-codex
  git pull origin main-codex
  git tag -a 2 -m "Bản 2: <tóm tắt 1 dòng, giống CHANGELOG>"
  git push origin refs/tags/2
  ```
  (Tuỳ chọn) Tạo Release trên GitHub từ tag `2`, dán mục `## Bản 2` của `CHANGELOG.md` làm mô tả.

### 4.5. Hướng dẫn Dành cho Người làm Video (Creator)
Người làm video **không gõ lệnh Git**. Họ nói với Codex, skill `.agents/skills/phien-ban/` làm thay và tự cất bài đang làm trước khi đổi bản:

| Nói với Codex | Codex làm |
| :--- | :--- |
| "Mình đang dùng bản nào?" | Báo số bản (hoặc tên nhánh thử nghiệm) |
| "Bản này cập nhật gì?" | Tóm tắt mục của bản đó trong `CHANGELOG.md` |
| "Có bản mới chưa?" | Kiểm tra, kể bản mới có gì, không đổi gì |
| "Cập nhật bản mới nhất" | Đổi sang tag số lớn nhất |
| "Cập nhật lên bản 3" / "Chuyển sang bản <tên nhánh>" | Đổi sang tag hoặc nhánh đó |
| "Quay lại bản cũ" | Về bản dùng ngay trước đó |

---

## 5. Quy chuẩn Soạn Mô tả Pull Request (PR Standard)

> [!IMPORTANT]
> **Quy chuẩn Giao tiếp khi Push Git**:
> Mỗi khi hoàn thành công việc trên một nhánh và push lên GitHub, AI/Lập trình viên **BẮT BUỘC** soạn sẵn nội dung Pull Request hoàn chỉnh theo mẫu dưới đây ngay trong khung chat để người dùng chỉ việc copy-paste vào giao diện tạo PR trên GitHub.

### Mẫu Định dạng PR Chuẩn:

```markdown
## 🎯 Mục tiêu (Objective)
- [Tóm tắt 1-2 câu về mục tiêu của PR: tính năng mới, sửa lỗi, nâng cấp tài liệu hay refactor]

## 🛠️ Thay đổi Chính (Key Changes)
- **Core / Scripts / Docs**: [Liệt kê các module hoặc component được tạo mới / chỉnh sửa]
- **Tính năng / Cải tiến**: [Mô tả chi tiết những điểm nổi bật]
- **Quy chuẩn mới**: [Bổ sung vào .agents/lessons.md hoặc gói môn nếu có]

## 🧪 Kiểm tra Thực tế (Verification)
- [x] `py scripts/check_script.py <slug>`: 0 lỗi (nếu có chỉnh sửa kịch bản)
- [x] `npm run lint`: 0 lỗi TypeScript / ESLint
- [x] Đã đối chiếu các liên kết markdown tương đối (relative links), không dùng link tuyệt đối `file:///`
- [x] Đã kiểm tra giao diện hoặc render thử nghiệm (nếu có thay đổi component)

## 📌 Ghi chú Thêm (Notes)
- [Ghi chú về biến môi trường mới, lưu ý khi merge hoặc hướng phát triển tiếp theo]
```

---

## 6. Cheat-sheet Lệnh Git Thường Dùng

```bash
# --- Làm việc với Tính năng & Nhánh ---
# 1. Tạo nhánh mới từ nhánh chính và chuyển sang nhánh đó
git checkout main-codex
git pull origin main-codex
git checkout -b toan_feature_bai-moi

# 2. Kiểm tra trạng thái code trước khi commit
git status

# 3. Commit theo chuẩn Conventional Commits
git add .
git commit -m "feat(toan): mo ta ngan gon cong viec"

# 4. Đẩy nhánh mới lên GitHub
git push -u origin toan_feature_bai-moi

# --- Thử nghiệm Tính năng từ người khác ---
git fetch origin
git checkout toan_feature_bai-moi
npm run dev

# --- Phát hành Phiên bản (Release Tag) ---
# Sau khi đã viết mục "## Bản 2" trong CHANGELOG.md và merge vào main-codex (mục 4.4)
git tag -a 2 -m "Bản 2: tom tat 1 dong"
git push origin refs/tags/2

# --- Lưu trữ Nhánh cũ ---
git tag archive/ten-nhanh-cu ten-nhanh-cu
git push origin --tags
```
