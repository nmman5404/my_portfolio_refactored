/** A stable file name independent of the private recipient ID. */
export function posterFilename(name) {
  const slug = name.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().replace(/đ/g, 'd')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80).replace(/-$/, '');
  return `thiep-tot-nghiep-${slug || 'khach-moi'}.png`;
}

/** Reuse the live poster and its CSS in a fixed desktop viewport, without scroll clipping. */
export async function renderPosterImage(poster) {
  const { domToBlob } = await import('/assets/js/vendor/modern-screenshot.js');
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.tabIndex = -1;
  frame.inert = true;
  Object.assign(frame.style, {
    position: 'fixed', left: '-10000px', top: '0', width: '1100px', height: '1000px',
    border: '0', pointerEvents: 'none',
  });
  const loaded = new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('Poster stylesheet timed out.')), 15000);
    frame.onload = () => { clearTimeout(timer); resolve(); };
    frame.onerror = () => { clearTimeout(timer); reject(new Error('Poster stylesheet unavailable.')); };
  });
  frame.srcdoc = '<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="/assets/css/ceremony.css"></head><body></body></html>';
  document.body.append(frame);
  try {
    await loaded;
    const doc = frame.contentDocument;
    if (!doc.querySelector('link').sheet) throw new Error('Poster stylesheet unavailable.');
    doc.documentElement.lang = document.documentElement.lang;
    const card = doc.importNode(poster, true);
    Object.assign(card.style, { width: '960px', maxHeight: 'none', height: 'auto', overflow: 'visible' });
    doc.body.append(card);
    card.getBoundingClientRect(); // Request the fonts used by the cloned content.
    await Promise.all([...card.querySelectorAll('img')].map(image => image.decode()));
    await doc.fonts.ready;
    const blob = await domToBlob(card, {
      scale: 2, backgroundColor: '#101b2b', timeout: 15000,
      font: { preferredFormat: 'woff2' }, features: { copyScrollbar: false },
      fetch: { placeholderImage: () => { throw new Error('Poster image unavailable.'); } },
    });
    if (!blob?.size) throw new Error('Poster image was empty.');
    return blob;
  } finally {
    frame.onload = frame.onerror = null;
    frame.remove();
  }
}

function downloadImage(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.append(link);
  try { link.click(); }
  catch (error) { URL.revokeObjectURL(url); throw error; }
  finally { link.remove(); }
  return () => URL.revokeObjectURL(url);
}

/** Own download state, feedback and cleanup; rendering remains a separate operation. */
export function createPosterDownload({ button, poster, feedback, copy,
  render = renderPosterImage, writeFile = downloadImage,
}) {
  let busy = false;
  let visible = false;
  let destroyed = false;
  let feedbackTimer;
  const releases = new Set();
  button.hidden = true;
  button.disabled = false;
  button.setAttribute('aria-busy', 'false');

  function notify(message, temporary = false) {
    clearTimeout(feedbackTimer);
    if (!visible || destroyed) return;
    feedback.textContent = message;
    feedback.hidden = false;
    if (temporary) feedbackTimer = setTimeout(() => { feedback.hidden = true; }, 3000);
  }

  function setVisible(value) {
    visible = value;
    button.hidden = !value;
    if (!value) {
      clearTimeout(feedbackTimer);
      feedback.hidden = true;
    }
  }

  async function save(name) {
    if (busy || !visible || destroyed) return false;
    busy = true;
    button.disabled = true;
    button.setAttribute('aria-busy', 'true');
    notify(copy.downloadPreparing);
    try {
      const blob = await render(poster);
      if (destroyed) return false;
      const release = writeFile(blob, posterFilename(name));
      if (release) {
        const entry = { release, timer: 0 };
        entry.timer = setTimeout(() => { release(); releases.delete(entry); }, 30000);
        releases.add(entry);
      }
      notify(copy.downloadSaved, true);
      return true;
    } catch {
      notify(copy.downloadError);
      return false;
    } finally {
      busy = false;
      if (!destroyed) {
        button.disabled = false;
        button.setAttribute('aria-busy', 'false');
      }
    }
  }

  function destroy() {
    destroyed = true;
    clearTimeout(feedbackTimer);
    feedback.hidden = true;
    for (const { release, timer } of releases) { clearTimeout(timer); release(); }
    releases.clear();
  }

  return { save, setVisible, destroy };
}
