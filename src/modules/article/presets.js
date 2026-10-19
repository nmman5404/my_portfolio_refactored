import { articleClientEntry, standardArticleClient } from './client-entries.js';

const project = {
  layout: 'modules/article/layouts/article.njk',
  navigation: 'modules/article/components/article-navigation-default.njk',
  footer: 'modules/article/components/article-footer-default.njk',
  style: 'modules/article/styles/article.css',
  themeInit: 'modules/article/scripts/article-theme-init.js',
  ...standardArticleClient,
};

// Presentation stays in templates; each Markdown file only selects a preset.
export const articlePresets = {
  project,
  'project-mcp': { ...project },
  'project-stock': {
    ...project,
  },
  'project-formatted': {
    ...project,
    layout: 'modules/article/layouts/article-formatted.njk',
    footer: 'modules/article/components/article-footer-formatted.njk',
    style: 'modules/article/styles/article-formatted.css',
  },
};

export function articlePage(title, preset, bodyContent) {
  const settings = articlePresets[preset || 'project'];
  if (!settings) throw new Error(`Unknown article preset: ${preset}`);
  return { ...settings, title, bodyContent, clientEntry: articleClientEntry(settings) };
}
