import assert from 'node:assert/strict';
import { test } from 'node:test';
import { resolveInvitationCopy } from '../src/modules/ceremony/invitation.js';
import { createCeremonySequence } from '../src/client/features/ceremony/sequence.js';
import { createPlayback } from '../src/client/features/ceremony/playback.js';

const timing = { land: 4.8, podium: 4.95, curtain: 6.15, dear: 9.6, thanks: 14, personal: 24, invitation: 34, end: 42.8, finish: 44.2 };
const defaults = {
  displayName: 'Bạn',
  intro: { eyebrow: 'Dear', title: '{name},', body: 'Chào bạn.' },
  thankYou: { eyebrow: 'CẢM ƠN', title: 'Cảm ơn bạn.', body: 'Cảm ơn.' },
  personalMessage: { eyebrow: 'HỎI THĂM', title: 'Dạo này…', body: 'Lời hỏi thăm.' },
  invitation: { eyebrow: 'LỜI MỜI', title: 'Hẹn gặp.', body: 'Một lời mời.', signature: 'Thương mến, Mẫn', time: '' },
};
const copy = (overrides = {}) => resolveInvitationCopy(defaults, { profile: 'close', ...overrides });
const plan = (invitation) => createCeremonySequence(timing, invitation);

test('full copy preserves all original scene times and animation cues', () => {
  const sequence = plan(copy());
  assert.deepEqual(sequence.phases.map(({ id, begin }) => [id, begin]), [
    ['celebration', 0], ['dear', 9.6], ['thanks', 14], ['personal', 24], ['invitation', 34], ['end', 42.8],
  ]);
  assert.equal(sequence.cues.finish, 44.2);
  assert.equal(sequence.cues.land, timing.land);
  assert.equal(sequence.cues.curtain, timing.curtain);
});

test('every combination of blank sections yields a dense sequence with no empty letter scenes', () => {
  const fields = ['intro', 'thankYou', 'personalMessage', 'invitation'];
  const durations = [4.4, 10, 10, 8.8];
  for (let mask = 0; mask < 16; mask++) {
    const overrides = Object.fromEntries(fields.map((field, index) => [field, { body: mask & (1 << index) ? 'Nội dung' : '  ' }]));
    const sequence = plan(copy(overrides));
    const kept = sequence.phases.filter((phase) => phase.content);
    assert.equal(kept.length, fields.filter((_, index) => mask & (1 << index)).length);
    assert.ok(kept.every((phase) => phase.content.body.trim()));
    const expected = 11 + durations.reduce((sum, duration, index) => sum + (mask & (1 << index) ? duration : 0), 0);
    assert.ok(Math.abs(sequence.cues.finish - expected) < 0.001);
    for (let i = 1; i < sequence.phases.length; i++) assert.equal(sequence.phases[i].begin, sequence.phases[i - 1].finish);
    const clock = createPlayback(sequence);
    clock.start(0, sequence.readingAt, true);
    assert.equal(clock.snapshot(0).phase, sequence.phases[1].id);
    for (const phase of sequence.phases.slice(2)) {
      clock.next(0);
      assert.equal(clock.snapshot(0).phase, phase.id);
    }
    clock.start(0);
    assert.equal(clock.snapshot(100000).phase, 'end');
    assert.equal(clock.snapshot(100000).time, sequence.cues.finish);
    clock.start(100000);
    assert.equal(clock.snapshot(100000).phase, 'celebration');
  }
});

test('empty scene labels hide only those labels and an empty signature hides the whole line', () => {
  const sequence = plan(copy({ thankYou: { eyebrow: '', title: '' }, invitation: { signature: '' } }));
  const thanks = sequence.phases.find((phase) => phase.id === 'thanks');
  assert.equal(thanks.content.eyebrow, '');
  assert.equal(thanks.content.title, '');
  assert.ok(thanks.content.body);
  assert.equal(sequence.cues.finish, 44.2);
  assert.equal(sequence.phases.find((phase) => phase.id === 'invitation').content.signature, '');
});

test('shortened, body-only and poster-only experiences preserve their expected durations', () => {
  for (const [overrides, duration, phases] of [
    [{ personalMessage: { body: '' } }, 34.2, ['celebration', 'dear', 'thanks', 'invitation', 'end']],
    [{ intro: { body: '' }, thankYou: { body: '' }, personalMessage: { body: '' } }, 19.8, ['celebration', 'invitation', 'end']],
    [{ intro: { body: '' }, personalMessage: { body: '' }, invitation: { body: '' } }, 21, ['celebration', 'thanks', 'end']],
    [{ intro: { body: '' }, thankYou: { body: '' }, personalMessage: { body: '' }, invitation: { body: '' } }, 11, ['celebration', 'end']],
  ]) {
    const sequence = plan(copy(overrides));
    assert.equal(sequence.cues.finish, duration);
    assert.deepEqual(sequence.phases.map((phase) => phase.id), phases);
  }
});

test('relationship profiles remove whole scenes and keep every retained duration unchanged', () => {
  const full = plan(copy());
  for (const [profile, duration, names] of [
    ['casual', 24.2, ['celebration', 'dear', 'invitation', 'end']],
    ['friend', 34.2, ['celebration', 'dear', 'thanks', 'invitation', 'end']],
    ['close', 44.2, ['celebration', 'dear', 'thanks', 'personal', 'invitation', 'end']],
  ]) {
    const sequence = plan(copy({ profile }));
    assert.deepEqual(sequence.phases.map(({ id }) => id), names);
    assert.equal(sequence.cues.finish, duration);
    for (const phase of sequence.phases) {
      const original = full.phases.find(({ id }) => id === phase.id);
      assert.ok(Math.abs((phase.finish - phase.begin) - (original.finish - original.begin)) < 0.001);
    }
  }
});

test('arrival time belongs to the poster and does not change letter content or durations', () => {
  assert.deepEqual(plan(copy({ invitation: { time: '08:30' } })), plan(copy()));
  const sequence = plan(copy({ invitation: { time: '08:30', body: '' } }));
  assert.equal(sequence.phases.some(({ id }) => id === 'invitation'), false);
  assert.equal(sequence.cues.finish, 35.4);
});
