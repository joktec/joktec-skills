#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import readline from 'node:readline';
import readlinePromises from 'node:readline/promises';
import { stdin as input, stdout as output } from 'node:process';
import { DIST_DIR, ROOT, ensureDir, loadSkills, readJson, writeFile } from '../scripts/lib.mjs';

const AGENTS = ['codex', 'claude', 'cursor', 'gemini', 'copilot', 'windsurf'];
const DEFAULT_SOURCE = 'https://github.com/joktec/joktec-skills.git';
const SKILL_ALIASES = {
  framework: 'joktec-framework-skill',
  common: 'joktec-common-skill',
  core: 'joktec-common-skill',
  utils: 'joktec-common-skill',
  cron: 'joktec-common-skill',
  types: 'joktec-common-skill',
  mongo: 'joktec-mongo-skill',
  mysql: 'joktec-mysql-skill',
  sql: 'joktec-mysql-skill',
  broker: 'joktec-broker-skill',
  brokers: 'joktec-broker-skill',
  kafka: 'joktec-broker-skill',
  rabbit: 'joktec-broker-skill',
  sqs: 'joktec-broker-skill',
  redcast: 'joktec-broker-skill',
  adapter: 'joktec-adapter-skill',
  adapters: 'joktec-adapter-skill',
  cacher: 'joktec-adapter-skill',
  mailer: 'joktec-adapter-skill',
  notifier: 'joktec-adapter-skill',
  storage: 'joktec-adapter-skill',
  database: 'joktec-database-extended-skill',
  databases: 'joktec-database-extended-skill',
  elastic: 'joktec-database-extended-skill',
  arango: 'joktec-database-extended-skill',
  bigquery: 'joktec-database-extended-skill',
  integration: 'joktec-integration-skill',
  integrations: 'joktec-integration-skill',
  firebase: 'joktec-integration-skill',
  gpt: 'joktec-integration-skill',
  tool: 'joktec-tool-skill',
  tools: 'joktec-tool-skill',
  http: 'joktec-tool-skill',
  file: 'joktec-tool-skill',
  alert: 'joktec-tool-skill',
};

const color = {
  dim: text => (output.isTTY ? `\x1b[2m${text}\x1b[0m` : text),
  cyan: text => (output.isTTY ? `\x1b[36m${text}\x1b[0m` : text),
  green: text => (output.isTTY ? `\x1b[32m${text}\x1b[0m` : text),
  yellow: text => (output.isTTY ? `\x1b[33m${text}\x1b[0m` : text),
  bold: text => (output.isTTY ? `\x1b[1m${text}\x1b[0m` : text),
};

function parseArgs(argv) {
  const args = { _: [] };
  for (let i = 0; i < argv.length; i += 1) {
    const item = argv[i];
    if (!item.startsWith('-')) {
      args._.push(item);
      continue;
    }

    const [rawKey, inlineValue] = item.replace(/^--?/, '').split('=');
    const key = rawKey === 'a' ? 'agent' : rawKey === 'y' ? 'yes' : rawKey;
    if (['yes', 'all', 'dry-run', 'force', 'help', 'version', 'recommended'].includes(key)) {
      args[key] = true;
      continue;
    }
    args[key] = inlineValue ?? argv[++i];
  }
  return args;
}

function printHelp() {
  console.log(`JokTec Skills CLI

Usage:
  npx @joktec/skills add [skills] --agent <agent> --project <path>
  npx @joktec/skills install [skills] --agent <agent> --project <path>
  npx @joktec/skills doctor --project <path>
  npx @joktec/skills list

Agents:
  codex, claude, cursor, gemini, copilot, windsurf, all

Examples:
  npx @joktec/skills add mongo --agent codex --project .
  npx @joktec/skills add mongo,mysql --agent cursor --project .
  npx @joktec/skills install --all --agent all --project . --yes
  npx @joktec/skills doctor --project .
`);
}

function splitList(value) {
  if (!value) return [];
  return String(value)
    .split(',')
    .map(item => item.trim())
    .filter(Boolean);
}

