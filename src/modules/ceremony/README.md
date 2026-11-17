# Ceremony

Trang `/ceremony/` là thiệp chung. Link riêng có dạng `/ceremony/?id=minh-anh` với `id` đã điền trong JSON; tên có dấu, chữ hoa/thường, khoảng trắng và dấu gạch được chuẩn hóa khi tra cứu. ID rỗng, `null`, không khớp hoặc người nhận có `enabled: false` dùng thiệp chung.

## Chỉnh thiệp cho từng người

Chỉ cần sửa **`src/modules/ceremony/recipients.json`**. Mỗi người là một object trong mảng `recipients`. Mỗi cảnh gom toàn bộ chữ vào cùng một chỗ:

| Field trong cảnh | Vị trí trên màn hình |
| --- | --- |
| `eyebrow` | Dòng chữ nhỏ phía trên cùng |
| `title` | Dòng chữ lớn ở giữa |
| `body` | Nội dung bên dưới |
| `signature` | Riêng cảnh `invitation`: dòng ký tên bên dưới nội dung |
| `time` | Riêng cảnh `invitation`: giờ đến của người này, hiện trên poster cuối cùng ngày chung |

Ví dụ một người có đủ bốn cảnh:

```json
{
  "id": "minh-anh",
  "profile": "close",
  "displayName": "Minh Anh",
  "intro": {
    "eyebrow": "Dear",
    "title": "{name},",
    "body": "Mình có một lời nhắn gửi cậu."
  },
  "thankYou": {
    "eyebrow": "CÓ NHỮNG ĐIỀU LUÔN Ở LẠI",
    "title": "Cảm ơn cậu.",
    "body": "Cảm ơn cậu đã cùng chia sẻ niềm vui này."
  },
  "personalMessage": {
    "eyebrow": "NHẮN RIÊNG MỘT CHÚT",
    "title": "Dạo này cậu thế nào?",
    "body": "Mong cậu vẫn vui và nhớ dành thời gian nghỉ ngơi nhé."
  },
  "invitation": {
    "eyebrow": "HẸN CẬU HÔM ẤY",
    "title": "Cùng lưu một kỷ niệm.",
    "body": "Đến chung vui trong lễ tốt nghiệp và chụp cùng mình một tấm hình nhé!",
    "signature": "Thương mến, Mẫn",
    "time": "09:00"
  },
  "notes": "Ghi chú nội bộ, không hiện trên thiệp"
}
```

`intro` là cảnh `dear`, `thankYou` là cảnh `thanks`, `personalMessage` là cảnh `personal`, và `invitation` là cảnh lời mời. `invitation.body` còn dùng làm lời mời trên poster cuối. Viết trọn dòng ký tên trong `invitation.signature`; giao diện hiển thị đúng câu đã điền.

Ngày chung của mọi thiệp là **21/11/2026**, chỉnh một lần ở `data.js` → `event.date`. Giờ đến viết riêng trong `invitation.time` của từng người, ví dụ `"time": "09:00"` hoặc `"time": "09:00–10:00"`. Poster sẽ hiện `21/11/2026 · 09:00`. Bỏ `time` hoặc để `""` thì chỉ hiện ngày; các thiệp đang viết có thể bổ sung field này dần. Giờ đến không tạo thêm cảnh và không đổi thời lượng clip.

## Chọn nhóm người nhận

| `profile` | Dành cho | Cảnh chữ | Tổng thời lượng |
| --- | --- | --- | --- |
| `casual` | Mời xã giao | `intro` → `invitation` | 17 giây |
| `friend` | Bạn khá thân | `intro` → `thankYou` → `invitation` | 21,5 giây |
| `close` | Bạn thân | `intro` → `thankYou` → `personalMessage` → `invitation` | 25,5 giây |

Bỏ `profile` thì dùng `casual`; đây cũng là nhóm của thiệp chung. Những cảnh ngoài nhóm luôn được bỏ, kể cả khi đã viết nội dung. Muốn có lời cảm ơn thì dùng `friend` hoặc `close`; muốn có hỏi thăm riêng thì dùng `close`. Profile và ghi chú nội bộ không được trả về trình duyệt.

