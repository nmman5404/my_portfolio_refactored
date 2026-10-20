import { bindSummaryButton } from './summary.js';

/** The article action uses the same chat, request lock, and motion as Contact. */
export function initArticleSummary(chat) {
    const template = document.getElementById('article-summary-template');
    if (!chat || !template || document.querySelector('[data-article-summary]')) return;

    const button = template.content.querySelector('[data-article-summary]')?.cloneNode(true);
    if (!button) return;
    const repo = document.querySelector('[data-article-repo]');
    const host = repo?.parentElement || document.querySelector('[data-article-summary-fallback]');
    if (!host) return;

    host.classList.add('article-actions');
    host.appendChild(button);
    host.hidden = false;
    bindSummaryButton(button, chat, {
        status: document.querySelector('[data-article-summary-status]'),
    });
}
