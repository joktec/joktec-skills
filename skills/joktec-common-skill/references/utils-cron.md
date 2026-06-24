# Utils And Cron Usage

## Utils

Use `@joktec/utils` for common generators, validators, converters, hashing helpers, constants, and class-validator/class-transformer exports.

Prefer package helpers over app-local reimplementation when behavior should stay consistent across services.

## Cron

Use `@joktec/cron` when a consumer app needs scheduled jobs, job worker contracts, or decorator-driven cron registration.

Keep job business logic in the consumer app. The package provides scheduling abstractions, not domain behavior.
