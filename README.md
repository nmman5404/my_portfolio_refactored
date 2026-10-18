# Portfolio

Website EN/VN dùng chung dữ liệu và template. JavaScript chia thành ES module; blog viết bằng Markdown tiếng Việt.

## Chạy trên máy

Cần Node.js 20 trở lên. Lần đầu chạy:

```powershell
npm.cmd ci
npm.cmd run dev
```

Mở địa chỉ terminal hiển thị. Lưu file sẽ tự cập nhật. Trên macOS/Linux dùng `npm` thay `npm.cmd`.

Xem bản production:

```powershell
npm.cmd run build
npm.cmd run preview
```

Mở `http://127.0.0.1:4173`. `dist/` được sinh tự động, không sửa trực tiếp.

## Sửa nội dung

| Nội dung | File |
| --- | --- |
| Tên, chức danh, giới thiệu đầu trang | `src/modules/profile/data.js` |
| About Me | `src/modules/about/data.js` |
| Nhóm, tag và kỹ năng | `src/modules/skills/data.js` |
| Học vấn, chứng chỉ, kinh nghiệm | `src/modules/experience/data.js` |
| Dự án | `src/modules/projects/data.js` |
| Contact | `src/modules/contact/data.js` |
| Tiêu đề trang, footer, nhãn nút | `src/modules/interface/data.js` |
| Nhạc và credit | `src/modules/audio/data.js` |
| Chat | `src/modules/chat/data.js` |

Sửa một file là cập nhật cả EN/VN. Giá trị dùng chung viết một lần; bản dịch đặt cạnh nhau dưới dạng `{ en: '...', vi: '...' }`. Bố cục mỗi section nằm trong `src/modules/<section>/template.njk`.

Skills: thêm nhóm vào `groups`, kỹ năng vào `groups[n].skills`, tag vào `groups[n].tags` dạng `{ title: 'Cloud', skills: ['AWS', 'Azure'] }`.

Thêm section: tạo folder `src/modules/<id>/` có `data.js` và `template.njk`, đăng ký dữ liệu trong `src/_data/modules.js`, rồi thêm `{ id, template: 'modules/<id>/template.njk', enabled: true }` vào `src/_data/sections.js`. Template cần `id` trùng registry. Nhãn navbar lấy từ `navigation` trong `data.js`.

## Sửa chức năng

`src/client/home.js` khởi tạo các tính năng; mỗi file trong `src/client/features/` giữ state và sự kiện riêng. Nội dung và bản dịch vẫn lấy từ `src/modules/`, không đặt trong hàm xử lý.

| Chức năng | Nơi sửa |
| --- | --- |
| Theme, nhạc, slider, gõ chữ, spotlight, scroll reveal, đổi ngôn ngữ | File tương ứng trong `src/client/features/` |
| Gửi chat, cooldown và countdown | `src/client/features/chat.js` |
| Lịch sử chat, thời hạn phiên, localStorage | `src/client/features/chat/session.js` |
| Hiển thị chat, nút và nhập tin nhắn | `src/client/features/chat/view.js` |
| Theme và quay lại trong các bài viết | `src/modules/article/scripts/article-theme-toggle.js`, `article-back.js` |
| Kiểm tra nội dung, lọc bài và section khi build | `src/lib/content.js` |
| Chuyển dữ liệu nội dung thành cấu hình trình duyệt | `src/lib/client-config.js` |
| HTTP API, gọi model, prompt và kiến thức chatbot | `server/chat/` (route: `api/chat.js`) |

Sự kiện chat được gắn trong module JavaScript, dùng chung cho cả EN/VN. Các preset bài viết dùng chung logic theme/quay lại; khác biệt bố cục nằm trong template và CSS.

## Viết blog

Tạo `src/content/blog/bai-viet-dau-tien.md`:

```markdown
---
title: "Bài viết đầu tiên"
slug: "bai-viet-dau-tien"
date: "2026-10-18"
summary: "Mô tả ngắn xuất hiện trên trang chủ."
thumbnail: "/thumbnail_png/avatar.jpg"
draft: false
---

## Giới thiệu

Viết nội dung tiếng Việt ở đây. Có thể dùng **chữ đậm**, danh sách, ảnh và khối mã.
```

