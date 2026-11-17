/** Fetch one invitation; the browser never receives the recipient directory. */
export async function loadInvitation(config, { signal } = {}) {
  const ids = new URLSearchParams(window.location.search).getAll('id');
  const isGeneral = (value) => ['', 'null', 'undefined'].includes(value.trim().toLowerCase());
  if (!ids.length || (ids.length === 1 && isGeneral(ids[0]))) return config.defaultInvitation;

  const url = new URL(config.endpoint, window.location.href);
  for (const id of ids) url.searchParams.append('id', id);
  const timeout = new AbortController();
  const abort = () => timeout.abort();
  if (signal?.aborted) abort();
  else signal?.addEventListener('abort', abort, { once: true });
  const timer = setTimeout(() => timeout.abort(), 10000);
  try {
    const response = await fetch(url, {
      cache: 'no-store',
      signal: timeout.signal,
    });
    if (!response.ok) throw new Error('Invitation unavailable.');
    const data = await response.json();
    const hasShape = (value, reference) => typeof reference === 'object'
      ? value && typeof value === 'object' && !Array.isArray(value)
        && Object.keys(reference).every((key) => hasShape(value[key], reference[key]))
      : typeof value === typeof reference;
    if (!hasShape(data, config.defaultInvitation) || !data.displayName.trim()) {
      throw new Error('Invalid invitation response.');
    }
    return data;
  } finally {
    clearTimeout(timer);
    signal?.removeEventListener('abort', abort);
  }
}
