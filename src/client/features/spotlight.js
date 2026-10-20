export function initSpotlight() {
    const spotlightCards = document.querySelectorAll('.skill-card, .project-card, .edu-card');

    spotlightCards.forEach(card => {
        let frame;
        let clientX;
        let clientY;

        function updatePointerPosition(event) {
            clientX = event.clientX;
            clientY = event.clientY;
            if (frame !== undefined) return;

            frame = requestAnimationFrame(() => {
                frame = undefined;
                const bounds = card.getBoundingClientRect();
                card.style.setProperty('--mouse-x', `${clientX - bounds.left}px`);
                card.style.setProperty('--mouse-y', `${clientY - bounds.top}px`);
            });
        }

        card.addEventListener('mousemove', updatePointerPosition);
    });
}
