import { GoogleGenerativeAI } from '@google/generative-ai';
import { createChatHandler } from '../server/chat/handler.js';

// Keep the deployed route small; application logic is testable without Gemini.
export default createChatHandler({ GoogleGenerativeAI });
