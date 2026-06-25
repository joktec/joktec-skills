---
name: joktec-mysql-skill
description: Use when working with @joktec/mysql in a consumer app, including MysqlModule setup, TypeORM entities, schema-first @Column/@PrimaryColumn decorators, MysqlRepo, MysqlService, transactions, dialect support, uuidv7 ids, query safety, and cursor pagination.
metadata:
  dependencies:
    - joktec-framework-skill
    - joktec-common-skill
---

# JokTec MySQL Skill

Use this skill for relational resources backed by JokTec's TypeORM wrapper.

## Rules

- Register app entities through `MysqlModule.forRoot(...)`.
- Keep entities, app repositories, and app-specific SQL in the consumer app.
- Extend `MysqlRepo<T, ID>` for app repositories.
- Treat `mysql`, `mariadb`, and `postgres` as the first-class dialects.
- Keep `sync` explicit and normally enabled only by an owner process or development bootstrap.
- Do not add new behavior to deprecated `MysqlFinder`; use `MysqlRepo.qb()` and `MysqlHelper` paths.
- Use schema-first `@Column`, `@PrimaryColumn`, and `@TimestampColumn` wrappers when an entity also acts as DTO metadata.
- Use `@Column({ kind: 'virtual' })` for computed getters that need expose/Swagger metadata without persistence.
- Use `immutable` for API read-only metadata; TypeORM `update: false` remains storage write behavior and is also inferred as Swagger read-only when `immutable` is not set.
- Do not add `swagger.type` just because a column has a primitive, date, array, nested JSON class, or relation type. The wrapper infers Swagger metadata from TypeScript design type and JokTec options. Use `swagger` only to override an inferred shape.
- Do not use `@joktec/mysql` for Mongo/ObjectId columns, even though TypeORM has Mongo-related APIs.
- For real migrations, inspect the installed `@joktec/mysql` source in the consumer project's `node_modules` first. If that is insufficient, read GitHub package docs, then GitHub source. Use the local `../joktec-framework` checkout only when you are working inside the JokTec development workspace.

## References

- Read `references/repository.md` for connection lifecycle, repository usage, query safety, transaction, and cursor behavior.
- Read `references/entities.md` for `@Tables`, `@Column`, `@PrimaryColumn`, uuidv7, dialect guidance, and legacy decorator migration rules.
