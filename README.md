# JokTec Skills

![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)
![Skills](https://img.shields.io/badge/skills-10-blue.svg)
![Agents](https://img.shields.io/badge/agents-Codex%20%7C%20Claude%20%7C%20Cursor%20%7C%20Gemini%20%7C%20Copilot%20%7C%20Windsurf-purple.svg)
![Version](https://img.shields.io/badge/version-0.1.4-lightgrey.svg)

Hybrid agent skills for using `@joktec/*` libraries in consumer projects.

JokTec Skills turns the current JokTec framework knowledge into portable, agent-readable guidance. It helps coding agents understand how to wire `@joktec/core`, database repositories, brokers, adapters, integrations, and tools without copying framework internals into every project prompt.

[Official Links](#official-links) | [Supported Packages](#supported-packages) | [Quick Start](#quick-start) | [Skill Catalog](#skill-catalog) | [Agent Installation](#install-into-agents)

---

## Table Of Contents

- [Official Links](#official-links)
- [Supported Packages](#supported-packages)
- [What Is This?](#what-is-this)
- [Why Use It?](#why-use-it)
- [Skill Catalog](#skill-catalog)
- [Quick Skill Finder](#quick-skill-finder)
- [Quick Start](#quick-start)
- [CLI Usage](#cli-usage)
- [Install Into Agents](#install-into-agents)
- [Generated Adapters](#generated-adapters)
- [Repository Layout](#repository-layout)
- [Maintenance Workflow](#maintenance-workflow)
- [Publish Workflow](#publish-workflow)
- [Source Of Truth](#source-of-truth)
- [License](#license)

---

## Official Links

- Framework source: [github.com/joktec/joktec-framework](https://github.com/joktec/joktec-framework)
- NPM organization: [npmjs.com/org/joktec](https://www.npmjs.com/org/joktec)
- Local source-of-truth path: `../joktec-framework`

When local source is available, prefer local framework files over remote links. Remote links are fallback references for projects or agents that do not have the framework checkout mounted.

---

## Supported Packages

| Group | Packages |
| --- | --- |
| Common | [`@joktec/core`](https://www.npmjs.com/package/@joktec/core), [`@joktec/utils`](https://www.npmjs.com/package/@joktec/utils), [`@joktec/cron`](https://www.npmjs.com/package/@joktec/cron), [`@joktec/types`](https://www.npmjs.com/package/@joktec/types) |
| Databases | [`@joktec/mongo`](https://www.npmjs.com/package/@joktec/mongo), [`@joktec/mysql`](https://www.npmjs.com/package/@joktec/mysql), [`@joktec/elastic`](https://www.npmjs.com/package/@joktec/elastic), [`@joktec/arango`](https://www.npmjs.com/package/@joktec/arango), [`@joktec/bigquery`](https://www.npmjs.com/package/@joktec/bigquery) |
| Brokers | [`@joktec/kafka`](https://www.npmjs.com/package/@joktec/kafka), [`@joktec/rabbit`](https://www.npmjs.com/package/@joktec/rabbit), [`@joktec/sqs`](https://www.npmjs.com/package/@joktec/sqs), [`@joktec/redcast`](https://www.npmjs.com/package/@joktec/redcast) |
| Adapters | [`@joktec/cacher`](https://www.npmjs.com/package/@joktec/cacher), [`@joktec/mailer`](https://www.npmjs.com/package/@joktec/mailer), [`@joktec/notifier`](https://www.npmjs.com/package/@joktec/notifier), [`@joktec/storage`](https://www.npmjs.com/package/@joktec/storage) |
| Integrations | [`@joktec/firebase`](https://www.npmjs.com/package/@joktec/firebase), [`@joktec/gpt`](https://www.npmjs.com/package/@joktec/gpt) |
| Tools | [`@joktec/http`](https://www.npmjs.com/package/@joktec/http), [`@joktec/file`](https://www.npmjs.com/package/@joktec/file), [`@joktec/alert`](https://www.npmjs.com/package/@joktec/alert) |

Each package also has source documentation in the framework repository under [`packages/`](https://github.com/joktec/joktec-framework/tree/main/packages).

---

## What Is This?

`joktec-skills` is a curated skill pack for agents working in projects that consume JokTec libraries.

It is not a framework implementation repo. It is the distribution layer for agent context:

- concise `SKILL.md` files for Codex/Claude-style skill loading
- focused references for deeper package behavior
- generated rules/instructions for Cursor, Gemini, GitHub Copilot, and Windsurf
- validation scripts to keep the skill pack consistent

The implementation source of truth remains `joktec-framework`.

---

## Why Use It?

Without this pack, every consumer project needs to re-explain how JokTec packages work:

```text
Please inspect the framework, understand BaseController, MongoRepo, MysqlRepo, brokers, adapters...
```

With this pack, the agent can load focused package guidance:

```text
Use joktec-mongo-skill to implement a Mongo-backed resource with MongoModule, MongoRepo, schema decorators, and cursor pagination.
```

The result is less prompt repetition, better package boundary discipline, and more consistent implementation across projects using `@joktec/*`.

---

## Skill Catalog

| Skill | Packages | Use When |
| --- | --- | --- |
| `joktec-framework-skill` | `@joktec/*` | You need the top-level router for choosing the right JokTec package skill. |
| `joktec-common-skill` | `@joktec/core`, `@joktec/utils`, `@joktec/cron`, `@joktec/types` | You work with BaseController, BaseService, config, pagination, client lifecycle, utils, cron, or generated config schema types. |
| `joktec-mongo-skill` | `@joktec/mongo` | You build Mongo schemas, repositories, plugins, strict references, or cursor pagination. |
| `joktec-mysql-skill` | `@joktec/mysql` | You build TypeORM entities, schema-first columns, repositories, transactions, dialect behavior, or cursor pagination. |
| `joktec-broker-skill` | `@joktec/kafka`, `@joktec/rabbit`, `@joktec/sqs`, `@joktec/redcast` | You wire messaging clients, decorators, producers, consumers, queues, topics, or broker handlers. |
| `joktec-adapter-skill` | `@joktec/cacher`, `@joktec/mailer`, `@joktec/notifier`, `@joktec/storage` | You wire cache, mail, push notification, or storage adapters. |
| `joktec-database-extended-skill` | `@joktec/elastic`, `@joktec/arango`, `@joktec/bigquery` | You use additional database clients outside Mongo/MySQL. |
| `joktec-integration-skill` | `@joktec/firebase`, `@joktec/gpt` | You wire Firebase or GPT/OpenAI-style integrations. |
| `joktec-tool-skill` | `@joktec/http`, `@joktec/file`, `@joktec/alert` | You use shared HTTP, file, or alert utility services. |
| `advanced-typescript-design` | TypeScript, NestJS | You design or refactor framework-style TypeScript APIs, advanced generic types, decorators, lifecycle abstractions, or pattern-heavy library code. |

## Skill Dependencies

`joktec-framework-skill` is the required entrypoint skill. Installers should always include it so agents can route from a generic JokTec request to the correct focused skill.

`joktec-common-skill` is the required foundation skill. It depends on `joktec-framework-skill`. Focused package skills such as Mongo, MySQL, brokers, adapters, integrations, and tools depend on both `joktec-framework-skill` and `joktec-common-skill` because most package usage flows rely on core config, lifecycle, or base abstractions.

Dependency metadata lives in `skill-pack.json`:

```json
{
  "id": "joktec-mongo-skill",
  "dependencies": ["joktec-framework-skill", "joktec-common-skill"],
  "recommended": []
}
```

The `@joktec/skills` CLI resolves `dependencies` automatically.

The ecosystem `npx skills` CLI currently installs exactly the skills selected in its prompt. When using it, select dependencies manually or pass them explicitly:

```bash
npx skills add joktec/joktec-skills -a codex --project . \
  --skill joktec-framework-skill joktec-common-skill joktec-mongo-skill
```

`npx skills` also writes a project-level `skills-lock.json`. Keep that file if the project wants reproducible skill updates or restore support through the ecosystem CLI.

---

## Quick Skill Finder

| Task | Start With |
| --- | --- |
| "Which JokTec package should I use?" | `joktec-framework-skill` |
| "Create a CRUD controller/service using JokTec base abstractions" | `joktec-common-skill` |
| "Add Mongo schema and repository" | `joktec-mongo-skill` |
| "Add MySQL/Postgres entity and repository" | `joktec-mysql-skill` |
| "Add Kafka/Rabbit/SQS/Redcast messaging" | `joktec-broker-skill` |
| "Configure cache, mail, notifier, or storage" | `joktec-adapter-skill` |
| "Use Elastic, Arango, or BigQuery" | `joktec-database-extended-skill` |
| "Use Firebase or GPT package" | `joktec-integration-skill` |
| "Use HTTP/file/alert helpers" | `joktec-tool-skill` |
| "Design advanced TypeScript APIs or decorators" | `advanced-typescript-design` |

---

## Quick Start

After publishing, install skills into a project with `npx`:

```bash
cd path/to/consumer-project
npx @joktec/skills add mongo --agent codex --project .
npx @joktec/skills doctor --project .
```

For local development before publish, clone or place this repository next to `joktec-framework`:

```bash
cd ..
git clone <your-joktec-skills-repo-url> joktec-skills
cd joktec-skills
```

Build generated adapter outputs:

```bash
pnpm run build
pnpm run validate
pnpm run sync:check
```

Use the canonical skills directly from:

```text
skills/
```

Or use generated agent-specific outputs from:

```text
dist/
```

---

## CLI Usage

`@joktec/skills` ships a project-level CLI. It does not install into global agent folders such as `~/.agents/skills` or `~/.codex/skills` unless you explicitly point `--project` there.

Install default skills for Codex:

```bash
npx @joktec/skills add --agent codex --project .
```

Install focused skills. Required dependencies are included automatically:

```bash
npx @joktec/skills add mongo,mysql --agent codex --project .
```

Using the ecosystem `skills` CLI:

```bash
npx skills add joktec/joktec-skills -a codex --project . \
  --skill joktec-framework-skill joktec-common-skill joktec-mongo-skill
```

Install for multiple agents:

```bash
npx @joktec/skills install --all --agent all --project . --yes
```

Preview writes without changing files:

```bash
npx @joktec/skills add mongo --agent cursor --project . --dry-run
```

Check detected `@joktec/*` package versions against the skill baseline:

```bash
npx @joktec/skills doctor --project .
```

List available skills:

```bash
npx @joktec/skills list
```

---

## Install Into Agents

### Codex

Project-level install:

```bash
npx @joktec/skills add --agent codex --project .
```

This creates:

```text
.agents/skills/joktec-framework-skill/
.agents/skills/joktec-common-skill/
```

Manual copy alternative:

```bash
mkdir -p .agents/skills
cp -R dist/codex/skills/* .agents/skills/
```

Then invoke a skill explicitly:

```text
Use $joktec-framework-skill to decide which JokTec package skill applies.
```

### Claude

Project-level install:

```bash
npx @joktec/skills add --agent claude --project .
```

Manual copy alternative:

```bash
mkdir -p .claude/skills
cp -R dist/claude/skills/* .claude/skills/
```

Reference the package skill in your project prompt or Claude project instructions:

```text
Use joktec-mysql-skill when implementing relational resources with @joktec/mysql.
```

### Cursor

Project-level install:

```bash
npx @joktec/skills add --agent cursor --project .
```

Manual copy alternative:

```bash
mkdir -p .cursor/rules
cp -R dist/cursor/.cursor/rules/* .cursor/rules/
```

Cursor will load matching rules based on the generated `globs` metadata.

### Gemini

Project-level install:

```bash
npx @joktec/skills add --agent gemini --project .
```

Manual copy alternative:

```bash
cp dist/gemini/GEMINI.md ./GEMINI.md
```

For larger projects, keep this as a project-level context file and refresh it when the skill pack changes.

### GitHub Copilot

Project-level install:

```bash
npx @joktec/skills add --agent copilot --project .
```

Manual copy alternative:

```bash
mkdir -p .github
cp dist/copilot/.github/copilot-instructions.md .github/copilot-instructions.md
```

### Windsurf

Project-level install:

```bash
npx @joktec/skills add --agent windsurf --project .
```

Manual copy alternative:

```bash
mkdir -p .windsurf/rules
cp -R dist/windsurf/.windsurf/rules/* .windsurf/rules/
```

---

## Generated Adapters

Run:

```bash
pnpm run build
```

Output:

| Agent | Output |
| --- | --- |
| Codex | `dist/codex/skills/*` |
| Claude | `dist/claude/skills/*` |
| Cursor | `dist/cursor/.cursor/rules/*.mdc` |
| Gemini | `dist/gemini/GEMINI.md` |
| GitHub Copilot | `dist/copilot/.github/copilot-instructions.md` |
| Windsurf | `dist/windsurf/.windsurf/rules/*.md` |

Do not edit `dist/` by hand. Update canonical files under `skills/`, then rebuild.

---

## Repository Layout

```text
joktec-skills/
├── AGENTS.md
├── README.md
├── skill-pack.json
├── skills/
│   └── joktec-*/SKILL.md
├── adapters/
├── scripts/
└── dist/
```

Important files:

- `AGENTS.md`: instructions for agents maintaining this repository.
- `skill-pack.json`: neutral metadata used by generators.
- `skills/*/SKILL.md`: canonical skill source.
- `skills/*/references/*.md`: deeper package guidance.
- `scripts/validate-skills.mjs`: dependency-free validator.
- `scripts/sync-from-joktec-framework.mjs`: source availability check.

---

## Maintenance Workflow

There are two supported update modes.

### 1. From `joktec-framework`

Use this when the active context is the framework repo.

```text
joktec-framework -> inspect implementation/docs -> update joktec-skills
```

Best for changes that start from real package implementation work.

### 2. From `joktec-skills`

Use this when the active context is the skills repo.

```text
joktec-skills -> inspect local joktec-framework -> update skills -> rebuild adapters
```

If local `joktec-framework` is unavailable, use GitHub fallback:

```text
https://github.com/joktec/joktec-framework
```

After edits:

```bash
pnpm run build
pnpm run sync:check
pnpm run validate
```

---

## Publish Workflow

This repository is a single npm package, not a Lerna/Nx monorepo.

Package manager target:

```bash
pnpm --version
```

Dry-run the publish package:

```bash
pnpm run pack:check
```

Publish to the public npm registry:

```bash
pnpm run publish:registry
```

One-command version bump plus publish:

```bash
pnpm run release:patch
pnpm run release:minor
pnpm run release:major
```

`publish:registry` runs build, validation, source sync check, and `pnpm pack --dry-run` before publishing.

---

## Source Of Truth

Always prefer the local framework checkout:

```text
../joktec-framework
```

Relevant source files:

- `AGENTS.md`
- `docs/agents/*`
- `packages/*/AGENTS.md`
- package-level `AGENTS.md`
- package README files
- package source code when docs are unclear

If local source is not available, use:

```text
https://github.com/joktec/joktec-framework
```

This repository should never document unfinished behavior as implemented behavior.

---

## Design Principles

- Keep `SKILL.md` short and intent-focused.
- Put deeper details in `references/`.
- Keep canonical content under `skills/`.
- Generate adapter outputs instead of maintaining them by hand.
- Do not add non-package workflow skills such as testing, document sync, release, or commit skills.
- Do not store secrets, credentials, private config, or real connection strings.

---

## License

MIT License. See [LICENSE](LICENSE).
