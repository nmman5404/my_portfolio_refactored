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
      vi: 'Tóm tắt bài viết này.',
      en: 'Summarize this article.',
    },
  },
};
