import assert from 'node:assert/strict';
import { test } from 'node:test';
import nunjucks from 'nunjucks';
import { fileURLToPath } from 'node:url';
import ceremony from '../src/modules/ceremony/data.js';
import { invitationFields, resolveInvitationCopy } from '../src/modules/ceremony/invitation.js';
import { buildCeremonyConfig, validateCeremony } from '../src/lib/ceremony.js';
import { normalizeRecipientId, readRecipients, resolveInvitation, validateRecipients } from '../server/ceremony/recipients.js';
import { createInvitationHandler } from '../server/ceremony/handler.js';

const guest = { id: 'Co-Mai', profile: 'close', aliases: ['Cô Mai'], displayName: 'Cô Mai', intro: { eyebrow: 'Kính gửi' }, notes: 'Internal only' };

test('Vietnamese name IDs normalize consistently and reject malformed input', () => {
  assert.equal(normalizeRecipientId('  CÔ-Mai '), 'comai');
  assert.equal(normalizeRecipientId('Đặng Minh_Mẫn'), 'dangminhman');
  for (const value of [undefined, null, '', 'null', ' UNDEFINED ']) assert.equal(normalizeRecipientId(value), '');
  for (const value of ['../Lan', '<script>', 'a\n', 'a'.repeat(101), ['Lan']]) {
    assert.throws(() => normalizeRecipientId(value), /Invalid recipient/);
  }
});

test('duplicate normalized IDs/aliases and mistyped fields fail authoring validation', () => {
  assert.throws(() => validateRecipients({ recipients: [guest, { id: 'Cô Mai', displayName: 'Other' }] }), /matches another/);
  assert.throws(() => validateRecipients({ recipients: [{ ...guest, enabled: 'false' }] }), /true or false/);
  assert.throws(() => validateRecipients({ recipients: [{ ...guest, personalMesage: 'Typo' }] }), /unknown field/);
  assert.throws(() => validateRecipients({ recipients: [{ ...guest, id: 'null' }] }), /reserved/);
});

test('personalization inherits omitted fields and returns only the selected public copy', () => {
  const directory = [guest, { id: 'Hidden', displayName: 'Private', enabled: false, notes: 'Do not send' }];
  const selected = resolveInvitation('Cô Mai', { directory });
  assert.equal(selected.displayName, 'Cô Mai');
  assert.equal(selected.intro.eyebrow, 'Kính gửi');
  assert.equal(selected.intro.title, 'Cô Mai,');
  assert.deepEqual(selected.thankYou, ceremony.invitation.thankYou);
  assert.deepEqual(Object.keys(selected).sort(), [...invitationFields, 'personalized'].sort());
  assert.equal(JSON.stringify(selected).includes('Internal only'), false);
  for (const id of ['', 'null', 'unknown', 'Hidden']) {
    assert.deepEqual(resolveInvitation(id, { directory }), { ...resolveInvitationCopy(ceremony.invitation), personalized: false });
  }
});

test('nested scene fields inherit individually and explicit empty text stays empty', () => {
  const selected = resolveInvitation('Co-Mai', { directory: [{ ...guest,
    intro: { body: '' },
    thankYou: { eyebrow: '', title: 'Một tiêu đề riêng', body: '  ' },
    invitation: { signature: '' },
  }] });
  assert.equal(selected.intro.body, '');
  assert.equal(selected.thankYou.body, '');
  assert.equal(selected.invitation.signature, '');
  assert.deepEqual(selected.personalMessage, ceremony.invitation.personalMessage);
  assert.deepEqual(selected.thankYou, { eyebrow: '', title: 'Một tiêu đề riêng', body: '' });
  selected.personalMessage.title = 'Changed response';
  assert.notEqual(ceremony.invitation.personalMessage.title, 'Changed response');
});

test('all three scene slots including the intro title can be customized with literal name substitution', () => {
  const selected = resolveInvitation('Co-Mai', { directory: [{ ...guest, displayName: 'Mai & $1',
    intro: { eyebrow: 'GỬI {name}', title: 'Bạn ơi!', body: 'Một lời nhắn cho {name}.' },
    invitation: { title: 'Hẹn gặp {name}!', signature: 'Thân mến, Felix' },
  }] });
  assert.deepEqual(selected.intro, { eyebrow: 'GỬI Mai & $1', title: 'Bạn ơi!', body: 'Một lời nhắn cho Mai & $1.' });
  assert.equal(selected.invitation.title, 'Hẹn gặp Mai & $1!');
  assert.equal(selected.invitation.body, ceremony.invitation.invitation.body);
  assert.equal(selected.invitation.signature, 'Thân mến, Felix');
});

