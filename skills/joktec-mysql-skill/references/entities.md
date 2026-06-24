# MySQL Entity Decorators

## Schema-First Entity Pattern

Use `@Tables`, `@Column`, and `@PrimaryColumn` from `@joktec/mysql` when an entity should also act as the source class for mapped DTOs.

## Primary Keys

- Prefer numeric auto-increment keys for write-heavy MySQL tables.
- Use UUIDs when the app needs globally unique or public identifiers.
- Prefer `uuidv7` over random UUIDs when the id participates in ordered indexes or cursor-like access.

## Dialects

The stable dialects are MySQL, MariaDB, and Postgres. Dialect capabilities own differences such as `LIKE` vs `ILIKE`, array support, fulltext support, and generated map reliability.
