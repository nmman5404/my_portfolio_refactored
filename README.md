# Portfolio — hướng dẫn chỉnh sửa

Portfolio EN/VI dùng chung dữ liệu và template; JavaScript chia thành ES module. Blog và bài dự án viết bằng Markdown tiếng Việt. Eleventy tạo HTML tĩnh khi build, còn chatbot chạy qua Vercel Function `/api/chat`.

## 1. Chạy trên máy và đưa lên Vercel

Cần **Node.js 24.x**. Mở terminal tại gốc repo:

```powershell
npm.cmd ci
npm.cmd run dev
```

Mở địa chỉ terminal hiển thị, thường là `http://localhost:8080/`; lưu source sẽ tự build lại. Trang EN ở `/`, trang VI ở `/vi.html` (trên Vercel có URL gọn `/vi`). Trên macOS/Linux dùng `npm` thay `npm.cmd`.

Kiểm tra bản production:

```powershell
npm.cmd run build
npm.cmd run preview
```

Preview ở `http://127.0.0.1:4173`. Hai server trên chỉ phục vụ trang tĩnh; **không chạy API Gemini**. Muốn thử chatbot thật trên máy, dùng Vercel CLI (`vercel dev`) và biến môi trường trong `.env.local`, tham khảo `.env.example`.

| Thư mục/file | Vai trò |
| --- | --- |
| `src/modules/` | Nội dung, template và một số style/script của từng phần |
| `src/content/blog/` | Markdown blog và bài chi tiết dự án |
| `src/client/` | JavaScript ES module chạy trong trình duyệt |
| `src/styles/` | CSS dùng chung/trang chủ |
| `public/` | Ảnh, nhạc; được copy nguyên đường dẫn vào website |
| `api/chat.js`, `server/chat/` | Route API và logic chatbot phía server |
| `dist/` | Kết quả build tự sinh; có thể xóa rồi build lại |
| `node_modules/` | Dependencies cài bằng `npm ci`; không đưa lên Git |

**Sửa source, không sửa `dist/`.** Trong đường dẫn dùng trên website, bỏ phần `public/`: file `public/thumbnail_png/avatar.jpg` có URL `/thumbnail_png/avatar.jpg`. Dùng dấu `/` và giữ đúng chữ hoa/thường để chạy được trên Vercel.

Deploy repo GitHub này vào Vercel với **Root Directory là gốc repo**, không chọn `src` hay `dist`. `vercel.json` đã khai báo install `npm ci --include=dev`, build `npm run build`, output `dist`; `package.json` chọn Node.js `24.x`.

- `GEMINI_API_KEY`: khóa phía server, giữ biến đã có trên Vercel. Không đưa khóa vào source hoặc biến public.
- `GEMINI_MODEL_NAME`: tùy chọn; mặc định `gemini-3.1-flash-lite`.
- Push lên nhánh được Vercel theo dõi sẽ tự build/deploy nội dung mới. Thay biến môi trường thì Redeploy. **Lưu file trên máy chưa đăng bài lên website public.**

`.gitignore` đã loại output, dependencies, cache, log và `.env`; vẫn giữ `package-lock.json` và `.env.example` trong repo.

## 2. Bản đồ nội dung: cần sửa gì, mở đâu?

