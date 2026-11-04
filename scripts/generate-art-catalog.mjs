import { readdirSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = new URL('../public/assets/', import.meta.url);
function walk(directory, prefix = '') {
  return readdirSync(directory, { withFileTypes: true }).flatMap(entry => {
    const name = prefix + entry.name;
    return entry.isDirectory() ? walk(new URL(entry.name + '/', directory), name + '/') : [name];
  });
}
// No timestamps: dev/build refresh the inventory without creating noisy diffs.
writeFileSync(fileURLToPath(new URL('../public/art-assets.json', import.meta.url)),
  JSON.stringify(walk(root).sort(), null, 2) + '\n');
