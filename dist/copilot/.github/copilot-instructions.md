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
- Use `BaseController` and `BaseService` for standard top-level CRUD flows before hand-writing repetitive controllers.
- Use `SubController` and `IBaseSubService` for parent-child HTTP resources such as `/articles/:articleId/comments`.
- Use `ClientController`/`ClientService` and `SubClientController`/`SubClientService` for private transport CRUD; nested commands use `Parent.Child.action`.
- Use page, offset, or cursor pagination contracts from core; let database packages execute storage-specific pagination.
- Use `AbstractClientService` patterns for client packages that need config, lifecycle, retry, and `conId`.
- Use `@joktec/utils` for shared helpers instead of duplicating conversion, validation, hashing, or UUID logic.
- In consumer projects, inspect `node_modules/@joktec/core` first when available. If package source is unavailable or insufficient, read package README/GitHub docs, then GitHub source before assuming APIs.

## References

- Read `references/core.md` for bootstrap, CRUD, pagination, and client lifecycle.
- Read `references/utils-cron.md` for utility helpers and cron usage.

## Bundled References

### references/core.md

# Common Core Usage

## Source Lookup

When blocked, inspect these framework files before guessing:

- consumer project `node_modules/@joktec/core` package source and README, if installed
- `packages/common/core/README.md`
- `packages/common/core/AGENTS.md`
- `packages/common/core/src/index.ts`
- `packages/common/core/src/abstractions/*`
- `packages/common/core/src/abstractions/base/*`
- `packages/common/core/src/abstractions/sub/*`
- `packages/common/core/src/abstractions/client/*`
- `packages/common/core/src/abstractions/sub-client/*`
- `packages/common/core/src/abstractions/shared/*`
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
- `SubController` creates nested REST CRUD endpoints for parent-child resources and delegates to `IBaseSubService`.
- `BaseService` delegates repository operations through the shared repository contract.
- `ClientController` and `ClientService` provide generated microservice CRUD patterns.
- `SubClientController` and `SubClientService` provide generated nested microservice CRUD patterns.

Use `BaseController`/`BaseService` when a top-level resource follows standard CRUD. Use `SubController`/`IBaseSubService` when a child resource is always scoped by a parent id, regardless of whether persistence is embedded, subdocument-backed, or relation-backed.

Avoid generic controllers when endpoint semantics are domain-specific, multi-step, or authorization-heavy enough that the abstraction hides important behavior.

Controller checklist:

- choose the DTO/entity class intentionally
- set `paginate.mode` for the representative Swagger response shape
- use `customDto.paginationDto` only when the built-in page/offset/cursor response does not represent the API
- keep auth/guards/interceptors consistent with app conventions
- avoid putting business branching in controller methods when it belongs in the service

Sub-resource checklist:

- set `parentDto` and `dto`
- override `parentParam` and `childParam` when route params are not `id` and `childId`
- keep embedded/subdocument/relation mutation rules inside the app service
- use `customDto.createDto` and `customDto.updatedDto` when create/update payloads are narrower than schema/entity classes
- choose one representative `paginate.mode` for Swagger while keeping runtime request-driven pagination available

Private transport checklist:

- top-level commands use `Entity.action`
- nested commands use `Parent.Child.action`, for example `Article.Comment.create`
- send create/update payloads as `{ dto }`; legacy `{ entity }` is supported for compatibility
- configure `customDto` on `ClientController` or `SubClientController` when private DTO payloads differ from schema/entity classes

## Pagination

Request priority is cursor, then offset, then page. `BaseController` reads `paginate.mode` for Swagger response shape; runtime selection remains request-driven unless the app service narrows it.

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
- For Mongo config, treat `params` as final query-style overrides after `options`; duplicate keys in `params` win over `options`.
- Enable `autoIndex` only in one schema/index owner process for a shared database; request-facing clusters should keep it disabled.
- Use `MongoService.getCoverage(...)` before depending on sessions, transactions, or Change Streams. Standalone MongoDB cannot use Change Streams.
- Use `MongoRepo.watch(...)` or `MongoService.watch(...)` for realtime MongoDB Change Streams. Do not confuse this with `MongoRepo.cursor(...)`, which only iterates query results.
- Use schema-first decorators when a schema class should be reused as a DTO source; wrappers should reduce repeated Typegoose, validator, transformer, and Swagger stacks.
- Use `RefId<T>` for stored reference id fields and `PopulatedRef<T>` for populated virtual fields.
- Use `@Schema({ kind: 'embedded' })` for value objects without `_id` or timestamps.
- Use `@Schema({ kind: 'subdocument' })` for embedded documents that need their own `_id` and timestamps.
- Use `@Prop({ enum: SomeEnum })` for enum fields; the wrapper infers string or number storage type, validation, and Swagger enum metadata unless `type` is explicitly provided.
- Use `@Prop({ kind: 'virtual', mode: 'getter' })` for computed getters that need expose/Swagger metadata without persistence.
- Use `@Prop({ ref: () => Target, foreignField, localField })` for populate-one virtuals when inferred defaults are enough.
- Use `@Prop({ type: () => [Target], ref: () => Target, foreignField, localField })` for populate-array virtuals.
- Use `@Prop({ kind: 'map', type: Object })` for map/snapshot payloads that must keep their raw shape.
- Treat ObjectId casting and regex behavior as safety-sensitive.
- For real migrations, inspect `node_modules/@joktec/mongo` first, then installed README or GitHub package docs, then GitHub source before assuming APIs.

