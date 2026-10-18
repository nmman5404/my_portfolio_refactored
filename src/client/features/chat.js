import { formatMessage } from '../shared/text.js';
import { createChatSession } from './chat/session.js';
import { createChatView } from './chat/view.js';

export function initChat({ locale, text: messages, limits }) {
    const view = createChatView();
    const { maxMessages, cooldownMs, sessionTimeoutMs } = limits;
    const session = createChatSession({ sessionTimeoutMs });
    let countdownInterval;

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
        updateLimitCountdown();
        countdownInterval = setInterval(updateLimitCountdown, 1000);
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

    async function sendChatMessage() {
        const text = view.getInputText();
        if (!text) return;

        const currentTime = Date.now();

        if (session.messageCount >= maxMessages) {
            startLimitCountdown();
            return;
        }

        if (currentTime - session.lastMessageTime < cooldownMs) {
            view.showCooldownNotice(messages.cooldownNotice);
            return;
        }

        view.hideWarning();
        session.recordSentMessage(currentTime);
        const previousHistory = session.history.slice(-6);

        renderAndSaveMessage(text, 'user');
        view.clearAndDisableInput();
        view.showTypingIndicator();

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ userMessage: text, lang: locale, history: previousHistory }),
            });

            const data = await response.json();
            view.removeTypingIndicator();
            renderAndSaveMessage(response.ok ? data.reply : messages.serverError, 'bot');
        } catch (error) {
            console.error(error);
            view.removeTypingIndicator();
            renderAndSaveMessage(messages.connectionError, 'bot');
        } finally {
            view.restoreInput();
        }
    }

    window.sendChatMessage = sendChatMessage;
}
