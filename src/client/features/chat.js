import { formatMessage } from '../shared/text.js';
import { createChatSession } from './chat/session.js';
import { createChatView } from './chat/view.js';

export function initChat({ locale, text: messages, limits, articleId }) {
    const view = createChatView();
    const { maxMessages, cooldownMs, sessionTimeoutMs } = limits;
    const session = createChatSession({ sessionTimeoutMs, articleId });
    let countdownInterval;
    let inFlight = false;

    function updateLimitCountdown() {
        const timeLeft = sessionTimeoutMs - (Date.now() - session.lastActivity);

        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            session.resetMessageLimit();
            view.showResetNotice(messages.resetNotice);
            setTimeout(view.hideResetNotice, 4000);
            return;
        }

        const minutes = Math.floor(timeLeft / 60000);
        const seconds = Math.floor((timeLeft % 60000) / 1000);
        view.setWarningText(formatMessage(messages.limitReached, {
            max: maxMessages,
            minutes,
            seconds,
        }));
    }

    function startLimitCountdown() {
        if (countdownInterval) clearInterval(countdownInterval);
        view.showLimitWarning();
        countdownInterval = setInterval(updateLimitCountdown, 1000);
        updateLimitCountdown();
    }

    if (session.messageCount >= maxMessages
        && session.lastActivity !== 0
        && Date.now() - session.lastActivity <= sessionTimeoutMs) {
        startLimitCountdown();
    }

    view.bindControls(sendChatMessage);
    view.clearMessages();
    session.ensureWelcomeMessage(messages.welcome);
    session.history.forEach(message => view.renderMessage(message.text, message.sender));

    function renderAndSaveMessage(text, sender) {
        view.renderMessage(text, sender);
        session.appendMessage(text, sender);
    }

    function sendChatMessage() {
        return submitQuestion(view.getInputText());
    }

    /** An optional article supplements this request only; the conversation stays shared. */
    async function submitQuestion(rawText, {
        beforeSend,
        articleId: requestedArticleId,
        action,
    } = {}) {
        const text = typeof rawText === 'string' ? rawText.trim() : '';
        if (!text) return false;

        if (inFlight) {
            view.open();
            view.showCooldownNotice(messages.busyNotice);
            return false;
        }

        const currentTime = Date.now();

        if (session.messageCount >= maxMessages) {
            view.open();
            startLimitCountdown();
            return false;
        }

        const timeSinceLastMessage = currentTime - session.lastMessageTime;
        if (timeSinceLastMessage < cooldownMs) {
            view.open();
            view.showCooldownNotice(formatMessage(messages.cooldownNotice, {
                seconds: Math.ceil((cooldownMs - timeSinceLastMessage) / 1000),
            }));
            return false;
        }

        // Reserve immediately, including while an external entry animates into chat.
        inFlight = true;
        try {
            if (typeof beforeSend === 'function') {
                try {
                    await beforeSend();
                } catch (error) {
                    // Motion is cosmetic: an interrupted animation must not lose a question.
                    console.warn('Chat entry animation was interrupted.', error);
                }
            }

            view.open();
            view.hideWarning();
            session.recordSentMessage(Date.now());
            const previousHistory = session.history
                .filter(message => !message.welcome)
                .slice(-6)
                .map(({ text, sender }) => ({ text, sender }));

            renderAndSaveMessage(text, 'user');
            view.clearAndDisableInput();
            view.showTypingIndicator();

            try {
                // Article pages stay pinned. A homepage summary includes its Markdown
                // once; later questions use the profile and the saved summary/history.
                const requestArticleId = articleId || requestedArticleId;
                const response = await fetch('/api/chat', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userMessage: text,
                        lang: locale,
                        history: previousHistory,
                        ...(requestArticleId ? { articleId: requestArticleId } : {}),
                        ...(action === 'summarize' ? { action } : {}),
                    }),
                });

                const data = await response.json();
                view.removeTypingIndicator();
                renderAndSaveMessage(response.ok ? data.reply : messages.serverError, 'bot');
            } catch (error) {
                console.error(error);
                view.removeTypingIndicator();
                renderAndSaveMessage(messages.connectionError, 'bot');
            }

            return true;
        } finally {
            view.restoreInput();
            inFlight = false;
        }
    }

    return { open: view.open, submitQuestion };
}