Mỗi cảnh giữ nguyên nhịp hiện tại: chào 2 giây, cảm ơn 4,5 giây, hỏi thăm 4 giây, lời mời 4 giây. Tổng thời lượng gồm mở đầu 9,6 giây và chuyển sang poster 1,4 giây. Ít cảnh hơn thì clip kết thúc sớm hơn; poster cuối vẫn ở lại trên màn hình.

## Giá trị mặc định và phần để trống

- Bỏ cả object cảnh: dùng nội dung chung của cảnh đó nếu thuộc profile đã chọn.
- Chỉ điền một phần, ví dụ `"thankYou": { "title": "Một lời cảm ơn riêng." }`: chỉ thay tiêu đề, các dòng còn lại dùng mặc định.
- Ghi `""` hoặc chỉ dấu cách ở `eyebrow`/`title`: ẩn riêng dòng đó.
- Ghi `"body": ""`: bỏ toàn bộ cảnh đó và rút ngắn clip; với `invitation.body`, lời mời trên poster cũng được ẩn.
- Ghi `"signature": ""` trong `invitation`: ẩn riêng dòng ký tên.
- Ghi `"time": ""` trong `invitation`: ẩn giờ đến, vẫn hiện ngày chung trên poster.
- `{name}` trong bất kỳ dòng nào tự thay bằng `displayName`. Ví dụ `intro.title: "{name},"` theo tên người nhận; bạn cũng có thể viết tiêu đề hoàn toàn khác như `"Bạn ơi!"`.
- Nội dung xuống dòng bằng `\n`. Cách xưng hô trong từng đoạn là văn bản bạn tự viết.

Luôn dùng object cho các cảnh. Muốn bỏ cảnh, dùng `"intro": { "body": "" }`; các dòng chữ đều nằm trong chính object của cảnh.

## Các field quản lý người nhận

| Field | Công dụng |
| --- | --- |
| `id` | Bắt buộc; ID trong link, ví dụ `minh-anh`. Không trùng ID/alias của người khác. |
| `displayName` | Bắt buộc; tên trên poster, góc trên phải, tên tab và giá trị thay cho `{name}`. |
| `profile` | `casual`, `friend`, `close`; bỏ qua thì dùng `casual`. |
| `aliases` | ID phụ, ví dụ `["Minh Anh"]`. Xóa/sửa khi sao chép mẫu. |
| `enabled` | `false` tắt link riêng và quay về thiệp chung. |
| `notes` | Ghi chú nội bộ, không hiện trên thiệp. |

## Thêm một người mới

1. Sao chép một object trong `recipients.json`, hoặc dùng ví dụ phía trên; đặt object mới bên trong mảng `recipients`.
2. Đổi `id`, `displayName`, chọn `profile`; sửa/xóa `aliases` nếu có. Hai người trùng tên cần ID khác nhau, chẳng hạn `minh-anh-cap3` và `minh-anh-daihoc`.
3. Viết `eyebrow`, `title`, `body` ngay trong từng cảnh cần dùng. Có thể giữ `{name}` để tên được điền tự động.
4. Viết đầy đủ `invitation.signature` nếu cần ký tên, ví dụ `Thân mến, Felix`. Điền `invitation.time` là giờ đến của người này; ví dụ `09:00`, để trống khi chưa chốt.
5. Lưu JSON rồi mở `/ceremony/?id=minh-anh`. Giữ dấu phẩy giữa các người, không thêm dấu phẩy sau object cuối cùng.
6. Sau khi deploy, gửi cùng đường dẫn trên domain portfolio; `localhost` chỉ xem được trên máy bạn.

Trong các thiệp mẫu, nội dung ghi trực tiếp vị trí hiển thị: dòng nhỏ phía trên, tiêu đề lớn, nội dung bên dưới và dòng ký tên. `displayName` hiện trên poster, góc trên phải, tên tab và thay vào `{name}`. Thay các dòng hướng dẫn bằng lời nhắn thật trước khi gửi.

## Cấu hình chung và ranh giới module

`data.js` giữ cấu hình công khai theo cách các module portfolio hiện có:

| Nhóm | Cần chỉnh |
| --- | --- |
| `navigation`, `showInNavigation`, `href` | Nhãn menu, bật/tắt nút Graduation, đường dẫn trang |
| `identity`, `page`, `hero` | Chủ thiệp, tiêu đề tab, chữ màn mở đầu |
| `invitation` | Tên mặc định và các object cảnh mặc định, cùng cấu trúc với từng người |
| `event`, `poster` | Ngày chung, địa điểm, link bản đồ, gửi xe và các nhãn của poster cuối; giờ riêng nằm trong `invitation.time` |
| `ui` | Chữ nút và thông báo |
| `animation` | Các mốc theo giây, giữ thứ tự tăng dần |
| `music` | File nhạc local, âm lượng 0–1, `loop: false`; `src: ''` để ẩn nhạc/nút loa |
| `media` | URL và kích thước bộ ảnh trong `public/ceremony/` |

Ví dụ dòng “CÓ NHỮNG ĐIỀU LUÔN Ở LẠI” nằm ở `data.js` → `invitation.thankYou.eyebrow`. Muốn đổi cho một người, chỉnh `thankYou.eyebrow` của người đó trong `recipients.json`. Ngày, địa điểm, bản đồ và note gửi xe dùng chung trong `event`; để trống thì phần tương ứng không hiển thị trên poster. Giờ đến riêng dùng `invitation.time`.

- `invitation.js` trong module: kiểm tra cấu trúc cảnh, áp dụng mặc định, thay `{name}`, lọc profile trước khi gửi ra trình duyệt.
- `server/ceremony/`, `api/invitation.js`: tra cứu JSON; API chỉ trả nội dung của người đang mở.
- `src/client/features/ceremony/sequence.js`: nối các cảnh có `body`, giữ nguyên thời lượng từng cảnh.
- `src/client/ceremony.js`: ghép nội dung, tính năng và vòng đời trang.
- Các feature còn lại quản lý cảnh sân khấu, nhân vật, nền/pháo giấy và nhạc; CSS/entry chỉ tải trên trang thiệp.
- `styles/typography.css`: font local; xem [lý do phối chữ](TYPOGRAPHY.md) trước khi thay font.

Poster cuối là nơi hiển thị đầy đủ thông tin buổi lễ. Khi poster hiện ra, nút tải ảnh tròn cạnh nút xem lại lưu PNG gồm tên, lời mời, ngày/giờ và địa điểm. Ảnh rộng 1920px, dùng lại bố cục desktop đầy đủ ngay cả khi tải từ điện thoại, gồm cả phần nội dung đang cuộn. Nhãn nút và thông báo tải ảnh nằm trong `data.js` → `ui.download*`; tính năng xuất ảnh nằm riêng ở `poster-download.js`. Thư viện ESM được tải local khi bấm lưu, kèm giấy phép trong `assets/js/vendor/`. Người chọn giảm chuyển động đọc từng cảnh bằng nút chuyển cảnh.

Nhạc `Touch_The_Sky.mp3` trong `public/ceremony/audio/` bắt đầu khi bấm Mở thiệp. Chuyển cảnh giữ nhạc liên tục; rời tab tạm dừng và trở lại tiếp tục nếu đang bật. Hết bài thì dừng hẳn, chỉ Xem lại mới mở một lượt phát mới. Nhạc thiệp độc lập với nhạc portfolio.

## Kiểm tra và xuất bản

Chạy `npm test`, `npm run build`, rồi `npm run preview`. Kiểm tra ba profile, thiệp chung, ID lạ, cảnh/field để trống, nút mở/chuyển cảnh/xem lại và màn hình điện thoại. `npm run dev` hỗ trợ cùng API. JSON khách được đọc lại mỗi request; thay đổi code hợp đồng dữ liệu cần khởi động lại server. Trên Vercel, commit/push để deploy; thiệp không cần biến môi trường riêng.

Danh sách khách chỉ ở server, không đặt trong `public/` hay bundle trình duyệt. Link theo tên là đường dẫn chia sẻ: người biết đúng ID có thể mở thiệp tương ứng.
