// The disclosure owns only its open state. Each setting keeps its own feature module.
export function initSettings() {
    const control = document.getElementById('settings-control');
    const toggle = document.getElementById('settings-toggle');
    const panel = document.getElementById('settings-panel');
    if (!control || !toggle || !panel || control.dataset.initialized) return;
    control.dataset.initialized = 'true';

    function close({ restoreFocus = false } = {}) {
        panel.hidden = true;
        toggle.setAttribute('aria-expanded', 'false');
        if (restoreFocus) toggle.focus();
    }

    function open() {
        panel.hidden = false;
        toggle.setAttribute('aria-expanded', 'true');
        panel.querySelector('a[href], button:not([disabled]), input:not([disabled])')?.focus();
    }

    toggle.addEventListener('click', () => {
        if (panel.hidden) open();
        else close({ restoreFocus: true });
    });

    document.addEventListener('pointerdown', event => {
        if (!panel.hidden && !control.contains(event.target)) close();
    });

    control.addEventListener('keydown', event => {
        if (event.key !== 'Escape' || panel.hidden) return;
        event.preventDefault();
        close({ restoreFocus: true });
    });

    // Safari can blur the active control without focusing the tapped button.
    // Close only when focus actually moves to something outside the settings.
    document.addEventListener('focusin', event => {
        if (!panel.hidden && !control.contains(event.target)) close();
    });

    document.getElementById('lang-switch')?.addEventListener('click', () => close());
}