## References

- Read `references/repository.md` for `MongoService`, `MongoRepo`, query parsing, cursor pagination, coverage checks, and Change Streams.
- Read `references/schema-and-plugins.md` for decorators, paranoid soft delete, strict references, transform behavior, and debug output.

## Bundled References

### references/repository.md

# Mongo Repository Usage

## Source Lookup

When blocked, inspect:

- Consumer project first: `node_modules/@joktec/mongo`.
- Installed docs next: `node_modules/@joktec/mongo/README.md`.
- GitHub docs next: `https://github.com/joktec/joktec-framework/tree/main/packages/databases/mongo`.
- GitHub source fallback:
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

## Connection Config

`@joktec/mongo` merges connection values in this order:

1. framework defaults
2. `mongo.options`
3. query-style `mongo.params`

When `params` and `options` contain the same MongoDB driver option, `params` wins.

```yaml
mongo:
  params: authSource=app_db&replicaSet=rs0&directConnection=true&connectTimeoutMS=20000
  options:
    authSource: admin
    connectTimeoutMS: 30000
    serverSelectionTimeoutMS: 5000
```

The final config uses `authSource=app_db` and `connectTimeoutMS=20000`, while preserving `serverSelectionTimeoutMS=5000`.

`autoIndex` should be enabled only in a single schema/index owner process. The package checks index drift with `diffIndexes()` and runs `syncIndexes({ continueOnError: true })` when needed. Sync errors are logged with connection/schema context. Request-facing clusters should keep `autoIndex` disabled.

## Repository Pattern

Extend `MongoRepo` and pass the schema class to the base constructor. Services can then use `BaseService` from `@joktec/core`.

Repository checklist:

- Keep schema-specific query helpers in the app repository, not in controllers.
- Use repository methods for standard reads so query parsing, soft delete, populate, and pagination stay consistent.
- Pass transaction/session options through read-modify-write flows when the app uses transactions.
- Repository read paths should return schema class instances with normalized ObjectId/string values, including populated and deep-populated values.
- Code that needs raw Mongoose documents should use `MongoService.getModel(...)` or Typegoose/Mongoose APIs directly.

## Coverage, Transactions, and Change Streams

Use `MongoService.getCoverage(conId?)` before depending on topology-sensitive features. Coverage reports MongoDB version, Mongoose version, Typegoose version, topology, session support, transaction support, Change Stream support, and reasons for unavailable features.

`MongoService.startTransaction(...)`, `MongoService.watch(...)`, and `MongoRepo.watch(...)` fail fast through coverage checks. Standalone MongoDB cannot use Change Streams; replica set or sharded topology is required.

Use `MongoRepo.watch(...)` for model-level realtime listening:

```ts
const coverage = await mongoService.getCoverage();

if (coverage.canUseStream) {
  const stream = await articleRepo.watch([{ $match: { operationType: 'insert' } }]);
  stream.on('change', change => {
    // handle realtime insert/update/delete event
  });
}
```

Use `MongoService.watch(...)` for database-level Change Streams. Use `MongoRepo.cursor(...)` only for iterating large query results; it is not a realtime listener.

Consumer apps that must run on standalone MongoDB should implement an explicit polling fallback, usually by querying `createdAt` or `_id` periodically.

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

- Consumer project first: `node_modules/@joktec/mongo`.
- Package docs next: `node_modules/@joktec/mongo/README.md`.
- GitHub docs next: `https://github.com/joktec/joktec-framework/tree/main/packages/databases/mongo`.
- GitHub source fallback:
  - `packages/databases/mongo/src/decorators/schema.decorator.ts`
  - `packages/databases/mongo/src/decorators/schema.options.ts`
  - `packages/databases/mongo/src/decorators/prop.decorator.ts`
  - `packages/databases/mongo/src/decorators/props/*`
  - `packages/databases/mongo/src/models/mongo.ref.ts`
  - `packages/databases/mongo/src/models/object-id.ts`
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
- Use `RefId<T>` for persisted id fields and `PopulatedRef<T>` for populated virtual instance fields.
- Use lazy `type` resolvers such as `type: () => User` or `type: () => [User]` when the wrapper cannot infer the runtime class.
- Use `@Schema({ kind: 'embedded' })` for value objects without `_id` or timestamps.
- Use `@Schema({ kind: 'subdocument' })` for embedded documents that need `_id` and timestamps but should not create a collection.
- Use `@Prop({ enum: SomeEnum })` for enum fields; the wrapper infers string or number storage type, validation, and Swagger enum metadata unless `type` is explicitly provided.
- Use `@Prop({ kind: 'virtual', mode: 'getter', comment, optional, hidden, expose, swagger })` for computed getters that only need class-transformer and Swagger metadata.
- Use `@Prop({ ref: () => User, foreignField, localField })` for populate-one virtuals when inferred defaults are enough.
- Use `@Prop({ type: () => [User], ref: () => User, foreignField, localField })` for populate-array virtuals.
- Use `@Prop({ kind: 'map', type: Object })` for raw maps/snapshots instead of passing `PropType.MAP` at the call site.

