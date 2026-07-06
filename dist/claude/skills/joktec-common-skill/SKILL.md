---
name: joktec-common-skill
description: Use when implementing or wiring @joktec/core, @joktec/utils, or @joktec/cron in a consumer app, especially BaseController, SubController, BaseService, ClientController, SubClientController, pagination, config, client lifecycle, bootstrap, cron decorators, or utility helpers.
metadata:
  dependencies:
    - joktec-framework-skill
---

# JokTec Common Skill

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
