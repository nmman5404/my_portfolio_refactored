import { initTheme } from './features/theme.js';
import { initLanguage } from './features/language.js';
import { initChat } from './features/chat.js';
import { initProjectSlider } from './features/slider.js';
import { initSpotlight } from './features/spotlight.js';
import { initProfileTypewriter } from './features/profile.js';
import { initReveal } from './features/reveal.js';
import { initContactTypewriter } from './features/contact.js';
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
  initChat(config.chat);
  if (enabledSections.has('projects')) initProjectSlider();
  initSpotlight();
  const startNameTypewriter = enabledSections.has('profile') ? initProfileTypewriter(config.profile) : undefined;
  initReveal(startNameTypewriter);
  if (enabledSections.has('contact')) initContactTypewriter(config.contact);
  audioController = initAudio(config.audio);
}
