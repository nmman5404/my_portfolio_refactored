const storageKeys = {
    count: 'aiMessageCount',
    history: 'aiChatHistory',
    activity: 'aiLastActivity',
    lastMessage: 'aiLastMessageTime',
};

/** Own the persisted conversation and limits without touching the interface. */
export function createChatSession({ sessionTimeoutMs }) {
    const now = Date.now();
    let lastActivity = parseInt(localStorage.getItem(storageKeys.activity) || '0');

    if (lastActivity !== 0 && now - lastActivity > sessionTimeoutMs) {
        localStorage.removeItem(storageKeys.count);
        localStorage.removeItem(storageKeys.history);
        localStorage.removeItem(storageKeys.activity);
        localStorage.removeItem(storageKeys.lastMessage);
    }

    let messageCount = parseInt(localStorage.getItem(storageKeys.count) || '0');
    let lastMessageTime = parseInt(localStorage.getItem(storageKeys.lastMessage) || '0');
    const history = JSON.parse(localStorage.getItem(storageKeys.history) || '[]');

    function saveHistory() {
        localStorage.setItem(storageKeys.history, JSON.stringify(history));
        localStorage.setItem(storageKeys.activity, Date.now());
    }

    function ensureWelcomeMessage(text) {
        if (history.length === 0) {
            history.push({ text, sender: 'bot' });
            saveHistory();
        }
    }

    function appendMessage(text, sender) {
        history.push({ text, sender });
        saveHistory();
        // Keep the existing separate timestamps for storage and the live countdown.
        lastActivity = Date.now();
    }

    function recordSentMessage(currentTime) {
        messageCount++;
        lastMessageTime = currentTime;
        localStorage.setItem(storageKeys.count, messageCount);
        localStorage.setItem(storageKeys.lastMessage, lastMessageTime);
        localStorage.setItem(storageKeys.activity, currentTime);
    }

    function resetMessageLimit() {
        messageCount = 0;
        localStorage.removeItem(storageKeys.count);
        localStorage.removeItem(storageKeys.activity);
        localStorage.removeItem(storageKeys.lastMessage);
        // The conversation and live timestamps survive a countdown reset.
    }

    return {
        get messageCount() { return messageCount; },
        get lastActivity() { return lastActivity; },
        get lastMessageTime() { return lastMessageTime; },
        history,
        ensureWelcomeMessage,
        appendMessage,
        recordSentMessage,
        resetMessageLimit,
    };
}
