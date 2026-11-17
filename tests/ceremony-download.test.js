import assert from 'node:assert/strict';
import { test } from 'node:test';
import { createPosterDownload, posterFilename } from '../src/client/features/ceremony/poster-download.js';

const copy = { downloadPreparing: 'Đang lưu', downloadSaved: 'Đã lưu', downloadError: 'Thử lại' };

function setup(render, writeFile = () => {}) {
  const attributes = new Map();
  const button = { setAttribute: (key, value) => attributes.set(key, value) };
  const feedback = { hidden: true, textContent: '' };
  const download = createPosterDownload({ button, poster: {}, feedback, copy, render, writeFile });
  return { button, feedback, attributes, download };
}

test('download names support Vietnamese while keeping names out of path syntax', () => {
  assert.equal(posterFilename('Đặng Minh Mẫn'), 'thiep-tot-nghiep-dang-minh-man.png');
  assert.equal(posterFilename('../Bạn & Cậu/'), 'thiep-tot-nghiep-ban-cau.png');
  assert.equal(posterFilename('✨'), 'thiep-tot-nghiep-khach-moi.png');
});

test('saving is available only on the poster and repeated clicks share one operation', async () => {
  let complete, renders = 0;
  const pending = new Promise(resolve => { complete = resolve; });
  const files = [];
  const { download, button, attributes, feedback } = setup(() => { renders++; return pending; }, (blob, name) => { files.push({ blob, name }); });
  assert.equal(await download.save('Khách'), false);
  download.setVisible(true);
  const operation = download.save('Minh Mẫn');
  assert.equal(button.disabled, true);
  assert.equal(attributes.get('aria-busy'), 'true');
  assert.equal(feedback.textContent, copy.downloadPreparing);
  assert.equal(await download.save('Khách khác'), false);
  const blob = new Blob(['image'], { type: 'image/png' });
  complete(blob);
  assert.equal(await operation, true);
  assert.equal(renders, 1);
  assert.deepEqual(files, [{ blob, name: 'thiep-tot-nghiep-minh-man.png' }]);
  assert.equal(button.disabled, false);
  assert.equal(attributes.get('aria-busy'), 'false');
  download.destroy();
});

test('a failed export can be retried without leaving its button busy', async () => {
  let fail = true, writes = 0;
  const { download, button, feedback } = setup(async () => {
    if (fail) throw Error('Image unavailable');
    return new Blob(['image']);
  }, () => { writes++; });
  download.setVisible(true);
  assert.equal(await download.save('Khách'), false);
  assert.equal(button.disabled, false);
  assert.equal(feedback.textContent, copy.downloadError);
  fail = false;
  assert.equal(await download.save('Khách'), true);
  assert.equal(writes, 1);
  download.destroy();
});

test('leaving the page during export prevents a delayed file download', async () => {
  let complete, writes = 0;
  const { download, feedback } = setup(() => new Promise(resolve => { complete = resolve; }), () => { writes++; });
  download.setVisible(true);
  const operation = download.save('Khách');
  download.destroy();
  complete(new Blob(['image']));
  assert.equal(await operation, false);
  assert.equal(writes, 0);
  assert.equal(feedback.hidden, true);
});
