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
| `@ApiProperty(...)` | `@Column({ swagger: ... })`, or native options such as `example`, `comment`, `deprecated`, `min`, `max`, `minLength`, `maxLength` |
| `@ValidateNested()` + `@Type(() => Preference)` | `@Column('jsonb', { nested: Preference })` |
| `@ValidateNested({ each: true })` + `@Type(() => Preference)` | `@Column('jsonb', { nested: Preference, each: true })` |
| `@Expose()` + `@ApiProperty(...)` on a getter | `@Column({ kind: 'virtual', ... })` |
| Swagger `readOnly: true` | `@Column({ immutable: true })` or TypeORM `update: false` when ORM updates must also be blocked |

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
