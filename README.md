# JokTec Skills

![License: MIT](https://img.shields.io/badge/license-MIT-green.svg)
![Skills](https://img.shields.io/badge/skills-9-blue.svg)
![Agents](https://img.shields.io/badge/agents-Codex%20%7C%20Claude%20%7C%20Cursor%20%7C%20Gemini%20%7C%20Copilot%20%7C%20Windsurf-purple.svg)
![Version](https://img.shields.io/badge/version-0.1.0-lightgrey.svg)

Hybrid agent skills for using `@joktec/*` libraries in consumer projects.

JokTec Skills turns the current JokTec framework knowledge into portable, agent-readable guidance. It helps coding agents understand how to wire `@joktec/core`, database repositories, brokers, adapters, integrations, and tools without copying framework internals into every project prompt.

Quick Start | Skill Catalog | Agent Installation | Generated Adapters | Maintenance

---

## Table Of Contents

- [What Is This?](#what-is-this)
- [Why Use It?](#why-use-it)
- [Skill Catalog](#skill-catalog)
- [Quick Skill Finder](#quick-skill-finder)
- [Quick Start](#quick-start)
- [Install Into Agents](#install-into-agents)
- [Generated Adapters](#generated-adapters)
- [Repository Layout](#repository-layout)
- [Maintenance Workflow](#maintenance-workflow)
- [Source Of Truth](#source-of-truth)
- [License](#license)

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
| `joktec-common-skill` | `@joktec/core`, `@joktec/utils`, `@joktec/cron` | You work with BaseController, BaseService, config, pagination, client lifecycle, utils, or cron. |
| `joktec-mongo-skill` | `@joktec/mongo` | You build Mongo schemas, repositories, plugins, strict references, or cursor pagination. |
| `joktec-mysql-skill` | `@joktec/mysql` | You build TypeORM entities, schema-first columns, repositories, transactions, dialect behavior, or cursor pagination. |
| `joktec-broker-skill` | `@joktec/kafka`, `@joktec/rabbit`, `@joktec/sqs`, `@joktec/redcast` | You wire messaging clients, decorators, producers, consumers, queues, topics, or broker handlers. |
| `joktec-adapter-skill` | `@joktec/cacher`, `@joktec/mailer`, `@joktec/notifier`, `@joktec/storage` | You wire cache, mail, push notification, or storage adapters. |
| `joktec-database-extended-skill` | `@joktec/elastic`, `@joktec/arango`, `@joktec/bigquery` | You use additional database clients outside Mongo/MySQL. |
| `joktec-integration-skill` | `@joktec/firebase`, `@joktec/gpt` | You wire Firebase or GPT/OpenAI-style integrations. |
| `joktec-tool-skill` | `@joktec/http`, `@joktec/file`, `@joktec/alert` | You use shared HTTP, file, or alert utility services. |

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

---

## Quick Start

Clone or place this repository next to `joktec-framework`:

```bash
cd /Users/user/Project/joktec
git clone <your-joktec-skills-repo-url> joktec-skills
cd joktec-skills
```

Build generated adapter outputs:

```bash
npm run build
npm run validate
npm run sync:check
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

## Install Into Agents

### Codex

Copy the generated skill folders into your Codex skills directory:

```bash
mkdir -p ~/.codex/skills
cp -R dist/codex/skills/* ~/.codex/skills/
```

Then invoke a skill explicitly:

```text
Use $joktec-framework-skill to decide which JokTec package skill applies.
```

### Claude

Copy generated skill folders into your Claude skills directory or project-level Claude skill folder:

```bash
mkdir -p .claude/skills
cp -R dist/claude/skills/* .claude/skills/
```

Reference the package skill in your project prompt or Claude project instructions:

```text
Use joktec-mysql-skill when implementing relational resources with @joktec/mysql.
```

### Cursor

Copy generated Cursor rules into a consumer project:

```bash
mkdir -p .cursor/rules
cp -R dist/cursor/.cursor/rules/* .cursor/rules/
```

Cursor will load matching rules based on the generated `globs` metadata.

### Gemini

Copy the generated Gemini context file:

```bash
cp dist/gemini/GEMINI.md ./GEMINI.md
```

For larger projects, keep this as a project-level context file and refresh it when the skill pack changes.

### GitHub Copilot

Copy generated Copilot instructions:

```bash
mkdir -p .github
cp dist/copilot/.github/copilot-instructions.md .github/copilot-instructions.md
```

### Windsurf

Copy generated Windsurf rules:

```bash
mkdir -p .windsurf/rules
cp -R dist/windsurf/.windsurf/rules/* .windsurf/rules/
```

---

## Generated Adapters

Run:

```bash
npm run build
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
npm run build
npm run sync:check
npm run validate
```

---

## Source Of Truth

Always prefer the local framework checkout:

```text
/Users/user/Project/joktec/joktec-framework
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
