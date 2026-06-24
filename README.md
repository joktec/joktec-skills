# JokTec Skills

Hybrid agent skill pack for using `@joktec/*` libraries in consumer projects.

`joktec-framework` remains the source of truth for implementation, package README files, and agent docs. This repository is a distribution layer for agent-friendly package usage guidance.

## Skill Model

- Use `skills/joktec-framework-skill` as the entrypoint.
- Use focused skills for high-complexity packages such as Mongo and MySQL.
- Use grouped skills for smaller package families such as brokers, adapters, integrations, and tools.
- Keep `SKILL.md` concise and load deeper `references/` only when needed.

## Skills

- `joktec-framework-skill`: package selection router and framework overview.
- `joktec-common-skill`: `@joktec/core`, `@joktec/utils`, `@joktec/cron`.
- `joktec-mongo-skill`: `@joktec/mongo`.
- `joktec-mysql-skill`: `@joktec/mysql`.
- `joktec-broker-skill`: `@joktec/kafka`, `@joktec/rabbit`, `@joktec/sqs`, `@joktec/redcast`.
- `joktec-adapter-skill`: `@joktec/cacher`, `@joktec/mailer`, `@joktec/notifier`, `@joktec/storage`.
- `joktec-database-extended-skill`: `@joktec/elastic`, `@joktec/arango`, `@joktec/bigquery`.
- `joktec-integration-skill`: `@joktec/firebase`, `@joktec/gpt`.
- `joktec-tool-skill`: `@joktec/http`, `@joktec/file`, `@joktec/alert`.

## Commands

```bash
npm run validate
npm run build
npm run sync:check
```

`npm run build` generates adapter outputs under `dist/`:

- Codex/Claude compatible skill folders are the canonical `skills/*` folders.
- Cursor rules: `dist/cursor/.cursor/rules/*.mdc`.
- Gemini context: `dist/gemini/GEMINI.md`.
- GitHub Copilot instructions: `dist/copilot/.github/copilot-instructions.md`.
- Windsurf rules: `dist/windsurf/.windsurf/rules/*.md`.

## Sync Policy

Do not treat this repository as implementation truth. Before changing skill behavior, verify the current `joktec-framework` docs and package README files.
