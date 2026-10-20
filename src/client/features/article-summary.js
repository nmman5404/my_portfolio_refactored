import { animateQuestionToChat } from './contact/flight.js';

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
    const status = document.querySelector('[data-article-summary-status]');
    const accessibleLabel = button.getAttribute('aria-label');
    const busyLabel = button.dataset.summaryBusyLabel;
    let pending = false;

    button.addEventListener('click', async () => {
        const prompt = button.dataset.summaryPrompt?.trim();
        if (pending || !prompt) return;
        const input = document.getElementById('chat-input');
        const previousDraft = input?.value;
        pending = true;
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        if (busyLabel) button.setAttribute('aria-label', busyLabel);
        if (status) status.textContent = busyLabel || '';

        try {
            const accepted = await chat.submitQuestion(prompt, {
                beforeSend: () => animateQuestionToChat(prompt, button),
            });
            if (accepted && previousDraft && input && !input.value) {
                input.value = previousDraft;
            }
        } catch (error) {
            console.error('The article summary could not be submitted.', error);
        } finally {
            pending = false;
            button.disabled = false;
            button.setAttribute('aria-busy', 'false');
            if (accessibleLabel) button.setAttribute('aria-label', accessibleLabel);
            else button.removeAttribute('aria-label');
            if (status) status.textContent = '';
        }
    });
}
