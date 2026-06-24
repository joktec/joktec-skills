---
name: joktec-database-extended-skill
description: Use when working with extended JokTec database packages @joktec/elastic, @joktec/arango, or @joktec/bigquery in a consumer app, including app-neutral client setup, config-driven lifecycle, and package-specific query/service usage.
---

# JokTec Extended Database Skill

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
