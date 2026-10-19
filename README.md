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

Projects: trang tự chia tối đa **4 dự án mỗi trang nhỏ**, lấy từ `items` trong `src/modules/projects/data.js`. Hiện có 6 dự án: trang 1 hiển thị 4, trang 2 hiển thị 2. Desktop hiển thị 2 cột, điện thoại 1 cột. Nút trái/phải chuyển trang, dừng ở hai đầu; trang đang xem được giữ khi đổi EN/VN hoặc quay lại từ chi tiết. `pageSize: 4` là cấu hình duy nhất cho số dự án mỗi trang.

### Thêm dự án và đưa dự án mới lên đầu

Mở `src/modules/projects/data.js`, thêm object mới vào **đầu mảng `items`**, ngay sau `"items": [` và trước dự án `Agentic_RAG_System` hiện tại. Ví dụ phần đầu của mảng sẽ là:

```javascript
"items": [
  {
    "id": "Du_An_Moi",
    "thumbnail": "thumbnail_png/du-an-moi.png",
    "github": "https://github.com/your-name/du-an-moi",
    "href": "projects/Du_An_Moi/Du_An_Moi.html",
    "tags": ["Python", "LangGraph"],
    "locales": {
      "en": {
        "title": "New Project",
        "summary": "A short description of the project.",
        "alt": "New project thumbnail"
      },
      "vi": {
        "title": "Dự án mới",
        "summary": "Mô tả ngắn về dự án.",
        "alt": "Ảnh minh họa dự án mới"
      }
    }
  },
  // Giữ toàn bộ các object dự án hiện có ở bên dưới.
]
```

- Mảng `items` chính là thứ tự hiển thị từ trái sang phải, từ trên xuống dưới và lần lượt sang các trang tiếp theo. Thêm ở đầu để dự án mới nằm ở ô đầu trang 1; thêm ở cuối sẽ nằm ở trang cuối. Không có bước tự sắp xếp theo ngày.
- Muốn thay đổi thứ tự, di chuyển **toàn bộ object dự án** tới vị trí mong muốn; không cần đổi `id` hay thêm số thứ tự. Mỗi `id` phải duy nhất.
- Đặt ảnh của ví dụ tại `public/thumbnail_png/du-an-moi.png`. `thumbnail` dùng đường dẫn trên website, bỏ phần `public/`. Thay GitHub, tag và hai bản dịch bằng nội dung thực tế.
- Không cần tạo HTML riêng hoặc sửa JavaScript để thêm card vào cả EN/VN. Nếu cần trang chi tiết mới, tạo Markdown theo hướng dẫn bài dự án bên dưới, đặt `permalink: /projects/Du_An_Moi/Du_An_Moi.html` để khớp với `href` trong ví dụ.
- Khi xem sau khi thêm, dùng URL không có `?projectPage=...` hoặc bấm về trang 1: trang web vẫn nhớ trang đang xem khi bạn đổi ngôn ngữ hay quay lại từ chi tiết.

### Thêm section

Tạo folder `src/modules/<id>/` có `data.js` và `template.njk`, đăng ký dữ liệu trong `src/_data/modules.js`, rồi thêm `{ id, template: 'modules/<id>/template.njk', enabled: true }` vào `src/_data/sections.js`. Template cần `id` trùng registry. Nhãn navbar lấy từ `navigation` trong `data.js`.

## Sửa chức năng

`src/client/home.js` khởi tạo các tính năng; mỗi file trong `src/client/features/` giữ state và sự kiện riêng. Nội dung và bản dịch vẫn lấy từ `src/modules/`, không đặt trong hàm xử lý.

