export function initReveal(typeWriterName) {
    const revealElements = document.querySelectorAll('.reveal');
    const revealOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    function handleVisibilityChanges(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }

    const revealObserver = new IntersectionObserver(handleVisibilityChanges, revealOptions);
    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    if (typeWriterName) window.addEventListener('load', typeWriterName);
}
