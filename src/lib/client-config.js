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

/** Shared widget settings for homepages and article entries. */
export function buildChatConfig(chat, locale, { welcome } = {}) {
  const text = Object.fromEntries(
    Object.entries(chat.messages).map(([key, value]) => [key, localized(value, locale)]),
  );
  if (welcome) text.welcome = localized(welcome, locale);
  return { locale, limits: chat.limits, text };
}

/** Generated entry files consume authored module data; HTML contains no app JS. */
export function buildClientConfig(modules, locale, sections) {
  const { chat, audio, profile, contact } = modules;
  const sectionIds = sections.map((section) => section.id);
  const enabled = new Set(sectionIds);
  const roles = localized(profile.roles, locale);

  if (enabled.has('profile')) {
    validateTypewriterPhrases('profile', 'roles', roles, locale);
  }

  return {
    sections: sectionIds,
    viewTransition: localized(modules.interface.viewTransition, locale),
    profile: { nameText: localized(profile.name, locale), roles },
    contact: {
      sending: localized(contact.search.sending, locale),
      suggestions: contact.suggestions.map(({ id, label, question }) => ({
        id,
        label: localized(label, locale),
        question: localized(question, locale),
      })),
    },
    chat: buildChatConfig(chat, locale),
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
