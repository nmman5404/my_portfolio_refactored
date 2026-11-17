import { resolveInvitationCopy, validateInvitation } from '../modules/ceremony/invitation.js';

function requireText(value, field, { optional = false } = {}) {
  if (typeof value !== 'string' || (!optional && !value.trim())) {
    throw new Error(`Ceremony ${field} must be ${optional ? 'a string' : 'a non-empty string'}.`);
  }
}

function requireLocalUrl(value, field) {
  if (typeof value !== 'string' || !value.startsWith('/') || value.startsWith('//') || /[\s\\?#]/.test(value)) {
    throw new Error(`Ceremony ${field} must be a root-relative local URL.`);
  }
}

export function validateCeremony(data) {
  if (!data || typeof data !== 'object') throw new Error('Ceremony requires module data.');
  if (!/^\/[a-z0-9-]+(?:\/[a-z0-9-]+)*\/$/.test(data.href)) {
    throw new Error('Ceremony href must be a root-relative directory URL ending with /.');
  }
  validateInvitation(data.invitation);
  if (typeof data.showInNavigation !== 'boolean') throw new Error('Ceremony showInNavigation must be true or false.');
  requireText(data.locale, 'locale');
  const textGroups = {
    navigation: ['en', 'vi'],
    page: ['title', 'description'],
    identity: ['initial', 'name', 'brand', 'byline', 'homeLabel', 'footer'],
    hero: ['eyebrow', 'preface', 'title', 'subtitle', 'characterAlt', 'sceneLabel', 'fallingCaption', 'landedCaption'],
    ui: ['experienceLabel', 'letterLabel', 'recipientGeneral', 'recipientPersonal', 'personalizedTitle', 'open', 'loading',
      'next', 'replay', 'download', 'downloadPreparing', 'downloadSaved', 'downloadError',
      'soundOn', 'soundOff', 'soundEnded', 'unavailable', 'error',
      'generalLink', 'noScript', 'readyStatus', 'openStatus', 'endStatus'],
    poster: ['sceneLabel', 'eyebrow', 'title', 'hostPrefix', 'invitePrefix', 'timeLabel',
      'placeLabel', 'parkingLabel', 'artCaption', 'footnote'],
  };
  for (const [group, fields] of Object.entries(textGroups)) {
    for (const field of fields) {
      const optional = ['hero', 'poster'].includes(group) && !['sceneLabel', 'characterAlt'].includes(field);
      requireText(data[group]?.[field], `${group}.${field}`, { optional });
    }
  }
  requireLocalUrl(data.identity.homeHref, 'identity.homeHref');
  const sequence = ['land', 'podium', 'curtain', 'dear', 'thanks', 'personal', 'invitation', 'end', 'finish'];
  let previous = 0;
  for (const key of sequence) {
    const value = data.animation?.[key];
    if (!Number.isFinite(value) || value <= previous) throw new Error(`Ceremony animation.${key} must follow the previous cue.`);
    previous = value;
  }
  for (const key of ['character', 'cap', 'curtain', 'podium', 'confetti']) {
    const media = data.media?.[key];
    requireLocalUrl(media?.src, `media.${key}.src`);
    if (!Number.isFinite(media.width) || media.width <= 0 || !Number.isFinite(media.height) || media.height <= 0) {
      throw new Error(`Ceremony media.${key} requires a local URL, width and height.`);
    }
  }
  requireLocalUrl(data.media.favicon, 'media.favicon');
  requireText(data.music?.src, 'music.src', { optional: true });
  if (data.music.src.trim()) requireLocalUrl(data.music.src, 'music.src');
  if (!Number.isFinite(data.music.volume) || data.music.volume < 0 || data.music.volume > 1) {
    throw new Error('Ceremony music.volume must be a number between 0 and 1.');
  }
  if (typeof data.music.loop !== 'boolean') throw new Error('Ceremony music.loop must be true or false.');
  for (const field of ['title', 'mapLabel']) requireText(data.event?.[field], `event.${field}`, { optional: true });
  for (const field of ['date', 'venue', 'address', 'mapUrl', 'note']) {
    requireText(data.event?.[field], `event.${field}`, { optional: true });
  }
  if (data.event.mapUrl.trim()) {
    let url;
    try { url = new URL(data.event.mapUrl.trim()); } catch { /* Report the authoring field below. */ }
    if (!url || !['https:', 'http:'].includes(url.protocol)) {
      throw new Error('Ceremony event.mapUrl must be a complete https:// or http:// URL.');
    }
  }
  return data;
}

/** Explicit public allowlist: the private guest directory never enters this config. */
export function buildCeremonyConfig(data) {
  validateCeremony(data);
  return {
    locale: data.locale,
    href: data.href,
    endpoint: '/api/invitation',
    page: data.page,
    ui: data.ui,
    hero: data.hero,
    timeline: data.animation,
    media: data.media,
    music: data.music,
    defaultInvitation: {
      ...resolveInvitationCopy(data.invitation),
      personalized: false,
    },
  };
}
