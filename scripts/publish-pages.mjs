import { access, cp, mkdir, rm, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const source = resolve(root, 'pages-dist');
const destination = resolve(root, 'docs');

await access(resolve(source, 'index.html'));
await rm(destination, { recursive: true, force: true });
await mkdir(destination, { recursive: true });
await cp(source, destination, { recursive: true });
await writeFile(resolve(destination, '.nojekyll'), '');
console.log('GitHub Pages files copied to docs/. Commit docs/ to publish.');