test('recipient profiles filter optional scenes before copy reaches the browser', () => {
  for (const [profile, thanks, personal] of [['casual', false, false], ['friend', true, false], ['close', true, true]]) {
    const selected = resolveInvitation('Co-Mai', { directory: [{ ...guest, profile,
      thankYou: { title: 'Private thanks title', body: 'A private thank-you.' },
      personalMessage: { title: 'Private check-in title', body: 'A private check-in.' },
    }] });
    assert.equal(selected.intro.body, ceremony.invitation.intro.body);
    assert.deepEqual(selected.invitation, ceremony.invitation.invitation);
    assert.equal(selected.thankYou.body, thanks ? 'A private thank-you.' : '');
    assert.equal(selected.personalMessage.body, personal ? 'A private check-in.' : '');
    if (!thanks) assert.ok(Object.values(selected.thankYou).every(value => value === ''));
    if (!personal) assert.ok(Object.values(selected.personalMessage).every(value => value === ''));
    assert.equal(Object.hasOwn(selected, 'profile'), false);
    assert.equal(Object.hasOwn(selected, 'notes'), false);
  }
});

test('general, unknown and unclassified recipients use the casual profile', () => {
  const directory = [{ id: 'Khach', displayName: 'Khách' }];
  for (const id of ['', 'unknown', 'Khach']) {
    const selected = resolveInvitation(id, { directory });
    assert.ok(selected.intro.body);
    assert.ok(selected.invitation.body);
    assert.equal(selected.thankYou.body, '');
    assert.equal(selected.personalMessage.body, '');
  }
});

test('profiles validate exact choices and preserve explicit blank fields', () => {
  for (const profile of ['', 'bestie', 'Close', null, true, [], 'constructor', '__proto__']) {
    assert.throws(() => validateRecipients({ recipients: [{ ...guest, profile }] }), /profile/);
  }
  const selected = resolveInvitation('Co-Mai', { directory: [{ ...guest, profile: 'friend', thankYou: { body: '  ' } }] });
  assert.equal(selected.thankYou.body, '');
  assert.equal(selected.personalMessage.body, '');
  assert.ok(selected.intro.body);
});

test('each guest can set an arrival time while missing and blank times keep their authoring rules', () => {
  const defaults = structuredClone(ceremony.invitation);
  defaults.invitation.time = '09:00';
  const directory = [
    { id: 'Som', displayName: 'Khách sớm', invitation: { time: ' 08:30 ' } },
    { id: 'Muon', displayName: 'Khách muộn', invitation: { time: '10:30' } },
    { id: 'Trong', displayName: 'Khách chưa hẹn giờ', invitation: { time: '  ' } },
    { id: 'MacDinh', displayName: 'Khách mặc định' },
  ];
  for (const [id, time] of [['Som', '08:30'], ['Muon', '10:30'], ['Trong', ''], ['MacDinh', '09:00']]) {
    const copy = resolveInvitation(id, { directory, defaults });
    assert.equal(copy.invitation.time, time);
    assert.equal(copy.invitation.body, ceremony.invitation.invitation.body);
  }
  assert.equal(resolveInvitation('Som', { directory }).invitation.time, '08:30');
  assert.equal(resolveInvitation('unknown', { directory }).invitation.time, '');
});

test('nested scenes reject invalid shapes, unsupported fields and old split copy fields', () => {
  for (const overrides of [
    { intro: '' }, { intro: null }, { intro: [] }, { intro: { duration: 4 } },
    { thankYou: { eyebrow: null } }, { personalMessage: { body: false } },
    { invitation: { signature: false } }, { intro: { signature: 'Wrong scene' } },
    { invitation: { time: 9 } }, { invitation: { time: null } }, { intro: { time: '09:00' } },
    { salutation: 'Dear' }, { scenes: {} }, { signature: 'Mẫn' },
  ]) assert.throws(() => validateRecipients({ recipients: [{ ...guest, ...overrides }] }), /Ceremony/);
});