Common mappings:

| Use case | Preferred shape |
| --- | --- |
| Stored single reference id | `fieldId?: RefId<User>` with `@Prop({ type: ObjectId, ref: () => User })` |
| Stored reference id array | `fieldIds?: RefId<User>[]` with `@Prop({ type: [ObjectId], ref: () => User })` |
| Embedded value object | `@Schema({ kind: 'embedded' })` on the nested class |
| Embedded document | `@Schema({ kind: 'subdocument' })` on the nested class |
| Raw map/snapshot | `@Prop({ kind: 'map', type: Object })` |
| Populated single virtual | `field?: PopulatedRef<User>` with `@Prop({ ref: () => User, foreignField: '_id', localField: 'fieldId' })` |
| Populated virtual array | `fields?: PopulatedRef<User>[]` with `@Prop({ type: () => [User], ref: () => User, foreignField: '_id', localField: 'fieldIds' })` |
| Computed getter | `@Prop({ kind: 'virtual', mode: 'getter', comment: '...' }) get value() { ... }` |

Populate inference:

- `ref` + `localField` + `foreignField` marks the field as virtual populate.
- Populate-one can fallback to the same class from `ref`.
- Populate arrays still need `type: () => [Target]` because runtime reflection only sees `Array`.
- `justOne` defaults to `true` for non-array populate fields.
- Swagger examples default to `{}` or `[]` for populated fields unless explicitly overridden.

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
- Use schema-first `@Column`, `@PrimaryColumn`, and `@TimestampColumn` wrappers when an entity also acts as DTO metadata.
- Use `@Column({ enum: SomeEnum })` for enum columns; the wrapper infers enum column type, validation, and Swagger enum metadata unless `type` is explicitly overridden.
- Use `@Column({ kind: 'virtual' })` for computed getters that need expose/Swagger metadata without persistence.
- Use `immutable` for API read-only metadata; TypeORM `update: false` remains storage write behavior and is also inferred as Swagger read-only when `immutable` is not set.
- Do not add `swagger.type` just because a column has a primitive, date, array, nested JSON class, or relation type. The wrapper infers Swagger metadata from TypeScript design type and JokTec options. Use `swagger` only to override an inferred shape.
- Do not use `@joktec/mysql` for Mongo/ObjectId columns, even though TypeORM has Mongo-related APIs.
- For real migrations, inspect the installed `@joktec/mysql` source in the consumer project's `node_modules` first. If that is insufficient, read GitHub package docs, then GitHub source. Use the local `../joktec-framework` checkout only when you are working inside the JokTec development workspace.

## References

- Read `references/repository.md` for connection lifecycle, repository usage, query safety, transaction, and cursor behavior.
- Read `references/entities.md` for `@Tables`, `@Column`, `@PrimaryColumn`, uuidv7, dialect guidance, and legacy decorator migration rules.

## Bundled References

### references/entities.md

# MySQL Entity Decorators

## Source Lookup

When blocked in a consumer project, inspect the installed package first:

- `node_modules/@joktec/mysql/README.md`
- `node_modules/@joktec/mysql/AGENTS.md` when published with the package
- `node_modules/@joktec/mysql/dist/index.d.ts`
- `node_modules/@joktec/mysql/dist/decorators/column.decorator.d.ts`
- `node_modules/@joktec/mysql/dist/decorators/columns/column.type.d.ts`
- `node_modules/@joktec/mysql/dist/decorators/timestamp.decorator.d.ts`

If the installed package is missing enough detail, use the GitHub package docs next:

- `https://github.com/joktec/joktec-framework/tree/main/packages/databases/mysql`

Use GitHub source only after package docs and installed types are not enough:

- `packages/databases/mysql/src/decorators/table.decorator.ts`
- `packages/databases/mysql/src/decorators/column.decorator.ts`
- `packages/databases/mysql/src/decorators/columns/column.type.ts`
- `packages/databases/mysql/src/decorators/columns/column.factory.ts`
- `packages/databases/mysql/src/decorators/columns/primary.column.ts`
- `packages/databases/mysql/src/decorators/columns/timestamp.column.ts`
- `packages/databases/mysql/src/decorators/columns/virtual.column.ts`
- `packages/databases/mysql/src/decorators/columns/object.column.ts`
- `packages/databases/mysql/src/decorators/columns/string.column.ts`
- `packages/databases/mysql/src/decorators/columns/number.column.ts`
- `packages/databases/mysql/src/decorators/columns/transform.column.ts`
- `packages/databases/mysql/src/decorators/columns/swagger.column.ts`

## Schema-First Entity Pattern

Use `@Tables`, `@Column`, `@PrimaryColumn`, and `@TimestampColumn` from `@joktec/mysql` when an entity should also act as the source class for mapped DTOs.

The new decorators are not thin TypeORM aliases. They are schema-first wrappers that compose:

- TypeORM column/primary column metadata.
- `class-validator` behavior through `@joktec/utils` validators.
- `class-transformer` expose/exclude behavior.
- Swagger property metadata.

