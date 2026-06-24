import fs from 'node:fs';
import path from 'node:path';
import { DIST_DIR, SKILLS_DIR, cleanDir, ensureDir } from './lib.mjs';

for (const target of ['codex', 'claude']) {
  const outDir = path.join(DIST_DIR, target, 'skills');
  cleanDir(outDir);

  for (const item of fs.readdirSync(SKILLS_DIR, { withFileTypes: true })) {
    if (!item.isDirectory()) continue;
    fs.cpSync(path.join(SKILLS_DIR, item.name), path.join(outDir, item.name), { recursive: true });
  }

  ensureDir(outDir);
  console.log(`Generated ${target} skill folders: ${outDir}`);
}
