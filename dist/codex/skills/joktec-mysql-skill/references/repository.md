# MySQL Repository Usage

## Source Lookup

When blocked in a consumer project, inspect installed package docs and types first:

- `node_modules/@joktec/mysql/README.md`
- `node_modules/@joktec/mysql/AGENTS.md` when published with the package
- `node_modules/@joktec/mysql/dist/index.d.ts`
- `node_modules/@joktec/mysql/dist/mysql.module.d.ts`
- `node_modules/@joktec/mysql/dist/mysql.service.d.ts`
- `node_modules/@joktec/mysql/dist/mysql.repo.d.ts`
- `node_modules/@joktec/mysql/dist/models/mysql.request.d.ts`

If the installed package is insufficient, read GitHub package docs next:

- `https://github.com/joktec/joktec-framework/tree/main/packages/databases/mysql`

Use GitHub source only after installed types and package docs are not enough:

- `packages/databases/mysql/README.md`
- `packages/databases/mysql/AGENTS.md`
- `packages/databases/mysql/src/index.ts`
- `packages/databases/mysql/src/mysql.module.ts`
- `packages/databases/mysql/src/mysql.service.ts`
- `packages/databases/mysql/src/mysql.repo.ts`
- `packages/databases/mysql/src/helpers/mysql.helper.ts`
- `packages/databases/mysql/src/helpers/mysql.finder.ts`
- `packages/databases/mysql/src/services/mysql.dialect.ts`
- `packages/databases/mysql/src/models/*`

## Module Setup

Register entities with `MysqlModule.forRoot({ conId, models: [...] })`. Use `conId` for multiple DataSources.

Best practice:

- Register consumer app entities in an app repository module.
- Keep `sync` disabled in request-facing processes unless the app intentionally owns schema sync.
- Use one controlled owner process for schema sync/migration in multi-process deployments.
- Preserve `conId` when resolving repositories or transaction-scoped managers.

## Repository Pattern

Extend `MysqlRepo` and pass the entity class to the base constructor. Services can use `BaseService` when CRUD behavior follows the shared contract.

Repository checklist:

- Keep entity-specific SQL helpers in the app repository, not in controllers.
- Use `MysqlRepo.qb()` and repository methods for standard reads so field validation, relation loading, soft delete, and pagination stay consistent.
- Do not add new behavior to `MysqlFinder`; it is deprecated compatibility code.
- Keep read/write operations in the same transaction context when the app passes a manager or query runner.

## Query Safety

- Validate field paths against TypeORM metadata before interpolating SQL identifiers.
- Use parameter binding for values.
- Keep logical operators such as `$and` and `$or` grouped through QueryBuilder behavior.

Anti-patterns:

- Do not interpolate user-provided field names or relation names into SQL without TypeORM metadata validation.
- Do not assume MySQL-only syntax when the package supports MySQL, MariaDB, and Postgres.
- Do not use a relation/populate path unless it maps to entity metadata.

## Pagination

`MysqlRepo.paginate` supports page, offset, and cursor responses. Cursor mode defaults to `createdAt` plus primary key columns. Custom cursor keys must be mapped columns.

Cursor checklist:

- Use `createdAt + primary key` as the default stable cursor.
- Add primary keys as tie-breakers for non-unique cursor keys.
- Ensure cursor keys are indexed for hot list endpoints.
- Validate cursor payload shape before building SQL.
- Treat cursor tokens as opaque; clients should not parse them.

## Transactions

When using transaction-scoped operations, pass the manager or query runner through repository options so pre-read and write operations use the same context.

Transaction checklist:

- Use one manager/query runner for read-modify-write flows.
- Rollback tests should prove that both pre-read dependent writes and writes are transaction-scoped.
- Avoid mixing default repositories and transaction-scoped repositories in one operation.
