import { initSettings } from './features/settings.js';
import { initGlass } from './features/glass.js';

export function initArticleInterface() {
  initSettings();
  initGlass();
}
