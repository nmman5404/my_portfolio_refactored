/** Format authored UI text without embedding language variants in behavior. */
export function formatMessage(template, values) {
  return template.replace(/\{(\w+)\}/g, (match, name) => values[name] ?? match);
}
