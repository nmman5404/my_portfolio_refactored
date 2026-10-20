import { readKnowledge } from './knowledge.js';
import { buildPrompt } from './prompt.js';
import { generateReply } from './gemini.js';
import { isArticleId, readArticle } from './articles.js';

const DEFAULT_MODEL_NAME = 'gemini-3.1-flash-lite';
const MAX_MESSAGE_LENGTH = 8000;
const MAX_HISTORY_MESSAGES = 6;

function readChatRequest(body) {
    if (!body || typeof body !== 'object' || Array.isArray(body)) return null;

    const { userMessage, lang = 'en', history = [], articleId } = body;
    if (typeof userMessage !== 'string' || !userMessage.trim()
        || userMessage.length > MAX_MESSAGE_LENGTH
        || !['en', 'vi'].includes(lang)
        || !Array.isArray(history) || history.length > MAX_HISTORY_MESSAGES
        || (articleId !== undefined && !isArticleId(articleId))) return null;

    const validHistory = history.every(message => message
        && ['user', 'bot'].includes(message.sender)
        && typeof message.text === 'string'
        && message.text.length <= MAX_MESSAGE_LENGTH);
    return validHistory ? { userMessage, lang, history, articleId } : null;
}

/**
 * Keep HTTP responses separate from provider setup and prompt generation.
 * Dependencies can be supplied without contacting the external provider.
 */
export function createChatHandler({
    requestReply = generateReply,
    loadKnowledge = readKnowledge,
    loadArticle = readArticle,
    environment = () => process.env,
    logger = console,
} = {}) {
    // A deployed knowledge file is immutable for this warm function instance.
    let knowledgeContent;

    return async function handler(req, res) {
        res.setHeader('Cache-Control', 'no-store');
        if (req.method !== 'POST') {
            res.setHeader('Allow', 'POST');
            return res.status(405).json({ message: 'Method Not Allowed' });
        }

        let chatRequest;
        try {
            // Vercel parses JSON lazily; a malformed body throws from this getter.
            chatRequest = readChatRequest(req.body);
        } catch {
            return res.status(400).json({ message: 'Invalid chat request.' });
        }
        if (!chatRequest) {
            return res.status(400).json({ message: 'Invalid chat request.' });
        }

        try {
            const article = chatRequest.articleId ? loadArticle(chatRequest.articleId) : null;
            if (chatRequest.articleId && !article) {
                return res.status(400).json({ message: 'Invalid article context.' });
            }

            const settings = environment();
            const apiKey = settings.GEMINI_API_KEY?.trim();
            if (!apiKey) {
                return res.status(503).json({ message: 'Chat is temporarily unavailable.' });
            }

            knowledgeContent ??= loadKnowledge({ logger });
            const reply = await requestReply({
                ...buildPrompt({ ...chatRequest, knowledgeContent, article }),
                apiKey,
                modelName: settings.GEMINI_MODEL_NAME?.trim() || DEFAULT_MODEL_NAME,
            });
            return res.status(200).json({ reply });
        } catch (error) {
            const status = error?.statusCode === 504 ? 504 : 502;
            // Provider errors can contain request URLs: never log or return them.
            logger.error('Chat API request failed.', { status });
            return res.status(status).json({ message: 'Chat is temporarily unavailable.' });
        }
    };
}
