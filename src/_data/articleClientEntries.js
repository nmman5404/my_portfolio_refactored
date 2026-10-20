import { articlePresets } from '../modules/article/presets.js';
import { createArticleClientEntries } from '../modules/article/client-entries.js';
import chat from '../modules/chat/data.js';
import { buildChatConfig } from '../lib/client-config.js';

export default function articleClientEntries() {
  return createArticleClientEntries(Object.values(articlePresets), {
    chat: buildChatConfig(chat, 'vi', { welcome: chat.articleWelcome }),
  });
}