The wrapper can also represent virtual computed getters and nested JSON/jsonb class payloads. Do not use this package for Mongo/ObjectId columns.

Wrapper philosophy:

- prefer one schema declaration that carries persistence, validation, transform, and Swagger metadata
- use wrapper options before duplicating `@ApiProperty`, `@Expose`, `@Type`, or common validators
- do not add `swagger.type` for normal scalar/date fields, arrays, nested JSON classes, or relations when the wrapper can infer the shape
- use `@Column({ enum: SomeEnum })` for enum columns; the wrapper infers enum column type, validation, and Swagger enum metadata unless `type` is explicitly overridden
- use raw TypeORM only for advanced cases that the wrapper does not model cleanly
- keep storage write behavior and API documentation behavior distinct when needed

## Current Decorator Capabilities

Use the package README and actual installed source for full migration details. This skill only keeps the common mappings that help an agent recognize old patterns.

Common mappings:

| Legacy decorators | New decorator shape |
| --- | --- |
| `@PrimaryGeneratedColumn()` | `@PrimaryColumn('increment')` |
| `@PrimaryGeneratedColumn('uuid')` | `@PrimaryColumn('uuid')` |
| app-generated ordered UUID id | `@PrimaryColumn('uuidv7')` |
| `@CreateDateColumn(...)` | `@TimestampColumn('create', ...)` |
| `@UpdateDateColumn(...)` | `@TimestampColumn('update', ...)` |
| `@DeleteDateColumn(...)` | `@TimestampColumn('delete', ...)` |
| TypeORM `@VersionColumn(...)` | `@Column({ kind: 'version', ... })` |
| TypeORM `@VirtualColumn(...)` | `@Column({ kind: 'virtual', mode: 'sql', query, ... })` |
| TypeORM `@ViewColumn(...)` | `@Column({ kind: 'view', ... })` |
| `@Column(...)` | `@Column(...)` from `@joktec/mysql` |
| `@RelationId(...)` | `@Column({ kind: 'relation-id', relationId })` |
| `@IsNotEmpty()` | `@Column({ required: true })` |
| `@IsOptional()` | `@Column({ required: false })` or nullable TypeORM option when storage allows null |
| `@IsEmail()` | `@Column({ isEmail: true })` |
| `@IsMobilePhone()` | `@Column({ isPhone: true })` |
| `@IsInt()` | `@Column({ isInt: true })` or an integer column type |
| `@IsUUID()` | `@Column({ isUUID: true })` |
| `@IsObject()` | `@Column({ isObject: true })` or a JSON column |
| `@IsHexColor()` | `@Column({ isHexColor: true })` |
| `@IsUrl()` | `@Column({ isUrl: true })` |
| `@MinLength(n)` | `@Column({ minLength: n })` |
| `@MaxLength(n)` | `@Column({ maxLength: n })` |
| `@Min(n)` | `@Column({ min: n })` |
| `@Max(n)` | `@Column({ max: n })` |
| `@Expose()` | default behavior of `@Column(...)` |
| `@Expose({ groups })` | `@Column({ groups })` |
| `@Exclude({ toPlainOnly: true })` plus hidden Swagger | `@Column({ hidden: true })` |
| `@ApiProperty(...)` | Prefer native options such as `example`, `comment`, `deprecated`, `min`, `max`, `minLength`, `maxLength`; use `swagger` only as an override |
| `@ValidateNested()` + `@Type(() => Preference)` | `@Column('jsonb', { nested: Preference })` |
| `@ValidateNested({ each: true })` + `@Type(() => Preference)` | `@Column('jsonb', { nested: Preference, each: true })` |
| `@Expose()` + `@ApiProperty(...)` on a getter | `@Column({ kind: 'virtual', ... })` |
| Swagger `readOnly: true` | `@Column({ immutable: true })` or TypeORM `update: false` when ORM updates must also be blocked |

## Swagger Metadata Rules

The `@Column` wrapper already composes Swagger metadata. During migrations, keep entity code small and avoid redundant `swagger` declarations:

- Do not add `swagger: { type: String }` for string columns.
- Do not add `swagger: { type: Number }` for numeric columns.
- Do not add `swagger: { type: Boolean }` for boolean columns.
- Do not add `swagger: { type: Date }` for date, datetime, or timestamp columns.
- Do not add `swagger: { type: String, isArray: true }` for `simple-array` or reflected array fields unless the OpenAPI shape must differ from the entity field.
- Do not add `swagger: { type: NestedClass }` when `nested: NestedClass` is already present.
- Do not add `swagger: { type: () => Entity }` on `Column({ kind: 'relation', type: () => Entity })`; the relation wrapper keeps the Swagger type lazy to avoid circular schema evaluation.

Use `swagger` only for actual overrides, for example:

- an OpenAPI primitive differs from the TypeScript property type, such as a SQL decimal represented as `string`
- a property needs `oneOf`, `anyOf`, `allOf`, custom `items`, or a deliberately shortened example
- a generated schema needs an explicit read/write/deprecated override that cannot be represented by wrapper options

If a relation wrapper still triggers a circular Swagger error in a consumer project, inspect `node_modules/@joktec/mysql/dist/decorators/column.decorator.d.ts` and the installed implementation first. Do not paper over the issue by adding `swagger.type` to every relation; identify whether the installed package version has lazy relation Swagger support.