| Chức năng | Nơi sửa |
| --- | --- |
| Theme, nhạc, gõ chữ, spotlight, scroll reveal, đổi ngôn ngữ | File tương ứng trong `src/client/features/` |
| Lưới và phân trang dự án | `src/client/features/projects.js`, `src/styles/projects.css` |
| Ô hỏi AI trong Contact | `src/modules/contact/`, `src/client/features/contact.js`, `src/styles/contact.css` |
| Hiệu ứng câu hỏi bay vào chatbot | `src/client/features/contact/flight.js` |
| Chọn, hiển thị và tự đổi các câu hỏi nhanh | `src/client/features/contact/suggestions.js` |
| Bảng cài đặt dưới icon bánh răng | `src/_includes/components/settings.njk`, `src/client/features/settings.js`, `src/styles/settings.css` |
| Liquid Glass và độ trong suốt | `src/client/features/glass.js`, `src/styles/glass.css` |
| Chọn màu chữ Settings theo nền phía sau | `src/client/features/glass-contrast.js` |
| Gửi chat, cooldown và countdown | `src/client/features/chat.js` |
| Lịch sử chat, thời hạn phiên, localStorage | `src/client/features/chat/session.js` |
| Hiển thị chat, nút và nhập tin nhắn | `src/client/features/chat/view.js` |
| Theme và quay lại trong các bài viết | `src/modules/article/scripts/article-theme-toggle.js`, `article-back.js` |
| Kiểm tra nội dung, lọc bài và section khi build | `src/lib/content.js` |
| Chuyển dữ liệu nội dung thành cấu hình trình duyệt | `src/lib/client-config.js` |
| HTTP API, gọi model, prompt và kiến thức chatbot | `server/chat/` (route: `api/chat.js`) |

Sự kiện chat được gắn trong module JavaScript, dùng chung cho cả EN/VN. Các preset bài viết dùng chung logic theme/quay lại; khác biệt bố cục nằm trong template và CSS.

Ô hỏi AI ở Contact dùng chung chatbot, lịch sử và giới hạn gửi với nút chat góc dưới bên phải. Nhấn Enter hoặc nút mũi tên để gửi; câu hỏi bay về nút chat rồi mở cuộc trò chuyện. Quầng sáng AI Aurora chuyển động bằng CSS trong `src/styles/contact.css`. Khi bật chế độ giảm chuyển động của thiết bị, quầng sáng đứng yên và câu hỏi được gửi trực tiếp. Các nhãn và placeholder sửa một lần trong `src/modules/contact/data.js`.

Ba từ khóa bên dưới ô nhập được chọn ngẫu nhiên từ mảng `suggestions` trong `src/modules/contact/data.js`. Hiện có **12 câu hỏi** dựa trên thông tin trong `api/knowledge.md`. Khi Contact xuất hiện trên màn hình, cứ **7 giây** ba từ khóa mờ đi rồi hiện ba mục mới, không trùng với lượt trước. Việc đổi tạm dừng khi di chuột hoặc đặt focus vào ô nhập/các từ khóa, đang nhập nội dung, gõ tiếng Việt bằng IME, gửi câu hỏi, Contact ra ngoài màn hình hoặc tab bị ẩn. Bật chế độ giảm chuyển động của thiết bị sẽ chỉ chọn ngẫu nhiên lúc tải trang, không tự đổi tiếp. Bấm một từ khóa gửi câu hỏi đầy đủ qua cùng chatbot; các nút dùng chung cài đặt Liquid Glass.

Muốn thêm, sửa hoặc xóa câu hỏi, chỉ chỉnh mảng `suggestions` trong file dữ liệu Contact; cả EN/VN cùng cập nhật, không cần sửa HTML hay hàm xử lý. Mỗi mục có `id` duy nhất, `label` là nhãn ngắn và `question` là câu hỏi gửi đi; cả hai đặt bản dịch `{ en: '...', vi: '...' }` cạnh nhau. Giữ ít nhất ba mục để hiển thị đủ ba từ khóa. Với danh sách bốn hoặc năm mục, mỗi lượt ưu tiên các mục mới rồi giữ lại đủ số mục cũ cần thiết; danh sách chỉ có ba mục sẽ đứng yên. Khi thêm chủ đề mới, cập nhật `api/knowledge.md` nếu chatbot chưa có thông tin để trả lời. Cách chọn, hiển thị và tự đổi nằm riêng trong `src/client/features/contact/suggestions.js`; `contact.js` chỉ điều phối nhập/gửi và kết nối chatbot. Chu kỳ đổi và thời gian mờ được đặt ở đầu module gợi ý.

Icon bánh răng bên phải navbar mở các nút ngôn ngữ, sáng/tối, nhạc và Liquid Glass. Mức kính mặc định là 60%; tăng phần trăm để thấy nền rõ hơn. Công tắc Liquid Glass tắt toàn bộ blur và lớp phản chiếu của kính, dùng bề mặt đặc; bật lại giữ mức phần trăm đã chọn. Lựa chọn kính được lưu trong trình duyệt, dùng chung khi tải lại, đổi ngôn ngữ hoặc mở bài viết. Trang bài viết có cài đặt theme/kính; vùng đọc và ảnh vẫn giữ độ rõ. Nhãn EN/VN của bảng nằm trong `src/modules/interface/data.js`.

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
