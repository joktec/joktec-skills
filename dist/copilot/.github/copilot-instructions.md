# JokTec Copilot Instructions

Use these instructions when working in repositories that consume `@joktec/*` packages.

## JokTec Framework Skill

Start here when a task mentions JokTec generally, multiple `@joktec/*` packages, or a consumer app that needs framework wiring.

## Select The Focused Skill

- For `@joktec/core`, `@joktec/utils`, or `@joktec/cron`, use `joktec-common-skill`.
- For `@joktec/mongo`, use `joktec-mongo-skill`.
- For `@joktec/mysql`, use `joktec-mysql-skill`.
- For Kafka, RabbitMQ, SQS, or Redcast, use `joktec-broker-skill`.
- For cache, mail, notification, or storage adapters, use `joktec-adapter-skill`.
- For Elastic, Arango, or BigQuery, use `joktec-database-extended-skill`.
- For Firebase or GPT integrations, use `joktec-integration-skill`.
- For HTTP, file, or alert utilities, use `joktec-tool-skill`.

## Core Rules

- Treat `joktec-framework` code, package README files, and agent docs as source-of-truth.
- Keep consumer app business logic in the app; do not move it into `@joktec/*` packages.
- Prefer config-driven module setup and `conId` when a package supports multiple clients.
- Preserve NestJS module boundaries, dependency injection, lifecycle hooks, and exported package APIs.
- Do not invent behavior for unfinished or missing packages.
- If a focused skill is loaded without this entrypoint, still apply source-first lookup before assuming APIs.

## Reference

Read `references/framework-map.md` when the task needs package selection, dependency flow, or a quick map from requirement to package.

## Bundled References

### references/framework-map.md

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

---

## JokTec Common Skill

Use this skill for shared framework primitives, low-level helpers, cron utilities, and config schema type support.

## Packages

- `@joktec/core`: NestJS bootstrap, modules, config, logger, metrics, base abstractions, transports, pagination, Bull.
- `@joktec/utils`: conversion helpers, UUID/OTP/hash generators, validators, common constants.
- `@joktec/cron`: cron decorators, schedulers, workers, and job contracts.
- `@joktec/types`: generated config schema/type support for the JokTec package set.

## Rules

- Keep `@joktec/core` app-neutral; do not import adapters, brokers, databases, integrations, or consumer app code into core concepts.
- Use `BaseController` and `BaseService` for standard CRUD flows before hand-writing repetitive controllers.
- Use page, offset, or cursor pagination contracts from core; let database packages execute storage-specific pagination.
- Use `AbstractClientService` patterns for client packages that need config, lifecycle, retry, and `conId`.
- Use `@joktec/utils` for shared helpers instead of duplicating conversion, validation, hashing, or UUID logic.
- If guidance is insufficient, read this skill's references and inspect `../joktec-framework` package source or GitHub fallback before assuming APIs.

## References

- Read `references/core.md` for bootstrap, CRUD, pagination, and client lifecycle.
- Read `references/utils-cron.md` for utility helpers and cron usage.

## Bundled References

### references/core.md

# Common Core Usage

## Source Lookup

When blocked, inspect these framework files before guessing:

- `packages/common/core/README.md`
- `packages/common/core/AGENTS.md`
- `packages/common/core/src/index.ts`
- `packages/common/core/src/abstractions/*`
- `packages/common/core/src/models/base.request.ts`
- `packages/common/core/src/models/base.response.ts`
- `packages/common/core/src/models/paginations/*`
- `packages/common/core/src/client/abstract-client.service.ts`
- `packages/common/core/src/infras/application.ts`
- `packages/common/core/src/modules/*`

## Runtime Bootstrap

Use the application bootstrap helpers from `@joktec/core` for gateway and microservice runtimes. Keep runtime behavior config-driven.

Best practice:

- Use `Application.bootstrap(AppModule)` instead of hand-rolling Nest bootstrap unless the consumer app has a specific runtime reason.
- Keep gateway-only behavior in gateway runtime modules and microservice-only behavior in micro runtime modules.
- Register framework modules through their dynamic module APIs when provided.
- Do not duplicate config parsing, logger setup, metrics setup, or process lifecycle hooks in consumer apps.

## CRUD Abstractions