## Read-Only Metadata

`immutable` is the API read-only hint used by the JokTec MySQL wrapper. TypeORM `update: false` is the ORM write behavior. The wrapper maps both to Swagger `readOnly` when appropriate:

- `immutable` has priority over `update: false`
- `update: false` implies Swagger `readOnly` only when `immutable` is not set
- `swagger.readOnly` remains the final explicit override

Some field kinds default to API read-only because they are system-managed or computed:

- primary keys
- timestamp columns
- version columns
- view columns
- virtual getter and SQL virtual columns
- relation-id columns
- tree level columns

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

When blocked in a consumer project, inspect installed package docs and types first:

- `node_modules/@joktec/mysql/README.md`
- `node_modules/@joktec/mysql/AGENTS.md` when published with the package
- `node_modules/@joktec/mysql/dist/index.d.ts`
- `node_modules/@joktec/mysql/dist/mysql.module.d.ts`
- `node_modules/@joktec/mysql/dist/mysql.service.d.ts`
- `node_modules/@joktec/mysql/dist/mysql.repo.d.ts`
- `node_modules/@joktec/mysql/dist/models/mysql.request.d.ts`

If the installed package is insufficient, read GitHub package docs next:

- `https://github.com/joktec/joktec-framework/tree/main/packages/databases/mysql`

Use GitHub source only after installed types and package docs are not enough:

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
- `HttpService.buildAgent(proxy, opts)` expects proxy identity in `HttpProxyConfig` and agent tuning in Node `AgentOptions`; inspect the installed source before adapting to proxy-agent major-version changes.
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

---

## Advanced TypeScript Design

## Overview

Act as a TypeScript architecture partner. Choose the simplest design that preserves clear boundaries, runtime correctness, and useful compile-time guarantees.

Use design patterns as vocabulary and pressure tests, not as decoration. Prefer local project conventions, readable APIs, and low-friction extension points before adding type-level machinery.

## Architectural Mindset

- Start from the domain boundary: identify entity, request/response, service, repository, client, decorator, loader, and integration responsibilities.
- Keep public APIs narrow and stable. Make extension explicit through interfaces, abstract classes, generic constraints, or composition.
- Use classes when lifecycle, inheritance hooks, decorators, or framework reflection matter. Use plain functions/types when behavior is stateless or purely transformational.
- Let runtime validation and compile-time types reinforce each other. Do not pretend TypeScript types validate untrusted runtime data.
- Do not assume TypeScript generics, interfaces, unions, or array element types exist at runtime through `reflect-metadata`.
- Escalate type complexity only when it removes real duplication, prevents invalid states, or makes an API substantially safer.
- Check existing code before inventing a new pattern; mirror the repository's style when it already solves the same class of problem.

## Public API Compatibility

- Treat exported types, classes, decorators, config objects, modules, and provider APIs as public contracts.
- Prefer additive changes over breaking renames, deleted fields, changed generic parameter order, or narrower accepted input shapes.
- Before changing exported generic types, check downstream inference from normal call sites and verify that common extension patterns still compile.
- If a breaking type or runtime contract change is unavoidable, report migration impact explicitly and include the smallest migration path.

## Pattern Vocabulary

Use the classic catalog as shared language, including the TypeScript examples catalog from Refactoring.Guru.

- Creational Patterns: Abstract Factory, Builder, Factory Method, Prototype, Singleton.
- Structural Patterns: Adapter, Bridge, Composite, Decorator, Facade, Flyweight, Proxy.
- Behavioral Patterns: Chain of Responsibility, Iterator, Memento, State, Template Method, Command, Mediator, Observer, Strategy, Visitor.

Treat pattern names as a starting point for design discussion. Validate whether the implementation needs the pattern's tradeoffs, or whether a direct function, data object, or interface is enough.

## Agent Workflow

1. Inspect local code first when working inside a repository. Look for existing abstractions, decorators, DTO types, factory functions, lifecycle hooks, and tests.
2. Classify the task:
   - Use `references/simple.md` for everyday TypeScript, OOP, data modeling, classes, interfaces, types, records, maps, arrays, simple decorators, and pragmatic refactors.
   - Use `references/advanced.md` for generic framework code, recursive mapped types, `infer`, distributed/deferred conditional types, reflection metadata, advanced decorators, type-safe builders, plugin architectures, or expert pattern selection.
3. Choose the least complex pattern that solves the force in front of you. Record why a simpler alternative was not enough when choosing advanced machinery.
4. Design the public surface before implementation: inputs, outputs, extension points, error behavior, lifecycle, and type inference experience.
5. Implement incrementally. Keep runtime behavior testable, and add focused type-level checks when exported generic or decorator behavior is subtle.
6. Review for overengineering: remove unused generic parameters, speculative base classes, unnecessary inheritance, and type utilities that do not protect a real API.

## Repository Signals

In JokTec-style TypeScript, expect patterns such as:

- Generic request/query types with recursive conditions and sort/populate typing.
- Factory functions that return decorated NestJS classes.
- Abstract services and clients with template methods for lifecycle-specific behavior.
- Decorator factories that compose validation, Swagger, transformation, metrics, and integration metadata.
- Loader/registry patterns that collect decorator metadata and wire runtime behavior during module initialization.