| Muốn chỉnh | File và trường chính |
| --- | --- |
| Tên, giới thiệu đầu trang, chức danh chạy chữ, nút About/Projects | `src/modules/profile/data.js`: `name`, `description`, `roles`, `actions` |
| About Me, ảnh chân dung, quote | `src/modules/about/data.js`: `avatar`, `quote`, `paragraphs` |
| Card dự án, thứ tự, số dự án/trang, prompt Tóm tắt | `src/modules/projects/data.js`: `items`, `pageSize`, `summary` |
| Nhóm kỹ năng, tag con, từng skill | `src/modules/skills/data.js`: `groups` |
| Học vấn, GPA, chứng chỉ | `src/modules/experience/data.js`: `education` |
| Các node Work Experience và link của node | `src/modules/experience/work.js` |
| Contact, nút Email/LinkedIn/GitHub, câu hỏi shuffle | `src/modules/contact/data.js`: `links`, `suggestions`, `search` |
| Bài blog/bài dự án và ảnh trong bài | `src/content/blog/*.md`, ảnh trong `public/` |
| Nhãn mục Blog và nút quay lại | `src/modules/blog/data.js` |
| Tiêu đề tab trình duyệt, footer, nhãn Settings | `src/modules/interface/data.js` |
| Nhạc sáng/tối, âm lượng, credit | `src/modules/audio/data.js` |
| Lời chào chat, nhãn, thông báo, giới hạn phía trình duyệt | `src/modules/chat/data.js` |
| Knowledge cá nhân cho AI | `api/knowledge.md` |
| Instruction AI, phạm vi trả lời, hướng dẫn tóm tắt/ngôn ngữ | `server/chat/prompt.js` |
| Nền trang chủ | `src/styles/backgrounds.css` và ảnh tương ứng trong `public/thumbnail_png/` |
| Nền riêng của tất cả trang bài viết | `src/modules/article/data.js`: `background` |
| Nút Tóm tắt trong bài viết: nhãn/prompt hiển thị | `src/modules/article/data.js`: `summary` |
| Thứ tự section, bật/tắt section | `src/_data/sections.js` |

Nội dung EN/VI đặt cạnh nhau trong **một file**, ví dụ:

```js
heading: { en: 'About Me', vi: 'Về Tôi' }
```

Giá trị không cần dịch như URL, ảnh, tên công nghệ viết một lần. Hai bản ngôn ngữ sẽ cùng được tạo khi build; nội dung dịch vẫn cần tự điền, website không tự dịch văn bản bạn mới thêm. Bố cục mỗi phần nằm trong `src/modules/<tên>/template.njk`.

## 3. Thêm, sửa, sắp xếp dự án

Mở `src/modules/projects/data.js`. Thêm object sau vào **đầu mảng `items`** để dự án xuất hiện đầu trang 1:

```js
{
  id: 'Du_An_Moi',
  articleId: 'du-an-moi',
  thumbnail: '/thumbnail_png/du-an-moi.png',
  github: 'https://github.com/your-name/du-an-moi',
  href: '/projects/Du_An_Moi/Du_An_Moi.html',
  tags: ['Python', 'LangGraph'],
  locales: {
    en: {
      title: 'New Project',
      summary: 'A short description of the project.',
      alt: 'New project thumbnail'
    },
    vi: {
      title: 'Dự án mới',
      summary: 'Mô tả ngắn về dự án.',
      alt: 'Ảnh minh họa dự án mới'
    }
  }
},
```

Đặt ảnh tại `public/thumbnail_png/du-an-moi.png`, rồi tạo Markdown chi tiết theo mục tiếp theo. Thay tên repo/ảnh/nội dung ví dụ bằng dữ liệu thật.

- **Thứ tự mảng là thứ tự hiển thị**, không tự sắp xếp theo ngày. Đưa nguyên object lên đầu để dự án mới xuất hiện trước; kéo object tới vị trí khác để đổi thứ tự. `id` phải duy nhất.
- `pageSize: 4` quy định tối đa 4 dự án/trang, desktop 2 cột và điện thoại 1 cột. Nút trái/phải tự xử lý khi thêm dự án.
- `href` là nơi nút Read More/Chi Tiết mở tới. `articleId` phải trùng `slug` của Markdown đã xuất bản để hiện và dùng nút Tóm tắt. Nếu chưa có bài, bỏ `articleId`.
- `summary.prompt` sửa câu ngắn hiện trong chat; `{title}` được thay bằng tên dự án theo EN/VI. Instruction tóm tắt đầy đủ nằm riêng ở server.
- Trang hiện tại được giữ trong `?projectPage=...` khi đổi ngôn ngữ/quay lại. Để kiểm tra dự án mới, về trang 1 hoặc bỏ query này khỏi URL.

