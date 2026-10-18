export function initProfileTypewriter({ nameText, roles }) {
    const nameElement = document.getElementById('typewriter-name');
    let nameIndex = 0;

    const roleElement = document.getElementById('rotating-text');
    let roleIndex = 0;
    let characterIndex = 0;
    let isDeleting = false;

    function typeWriterName() {
        if (nameIndex < nameText.length) {
            nameElement.innerHTML += nameText.charAt(nameIndex);
            nameIndex++;
            setTimeout(typeWriterName, 70);
        } else {
            document.getElementById('name-cursor').classList.add('hidden');
            document.getElementById('role-cursor').classList.remove('hidden');
            setTimeout(rotateRoles, 500);
        }
    }

    function rotateRoles() {
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            roleElement.textContent = currentRole.substring(0, characterIndex - 1);
            characterIndex--;
        } else {
            roleElement.textContent = currentRole.substring(0, characterIndex + 1);
            characterIndex++;
        }

        let delay = isDeleting ? 50 : 100;

        if (!isDeleting && characterIndex === currentRole.length) {
            delay = 1500;
            isDeleting = true;
        } else if (isDeleting && characterIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            delay = 500;
        }

        setTimeout(rotateRoles, delay);
    }

    return typeWriterName;
}
