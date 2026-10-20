const VISIBLE_COUNT = 3;
const ROTATION_INTERVAL_MS = 7000;
const FADE_DURATION_MS = 200;

/** Sample without replacement; callers can exclude the previous group first. */
function sampleSuggestions(suggestions, count = VISIBLE_COUNT) {
    const remaining = [...suggestions];
    const selected = [];
    while (selected.length < count && remaining.length) {
        const index = Math.floor(Math.random() * remaining.length);
        selected.push(remaining.splice(index, 1)[0]);
    }
    return selected;
}

/** Own the suggestion UI and its rotation; sending stays with the Contact controller. */
export function createContactSuggestions({ group, form, suggestions, canShuffle, onSelect }) {
    const availableSuggestions = Array.isArray(suggestions) ? suggestions.filter(item => item
        && typeof item.id === 'string' && item.id.trim()
        && typeof item.label === 'string' && item.label.trim()
        && typeof item.question === 'string' && item.question.trim()) : [];
    if (!group || !availableSuggestions.length) return { setDisabled() {} };

    const contact = form.closest('section') || form;
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
    let current = sampleSuggestions(availableSuggestions);
    let fadeTimer;
    let rotationTimer;

    const buttons = current.map((_, index) => {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'contact-suggestion glass-surface glass-control';
        button.addEventListener('click', () => onSelect(current[index].question, button));
        group.appendChild(button);
        return button;
    });

    function render(items) {
        current = items;
        buttons.forEach((button, index) => {
            const { id, label, question } = current[index];
            button.dataset.contactSuggestion = id;
            button.textContent = label;
            button.title = question;
        });
    }

    function cancelShuffle() {
        clearTimeout(fadeTimer);
        fadeTimer = undefined;
        group.classList.remove('is-shuffling');
    }

    function isInteracting(element) {
        return element.matches(':hover') || element.contains(document.activeElement);
    }

    function isContactVisible() {
        const bounds = contact.getBoundingClientRect();
        return bounds.bottom > 0 && bounds.top < window.innerHeight
            && bounds.right > 0 && bounds.left < window.innerWidth;
    }

    function canRotate() {
        return !reducedMotion.matches && !document.hidden && isContactVisible()
            && !isInteracting(form) && !isInteracting(group) && canShuffle();
    }

    function rotate() {
        if (fadeTimer !== undefined || !canRotate()) return;
        const previousIds = new Set(current.map(({ id }) => id));
        const fresh = sampleSuggestions(availableSuggestions.filter(({ id }) => !previousIds.has(id)));
        if (!fresh.length) return;
        // Smaller authored lists can still rotate: introduce all new items, then fill the gaps.
        const next = [...fresh, ...sampleSuggestions(current, buttons.length - fresh.length)];

        group.classList.add('is-shuffling');
        fadeTimer = setTimeout(() => {
            fadeTimer = undefined;
            // Recheck after fading: a visitor may have started interacting in the meantime.
            if (canRotate()) render(next);
            group.classList.remove('is-shuffling');
        }, FADE_DURATION_MS);
    }

    function configureRotation() {
        clearInterval(rotationTimer);
        cancelShuffle();
        if (!reducedMotion.matches && availableSuggestions.length > VISIBLE_COUNT) {
            rotationTimer = setInterval(rotate, ROTATION_INTERVAL_MS);
        }
    }

    function pauseIfNeeded() {
        if (!canRotate()) cancelShuffle();
    }

    // Restore visibility immediately if an interaction begins during the fade.
    [form, group].forEach((element) => {
        element.addEventListener('pointerenter', cancelShuffle);
        element.addEventListener('focusin', cancelShuffle);
    });
    form.addEventListener('input', cancelShuffle);
    form.addEventListener('compositionstart', cancelShuffle);
    document.addEventListener('visibilitychange', cancelShuffle);
    window.addEventListener('scroll', pauseIfNeeded, { passive: true });
    window.addEventListener('resize', pauseIfNeeded);
    reducedMotion.addEventListener('change', configureRotation);

    render(current);
    configureRotation();

    return {
        setDisabled(disabled) {
            if (disabled) cancelShuffle();
            buttons.forEach((button) => { button.disabled = disabled; });
        },
    };
}
