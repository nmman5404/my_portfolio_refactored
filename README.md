# Portfolio

Website EN/VN dùng chung dữ liệu và template. JavaScript chia thành ES module; blog viết bằng Markdown tiếng Việt.

## Chạy trên máy

Cần Node.js 24.x (cùng phiên bản major với cấu hình Vercel). Lần đầu chạy:

```powershell
npm.cmd ci
npm.cmd run dev
```

Mở địa chỉ terminal hiển thị. Lưu file sẽ tự cập nhật. Trên macOS/Linux dùng `npm` thay `npm.cmd`.

Tailwind được compile/minify thành CSS local sau khi render HTML, không tải compiler từ CDN trong trình duyệt. Cả dev và production dùng cùng pipeline; class trong dữ liệu module, Markdown và client JavaScript đều được quét khi build. Cấu hình nằm ở `tailwind.config.js`, bước compile ở `scripts/styles.mjs`.

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
| Học vấn, chứng chỉ | `src/modules/experience/data.js` |
| Các node Work Experience | `src/modules/experience/work.js` |
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
    "articleId": "du-an-moi",
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
- `articleId` phải khớp `slug` của bài Markdown đã xuất bản. Card có trường này sẽ hiện nút **Tóm tắt** cạnh Repo/Chi Tiết. Bỏ trường này nếu dự án chưa có bài để chatbot đọc. Prompt ngắn của nút sửa tại `summary.prompt` trong cùng file; `{title}` tự lấy tên dự án theo EN/VN.
- Khi xem sau khi thêm, dùng URL không có `?projectPage=...` hoặc bấm về trang 1: trang web vẫn nhớ trang đang xem khi bạn đổi ngôn ngữ hay quay lại từ chi tiết.

### Sửa và mở rộng Work Experience

Mỗi object trong `src/modules/experience/work.js` là một node. Thứ tự mảng là thứ tự hiển thị, dùng chung cho EN/VN. Thêm, xóa hoặc di chuyển nguyên object tại đây; không cần sửa HTML. Ví dụ một mục mới:

```javascript
{
  id: 'new-role',
  year: '2027',
  title: { en: 'Role title', vi: 'Tên vị trí' },
  dates: 'MM/YYYY - MM/YYYY',
  organization: 'Tên tổ chức',
  description: { en: 'A short description.', vi: 'Mô tả công việc.' },
  href: 'https://example.com/role',
  detailsSize: 'wide'
}
```

`id` phải duy nhất. `href` không bắt buộc: có link thì bấm node sẽ mở tab mới; bỏ trường này để node chỉ hiện chi tiết khi hover, focus bằng bàn phím hoặc chạm. Có thể dùng `{ en: '...', vi: '...' }` cho link và nội dung cần dịch. Năm mục hiện tại giữ nguyên nội dung và chưa thêm link thay bạn. `detailsSize` nhận `compact` (mặc định) hoặc `wide`. Timeline tự chia tối đa 5 node/hàng khi thêm nhiều mục; popup được giới hạn trong chiều rộng hàng để xem được trên điện thoại.

Giao diện toàn timeline nằm tại `src/modules/experience/timeline.njk`, giao diện một node tại `node.njk`, CSS tại `src/styles/experience.css`. Phần học vấn vẫn sửa riêng trong `data.js`.

### Thêm section

Tạo folder `src/modules/<id>/` có `data.js` và `template.njk`, đăng ký dữ liệu trong `src/_data/modules.js`, rồi thêm `{ id, template: 'modules/<id>/template.njk', enabled: true }` vào `src/_data/sections.js`. Template cần `id` trùng registry. Nhãn navbar lấy từ `navigation` trong `data.js`.

## Sửa chức năng

`src/client/home.js` khởi tạo các tính năng; mỗi file trong `src/client/features/` giữ state và sự kiện riêng. Nội dung và bản dịch vẫn lấy từ `src/modules/`, không đặt trong hàm xử lý.

