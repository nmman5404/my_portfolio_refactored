const pageQueryParameter = 'projectPage';

export function initProjects() {
    const section = document.querySelector('[data-projects]');
    if (!section) return;

    const pages = [...section.querySelectorAll('[data-project-page]')];
    const pagesContainer = section.querySelector('[data-project-pages]');
    const previousButton = section.querySelector('[data-project-previous]');
    const nextButton = section.querySelector('[data-project-next]');
    const pageNumber = section.querySelector('[data-project-current-page]');
    const status = section.querySelector('[data-project-status]');
    if (!pages.length || !pagesContainer || !previousButton || !nextButton || !pageNumber || !status) return;

    let currentPage = 1;

    function clampPage(value) {
        const page = Number(value);
        return Number.isInteger(page) ? Math.max(1, Math.min(page, pages.length)) : 1;
    }

    function savePageToUrl() {
        const url = new URL(window.location.href);
        if (currentPage === 1) url.searchParams.delete(pageQueryParameter);
        else url.searchParams.set(pageQueryParameter, String(currentPage));

        if (url.href !== window.location.href) history.replaceState(history.state, '', url);
    }

    function revealPageStart() {
        const bounds = pagesContainer.getBoundingClientRect();
        const topInset = parseFloat(getComputedStyle(section).scrollMarginTop) || 0;
        if (bounds.top >= topInset && bounds.top < window.innerHeight) return;

        const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        section.scrollIntoView({ block: 'start', behavior: reducedMotion ? 'instant' : 'smooth' });
    }

    function showPage(value, { trigger, scroll = false } = {}) {
        currentPage = clampPage(value);
        const focusedElement = document.activeElement;
        const hidingFocusedPage = pages.some((page, index) => index !== currentPage - 1 && page.contains(focusedElement));

        pages.forEach((page, index) => {
            const isActive = index === currentPage - 1;
            page.hidden = !isActive;
            page.inert = !isActive;
        });
        previousButton.disabled = currentPage === 1;
        nextButton.disabled = currentPage === pages.length;
        pageNumber.textContent = String(currentPage);
        savePageToUrl();

        // A button at an endpoint can become disabled. Keep focus on a usable control.
        if (trigger?.disabled) {
            const availableButton = currentPage === 1 ? nextButton : previousButton;
            (availableButton.disabled ? status : availableButton).focus({ preventScroll: true });
        } else if (hidingFocusedPage) {
            status.focus({ preventScroll: true });
        }

        if (scroll) revealPageStart();
    }

    function restorePageFromUrl() {
        const url = new URL(window.location.href);
        showPage(url.searchParams.get(pageQueryParameter));
    }

    previousButton.addEventListener('click', () => showPage(currentPage - 1, { trigger: previousButton, scroll: true }));
    nextButton.addEventListener('click', () => showPage(currentPage + 1, { trigger: nextButton, scroll: true }));
    window.addEventListener('popstate', restorePageFromUrl);
    restorePageFromUrl();
}
