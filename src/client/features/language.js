import { sessionStore } from '../shared/storage.js';

export function initLanguage() {
    const languageSwitchButton = document.getElementById('lang-switch');

    function saveScrollPosition() {
        updateLanguageDestination();
        sessionStore.setItem('scrollPosition', window.scrollY);
    }

    function handleSwitchKeydown(event) {
        if (event.key !== ' ') return;

        event.preventDefault();
        if (!event.repeat) languageSwitchButton.click();
    }

    function updateLanguageDestination() {
        const target = new URL(languageSwitchButton.href);
        const projectPage = new URLSearchParams(window.location.search).get('projectPage');
        if (projectPage) target.searchParams.set('projectPage', projectPage);
        else target.searchParams.delete('projectPage');
        languageSwitchButton.href = target.href;
    }

    function revealPageAfterSwitch() {
        document.body.style.transition = 'opacity 0.3s ease-in-out';
        document.documentElement.classList.remove('is-switching');
    }

    function restoreScrollPosition() {
        const savedPosition = sessionStore.getItem('scrollPosition');
        if (savedPosition === null) {
            document.documentElement.classList.remove('is-switching');
            return;
        }

        const position = Number(savedPosition);
        if (Number.isFinite(position) && position >= 0) {
            window.scrollTo({ top: position, behavior: 'instant' });
        }
        sessionStore.removeItem('scrollPosition');
        setTimeout(revealPageAfterSwitch, 10);
    }

    if (languageSwitchButton) {
        // Read again on click: pagination can change after initialization.
        updateLanguageDestination();
        languageSwitchButton.addEventListener('click', saveScrollPosition);
        languageSwitchButton.addEventListener('keydown', handleSwitchKeydown);
    }
    document.addEventListener('DOMContentLoaded', restoreScrollPosition);
}
