import path from 'node:path';
import { DIST_DIR, ensureDir, loadSkills, outputEnabled, renderSkillWithReferences, writeFile } from './lib.mjs';

const outDir = path.join(DIST_DIR, 'gemini');
ensureDir(outDir);

const { pack, skills } = loadSkills();
const sections = skills
  .filter(item => outputEnabled(item, 'gemini'))
  .map(skill => `## ${skill.meta.title}\n\nPackages: ${skill.meta.packages.join(', ')}\n\n${renderSkillWithReferences(skill, { stripTitle: true })}`);

writeFile(
  path.join(outDir, 'GEMINI.md'),
  `# ${pack.name}

Use these instructions when working in a project that consumes JokTec packages.

${sections.join('\n\n---\n\n')}
`,
);

console.log(`Generated Gemini context: ${path.join(outDir, 'GEMINI.md')}`);