| Chức năng | Nơi sửa |
| --- | --- |
| Theme, nhạc, gõ chữ, spotlight, scroll reveal, đổi ngôn ngữ | File tương ứng trong `src/client/features/` |
| Lưới và phân trang dự án | `src/client/features/projects.js`, `src/styles/projects.css` |
| Node và popup Work Experience | `src/modules/experience/work.js`, `timeline.njk`, `node.njk`, `src/styles/experience.css` |
| Ô hỏi AI trong Contact | `src/modules/contact/`, `src/client/features/contact.js`, `src/styles/contact.css` |
| Hiệu ứng câu hỏi bay vào chatbot | `src/client/features/contact/flight.js` |
| Nút Tóm tắt bài viết | `src/modules/article/data.js`, `src/modules/article/components/article-summary.njk`, `src/client/features/article-summary.js` |
| Nút Tóm tắt Featured Projects | `src/modules/projects/data.js`, `card.njk`, `src/client/features/project-summary.js` |
| Giao diện và luồng gửi Tóm tắt dùng chung | `src/_includes/components/summary-button.njk`, `src/styles/summary.css`, `src/client/features/summary.js` |
| Glow dùng chung cho Contact và Tóm tắt | `src/modules/contact/glow.njk`, `src/styles/ai-glow.css` |
| Chọn, hiển thị và tự đổi các câu hỏi nhanh | `src/client/features/contact/suggestions.js` |
| Bảng cài đặt dưới icon bánh răng | `src/_includes/components/settings.njk`, `src/client/features/settings.js`, `src/styles/settings.css` |
| Liquid Glass và độ trong suốt | `src/client/features/glass.js`, `src/styles/glass.css` |
| Chọn màu chữ Settings theo nền phía sau | `src/client/features/glass-contrast.js` |
| Gửi chat, cooldown và countdown | `src/client/features/chat.js` |
| Lịch sử chat, thời hạn phiên, localStorage | `src/client/features/chat/session.js` |
| Hiển thị chat, nút và nhập tin nhắn | `src/client/features/chat/view.js` |
| Nền kính của khung chat, ô nhập và bong bóng tin nhắn | `src/styles/chat.css` |
| Theme và quay lại trong các bài viết | `src/modules/article/scripts/article-theme-toggle.js`, `article-back.js` |
| Kiểm tra nội dung, lọc bài và section khi build | `src/lib/content.js` |
| Chuyển dữ liệu nội dung thành cấu hình trình duyệt | `src/lib/client-config.js` |
| HTTP API, gọi model, prompt và kiến thức chatbot | `server/chat/` (route: `api/chat.js`) |

Sự kiện chat được gắn trong module JavaScript, dùng chung cho cả EN/VN. Các bài dự án dùng chung khung trang, logic theme/quay lại và CSS. Storage là tùy chọn: dữ liệu lưu bị lỗi hoặc trình duyệt chặn lưu không làm dừng các tính năng khác.

Ô hỏi AI ở Contact dùng chung chatbot, lịch sử và giới hạn gửi với nút chat góc dưới bên phải. Nhấn Enter hoặc nút mũi tên để gửi; câu hỏi bay về nút chat rồi mở cuộc trò chuyện. Năm nguồn sáng AI Aurora nằm trong `src/modules/contact/glow.njk`, chuyển động bằng CSS trong `src/styles/ai-glow.css`; kiểu bong bóng bay nằm trong `src/styles/chat-entry.css`. Hai hiệu ứng được dùng chung với nút Tóm tắt bài viết. Khi bật chế độ giảm chuyển động của thiết bị, quầng sáng đứng yên và câu hỏi được gửi trực tiếp. Các nhãn và placeholder sửa một lần trong `src/modules/contact/data.js`.

