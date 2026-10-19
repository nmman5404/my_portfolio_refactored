import { initTheme } from './features/theme.js';
import { initLanguage } from './features/language.js';
import { initChat } from './features/chat.js';
import { initProjects } from './features/projects.js';
import { initSettings } from './features/settings.js';
import { initGlass } from './features/glass.js';
import { initSpotlight } from './features/spotlight.js';
import { initProfileTypewriter } from './features/profile.js';
import { initReveal } from './features/reveal.js';
import { initContactSearch } from './features/contact.js';
import { initAudio } from './features/audio.js';

/** The entry coordinates features; each feature owns its DOM and private state. */
export function initHome(config) {
  const enabledSections = new Set(config.sections);
  let audioController;

  // The theme handler runs on user interaction, after audio is initialized.
  function handleThemeChange() {
    audioController.loadThemeMusic();
  }

  initTheme({
    viewTransition: config.viewTransition,
    onThemeChange: handleThemeChange,
  });
  initLanguage();
  initSettings();
  initGlass();
  const chatController = initChat(config.chat);
  if (enabledSections.has('projects')) initProjects();
  initSpotlight();
  const startNameTypewriter = enabledSections.has('profile') ? initProfileTypewriter(config.profile) : undefined;
  initReveal(startNameTypewriter);
  if (enabledSections.has('contact')) initContactSearch(config.contact, chatController);
  audioController = initAudio(config.audio);
}
