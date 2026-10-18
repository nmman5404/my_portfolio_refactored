import assert from 'node:assert/strict';
import { spawn } from 'node:child_process';
import { access, rm } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const projectRoot = path.resolve(fileURLToPath(new URL('../', import.meta.url)));
const outputDirectory = path.resolve(projectRoot, 'dist');
const eleventyCli = path.join(projectRoot, 'node_modules', '@11ty', 'eleventy', 'cmd.cjs');

// Restrict recursive cleanup to this project's generated output. Validate the
// resolved absolute target before deleting; source and sibling repos stay out.
assert.equal(path.relative(projectRoot, outputDirectory), 'dist');
assert.equal(path.dirname(outputDirectory), projectRoot);
await access(eleventyCli);
await rm(outputDirectory, { recursive: true, force: true });

// A clean build also removes old URLs after a post is drafted, renamed or
// deleted. Invoke the project's installed CLI directly, without a shell.
process.exitCode = await new Promise((resolve, reject) => {
  const child = spawn(process.execPath, [eleventyCli, ...process.argv.slice(2)], {
    cwd: projectRoot,
    stdio: 'inherit',
    windowsHide: true,
  });
  child.once('error', reject);
  child.once('close', (code) => resolve(code ?? 1));
});
