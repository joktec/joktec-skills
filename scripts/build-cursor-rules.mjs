import path from 'node:path';
import { DIST_DIR, cleanDir, loadSkills, outputEnabled, renderSkillWithReferences, writeFile } from './lib.mjs';

const outDir = path.join(DIST_DIR, 'cursor', '.cursor', 'rules');
cleanDir(outDir);

const { skills } = loadSkills();
for (const skill of skills.filter(item => outputEnabled(item, 'cursor'))) {
  const globs = skill.meta.scope?.paths?.join(',') || '**/*';
  const content = `---
description: ${skill.frontmatter.description}
globs: ${globs}
alwaysApply: false
---

# ${skill.meta.title}

${renderSkillWithReferences(skill, { stripTitle: true })}
`;
  writeFile(path.join(outDir, `${skill.id}.mdc`), content);
}

console.log(`Generated Cursor rules: ${outDir}`);
