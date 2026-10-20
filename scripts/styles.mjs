import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(fileURLToPath(new URL('../', import.meta.url)));

/** Compile after HTML is rendered; use the same CSS in development and production. */
export function buildStyles() {
  const args = [
    path.join(projectRoot, 'node_modules/tailwindcss/lib/cli.js'),
    '--config', path.join(projectRoot, 'tailwind.config.js'),
    '--input', path.join(projectRoot, 'src/styles/tailwind.css'),
    '--output', path.join(projectRoot, 'dist/assets/css/tailwind.css'),
    '--minify',
  ];

  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, args, {
      cwd: projectRoot,
      stdio: 'inherit',
      windowsHide: true,
    });
    child.once('error', reject);
    child.once('close', (code) => {
      if (code === 0) resolve();
      else reject(new Error(`Tailwind compilation failed (exit ${code ?? 'unknown'}).`));
    });
  });
}
