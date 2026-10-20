const GENERATE_CONTENT_URL = 'https://generativelanguage.googleapis.com/v1beta/models';
const REQUEST_TIMEOUT_MS = 45000;
const BLOCKED_FINISH_REASONS = new Set(['SAFETY', 'RECITATION', 'LANGUAGE']);

class ProviderError extends Error {
    constructor(statusCode = 502) {
        super('AI provider is temporarily unavailable.');
        this.name = 'ProviderError';
        this.statusCode = statusCode;
    }
}

/** Use Node's native fetch; credentials stay in a header, outside request URLs. */
export async function generateReply({
    prompt,
    systemInstruction,
    apiKey,
    modelName,
    fetchImpl = fetch,
    timeoutMs = REQUEST_TIMEOUT_MS,
}) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), timeoutMs);

    try {
        const model = encodeURIComponent(modelName.replace(/^models\//, ''));
        const response = await fetchImpl(`${GENERATE_CONTENT_URL}/${model}:generateContent`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'x-goog-api-key': apiKey },
            body: JSON.stringify({
                systemInstruction: { parts: [{ text: systemInstruction }] },
                contents: [{ role: 'user', parts: [{ text: prompt }] }],
                generationConfig: { maxOutputTokens: 2048 },
            }),
            signal: controller.signal,
        });
        if (!response.ok) throw new ProviderError();

        const data = await response.json();
        const candidate = data?.candidates?.[0];
        const parts = candidate?.content?.parts;
        if (!Array.isArray(parts) || BLOCKED_FINISH_REASONS.has(candidate.finishReason)) {
            throw new ProviderError();
        }
        const reply = parts.filter(part => typeof part?.text === 'string' && part.thought !== true)
            .map(part => part.text).join('');
        if (!reply.trim()) throw new ProviderError();

        return reply;
    } catch {
        throw new ProviderError(controller.signal.aborted ? 504 : 502);
    } finally {
        clearTimeout(timeout);
    }
}
