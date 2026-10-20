import { initSettings } from './features/settings.js';
import { initGlass } from './features/glass.js';
import { initChat } from './features/chat.js';
import { initArticleSummary } from './features/article-summary.js';

export function initArticleInterface(config = {}) {
  initSettings();
  initGlass();

  const articleId = document.body.dataset.chatArticle;
  if (!articleId || !config.chat || !document.getElementById('chat-window')) return;
  const chat = initChat({ ...config.chat, articleId });
  initArticleSummary(chat);
}