- `BaseController` creates standard REST CRUD endpoints for DTO-backed resources.
- `BaseService` delegates repository operations through the shared repository contract.
- `ClientController` and `ClientService` provide generated microservice CRUD patterns.

Use BaseController/BaseService when the resource follows standard CRUD. Avoid them when the endpoint has domain-specific command semantics, multi-step transactions, or non-standard authorization that would make the generic abstraction obscure behavior.

Controller checklist:

- choose the DTO/entity class intentionally
- set `paginationMode` for the representative Swagger response shape
- use `customDto.paginationDto` only when the built-in page/offset/cursor response does not represent the API
- keep auth/guards/interceptors consistent with app conventions
- avoid putting business branching in controller methods when it belongs in the service

## Pagination

Request priority is cursor, then offset, then page. `BaseController.paginationMode` affects Swagger response shape; runtime selection remains request-driven unless the app service narrows it.

Best practice:

- Use page pagination for admin tables and simple back-office views.
- Use offset pagination for mobile-style load-more when the data set is moderate and stable enough.
- Use cursor pagination for feeds, timelines, frequently inserted lists, or large tables.
- Do not document cursor support for a resource unless the underlying repository package actually supports it.
- When using cursor mode, ensure the database layer has stable sort keys and tie-breakers.

## Client Lifecycle

Use `ClientConfig`, `AbstractClientService`, and `conId` when building or consuming packages that support multiple client connections.

Client package checklist:

- config class validates all required runtime options
- service startup fails clearly when the native client cannot initialize
- shutdown closes native connections only when initialized
- `conId` is preserved through service/repository calls
- logs do not leak credentials or full connection strings
- retries and debug behavior are config-driven

## Do Not

- Do not import concrete package or app code into `@joktec/core`.
- Do not bypass shared pagination contracts with ad-hoc response shapes for standard CRUD.
- Do not add new public symbols without exporting them through `src/index.ts`.
- Do not silently swallow bootstrap/client initialization failures.

### references/utils-cron.md

# Utils And Cron Usage

## Utils

Use `@joktec/utils` for common generators, validators, converters, hashing helpers, constants, and class-validator/class-transformer exports.

Prefer package helpers over app-local reimplementation when behavior should stay consistent across services.

Source lookup:

- `packages/common/utils/README.md`
- `packages/common/utils/src/index.ts`
- `packages/common/utils/src/helpers/*`
- `packages/common/utils/src/validators/*`
- `packages/common/utils/src/constants/*`

Best practice:

- Use shared validators from `@joktec/utils` when building schema-first entity/schema decorators.
- Use shared generators for IDs, tokens, random values, and hashes when consistency matters.
- Keep utility usage deterministic in tests; mock time/randomness where needed.
- Do not add framework-level dependencies to `utils`.

## Cron

Use `@joktec/cron` when a consumer app needs scheduled jobs, job worker contracts, or decorator-driven cron registration.

Keep job business logic in the consumer app. The package provides scheduling abstractions, not domain behavior.

Source lookup:

- `packages/common/cron/README.md`
- `packages/common/cron/src/index.ts`
- cron decorators, models, scheduler services, and worker contracts under `src/`

Best practice:

- Keep job names, schedules, concurrency, and retry behavior visible in the consumer app.
- Make cron handlers idempotent.
- Avoid enabling the same cron owner in multiple processes unless the package/app has explicit locking semantics.
- Treat cron runtime as infrastructure orchestration; domain writes still belong in app services/repositories.

## Types

Use `@joktec/types` when a consumer workflow needs generated JokTec package config schema/type artifacts. Treat the framework repository as source-of-truth for the generated schema shape.

---

## JokTec Mongo Skill

Use this skill for MongoDB-backed resources that rely on JokTec's Mongoose/Typegoose wrapper.

## Rules

- Register app schema classes through `MongoModule.forRoot(...)`.
- Keep schema classes, app repositories, and app-specific queries in the consumer app.
- Extend `MongoRepo<T, ID>` for app repositories.
- Preserve `conId` when the app has multiple Mongo connections.
- Use schema-first decorators when a schema class should be reused as a DTO source.
- Treat ObjectId casting and regex behavior as safety-sensitive.
- If guidance is insufficient, read this skill's references and inspect `../joktec-framework` package source or GitHub fallback before assuming APIs.

## References

