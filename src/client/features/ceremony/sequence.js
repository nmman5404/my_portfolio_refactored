const letters = [
  { id: 'dear', field: 'intro', next: 'thanks' },
  { id: 'thanks', field: 'thankYou', next: 'personal' },
  { id: 'personal', field: 'personalMessage', next: 'invitation' },
  { id: 'invitation', field: 'invitation', next: 'end' },
];
const seconds = (value) => Math.round(value * 1000) / 1000;

/** Compact authored scene durations around the content this recipient actually has. */
export function createCeremonySequence(base, invitation) {
  let cursor = base.dear;
  const phases = [{ id: 'celebration', begin: 0, finish: cursor }];
  for (const { id, field, next } of letters) {
    const { eyebrow, title, body, signature = '' } = invitation[field];
    if (!body.trim()) continue;
    const finish = seconds(cursor + base[next] - base[id]);
    phases.push({ id, begin: cursor, finish, content: { eyebrow, title, body, signature } });
    cursor = finish;
  }
  const finish = seconds(cursor + base.finish - base.end);
  phases.push({ id: 'end', begin: cursor, finish });
  const first = phases[1];
  return {
    phases,
    cues: { land: base.land, podium: base.podium, curtain: base.curtain, letter: base.dear, end: cursor, finish },
    readingAt: seconds(first.begin + Math.min(0.8, (first.finish - first.begin) / 2)),
    letterCount: phases.length - 2,
  };
}
