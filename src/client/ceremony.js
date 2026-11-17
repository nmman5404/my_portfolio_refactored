import { createPlayback } from './features/ceremony/playback.js';
import { createCeremonySequence } from './features/ceremony/sequence.js';
import { createCeremonyScene } from './features/ceremony/scene.js';
import { createCeremonySound } from './features/ceremony/sound.js';
import { createPosterDownload } from './features/ceremony/poster-download.js';
import { loadInvitation } from './features/ceremony/invitation.js';
import { formatMessage } from './shared/text.js';

/** Page entry: compose independent features and own the page lifecycle. */
export function initCeremony(config) {
  const root = document.getElementById('experience');
  if (!root || root.dataset.ceremonyInitialized) return;
  root.dataset.ceremonyInitialized = 'true';

  const get = (id) => root.querySelector(`#${id}`);
  const copy = config.ui;
  document.body.dataset.started = 'false';
  get('open-actions').inert = false;
  get('playback').hidden = true;
  get('open-button').disabled = true;
  get('open-label').textContent = copy.loading;
  get('load-error').hidden = true;
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');
  const listeners = new AbortController();
  const request = new AbortController();
  let sequence = createCeremonySequence(config.timeline, config.defaultInvitation);
  let clock = createPlayback(sequence);
  const scene = createCeremonyScene(root, config);
  const sound = createCeremonySound({
    button: get('sound-button'), audio: get('ceremony-music'), volume: config.music.volume, copy,
  });
  const download = createPosterDownload({
    button: get('download-button'), poster: root.querySelector('.graduation-poster'),
    feedback: get('download-feedback'), copy,
  });
  let data;
  let phase;
  let frame = 0;
  let destroyed = false;
  let suspended = document.hidden;
  let autoResume = false;
  let reducedMotion = reduced.matches;

  function listen(target, type, handler) {
    target.addEventListener(type, handler, { signal: listeners.signal });
  }

  function setText(id, text) {
    const node = get(id);
    node.textContent = text;
    node.hidden = !text.trim();
  }

  function showPhase(nextPhase) {
    if (phase === nextPhase) return;
    phase = nextPhase;
    document.body.dataset.phase = phase;
    const letter = get('letter-scene');
    letter.dataset.kind = phase;
    letter.scrollTop = 0;

    const { eyebrow = '', title = '', body = '', signature = '' } = sequence.phases.find((entry) => entry.id === phase)?.content ?? {};
    setText('letter-eyebrow', eyebrow);
    setText('letter-title', title);
    setText('letter-body', body);
    setText('letter-signature', signature);
    letter.querySelector('.letter-rule').hidden = !title || !body;
    if (phase === 'celebration') get('status').textContent = copy.openStatus;
    else if (phase === 'end') get('status').textContent = copy.endStatus;
    else if (phase !== 'idle') get('status').textContent = [eyebrow, title.replaceAll('\n', ' '), body].filter(Boolean).join('. ');

    const ended = phase === 'end';
    get('replay-button').hidden = !ended;
    get('next-button').hidden = ended;
    download.setVisible(ended);
    if (ended && document.activeElement === get('next-button')) {
      get('replay-button').focus({ preventScroll: true });
    }
  }

  function render(now = performance.now()) {
    // A restored page can update matchMedia.matches without a change event.
    // Detect that edge here too so the experience respects the new preference.
    if (reducedMotion !== reduced.matches) {
      reducedMotion = reduced.matches;
      const current = clock.snapshot(now);
      if (reducedMotion && current.started) {
        if (current.time < sequence.cues.letter) clock.start(now, sequence.readingAt, true);
        else clock.pause(now);
      }
    }
    const snapshot = clock.snapshot(now);
    showPhase(snapshot.phase);
    scene.render(snapshot, now, reducedMotion, sequence.cues);
  }

  function tick(now) {
    frame = 0;
    if (destroyed || suspended) return;
    render(now);
    frame = requestAnimationFrame(tick);
  }

  function startLoop() {
    if (!frame && !destroyed && !suspended) frame = requestAnimationFrame(tick);
  }

  function open() {
    if (!data || destroyed) return;
    const now = performance.now();
    const begin = reduced.matches ? sequence.readingAt : 0;
    clock.start(now, begin, reduced.matches);
    document.body.dataset.started = 'true';
    get('open-actions').inert = true;
    get('playback').hidden = false;
    render(now);
    get(clock.snapshot(now).phase === 'end' ? 'replay-button' : 'next-button').focus({ preventScroll: true });
    sound.open();
    startLoop();
  }

  function pause(value = !clock.snapshot(performance.now()).paused) {
    if (destroyed) return;
    const now = performance.now();
    clock.pause(now, value);
    if (value) sound.suspend();
    else if (!suspended) sound.resume();
    render(now);
  }

  function next() {
    if (destroyed) return;
    const now = performance.now();
    clock.next(now);
    render(now);
  }

  function suspend() {
    if (suspended || destroyed) return;
    const now = performance.now();
    const snapshot = clock.snapshot(now);
    autoResume = snapshot.started && !snapshot.paused && snapshot.phase !== 'end';
    clock.pause(now);
    sound.suspend();
    suspended = true;
    cancelAnimationFrame(frame);
    frame = 0;
  }

  function resume() {
    if (destroyed || document.hidden) return;
    if (autoResume) clock.pause(performance.now(), false);
    autoResume = false;
    suspended = false;
    sound.resume();
    scene.resize();
    startLoop();
  }

  function destroy() {
    if (destroyed) return;
    destroyed = true;
    cancelAnimationFrame(frame);
    request.abort();
    listeners.abort();
    scene.destroy();
    sound.destroy();
    download.destroy();
    delete root.dataset.ceremonyInitialized;
  }

  listen(get('open-button'), 'click', () => open());
  listen(get('next-button'), 'click', next);
  listen(get('replay-button'), 'click', () => open());
  listen(get('download-button'), 'click', () => { if (data) void download.save(data.displayName); });
  listen(get('sound-button'), 'click', sound.toggle);
  listen(window, 'resize', scene.resize);
  listen(document, 'visibilitychange', () => { if (document.hidden) suspend(); else resume(); });
  listen(window, 'pagehide', (event) => { if (event.persisted) suspend(); else destroy(); });
  listen(window, 'pageshow', (event) => { if (event.persisted) resume(); });
  listen(reduced, 'change', () => render());

  async function prepare() {
    try {
      [data] = await Promise.all([
        loadInvitation(config, { signal: request.signal }),
        ...['character-image', 'cap-image', 'curtain-image', 'podium-image', 'confetti-sprites'].map((id) => get(id).decode()),
      ]);
      if (destroyed) return;
      sequence = createCeremonySequence(config.timeline, data);
      clock = createPlayback(sequence);
      get('recipient-label').textContent = data.personalized
        ? formatMessage(copy.recipientPersonal, { name: data.displayName }) : copy.recipientGeneral;
      document.title = data.personalized
        ? formatMessage(copy.personalizedTitle, { name: data.displayName }) : config.page.title;
      setText('poster-recipient', data.displayName);
      setText('poster-message', data.invitation.body);
      setText('poster-arrival-time', data.invitation.time);
      const hasDate = Boolean(get('poster-date').textContent.trim());
      const hasTime = Boolean(data.invitation.time);
      get('poster-time-separator').hidden = !hasDate || !hasTime;
      get('poster-time').hidden = !hasDate && !hasTime;
      get('poster-details').hidden = !hasDate && !hasTime && !get('poster-place');
      get('open-button').disabled = false;
      get('open-label').textContent = copy.open;
      get('status').textContent = formatMessage(copy.readyStatus, { open: copy.open });
    } catch {
      if (destroyed) return;
      get('open-label').textContent = copy.unavailable;
      get('load-error').hidden = false;
    }
    scene.resize();
    void document.fonts.ready.then(scene.resize);
    startLoop();
  }

  scene.resize();
  render();
  void prepare();
  return { open, pause, next, replay: () => open(), destroy };
}