- Read `references/repository.md` for `MongoService`, `MongoRepo`, query parsing, and cursor pagination.
- Read `references/schema-and-plugins.md` for decorators, paranoid soft delete, strict references, transform behavior, and debug output.

## Bundled References

### references/repository.md

# Mongo Repository Usage

## Source Lookup

When blocked, inspect:

- `packages/databases/mongo/README.md`
- `packages/databases/mongo/AGENTS.md`
- `packages/databases/mongo/src/index.ts`
- `packages/databases/mongo/src/mongo.module.ts`
- `packages/databases/mongo/src/mongo.service.ts`
- `packages/databases/mongo/src/mongo.repo.ts`
- `packages/databases/mongo/src/helpers/mongo.helper.ts`
- `packages/databases/mongo/src/helpers/mongo.pipeline.ts`
- `packages/databases/mongo/src/helpers/mongo.utils.ts`
- `packages/databases/mongo/src/models/*`

## Module Setup

Register schemas with `MongoModule.forRoot({ conId, models: [...] })`. Use the same `conId` in app repositories when using non-default connections.

Best practice:

- Register app schema classes in the consumer app repository module.
- Use one owner process for index creation in multi-process deployments.
- Preserve `conId` through service/repo constructors for multi-connection apps.
- Do not rely on the global mongoose model registry when `MongoService` provides connection-aware resolution.

## Repository Pattern

Extend `MongoRepo` and pass the schema class to the base constructor. Services can then use `BaseService` from `@joktec/core`.

Repository checklist:

- Keep schema-specific query helpers in the app repository, not in controllers.
- Use repository methods for standard reads so query parsing, soft delete, populate, and pagination stay consistent.
- Pass transaction/session options through read-modify-write flows when the app uses transactions.
- Normalize returned documents through repository/service response paths so ObjectId values do not leak unexpectedly into DTOs.

## Query Safety

- Root `id` can act as an API alias for `_id` in query conditions.
- ObjectId casting should be schema-aware and limited to `_id`, ObjectId paths, or explicitly configured paths.
- `$like`, `$begin`, and `$end` escape regex input by default.
- Do not rely on broad conversion when storing raw snapshots, maps, or nested subdocuments.

Anti-patterns:

- Do not convert every nested `id` key into `_id`; only API-facing query aliases should be converted.
- Do not cast every 24-character hex string into ObjectId; fields like `externalId`, `code`, and `slug` may be strings.
- Do not inject soft-delete conditions into unknown nested aggregate branches unless the target collection is known.

## Pagination

`MongoRepo.paginate` supports page, offset, and cursor responses. Cursor mode defaults to `_id`; custom `cursorKey` appends `_id` as a tie-breaker.

Cursor checklist:

- Use `_id` for default Mongo cursor ordering.
- Use `createdAt` or another indexed stable key when the product requires chronological cursor behavior.
- Append `_id` as a tie-breaker for non-unique cursor keys.
- Fetch `limit + 1` records and generate `nextCursor` only when another page exists.
- Treat cursor tokens as opaque; clients should not parse them.

### references/schema-and-plugins.md

# Mongo Schema And Plugins

## Source Lookup

When blocked, inspect:

- `packages/databases/mongo/src/decorators/scheme.decorator.ts`
- `packages/databases/mongo/src/decorators/prop.decorator.ts`
- `packages/databases/mongo/src/decorators/props/*`
- `packages/databases/mongo/src/models/mongo.schema.ts`
- `packages/databases/mongo/src/plugins/paranoid.plugin.ts`
- `packages/databases/mongo/src/plugins/strict-reference.plugin.ts`
- `packages/databases/mongo/src/plugins/transform.plugin.ts`

## Schema Decorators

Use `@Schema` and `@Prop` wrappers from `@joktec/mongo` for Typegoose schema metadata plus validation, transform, and Swagger metadata.

Avoid mutating shared option objects across multiple properties.

Best practice:

- Use schema-first decorators when the schema should be reused by DTO mapped types.
- Keep raw `@prop` or raw Mongoose decorators only when the wrapper cannot express the behavior.
- Pass custom validators/transforms explicitly rather than adding hidden global behavior.
- Keep maps, snapshots, and dynamic objects explicit so helper conversion does not alter their shape.
- Keep app-level reference semantics visible; strict reference plugin checks existence, but the app still owns domain rules.

