# JokTec Framework Map

## Source-First Operating Protocol

Treat this skill pack as curated guidance, not the final implementation truth. When a task is unclear, or when a package API seems different from the skill text:

1. Inspect the consumer project first to understand the package versions and local usage pattern.
2. Prefer local framework source at `../joktec-framework` when available.
3. Read package `README.md`, nearest `AGENTS.md`, and `src/index.ts` before changing code.
4. If local source is unavailable, use `https://github.com/joktec/joktec-framework` as fallback.
5. Do not invent behavior that is not visible in framework source or package docs.
6. If package docs and source conflict, source code wins and the mismatch should be treated as documentation drift.

High-value source files:

- `AGENTS.md` and `docs/agents/*` for framework-level architecture and runtime policy.
- `packages/<family>/AGENTS.md` for family boundaries.
- `packages/<family>/<package>/README.md` for developer-facing usage.
- `packages/<family>/<package>/src/index.ts` for public API.
- Package config/module/service/repository files for real runtime behavior.

## Package Families

- `@joktec/core`: bootstrap, config, logger, metrics, guards, base abstractions, transports, pagination, Bull.
- `@joktec/utils`: low-level helpers, validators, conversion utilities.
- `@joktec/cron`: cron decorators, schedulers, job workers.
- `@joktec/mongo`: Mongoose/Typegoose database adapter and repository.
- `@joktec/mysql`: TypeORM relational adapter and repository.
- `@joktec/kafka`, `@joktec/rabbit`, `@joktec/sqs`, `@joktec/redcast`: broker clients and decorators.
- `@joktec/cacher`, `@joktec/mailer`, `@joktec/notifier`, `@joktec/storage`: external capability adapters.
- `@joktec/elastic`, `@joktec/arango`, `@joktec/bigquery`: extended database clients.
- `@joktec/firebase`, `@joktec/gpt`: third-party integrations.
- `@joktec/http`, `@joktec/file`, `@joktec/alert`: reusable tools.

## Dependency Direction

Consumer apps depend on concrete `@joktec/*` packages. Concrete packages usually depend on `@joktec/core` and `@joktec/utils`. Keep app-specific schemas, handlers, and business semantics outside reusable packages.

Do not reverse the dependency direction:

- reusable packages must not import from `apps/`
- `common` packages must not depend on concrete adapters/brokers/databases
- consumer apps own business workflows, DTO composition, schemas/entities, queue names, topics, and provider credentials

## Common Consumer App Pattern

1. Register package modules in the app module or repository module.
2. Keep app schemas/entities and app repositories in the consumer app.
3. Extend the package repository base class when the package provides one.
4. Use `BaseService`, `BaseController`, or transport helpers from `@joktec/core` when the app follows standard CRUD or message patterns.

## Skill Selection

- Use `joktec-common-skill` for BaseController/BaseService/config/pagination/client lifecycle/utils/cron.
- Use `joktec-mongo-skill` when the resource uses Mongo schemas, MongoRepo, Typegoose decorators, plugins, or ObjectId-safe queries.
- Use `joktec-mysql-skill` when the resource uses TypeORM entities, MysqlRepo, SQL dialect behavior, transactions, or schema-first column decorators.
- Use broker/adapter/integration/tool skills for provider wiring; keep business semantics in the consumer app.

When using the ecosystem `npx skills` installer, install `joktec-framework-skill` and `joktec-common-skill` together with any focused package skill. The current ecosystem installer does not auto-resolve dependencies from frontmatter.