- Chỉ cần một file tiếng Việt; không cần sửa HTML hoặc tạo bản EN.
- Đặt ảnh vào `public/thumbnail_png/`; trong bài dùng `/thumbnail_png/ten-anh.jpg`.
- `slug` phải duy nhất, dùng chữ thường không dấu, số và dấu `-`.
- `draft: true` ẩn bản nháp; `false` xuất bản. Bài mới nhất theo `date` đứng trước.
- Chạy `npm.cmd run dev` để xem bài tại `/blog/vi/bai-viet-dau-tien/` và trên cả hai trang chủ.
- Sau khi commit/push, lần deploy tiếp theo tự build bài lên website. Lưu file local chưa tự đăng lên website public.

### Các bài cũ và quy ước chuyển đổi

Sáu bài chi tiết dự án đã dùng cùng định dạng `.md` trong `src/content/blog/`:

| Bài | File |
| --- | --- |
| Agentic RAG | `agentic-rag-system.md` |
| MCP | `agentic-mcp.md` |
| Stock Forecasting | `agentic-stock-forecasting-system.md` |
| Diabetes | `diabetes-health-indicator-analysis.md` |
| Fake News | `fake-news-detection.md` |
| Skin Cancer | `skin-cancer-detection.md` |

Mở bài RAG để xem ví dụ ngắn. Metadata nằm giữa hai dòng `---`; nội dung nằm bên dưới. Bài cũ có thêm:

```yaml
kind: project
preset: project
permalink: /projects/Agentic_RAG_System/Agentic_RAG_System.html
```

`kind: project` giữ bài ở phần dự án, `permalink` giữ URL và đường dẫn ảnh cũ. `preset` chọn khung hiển thị có sẵn (`project`, `project-mcp`, `project-stock`, `project-formatted`). Bài blog mới dùng mẫu phía trên; không cần ba trường này. Chỉ các bài blog thông thường xuất hiện trong danh sách Blog trên cả EN/VN. Các bài cũ chỉ có năm 2026 nên không thêm ngày đăng giả.

Ảnh tương đối như `proj1_banner.png` trong bài cũ tiếp tục hoạt động nhờ URL được giữ nguyên. Khi tạo bài hoặc đổi URL, dùng đường dẫn bắt đầu bằng `/`, ví dụ `/projects/Agentic_RAG_System/proj1_banner.png`.

Quy tắc chuyển HTML sang Markdown:

| HTML cũ | Markdown |
| --- | --- |
| `<h2>Tổng quan</h2>` | `## Tổng quan` |
| `<p>Nội dung</p>` | Một đoạn văn, cách đoạn kế tiếp bằng dòng trống |
| `<strong>Chữ đậm</strong>` | `**Chữ đậm**` |
| `<ul><li>Một mục</li></ul>` | `- Một mục` |
| `<code>tên_hàm</code>` | Dùng dấu backtick bao quanh `tên_hàm` |

Giữ HTML trực tiếp cho bảng có tô màu, khung ảnh/chú thích, nút hoặc link có thuộc tính riêng như `target="_blank"`. Markdown hỗ trợ cách viết kết hợp này. Để một dòng trống trước và sau khối HTML; đừng đặt Markdown bên trong thẻ HTML trên cùng một dòng. Class tiêu đề và danh sách của bài dự án được áp dụng chung trong `src/lib/markdown.js`; cấu hình khung trang nằm ở `src/modules/article/presets.js`.

Bài blog mới dùng Markdown thuần như mẫu đầu mục; layout tự tạo tiêu đề, ngày và ảnh đầu bài. Khi tham khảo nội dung bài dự án cũ, chỉ sao chép phần Markdown cần dùng, không cần sao chép khung `<main>`, `<article>` hoặc header HTML.

## Deploy và chat

Đưa source vào gốc repo. Với Vercel, dùng repository root, Build Command `npm run build`, Output Directory `dist`. `.gitignore` đã bỏ dependencies, output, cache và `.env`.

Chat dùng `/api/chat`; khai báo biến môi trường theo `.env.example`. Kiến thức chatbot nằm trong `api/knowledge.md`. Preview tĩnh không chạy API; dùng Vercel development runtime khi cần thử chat thật. Giữ khóa API ngoài Git.
