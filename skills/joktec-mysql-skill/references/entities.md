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
