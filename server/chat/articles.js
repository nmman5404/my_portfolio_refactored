import fs from 'node:fs';
import path from 'node:path';
import { parse } from 'yaml';
import { validatePost } from '../../src/lib/content.js';

const ARTICLE_ID_PATTERN = /^[a-z0-9]+(?:-[a-z0-9]+)*$/;
const FRONT_MATTER = /^\uFEFF?---\r?\n([\s\S]*?)\r?\n---(?:\r?\n|$)/;

export function isArticleId(value) {
    return typeof value === 'string' && value.length <= 160 && ARTICLE_ID_PATTERN.test(value);
}

function markdownFiles(directory, fileSystem) {
    return fileSystem.readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
        const filename = path.join(directory, entry.name);
        if (entry.isDirectory()) return markdownFiles(filename, fileSystem);
        return entry.isFile() && path.extname(entry.name) === '.md' ? [filename] : [];
    });
}

function readPublishedArticle(source) {
    const frontMatter = FRONT_MATTER.exec(source);
    if (!frontMatter) return null;

    const metadata = parse(frontMatter[1]);
    if (!metadata || typeof metadata !== 'object' || Array.isArray(metadata)) return null;
    const data = { locale: 'vi', kind: 'blog', ...metadata };
    validatePost(data);
    if (data.draft) return null;

    const body = source.slice(frontMatter[0].length).trim();
    if (!body) return null;
    return Object.freeze({
        id: data.slug,
        title: data.title.replace(/\s+/g, ' ').trim(),
        url: data.permalink || `/blog/vi/${data.slug}/`,
        body,
    });
}

/** Only repository-authored, published Markdown can become model context. */
export function createArticleReader({ cwd = process.cwd, fileSystem = fs, logger = console } = {}) {
    let articles;

    function indexArticles() {
        const index = new Map();
        const duplicates = new Set();
        const directory = path.join(cwd(), 'src', 'content', 'blog');
        for (const filename of markdownFiles(directory, fileSystem)) {
            try {
                const article = readPublishedArticle(fileSystem.readFileSync(filename, 'utf8'));
                if (!article) continue;
                if (index.has(article.id)) duplicates.add(article.id);
                index.set(article.id, article);
            } catch {
                logger.warn('Skipping invalid article metadata.');
            }
        }
        for (const id of duplicates) index.delete(id);
        return index;
    }

    return function readArticle(id) {
        if (!isArticleId(id)) return null;
        // Sources are immutable in a deployment; build this allowlist once and
        // only when someone asks a question from an article page.
        articles ??= indexArticles();
        return articles.get(id) || null;
    };
}

export const readArticle = createArticleReader();
