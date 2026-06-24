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