### Tạo bài chi tiết cho dự án

Tạo `src/content/blog/du-an-moi.md`. Có thể lấy một trong sáu bài hiện có làm mẫu, chẳng hạn `agentic-rag-system.md`. Front matter cho card ở trên:

```yaml
---
title: "Dự án mới"
slug: "du-an-moi"
kind: "project"
preset: "project"
permalink: "/projects/Du_An_Moi/Du_An_Moi.html"
---
```

`kind: project` giữ bài trong phần dự án, không thêm vào danh sách Blog. `permalink` phải khớp `href` trên card. Bài dự án dùng khung trang chung nhưng **phần tiêu đề/banner bên trong bài do bạn viết**, như các bài cũ. Ví dụ phần nội dung sau front matter:

```markdown
<main class="max-w-4xl mx-auto px-6 pt-32 pb-20">

<h1 class="text-4xl font-bold text-gray-900 dark:text-white mb-6">Dự án mới</h1>

![Banner dự án](/projects/Du_An_Moi/banner.png)

## Tổng quan

Mục tiêu, cách làm và kết quả của dự án.

## Công nghệ

- Python
- LangGraph

<div class="mt-12 flex justify-center">
<a data-article-repo href="https://github.com/your-name/du-an-moi" target="_blank" rel="noopener noreferrer" class="glass-optional glass-control glass-pill glass-accent px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/40">Xem mã nguồn trên GitHub</a>
</div>

</main>
```

Đặt banner tại `public/projects/Du_An_Moi/banner.png`. Thuộc tính **`data-article-repo`** giúp nút Tóm tắt tự đứng cạnh nút repo; nếu không có repo, Tóm tắt hiện dưới nội dung. Không cần viết JavaScript cho bài mới.

Giữ các URL/`slug` cũ khi chỉ sửa nội dung. Ảnh tương đối của bài cũ như `proj1_banner.png` dựa vào `permalink`; bài mới nên dùng đường dẫn tuyệt đối từ gốc website như ví dụ trên.

## 4. Viết blog Markdown tiếng Việt

Tạo file `src/content/blog/bai-viet-dau-tien.md` với đầy đủ nội dung mẫu:

```markdown
---
title: "Bài viết đầu tiên"
slug: "bai-viet-dau-tien"
date: "2026-10-20"
summary: "Mô tả ngắn xuất hiện trong danh sách Blog trên trang chủ."
thumbnail: "/thumbnail_png/bai-viet-dau-tien.jpg"
draft: false
---

## Giới thiệu

Viết nội dung tiếng Việt ở đây. Có thể dùng **chữ đậm** và [liên kết](https://example.com).

## Các ý chính

- Ý thứ nhất.
- Ý thứ hai.

![Chú thích ảnh](/thumbnail_png/anh-trong-bai.jpg)
```

1. Thêm ảnh được tham chiếu vào `public/thumbnail_png/`.
2. Chạy dev, mở `/blog/vi/bai-viet-dau-tien/`. Layout tự tạo tiêu đề, ngày, ảnh đầu bài và chatbot.
3. Bài tự hiện trong mục Blog của **cả hai trang chủ**, nội dung vẫn là tiếng Việt. Blog chỉ xuất hiện khi có ít nhất một bài blog đã xuất bản; các bài `kind: project` không tính vào danh sách này.
4. Commit/push để Vercel build và đăng cả HTML lẫn ngữ cảnh bài cho chatbot.

`slug` phải duy nhất, dùng chữ thường không dấu/số/dấu `-`. `date` theo `YYYY-MM-DD` quyết định thứ tự blog: **ngày mới nhất đứng trước**. `draft: true` không tạo trang, không đưa vào danh sách hay ngữ cảnh AI; chuyển về `false` để xuất bản. Blog thông thường không cần khai báo `kind`/`permalink`: loại blog và URL đã có mặc định trong `src/content/blog/blog.11tydata.js`. `preset` chỉ cần cho bài dự án.