## Bundled References

### references/advanced.md

# Advanced TypeScript Design Guidance

Use this reference for framework-level TypeScript, generic libraries, decorator infrastructure, metadata-driven loaders, and APIs where compile-time inference is part of the product experience.

## Escalation Criteria

Reach for advanced TypeScript only when at least one is true:

- The API is reused widely and type inference prevents real misuse.
- The runtime model is already generic, recursive, or metadata-driven.
- The abstraction eliminates repeated boilerplate across many entities, DTOs, repositories, services, clients, or transports.
- The type-level design mirrors a stable domain contract, not a speculative future.
- Tests or examples can prove both runtime behavior and developer ergonomics.

If the advanced type exists only to feel clever, delete it.

## Infer, Conditional, and Deferred Types

- Use `infer` to extract return types, payloads, entity types, DTO shapes, tuple elements, and callback signatures from source contracts.
- Control distributive conditional types intentionally. Wrap operands in tuples, such as `[T] extends [U]`, when union distribution is not wanted.
- Prefer named intermediate aliases when nested conditionals exceed two branches.
- Use `never` as a filter, but verify that it cannot erase useful error information from public APIs.
- Treat deferred conditional types and generic inference as public UX: callers should get helpful autocomplete and errors without manual type arguments.

## Recursive and Mapped Types

- Use recursive mapped types for query languages, nested sort/select/populate APIs, deep partials, and entity graph traversal.
- Add clear stop conditions for primitives, dates, arrays, functions, and branded values.
- Use branded or opaque types for special primitives such as `ObjectId`, `UserId`, tenant IDs, cursors, or external reference IDs when plain strings would blur domain boundaries.
- Avoid infinite or overly expensive type recursion. Keep recursion shallow enough for editor performance.
- Preserve optionality and readonly modifiers intentionally with `+?`, `-?`, `readonly`, and `-readonly`.
- Separate query operator typing from entity typing so the operator model remains testable and reusable.

## Reflection and Decorators

- Use `reflect-metadata` only when runtime type information materially improves the API: schema generation, validation composition, serialization, dependency injection, or loader registration.
- Remember that reflected TypeScript types are lossy at runtime. Arrays, unions, generics, and interfaces need explicit options or factories.
- Prefer decorator factories that normalize options, resolve type factories, compose framework decorators, and define one clear metadata contract.
- Keep advanced decorators thin at the call site and explicit internally: clone options, sanitize runtime-only fields, then compose validators, transformers, docs, and persistence metadata.
- For method decorators, preserve `this`, return values, thrown errors, and async behavior unless the decorator explicitly changes them.
- Use function source parsing only as a last-resort runtime technique for decorator infrastructure, such as mapping method argument names. Keep it isolated, deterministic, and covered by tests because minification, transpilation, defaults, destructuring, and comments can break it.
- Test decorator behavior through a class that uses it, especially for metadata, wrapping behavior, and dependency injection.

## Type-Level Verification

- Add type-level tests when changing exported generic utilities, query DSLs, decorators, builders, or public inference-heavy APIs.
- Prefer the project's existing compile/type test setup. If available, use `tsd`, `expect-type`, `vitest`/`jest` type helpers, or a dedicated `tsc --noEmit` fixture.
- Include positive inference examples from normal call sites, not only explicit generic arguments.
- Include negative examples with `@ts-expect-error` when an invalid state must stay rejected.
- Verify runtime tests separately when decorators, reflection metadata, validation, transformation, or loaders are involved.

## Expert Pattern Selection

- Abstract Factory fits families of related clients, repositories, or transport adapters that must be created consistently.
- Builder fits fluent configuration with required-step guarantees; type-state builders can enforce completeness but should stay readable.
- Factory Method fits framework hooks that create DTOs, pagination wrappers, controllers, or provider instances.
- Prototype fits cloning configured objects when construction is expensive or stateful.
- Singleton should usually be delegated to the DI container; avoid hand-rolled global state.
- Adapter fits third-party client normalization and migration layers.
- Bridge fits separating abstraction from implementation, such as transport-agnostic messaging APIs over Rabbit, Kafka, or Redis.
- Composite fits tree-shaped filters, pipelines, menu/routes, or nested query conditions.
- Decorator fits metrics, retries, circuit breakers, serialization, validation, or publishing side effects around existing behavior.
- Facade fits a stable service hiding multiple low-level collaborators.
- Flyweight fits large repeated metadata or schema objects only after measuring memory pressure.
- Proxy fits lazy clients, caching, access control, retries, and remote boundaries.
- Chain of Responsibility fits validation, middleware, parsing, and request pipelines.
- Command fits queued work, replayable operations, and undoable actions.
- Iterator fits cursor pagination and collection traversal without exposing storage details.
- Mediator fits module coordination where direct dependencies would become tangled.
- Memento fits snapshots, rollbacks, and state restoration.
- Observer fits event streams and pub/sub, with explicit unsubscribe and error policy.
- State fits lifecycle-heavy clients, jobs, or connections with mode-specific behavior.
- Strategy fits interchangeable algorithms selected by config or runtime context.
- Template Method fits abstract base services/clients that own lifecycle while subclasses implement `init`, `start`, `stop`, `validate`, or `transform` steps.
- Visitor fits operations over stable object structures when adding new operations is more common than adding new node types.

