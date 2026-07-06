# JokTec Common Skill

Use when implementing or wiring @joktec/core, @joktec/utils, or @joktec/cron in a consumer app, especially BaseController, SubController, BaseService, ClientController, SubClientController, pagination, config, client lifecycle, bootstrap, cron decorators, or utility helpers.

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
