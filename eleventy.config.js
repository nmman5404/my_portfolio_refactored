import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import nunjucks from 'nunjucks';
import { activeSections, publishedPosts, validatePost } from './src/lib/content.js';
import { localized } from './src/lib/localized.js';
import { buildClientConfig } from './src/lib/client-config.js';
import { configureMarkdown } from './src/lib/markdown.js';
import { articlePage } from './src/modules/article/presets.js';
import { buildStyles } from './scripts/styles.mjs';
import { buildCeremonyConfig } from './src/lib/ceremony.js';
import { readRecipients } from './server/ceremony/recipients.js';
import { createInvitationHandler } from './server/ceremony/handler.js';

const projectRoot = path.dirname(fileURLToPath(import.meta.url));
const sourceRoot = path.join(projectRoot, 'src');

export default function configure(eleventyConfig) {
  // Validate private guest data too; it is never rendered into public assets.
  const loadRecipients = () => readRecipients({ cwd: () => projectRoot });
  loadRecipients();
  const invitation = createInvitationHandler({ loadRecipients });
  eleventyConfig.setServerOptions({
    middleware: [(request, response, next) => {
      const { pathname } = new URL(request.url, 'http://localhost');
      return pathname === '/api/invitation' ? invitation(request, response) : next();
    }],
  });
  const environment = new nunjucks.Environment(
    new nunjucks.FileSystemLoader([path.join(sourceRoot, '_includes'), sourceRoot]),
    { autoescape: false, trimBlocks: false, lstripBlocks: false },
  );

  // Only the critical theme bootstrap stays inline before first paint.
  // Large application scripts are external ES modules; CSS is external too.
  environment.addGlobal('source', (relativePath) => {
    const target = path.resolve(sourceRoot, relativePath);
    if (!target.startsWith(`${sourceRoot}${path.sep}`)) {
      throw new Error(`Source fragment must stay inside src/: ${relativePath}`);
    }
    return new nunjucks.runtime.SafeString(fs.readFileSync(target, 'utf8'));
  });
  environment.addFilter('jsonLiteral', (value) => JSON.stringify(value));
  environment.addFilter('localized', localized);
  environment.addGlobal('localized', localized);
  environment.addGlobal('clientConfig', buildClientConfig);
  environment.addGlobal('ceremonyConfig', buildCeremonyConfig);
  environment.addGlobal('articlePage', articlePage);
  environment.addFilter('articleStyleUrl', (value) => `/assets/css/articles/${path.basename(value)}`);
  environment.addFilter('activeSections', activeSections);
  environment.addFilter('displayDate', (date) => new Date(date).toISOString().slice(0, 10));
  eleventyConfig.setLibrary('njk', environment);
  eleventyConfig.amendLibrary('md', configureMarkdown);

  eleventyConfig.addCollection('publishedBlog', (collection) => {
    const posts = collection.getFilteredByTag('blog').filter((post) => post.data.kind !== 'project');
    posts.forEach((post) => validatePost(post.data));
    return publishedPosts(posts);
  });

  eleventyConfig.addPassthroughCopy({ public: '.' });
  eleventyConfig.addPassthroughCopy({ 'src/client': 'assets/js' });
  eleventyConfig.addPassthroughCopy({
    'node_modules/modern-screenshot/dist/index.mjs': 'assets/js/vendor/modern-screenshot.js',
    'node_modules/modern-screenshot/LICENSE': 'assets/js/vendor/modern-screenshot-LICENSE',
  });
  eleventyConfig.addPassthroughCopy({ 'src/modules/blog/styles': 'assets/css/blog' });
  for (const kind of ['scripts', 'styles']) {
    const directory = path.join(sourceRoot, 'modules/article', kind);
    for (const filename of fs.readdirSync(directory)) {
      eleventyConfig.addPassthroughCopy({
        [`src/modules/article/${kind}/${filename}`]: `assets/${kind === 'scripts' ? 'js' : 'css'}/articles/${filename}`,
      });
    }
  }
  for (const directory of ['src/styles', 'src/lib', 'src/modules', 'src/client']) {
    eleventyConfig.ignores.add(`${directory}/**`);
    eleventyConfig.addWatchTarget(directory, {
      resetConfig: directory === 'src/lib' || directory === 'src/modules',
    });
  }
  eleventyConfig.addWatchTarget('tailwind.config.js', { resetConfig: true });

  // Render module data and Markdown first, then compile every used utility.
  eleventyConfig.on('eleventy.after', ({ outputMode }) => {
    if (outputMode === 'fs') return buildStyles();
  });

  return {
    dir: { input: 'src', includes: '_includes', data: '_data', output: 'dist' },
    templateFormats: ['njk', 'md'],
    htmlTemplateEngine: 'njk',
    markdownTemplateEngine: false,
  };
}
