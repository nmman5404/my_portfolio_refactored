import { initTheme } from '../features/theme.js';

export function initArticleTheme() {
  initTheme({ viewTransition: false, onThemeChange() {} });
}
