// Article wallpaper is independent from the homepage, including future Markdown blogs.
export default {
  background: {
    light: '/backgrounds/articles/light.jpg',
    dark: '/backgrounds/articles/dark.jpg',
  },
  summary: {
    label: { vi: 'Tóm tắt', en: 'Summarize' },
    accessibleLabel: {
      vi: 'Tóm tắt bài viết với trợ lý AI',
      en: 'Summarize this article with the AI assistant',
    },
    busyLabel: {
      vi: 'Đang gửi yêu cầu tóm tắt đến trợ lý AI…',
      en: 'Sending the summary request to the AI assistant…',
    },
    prompt: {
      vi: 'Hãy tóm tắt ngắn gọn bài viết tôi đang đọc: nội dung chính, mục tiêu, phương pháp và kết quả đáng chú ý nếu bài có đề cập. Chỉ dựa vào bài viết, không bổ sung thông tin bên ngoài. Cuối cùng, gợi ý 2 câu hỏi liên quan để tôi tìm hiểu tiếp.',
      en: 'Please briefly summarize the article I am reading: its main ideas, goals, methods, and notable results where mentioned. Use only the article without adding outside facts. Finish with 2 relevant questions I could ask next.',
    },
  },
};