Muốn dùng một bài blog làm chi tiết cho card dự án, đặt `href: '/blog/vi/bai-viet-dau-tien/'` và `articleId: 'bai-viet-dau-tien'` trên card. Bài đó vẫn nằm trong danh sách Blog; dùng `kind: project` nếu muốn giữ riêng trong mục dự án.

### Tham khảo cách convert bài cũ

Sáu bài dự án đã thống nhất trong `src/content/blog/`: `agentic-rag-system.md`, `agentic-mcp.md`, `agentic-stock-forecasting-system.md`, `diabetes-health-indicator-analysis.md`, `fake-news-detection.md`, `skin-cancer-detection.md`.

| HTML cũ | Markdown tương ứng |
| --- | --- |
| `<h2>Tổng quan</h2>` | `## Tổng quan` |
| `<p>Nội dung</p>` | Một đoạn văn, cách đoạn sau bằng dòng trống |
| `<strong>Chữ đậm</strong>` | `**Chữ đậm**` |
| `<ul><li>Một mục</li></ul>` | `- Một mục` |
| `<img src="..." alt="...">` | `![Chú thích](đường-dẫn-ảnh)` |
| `<code>tên_hàm</code>` | Bao `tên_hàm` trong dấu backtick |

Giữ HTML cho bảng có style, khung ảnh/chú thích, nút hoặc link có thuộc tính riêng. Đặt dòng trống trước/sau khối HTML và giữa HTML với Markdown cần render. Blog mới dùng Markdown thuần thì không sao chép `<main>`, header hay `<article>` của bài dự án cũ. CSS blog nằm tại `src/modules/blog/styles/markdown.css`; kiểu bài dự án chung nằm tại `src/modules/article/styles/article.css` và `src/lib/markdown.js`.

## 5. Thêm skill, tag, kinh nghiệm và câu hỏi shuffle

### Skill và nhóm tag

Trong `src/modules/skills/data.js`, mỗi phần tử `groups` tạo một card. Sửa `skills` để thêm/bớt chip kỹ năng; thêm vào `tags` để có tiêu đề nhóm con cùng nhiều chip:

```js
{
  id: 'cloud',
  title: { en: 'Cloud & DevOps', vi: 'Cloud & DevOps' },
  iconPath: 'M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4',
  revealDelay: 200,
  skills: ['Docker', 'Git'],
  tags: [
    {
      title: { en: 'Cloud platforms', vi: 'Nền tảng Cloud' },
      skills: ['AWS', 'Azure']
    }
  ]
},
```

Đây là ví dụ **một group mới trong `groups`**; muốn bổ sung tag vào card hiện có thì chỉ thêm object `{ title, skills }` vào `groups[n].tags`. Kỹ năng cần dịch có thể viết `{ label: { en: '...', vi: '...' } }` thay cho chuỗi. Thứ tự mảng quyết định thứ tự hiển thị, giao diện tự xuống hàng khi thêm card/chip.

### Work Experience

Mỗi object trong `src/modules/experience/work.js` là một node. Thêm/sửa/xóa/di chuyển nguyên object tại đây:

```js
{
  id: 'new-role',
  year: '2027',
  title: { en: 'Role title', vi: 'Tên vị trí' },
  dates: '01/2027 - Present',
  organization: 'Tên tổ chức',
  description: { en: 'A short description.', vi: 'Mô tả công việc.' },
  href: 'https://example.com/role',
  detailsSize: 'wide'
},
```

`id` duy nhất; `href` không bắt buộc. Có link thì node mở tab mới khi bấm; bỏ link thì node chỉ hiện popup khi hover/focus/chạm. Các trường nội dung và `href` có thể dùng `{ en, vi }`. `detailsSize` là `compact` (mặc định) hoặc `wide`. Timeline tự chia tối đa 5 node/hàng. Học vấn/GPA/chứng chỉ nằm riêng ở `experience/data.js`, sao chép object cùng `kind` đang có để thêm mục.

### Gợi ý prompt ngẫu nhiên trong Contact

Mở `src/modules/contact/data.js`, thêm vào `suggestions`:

```js
{
  id: 'new-topic',
  label: { en: 'New topic', vi: 'Chủ đề mới' },
  question: {
    en: 'What can you tell me about this topic in Mẫn’s work?',
    vi: 'Chủ đề này liên quan thế nào đến công việc của Mẫn?'
  }
},
```

`label` là chữ ngắn trên nút, `question` là tin nhắn đầy đủ gửi vào chatbot; `id` duy nhất. Hiện có 12 câu, chọn 3 câu mỗi lượt và đổi sau 7 giây khi Contact đang hiện và người dùng không tương tác. Giữ ít nhất 3 câu; có từ 6 câu trở lên thì hai lượt liên tiếp không trùng mục. Danh sách 3 câu đứng yên; 4–5 câu sẽ giữ lại một phần để đủ 3 nút.

Đổi số nút/chu kỳ/fade tại đầu `src/client/features/contact/suggestions.js`: `VISIBLE_COUNT`, `ROTATION_INTERVAL_MS`, `FADE_DURATION_MS`. Khi thiết bị bật giảm chuyển động, danh sách chỉ random lúc tải, không tự đổi tiếp. Nếu thêm chủ đề chatbot chưa biết, cập nhật thêm `api/knowledge.md`; gợi ý không tự bổ sung knowledge.

## 6. Đổi ảnh nền, chân dung và nhạc

| Nội dung | Cách thay |
| --- | --- |
| Nền sáng trang chủ | Thay `public/thumbnail_png/light_bg.jpg` hoặc sửa URL ở `src/styles/backgrounds.css` |
| Nền tối trang chủ | Thay `public/thumbnail_png/dark_bg.jpg` hoặc sửa URL ở cùng file CSS |
| Nền sáng/tối các bài viết | Thay `public/backgrounds/articles/light.jpg`, `dark.jpg`; hoặc sửa `background.light`, `background.dark` trong `src/modules/article/data.js` |
| Ảnh chân dung | Thay ảnh hoặc đổi `avatar.src` trong `src/modules/about/data.js`; sửa `avatar.alt` nếu cần |
| Thumbnail dự án | Đổi `items[n].thumbnail` và hai trường `locales.*.alt` trong dữ liệu Projects |
| Nhạc sáng/tối | Thêm file vào `public/audio/`, sửa `tracks.light.url` / `tracks.dark.url` ở `src/modules/audio/data.js` |

Nền bài viết có file/cấu hình riêng nên đổi nền trang chủ không kéo theo đổi nền blog. Mọi bài viết hiện dùng cùng cặp nền từ module Article; chưa có cấu hình nền riêng cho từng bài.

Nhạc có `volume` từ `0` đến `1`, `loop` bật/tắt lặp, cùng `credit.url`, `credit.title`, `credit.author` cho từng track. Nhạc chỉ có trên trang chủ, chuyển track theo light/dark; trình duyệt có thể yêu cầu tương tác trước khi phát. Khi thay file, nên dùng tên mới rồi cập nhật URL để tránh cache cũ. Chọn ảnh đủ kích thước hiển thị và nén hợp lý; giữ ảnh/nhạc gốc cần dùng, bỏ file không còn được tham chiếu sau khi đã đổi đường dẫn.

## 7. Section, giao diện và hiệu ứng

### Đổi thứ tự hoặc thêm section

- **Đổi thứ tự:** di chuyển nguyên object trong `src/_data/sections.js`; thứ tự nội dung và navbar đi cùng nhau.
- **Ẩn:** đặt `enabled: false`. Nhãn menu nằm trong `navigation` của module. Số thứ tự cần tự sửa nếu muốn đánh số lại: đa số nằm ở trường `number` trong dữ liệu; riêng `02.` của Projects hiện nằm trong `src/modules/projects/template.njk`.
- **Thêm:** tạo `src/modules/services/data.js` và `template.njk`, import/register dữ liệu trong `src/_data/modules.js`, rồi thêm `{ id: 'services', template: 'modules/services/template.njk', enabled: true }` vào registry section.