## Symbolic Examples

Use examples like these as compact templates for thinking. Keep production implementations smaller or larger depending on the actual force.

### Type-Safe Event Map

```typescript
type EventMap = {
  "user.created": { id: string };
  "invoice.paid": { invoiceId: string; amount: number };
};

class EventBus<TEvents extends Record<string, unknown>> {
  on<K extends keyof TEvents>(event: K, handler: (payload: TEvents[K]) => void) {}
  emit<K extends keyof TEvents>(event: K, payload: TEvents[K]) {}
}

const bus = new EventBus<EventMap>();
bus.emit("invoice.paid", { invoiceId: "inv_1", amount: 100 });
```

Use this for Observer/Mediator-style APIs where event names and payloads must stay coupled.

### API Contract Inference

```typescript
type Endpoint = {
  "/users/:id": {
    GET: { params: { id: string }; response: User };
    PATCH: { params: { id: string }; body: Partial<User>; response: User };
  };
};

type ResponseOf<T> = T extends { response: infer R } ? R : never;

class ApiClient<TContract extends Record<string, any>> {
  request<Path extends keyof TContract, Method extends keyof TContract[Path]>(
    path: Path,
    method: Method,
  ): Promise<ResponseOf<TContract[Path][Method]>> {
    return null as any;
  }
}
```

Use this when a contract object should drive call-site inference.

### Type-State Builder

```typescript
type With<K extends string> = Record<K, true>;

class JobBuilder<State = {}> {
  queue(name: string): JobBuilder<State & With<"queue">> {
    return this as any;
  }

  handler(fn: () => Promise<void>): JobBuilder<State & With<"handler">> {
    return this as any;
  }

  build(this: State extends With<"queue"> & With<"handler"> ? JobBuilder<State> : never) {
    return {};
  }
}
```

Use this when incomplete configuration is common and worth rejecting at compile time.

### Recursive Query Shape

```typescript
type Primitive = string | number | boolean | Date;
type FieldOp<T> = T | { $eq?: T; $in?: T[] };
type Brand<T, Name extends string> = T & { readonly __brand: Name };
type ObjectId = Brand<string, "ObjectId">;

type Query<T> = {
  [K in keyof T]?: T[K] extends Primitive
    ? FieldOp<T[K]>
    : T[K] extends Array<infer U>
      ? Query<U>
      : Query<T[K]>;
} & {
  $or?: Query<T>[];
};
```

Use this for Composite-style nested filters, but add stop conditions before expanding it.

### Opaque ID Boundary

```typescript
type Brand<T, Name extends string> = T & { readonly __brand: Name };
type UserId = Brand<string, "UserId">;
type PostId = Brand<string, "PostId">;

function asUserId(value: string): UserId {
  return value as UserId;
}

function findUser(id: UserId) {}

findUser(asUserId("u_1"));
// @ts-expect-error raw strings are not accepted here
findUser("u_1");
```

Use this when a domain primitive crosses many generic/query layers and accidental mixing would be costly.

### Decorator Wrapper with Preserved Method Contract

```typescript
function Around(run: (next: () => unknown) => unknown): MethodDecorator {
  return (_, __, descriptor) => {
    const original = descriptor.value;

    descriptor.value = function (...args: unknown[]) {
      return run(() => original.apply(this, args));
    };
  };
}
```

Use this for metrics, retry, logging, or publishing side effects; preserve `this`, args, return values, and thrown errors.

## JokTec-Style Signals to Reuse

- Recursive query typing can combine entity properties with operator unions, nested entity traversal, and logical `$or`/`$and` shapes.
- Base services and clients commonly use Template Method: the base class owns lifecycle and shared behavior while subclasses provide specific implementation steps.
- Controller factories can return decorated classes to avoid repetitive NestJS endpoint scaffolding while preserving DTO-specific metadata.
- Decorator infrastructure often composes Swagger, validation, transformation, persistence, and metric behavior from one options object.
- Rabbit loaders show a metadata registry plus module-init loader pattern: decorators declare intent; loaders resolve providers and connect runtime consumers.

## Advanced Review Checklist

- Does every generic parameter appear in the public contract or implementation?
- Can inference succeed from normal call-site arguments?
- Does the type-level model match runtime validation and transformation?
- Are metadata keys centralized and collision-resistant?
- Are decorator side effects documented by tests?
- Is editor performance acceptable after adding recursive or conditional types?
- Is there a simpler Strategy, Adapter, or function-based design that would provide the same value?

### references/simple.md

# Simple TypeScript Design Guidance

Use this reference for ordinary application and library work where readability, stable APIs, and maintainable TypeScript matter more than type-level cleverness.

## Default Practices

