import { localStore } from '../../shared/storage.js';

const storageKeys = {
    count: 'aiMessageCount',
    history: 'aiChatHistory',
    activity: 'aiLastActivity',
    lastMessage: 'aiLastMessageTime',
};

function readNumber(key) {
    const value = Number(localStore.getItem(key));
    return Number.isFinite(value) && value >= 0 ? Math.floor(value) : 0;
}

function readHistory() {
    try {
        const history = JSON.parse(localStore.getItem(storageKeys.history) || '[]');
        return Array.isArray(history) ? history.filter(message => message
            && typeof message.text === 'string'
            && (message.sender === 'user' || message.sender === 'bot')) : [];
    } catch (_) {
        return [];
    }
}

/** Own the persisted conversation and limits without touching the interface. */
export function createChatSession({ sessionTimeoutMs }) {
    const now = Date.now();
    let lastActivity = readNumber(storageKeys.activity);

    if (lastActivity !== 0 && now - lastActivity > sessionTimeoutMs) {
        Object.values(storageKeys).forEach(key => localStore.removeItem(key));
        lastActivity = 0;
    }

    let messageCount = readNumber(storageKeys.count);
    let lastMessageTime = readNumber(storageKeys.lastMessage);
    const history = readHistory();

    function saveHistory() {
        localStore.setItem(storageKeys.history, JSON.stringify(history));
        localStore.setItem(storageKeys.activity, Date.now());
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
        localStore.setItem(storageKeys.count, messageCount);
        localStore.setItem(storageKeys.lastMessage, lastMessageTime);
        localStore.setItem(storageKeys.activity, currentTime);
    }

    function resetMessageLimit() {
        messageCount = 0;
        localStore.removeItem(storageKeys.count);
        localStore.removeItem(storageKeys.activity);
        localStore.removeItem(storageKeys.lastMessage);
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
