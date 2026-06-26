# JokTec MySQL Skill

Use when working with @joktec/mysql in a consumer app, including MysqlModule setup, TypeORM entities, schema-first @Column/@PrimaryColumn decorators, MysqlRepo, MysqlService, transactions, dialect support, uuidv7 ids, query safety, and cursor pagination.

Use this skill for relational resources backed by JokTec's TypeORM wrapper.

## Rules

- Register app entities through `MysqlModule.forRoot(...)`.
- Keep entities, app repositories, and app-specific SQL in the consumer app.
- Extend `MysqlRepo<T, ID>` for app repositories.
- Treat `mysql`, `mariadb`, and `postgres` as the first-class dialects.
- Keep `sync` explicit and normally enabled only by an owner process or development bootstrap.
- Do not add new behavior to deprecated `MysqlFinder`; use `MysqlRepo.qb()` and `MysqlHelper` paths.
- Use schema-first `@Column`, `@PrimaryColumn`, and `@TimestampColumn` wrappers when an entity also acts as DTO metadata.
- Use `@Column({ enum: SomeEnum })` for enum columns; the wrapper infers enum column type, validation, and Swagger enum metadata unless `type` is explicitly overridden.
- Use `@Column({ kind: 'virtual' })` for computed getters that need expose/Swagger metadata without persistence.
- Use `immutable` for API read-only metadata; TypeORM `update: false` remains storage write behavior and is also inferred as Swagger read-only when `immutable` is not set.
- Do not add `swagger.type` just because a column has a primitive, date, array, nested JSON class, or relation type. The wrapper infers Swagger metadata from TypeScript design type and JokTec options. Use `swagger` only to override an inferred shape.
- Do not use `@joktec/mysql` for Mongo/ObjectId columns, even though TypeORM has Mongo-related APIs.
- For real migrations, inspect the installed `@joktec/mysql` source in the consumer project's `node_modules` first. If that is insufficient, read GitHub package docs, then GitHub source. Use the local `../joktec-framework` checkout only when you are working inside the JokTec development workspace.

## References

- Read `references/repository.md` for connection lifecycle, repository usage, query safety, transaction, and cursor behavior.
- Read `references/entities.md` for `@Tables`, `@Column`, `@PrimaryColumn`, uuidv7, dialect guidance, and legacy decorator migration rules.

## Bundled References

### references/entities.md

# MySQL Entity Decorators

## Source Lookup

When blocked in a consumer project, inspect the installed package first:

- `node_modules/@joktec/mysql/README.md`
- `node_modules/@joktec/mysql/AGENTS.md` when published with the package
- `node_modules/@joktec/mysql/dist/index.d.ts`
- `node_modules/@joktec/mysql/dist/decorators/column.decorator.d.ts`
- `node_modules/@joktec/mysql/dist/decorators/columns/column.type.d.ts`
- `node_modules/@joktec/mysql/dist/decorators/timestamp.decorator.d.ts`

If the installed package is missing enough detail, use the GitHub package docs next:

- `https://github.com/joktec/joktec-framework/tree/main/packages/databases/mysql`

Use GitHub source only after package docs and installed types are not enough:

- `packages/databases/mysql/src/decorators/table.decorator.ts`
- `packages/databases/mysql/src/decorators/column.decorator.ts`
- `packages/databases/mysql/src/decorators/columns/column.type.ts`
- `packages/databases/mysql/src/decorators/columns/column.factory.ts`
- `packages/databases/mysql/src/decorators/columns/primary.column.ts`
- `packages/databases/mysql/src/decorators/columns/timestamp.column.ts`
- `packages/databases/mysql/src/decorators/columns/virtual.column.ts`
- `packages/databases/mysql/src/decorators/columns/object.column.ts`
- `packages/databases/mysql/src/decorators/columns/string.column.ts`
- `packages/databases/mysql/src/decorators/columns/number.column.ts`
- `packages/databases/mysql/src/decorators/columns/transform.column.ts`
- `packages/databases/mysql/src/decorators/columns/swagger.column.ts`

## Schema-First Entity Pattern

Use `@Tables`, `@Column`, `@PrimaryColumn`, and `@TimestampColumn` from `@joktec/mysql` when an entity should also act as the source class for mapped DTOs.

The new decorators are not thin TypeORM aliases. They are schema-first wrappers that compose:

- TypeORM column/primary column metadata.
- `class-validator` behavior through `@joktec/utils` validators.
- `class-transformer` expose/exclude behavior.
- Swagger property metadata.

The wrapper can also represent virtual computed getters and nested JSON/jsonb class payloads. Do not use this package for Mongo/ObjectId columns.

Wrapper philosophy:

- prefer one schema declaration that carries persistence, validation, transform, and Swagger metadata
- use wrapper options before duplicating `@ApiProperty`, `@Expose`, `@Type`, or common validators
- do not add `swagger.type` for normal scalar/date fields, arrays, nested JSON classes, or relations when the wrapper can infer the shape
- use `@Column({ enum: SomeEnum })` for enum columns; the wrapper infers enum column type, validation, and Swagger enum metadata unless `type` is explicitly overridden
- use raw TypeORM only for advanced cases that the wrapper does not model cleanly
- keep storage write behavior and API documentation behavior distinct when needed

## Current Decorator Capabilities

Use the package README and actual installed source for full migration details. This skill only keeps the common mappings that help an agent recognize old patterns.

Common mappings:

