const requiredPostFields = {
  blog: ['title', 'slug', 'summary', 'thumbnail'],
  project: ['title', 'slug', 'permalink'],
};

function validateRequiredFields(data, fields) {
  for (const field of fields) {
    if (typeof data[field] !== 'string' || !data[field].trim()) {
      throw new Error(`Blog post requires a non-empty ${field}`);
    }
  }
}

/** Shared build-time rules. These do not add any browser JavaScript. */
export function validatePost(data) {
  const kind = data.kind || 'blog';
  if (!['blog', 'project'].includes(kind)) throw new Error(`Unknown post kind: ${kind}`);
  validateRequiredFields(data, requiredPostFields[kind]);
  if (data.locale !== undefined && data.locale !== 'vi') {
    throw new Error('Blog locale must be vi; one Vietnamese Markdown post is shared by both homepages');
  }
  if (!/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
    throw new Error(`Blog slug must use lowercase words separated by hyphens: ${data.slug}`);
  }
  if (kind === 'blog' && (!data.date || Number.isNaN(new Date(data.date).getTime()))) {
    throw new Error(`Blog post requires a valid date: ${data.slug}`);
  }
  if (data.draft !== undefined && typeof data.draft !== 'boolean') {
    throw new Error(`Blog draft must be true or false: ${data.slug}`);
  }
}

function comparePosts(left, right) {
  const dateOrder = new Date(right.data.date) - new Date(left.data.date);
  return dateOrder || left.data.slug.localeCompare(right.data.slug);
}

export function publishedPosts(posts = []) {
  // Both homepages list the same Vietnamese posts without duplicate files.
  return posts
    .filter((post) => post.data.kind !== 'project' && !post.data.draft)
    .sort(comparePosts);
}

function validateSection(section, seenIds) {
  if (!/^[a-z][a-z0-9-]*$/.test(section.id) || seenIds.has(section.id)) {
    throw new Error(`Invalid or duplicate section ID: ${section.id}`);
  }
  seenIds.add(section.id);

  const validTemplate = section.template
    && /^(sections\/|modules\/[a-z][a-z0-9-]*\/)/.test(section.template)
    && !section.template.includes('..');
  if (!validTemplate) {
    throw new Error(`Section template must be inside a section module: ${section.id}`);
  }
}

export function activeSections(sections, posts = []) {
  const seenIds = new Set();
  let hasPublishedBlog;

  return sections.filter((section) => {
    validateSection(section, seenIds);
    if (section.enabled === false) return false;
    if (section.requires !== 'blog') return true;

    // Resolve only when needed, once for every section that requires blog data.
    hasPublishedBlog ??= publishedPosts(posts).length > 0;
    return hasPublishedBlog;
  });
}
