import { localStore } from '../../shared/storage.js';

const storageKeys = {
    count: 'aiMessageCount',
    activity: 'aiLastActivity',
    lastMessage: 'aiLastMessageTime',
};

function readNumber(key, fallback = 0) {
    const stored = localStore.getItem(key);
    if (stored === null) return fallback;
    const value = Number(stored);
    return Number.isFinite(value) && value >= 0 ? Math.floor(value) : fallback;
}

function readHistory(key) {
    try {
        const history = JSON.parse(localStore.getItem(key) || '[]');
        return Array.isArray(history) ? history.filter(message => message
            && typeof message.text === 'string'
            && (message.sender === 'user' || message.sender === 'bot')) : [];
    } catch (_) {
        return [];
    }
}

/** Persist context-specific messages while sharing cooldown and limits across pages. */
export function createChatSession({ sessionTimeoutMs, articleId }) {
    const historyKey = articleId
        ? `aiChatHistory:article:${encodeURIComponent(articleId)}`
        : 'aiChatHistory';
    const historyActivityKey = `${historyKey}:activity`;
    let lastActivity = readNumber(storageKeys.activity);
    let messageCount = readNumber(storageKeys.count);
    let lastMessageTime = readNumber(storageKeys.lastMessage);
    const memoryOnlyKeys = new Set();
    // Legacy homepage history used the shared activity timestamp.
    const historyActivity = readNumber(historyActivityKey, articleId ? 0 : lastActivity);
    const history = readHistory(historyKey);

    if (historyActivity !== 0 && Date.now() - historyActivity > sessionTimeoutMs) {
        history.length = 0;
        localStore.removeItem(historyKey);
        localStore.removeItem(historyActivityKey);
    }

    function writeLimit(key, value) {
        localStore.setItem(key, value);
        if (localStore.getItem(key) !== String(value)) memoryOnlyKeys.add(key);
    }

    function readLimit(key, fallback) {
        return memoryOnlyKeys.has(key) ? fallback : readNumber(key, fallback);
    }

    function resetMessageLimit() {
        messageCount = 0;
        lastActivity = 0;
        lastMessageTime = 0;
        // Persist zero so another open page can observe the reset as well.
        writeLimit(storageKeys.count, 0);
        writeLimit(storageKeys.activity, 0);
        writeLimit(storageKeys.lastMessage, 0);
    }

    function refreshLimits() {
        // Keep live values when persistence is blocked or storage is full.
        messageCount = readLimit(storageKeys.count, messageCount);
        lastActivity = readLimit(storageKeys.activity, lastActivity);
        lastMessageTime = readLimit(storageKeys.lastMessage, lastMessageTime);
        if (lastActivity !== 0 && Date.now() - lastActivity > sessionTimeoutMs) {
            resetMessageLimit();
        }
    }

    refreshLimits();

    function saveHistory() {
        localStore.setItem(historyKey, JSON.stringify(history));
        localStore.setItem(historyActivityKey, Date.now());
    }

    function ensureWelcomeMessage(text) {
        if (history.length === 0) {
            history.push({ text, sender: 'bot', welcome: true });
            // Merely visiting another article must not extend the shared limit.
            saveHistory();
        } else if (history[0].sender === 'bot' && !history[0].welcome) {
            // Existing conversations started with the authored welcome, before it was marked.
            history[0].welcome = true;
            saveHistory();
        }
    }

    function appendMessage(text, sender) {
        history.push({ text, sender });
        saveHistory();
        lastActivity = Date.now();
        writeLimit(storageKeys.activity, lastActivity);
    }

    function recordSentMessage(currentTime) {
        refreshLimits();
        messageCount++;
        lastMessageTime = currentTime;
        lastActivity = currentTime;
        writeLimit(storageKeys.count, messageCount);
        writeLimit(storageKeys.lastMessage, lastMessageTime);
        writeLimit(storageKeys.activity, currentTime);
    }

    return {
        get messageCount() { refreshLimits(); return messageCount; },
        get lastActivity() { refreshLimits(); return lastActivity; },
        get lastMessageTime() { refreshLimits(); return lastMessageTime; },
        history,
        ensureWelcomeMessage,
        appendMessage,
        recordSentMessage,
        resetMessageLimit,
    };
}
