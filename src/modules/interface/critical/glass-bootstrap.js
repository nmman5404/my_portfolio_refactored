(function () {
  var enabled = true;
  var transparency = 60;
  try {
    var saved = JSON.parse(localStorage.getItem('portfolio-glass'));
    if (saved && typeof saved === 'object') {
      if (typeof saved.enabled === 'boolean') enabled = saved.enabled;
      if (typeof saved.transparency === 'number' && Number.isFinite(saved.transparency)) {
        transparency = Math.round(Math.min(100, Math.max(0, saved.transparency)));
      }
    }
  } catch (_) {
    // A missing or unavailable preference uses the default material.
  }
  document.documentElement.dataset.glassEnabled = String(enabled);
  document.documentElement.dataset.glassTransparency = String(transparency);
  document.documentElement.style.setProperty('--glass-transparency', transparency / 100);
}());
