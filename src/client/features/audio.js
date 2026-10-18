export function initAudio({ tracks, credits, volume, loop }) {
    const musicToggleButton = document.getElementById('music-toggle');
    const musicIconOn = document.getElementById('music-icon-on');
    const musicIconOff = document.getElementById('music-icon-off');

    const lightMusicUrl = tracks.light.url;
    const darkMusicUrl = tracks.dark.url;
    const interactionEvents = ['scroll', 'click', 'touchstart', 'keydown'];

    const backgroundMusic = new Audio();
    backgroundMusic.loop = loop;
    backgroundMusic.volume = volume;

    let isMusicPlaying = false;
    let currentMusicTheme = '';
    let hasUserInteracted = false;

    function updateMusicIcon() {
        if (isMusicPlaying) {
            musicIconOn.classList.remove('hidden');
            musicIconOff.classList.add('hidden');
        } else {
            musicIconOn.classList.add('hidden');
            musicIconOff.classList.remove('hidden');
        }
    }

    const musicCredit = document.getElementById('music-credit');

    function loadThemeMusic() {
        const isDark = document.documentElement.classList.contains('dark');
        const targetTheme = isDark ? 'dark' : 'light';
        const musicUrl = isDark ? darkMusicUrl : lightMusicUrl;

        if (currentMusicTheme === targetTheme) return;

        backgroundMusic.src = musicUrl;
        currentMusicTheme = targetTheme;
        musicCredit.innerHTML = isDark ? credits.dark : credits.light;
        if (isMusicPlaying) {
            backgroundMusic.play().catch(error => console.warn('Lỗi chuyển nhạc:', error));
        }
    }

    function clearMusicHighlight() {
        musicToggleButton.classList.remove('animate-gentle-shake', 'text-blue-500');
    }

    function handleMusicToggle() {
        hasUserInteracted = true;
        if (isMusicPlaying) {
            backgroundMusic.pause();
            isMusicPlaying = false;
        } else {
            backgroundMusic.play().catch(error => console.warn('Lỗi phát nhạc:', error));
            isMusicPlaying = true;
        }
        updateMusicIcon();
        clearMusicHighlight();
    }

    function handleAudioUnlocked() {
        hasUserInteracted = true;
        isMusicPlaying = true;
        updateMusicIcon();

        musicToggleButton.classList.add('animate-gentle-shake', 'text-blue-500');
        setTimeout(clearMusicHighlight, 1000);

        interactionEvents.forEach(event => {
            window.removeEventListener(event, unlockAudio);
        });
    }

    function unlockAudio() {
        if (hasUserInteracted) return;

        backgroundMusic.play().then(handleAudioUnlocked).catch(error => {
            console.log('Trình duyệt vẫn đang chặn nhạc, chờ tương tác rõ ràng hơn...', error);
        });
    }

    function initializeThemeMusic() {
        loadThemeMusic();

        interactionEvents.forEach(event => {
            window.addEventListener(event, unlockAudio, { passive: true });
        });
    }

    function handleVisibilityChange() {
        if (!isMusicPlaying) return;
        if (document.hidden) {
            backgroundMusic.pause();
        } else {
            backgroundMusic.play().catch(error => console.warn('Lỗi phát lại nhạc khi quay về tab:', error));
        }
    }

    musicToggleButton.addEventListener('click', handleMusicToggle);
    window.addEventListener('DOMContentLoaded', initializeThemeMusic);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return { loadThemeMusic };
}