function isSourceToken(value) {
  if (!value) return false;
  return /^https?:\/\//.test(value) || /^git@/.test(value) || value === 'joktec/joktec-skills';
}

function sourceToUrl(value) {
  if (!value || value === 'joktec/joktec-skills') return DEFAULT_SOURCE;
  return value;
}

function consumeSourceToken(args) {
  if (!isSourceToken(args._[0])) return DEFAULT_SOURCE;
  return sourceToUrl(args._.shift());
}

function resolveSkillIds(pack, requested, all = false) {
  const allIds = pack.skills.map(skill => skill.id);
  if (all) return allIds;

  const initial = requested.length
    ? requested
    : pack.skills.filter(skill => skill.requiredByDefault).map(skill => skill.id);

  return Array.from(
    new Set(
      initial.map(item => {
        const normalized = item.replace(/^@joktec\//, '').replace(/-skill$/, '');
        const id = SKILL_ALIASES[normalized] || SKILL_ALIASES[item] || item;
        if (!allIds.includes(id)) throw new Error(`Unknown skill: ${item}`);
        return id;
      }),
    ),
  );
}

function resolveDependencies(pack, ids, includeRecommended) {
  const byId = new Map(pack.skills.map(skill => [skill.id, skill]));
  const selected = new Set(ids);
  const addedDependencies = new Set();
  const addedRecommended = new Set();

  let changed = true;
  while (changed) {
    changed = false;
    for (const id of Array.from(selected)) {
      const skill = byId.get(id);
      for (const dep of skill.dependencies || []) {
        if (!selected.has(dep)) {
          selected.add(dep);
          addedDependencies.add(dep);
          changed = true;
        }
      }
      if (includeRecommended) {
        for (const rec of skill.recommended || []) {
          if (!selected.has(rec)) {
            selected.add(rec);
            addedRecommended.add(rec);
            changed = true;
          }
        }
      }
    }
  }

  const ordered = pack.skills.map(skill => skill.id).filter(id => selected.has(id));
  return {
    selected: ordered,
    addedDependencies: Array.from(addedDependencies),
    addedRecommended: Array.from(addedRecommended),
  };
}

function parseAgents(value) {
  const requested = splitList(value || 'codex');
  const result = requested.includes('all') ? AGENTS : requested;
  for (const agent of result) {
    if (!AGENTS.includes(agent)) throw new Error(`Unknown agent: ${agent}`);
  }
  return Array.from(new Set(result));
}

function copyRecursive(src, dest, force) {
  if (fs.existsSync(dest)) {
    if (!force) throw new Error(`Target exists: ${dest}. Use --force to overwrite.`);
    fs.rmSync(dest, { recursive: true, force: true });
  }
  ensureDir(path.dirname(dest));
  fs.cpSync(src, dest, { recursive: true });
}

function copyFile(src, dest, force) {
  if (fs.existsSync(dest) && !force) throw new Error(`Target exists: ${dest}. Use --force to overwrite.`);
  ensureDir(path.dirname(dest));
  fs.copyFileSync(src, dest);
}

function addCopy(operations, src, dest, type = 'file', agent) {
  operations.push({ src, dest, type, agent });
}

function planAgentInstall(agent, project, skillIds) {
  const operations = [];

  if (agent === 'codex') {
    const srcBase = path.join(DIST_DIR, 'codex', 'skills');
    const destBase = path.join(project, '.agents', 'skills');
    for (const id of skillIds) addCopy(operations, path.join(srcBase, id), path.join(destBase, id), 'dir', agent);
  }

  if (agent === 'claude') {
    const srcBase = path.join(DIST_DIR, 'claude', 'skills');
    const destBase = path.join(project, '.claude', 'skills');
    for (const id of skillIds) addCopy(operations, path.join(srcBase, id), path.join(destBase, id), 'dir', agent);
  }

  if (agent === 'cursor') {
    for (const id of skillIds) {
      addCopy(
        operations,
        path.join(DIST_DIR, 'cursor', '.cursor', 'rules', `${id}.mdc`),
        path.join(project, '.cursor', 'rules', `${id}.mdc`),
        'file',
        agent,
      );
    }
  }

  if (agent === 'windsurf') {
    for (const id of skillIds) {
      addCopy(
        operations,
        path.join(DIST_DIR, 'windsurf', '.windsurf', 'rules', `${id}.md`),
        path.join(project, '.windsurf', 'rules', `${id}.md`),
        'file',
        agent,
      );
    }
  }

  if (agent === 'gemini') {
    addCopy(operations, path.join(DIST_DIR, 'gemini', 'GEMINI.md'), path.join(project, 'GEMINI.md'), 'file', agent);
  }

  if (agent === 'copilot') {
    addCopy(
      operations,
      path.join(DIST_DIR, 'copilot', '.github', 'copilot-instructions.md'),
      path.join(project, '.github', 'copilot-instructions.md'),
      'file',
      agent,
    );
  }

  return operations;
}

function executeOperations(operations, force, dryRun) {
  if (dryRun) return;
  for (const operation of operations) {
    if (operation.type === 'dir') copyRecursive(operation.src, operation.dest, force);
    else copyFile(operation.src, operation.dest, force);
  }
}

function writeManifest(project, pack, agents, skillIds, dryRun) {
  const file = path.join(project, '.joktec-skills.json');
  const existing = fs.existsSync(file) ? readJson(file) : {};
  const manifest = {
    package: '@joktec/skills',
    version: pack.version,
    installedAt: new Date().toISOString(),
    agents: Array.from(new Set([...(existing.agents || []), ...agents])).sort(),
    skills: Array.from(new Set([...(existing.skills || []), ...skillIds])).sort(),
    frameworkBaseline: pack.frameworkBaseline,
    packageBaseline: pack.packageBaseline,
  };
  if (!dryRun) writeFile(file, JSON.stringify(manifest, null, 2));
  return manifest;
}

function logo() {
  console.log(color.dim(`     ██╗ ██████╗ ██╗  ██╗████████╗███████╗ ██████╗
     ██║██╔═══██╗██║ ██╔╝╚══██╔══╝██╔════╝██╔════╝
     ██║██║   ██║█████╔╝    ██║   █████╗  ██║     
██   ██║██║   ██║██╔═██╗    ██║   ██╔══╝  ██║     
╚█████╔╝╚██████╔╝██║  ██╗   ██║   ███████╗╚██████╗
 ╚════╝  ╚═════╝ ╚═╝  ╚═╝   ╚═╝   ╚══════╝ ╚═════╝`));
  console.log('');
}

function step(label, value) {
  console.log(`${color.green('◇')}  ${label}${value ? `\n│  ${value}` : ''}`);
  console.log('│');
}

function label() {
  console.log(`┌   ${color.cyan(' skills ')}`);
  console.log('│');
}

function done(message) {
  console.log(`└  ${color.green('Done!')}  ${color.dim(message)}`);
}

function displayPath(file) {
  const home = process.env.HOME;
  return home && file.startsWith(home) ? `~${file.slice(home.length)}` : file;
}

function box(title, lines) {
  const contentWidth = Math.max(title.length + 6, ...lines.map(line => line.length + 4), 70);
  const width = output.isTTY ? Math.min(contentWidth, Math.max(70, (output.columns || 100) - 4)) : contentWidth;
  const head = `${color.green('◇')}  ${title} ${'─'.repeat(Math.max(1, width - title.length - 5))}╮`;
  console.log(head);
  console.log(`│${' '.repeat(width)}│`);
  for (const line of lines) {
    console.log(`│  ${line}${' '.repeat(Math.max(0, width - line.length - 2))}│`);
  }
  console.log(`├${'─'.repeat(width)}╯`);
  console.log('│');
}

function buildSummaryLines(project, operations) {
  return operations.flatMap(operation => [
    color.cyan(displayPath(operation.dest)),
    color.dim(`  copy -> ${operation.agent[0].toUpperCase()}${operation.agent.slice(1)}`),
    '',
  ]);
}

function buildInstalledLines(project, operations, skillIds, dryRun) {
  const bySkill = new Map();
  for (const operation of operations) {
    const id = skillIds.find(skillId => operation.dest.includes(skillId));
    if (id && !bySkill.has(id)) bySkill.set(id, operation.dest);
  }
  return Array.from(bySkill.entries()).flatMap(([id, dest]) => [
    `${color.green('✓')} ${id} ${color.dim(dryRun ? '(planned)' : '(copied)')}`,
    color.dim(`  -> ${displayPath(dest)}`),
  ]);
}

function renderMultiSelect(items, cursor, selected, message) {
  readline.cursorTo(output, 0);
  readline.clearScreenDown(output);
  console.log(`${color.green('◇')}  ${message} ${color.dim('(space to toggle, enter to confirm)')}`);
  for (let i = 0; i < items.length; i += 1) {
    const marker = selected.has(items[i].value) ? color.green('●') : '○';
    const pointer = i === cursor ? color.cyan('›') : ' ';
    console.log(`│ ${pointer} ${marker} ${items[i].label}`);
  }
}

async function multiSelect(items, defaults, message) {
  if (!input.isTTY || !output.isTTY) return defaults;

  const selected = new Set(defaults);
  let cursor = 0;
  output.write('\n');
  readline.emitKeypressEvents(input);
  input.setRawMode(true);

  try {
    return await new Promise(resolve => {
      const onKey = (str, key) => {
        if (key.name === 'c' && key.ctrl) {
          input.setRawMode(false);
          process.exit(130);
        }
        if (key.name === 'up' || key.name === 'k') cursor = (cursor - 1 + items.length) % items.length;
        if (key.name === 'down' || key.name === 'j') cursor = (cursor + 1) % items.length;
        if (key.name === 'space') {
          const id = items[cursor].value;
          if (selected.has(id)) selected.delete(id);
          else selected.add(id);
        }
        if (key.name === 'return') {
          input.off('keypress', onKey);
          input.setRawMode(false);
          readline.cursorTo(output, 0);
          readline.clearScreenDown(output);
          resolve(Array.from(selected));
          return;
        }
        renderMultiSelect(items, cursor, selected, message);
      };

      renderMultiSelect(items, cursor, selected, message);
      input.on('keypress', onKey);
    });
  } finally {
    if (input.isRaw) input.setRawMode(false);
  }
}

async function confirm(message, yes) {
  if (yes || !input.isTTY) return true;
  const rl = readlinePromises.createInterface({ input, output });
  const answer = await rl.question(`${color.green('◇')}  ${message}\n│  `);
  rl.close();
  console.log('│');
  return !/^n(o)?$/i.test(answer.trim());
}

async function addCommand(args) {
  const { pack } = loadSkills();
  const project = path.resolve(args.project || '.');
  const source = consumeSourceToken(args);
  const agents = parseAgents(args.agent);
  const requested = [...args._, ...splitList(args.skills)].flatMap(splitList);

  logo();
  label();
  step('Source:', source);
  step(source === DEFAULT_SOURCE ? 'Repository ready' : 'External source accepted');
  step(`Found ${color.green(String(pack.skills.length))} skills`);

  let selected;
  const canPromptForSkills = !args.yes && !args.all && !requested.length && input.isTTY && output.isTTY;
  if (canPromptForSkills) {
    selected = await multiSelect(
      pack.skills.map(skill => ({
        value: skill.id,
        label: `${skill.id} ${color.dim(`(${skill.packages.join(', ')})`)}`,
      })),
      pack.skills.filter(skill => skill.requiredByDefault).map(skill => skill.id),
      'Select skills to install',
    );
  } else {
    selected = resolveSkillIds(pack, requested, Boolean(args.all));
    step('Select skills to install', selected.join(', '));
  }

  const resolution = resolveDependencies(pack, selected, Boolean(args.yes || args.recommended || !requested.length));
  step('Installation scope', 'Project');

  if (resolution.addedDependencies.length) {
    step('Required dependencies added', resolution.addedDependencies.join(', '));
  }
  if (resolution.addedRecommended.length) {
    step('Recommended skills added', resolution.addedRecommended.join(', '));
  }

  const operations = agents.flatMap(agent => planAgentInstall(agent, project, resolution.selected));
  box('Installation Summary', buildSummaryLines(project, operations));

  const ok = await confirm('Proceed with installation?', Boolean(args.yes));
  if (!ok) {
    console.log(`${color.yellow('◇')}  Installation cancelled`);
    return;
  }

  executeOperations(operations, Boolean(args.force), Boolean(args['dry-run']));
  const manifest = writeManifest(project, pack, agents, resolution.selected, Boolean(args['dry-run']));

  step(args['dry-run'] ? 'Dry run complete' : 'Installation complete');
  box(
    `${args['dry-run'] ? 'Planned' : 'Installed'} ${resolution.selected.length} skills`,
    buildInstalledLines(project, operations, resolution.selected, Boolean(args['dry-run'])),
  );
  console.log(`│  ${color.dim(`Manifest: ${displayPath(path.join(project, '.joktec-skills.json'))}`)}`);
  console.log(`│  ${color.dim(`@joktec/skills ${manifest.version}`)}`);
  console.log('│');
  done('Review skills before use; they run with full agent permissions.');
}

function collectProjectJoktecPackages(project) {
  const file = path.join(project, 'package.json');
  if (!fs.existsSync(file)) return {};
  const pkg = readJson(file);
  return Object.assign(
    {},
    pkg.dependencies || {},
    pkg.devDependencies || {},
    pkg.peerDependencies || {},
    pkg.optionalDependencies || {},
  );
}

function normalizeVersion(version) {
  const match = String(version || '').match(/\d+\.\d+\.\d+/);
  return match?.[0] || null;
}

function compareVersions(a, b) {
  const pa = normalizeVersion(a)?.split('.').map(Number);
  const pb = normalizeVersion(b)?.split('.').map(Number);
  if (!pa || !pb) return null;
  for (let i = 0; i < 3; i += 1) {
    if (pa[i] > pb[i]) return 1;
    if (pa[i] < pb[i]) return -1;
  }
  return 0;
}

function doctorCommand(args) {
  const { pack } = loadSkills();
  const project = path.resolve(args.project || '.');
  const deps = collectProjectJoktecPackages(project);
  const joktecDeps = Object.entries(deps).filter(([name]) => name.startsWith('@joktec/'));

  console.log(`JokTec Skills: ${pack.version}`);
  console.log(`Framework baseline: ${pack.frameworkBaseline?.commit || 'unknown'}`);
  console.log(`Project: ${project}`);

  if (!joktecDeps.length) {
    console.log('\nNo @joktec/* packages found in package.json.');
    return;
  }

  console.log('\nDetected @joktec/* packages:');
  for (const [name, version] of joktecDeps) {
    const baseline = pack.packageBaseline?.[name];
    const cmp = baseline ? compareVersions(version, baseline) : null;
    let status = 'baseline unknown';
    if (cmp === 0) status = 'matches skill baseline';
    if (cmp === 1) status = 'newer than skill baseline; verify newly added APIs';
    if (cmp === -1) status = 'older than skill baseline; some APIs may not exist';
    console.log(`- ${name}: ${version}${baseline ? ` (baseline ${baseline}; ${status})` : ` (${status})`}`);
  }
}

function listCommand() {
  const { pack } = loadSkills();
  for (const skill of pack.skills) {
    const deps = skill.dependencies?.length ? ` deps: ${skill.dependencies.join(',')}` : '';
    const rec = skill.recommended?.length ? ` recommended: ${skill.recommended.join(',')}` : '';
    console.log(`${skill.id} - ${skill.packages.join(', ')}${deps}${rec}`);
  }
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const command = args._.shift() || 'help';
  if (args.help || command === 'help') return printHelp();
  if (args.version || command === 'version') return console.log(readJson(path.join(ROOT, 'package.json')).version);
  if (command === 'list') return listCommand();
  if (command === 'doctor' || command === 'check') return doctorCommand(args);
  if (command === 'add' || command === 'install') return addCommand(args);

  throw new Error(`Unknown command: ${command}`);
}

main().catch(error => {
  console.error(`Error: ${error.message}`);
  process.exit(1);
});
