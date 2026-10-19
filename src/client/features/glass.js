import { initGlassContrast } from './glass-contrast.js';

const preferenceKey = 'portfolio-glass';
const defaultPreferences = { enabled: true, transparency: 60 };

function normalizePreferences(value) {
  return {
    enabled: typeof value?.enabled === 'boolean' ? value.enabled : defaultPreferences.enabled,
    transparency: typeof value?.transparency === 'number' && Number.isFinite(value.transparency)
      ? Math.round(Math.min(100, Math.max(0, value.transparency)))
      : defaultPreferences.transparency,
  };
}

export function initGlass() {
  const root = document.documentElement;
  const toggle = document.getElementById('glass-toggle');
  const range = document.getElementById('glass-opacity');
  const output = document.getElementById('glass-value');
  if (!toggle || !range || !output) return;
  let preferences = normalizePreferences({
    enabled: root.dataset.glassEnabled !== 'false',
    transparency: Number(root.dataset.glassTransparency ?? 60),
  });

  function applyPreferences() {
    const { enabled, transparency } = preferences;
    root.dataset.glassEnabled = String(enabled);
    root.dataset.glassTransparency = String(transparency);
    root.style.setProperty('--glass-transparency', transparency / 100);
    toggle.setAttribute('aria-checked', String(enabled));
    range.value = String(transparency);
    range.disabled = !enabled;
    range.setAttribute('aria-valuetext', `${transparency}%`);
    output.value = `${transparency}%`;
  }

  function savePreferences() {
    applyPreferences();
    try {
      localStorage.setItem(preferenceKey, JSON.stringify(preferences));
    } catch (_) {
      // The controls still work when the browser disallows persistence.
    }
  }

  function toggleGlass() {
    preferences = { ...preferences, enabled: !preferences.enabled };
    savePreferences();
  }

  function changeTransparency() {
    preferences = normalizePreferences({ ...preferences, transparency: Number(range.value) });
    savePreferences();
  }

  function syncPreference(event) {
    if (event.key !== preferenceKey && event.key !== null) return;
    try {
      preferences = normalizePreferences(JSON.parse(event.newValue));
    } catch (_) {
      preferences = { ...defaultPreferences };
    }
    applyPreferences();
  }

  applyPreferences();
  toggle.addEventListener('click', toggleGlass);
  range.addEventListener('input', changeTransparency);
  window.addEventListener('storage', syncPreference);
  const panel = document.getElementById('settings-panel');
  if (panel) initGlassContrast(panel);
}

