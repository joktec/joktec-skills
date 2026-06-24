import fs from 'node:fs';
import path from 'node:path';
import { DIST_DIR, PACK_PATH, loadSkills, readJson, readReferences } from './lib.mjs';

const errors = [];
const pack = readJson(PACK_PATH);
const { skills } = loadSkills();

const skillIds = new Set(skills.map(skill => skill.id));
for (const meta of pack.skills) {
  if (!skillIds.has(meta.id)) errors.push(`Missing skill directory for metadata id: ${meta.id}`);
  for (const dependency of meta.dependencies || []) {
    if (!skillIds.has(dependency)) errors.push(`${meta.id}: missing dependency skill ${dependency}`);
    if (dependency === meta.id) errors.push(`${meta.id}: cannot depend on itself`);
  }
  for (const recommended of meta.recommended || []) {
    if (!skillIds.has(recommended)) errors.push(`${meta.id}: missing recommended skill ${recommended}`);
    if (recommended === meta.id) errors.push(`${meta.id}: cannot recommend itself`);
  }
}

const entrypoints = pack.skills.filter(meta => meta.role === 'entrypoint');
if (entrypoints.length !== 1) errors.push(`Expected exactly one entrypoint skill, found ${entrypoints.length}`);
if (!entrypoints.some(meta => meta.id === 'joktec-framework-skill')) {
  errors.push('joktec-framework-skill must be the entrypoint skill');
}

const secretPatterns = [
  /-----BEGIN PRIVATE KEY-----/,
  /AIza[0-9A-Za-z_-]{20,}/,
  /sk-[A-Za-z0-9]{20,}/,
  /xox[baprs]-[A-Za-z0-9-]{20,}/,
  /password\s*[:=]\s*['"][^'"]+['"]/i
];

for (const skill of skills) {
  if (skill.frontmatter.name !== skill.id) errors.push(`${skill.id}: frontmatter name must match folder name`);
  if (!skill.frontmatter.description || skill.frontmatter.description.length < 80) {
    errors.push(`${skill.id}: description is missing or too short for reliable triggering`);
  }

  const refs = readReferences(skill);
  const linkedRefs = Array.from(skill.raw.matchAll(/references\/[A-Za-z0-9_.-]+\.md/g)).map(match => match[0]);
  for (const ref of linkedRefs) {
    if (!fs.existsSync(path.join(skill.dir, ref))) errors.push(`${skill.id}: missing linked reference ${ref}`);
  }

  if (refs.length === 0) errors.push(`${skill.id}: expected at least one reference file`);

  const searchable = [skill.raw, ...refs.map(ref => ref.content)].join('\n');
  if (/technical debt/i.test(searchable) && /implemented behavior/i.test(searchable)) {
    errors.push(`${skill.id}: possible technical debt wording mixed with implemented behavior`);
  }
  for (const pattern of secretPatterns) {
    if (pattern.test(searchable)) errors.push(`${skill.id}: possible secret pattern matched ${pattern}`);
  }
}

const requiredOutputs = [
  'codex/skills/joktec-framework-skill/SKILL.md',
  'claude/skills/joktec-framework-skill/SKILL.md',
  'cursor/.cursor/rules/joktec-framework-skill.mdc',
  'gemini/GEMINI.md',
  'copilot/.github/copilot-instructions.md',
  'windsurf/.windsurf/rules/joktec-framework-skill.md'
];

for (const rel of requiredOutputs) {
  const abs = path.join(DIST_DIR, rel);
  if (!fs.existsSync(abs)) errors.push(`Missing generated adapter output: dist/${rel}`);
}

if (errors.length) {
  console.error(errors.map(error => `- ${error}`).join('\n'));
  process.exit(1);
}

console.log(`Validated ${skills.length} JokTec skills`);
