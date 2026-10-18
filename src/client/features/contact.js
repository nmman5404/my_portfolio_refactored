export function initContactTypewriter({ contactPhrases }) {
    const contactElement = document.getElementById('contact-rotating-text');
    let phraseIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;

    function rotateContact() {
        const currentPhrase = contactPhrases[phraseIndex];

        if (isDeleting) {
            contactElement.textContent = currentPhrase.substring(0, characterIndex - 1);
            characterIndex--;
        } else {
            contactElement.textContent = currentPhrase.substring(0, characterIndex + 1);
            characterIndex++;
        }

        let delay = isDeleting ? 40 : 80;
        if (!isDeleting && characterIndex === currentPhrase.length) {
            delay = 1000;
            isDeleting = true;
        } else if (isDeleting && characterIndex === 0) {
            isDeleting = false;
            phraseIndex = (phraseIndex + 1) % contactPhrases.length;
            delay = 300;
        }

        setTimeout(rotateContact, delay);
    }

    window.addEventListener('load', rotateContact);
}
