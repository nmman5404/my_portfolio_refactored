export function initLanguage() {
    const languageSwitchButton = document.getElementById('lang-switch');

    function saveScrollPosition() {
        sessionStorage.setItem('scrollPosition', window.scrollY);
    }

    function revealPageAfterSwitch() {
        document.body.style.transition = 'opacity 0.3s ease-in-out';
        document.documentElement.classList.remove('is-switching');
    }

    function restoreScrollPosition() {
        const savedPosition = sessionStorage.getItem('scrollPosition');
        if (savedPosition === null) return;

        window.scrollTo({ top: parseInt(savedPosition), behavior: 'instant' });
        sessionStorage.removeItem('scrollPosition');
        setTimeout(revealPageAfterSwitch, 10);
    }

    if (languageSwitchButton) {
        languageSwitchButton.addEventListener('click', saveScrollPosition);
    }
    document.addEventListener('DOMContentLoaded', restoreScrollPosition);
}
