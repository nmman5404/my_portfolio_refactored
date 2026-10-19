export function initLanguage() {
    const languageSwitchButton = document.getElementById('lang-switch');

    function saveScrollPosition() {
        updateLanguageDestination();
        sessionStorage.setItem('scrollPosition', window.scrollY);
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
        const savedPosition = sessionStorage.getItem('scrollPosition');
        if (savedPosition === null) return;

        window.scrollTo({ top: parseInt(savedPosition), behavior: 'instant' });
        sessionStorage.removeItem('scrollPosition');
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
