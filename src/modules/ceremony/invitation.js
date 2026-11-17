/** Shared scene contract for authored defaults, build validation and the API. */
export const sceneNames = Object.freeze(['intro', 'thankYou', 'personalMessage', 'invitation']);
export const invitationFields = Object.freeze(['displayName', ...sceneNames]);
const sceneTextFields = Object.freeze(['eyebrow', 'title', 'body']);
const invitationTextFields = Object.freeze([...sceneTextFields, 'signature', 'time']);
const fieldsForScene = (name) => name === 'invitation' ? invitationTextFields : sceneTextFields;
const isObject = (value) => value && typeof value === 'object' && !Array.isArray(value);

// Resolve profiles into empty copy so the existing sequence can skip those scenes.
const profileHiddenFields = Object.freeze({
  casual: Object.freeze(['thankYou', 'personalMessage']),
  friend: Object.freeze(['personalMessage']),
  close: Object.freeze([]),
});

export function validateInvitationProfile(value, label = 'Ceremony invitation.profile') {
  if (typeof value !== 'string' || !Object.hasOwn(profileHiddenFields, value)) {
    throw new Error(`${label} must be one of: ${Object.keys(profileHiddenFields).join(', ')}.`);
  }
}

/** Defaults are complete; each recipient may override only selected scene fields. */
export function validateInvitation(data, { partial = false, label = 'Ceremony invitation' } = {}) {
  if (!isObject(data)) throw new Error(`${label} must be an object.`);
  if (typeof data.displayName !== 'string' || !data.displayName.trim()) {
    throw new Error(`${label}.displayName must be a non-empty string.`);
  }
  for (const name of sceneNames) {
    if (partial && !Object.hasOwn(data, name)) continue;
    if (!isObject(data[name])) throw new Error(`${label}.${name} must be an object.`);
    const fields = fieldsForScene(name);
    for (const key of Object.keys(data[name])) {
      if (!fields.includes(key)) throw new Error(`${label}.${name} has an unknown field: ${key}.`);
    }
    for (const key of fields) {
      if (partial && !Object.hasOwn(data[name], key)) continue;
      if (typeof data[name][key] !== 'string') throw new Error(`${label}.${name}.${key} must be a string.`);
    }
  }
}

/** Missing inherits; an explicit empty/whitespace-only string intentionally stays empty. */
export function resolveInvitationCopy(defaults, overrides = {}) {
  validateInvitation(defaults);
  const profile = overrides.profile === undefined ? 'casual' : overrides.profile;
  validateInvitationProfile(profile);
  const text = (source, fallback, key) => (Object.hasOwn(source, key) ? source[key] : fallback[key]).trim();
  const displayName = text(overrides, defaults, 'displayName');
  const copy = { displayName };
  for (const name of sceneNames) {
    const hidden = profileHiddenFields[profile].includes(name);
    copy[name] = Object.fromEntries(fieldsForScene(name).map((field) => [field,
      hidden ? '' : text(overrides[name] ?? {}, defaults[name], field).replaceAll('{name}', () => displayName),
    ]));
  }
  return copy;
}
