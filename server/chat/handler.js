import { readKnowledge } from './knowledge.js';
import { buildPrompt } from './prompt.js';

const DEFAULT_MODEL_NAME = 'gemini-3.1-flash-lite';

/**
 * Keep HTTP responses separate from provider setup and prompt generation.
 * Dependencies can be supplied without contacting the external provider.
 */
export function createChatHandler({
    GoogleGenerativeAI,
    loadKnowledge = readKnowledge,
    environment = () => process.env,
    logger = console,
}) {
    function requestCompletion({ userMessage, lang, history }) {
        const genAI = new GoogleGenerativeAI(environment().GEMINI_API_KEY);
        const knowledgeContent = loadKnowledge({ logger });
        const finalPrompt = buildPrompt({ userMessage, lang, history, knowledgeContent });
        const aiModelName = environment().GEMINI_MODEL_NAME || DEFAULT_MODEL_NAME;
        const model = genAI.getGenerativeModel({ model: aiModelName });
        return model.generateContent(finalPrompt);
    }

    return async function handler(req, res) {
        if (req.method !== 'POST') {
            return res.status(405).json({ message: 'Method Not Allowed' });
        }

        try {
            const { userMessage, lang, history } = req.body;
            const result = await requestCompletion({ userMessage, lang, history });
            const response = await result.response;

            return res.status(200).json({ reply: response.text() });
        } catch (error) {
            logger.error('Lỗi chi tiết từ API:', error);
            return res.status(500).json({ message: 'Lỗi AI: ' + error.message });
        }
    };
}
