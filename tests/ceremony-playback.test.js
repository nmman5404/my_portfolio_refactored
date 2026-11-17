import assert from 'node:assert/strict';
import { test } from 'node:test';
import ceremony from '../src/modules/ceremony/data.js';
import { createPlayback } from '../src/client/features/ceremony/playback.js';
import { createCeremonySequence } from '../src/client/features/ceremony/sequence.js';
import { resolveInvitationCopy } from '../src/modules/ceremony/invitation.js';

const sequence = (timeline = ceremony.animation) => createCeremonySequence(timeline,
  resolveInvitationCopy(ceremony.invitation, { profile: 'close' }));

test('the clock starts only on open and freezes while paused or away', () => {
  const clock = createPlayback(sequence());
  assert.equal(clock.snapshot(90000).phase, 'idle');
  clock.start(1000);
  assert.equal(clock.snapshot(2000).time, 1);
  clock.pause(2000);
  assert.equal(clock.snapshot(120000).time, 1);
  clock.pause(120000, false);
  assert.equal(clock.snapshot(121000).time, 2);
});

test('reduced-motion reading and next traverse every letter scene while remaining paused', () => {
  const clock = createPlayback(sequence());
  clock.start(0, ceremony.animation.dear + 0.8, true);
  assert.equal(clock.snapshot(1000).phase, 'dear');
  for (const phase of ['thanks', 'personal', 'invitation', 'end']) {
    clock.next(1000);
    const snapshot = clock.snapshot(1000);
    assert.equal(snapshot.phase, phase);
    assert.equal(snapshot.paused, true);
  }
});

test('finishing then replaying resets the scene immediately', () => {
  const clock = createPlayback(sequence());
  clock.start(0);
  assert.equal(clock.snapshot(100000).phase, 'end');
  assert.equal(clock.snapshot(200000).time, ceremony.animation.finish);
  clock.start(200000);
  assert.equal(clock.snapshot(200000).phase, 'celebration');
  assert.equal(clock.snapshot(200000).paused, false);
  clock.start(200000, ceremony.animation.dear + 0.8, true);
  assert.equal(clock.snapshot(200000).phase, 'dear');
});

test('next respects short authored scenes instead of skipping past them', () => {
  const timeline = { ...ceremony.animation, thanks: 10, personal: 10.4 };
  const clock = createPlayback(sequence(timeline));
  clock.start(0, 9.8, true);
  clock.next(0);
  assert.equal(clock.snapshot(0).phase, 'thanks');
  assert.ok(clock.snapshot(0).time < timeline.personal);
});
