# JokTec Extended Database Skill

Use when working with extended JokTec database packages @joktec/elastic, @joktec/arango, or @joktec/bigquery in a consumer app, including app-neutral client setup, config-driven lifecycle, and package-specific query/service usage.

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