test('the checked-in recipient directory validates independently of example names', () => {
  const directory = readRecipients();
  assert.ok(Array.isArray(directory));
  for (const recipient of directory.filter((entry) => entry.enabled !== false)) {
    assert.equal(resolveInvitation(recipient.id, { directory }).displayName, recipient.displayName.trim());
  }
});

test('public config validates editable fields and excludes unknown invitation metadata', () => {
  const authored = structuredClone(ceremony);
  authored.invitation.notes = 'Never send extra metadata';
  const config = buildCeremonyConfig(authored);
  assert.equal(config.defaultInvitation.notes, undefined);
  assert.equal(config.event, undefined); // Event details are already rendered as HTML.
  assert.equal(config.endpoint, '/api/invitation');
  assert.equal(config.scenes, undefined);
  assert.deepEqual(config.defaultInvitation, { ...resolveInvitationCopy(authored.invitation), personalized: false });
  assert.deepEqual(config.music, ceremony.music);
  authored.invitation.intro.body = '';
  authored.invitation.thankYou.eyebrow = '';
  assert.doesNotThrow(() => validateCeremony(authored));
  for (const change of [
    (data) => { data.event.mapUrl = 'javascript:alert(1)'; },
    (data) => { data.event.date = null; },
    (data) => { data.animation.dear = data.animation.curtain; },
    (data) => { delete data.ui.next; },
    (data) => { data.media.cap.src = '//remote.example/cap.png'; },
    (data) => { data.href = '//ceremony/'; },
    (data) => { data.music.src = 'https://example.com/track.mp3'; },
    (data) => { data.music.volume = 1.1; },
    (data) => { data.music.volume = -0.1; },
    (data) => { data.music.loop = 'true'; },
  ]) {
    const invalid = structuredClone(ceremony);
    change(invalid);
    assert.throws(() => validateCeremony(invalid), /Ceremony/);
  }
});

test('music is rendered without autoplay and an empty source removes the player', () => {
  const environment = new nunjucks.Environment(new nunjucks.FileSystemLoader(
    fileURLToPath(new URL('../src/', import.meta.url)),
  ), { autoescape: false });
  const authored = structuredClone(ceremony);
  const html = environment.render('modules/ceremony/template.njk', { modules: { ceremony: authored } });
  const audio = html.match(/<audio\b[^>]*>/)?.[0];
  assert.ok(audio);
  assert.ok(audio.includes('preload="none"'));
  assert.equal(audio.includes('autoplay'), false);
  authored.music.src = '';
  assert.doesNotThrow(() => validateCeremony(authored));
  const silent = environment.render('modules/ceremony/template.njk', { modules: { ceremony: authored } });
  assert.equal(silent.includes('<audio'), false);
  assert.match(silent, /<button id="sound-button"[^>]* hidden>/);
});

test('event details render as escaped text only on the final poster', () => {
  const environment = new nunjucks.Environment(new nunjucks.FileSystemLoader(
    fileURLToPath(new URL('../src/', import.meta.url)),
  ), { autoescape: false });
  const authored = structuredClone(ceremony);
  authored.event = {
    ...authored.event, date: '20/12/2026', venue: '<script>test</script>',
    address: 'Hall A & B', mapUrl: 'https://example.com/map?a=1&b=2',
  };
  authored.invitation.invitation.time = '09:00';
  const html = environment.render('modules/ceremony/template.njk', { modules: { ceremony: authored } });
  assert.match(html, /id="poster-date"[^>]*>20\/12\/2026<\/span>/);
  assert.match(html, /id="poster-arrival-time"[^>]*>09:00<\/span>/);
  assert.ok(html.includes('&lt;script&gt;test&lt;/script&gt;'));
  assert.ok(html.includes('Hall A &amp; B'));
  assert.ok(html.includes('href="https://example.com/map?a=1&amp;b=2"'));
  assert.equal(html.includes('<script>test</script>'), false);
  assert.ok(html.includes('id="poster-scene"'));
  const letter = html.match(/<section id="letter-scene"[\s\S]*?<\/section>/)?.[0];
  assert.ok(letter);
  for (const detail of ['20/12/2026', '09:00', '&lt;script&gt;test&lt;/script&gt;', 'Hall A &amp; B', 'https://example.com/map']) {
    assert.equal(letter.includes(detail), false);
  }
  assert.equal(html.includes('id="pause-button"'), false);
});

