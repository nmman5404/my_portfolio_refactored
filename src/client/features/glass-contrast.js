function colorChannels(color) {
  const channels = color.match(/[\d.]+/g)?.map(Number);
  return channels?.length >= 3 ? [...channels.slice(0, 3), channels[3] ?? 1] : [0, 0, 0, 0];
}

function composite(foreground, background) {
  return foreground.slice(0, 3).map((channel, index) => channel * foreground[3] + background[index] * (1 - foreground[3]));
}

function luminance(color) {
  const linear = color.slice(0, 3).map(channel => {
    const value = channel / 255;
    return value <= 0.04045 ? value / 12.92 : ((value + 0.055) / 1.055) ** 2.4;
  });
  return linear[0] * 0.2126 + linear[1] * 0.7152 + linear[2] * 0.0722;
}

function contrast(first, second) {
  const a = luminance(first);
  const b = luminance(second);
  return (Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05);
}

/** Clear controls adapt their text to the local backdrop instead of hiding it
 * behind an opaque panel. Sample only while open, on actual UI changes. */
export function initGlassContrast(panel) {
  const root = document.documentElement;
  const labels = [...panel.querySelectorAll('.settings-panel-title, .settings-row-main, .settings-language, .settings-range-label')];
  const images = new Map();
  const blockedImages = new WeakSet();
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = 8;
  const context = canvas.getContext('2d', { willReadFrequently: true });
  if (!context) return;
  let frame;
  let revision = 0;

  function loadImage(url) {
    if (!images.has(url)) {
      images.set(url, new Promise(resolve => {
        const image = new Image();
        image.onload = () => resolve(image);
        image.onerror = () => resolve(null);
        image.src = url;
      }));
    }
    return images.get(url);
  }

  function sampleImage(image, bounds, x, y, contain = false) {
    if (!image?.complete || !image.naturalWidth || blockedImages.has(image)) return null;
    const scale = (contain ? Math.min : Math.max)(bounds.width / image.naturalWidth, bounds.height / image.naturalHeight);
    const centerX = (x - bounds.left + (image.naturalWidth * scale - bounds.width) / 2) / scale;
    const centerY = (y - bounds.top + (image.naturalHeight * scale - bounds.height) / 2) / scale;
    const size = 24 / scale;
    const sourceX = Math.max(0, Math.min(image.naturalWidth - 1, centerX - size / 2));
    const sourceY = Math.max(0, Math.min(image.naturalHeight - 1, centerY - size / 2));
    try {
      context.clearRect(0, 0, 8, 8);
      context.drawImage(image, sourceX, sourceY, Math.min(size, image.naturalWidth - sourceX), Math.min(size, image.naturalHeight - sourceY), 0, 0, 8, 8);
      const pixels = context.getImageData(0, 0, 8, 8).data;
      const total = [0, 0, 0, 0];
      for (let index = 0; index < pixels.length; index += 4) {
        for (let channel = 0; channel < 4; channel++) total[channel] += pixels[index + channel];
      }
      return [total[0] / 64, total[1] / 64, total[2] / 64, total[3] / (64 * 255)];
    } catch (_) {
      // External images without CORS permission fall back to authored colors.
      blockedImages.add(image);
      canvas.width = 8;
      return null;
    }
  }

  async function pageBackdrop(x, y) {
    const fallback = colorChannels(getComputedStyle(root).backgroundColor).slice(0, 3);
    const background = document.querySelector('.theme-bg');
    if (!background) return fallback;
    const url = getComputedStyle(background).backgroundImage.match(/url\(["']?(.*?)["']?\)/)?.[1];
    const image = url ? await loadImage(url) : null;
    const sampled = sampleImage(image, background.getBoundingClientRect(), x, y);
    const color = sampled ? composite(sampled, fallback) : fallback;
    const overlay = background.firstElementChild;
    return overlay ? composite(colorChannels(getComputedStyle(overlay).backgroundColor), color) : color;
  }

  async function backdropAt(x, y) {
    let color = await pageBackdrop(x, y);
    const beneath = document.elementsFromPoint(x, y).find(element => !panel.contains(element) && !element.contains(panel));
    const layers = [];
    for (let element = beneath; element && element !== root; element = element.parentElement) {
      const style = getComputedStyle(element);
      layers.push(colorChannels(style.backgroundColor));
      if (element instanceof HTMLImageElement) {
        const sampled = sampleImage(element, element.getBoundingClientRect(), x, y, style.objectFit === 'contain');
        if (sampled) layers.push(sampled);
      }
    }
    for (const layer of layers.reverse()) color = composite(layer, color);
    return composite(colorChannels(getComputedStyle(panel).backgroundColor), color);
  }

  async function update() {
    const currentRevision = ++revision;
    if (panel.hidden || root.dataset.glassEnabled !== 'true') return;
    const dark = [17, 24, 39];
    const light = [248, 250, 252];
    await Promise.all(labels.map(async label => {
      const bounds = label.getBoundingClientRect();
      const color = await backdropAt(bounds.left + bounds.width / 2, bounds.top + bounds.height / 2);
      if (currentRevision !== revision || panel.hidden) return;
      const useLight = contrast(light, color) > contrast(dark, color);
      label.style.setProperty('--glass-label-color', useLight ? '#f8fafc' : '#111827');
      label.style.setProperty('--glass-label-shadow', useLight ? '0 1px 2px rgb(0 0 0 / .35)' : '0 1px 1px rgb(255 255 255 / .25)');
    }));
  }

  function schedule() {
    revision++;
    cancelAnimationFrame(frame);
    if (panel.hidden || root.dataset.glassEnabled !== 'true') return;
    frame = requestAnimationFrame(update);
  }

  function handleThemeChange(records) {
    schedule();
    if (panel.hidden || !records.some(record => record.attributeName === 'class')) return;
    // A theme transition can replace the background image after its first frame.
    const transitions = document.getAnimations().filter(animation =>
      typeof CSSTransition !== 'undefined' && animation instanceof CSSTransition);
    if (transitions.length) {
      Promise.allSettled(transitions.map(animation => animation.finished)).then(schedule);
    }
  }

  new MutationObserver(schedule).observe(panel, { attributes: true, attributeFilter: ['hidden'] });
  new MutationObserver(handleThemeChange).observe(root, { attributes: true, attributeFilter: ['class', 'data-glass-enabled', 'data-glass-transparency'] });
  window.addEventListener('scroll', schedule, { passive: true });
  panel.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule);
  document.addEventListener('transitionend', schedule, true);
  document.addEventListener('load', event => {
    if (event.target instanceof HTMLImageElement) schedule();
  }, true);
}
