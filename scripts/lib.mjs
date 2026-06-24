import fs from 'node:fs';
import path from 'node:path';

export const ROOT = path.resolve(new URL('..', import.meta.url).pathname);
export const SKILLS_DIR = path.join(ROOT, 'skills');
export const DIST_DIR = path.join(ROOT, 'dist');
export const PACK_PATH = path.join(ROOT, 'skill-pack.json');

export function readJson(file) {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

export function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

export function listSkillDirs() {
  return fs
    .readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(item => item.isDirectory())
    .map(item => path.join(SKILLS_DIR, item.name))
    .sort();
}

export function parseSkill(file) {
  const raw = fs.readFileSync(file, 'utf8');
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error(`Missing frontmatter: ${file}`);

  const frontmatter = {};
  for (const line of match[1].split('\n')) {
    const idx = line.indexOf(':');
    if (idx === -1) continue;
    const key = line.slice(0, idx).trim();
    const value = line.slice(idx + 1).trim().replace(/^["']|["']$/g, '');
    frontmatter[key] = value;
  }

  return {
    file,
    dir: path.dirname(file),
    raw,
    frontmatter,
    body: match[2].trim(),
  };
}

export function loadSkills() {
  const pack = readJson(PACK_PATH);
  const skillsById = new Map(listSkillDirs().map(dir => {
    const skill = parseSkill(path.join(dir, 'SKILL.md'));
    const id = path.basename(dir);
    const meta = pack.skills.find(item => item.id === id);
    if (!meta) throw new Error(`Missing skill-pack metadata for ${id}`);
    return [id, { id, meta, ...skill }];
  }));

  const skills = pack.skills.map(meta => {
    const skill = skillsById.get(meta.id);
    if (!skill) throw new Error(`Missing skill directory for ${meta.id}`);
    return skill;
  });

  return { pack, skills };
}

export function readReferences(skill) {
  const refDir = path.join(skill.dir, 'references');
  if (!fs.existsSync(refDir)) return [];

  return fs
    .readdirSync(refDir, { withFileTypes: true })
    .filter(item => item.isFile() && item.name.endsWith('.md'))
    .map(item => {
      const file = path.join(refDir, item.name);
      return {
        name: item.name,
        rel: path.relative(skill.dir, file),
        content: fs.readFileSync(file, 'utf8').trim(),
      };
    })
    .sort((a, b) => a.name.localeCompare(b.name));
}

function stripLeadingHeading(content) {
  return content.replace(/^# .+\n+/, '').trim();
}

export function renderSkillWithReferences(skill, options = {}) {
  const refs = readReferences(skill);
  const body = options.stripTitle ? stripLeadingHeading(skill.body) : skill.body;
  const refText = refs.length
    ? `\n\n## Bundled References\n\n${refs.map(ref => `### ${ref.rel}\n\n${ref.content}`).join('\n\n')}`
    : '';
  return `${body}${refText}`.trim();
}

export function writeFile(file, content) {
  ensureDir(path.dirname(file));
  fs.writeFileSync(file, `${content.replace(/\s+$/g, '')}\n`);
}

export function cleanDir(dir) {
  fs.rmSync(dir, { recursive: true, force: true });
  ensureDir(dir);
}

export function outputEnabled(skill, target) {
  return Boolean(skill.meta.outputs?.[target]);
}
