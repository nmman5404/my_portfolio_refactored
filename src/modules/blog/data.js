import { articleClientEntry, standardArticleClient } from '../article/client-entries.js';

// Blog content is authored once, in Vietnamese. These labels belong to the UI,
// so the English and Vietnamese homepages can share the same article records.
export default {
  locale: 'vi',
  clientEntry: articleClientEntry(standardArticleClient),
  navigation: { en: 'Blog', vi: 'Bài viết' },
  labels: {
    en: { heading: 'Blog', details: 'Read More', back: 'Back to Portfolio' },
    vi: { heading: 'Bài viết', details: 'Chi Tiết', back: 'Quay lại trang chủ' },
  },
};
