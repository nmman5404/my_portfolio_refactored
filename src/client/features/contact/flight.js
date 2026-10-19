/** Animate only a visual copy. The original question stays with the chat controller. */
export async function animateQuestionToChat(question, source) {
    const target = document.getElementById('chat-toggle-btn');
    if (!target || document.hidden || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const start = source.getBoundingClientRect();
    const end = target.getBoundingClientRect();
    const width = Math.min(start.width, 280, window.innerWidth - 32);
    const left = start.left + (start.width - width) / 2;
    const top = start.top + (start.height - 44) / 2;
    const dx = end.left + end.width / 2 - (left + width / 2);
    const dy = end.top + end.height / 2 - (top + 22);
    const bubble = document.createElement('div');
    bubble.className = 'contact-message-flight';
    bubble.textContent = question;
    bubble.setAttribute('aria-hidden', 'true');
    Object.assign(bubble.style, { left: `${left}px`, top: `${top}px`, width: `${width}px` });
    document.body.appendChild(bubble);

    try {
        if (typeof bubble.animate !== 'function') return;
        const animation = bubble.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            { transform: `translate(${dx * 0.45}px, ${dy * 0.15 - 36}px) scale(0.85)`, opacity: 1, offset: 0.45 },
            { transform: `translate(${dx}px, ${dy}px) scale(0.14)`, opacity: 0 },
        ], { duration: 620, easing: 'cubic-bezier(0.4, 0, 0.2, 1)', fill: 'forwards' });
        await animation.finished;
    } finally {
        bubble.remove();
    }
}