| Legacy decorators | New decorator shape |
| --- | --- |
| `@PrimaryGeneratedColumn()` | `@PrimaryColumn('increment')` |
| `@PrimaryGeneratedColumn('uuid')` | `@PrimaryColumn('uuid')` |
| app-generated ordered UUID id | `@PrimaryColumn('uuidv7')` |
| `@CreateDateColumn(...)` | `@TimestampColumn('create', ...)` |
| `@UpdateDateColumn(...)` | `@TimestampColumn('update', ...)` |
| `@DeleteDateColumn(...)` | `@TimestampColumn('delete', ...)` |
| TypeORM `@VersionColumn(...)` | `@Column({ kind: 'version', ... })` |
| TypeORM `@VirtualColumn(...)` | `@Column({ kind: 'virtual', mode: 'sql', query, ... })` |
| TypeORM `@ViewColumn(...)` | `@Column({ kind: 'view', ... })` |
| `@Column(...)` | `@Column(...)` from `@joktec/mysql` |
| `@RelationId(...)` | `@Column({ kind: 'relation-id', relationId })` |
| `@IsNotEmpty()` | `@Column({ required: true })` |
| `@IsOptional()` | `@Column({ required: false })` or nullable TypeORM option when storage allows null |
| `@IsEmail()` | `@Column({ isEmail: true })` |
| `@IsMobilePhone()` | `@Column({ isPhone: true })` |
| `@IsInt()` | `@Column({ isInt: true })` or an integer column type |
| `@IsUUID()` | `@Column({ isUUID: true })` |
| `@IsObject()` | `@Column({ isObject: true })` or a JSON column |
| `@IsHexColor()` | `@Column({ isHexColor: true })` |
| `@IsUrl()` | `@Column({ isUrl: true })` |
| `@MinLength(n)` | `@Column({ minLength: n })` |
| `@MaxLength(n)` | `@Column({ maxLength: n })` |
| `@Min(n)` | `@Column({ min: n })` |
| `@Max(n)` | `@Column({ max: n })` |
| `@Expose()` | default behavior of `@Column(...)` |
| `@Expose({ groups })` | `@Column({ groups })` |
| `@Exclude({ toPlainOnly: true })` plus hidden Swagger | `@Column({ hidden: true })` |
| `@ApiProperty(...)` | Prefer native options such as `example`, `comment`, `deprecated`, `min`, `max`, `minLength`, `maxLength`; use `swagger` only as an override |
| `@ValidateNested()` + `@Type(() => Preference)` | `@Column('jsonb', { nested: Preference })` |
| `@ValidateNested({ each: true })` + `@Type(() => Preference)` | `@Column('jsonb', { nested: Preference, each: true })` |
| `@Expose()` + `@ApiProperty(...)` on a getter | `@Column({ kind: 'virtual', ... })` |
| Swagger `readOnly: true` | `@Column({ immutable: true })` or TypeORM `update: false` when ORM updates must also be blocked |

## Swagger Metadata Rules

The `@Column` wrapper already composes Swagger metadata. During migrations, keep entity code small and avoid redundant `swagger` declarations:

- Do not add `swagger: { type: String }` for string columns.
- Do not add `swagger: { type: Number }` for numeric columns.
- Do not add `swagger: { type: Boolean }` for boolean columns.
- Do not add `swagger: { type: Date }` for date, datetime, or timestamp columns.
- Do not add `swagger: { type: String, isArray: true }` for `simple-array` or reflected array fields unless the OpenAPI shape must differ from the entity field.
- Do not add `swagger: { type: NestedClass }` when `nested: NestedClass` is already present.
- Do not add `swagger: { type: () => Entity }` on `Column({ kind: 'relation', type: () => Entity })`; the relation wrapper keeps the Swagger type lazy to avoid circular schema evaluation.

Use `swagger` only for actual overrides, for example:

- an OpenAPI primitive differs from the TypeScript property type, such as a SQL decimal represented as `string`
- a property needs `oneOf`, `anyOf`, `allOf`, custom `items`, or a deliberately shortened example
- a generated schema needs an explicit read/write/deprecated override that cannot be represented by wrapper options

If a relation wrapper still triggers a circular Swagger error in a consumer project, inspect `node_modules/@joktec/mysql/dist/decorators/column.decorator.d.ts` and the installed implementation first. Do not paper over the issue by adding `swagger.type` to every relation; identify whether the installed package version has lazy relation Swagger support.

## Read-Only Metadata

`immutable` is the API read-only hint used by the JokTec MySQL wrapper. TypeORM `update: false` is the ORM write behavior. The wrapper maps both to Swagger `readOnly` when appropriate:

- `immutable` has priority over `update: false`
- `update: false` implies Swagger `readOnly` only when `immutable` is not set
- `swagger.readOnly` remains the final explicit override

Some field kinds default to API read-only because they are system-managed or computed:

- primary keys
- timestamp columns
- version columns
- view columns
- virtual getter and SQL virtual columns
- relation-id columns
- tree level columns

## Primary Keys

- Prefer numeric auto-increment keys for write-heavy MySQL tables.
- Use UUIDs when the app needs globally unique or public identifiers.
- Prefer `uuidv7` over random UUIDs when the id participates in ordered indexes or cursor-like access.
- When switching from UUID v4 to uuidv7, verify downstream code does not assume random UUID ordering.

Do not blindly convert every primary key to uuidv7. Keep numeric increment keys when the table is internal, write-heavy, and does not need public/global identifiers.

## Dialects

The stable dialects are MySQL, MariaDB, and Postgres. Dialect capabilities own differences such as `LIKE` vs `ILIKE`, array support, fulltext support, and generated map reliability.

### references/repository.md

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
