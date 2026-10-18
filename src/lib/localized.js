/** Strings/shared values are authored once. Translations live beside each other. */
export function localized(value, locale = 'vi') {
  if (value && typeof value === 'object' && !Array.isArray(value)
      && ('vi' in value || 'en' in value)) {
    return value[locale] ?? value.vi ?? value.en;
  }
  return value;
}
