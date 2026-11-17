import assert from 'node:assert/strict';
import { test } from 'node:test';
import ceremony from '../src/modules/ceremony/data.js';
import { sampleCharacterMotion } from '../src/client/features/ceremony/character-motion.js';

test('the character greets first and settles before the hat falls', () => {
  assert.ok(sampleCharacterMotion(1.1, ceremony.animation).rotation < -2);
  assert.equal(sampleCharacterMotion(3, ceremony.animation).rotation, 0);
});

test('celebration has two bounded jumps and then settles', () => {
  const first = ceremony.animation.podium + 0.85;
  const main = sampleCharacterMotion(first + 0.4, ceremony.animation, { height: 400 });
  const small = sampleCharacterMotion(first + 1.1 + 0.325, ceremony.animation, { height: 400 });
  assert.ok(main.lift < -25 && main.lift >= -36);
  assert.ok(small.lift < 0 && small.lift > main.lift);
  assert.equal(sampleCharacterMotion(first + 2.2, ceremony.animation).lift, 0);
  assert.ok(sampleCharacterMotion(first + 0.4, ceremony.animation, { height: 180 }).lift >= -22);
});

test('reduced motion suppresses greetings, jumping and squash', () => {
  for (const time of [1.1, ceremony.animation.podium + 0.75, ceremony.animation.podium + 1.25]) {
    assert.deepEqual(sampleCharacterMotion(time, ceremony.animation, { reduced: true }), {
      lift: 0, rotation: 0, scaleX: 1, scaleY: 1,
    });
  }
});
