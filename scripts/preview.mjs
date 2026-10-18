import { createServer } from 'node:http';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const mimeTypes = {
  '.html': 'text/html; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8', '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg',
  '.webp': 'image/webp', '.ico': 'image/x-icon', '.mp3': 'audio/mpeg', '.woff2': 'font/woff2',
};

export async function startPreview({ directory = path.join(root, 'dist'), port = 0 } = {}) {
  const baseDirectory = path.resolve(directory);
  const server = createServer(async (request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' }).end('Static preview supports GET and HEAD only.');
      return;
    }
    let pathname;
    try {
      pathname = decodeURIComponent(new URL(request.url, 'http://127.0.0.1').pathname);
    } catch {
      response.writeHead(400).end('Invalid URL');
      return;
    }
    if (pathname.startsWith('/api/')) {
      response.writeHead(501, { 'Content-Type': 'text/plain; charset=utf-8' })
        .end('This static preview does not run serverless APIs. Use Vercel dev for live chat.');
      return;
    }
    let filename = path.resolve(baseDirectory, `.${pathname}`);
    const relative = path.relative(baseDirectory, filename);
    if (relative.startsWith('..') || path.isAbsolute(relative) || pathname.includes('\0')) {
      response.writeHead(403).end('Forbidden');
      return;
    }
    if (pathname.endsWith('/')) filename = path.join(filename, 'index.html');
    let fileStat;
    try {
      fileStat = await stat(filename);
    } catch {
      if (!path.extname(filename)) {
        filename += '.html';
        fileStat = await stat(filename).catch(() => null);
      }
    }
    if (!fileStat?.isFile()) {
      response.writeHead(404).end('Not found');
      return;
    }
    const headers = {
      'Content-Type': mimeTypes[path.extname(filename).toLowerCase()] || 'application/octet-stream',
      'Cache-Control': 'no-store', 'Accept-Ranges': 'bytes',
    };
    const range = request.headers.range;
    let start = 0;
    let end = fileStat.size - 1;
    if (range) {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      if (!match || (!match[1] && !match[2])) {
        response.writeHead(416, { 'Content-Range': `bytes */${fileStat.size}` }).end();
        return;
      }
      start = match[1] ? Number(match[1]) : Math.max(0, fileStat.size - Number(match[2]));
      end = match[1] && match[2] ? Math.min(Number(match[2]), end) : end;
      if (start >= fileStat.size || start > end) {
        response.writeHead(416, { 'Content-Range': `bytes */${fileStat.size}` }).end();
        return;
      }
      headers['Content-Range'] = `bytes ${start}-${end}/${fileStat.size}`;
    }
    headers['Content-Length'] = end - start + 1;
    response.writeHead(range ? 206 : 200, headers);
    if (request.method === 'HEAD') response.end();
    else createReadStream(filename, { start, end }).on('error', () => response.destroy()).pipe(response);
  });
  await new Promise((resolve, reject) => {
    server.once('error', reject);
    server.listen(port, '127.0.0.1', resolve);
  });
  return {
    url: `http://127.0.0.1:${server.address().port}`,
    close: () => new Promise((resolve, reject) => {
      server.close((error) => error ? reject(error) : resolve());
      server.closeIdleConnections();
    }),
  };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const option = (name, fallback) => {
    const index = process.argv.indexOf(name);
    return index < 0 ? fallback : process.argv[index + 1];
  };
  const preview = await startPreview({
    directory: path.resolve(option('--dir', path.join(root, 'dist'))),
    port: Number(option('--port', process.env.PORT || 4173)),
  });
  console.log(`Static portfolio preview: ${preview.url}`);
  console.log('Live /api/chat requires Vercel dev; this server serves static files only.');
  for (const signal of ['SIGINT', 'SIGTERM']) process.once(signal, async () => {
    await preview.close();
    process.exit(0);
  });
}
