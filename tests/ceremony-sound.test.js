import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createCeremonySound } from '../src/client/features/ceremony/sound.js';

const copy = { soundOn: 'Bật âm thanh', soundOff: 'Tắt âm thanh', soundEnded: 'Nhạc đã kết thúc. Chọn Xem lại để nghe lại.' };

function setup({ music = true } = {}) {
  const attributes = new Map();
  const button = { setAttribute: (key, value) => attributes.set(key, value) };
  const requests = [];
  const audio = new EventTarget();
  Object.assign(audio, {
    currentTime: 0, paused: true,
    play() {
      this.paused = false;
      return new Promise((resolve, reject) => requests.push({ resolve, reject }));
    },
    pause() { this.paused = true; },
  });
  Object.defineProperty(audio, 'ended', { get: () => audio.currentTime >= 66 });
  const sound = createCeremonySound({ button, audio: music ? audio : null, volume: 0.32, copy });
  return { audio, button, attributes, requests, sound };
}

test('music waits for Open even when sound is toggled or the tab resumes first', () => {
  const { sound, requests, audio, attributes } = setup();
  assert.equal(audio.volume, 0.32);
  sound.toggle(); sound.toggle(); sound.resume();
  assert.equal(requests.length, 0);
  assert.equal(audio.paused, true);
  assert.equal(attributes.get('aria-pressed'), 'true');
  audio.currentTime = 15;
  sound.open();
  assert.equal(requests.length, 1);
  assert.equal(audio.currentTime, 0);
  assert.equal(audio.paused, false);
});

test('muting survives tab changes and replay, while unmuting resumes the selected track', () => {
  const { sound, requests, audio, attributes } = setup();
  sound.open(); audio.currentTime = 12;
  sound.toggle();
  assert.equal(audio.paused, true);
  assert.equal(attributes.get('aria-label'), copy.soundOn);
  sound.suspend(); sound.resume();
  assert.equal(requests.length, 1);
  assert.equal(audio.currentTime, 12);
  sound.open();
  assert.equal(requests.length, 1);
  assert.equal(audio.currentTime, 0);
  sound.toggle();
  assert.equal(requests.length, 2);
  assert.equal(attributes.get('aria-label'), copy.soundOff);
});

test('tab suspension preserves the music position and cleanup prevents further playback', () => {
  const { sound, requests, audio } = setup();
  sound.open(); audio.currentTime = 18;
  sound.suspend();
  assert.equal(audio.paused, true);
  sound.resume();
  assert.equal(requests.length, 2);
  assert.equal(audio.currentTime, 18);
  sound.destroy();
  assert.equal(audio.paused, true);
  sound.resume(); sound.toggle(); sound.open();
  assert.equal(requests.length, 2);
});

test('a cancelled play request cannot mute a newer one, and failures can be retried', async () => {
  const { sound, requests, audio, attributes } = setup();
  sound.open(); sound.toggle(); sound.toggle();
  requests[0].reject(Error('Cancelled by pause'));
  await Promise.resolve();
  assert.equal(attributes.get('aria-pressed'), 'true');
  requests[1].reject(Error('Playback blocked'));
  await Promise.resolve();
  assert.equal(attributes.get('aria-pressed'), 'false');
  sound.toggle();
  assert.equal(requests.length, 3);
  requests[2].resolve();
  audio.dispatchEvent(new Event('error'));
  assert.equal(attributes.get('aria-label'), copy.soundOn);
});

test('an empty music source hides its control without breaking the invitation lifecycle', () => {
  const { sound, button, requests } = setup({ music: false });
  assert.equal(button.hidden, true);
  assert.equal(button.disabled, true);
  assert.doesNotThrow(() => {
    sound.open(); sound.toggle(); sound.suspend(); sound.resume(); sound.destroy();
  });
  assert.equal(requests.length, 0);
});

test('a completed song stays stopped through toggles and tab changes until replay', async () => {
  const { sound, button, requests, audio, attributes } = setup();
  sound.open();
  audio.currentTime = 66;
  audio.dispatchEvent(new Event('ended'));
  assert.equal(audio.paused, true);
  assert.equal(button.disabled, true);
  assert.equal(attributes.get('aria-pressed'), 'false');
  assert.equal(attributes.get('aria-label'), copy.soundEnded);
  sound.toggle(); sound.toggle(); sound.suspend(); sound.resume();
  assert.equal(requests.length, 1);
  assert.equal(audio.currentTime, 66);
  requests[0].reject(Error('Older playback was stopped'));
  await Promise.resolve();
  sound.open();
  assert.equal(requests.length, 2);
  assert.equal(audio.currentTime, 0);
  assert.equal(audio.paused, false);
  assert.equal(button.disabled, false);
  assert.equal(attributes.get('aria-pressed'), 'true');
});

test('resuming cannot restart a completed song before the ended event is delivered', () => {
  const { sound, requests, audio } = setup();
  sound.open();
  audio.currentTime = 66;
  sound.resume();
  assert.equal(requests.length, 1);
  sound.open();
  assert.equal(requests.length, 2);
  assert.equal(audio.currentTime, 0);
});