Ba từ khóa bên dưới ô nhập được chọn ngẫu nhiên từ mảng `suggestions` trong `src/modules/contact/data.js`. Hiện có **12 câu hỏi** dựa trên thông tin trong `api/knowledge.md`. Khi Contact xuất hiện trên màn hình, cứ **7 giây** ba từ khóa mờ đi rồi hiện ba mục mới, không trùng với lượt trước. Việc đổi tạm dừng khi di chuột hoặc đặt focus vào ô nhập/các từ khóa, đang nhập nội dung, gõ tiếng Việt bằng IME, gửi câu hỏi, Contact ra ngoài màn hình hoặc tab bị ẩn. Bật chế độ giảm chuyển động của thiết bị sẽ chỉ chọn ngẫu nhiên lúc tải trang, không tự đổi tiếp. Bấm một từ khóa gửi câu hỏi đầy đủ qua cùng chatbot; các nút dùng chung cài đặt Liquid Glass.

Muốn thêm, sửa hoặc xóa câu hỏi, chỉ chỉnh mảng `suggestions` trong file dữ liệu Contact; cả EN/VN cùng cập nhật, không cần sửa HTML hay hàm xử lý. Mỗi mục có `id` duy nhất, `label` là nhãn ngắn và `question` là câu hỏi gửi đi; cả hai đặt bản dịch `{ en: '...', vi: '...' }` cạnh nhau. Giữ ít nhất ba mục để hiển thị đủ ba từ khóa. Với danh sách bốn hoặc năm mục, mỗi lượt ưu tiên các mục mới rồi giữ lại đủ số mục cũ cần thiết; danh sách chỉ có ba mục sẽ đứng yên. Khi thêm chủ đề mới, cập nhật `api/knowledge.md` nếu chatbot chưa có thông tin để trả lời. Cách chọn, hiển thị và tự đổi nằm riêng trong `src/client/features/contact/suggestions.js`; `contact.js` chỉ điều phối nhập/gửi và kết nối chatbot. Chu kỳ đổi và thời gian mờ được đặt ở đầu module gợi ý.

Icon bánh răng bên phải navbar mở các nút ngôn ngữ, sáng/tối, nhạc và Liquid Glass. Mức kính mặc định là 60%; tăng phần trăm để thấy nền rõ hơn. Công tắc Liquid Glass tắt toàn bộ blur và lớp phản chiếu của kính, dùng bề mặt đặc; bật lại giữ mức phần trăm đã chọn. Lựa chọn kính được lưu trong trình duyệt, dùng chung khi tải lại, đổi ngôn ngữ hoặc mở bài viết. Trang bài viết có cài đặt theme/kính; vùng đọc và ảnh vẫn giữ độ rõ. Nhãn EN/VN của bảng nằm trong `src/modules/interface/data.js`.

Vật liệu kính dùng chung nằm trong `src/styles/glass.css`: `.glass-surface` tạo nền xuyên, viền phản sáng và mép tối; `.glass-control` dùng cho nút/thanh điều khiển, `.glass-reading` dành cho khung nhiều nội dung. Hover trên thiết bị có chuột hoặc focus bằng bàn phím làm nhòe nền ngay bên dưới từng bề mặt kính; chữ, ảnh và các khu vực khác vẫn rõ. Các switch và thanh phần trăm được tạo hình riêng trong `src/styles/settings.css`. Mức 0% là nền đặc; 100% bỏ lớp màu phủ và lớp màu che hình nền, giảm blur khi đứng yên xuống 0.25–0.75px tùy bề mặt. Phản chiếu và bóng cũng giảm dần gần 100%, còn viền kính mảnh; hover ở mức này chỉ tăng thêm 2px blur cục bộ. Khung chat cũng giảm độ phủ khi tăng phần trăm, nhưng bong bóng giữ một lớp màu để đọc tin nhắn. Off tắt cả vật liệu kính lẫn hiệu ứng blur khi hover.

Các nút About Me/View Projects, Repo/Read More, tag kỹ năng và nút mở chatbot dùng `.glass-optional`: vật liệu chỉ áp dụng khi bật Liquid Glass. `.glass-pill` bo tròn kiểu capsule khi bật, `.glass-accent` thêm màu xanh nhẹ cho nút chính. Ba nút Email, LinkedIn, GitHub ở Contact cũng dùng các profile này và giữ nguyên đích liên kết. Khi Off, các class giao diện gốc tự hoạt động trở lại, giữ màu, bo góc và kích thước cũ. Nền vùng tin nhắn chatbot để trong suốt khi bật kính; header, ô nhập và bong bóng dùng lớp màu nhẹ để dễ đọc, được chỉnh riêng trong `src/styles/chat.css`.

