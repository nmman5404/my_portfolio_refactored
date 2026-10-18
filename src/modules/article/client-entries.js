import path from 'node:path';

const basename = (filename) => path.posix.basename(filename, '.js');

export const standardArticleClient = {
  themeToggle: 'modules/article/scripts/article-theme-toggle.js',
  backScript: 'modules/article/scripts/article-back.js',
};

/** Each existing theme/back combination gets a small, inspectable ESM entry. */
export function articleClientEntry(article) {
  const name = `${basename(article.themeToggle)}--${article.backScript ? basename(article.backScript) : 'no-back'}`;
  return `/assets/js/articles/entries/${name}.js`;
}

export function createArticleClientEntries(articles) {
  const entries = new Map();
  for (const article of articles) {
    const output = articleClientEntry(article);
    if (entries.has(output)) continue;
    const imports = [`import { initArticleTheme } from '../${path.posix.basename(article.themeToggle)}';`];
    if (article.backScript) {
      imports.push(`import { initArticleBack } from '../${path.posix.basename(article.backScript)}';`);
    }
    const calls = ['initArticleTheme();'];
    if (article.backScript) calls.push('initArticleBack();');
    entries.set(output, { output, source: `${imports.join('\n')}\n\n${calls.join('\n')}\n` });
  }
  return [...entries.values()];
}