Ví dụ dữ liệu module mới:

```js
export default {
  navigation: { en: 'Services', vi: 'Dịch vụ' },
  heading: { en: 'Services', vi: 'Dịch vụ' }
};
```

Template cần `<section id="services">` và lấy text bằng `localized(modules.services.heading, locale)`. Trong `src/_data/modules.js`, thêm `import services from '../modules/services/data.js'` rồi thêm `services` vào object export. Phần tĩnh không cần sửa client; nếu có tương tác mới, tạo feature riêng và gọi từ `src/client/home.js`. CSS mới có thể đưa vào `src/styles/` rồi nối trong `src/_includes/components/home-styles.njk`.

### Bản đồ chức năng và style

| Muốn chỉnh sâu hơn | Nơi xử lý |
| --- | --- |
| Khung trang chủ, navbar/footer | `src/_includes/layouts/home.njk`, `src/_includes/components/` |
| Card/lưới/phân trang Projects | `src/modules/projects/card.njk`, `src/client/features/projects.js`, `src/styles/projects.css` |
| Node/popup timeline | `src/modules/experience/node.njk`, `timeline.njk`, `src/styles/experience.css` |
| Search Contact | `src/modules/contact/template.njk`, `src/client/features/contact.js`, `src/styles/contact.css` |
| AI Aurora glow 5 nguồn sáng | `src/modules/contact/glow.njk`, `src/styles/ai-glow.css` |
| Tin nhắn bay vào chatbot | `src/client/features/contact/flight.js`, `src/styles/chat-entry.css` |
| Nút Tóm tắt dùng chung | `src/_includes/components/summary-button.njk`, `src/client/features/summary.js`, `src/styles/summary.css` |
| Gắn Tóm tắt vào card/bài viết | `src/client/features/project-summary.js`, `article-summary.js` |
| Settings, switch và thanh độ trong | `src/_includes/components/settings.njk`, `src/client/features/settings.js`, `src/styles/settings.css` |
| Chất liệu Liquid Glass, độ trong/blur/hover | `src/styles/glass.css`, `src/client/features/glass.js` |
| Màu chữ Settings theo nền phía sau | `src/client/features/glass-contrast.js` |
| Sáng/tối, đổi ngôn ngữ, nhạc, gõ chữ, reveal, spotlight | File tương ứng trong `src/client/features/` |
| Khung bài viết dùng chung | `src/modules/article/layouts/article.njk`, `presets.js` |
| CSS Tailwind được build local | `tailwind.config.js`, `scripts/styles.mjs` |

Settings cho người xem điều chỉnh ngôn ngữ, theme, nhạc và kính trên trang chủ; bài viết có theme/kính. Liquid Glass mặc định bật ở 60%, tăng tới 100% để nền trong hơn; Off về bề mặt thường. Lựa chọn kính/theme lưu trong trình duyệt. Hover chỉ làm mờ nền ngay dưới ô kính đang tương tác. Các nút/tag dùng `.glass-optional` để trở lại giao diện gốc khi Off.

Nếu đổi **mặc định** kính, kiểm tra đồng bộ `src/modules/interface/critical/glass-bootstrap.js`, `src/client/features/glass.js` và giá trị ban đầu của control trong `settings.njk`; `glass.css`/`settings.css` cũng có fallback. Mặc định theme đọc cài đặt thiết bị khi chưa có lựa chọn lưu, qua `theme-bootstrap.js` và script theme của Article. Muốn kiểm tra mặc định mới, xóa lựa chọn đã lưu hoặc dùng cửa sổ riêng tư.

## 8. Chỉnh chatbot và ngữ cảnh AI

