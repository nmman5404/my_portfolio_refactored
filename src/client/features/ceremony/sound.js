/** Background music starts only after Open; tab changes preserve the user's choice. */
export function createCeremonySound({ button, audio, volume, copy }) {
  let enabled = Boolean(audio);
  let opened = false;
  let finished = false;
  let suspended = false;
  let destroyed = false;
  let playbackRequest = 0;

  if (audio) audio.volume = volume;
  button.hidden = !audio;

  function updateButton() {
    const label = finished ? copy.soundEnded : enabled ? copy.soundOff : copy.soundOn;
    button.disabled = !audio || finished;
    button.setAttribute('aria-pressed', String(enabled && !finished));
    button.setAttribute('aria-label', label);
    button.title = label;
  }

  function stop() {
    playbackRequest++;
    audio?.pause();
  }

  function failed() {
    if (destroyed) return;
    enabled = false;
    updateButton();
  }

  function play() {
    if (!audio || !opened || !enabled || finished || audio.ended || suspended || destroyed) return;
    const request = ++playbackRequest;
    try {
      void audio.play().catch(() => {
        // A later mute, replay or tab change can cancel an older play request.
        if (request === playbackRequest) failed();
      });
    } catch {
      failed();
    }
  }

  function open() {
    if (destroyed) return;
    opened = true;
    finished = false;
    if (audio) audio.currentTime = 0;
    updateButton();
    play();
  }

  function toggle() {
    if (!audio || finished || destroyed) return;
    enabled = !enabled;
    updateButton();
    if (enabled) play();
    else stop();
  }

  function finish() {
    if (destroyed) return;
    finished = true;
    stop();
    updateButton();
  }

  audio?.addEventListener('error', failed);
  audio?.addEventListener('ended', finish);
  updateButton();

  return {
    open,
    toggle,
    suspend: () => { suspended = true; stop(); },
    resume: () => { suspended = false; play(); },
    destroy: () => {
      destroyed = true;
      stop();
      audio?.removeEventListener('error', failed);
      audio?.removeEventListener('ended', finish);
    },
  };
}