## Plugins

- Paranoid plugin handles soft delete filtering and must respect aggregate first-stage constraints such as `$geoNear`.
- Strict reference plugin validates referenced documents and must resolve models through the active connection.
- Transform plugin centralizes common document transformation and should not break Mongo update operators.

Plugin checklist:

- Paranoid aggregate injection must not come before `$geoNear`.
- Strict reference checks must be connection-aware in multi-connection apps.
- Transform behavior must preserve update operators such as `$set`, `$inc`, `$push`, and `$addToSet`.
- Do not treat plugins as a replacement for app authorization or domain validation.

## Debug Output

Use `mongoDebug(collection, method, ...args)` when a Mongoose debug callback should be rendered as a Mongo shell-friendly command.

Debug output is for developer diagnostics. Do not log credentials or sensitive document payloads in production logs.

---

## JokTec MySQL Skill

Use this skill for relational resources backed by JokTec's TypeORM wrapper.

## Rules

- Register app entities through `MysqlModule.forRoot(...)`.
- Keep entities, app repositories, and app-specific SQL in the consumer app.
- Extend `MysqlRepo<T, ID>` for app repositories.
- Treat `mysql`, `mariadb`, and `postgres` as the first-class dialects.
- Keep `sync` explicit and normally enabled only by an owner process or development bootstrap.
- Do not add new behavior to deprecated `MysqlFinder`; use `MysqlRepo.qb()` and `MysqlHelper` paths.
- When migrating an entity to the new schema-first decorators, migrate the whole property decorator stack, not only the TypeORM primary key decorator.
- If guidance is insufficient, read this skill's references and inspect `../joktec-framework` package source or GitHub fallback before assuming APIs.

## References

- Read `references/repository.md` for connection lifecycle, repository usage, query safety, transaction, and cursor behavior.
- Read `references/entities.md` for `@Tables`, `@Column`, `@PrimaryColumn`, uuidv7, dialect guidance, and legacy decorator migration rules.

## Bundled References

### references/entities.md

# MySQL Entity Decorators

## Source Lookup

When blocked, inspect:

- `packages/databases/mysql/src/decorators/table.decorator.ts`
- `packages/databases/mysql/src/decorators/column.decorator.ts`
- `packages/databases/mysql/src/decorators/columns/column.type.ts`
- `packages/databases/mysql/src/decorators/columns/column.factory.ts`
- `packages/databases/mysql/src/decorators/columns/primary.column.ts`
- `packages/databases/mysql/src/decorators/columns/string.column.ts`
- `packages/databases/mysql/src/decorators/columns/number.column.ts`
- `packages/databases/mysql/src/decorators/columns/transform.column.ts`
- `packages/databases/mysql/src/decorators/columns/swagger.column.ts`

## Schema-First Entity Pattern

Use `@Tables`, `@Column`, and `@PrimaryColumn` from `@joktec/mysql` when an entity should also act as the source class for mapped DTOs.

The new decorators are not thin TypeORM aliases. They are schema-first wrappers that compose:

- TypeORM column/primary column metadata.
- `class-validator` behavior through `@joktec/utils` validators.
- `class-transformer` expose/exclude behavior.
- Swagger property metadata.

When migrating old entities, remove duplicate property decorators from `typeorm`, `class-validator`, `class-transformer`, and Swagger when the wrapper option can represent the same behavior.

## Legacy Decorator Migration

Migrate a whole property at a time. Do not only replace `PrimaryGeneratedColumn`.

Common mappings:

| Legacy decorators | New decorator shape |
| --- | --- |
| `@PrimaryGeneratedColumn()` | `@PrimaryColumn('increment')` |
| `@PrimaryGeneratedColumn('uuid')` | `@PrimaryColumn('uuid')` |
| app-generated ordered UUID id | `@PrimaryColumn('uuidv7')` |
| `@Column(...)` | `@Column(...)` from `@joktec/mysql` |
| `@IsNotEmpty()` | `@Column({ required: true })` |
| `@IsOptional()` | `@Column({ required: false })` or nullable TypeORM option when storage allows null |
| `@IsEmail()` | `@Column({ isEmail: true })` |
| `@IsMobilePhone()` | `@Column({ isPhone: true })` |
| `@IsHexColor()` | `@Column({ isHexColor: true })` |
| `@IsUrl()` | `@Column({ isUrl: true })` |
| `@MinLength(n)` | `@Column({ minLength: n })` |
| `@MaxLength(n)` | `@Column({ maxLength: n })` |
| `@Min(n)` | `@Column({ min: n })` |
| `@Max(n)` | `@Column({ max: n })` |
| `@Expose()` | default behavior of `@Column(...)` |
| `@Expose({ groups })` | `@Column({ groups })` |
| `@Exclude({ toPlainOnly: true })` plus hidden Swagger | `@Column({ hidden: true })` |
| `@ApiProperty(...)` | `@Column({ swagger: ... })`, or native options such as `example`, `comment`, `deprecated`, `min`, `max`, `minLength`, `maxLength` |

Preserve decorators only when the wrapper cannot express them, by passing them through `decorators: [...]`.

Migration checklist:

- Replace TypeORM column decorators with wrappers from `@joktec/mysql`.
- Remove duplicate `class-validator` decorators when equivalent wrapper options exist.
- Remove duplicate `class-transformer` decorators when `hidden` or `groups` expresses the same behavior.
- Move Swagger examples/descriptions/limits into wrapper options where possible.
- Preserve custom validators/transforms only through `decorators: [...]`.
- Keep database-specific options such as `type`, `length`, `nullable`, `unique`, `default`, `enum`, and `comment`.
- Rebuild and run entity-related tests after migration because DTO metadata and TypeORM metadata both change.

Example migration:

```ts
// Before
@Column({ type: 'varchar', length: 255 })
@IsEmail()
@IsNotEmpty()
@Expose()
@ApiProperty({ example: 'user@example.com' })
email!: string;

// After
@Column('varchar', {
  length: 255,
  required: true,
  isEmail: true,
  example: 'user@example.com',
})
email!: string;
```

For hidden fields:

```ts
// Before
@Column({ type: 'varchar', length: 255 })
@Exclude({ toPlainOnly: true })
@ApiHideProperty()
password!: string;

// After
@Column('varchar', { length: 255, hidden: true })
password!: string;
```

## Primary Keys

- Prefer numeric auto-increment keys for write-heavy MySQL tables.
- Use UUIDs when the app needs globally unique or public identifiers.
- Prefer `uuidv7` over random UUIDs when the id participates in ordered indexes or cursor-like access.
- When switching from UUID v4 to uuidv7, verify downstream code does not assume random UUID ordering.

Do not blindly convert every primary key to uuidv7. Keep numeric increment keys when the table is internal, write-heavy, and does not need public/global identifiers.

## Dialects

The stable dialects are MySQL, MariaDB, and Postgres. Dialect capabilities own differences such as `LIKE` vs `ILIKE`, array support, fulltext support, and generated map reliability.

### references/repository.md

# MySQL Repository Usage

## Source Lookup

When blocked, inspect:

- `packages/databases/mysql/README.md`
- `packages/databases/mysql/AGENTS.md`
- `packages/databases/mysql/src/index.ts`
- `packages/databases/mysql/src/mysql.module.ts`
- `packages/databases/mysql/src/mysql.service.ts`
- `packages/databases/mysql/src/mysql.repo.ts`
- `packages/databases/mysql/src/helpers/mysql.helper.ts`
- `packages/databases/mysql/src/helpers/mysql.finder.ts`
- `packages/databases/mysql/src/services/mysql.dialect.ts`
- `packages/databases/mysql/src/models/*`

## Module Setup

Register entities with `MysqlModule.forRoot({ conId, models: [...] })`. Use `conId` for multiple DataSources.

Best practice:

- Register consumer app entities in an app repository module.
- Keep `sync` disabled in request-facing processes unless the app intentionally owns schema sync.
- Use one controlled owner process for schema sync/migration in multi-process deployments.
- Preserve `conId` when resolving repositories or transaction-scoped managers.

## Repository Pattern

Extend `MysqlRepo` and pass the entity class to the base constructor. Services can use `BaseService` when CRUD behavior follows the shared contract.

Repository checklist:

- Keep entity-specific SQL helpers in the app repository, not in controllers.
- Use `MysqlRepo.qb()` and repository methods for standard reads so field validation, relation loading, soft delete, and pagination stay consistent.
- Do not add new behavior to `MysqlFinder`; it is deprecated compatibility code.
- Keep read/write operations in the same transaction context when the app passes a manager or query runner.

