# joktec-skills

Use these instructions when working in a project that consumes JokTec packages.

## JokTec Framework Skill

Packages: @joktec/*

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

## Reference

Read `references/framework-map.md` when the task needs package selection, dependency flow, or a quick map from requirement to package.

## Bundled References

### references/framework-map.md

# JokTec Framework Map

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

## Common Consumer App Pattern

1. Register package modules in the app module or repository module.
2. Keep app schemas/entities and app repositories in the consumer app.
3. Extend the package repository base class when the package provides one.
4. Use `BaseService`, `BaseController`, or transport helpers from `@joktec/core` when the app follows standard CRUD or message patterns.

---

## JokTec Common Skill

Packages: @joktec/core, @joktec/utils, @joktec/cron, @joktec/types

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

## References

- Read `references/core.md` for bootstrap, CRUD, pagination, and client lifecycle.
- Read `references/utils-cron.md` for utility helpers and cron usage.

## Bundled References

### references/core.md

# Common Core Usage

## Runtime Bootstrap

Use the application bootstrap helpers from `@joktec/core` for gateway and microservice runtimes. Keep runtime behavior config-driven.

## CRUD Abstractions

- `BaseController` creates standard REST CRUD endpoints for DTO-backed resources.
- `BaseService` delegates repository operations through the shared repository contract.
- `ClientController` and `ClientService` provide generated microservice CRUD patterns.

## Pagination

Request priority is cursor, then offset, then page. `BaseController.paginationMode` affects Swagger response shape; runtime selection remains request-driven unless the app service narrows it.

## Client Lifecycle

Use `ClientConfig`, `AbstractClientService`, and `conId` when building or consuming packages that support multiple client connections.

### references/utils-cron.md

# Utils And Cron Usage

## Utils

Use `@joktec/utils` for common generators, validators, converters, hashing helpers, constants, and class-validator/class-transformer exports.

Prefer package helpers over app-local reimplementation when behavior should stay consistent across services.

## Cron

Use `@joktec/cron` when a consumer app needs scheduled jobs, job worker contracts, or decorator-driven cron registration.

Keep job business logic in the consumer app. The package provides scheduling abstractions, not domain behavior.

## Types

Use `@joktec/types` when a consumer workflow needs generated JokTec package config schema/type artifacts. Treat the framework repository as source-of-truth for the generated schema shape.

---

## JokTec Mongo Skill

Packages: @joktec/mongo

Use this skill for MongoDB-backed resources that rely on JokTec's Mongoose/Typegoose wrapper.

## Rules

- Register app schema classes through `MongoModule.forRoot(...)`.
- Keep schema classes, app repositories, and app-specific queries in the consumer app.
- Extend `MongoRepo<T, ID>` for app repositories.
- Preserve `conId` when the app has multiple Mongo connections.
- Use schema-first decorators when a schema class should be reused as a DTO source.
- Treat ObjectId casting and regex behavior as safety-sensitive.

## References

- Read `references/repository.md` for `MongoService`, `MongoRepo`, query parsing, and cursor pagination.
- Read `references/schema-and-plugins.md` for decorators, paranoid soft delete, strict references, transform behavior, and debug output.

## Bundled References

### references/repository.md

# Mongo Repository Usage

## Module Setup

Register schemas with `MongoModule.forRoot({ conId, models: [...] })`. Use the same `conId` in app repositories when using non-default connections.

## Repository Pattern

Extend `MongoRepo` and pass the schema class to the base constructor. Services can then use `BaseService` from `@joktec/core`.

## Query Safety

- Root `id` can act as an API alias for `_id` in query conditions.
- ObjectId casting should be schema-aware and limited to `_id`, ObjectId paths, or explicitly configured paths.
- `$like`, `$begin`, and `$end` escape regex input by default.
- Do not rely on broad conversion when storing raw snapshots, maps, or nested subdocuments.

## Pagination

`MongoRepo.paginate` supports page, offset, and cursor responses. Cursor mode defaults to `_id`; custom `cursorKey` appends `_id` as a tie-breaker.

### references/schema-and-plugins.md

# Mongo Schema And Plugins

## Schema Decorators

Use `@Schema` and `@Prop` wrappers from `@joktec/mongo` for Typegoose schema metadata plus validation, transform, and Swagger metadata.

Avoid mutating shared option objects across multiple properties.

## Plugins

- Paranoid plugin handles soft delete filtering and must respect aggregate first-stage constraints such as `$geoNear`.
- Strict reference plugin validates referenced documents and must resolve models through the active connection.
- Transform plugin centralizes common document transformation and should not break Mongo update operators.

## Debug Output

Use `mongoDebug(collection, method, ...args)` when a Mongoose debug callback should be rendered as a Mongo shell-friendly command.

---

## JokTec MySQL Skill

Packages: @joktec/mysql

Use this skill for relational resources backed by JokTec's TypeORM wrapper.

## Rules

- Register app entities through `MysqlModule.forRoot(...)`.
- Keep entities, app repositories, and app-specific SQL in the consumer app.
- Extend `MysqlRepo<T, ID>` for app repositories.
- Treat `mysql`, `mariadb`, and `postgres` as the first-class dialects.
- Keep `sync` explicit and normally enabled only by an owner process or development bootstrap.
- Do not add new behavior to deprecated `MysqlFinder`; use `MysqlRepo.qb()` and `MysqlHelper` paths.

## References

- Read `references/repository.md` for connection lifecycle, repository usage, query safety, transaction, and cursor behavior.
- Read `references/entities.md` for `@Tables`, `@Column`, `@PrimaryColumn`, uuidv7, and dialect guidance.

## Bundled References

### references/entities.md

# MySQL Entity Decorators

## Schema-First Entity Pattern

Use `@Tables`, `@Column`, and `@PrimaryColumn` from `@joktec/mysql` when an entity should also act as the source class for mapped DTOs.

## Primary Keys

- Prefer numeric auto-increment keys for write-heavy MySQL tables.
- Use UUIDs when the app needs globally unique or public identifiers.
- Prefer `uuidv7` over random UUIDs when the id participates in ordered indexes or cursor-like access.

## Dialects

The stable dialects are MySQL, MariaDB, and Postgres. Dialect capabilities own differences such as `LIKE` vs `ILIKE`, array support, fulltext support, and generated map reliability.

### references/repository.md

# MySQL Repository Usage

## Module Setup

Register entities with `MysqlModule.forRoot({ conId, models: [...] })`. Use `conId` for multiple DataSources.

## Repository Pattern

Extend `MysqlRepo` and pass the entity class to the base constructor. Services can use `BaseService` when CRUD behavior follows the shared contract.

## Query Safety

- Validate field paths against TypeORM metadata before interpolating SQL identifiers.
- Use parameter binding for values.
- Keep logical operators such as `$and` and `$or` grouped through QueryBuilder behavior.

## Pagination

`MysqlRepo.paginate` supports page, offset, and cursor responses. Cursor mode defaults to `createdAt` plus primary key columns. Custom cursor keys must be mapped columns.

## Transactions

When using transaction-scoped operations, pass the manager or query runner through repository options so pre-read and write operations use the same context.

---

## JokTec Broker Skill

Packages: @joktec/kafka, @joktec/rabbit, @joktec/sqs, @joktec/redcast

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

## Reference

Read `references/brokers.md` for setup and package-specific notes.

## Bundled References

### references/brokers.md

# Broker Usage

## Runtime Pattern

Broker services follow `AbstractClientService` lifecycle. Loader classes discover decorator metadata after module initialization. Apps define producers, consumers, and message semantics.

## Package Notes

- Kafka: check topic existence and broker advertised listeners in local development.
- RabbitMQ: use module options and decorators for exchanges, queues, and bindings.
- SQS: local ElasticMQ-style environments may require queues to exist before consumers start.
- Redcast: use Redis-backed list, stream, or pub/sub behavior when a lightweight broker is enough.

---

## JokTec Adapter Skill

Packages: @joktec/cacher, @joktec/mailer, @joktec/notifier, @joktec/storage

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

## Reference

Read `references/adapters.md` for setup and package-specific notes.

## Bundled References

### references/adapters.md

# Adapter Usage

## Runtime Pattern

Adapters are global Nest modules. Services own native client creation and expose package-specific operations.

## Package Notes

- Cacher: choose local, Redis, or Memcached stores based on runtime config.
- Mailer: centralize mail transport configuration in the service that owns outbound email.
- Notifier: keep push provider configuration outside app business logic.
- Storage: keep storage metadata and object operations behind the adapter service.

---

## JokTec Extended Database Skill

Packages: @joktec/elastic, @joktec/arango, @joktec/bigquery

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

## Reference

Read `references/extended-databases.md` for package boundaries and usage notes.

## Bundled References

### references/extended-databases.md

# Extended Database Usage

## Package Boundaries

Extended database packages expose reusable clients and helpers for specific data systems. They should not contain consumer app schemas or business-specific query policy.

## Notes

- Elastic may depend on `@joktec/http` for HTTP-backed behavior.
- Arango and BigQuery are separate client packages; verify the README/source before assuming repository-like CRUD support.
- Use local package tests or consumer harnesses only when the target service stack is available.

---

## JokTec Integration Skill

Packages: @joktec/firebase, @joktec/gpt

Use this skill for third-party integration packages.

## Packages

- `@joktec/firebase`: Firebase Admin SDK integration.
- `@joktec/gpt`: GPT/OpenAI-style client integration.

## Rules

- Keep credentials config-driven and never commit real credentials.
- Use package services instead of direct SDK initialization in app code.
- Preserve app-neutral service behavior; consumer apps own domain workflows.
- Verify current package README/source before relying on advanced provider features.

## Reference

Read `references/integrations.md` for provider-specific notes.

## Bundled References

### references/integrations.md

# Integration Usage

## Firebase

Use the integration module and service to initialize Firebase Admin clients from validated config. Keep credential files local or environment-provided.

## GPT

Use the integration package for reusable GPT client setup. Keep prompt/business policy in the consumer app, not in the generic package.

---

## JokTec Tool Skill

Packages: @joktec/http, @joktec/file, @joktec/alert

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

## Reference

Read `references/tools.md` for package-specific usage notes.

## Bundled References

### references/tools.md

# Tool Usage

## HTTP

Use `@joktec/http` for Axios-backed requests, uploads, proxy agent support, retry config, and metrics where exposed.

## File

Use `@joktec/file` for shared file helpers and classification behavior instead of duplicating local utility code.

## Alert

Use `@joktec/alert` for Slack-compatible webhook alerts. Keep webhook URLs and credentials out of source control.
