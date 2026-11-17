import { createAtmosphere } from './atmosphere.js';
import { sampleCharacterMotion } from './character-motion.js';

const clamp = (value, min = 0, max = 1) => Math.max(min, Math.min(max, value));
const smooth = (value) => { const p = clamp(value); return p * p * (3 - 2 * p); };
const ease = (p) => p < 0.5 ? 4 * p ** 3 : 1 - (-2 * p + 2) ** 3 / 2;
const spring = (p) => p === 0 ? 0 : 1 + 2.35 * (p - 1) ** 3 + 1.35 * (p - 1) ** 2;

/** Owns layout and visual transforms; the page supplies playback snapshots. */
export function createCeremonyScene(root, config) {
  const get = (id) => root.querySelector(`#${id}`);
  const character = get('character-rig');
  const cap = get('cap-rig');
  const hero = get('hero-scene');
  const letter = get('letter-scene');
  const poster = get('poster-scene');
  const caption = get('hero-caption');
  const floor = root.querySelector('.stage-floor');
  const atmosphere = createAtmosphere(get('atmosphere'), get('confetti-sprites'));
  let headPoint = { x: 0.5, y: 0.3, at: config.timeline.land };
  let destroyed = false;

  function resize() {
    if (destroyed) return;
    const height = root.clientHeight;
    const landscape = window.matchMedia('(orientation: landscape) and (max-height: 600px)').matches;
    character.style.minHeight = '0px';
    if (landscape) {
      character.style.height = `${height * 0.58}px`;
    } else {
      const feet = height - parseFloat(getComputedStyle(character).bottom);
      const headingBottom = get('graduation-title').getBoundingClientRect().bottom - root.getBoundingClientRect().top;
      const target = Math.min(height * (window.innerWidth <= 640 ? 0.43 : 0.44), 450);
      // Reserve cap height and jump headroom so the title stays unobstructed.
      const available = (feet - headingBottom - 48) / 1.16;
      character.style.height = `${Math.max(80, Math.min(target, available))}px`;
    }
    const feet = character.offsetTop + character.offsetHeight * 0.992;
    const aspect = config.media.podium.width / config.media.podium.height;
    const podiumHeight = get('theater-stage').offsetWidth / aspect;
    root.style.setProperty('--podium-aspect', String(aspect));
    root.style.setProperty('--stage-y', `${feet - podiumHeight * 0.26}px`);
    root.style.setProperty('--stage-x', `${character.offsetLeft}px`);
    root.style.setProperty('--caption-y', `${feet + podiumHeight * 0.74 + 15}px`);
    atmosphere.resize();
  }

  function positionHat(time, idle, motion, timeline) {
    const view = root.getBoundingClientRect();
    const height = character.offsetHeight;
    // Pixel anchors belong to the authored character/cap pair, not the clock.
    const radians = motion.rotation * Math.PI / 180;
    const headX = -6 / 1494 * height * motion.scaleX;
    const headY = (0.115 - 0.94) * height * motion.scaleY;
    const finalX = character.offsetLeft + headX * Math.cos(radians) - headY * Math.sin(radians);
    const finalHeadY = character.offsetTop + height * 0.94 + motion.lift + headX * Math.sin(radians) + headY * Math.cos(radians);
    const capWidth = height * (idle ? 0.49 : 0.62);
    const finalY = finalHeadY - 740 / 1536 * capWidth;
    let x = finalX - capWidth / 2;
    let y = finalY;
    let angle = 0;
    let opacity = 1;
    const fallAt = Math.min(2.1, timeline.land * 0.6);
    if (idle) {
      x = clamp(x + Math.min(height * 0.48, view.width * 0.28), 8, view.width - capWidth + 16);
      y -= height * 0.03 + Math.sin(time * 1.3) * 7;
      angle = 12 + Math.sin(time) * 2;
    } else if (time < fallAt) {
      opacity = 0;
      y = -capWidth;
    } else if (time < timeline.land) {
      const progress = clamp((time - fallAt) / (timeline.land - fallAt));
      const eased = ease(progress);
      x += (1 - eased) * Math.min(150, view.width * 0.2) + Math.sin(progress * Math.PI) * 38;
      y = -capWidth + (finalY + capWidth) * eased;
      angle = -24 * (1 - eased) + Math.sin(progress * Math.PI * 3) * 7 * (1 - progress);
    } else {
      const elapsed = time - timeline.land;
      y -= Math.sin(Math.min(elapsed / 0.65, 1) * Math.PI) * 14 * Math.exp(-elapsed * 1.4);
      angle = Math.sin(elapsed * 9) * 3 * Math.exp(-elapsed * 3);
    }
    Object.assign(cap.style, {
      left: `${x}px`, top: `${y}px`, width: `${capWidth}px`,
      transform: `rotate(${angle + motion.rotation}deg)`, opacity: String(opacity),
    });
    get('cap-glow').style.opacity = String(idle ? 0.13 : Math.exp(-Math.pow((time - timeline.land - 0.14) / 0.55, 2)));
    headPoint = { x: finalX / view.width, y: (finalHeadY - height * 0.055) / view.height, at: timeline.land };
  }

  function render(snapshot, now, reduced, timeline) {
    if (destroyed) return;
    const { started, time, phase, begin, finish } = snapshot;
    const idle = !started;
    const motionTime = reduced ? 0 : idle ? now / 1000 : time;
    const heroAlpha = idle ? 1 : 1 - smooth((time - (timeline.letter - 0.9)) / 0.9);
    hero.style.opacity = String(heroAlpha);
    hero.setAttribute('aria-hidden', String(heroAlpha < 0.08));
    if (heroAlpha > 0.001) {
      const motion = sampleCharacterMotion(time, timeline, { height: character.offsetHeight, reduced });
      if (idle) motion.rotation = reduced ? 0 : Math.sin(motionTime * 0.7) * 0.6;
      character.style.transform = `translateX(-50%) translateY(${motion.lift}px) rotate(${motion.rotation}deg) scale(${motion.scaleX}, ${motion.scaleY})`;
      positionHat(motionTime, idle, motion, timeline);
    }
    // Ending glow stays alive after the letter clock has finished.
    atmosphere.render(time, phase, headPoint, idle || phase === 'end' ? now / 1000 : time);
    const podium = idle || reduced ? 0 : spring(clamp((time - timeline.podium) / 1.0));
    const curtain = idle || reduced ? 0 : spring(clamp((time - timeline.curtain) / 1.05));
    const theaterOpacity = idle || reduced ? 0 : smooth((time - timeline.podium) / 0.18) * (1 - smooth((time - timeline.end) / 0.8));
    root.style.setProperty('--podium-progress', String(podium));
    root.style.setProperty('--curtain-progress', String(curtain));
    root.style.setProperty('--theater-opacity', String(theaterOpacity));
    root.style.setProperty('--curtain-sway', `${Math.sin((time - timeline.curtain) * 3.2) * Math.exp(-Math.max(0, time - timeline.curtain) * 0.9) * 1.2}deg`);
    floor.style.opacity = String((1 - clamp(podium)) * (['idle', 'celebration'].includes(phase) ? 1 : 0));
    const titleReveal = idle ? 1 : 1 - smooth((time - (timeline.letter - 1.4)) / 1.0);
    caption.textContent = time > timeline.land + 0.65 ? config.hero.landedCaption : time > 2.6 ? config.hero.fallingCaption : '';
    caption.hidden = !caption.textContent.trim();
    caption.style.opacity = idle ? '0' : String(smooth((time - 2.6) / 0.45) * titleReveal);
    const isLetter = !['idle', 'celebration', 'end'].includes(phase);
    const letterFade = Math.min(0.3, (finish - begin) / 2);
    const letterAlpha = isLetter ? reduced ? 1 : smooth((time - begin) / letterFade) * (1 - smooth((time - (finish - letterFade)) / letterFade)) : 0;
    letter.style.opacity = String(letterAlpha);
    letter.style.transform = `translate(-50%, -50%) translateY(${reduced ? 0 : (1 - letterAlpha) * 18}px)`;
    letter.setAttribute('aria-hidden', String(letterAlpha < 0.08));
    letter.inert = letterAlpha < 0.08;
    const posterAlpha = phase === 'end' ? reduced ? 1 : smooth((time - timeline.end) / 1.15) : 0;
    poster.style.opacity = String(posterAlpha);
    poster.style.transform = `translateY(${reduced ? 0 : (1 - posterAlpha) * 18}px)`;
    poster.setAttribute('aria-hidden', String(posterAlpha < 0.08));
    poster.inert = posterAlpha < 0.08;
    const wash = idle || reduced ? 0 : 0.55 * Math.exp(-Math.pow((time - (timeline.letter - 0.15)) / 0.25, 2));
    get('light-wash').style.opacity = String(wash);
    let left = -15, right = 15, beam = idle ? 0.13 : 0.2;
    if (!idle && time < 2.2 && !reduced) {
      left = -24 + Math.sin(time * 2.2) * 19;
      right = 24 + Math.sin(time * 2.6 + 1) * 14;
      beam = 0.18;
    } else if (!idle && time < timeline.letter) {
      left = -8; right = 8;
      beam = 0.25 + Math.exp(-Math.pow((time - (timeline.land + 0.1)) / 0.5, 2)) * 0.22;
    } else if (!idle) {
      left = 4; right = -4; beam = phase === 'end' ? 0.13 : 0.11;
    }
    root.style.setProperty('--beam-left-angle', `${left}deg`);
    root.style.setProperty('--beam-right-angle', `${right}deg`);
    root.style.setProperty('--beam-opacity', String(beam));
    get('progress-fill').style.width = `${idle ? 0 : time / timeline.finish * 100}%`;
  }

  return {
    resize, render,
    destroy: () => { destroyed = true; atmosphere.destroy(); },
  };
}