## Query Safety

- Validate field paths against TypeORM metadata before interpolating SQL identifiers.
- Use parameter binding for values.
- Keep logical operators such as `$and` and `$or` grouped through QueryBuilder behavior.

Anti-patterns:

- Do not interpolate user-provided field names or relation names into SQL without TypeORM metadata validation.
- Do not assume MySQL-only syntax when the package supports MySQL, MariaDB, and Postgres.
- Do not use a relation/populate path unless it maps to entity metadata.

## Pagination

`MysqlRepo.paginate` supports page, offset, and cursor responses. Cursor mode defaults to `createdAt` plus primary key columns. Custom cursor keys must be mapped columns.

Cursor checklist:

- Use `createdAt + primary key` as the default stable cursor.
- Add primary keys as tie-breakers for non-unique cursor keys.
- Ensure cursor keys are indexed for hot list endpoints.
- Validate cursor payload shape before building SQL.
- Treat cursor tokens as opaque; clients should not parse them.

## Transactions

When using transaction-scoped operations, pass the manager or query runner through repository options so pre-read and write operations use the same context.

Transaction checklist:

- Use one manager/query runner for read-modify-write flows.
- Rollback tests should prove that both pre-read dependent writes and writes are transaction-scoped.
- Avoid mixing default repositories and transaction-scoped repositories in one operation.

---

## JokTec Broker Skill

Use this skill for message broker packages.

## Packages

- `@joktec/kafka`: Kafka client, decorators, loaders, metrics.
- `@joktec/rabbit`: RabbitMQ client, decorators, auto-binding, metrics.
- `@joktec/sqs`: AWS SQS/SNS queue and topic wrapper.
- `@joktec/redcast`: Redis-backed broker behavior.

## Rules

- Keep message business semantics in the consumer app.
- Use broker decorators for transport wiring, not for domain policy.
- Preserve config-driven client selection and `conId` when available.
- Keep topic, queue, and routing names explicit in app configuration or decorators.
- If guidance is insufficient, read this skill's references and inspect `../joktec-framework` package source or GitHub fallback before assuming APIs.

## Reference

Read `references/brokers.md` for setup and package-specific notes.

## Bundled References

### references/brokers.md

# Broker Usage

## Source Lookup

When blocked, inspect:

- `packages/brokers/README.md`
- `packages/brokers/AGENTS.md`
- `packages/brokers/<package>/README.md`
- `packages/brokers/<package>/src/index.ts`
- package decorators, loaders, config, and service files under `src/`

## Runtime Pattern

Broker services follow `AbstractClientService` lifecycle. Loader classes discover decorator metadata after module initialization. Apps define producers, consumers, and message semantics.

Use broker packages for transport wiring, not for business workflow ownership. The consuming app owns event names, payload contracts, idempotency, retry policy, dead-letter behavior, and handler semantics.

## Package Notes

- Kafka: check topic existence and broker advertised listeners in local development.
- RabbitMQ: use module options and decorators for exchanges, queues, and bindings.
- SQS: local ElasticMQ-style environments may require queues to exist before consumers start.
- Redcast: use Redis-backed list, stream, or pub/sub behavior when a lightweight broker is enough.

## Best Practices

- Start consumers only in processes that should own subscriptions.
- Keep producer and consumer payload DTOs versionable and explicit.
- Use config paths or module options for topic/queue names when supported.
- Make handlers idempotent; brokers may redeliver.
- Add observable effects for consumer tests rather than asserting log text.
- Keep broker health/preflight checks separate from business request handling.
- In local stacks, verify broker-specific infrastructure: Kafka topics, Rabbit exchanges/queues, SQS queues, Redis password/db.

## Anti-Patterns

- Do not hide domain workflows inside decorators or broker package services.
- Do not assume auto-create topic/queue behavior unless the package and local broker support it.
- Do not run the same consumer group/queue owner in every process by accident.
- Do not swallow message handling errors without retry/dead-letter visibility.

---

## JokTec Adapter Skill

Use this skill for pluggable external capability adapters.

## Packages

- `@joktec/cacher`: cache stores.
- `@joktec/mailer`: mail delivery.
- `@joktec/notifier`: push notifications.
- `@joktec/storage`: object storage and file metadata helpers.

