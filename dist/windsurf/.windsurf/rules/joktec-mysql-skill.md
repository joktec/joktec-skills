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
- When migrating an entity to the new schema-first decorators, migrate the whole property decorator stack, not only the TypeORM primary key decorator.
- If guidance is insufficient, read this skill's references and inspect `../joktec-framework` package source or GitHub fallback before assuming APIs.

## References

- Read `references/repository.md` for connection lifecycle, repository usage, query safety, transaction, and cursor behavior.
- Read `references/entities.md` for `@Tables`, `@Column`, `@PrimaryColumn`, uuidv7, dialect guidance, and legacy decorator migration rules.

## Bundled References

### references/entities.md

# MySQL Entity Decorators

## Source Lookup

When blocked, inspect:

- `packages/databases/mysql/src/decorators/table.decorator.ts`
- `packages/databases/mysql/src/decorators/column.decorator.ts`
- `packages/databases/mysql/src/decorators/columns/column.type.ts`
- `packages/databases/mysql/src/decorators/columns/column.factory.ts`
- `packages/databases/mysql/src/decorators/columns/primary.column.ts`
- `packages/databases/mysql/src/decorators/columns/string.column.ts`
- `packages/databases/mysql/src/decorators/columns/number.column.ts`
- `packages/databases/mysql/src/decorators/columns/transform.column.ts`
- `packages/databases/mysql/src/decorators/columns/swagger.column.ts`

## Schema-First Entity Pattern

Use `@Tables`, `@Column`, and `@PrimaryColumn` from `@joktec/mysql` when an entity should also act as the source class for mapped DTOs.

The new decorators are not thin TypeORM aliases. They are schema-first wrappers that compose:

- TypeORM column/primary column metadata.
- `class-validator` behavior through `@joktec/utils` validators.
- `class-transformer` expose/exclude behavior.
- Swagger property metadata.

When migrating old entities, remove duplicate property decorators from `typeorm`, `class-validator`, `class-transformer`, and Swagger when the wrapper option can represent the same behavior.

## Legacy Decorator Migration

Migrate a whole property at a time. Do not only replace `PrimaryGeneratedColumn`.

Common mappings:

| Legacy decorators | New decorator shape |
| --- | --- |
| `@PrimaryGeneratedColumn()` | `@PrimaryColumn('increment')` |
| `@PrimaryGeneratedColumn('uuid')` | `@PrimaryColumn('uuid')` |
| app-generated ordered UUID id | `@PrimaryColumn('uuidv7')` |
| `@Column(...)` | `@Column(...)` from `@joktec/mysql` |
| `@IsNotEmpty()` | `@Column({ required: true })` |
| `@IsOptional()` | `@Column({ required: false })` or nullable TypeORM option when storage allows null |
| `@IsEmail()` | `@Column({ isEmail: true })` |
| `@IsMobilePhone()` | `@Column({ isPhone: true })` |
| `@IsHexColor()` | `@Column({ isHexColor: true })` |
| `@IsUrl()` | `@Column({ isUrl: true })` |
| `@MinLength(n)` | `@Column({ minLength: n })` |
| `@MaxLength(n)` | `@Column({ maxLength: n })` |
| `@Min(n)` | `@Column({ min: n })` |
| `@Max(n)` | `@Column({ max: n })` |
| `@Expose()` | default behavior of `@Column(...)` |
| `@Expose({ groups })` | `@Column({ groups })` |
| `@Exclude({ toPlainOnly: true })` plus hidden Swagger | `@Column({ hidden: true })` |
| `@ApiProperty(...)` | `@Column({ swagger: ... })`, or native options such as `example`, `comment`, `deprecated`, `min`, `max`, `minLength`, `maxLength` |

Preserve decorators only when the wrapper cannot express them, by passing them through `decorators: [...]`.

Migration checklist:

- Replace TypeORM column decorators with wrappers from `@joktec/mysql`.
- Remove duplicate `class-validator` decorators when equivalent wrapper options exist.
- Remove duplicate `class-transformer` decorators when `hidden` or `groups` expresses the same behavior.
- Move Swagger examples/descriptions/limits into wrapper options where possible.
- Preserve custom validators/transforms only through `decorators: [...]`.
- Keep database-specific options such as `type`, `length`, `nullable`, `unique`, `default`, `enum`, and `comment`.
- Rebuild and run entity-related tests after migration because DTO metadata and TypeORM metadata both change.

Example migration:

```ts
// Before
@Column({ type: 'varchar', length: 255 })
@IsEmail()
@IsNotEmpty()
@Expose()
@ApiProperty({ example: 'user@example.com' })
email!: string;

// After
@Column('varchar', {
  length: 255,
  required: true,
  isEmail: true,
  example: 'user@example.com',
})
email!: string;
```

For hidden fields:

```ts
// Before
@Column({ type: 'varchar', length: 255 })
@Exclude({ toPlainOnly: true })
@ApiHideProperty()
password!: string;

// After
@Column('varchar', { length: 255, hidden: true })
password!: string;
```

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

When blocked, inspect:

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