- Prefer explicit, small interfaces for public boundaries and concrete classes for runtime behavior with lifecycle, dependency injection, or decorators.
- Use `type` for unions, mapped shapes, conditional aliases, and composition. Use `interface` for object contracts intended to be implemented or extended.
- Keep primitive aliases meaningful. A `UserId` alias can clarify intent, but it does not add runtime safety unless paired with validation or branding.
- Model data with plain objects when behavior is absent. Add classes when construction, methods, inheritance hooks, decorators, or framework reflection are required.
- Keep DTOs, entities, requests, and responses separate when they have different validation, persistence, or transport concerns.
- Avoid `any` at public boundaries. Use `unknown` for untrusted data, then narrow or validate it.
- Prefer narrow generic constraints such as `T extends Entity` over unconstrained `T` when the implementation depends on object semantics.

## Classes, Interfaces, and OOP

- Use abstract classes for shared runtime behavior, protected hooks, and constructor-injected dependencies.
- Use interfaces for contracts that should not carry runtime behavior.
- Prefer composition over inheritance when variants differ by collaborator rather than lifecycle.
- Keep protected hooks purposeful: `afterInit`, `transform`, `validate`, and `map` are good when subclasses are expected to customize one stable step.
- Avoid deep inheritance chains. If a third level appears, consider Strategy, Adapter, or composition.

## Common Data Structures

- Use `Record<K, V>` when the key set is known or constrained.
- Use `{ [key: string]: V }` when the object is truly open-ended.
- Use `Map<K, V>` when keys are not strings, insertion order matters, or frequent add/remove operations are central.
- Use arrays for ordered collections and tuples for fixed positional contracts.
- Use discriminated unions for state or command variants instead of loose booleans.
- Keep hash-like caches private unless callers need iteration, eviction, or explicit lifecycle.

## Basic Types and Utilities

- Use union literals for finite options: status, mode, operation, direction.
- Use `Pick`, `Omit`, `Partial`, `Required`, `Readonly`, `Record`, `Extract`, and `Exclude` before writing custom utilities.
- Use `keyof` and indexed access types for property-safe APIs.
- Use overloads sparingly; prefer a single options object when overloads become hard to read.
- Keep mapped types shallow unless the data is truly nested and the API benefits from deep transformation.

## Simple Decorators

- Use decorator factories to attach framework metadata or compose existing decorators.
- Keep decorator options serializable and explicit where possible.
- Separate metadata collection from runtime execution. A decorator should usually register intent; a loader/service should execute it later.
- Avoid parsing function source in ordinary decorators. If runtime argument-name mapping truly requires it, escalate to `advanced.md` and isolate the parser behind tests.
- Test decorators at the behavior boundary, not only by checking metadata keys.

## Pattern Choices

- Use Factory Method or simple factory functions when object creation varies by type or config.
- Use Builder for stepwise configuration only when partially built objects are common or order matters.
- Use Adapter to normalize third-party APIs behind project interfaces.
- Use Facade to simplify a noisy subsystem for callers.
- Use Decorator when behavior should wrap a method/object without changing its public contract.
- Use Template Method when a base class owns an algorithm and subclasses fill in specific steps.
- Use Strategy when an algorithm family changes independently from the caller.
- Use Observer or Mediator for event-style communication, but keep ownership and error handling explicit.

## Symbolic Examples

Use examples like these to reason about shape and tradeoffs. Keep final code adapted to the repository style.

### Strategy with a Narrow Interface

```typescript
interface PriceStrategy {
  total(items: CartItem[]): number;
}

class RetailPrice implements PriceStrategy {
  total(items: CartItem[]) {
    return items.reduce((sum, item) => sum + item.price, 0);
  }
}

class WholesalePrice implements PriceStrategy {
  total(items: CartItem[]) {
    return items.reduce((sum, item) => sum + item.price * 0.9, 0);
  }
}

class CheckoutService {
  constructor(private readonly strategy: PriceStrategy) {}

  quote(items: CartItem[]) {
    return this.strategy.total(items);
  }
}
```

Use this when the caller should not know which algorithm is active.

### Adapter for Third-Party Boundaries

```typescript
interface MessageBus {
  publish(topic: string, payload: unknown): Promise<void>;
}

class RabbitBusAdapter implements MessageBus {
  constructor(private readonly rabbit: RabbitClient) {}

  publish(topic: string, payload: unknown) {
    return this.rabbit.sendToQueue(topic, JSON.stringify(payload));
  }
}
```

Use this when external clients have noisy or unstable APIs.

### Template Method for Lifecycle Hooks

```typescript
abstract class ManagedClient<TConfig, TClient> {
  async connect(config: TConfig) {
    const client = await this.create(config);
    await this.start(client);
    return client;
  }

  protected abstract create(config: TConfig): Promise<TClient>;
  protected abstract start(client: TClient): Promise<void>;
}
```

Use this when the base class owns lifecycle order and subclasses fill the variable steps.

### Simple Decorator Metadata

```typescript
const HANDLER_KEY = "app:handler";

function Handler(name: string): MethodDecorator {
  return (_, __, descriptor) => {
    Reflect.defineMetadata(HANDLER_KEY, name, descriptor.value);
  };
}
```

Use this when methods declare intent and another loader executes it later.

## Practical Review Checklist

- Can a teammate understand the public API without reading private helpers?
- Does the type design represent real runtime rules?
- Are names domain-specific enough to explain intent?
- Is the pattern solving current duplication or variability?
- Are validation, transformation, persistence, and transport concerns separated?
- Are tests focused on behavior that the abstraction promises to preserve?