## Rules

- Keep adapter services app-neutral.
- Use validated config and `conId` where supported.
- Keep secrets and credentials in app config or runtime environment, never in code.
- Prefer adapter services over direct SDK usage in app services.
- If guidance is insufficient, read this skill's references and inspect `../joktec-framework` package source or GitHub fallback before assuming APIs.

## Reference

Read `references/adapters.md` for setup and package-specific notes.

## Bundled References

### references/adapters.md

# Adapter Usage

## Source Lookup

When blocked, inspect:

- `packages/adapters/README.md`
- `packages/adapters/AGENTS.md`
- `packages/adapters/<package>/README.md`
- `packages/adapters/<package>/src/index.ts`
- package module/config/service files under `src/`

## Runtime Pattern

Adapters are global Nest modules. Services own native client creation and expose package-specific operations.

Most adapters follow `AbstractClientService`: config is validated, native clients are created by the service, `conId` selects the connection, and shutdown/retry/debug behavior should remain package-owned.

## Package Notes

- Cacher: choose local, Redis, or Memcached stores based on runtime config.
- Mailer: centralize mail transport configuration in the service that owns outbound email.
- Notifier: keep push provider configuration outside app business logic.
- Storage: keep storage metadata and object operations behind the adapter service.

## Best Practices

- Import adapter modules in the application layer, then inject services into domain services.
- Keep provider credentials, endpoints, bucket names, SMTP secrets, and push credentials in runtime config.
- Keep business payload composition in the consuming app. The adapter should send/cache/store, not decide product semantics.
- Use `conId` for multiple providers or tenants instead of creating ad-hoc service instances.
- Normalize provider errors at the package/app boundary so controllers do not branch on SDK-specific messages.
- Mock SDK clients in unit tests; run live provider checks only in explicit integration or consumer harness tests.

## Anti-Patterns

- Do not put email template business rules inside `@joktec/mailer`.
- Do not hardcode S3 buckets, Redis URLs, SMTP credentials, or notification tokens in source.
- Do not bypass adapter services by importing provider SDK clients directly throughout the app.
- Do not assume every adapter has identical method names; read each package README/source before calling.

---

## JokTec Extended Database Skill

Use this skill for database clients that are not Mongo or MySQL.

## Packages

- `@joktec/elastic`
- `@joktec/arango`
- `@joktec/bigquery`

## Rules

- Keep app-specific query semantics in the consumer app.
- Use package services for client lifecycle and connection config.
- Do not claim parity with Mongo/MySQL repository behavior unless the package implements it.
- Use package README and source as final truth before adding advanced behavior.
- If guidance is insufficient, read this skill's references and inspect `../joktec-framework` package source or GitHub fallback before assuming APIs.

## Reference

Read `references/extended-databases.md` for package boundaries and usage notes.

## Bundled References

### references/extended-databases.md

# Extended Database Usage

## Source Lookup

When blocked, inspect:

- `packages/databases/README.md`
- `packages/databases/AGENTS.md`
- `packages/databases/<package>/README.md`
- `packages/databases/<package>/src/index.ts`
- package config/module/service files under `src/`

## Package Boundaries

Extended database packages expose reusable clients and helpers for specific data systems. They should not contain consumer app schemas or business-specific query policy.

## Notes

- Elastic may depend on `@joktec/http` for HTTP-backed behavior.
- Arango and BigQuery are separate client packages; verify the README/source before assuming repository-like CRUD support.
- Use local package tests or consumer harnesses only when the target service stack is available.

## Best Practices

- Treat these packages as client wrappers unless source explicitly exposes a repository abstraction.
- Keep index names, dataset names, query templates, and domain-specific projections in the consumer app.
- Validate credentials and endpoints through config; never commit service account data.
- Keep retries, timeouts, and debug logging visible in config.
- Use provider-specific tests/mocks for package logic and live stack tests only when credentials/services are intentionally available.

## Anti-Patterns

- Do not apply MongoRepo/MysqlRepo assumptions to Elastic/Arango/BigQuery.
- Do not introduce app schemas or business query policy into reusable database clients.
- Do not claim support for a provider feature unless the package source or README shows it.

---

## JokTec Integration Skill