## Viết blog

Nền sáng/tối của tất cả trang bài viết (blog và chi tiết dự án) sửa tại `src/modules/article/data.js`, trong `background.light` / `background.dark`. Hai ảnh ở `public/backgrounds/articles/light.jpg` và `dark.jpg` ban đầu là bản sao ảnh trang chủ; thay ảnh hoặc đường dẫn tại đây sẽ chỉ đổi nền bài viết. Layout/nền nằm trong `src/modules/article/components/article-background.njk` và `src/modules/article/styles/article.css`. Các trang dùng chung cài đặt theme và Liquid Glass với trang chủ.

Nút GitHub trong bài viết dùng `glass-optional glass-control glass-pill glass-accent` cùng các class nút gốc, giống nút Repo trên trang chủ. Khi Off, nút trở về kiểu xanh và bo góc cũ.

Mỗi bài có chatbot và nút **Tóm tắt**. Với bài có repo, thêm `data-article-repo` vào thẻ `<a>` của nút GitHub để Tóm tắt đứng cạnh nó (sáu bài cũ đã có). Bài Markdown thông thường không có repo sẽ tự hiện Tóm tắt dưới nội dung. Không cần viết JavaScript cho bài mới. Nhãn và câu hỏi ngắn hiện trong chat sửa tại `src/modules/article/data.js`; hướng dẫn tóm tắt đầy đủ nằm phía server trong `server/chat/prompt.js`, không đưa vào bong bóng tin nhắn. Tóm tắt chỉ trả nội dung, không gợi ý thêm câu hỏi. Lời chào chatbot bài viết sửa tại `src/modules/chat/data.js`, trường `articleWelcome`. Cả nút và chatbot dùng chung cài đặt Liquid Glass với trang chủ.

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

`kind: project` giữ bài ở phần dự án, `permalink` giữ URL và đường dẫn ảnh cũ. `preset: project` chọn khung dùng chung cho sáu bài dự án. Bài blog mới dùng mẫu phía trên; không cần ba trường này. Chỉ các bài blog thông thường xuất hiện trong danh sách Blog trên cả EN/VN. Các bài cũ chỉ có năm 2026 nên không thêm ngày đăng giả.

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

1. Push nội dung folder `portfolio-refactored` thành một GitHub repo độc lập. Ở gốc repo cần có `package.json`, `vercel.json`, `src/`, `public/`, `api/` và `server/`.
2. Trong Vercel chọn **Add New → Project**, import GitHub repo. Giữ **Root Directory** là gốc repo (không chọn `src` hoặc `dist`). `vercel.json` đã khai báo **Build Command** `npm run build` và **Output Directory** `dist`; `package.json` cố định Node.js `24.x`.
3. Trong **Environment Variables**, thêm **`GEMINI_API_KEY`** với khóa Gemini hợp lệ cho Production và Preview nếu dùng. `GEMINI_MODEL_NAME` không bắt buộc; mặc định là `gemini-3.1-flash-lite`. Không tạo biến có tiền tố public và không commit khóa.
4. Chọn **Deploy**. Những lần push tiếp theo tự build lại trang và các bài Markdown. Nếu thêm hoặc đổi biến môi trường sau khi deploy, thực hiện **Redeploy**.

`.gitignore` loại dependencies, output, cache và `.env`; chỉ push source cùng `package-lock.json`. Vercel cài dependencies và tạo `dist/` khi build, không cần upload thư mục này. [Cấu hình Node.js trên Vercel](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions).

