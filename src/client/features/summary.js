import { animateQuestionToChat } from './contact/flight.js';

const boundButtons = new WeakSet();

/** Articles and project cards share one submission flow and the same chat lock. */
export function bindSummaryButton(button, chat, { articleId, status } = {}) {
    if (!button || !chat || boundButtons.has(button)) return;
    boundButtons.add(button);
    const accessibleLabel = button.getAttribute('aria-label');
    const busyLabel = button.dataset.summaryBusyLabel;
    let pending = false;

    button.addEventListener('click', async () => {
        const prompt = button.dataset.summaryPrompt?.trim();
        if (pending || !prompt) return;
        const input = document.getElementById('chat-input');
        const previousDraft = input?.value;
        let announced = false;
        pending = true;
        button.disabled = true;
        button.setAttribute('aria-busy', 'true');
        if (busyLabel) button.setAttribute('aria-label', busyLabel);

        try {
            const accepted = await chat.submitQuestion(prompt, {
                action: 'summarize',
                ...(articleId ? { articleId } : {}),
                beforeSend: () => {
                    if (status) {
                        status.textContent = busyLabel || '';
                        announced = true;
                    }
                    return animateQuestionToChat(prompt, button);
                },
            });
            if (accepted && previousDraft && input && !input.value) {
                input.value = previousDraft;
            }
        } catch (error) {
            console.error('The summary could not be submitted.', error);
        } finally {
            pending = false;
            button.disabled = false;
            button.setAttribute('aria-busy', 'false');
            if (accessibleLabel) button.setAttribute('aria-label', accessibleLabel);
            else button.removeAttribute('aria-label');
            if (announced) status.textContent = '';
        }
    });
}
