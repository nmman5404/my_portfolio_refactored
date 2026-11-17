const rest = () => ({ lift: 0, rotation: 0, scaleX: 1, scaleY: 1 });

/** Small paper-puppet gestures; independent of DOM layout and the cap renderer. */
export function sampleCharacterMotion(time, timeline, { height = 330, reduced = false } = {}) {
  if (reduced) return rest();
  const greeting = (time - 0.45) / 1.25;
  if (greeting > 0 && greeting < 1) {
    return { ...rest(), rotation: -3.5 * Math.sin(greeting * Math.PI) };
  }

  function hop(at, duration, strength) {
    const elapsed = time - at;
    if (elapsed < -0.18 || elapsed > duration + 0.22) return null;
    if (elapsed < 0 || elapsed > duration) {
      const progress = elapsed < 0 ? (elapsed + 0.18) / 0.18 : 1 - (elapsed - duration) / 0.22;
      const squash = Math.sin(progress * Math.PI / 2) * 0.04 * strength;
      return { ...rest(), scaleX: 1 + squash, scaleY: 1 - squash };
    }
    const progress = elapsed / duration;
    return {
      ...rest(),
      lift: -Math.sin(progress * Math.PI) * Math.min(36, height * 0.12) * strength,
      rotation: Math.sin(progress * Math.PI * 2) * 1.6 * strength,
    };
  }

  const celebrateAt = timeline.podium + 0.85;
  return hop(celebrateAt, 0.8, 1) || hop(celebrateAt + 1.1, 0.65, 0.48) || rest();
}