| Mục | File |
| --- | --- |
| Kiến thức cá nhân, kỹ năng, liên hệ | `api/knowledge.md` |
| System instruction, ngôn ngữ trả lời, phạm vi và task tóm tắt | `server/chat/prompt.js` |
| Kiểm tra request, model mặc định, giới hạn đầu vào | `server/chat/handler.js` |
| Đọc Markdown đã xuất bản và cache phía server | `server/chat/articles.js` |
| Gọi Gemini, timeout 45 giây, tối đa 2.048 output token | `server/chat/gemini.js` |
| Lời chào trang chủ/bài viết, placeholder, thông báo | `src/modules/chat/data.js`: `messages`, `articleWelcome`, `placeholder` |
| Cooldown và giới hạn phiên phía trình duyệt | Cùng file: `limits.cooldownMs`, `maxMessages`, `sessionTimeoutMs` |
| Gửi request, khóa lúc đang chờ, countdown | `src/client/features/chat.js` |
| Lưu/khôi phục lịch sử | `src/client/features/chat/session.js` |
| Hiển thị chat và nút điều khiển | `src/client/features/chat/view.js`, `src/modules/chat/template.njk` |
| Định dạng phản hồi: link, chữ đậm, xuống dòng | `src/client/features/chat/message-content.js`, `src/styles/chat.css` |

**Ngữ cảnh hiện tại:**

- Trang chủ gửi knowledge cá nhân và tối đa 6 tin nhắn gần nhất. Bấm Tóm tắt dự án chỉ bổ sung Markdown của dự án **cho request đó**; các câu hỏi sau dùng knowledge và lịch sử đã có bản tóm tắt, không tự gửi lại bài. Bấm Tóm tắt lần nữa để nạp lại nguồn khi cần.
- Trang bài viết gửi thêm Markdown đầy đủ của **đúng bài đang mở** mỗi lần hỏi. Trình duyệt gửi `articleId` từ `slug`; server tự đọc bài, không nhận đường dẫn Markdown tùy ý. Bài nháp/slug không hợp lệ không được dùng.
- Mỗi bài có lịch sử riêng, tách khỏi lịch sử trang chủ. Hiện giới hạn 10 tin nhắn/phiên, cooldown 5 giây, hết phiên sau 5 phút không hoạt động; dùng chung bộ đếm giữa các trang. Đây là giới hạn trải nghiệm phía trình duyệt, không phải rate limit bảo mật hay quota Gemini.

Knowledge không tự đồng bộ khi sửa nội dung Profile/Skills/Experience; cập nhật `api/knowledge.md` nếu muốn AI biết thông tin mới. Markdown được lấy trực tiếp từ bài đã xuất bản, không cần chép lại vào knowledge. Push/deploy lại để cả trang và dữ liệu function cùng cập nhật; function đã bao gồm các file nguồn cần đọc qua `vercel.json`.

Nút Tóm tắt gửi câu hiển thị ngắn cùng `action: 'summarize'` và article hợp lệ; instruction ngầm yêu cầu chỉ tóm tắt, không gợi ý câu hỏi. Tóm tắt dùng ngôn ngữ giao diện; câu hỏi tự nhập ưu tiên yêu cầu ngôn ngữ cụ thể rồi ngôn ngữ câu mới nhất, với giao diện làm fallback. Đây là hướng dẫn gửi model; chất lượng phản hồi còn phụ thuộc model.

Phản hồi hỗ trợ URL HTTP/HTTPS và `[nhãn](https://...)` mở tab mới; `[Email](mailto:email@example.com)` hoặc `mailto:email@example.com` mở trình soạn mail mặc định. `mailto:` hỗ trợ `subject`/`body` được mã hóa URL. Áp dụng cả tin mới và lịch sử; không chạy HTML từ model.

## 9. Sau khi chỉnh nội dung

Chạy `npm.cmd run build`, kiểm tra cả EN/VI, light/dark và Glass On/Off trên desktop/điện thoại. Với dự án mới, kiểm tra ảnh, Repo, Chi Tiết, Tóm tắt và các trang phân trang; với blog, kiểm tra URL, thứ tự theo ngày và chatbot trên bản chạy qua Vercel. Sau đó commit/push source để deploy.

Không cần giữ thêm bản HTML cũ, output build hoặc file test trong repo để viết bài/thêm nội dung. Khi muốn quay lại một phiên bản, dùng lịch sử Git.
