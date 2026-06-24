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
- When migrating an entity to the new schema-first decorators, migrate the whole property decorator stack, not only the TypeORM primary key decorator.
- If guidance is insufficient, read this skill's references and inspect `../joktec-framework` package source or GitHub fallback before assuming APIs.

## References

- Read `references/repository.md` for connection lifecycle, repository usage, query safety, transaction, and cursor behavior.
- Read `references/entities.md` for `@Tables`, `@Column`, `@PrimaryColumn`, uuidv7, dialect guidance, and legacy decorator migration rules.
