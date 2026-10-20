export function initAudio({ tracks, credits, volume, loop }) {
    const musicToggleButton = document.getElementById('music-toggle');
    const musicIconOn = document.getElementById('music-icon-on');
    const musicIconOff = document.getElementById('music-icon-off');

    const lightMusicUrl = tracks.light.url;
    const darkMusicUrl = tracks.dark.url;
    const interactionEvents = ['scroll', 'click', 'touchstart', 'keydown'];

    const backgroundMusic = new Audio();
    backgroundMusic.preload = 'none';
    backgroundMusic.loop = loop;
    backgroundMusic.volume = volume;

    let isMusicPlaying = false;
    let currentMusicTheme = '';
    let hasUserInteracted = false;
    let playbackRequestId = 0;

    function updateMusicIcon() {
        musicToggleButton.setAttribute('aria-checked', String(isMusicPlaying));
        if (isMusicPlaying) {
            musicIconOn.classList.remove('hidden');
            musicIconOff.classList.add('hidden');
        } else {
            musicIconOn.classList.add('hidden');
            musicIconOff.classList.remove('hidden');
        }
    }

    const musicCredit = document.getElementById('music-credit');

    function playMusic(errorMessage) {
        const requestId = ++playbackRequestId;
        backgroundMusic.play().catch(error => {
            // Pausing or replacing the track can reject an older play request.
            if (requestId !== playbackRequestId) return;
            isMusicPlaying = false;
            updateMusicIcon();
            console.warn(errorMessage, error);
        });
    }

    function loadThemeMusic() {
        const isDark = document.documentElement.classList.contains('dark');
        const targetTheme = isDark ? 'dark' : 'light';
        const musicUrl = isDark ? darkMusicUrl : lightMusicUrl;

        if (currentMusicTheme === targetTheme) return;

        playbackRequestId++;
        backgroundMusic.src = musicUrl;
        currentMusicTheme = targetTheme;
        musicCredit.innerHTML = isDark ? credits.dark : credits.light;
        if (isMusicPlaying) {
            playMusic('Lỗi chuyển nhạc:');
        }
    }

    function releaseAudioUnlock() {
        hasUserInteracted = true;
        interactionEvents.forEach(event => {
            window.removeEventListener(event, unlockAudio);
        });
    }

    function handleMusicToggle() {
        releaseAudioUnlock();
        if (isMusicPlaying) {
            playbackRequestId++;
            backgroundMusic.pause();
            isMusicPlaying = false;
        } else {
            playMusic('Lỗi phát nhạc:');
            isMusicPlaying = true;
        }
        updateMusicIcon();
    }

    function handleAudioUnlocked() {
        releaseAudioUnlock();
        isMusicPlaying = true;
        updateMusicIcon();
    }

    function unlockAudio() {
        if (hasUserInteracted) return;

        const requestId = ++playbackRequestId;
        backgroundMusic.play().then(() => {
            if (requestId === playbackRequestId) handleAudioUnlocked();
        }).catch(() => {
            // Autoplay can stay blocked until a later user gesture; keep listening.
        });
    }

    function initializeThemeMusic() {
        loadThemeMusic();

        if (!hasUserInteracted) {
            interactionEvents.forEach(event => {
                window.addEventListener(event, unlockAudio, { passive: true });
            });
        }
    }

    function handleVisibilityChange() {
        if (!isMusicPlaying) return;
        if (document.hidden) {
            playbackRequestId++;
            backgroundMusic.pause();
        } else {
            playMusic('Lỗi phát lại nhạc khi quay về tab:');
        }
    }

    musicToggleButton.addEventListener('click', handleMusicToggle);
    window.addEventListener('DOMContentLoaded', initializeThemeMusic);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return { loadThemeMusic };
}
