import { readFileSync } from 'node:fs';
import path from 'node:path';
import ceremony from '../../src/modules/ceremony/data.js';
import { invitationFields, resolveInvitationCopy, validateInvitation, validateInvitationProfile } from '../../src/modules/ceremony/invitation.js';
const recipientFields = new Set(['id', 'profile', 'aliases', 'enabled', 'notes', ...invitationFields]);

/** Name-like IDs are lookup keys only; the raw URL value is never displayed. */
export function normalizeRecipientId(value = '') {
  if (value === null) return '';
  if (typeof value !== 'string' || value.length > 100
      || /[\u0000-\u001f\u007f-\u009f]/u.test(value)
      || !/^[\p{L}\p{N}\p{M} ._'’-]*$/u.test(value)) {
    throw new TypeError('Invalid recipient id.');
  }
  const normalized = value.normalize('NFKC').trim().toLocaleLowerCase('vi')
    .replace(/đ/g, 'd').normalize('NFD').replace(/\p{M}/gu, '')
    .replace(/[ ._'’-]+/g, '');
  return ['null', 'undefined'].includes(normalized) ? '' : normalized;
}

/** Validate the whole directory, including disabled entries, before any lookup. */
export function validateRecipients(data) {
  if (!data || typeof data !== 'object' || Array.isArray(data) || !Array.isArray(data.recipients)) {
    throw new Error('Ceremony recipients.json requires a recipients array.');
  }
  const seen = new Map();
  return data.recipients.map((recipient, index) => {
    const location = `Ceremony recipients[${index}]`;
    if (!recipient || typeof recipient !== 'object' || Array.isArray(recipient)) {
      throw new Error(`${location} must be an object.`);
    }
    for (const field of Object.keys(recipient)) {
      if (!recipientFields.has(field)) throw new Error(`${location} has an unknown field: ${field}.`);
    }
    if (typeof recipient.id !== 'string' || !normalizeRecipientId(recipient.id)) {
      throw new Error(`${location}.id must be a non-empty name-like ID; null/undefined are reserved.`);
    }
    validateInvitation(recipient, { partial: true, label: location });
    if (recipient.profile !== undefined) validateInvitationProfile(recipient.profile, `${location}.profile`);
    if (recipient.enabled !== undefined && typeof recipient.enabled !== 'boolean') {
      throw new Error(`${location}.enabled must be true or false.`);
    }
    if (recipient.aliases !== undefined && !Array.isArray(recipient.aliases)) {
      throw new Error(`${location}.aliases must be an array.`);
    }
    if (recipient.notes !== undefined && typeof recipient.notes !== 'string') {
      throw new Error(`${location}.notes must be a string.`);
    }
    const aliases = recipient.aliases ?? [];
    for (const key of [recipient.id, ...aliases]) {
      if (typeof key !== 'string') throw new Error(`${location}.aliases must contain only name-like strings.`);
      const normalized = normalizeRecipientId(key);
      if (!normalized) throw new Error(`${location} has an empty or reserved alias.`);
      if (seen.has(normalized) && seen.get(normalized) !== index) {
        throw new Error(`${location} has an ID or alias that matches another recipient.`);
      }
      seen.set(normalized, index);
    }
    return { ...recipient, aliases: [...aliases] };
  });
}

/** Read on each request so the local preview picks up guest JSON edits directly. */
export function readRecipients({ cwd = process.cwd, readFile = readFileSync } = {}) {
  let data;
  try {
    // Match the existing chat readers and the root-relative Vercel includeFiles.
    const filename = path.join(cwd(), 'src', 'modules', 'ceremony', 'recipients.json');
    data = JSON.parse(readFile(filename, 'utf8'));
  } catch (error) {
    throw new Error('Ceremony recipients.json could not be read as valid JSON.', { cause: error });
  }
  return validateRecipients(data);
}

export function resolveInvitation(id = '', {
  directory = readRecipients(),
  defaults = ceremony.invitation,
} = {}) {
  const normalized = normalizeRecipientId(id);
  const recipients = validateRecipients({ recipients: directory });
  const recipient = normalized ? recipients.find((entry) => entry.enabled !== false
    && [entry.id, ...entry.aliases].some((key) => normalizeRecipientId(key) === normalized)) : undefined;
  // Explicit field allowlist keeps IDs, aliases, notes and other guests private.
  return {
    ...resolveInvitationCopy(defaults, recipient),
    personalized: Boolean(recipient),
  };
}
