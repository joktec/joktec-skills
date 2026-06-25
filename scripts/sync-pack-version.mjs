import path from 'node:path';
import { execFileSync } from 'node:child_process';
import { PACK_PATH, ROOT, readJson, writeFile } from './lib.mjs';

const args = new Set(process.argv.slice(2));
const checkOnly = args.has('--check');
const stage = args.has('--stage');
const packagePath = path.join(ROOT, 'package.json');

const pkg = readJson(packagePath);
const pack = readJson(PACK_PATH);
const version = pkg.version;

if (!/^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/.test(version || '')) {
  console.error(`Invalid package.json version: ${version || '<missing>'}`);
  process.exit(1);
}

function stagePackFile() {
  execFileSync('git', ['add', PACK_PATH], { cwd: ROOT, stdio: 'inherit' });
  console.log('Staged skill-pack.json');
}

if (pack.version === version) {
  console.log(`skill-pack.json version is in sync: ${version}`);
  if (stage) stagePackFile();
  process.exit(0);
}

if (checkOnly) {
  console.error(`Version mismatch: package.json=${version}, skill-pack.json=${pack.version || '<missing>'}`);
  process.exit(1);
}

pack.version = version;
writeFile(PACK_PATH, JSON.stringify(pack, null, 2));
console.log(`Updated skill-pack.json version to ${version}`);
if (stage) stagePackFile();
