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
