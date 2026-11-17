# Typography của thiệp

Cặp chữ được chọn là **Lora + Be Vietnam Pro**. Đây là lựa chọn thiết kế cho thiệp hiện tại, dựa trên khả năng đọc tiếng Việt, cảm giác ấm áp và sự tương phản giữa lời nhắn với thông tin sự kiện.

| Vai trò | Font | Cách dùng |
| --- | --- | --- |
| Tên người nhận, tiêu đề các cảnh, lời nhắn | Lora 400–500 | Chữ thường có chân, độ tương phản vừa; italic thật dành cho tên/ký tên |
| Chữ GRADUATION | Be Vietnam Pro 900 | Một điểm nhấn đậm, hiện đại; co cỡ chữ theo màn hình |
| Nút, nhãn, ngày giờ, địa chỉ, ghi chú gửi xe | Be Vietnam Pro 400–600 | Chữ không chân rõ ràng; phần ghi chú dùng cỡ 12px trở lên |

Giảm tracking âm của lời nhắn, nới line-height cho dấu kép tiếng Việt và dùng ít chữ nghiêng ở các dòng dài. Không thay font portfolio: hệ chữ này nằm riêng trong CSS Ceremony.

## Cơ sở tham khảo

- [Google Fonts Knowledge — Pairing typefaces](https://fonts.google.com/knowledge/choosing_type/pairing_typefaces): phối chữ theo vai trò, tận dụng các weight/style và tạo tương phản đủ rõ nhưng hài hòa.
- [Creative Bloq — The ultimate font pairings guide](https://www.creativebloq.com/typography/20-perfect-font-pairings-3132120): chọn cặp chữ theo bối cảnh; chữ biểu cảm đi với chữ thông tin dễ đọc.
- [Be Vietnam Pro — tài liệu tác giả](https://github.com/bettergui/BeVietnamPro): dự án tinh chỉnh hình dáng và dấu tiếng Việt để cải thiện khả năng đọc.
- [Lora — mô tả chính thức trên Google Fonts](https://github.com/google/fonts/blob/main/ofl/lora/DESCRIPTION.en_us.html): serif đương đại có gốc thư pháp, được tối ưu cho màn hình và nội dung đoạn văn. [Metadata](https://github.com/google/fonts/blob/main/ofl/lora/METADATA.pb) xác nhận subset tiếng Việt.
- [Vietnamese Typography — Type Recommendations](https://vietnamesetypography.com/type-recommendations/): tiêu chí về độ rõ của chữ và dấu, khả năng đọc và tính linh hoạt khi đánh giá font tiếng Việt. Trang này được dùng làm tiêu chí, không phải nguồn giới thiệu riêng Lora/Be Vietnam Pro.

Nguồn được đối chiếu ngày 17/11/2026. Không có số lượt xem từng bài được công bố để so hạng; lựa chọn cuối cùng là đánh giá trên giao diện thiệp thực tế.

## Chỉnh sửa và vận hành

`styles/typography.css` chứa `@font-face` và hai biến `--ceremony-font-ui`, `--ceremony-font-letter`. Các style còn lại tham chiếu hai biến này. Font WOFF2 và giấy phép OFL nằm trong `public/ceremony/fonts/`, có nguồn/version trong README cùng thư mục. Không thêm dependency npm hay gọi CDN ở phía người xem; `font-display: swap` cho phép đọc bằng fallback nếu font chưa tải xong.
