import { localized } from './localized.js';

function formatMusicCredit(track, audio, locale) {
  return `<a href="${track.credit.url}" target="_blank" class="hover:text-blue-500 dark:hover:text-blue-400">${track.credit.title}</a> ${localized(audio.creditBy, locale)} <b>${track.credit.author}</b> ${localized(audio.creditOn, locale)} Pixabay`;
}

function validateTypewriterPhrases(section, field, phrases, locale) {
  const valid = Array.isArray(phrases) && phrases.length > 0
    && phrases.every((phrase) => typeof phrase === 'string' && phrase.length > 0);
  if (!valid) {
    throw new Error(`${section}.${field} must contain at least one non-empty string (${locale})`);
  }
}

/** Generated entry files consume authored module data; HTML contains no app JS. */
export function buildClientConfig(modules, locale, sections) {
  const { chat, audio, profile, contact } = modules;
  const sectionIds = sections.map((section) => section.id);
  const enabled = new Set(sectionIds);
  const roles = localized(profile.roles, locale);
  const contactPhrases = localized(contact.phrases, locale);

  if (enabled.has('profile')) {
    validateTypewriterPhrases('profile', 'roles', roles, locale);
  }
  if (enabled.has('contact')) {
    validateTypewriterPhrases('contact', 'phrases', contactPhrases, locale);
  }

  return {
    sections: sectionIds,
    viewTransition: localized(modules.interface.viewTransition, locale),
    profile: { nameText: localized(profile.name, locale), roles },
    contact: { contactPhrases },
    chat: {
      locale,
      limits: chat.limits,
      text: Object.fromEntries(Object.entries(chat.messages).map(([key, value]) => [key, localized(value, locale)])),
    },
    audio: {
      tracks: audio.tracks,
      credits: {
        light: formatMusicCredit(audio.tracks.light, audio, locale),
        dark: formatMusicCredit(audio.tracks.dark, audio, locale),
      },
      volume: audio.volume,
      loop: audio.loop,
    },
  };
}
