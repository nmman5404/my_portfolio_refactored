import { articlePresets } from '../modules/article/presets.js';
import { createArticleClientEntries } from '../modules/article/client-entries.js';

export default function articleClientEntries() {
  return createArticleClientEntries(Object.values(articlePresets));
}
