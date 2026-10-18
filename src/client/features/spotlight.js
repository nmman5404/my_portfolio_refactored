export function initSpotlight() {
    const spotlightCards = document.querySelectorAll('.skill-card, .project-card, .edu-card');

    spotlightCards.forEach(card => {
        function updatePointerPosition(event) {
            const bounds = card.getBoundingClientRect();
            const pointerX = event.clientX - bounds.left;
            const pointerY = event.clientY - bounds.top;

            card.style.setProperty('--mouse-x', `${pointerX}px`);
            card.style.setProperty('--mouse-y', `${pointerY}px`);
        }

        card.addEventListener('mousemove', updatePointerPosition);
    });
}