Use this skill for third-party integration packages.

## Packages

- `@joktec/firebase`: Firebase Admin SDK integration.
- `@joktec/gpt`: GPT/OpenAI-style client integration.

## Rules

- Keep credentials config-driven and never commit real credentials.
- Use package services instead of direct SDK initialization in app code.
- Preserve app-neutral service behavior; consumer apps own domain workflows.
- Verify current package README/source before relying on advanced provider features.
- If guidance is insufficient, read this skill's references and inspect `../joktec-framework` package source or GitHub fallback before assuming APIs.

## Reference

Read `references/integrations.md` for provider-specific notes.

## Bundled References

### references/integrations.md

# Integration Usage

## Source Lookup

When blocked, inspect:

- `packages/integrations/README.md`
- `packages/integrations/AGENTS.md`
- `packages/integrations/<package>/README.md`
- `packages/integrations/<package>/src/index.ts`
- package config/module/service files under `src/`

## Firebase

Use the integration module and service to initialize Firebase Admin clients from validated config. Keep credential files local or environment-provided.

Best practice:

- Keep service account JSON, private keys, and project credentials out of git.
- Prefer environment-specific config or ignored local credential files.
- Keep notification/user/storage/product semantics in the consumer app.
- Mock Firebase Admin SDK in package tests; use live credentials only in explicit integration environments.

## GPT

Use the integration package for reusable GPT client setup. Keep prompt/business policy in the consumer app, not in the generic package.

Best practice:

- Keep prompts, model choice policy, tool schemas, and product safety rules in the consumer app.
- Keep API keys in secret management or environment config.
- Verify current package completeness before relying on advanced APIs; `@joktec/gpt` may lag behind provider SDK changes.

## Anti-Patterns

- Do not commit real credential files.
- Do not encode product-specific prompts or notification logic into the reusable integration package.
- Do not assume provider SDK behavior without checking package source and provider docs when APIs are unstable.

---

## JokTec Tool Skill

Use this skill for reusable utility services.

## Packages

- `@joktec/http`: Axios-backed HTTP client wrapper.
- `@joktec/file`: file classification and local file helpers.
- `@joktec/alert`: alert delivery through Slack-compatible webhooks.

## Rules

- Keep tools app-neutral and reusable.
- Use config-driven clients instead of direct ad hoc setup in app code.
- Preserve retry, metrics, proxy, and upload behavior where the package exposes it.
- Keep alert tokens and webhook URLs in runtime config only.
- If guidance is insufficient, read this skill's references and inspect `../joktec-framework` package source or GitHub fallback before assuming APIs.

## Reference

Read `references/tools.md` for package-specific usage notes.

## Bundled References

### references/tools.md

# Tool Usage

## Source Lookup

When blocked, inspect:

- `packages/tools/README.md`
- `packages/tools/AGENTS.md`
- `packages/tools/<package>/README.md`
- `packages/tools/<package>/src/index.ts`
- package config/module/service/helper files under `src/`

## HTTP

Use `@joktec/http` for Axios-backed requests, uploads, proxy agent support, retry config, and metrics where exposed.

Best practice:

- Use the package service for outbound HTTP so retry/proxy/metrics behavior stays centralized.
- Keep external endpoint URLs and credentials in runtime config.
- Be careful with ESM/CommonJS import changes in HTTP/Axios ecosystem packages.
- Test request behavior with mocks unless the test is an explicit consumer integration scenario.

## File

Use `@joktec/file` for shared file helpers and classification behavior instead of duplicating local utility code.

Best practice:

- Keep filesystem paths and temporary directories environment-specific.
- Validate upload/file inputs before passing them into business workflows.
- Use package helpers for MIME/classification behavior when consistency matters across services.

## Alert

Use `@joktec/alert` for Slack-compatible webhook alerts. Keep webhook URLs and credentials out of source control.

Best practice:

- Treat alert messages as operational notifications, not business workflows.
- Do not leak secrets, tokens, connection strings, or personal data into alert payloads.
- `@joktec/alert` is present but less complete than core database/client packages; inspect source before depending on advanced behavior.

## Anti-Patterns

- Do not scatter raw Axios instances across the app when `@joktec/http` should own shared behavior.
- Do not commit webhook URLs or proxy credentials.
- Do not use tool packages as hidden places for app business rules.
