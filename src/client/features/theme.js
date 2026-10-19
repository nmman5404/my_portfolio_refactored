export function initTheme({ viewTransition, onThemeChange }) {
    const darkThemeIcon = document.getElementById('theme-toggle-dark-icon');
    const lightThemeIcon = document.getElementById('theme-toggle-light-icon');
    const themeToggleButton = document.getElementById('theme-toggle');

    function updateIcon() {
        const isDark = document.documentElement.classList.contains('dark');
        themeToggleButton.setAttribute('aria-checked', String(isDark));
        if (isDark) {
            lightThemeIcon.classList.remove('hidden');
            darkThemeIcon.classList.add('hidden');
        } else {
            lightThemeIcon.classList.add('hidden');
            darkThemeIcon.classList.remove('hidden');
        }
    }
    updateIcon();

    function applyTheme() {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('color-theme', 'light');
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('color-theme', 'dark');
        }
        updateIcon();
        onThemeChange();
    }
    function handleThemeToggle() {
        if (viewTransition && document.startViewTransition) {
            document.startViewTransition(applyTheme);
        } else {
            applyTheme();
        }
    }

    themeToggleButton.addEventListener('click', handleThemeToggle);
}