Tailwind được giữ ở major 3 để bảo toàn giao diện hiện tại. `npm audit --omit=dev` không có cảnh báo cho dependencies production; audit đầy đủ hiện còn 8 cảnh báo ở chuỗi công cụ build (6 high, 2 moderate). `braces` chưa có bản vá; không ép nâng major hoặc dùng `audit fix --force` vì có thể đổi CSS và hành vi build. Các công cụ này chỉ xử lý source của repo khi build, không nằm trong API hay chạy trong trình duyệt. [Advisory braces](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), [advisory PostCSS](https://github.com/advisories/GHSA-rj75-hqrm-r3gf).

Chat dùng Vercel Function `/api/chat`, gọi Gemini REST bằng native `fetch` của Node.js; không có SDK provider trong bundle. `vercel.json` đóng gói `api/knowledge.md` và `src/content/blog/**/*.md` cùng function và cho phép chạy tối đa 60 giây; request tới model dừng sau 45 giây. Giữ nguyên đầu nhận `GEMINI_API_KEY` và model mặc định. API kiểm tra dữ liệu trước khi gửi, giới hạn độ dài câu hỏi/lịch sử và không trả chi tiết lỗi provider ra trình duyệt.

Ngữ cảnh theo trang:

- **Trang chủ:** mặc định chỉ `api/knowledge.md` và các tin nhắn gần nhất. Khi bấm **Tóm tắt** trên một card dự án, chỉ request đó bổ sung Markdown của dự án được chọn. Những câu hỏi tiếp theo không gửi lại Markdown, chỉ dùng knowledge cùng lịch sử chứa bản tóm tắt để tiết kiệm token. Nếu hỏi chi tiết ngoài phần tóm tắt, trợ lý phải nói rõ là thiếu thông tin; bấm Tóm tắt lần nữa sẽ nạp lại bài cho request mới. Mỗi lần gửi tối đa 6 tin nhắn lịch sử nên các ý cũ có thể ra khỏi ngữ cảnh sau nhiều lượt.
- **Trang bài viết:** knowledge cá nhân và Markdown đầy đủ của đúng bài đang mở. Trình duyệt chỉ gửi `articleId` từ `slug`; server tự tra bài trong `src/content/blog/`, không nhận đường dẫn hoặc nội dung Markdown từ người dùng. Bài nháp, slug sai hoặc không tồn tại bị từ chối trước khi gọi Gemini.
- Mỗi bài có lịch sử riêng, tách khỏi trang chủ. Cooldown và giới hạn số tin nhắn vẫn dùng chung giữa các trang; đổi bài không đặt lại hạn mức. Lịch sử hết hạn sau 5 phút không hoạt động. Đây là giới hạn phía trình duyệt, không phải quota hay rate limit bảo mật phía server.

Instruction nằm tại `server/chat/prompt.js`, được gửi bằng trường `systemInstruction` riêng với dữ liệu. Trợ lý trả lời tự nhiên, dựa trên nguồn đã cung cấp; có thể giải thích khái niệm/code/toán liên quan bài, nhưng phải phân biệt giải thích chung với chi tiết tác giả thực sự viết. Khi thiếu thông tin hoặc câu hỏi ngoài phạm vi, trợ lý nói rõ và hướng về nội dung phù hợp. Nút Tóm tắt gửi câu hỏi ngắn và `action: 'summarize'` qua cùng luồng chat và hiệu ứng bay, không gọi một API riêng. Server chỉ chấp nhận action này khi có `articleId` hợp lệ, rồi thêm hướng dẫn tóm tắt đầy đủ vào `systemInstruction`; không yêu cầu thêm câu hỏi gợi ý. Đầu ra model giới hạn 2.048 token. Bộ đọc YAML và cache bài viết nằm tại `server/chat/articles.js`. Sau khi thêm/sửa Markdown, push để Vercel deploy lại cả trang và ngữ cảnh chatbot.

Preview tĩnh chỉ kiểm tra giao diện, không chạy `/api/chat`. Để thử chatbot thật trên máy, khai báo biến theo `.env.example` trong `.env.local` rồi dùng Vercel development runtime. Khi thiếu khóa, API trả thông báo tạm không khả dụng; phần giao diện vẫn hoạt động.
