/** The scene clock is independent of the DOM, audio and animation rendering. */
export function createPlayback(sequence) {
  const { phases, cues } = sequence;
  let started = false;
  let paused = false;
  let elapsed = 0;
  let anchor = 0;

  function snapshot(now) {
    const time = Math.min(cues.finish, elapsed + (started && !paused ? (now - anchor) / 1000 : 0));
    if (started && time >= cues.finish) {
      elapsed = cues.finish;
      paused = true;
    }
    const entry = started ? phases.findLast((phase) => time >= phase.begin) : undefined;
    return {
      started, paused, time,
      phase: entry?.id ?? 'idle',
      begin: entry?.begin ?? 0,
      finish: entry?.finish ?? cues.letter,
    };
  }

  function start(now, at = 0, hold = false) {
    started = true;
    paused = hold;
    elapsed = Math.max(0, Math.min(at, cues.finish));
    anchor = now;
  }

  function pause(now, value = true) {
    const current = snapshot(now);
    if (!started || current.phase === 'end') return;
    elapsed = current.time;
    anchor = now;
    paused = value;
  }

  function next(now) {
    if (!started) return;
    const current = snapshot(now);
    const nextPhase = phases.find((phase) => phase.begin > current.time);
    if (!nextPhase) return;
    // Land inside the incoming scene, even when authored scene durations change.
    const { begin, finish } = nextPhase;
    elapsed = begin + Math.min(0.85, (finish - begin) / 2);
    anchor = now;
  }

  return { snapshot, start, pause, next };
}
