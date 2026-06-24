import path from 'node:path';
import { DIST_DIR, ensureDir, loadSkills, outputEnabled, renderSkillWithReferences, writeFile } from './lib.mjs';

const outDir = path.join(DIST_DIR, 'copilot', '.github');
ensureDir(outDir);

const { skills } = loadSkills();
const sections = skills
  .filter(item => outputEnabled(item, 'copilot'))
  .map(skill => `## ${skill.meta.title}\n\n${renderSkillWithReferences(skill, { stripTitle: true })}`);

writeFile(
  path.join(outDir, 'copilot-instructions.md'),
  `# JokTec Copilot Instructions

Use these instructions when working in repositories that consume \`@joktec/*\` packages.

${sections.join('\n\n---\n\n')}
`,
);

console.log(`Generated Copilot instructions: ${path.join(outDir, 'copilot-instructions.md')}`);
