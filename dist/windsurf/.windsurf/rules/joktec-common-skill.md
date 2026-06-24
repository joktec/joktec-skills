# JokTec Common Skill

Use when implementing or wiring @joktec/core, @joktec/utils, or @joktec/cron in a consumer app, especially BaseController, BaseService, pagination, config, client lifecycle, bootstrap, cron decorators, or utility helpers.

Use this skill for shared framework primitives and low-level helpers.

## Packages

- `@joktec/core`: NestJS bootstrap, modules, config, logger, metrics, base abstractions, transports, pagination, Bull.
- `@joktec/utils`: conversion helpers, UUID/OTP/hash generators, validators, common constants.
- `@joktec/cron`: cron decorators, schedulers, workers, and job contracts.

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
