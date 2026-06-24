import path from 'node:path';
import { DIST_DIR, cleanDir, loadSkills, outputEnabled, renderSkillWithReferences, writeFile } from './lib.mjs';

const outDir = path.join(DIST_DIR, 'windsurf', '.windsurf', 'rules');
cleanDir(outDir);

const { skills } = loadSkills();
for (const skill of skills.filter(item => outputEnabled(item, 'windsurf'))) {
  const content = `# ${skill.meta.title}

${skill.frontmatter.description}

${renderSkillWithReferences(skill, { stripTitle: true })}
`;
  writeFile(path.join(outDir, `${skill.id}.md`), content);
}

console.log(`Generated Windsurf rules: ${outDir}`);
