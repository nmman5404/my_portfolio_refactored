import { validatePost } from '../../lib/content.js';

export default {
  tags: ['blog'],
  locale: 'vi',
  kind: 'blog',
  layout: 'layouts/post.njk',
  eleventyComputed: {
    permalink(data) {
      validatePost(data);
      return data.draft ? false : (data.permalink || `blog/vi/${data.slug}/index.html`);
    },
  },
};
