import fs from 'node:fs';
import path from 'node:path';
import { DIST_DIR, ROOT, ensureDir, readJson, writeFile } from './lib.mjs';

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');
const pack = readJson(path.join(ROOT, 'skill-pack.json'));
const sourceRoot = path.resolve(ROOT, pack.sourceOfTruth);

const requiredFiles = [
  'AGENTS.md',
  'docs/agents/ARCHITECTURE.md',
  'docs/agents/PROJECT_CONTEXT.md',
  'docs/agents/RUNTIME.md',
  'docs/agents/CONTRACTS.md',
  'packages/common/AGENTS.md',
  'packages/common/core/AGENTS.md',
  'packages/databases/mongo/AGENTS.md',
  'packages/databases/mongo/README.md',
  'packages/databases/mysql/AGENTS.md',
  'packages/databases/mysql/README.md',
  'packages/brokers/AGENTS.md',
  'packages/adapters/AGENTS.md',
  'packages/integrations/AGENTS.md',
  'packages/tools/AGENTS.md'
];

const missing = requiredFiles.filter(file => !fs.existsSync(path.join(sourceRoot, file)));
if (missing.length) {
  console.error(`Missing source files from ${sourceRoot}:\n${missing.map(file => `- ${file}`).join('\n')}`);
  process.exit(1);
}

const index = requiredFiles.map(file => {
  const abs = path.join(sourceRoot, file);
  const content = fs.readFileSync(abs, 'utf8');
  return {
    file,
    bytes: Buffer.byteLength(content),
    lines: content.split(/\r?\n/).length,
    headings: content
      .split(/\r?\n/)
      .filter(line => /^#{1,3}\s+/.test(line))
      .slice(0, 20),
  };
});

if (!checkOnly) {
  ensureDir(path.join(DIST_DIR, 'source'));
  writeFile(path.join(DIST_DIR, 'source', 'joktec-framework-index.json'), JSON.stringify(index, null, 2));
}

console.log(`Source sync check passed for ${requiredFiles.length} files from ${sourceRoot}`);
