import { bindSummaryButton } from './summary.js';

/** Project metadata selects the server-owned Markdown, never client-supplied content. */
export function initProjectSummaries(chat) {
    const status = document.querySelector('[data-project-summary-status]');
    document.querySelectorAll('[data-project-summary]').forEach(button => {
        const articleId = button.dataset.summaryArticle;
        if (!articleId) return;
        bindSummaryButton(button, chat, {
            articleId,
            status,
        });
    });
}
