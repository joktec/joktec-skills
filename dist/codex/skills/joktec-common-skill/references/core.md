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
- set `paginate.mode` for the representative Swagger response shape
- use `customDto.paginationDto` only when the built-in page/offset/cursor response does not represent the API
- keep auth/guards/interceptors consistent with app conventions
- avoid putting business branching in controller methods when it belongs in the service

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
