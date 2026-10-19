import { animateQuestionToChat } from './contact/flight.js';
import { createContactSuggestions } from './contact/suggestions.js';

/** Contact is another entry to the same conversation, not a second chat client. */
export function initContactSearch({ sending, suggestions }, chat) {
    const form = document.querySelector('[data-contact-search]');
    if (!form || !chat || form.dataset.initialized) return;
    form.dataset.initialized = 'true';

    const input = form.querySelector('input');
    const submitButton = form.querySelector('button[type="submit"]');
    const suggestionsGroup = document.querySelector('[data-contact-suggestions]');
    const status = document.getElementById('contact-search-status');
    let isSubmitting = false;
    let isComposing = false;
    const quickQuestions = createContactSuggestions({
        group: suggestionsGroup,
        form,
        suggestions,
        canShuffle: () => !isSubmitting && !isComposing && !input.value.trim(),
        onSelect: (question, source) => { void submitQuestion(question, source); },
    });

    function setSubmitting(value) {
        isSubmitting = value;
        form.setAttribute('aria-busy', String(value));
        input.disabled = value;
        submitButton.disabled = value;
        quickQuestions.setDisabled(value);
        status.textContent = value ? sending : '';
    }

    async function submitQuestion(question, source) {
        if (!question || isSubmitting || isComposing) return;

        const isSuggestion = source !== input;
        const previousDraft = input.value;
        if (isSuggestion) input.value = question;
        setSubmitting(true);

        try {
            const accepted = await chat.submitQuestion(question, {
                beforeSend: () => animateQuestionToChat(question, source),
            });
            if (accepted && input.value.trim() === question) {
                // A quick question must not consume an unrelated draft in the search field.
                input.value = isSuggestion && previousDraft.trim() !== question ? previousDraft : '';
            }
        } catch (error) {
            // Keep the question available to retry, even if the chat bridge is interrupted.
            console.error('The contact question could not be submitted.', error);
        } finally {
            setSubmitting(false);
        }
    }

    input.addEventListener('compositionstart', () => { isComposing = true; });
    input.addEventListener('compositionend', () => { isComposing = false; });
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Enter' && (isComposing || event.isComposing || event.keyCode === 229)) {
            event.preventDefault();
        }
    });

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        void submitQuestion(input.value.trim(), input);
    });
}