test('the final poster omits empty time fields and preserves the supplied venue', () => {
  const environment = new nunjucks.Environment(new nunjucks.FileSystemLoader(
    fileURLToPath(new URL('../src/', import.meta.url)),
  ), { autoescape: false });
  const authored = structuredClone(ceremony);
  authored.event.date = '';
  authored.invitation.invitation.time = '   ';
  authored.event.address = '227 Nguyễn Văn Cừ';
  authored.event.note = 'Gửi xe ở NOWZONE — nội dung kiểm thử';
  const html = environment.render('modules/ceremony/template.njk', { modules: { ceremony: authored } });
  assert.match(html, /id="poster-time" hidden/);
  assert.match(html, /id="poster-time-separator"[^>]* hidden/);
  assert.ok(html.includes('227 Nguyễn Văn Cừ'));
  assert.ok(html.includes('NOWZONE'));
  assert.ok(html.includes('id="poster-recipient"'));
});

test('empty shared copy leaves no empty event, map or decorative text blocks', () => {
  const environment = new nunjucks.Environment(new nunjucks.FileSystemLoader(
    fileURLToPath(new URL('../src/', import.meta.url)),
  ), { autoescape: false });
  const authored = structuredClone(ceremony);
  for (const key of Object.keys(authored.event)) authored.event[key] = '';
  for (const key of ['eyebrow', 'title', 'artCaption', 'footnote']) authored.poster[key] = '';
  for (const key of ['eyebrow', 'preface', 'title', 'subtitle']) authored.hero[key] = '';
  assert.doesNotThrow(() => validateCeremony(authored));
  const html = environment.render('modules/ceremony/template.njk', { modules: { ceremony: authored } });
  assert.match(html, /id="poster-details"[^>]* hidden/);
  for (const selector of ['class="poster-bottom"', 'class="poster-parking"', 'class="hero-subtitle"']) {
    assert.equal(html.includes(selector), false, selector);
  }
  assert.match(html, /id="poster-title"[^>]*hidden/);
  assert.equal(html.includes('id="speech-bubble"'), false);
});

function invoke(handler, request) {
  const response = {
    headers: {},
    setHeader(name, value) { this.headers[name] = value; },
    end(body) { this.body = JSON.parse(body); },
  };
  handler({ method: 'GET', url: '/api/invitation', ...request }, response);
  return response;
}

test('API rejects ambiguous IDs/methods and keeps selected responses uncached', () => {
  let reads = 0;
  const handler = createInvitationHandler({ loadRecipients: () => { reads++; return [guest]; } });
  const selected = invoke(handler, { url: '/api/invitation?id=Co-Mai' });
  assert.equal(selected.statusCode, 200);
  assert.equal(selected.headers['Cache-Control'], 'no-store');
  assert.equal(selected.body.displayName, 'Cô Mai');
  const previousReads = reads;
  assert.equal(invoke(handler, { url: '/api/invitation?id=Lan&id=Co-Mai' }).statusCode, 400);
  assert.equal(invoke(handler, { query: { id: ['Lan', 'Co-Mai'] } }).statusCode, 400);
  assert.equal(invoke(handler, { url: '/api/invitation?id=%3Cscript%3E' }).statusCode, 400);
  const invalidMethod = invoke(handler, { method: 'POST' });
  assert.equal(invalidMethod.statusCode, 405);
  assert.equal(invalidMethod.headers.Allow, 'GET');
  assert.equal(reads, previousReads);
});

test('API reads updated guest data and reports configuration failures without leaking content', () => {
  let directory = [guest];
  const handler = createInvitationHandler({ loadRecipients: () => directory });
  assert.equal(invoke(handler, { query: { id: 'Co-Mai' } }).body.personalized, true);
  directory = [{ ...guest, enabled: false }];
  assert.equal(invoke(handler, { query: { id: 'Co-Mai' } }).body.personalized, false);
  let logged = false;
  const broken = createInvitationHandler({
    loadRecipients: () => { throw new Error('Private directory details'); },
    logger: { error: () => { logged = true; } },
  });
  const failure = invoke(broken, {});
  assert.equal(failure.statusCode, 500);
  assert.equal(JSON.stringify(failure.body).includes('Private directory'), false);
  assert.equal(logged, true);
});
