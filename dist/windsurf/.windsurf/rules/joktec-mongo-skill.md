# JokTec Mongo Skill

Use when working with @joktec/mongo in a consumer app, including MongoModule setup, Typegoose schema decorators, MongoRepo, MongoService, MongoHelper, plugins, ObjectId/query safety, soft delete, strict references, cursor pagination, coverage checks, and Change Streams.

Use this skill for MongoDB-backed resources that rely on JokTec's Mongoose/Typegoose wrapper.

## Rules

- Register app schema classes through `MongoModule.forRoot(...)`.
- Keep schema classes, app repositories, and app-specific queries in the consumer app.
- Extend `MongoRepo<T, ID>` for app repositories.
- Preserve `conId` when the app has multiple Mongo connections.
- For Mongo config, treat `params` as final query-style overrides after `options`; duplicate keys in `params` win over `options`.
- Enable `autoIndex` only in one schema/index owner process for a shared database; request-facing clusters should keep it disabled.
- Use `MongoService.getCoverage(...)` before depending on sessions, transactions, or Change Streams. Standalone MongoDB cannot use Change Streams.
- Use `MongoRepo.watch(...)` or `MongoService.watch(...)` for realtime MongoDB Change Streams. Do not confuse this with `MongoRepo.cursor(...)`, which only iterates query results.
- Use schema-first decorators when a schema class should be reused as a DTO source; wrappers should reduce repeated Typegoose, validator, transformer, and Swagger stacks.
- Use `RefId<T>` for stored reference id fields and `PopulatedRef<T>` for populated virtual fields.
- Use `@Schema({ kind: 'embedded' })` for value objects without `_id` or timestamps.
- Use `@Schema({ kind: 'subdocument' })` for embedded documents that need their own `_id` and timestamps.
- Use `@Prop({ enum: SomeEnum })` for enum fields; the wrapper infers string or number storage type, validation, and Swagger enum metadata unless `type` is explicitly provided.
- Use `@Prop({ kind: 'virtual', mode: 'getter' })` for computed getters that need expose/Swagger metadata without persistence.
- Use `@Prop({ ref: () => Target, foreignField, localField })` for populate-one virtuals when inferred defaults are enough.
- Use `@Prop({ type: () => [Target], ref: () => Target, foreignField, localField })` for populate-array virtuals.
- Use `@Prop({ kind: 'map', type: Object })` for map/snapshot payloads that must keep their raw shape.
- Treat ObjectId casting and regex behavior as safety-sensitive.
- For real migrations, inspect `node_modules/@joktec/mongo` first, then installed README or GitHub package docs, then GitHub source before assuming APIs.

## References

- Read `references/repository.md` for `MongoService`, `MongoRepo`, query parsing, cursor pagination, coverage checks, and Change Streams.
- Read `references/schema-and-plugins.md` for decorators, paranoid soft delete, strict references, transform behavior, and debug output.

## Bundled References

### references/repository.md

# Mongo Repository Usage

## Source Lookup

When blocked, inspect:

- Consumer project first: `node_modules/@joktec/mongo`.
- Installed docs next: `node_modules/@joktec/mongo/README.md`.
- GitHub docs next: `https://github.com/joktec/joktec-framework/tree/main/packages/databases/mongo`.
- GitHub source fallback:
  - `packages/databases/mongo/src/index.ts`
  - `packages/databases/mongo/src/mongo.module.ts`
  - `packages/databases/mongo/src/mongo.service.ts`
  - `packages/databases/mongo/src/mongo.repo.ts`
  - `packages/databases/mongo/src/helpers/mongo.helper.ts`
  - `packages/databases/mongo/src/helpers/mongo.pipeline.ts`
  - `packages/databases/mongo/src/helpers/mongo.utils.ts`
  - `packages/databases/mongo/src/models/*`

## Module Setup

Register schemas with `MongoModule.forRoot({ conId, models: [...] })`. Use the same `conId` in app repositories when using non-default connections.

Best practice:

- Register app schema classes in the consumer app repository module.
- Use one owner process for index creation in multi-process deployments.
- Preserve `conId` through service/repo constructors for multi-connection apps.
- Do not rely on the global mongoose model registry when `MongoService` provides connection-aware resolution.

## Connection Config

`@joktec/mongo` merges connection values in this order:

1. framework defaults
2. `mongo.options`
3. query-style `mongo.params`

When `params` and `options` contain the same MongoDB driver option, `params` wins.

```yaml
mongo:
  params: authSource=app_db&replicaSet=rs0&directConnection=true&connectTimeoutMS=20000
  options:
    authSource: admin
    connectTimeoutMS: 30000
    serverSelectionTimeoutMS: 5000
```

The final config uses `authSource=app_db` and `connectTimeoutMS=20000`, while preserving `serverSelectionTimeoutMS=5000`.

`autoIndex` should be enabled only in a single schema/index owner process. The package checks index drift with `diffIndexes()` and runs `syncIndexes({ continueOnError: true })` when needed. Sync errors are logged with connection/schema context. Request-facing clusters should keep `autoIndex` disabled.

## Repository Pattern

Extend `MongoRepo` and pass the schema class to the base constructor. Services can then use `BaseService` from `@joktec/core`.

Repository checklist:

- Keep schema-specific query helpers in the app repository, not in controllers.
- Use repository methods for standard reads so query parsing, soft delete, populate, and pagination stay consistent.
- Pass transaction/session options through read-modify-write flows when the app uses transactions.
- Repository read paths should return schema class instances with normalized ObjectId/string values, including populated and deep-populated values.
- Code that needs raw Mongoose documents should use `MongoService.getModel(...)` or Typegoose/Mongoose APIs directly.

## Coverage, Transactions, and Change Streams

Use `MongoService.getCoverage(conId?)` before depending on topology-sensitive features. Coverage reports MongoDB version, Mongoose version, Typegoose version, topology, session support, transaction support, Change Stream support, and reasons for unavailable features.

`MongoService.startTransaction(...)`, `MongoService.watch(...)`, and `MongoRepo.watch(...)` fail fast through coverage checks. Standalone MongoDB cannot use Change Streams; replica set or sharded topology is required.

Use `MongoRepo.watch(...)` for model-level realtime listening:

```ts
const coverage = await mongoService.getCoverage();

if (coverage.canUseStream) {
  const stream = await articleRepo.watch([{ $match: { operationType: 'insert' } }]);
  stream.on('change', change => {
    // handle realtime insert/update/delete event
  });
}
```

Use `MongoService.watch(...)` for database-level Change Streams. Use `MongoRepo.cursor(...)` only for iterating large query results; it is not a realtime listener.

Consumer apps that must run on standalone MongoDB should implement an explicit polling fallback, usually by querying `createdAt` or `_id` periodically.

## Query Safety

- Root `id` can act as an API alias for `_id` in query conditions.
- ObjectId casting should be schema-aware and limited to `_id`, ObjectId paths, or explicitly configured paths.
- `$like`, `$begin`, and `$end` escape regex input by default.
- Do not rely on broad conversion when storing raw snapshots, maps, or nested subdocuments.

Anti-patterns:

- Do not convert every nested `id` key into `_id`; only API-facing query aliases should be converted.
- Do not cast every 24-character hex string into ObjectId; fields like `externalId`, `code`, and `slug` may be strings.
- Do not inject soft-delete conditions into unknown nested aggregate branches unless the target collection is known.

## Pagination

`MongoRepo.paginate` supports page, offset, and cursor responses. Cursor mode defaults to `_id`; custom `cursorKey` appends `_id` as a tie-breaker.

Cursor checklist:

- Use `_id` for default Mongo cursor ordering.
- Use `createdAt` or another indexed stable key when the product requires chronological cursor behavior.
- Append `_id` as a tie-breaker for non-unique cursor keys.
- Fetch `limit + 1` records and generate `nextCursor` only when another page exists.
- Treat cursor tokens as opaque; clients should not parse them.

### references/schema-and-plugins.md

# Mongo Schema And Plugins

## Source Lookup

When blocked, inspect:

- Consumer project first: `node_modules/@joktec/mongo`.
- Package docs next: `node_modules/@joktec/mongo/README.md`.
- GitHub docs next: `https://github.com/joktec/joktec-framework/tree/main/packages/databases/mongo`.
- GitHub source fallback:
  - `packages/databases/mongo/src/decorators/schema.decorator.ts`
  - `packages/databases/mongo/src/decorators/schema.options.ts`
  - `packages/databases/mongo/src/decorators/prop.decorator.ts`
  - `packages/databases/mongo/src/decorators/props/*`
  - `packages/databases/mongo/src/models/mongo.ref.ts`
  - `packages/databases/mongo/src/models/object-id.ts`
  - `packages/databases/mongo/src/models/mongo.schema.ts`
  - `packages/databases/mongo/src/plugins/paranoid.plugin.ts`
  - `packages/databases/mongo/src/plugins/strict-reference.plugin.ts`
  - `packages/databases/mongo/src/plugins/transform.plugin.ts`

## Schema Decorators

Use `@Schema` and `@Prop` wrappers from `@joktec/mongo` for Typegoose schema metadata plus validation, transform, and Swagger metadata.

Avoid mutating shared option objects across multiple properties.

Best practice:

- Use schema-first decorators when the schema should be reused by DTO mapped types.
- Keep raw `@prop` or raw Mongoose decorators only when the wrapper cannot express the behavior.
- Pass custom validators/transforms explicitly rather than adding hidden global behavior.
- Keep maps, snapshots, and dynamic objects explicit so helper conversion does not alter their shape.
- Keep app-level reference semantics visible; strict reference plugin checks existence, but the app still owns domain rules.
- Use `RefId<T>` for persisted id fields and `PopulatedRef<T>` for populated virtual instance fields.
- Use lazy `type` resolvers such as `type: () => User` or `type: () => [User]` when the wrapper cannot infer the runtime class.
- Use `@Schema({ kind: 'embedded' })` for value objects without `_id` or timestamps.
- Use `@Schema({ kind: 'subdocument' })` for embedded documents that need `_id` and timestamps but should not create a collection.
- Use `@Prop({ enum: SomeEnum })` for enum fields; the wrapper infers string or number storage type, validation, and Swagger enum metadata unless `type` is explicitly provided.
- Use `@Prop({ kind: 'virtual', mode: 'getter', comment, optional, hidden, expose, swagger })` for computed getters that only need class-transformer and Swagger metadata.
- Use `@Prop({ ref: () => User, foreignField, localField })` for populate-one virtuals when inferred defaults are enough.
- Use `@Prop({ type: () => [User], ref: () => User, foreignField, localField })` for populate-array virtuals.
- Use `@Prop({ kind: 'map', type: Object })` for raw maps/snapshots instead of passing `PropType.MAP` at the call site.

Common mappings:

| Use case | Preferred shape |
| --- | --- |
| Stored single reference id | `fieldId?: RefId<User>` with `@Prop({ type: ObjectId, ref: () => User })` |
| Stored reference id array | `fieldIds?: RefId<User>[]` with `@Prop({ type: [ObjectId], ref: () => User })` |
| Embedded value object | `@Schema({ kind: 'embedded' })` on the nested class |
| Embedded document | `@Schema({ kind: 'subdocument' })` on the nested class |
| Raw map/snapshot | `@Prop({ kind: 'map', type: Object })` |
| Populated single virtual | `field?: PopulatedRef<User>` with `@Prop({ ref: () => User, foreignField: '_id', localField: 'fieldId' })` |
| Populated virtual array | `fields?: PopulatedRef<User>[]` with `@Prop({ type: () => [User], ref: () => User, foreignField: '_id', localField: 'fieldIds' })` |
| Computed getter | `@Prop({ kind: 'virtual', mode: 'getter', comment: '...' }) get value() { ... }` |

Populate inference:

- `ref` + `localField` + `foreignField` marks the field as virtual populate.
- Populate-one can fallback to the same class from `ref`.
- Populate arrays still need `type: () => [Target]` because runtime reflection only sees `Array`.
- `justOne` defaults to `true` for non-array populate fields.
- Swagger examples default to `{}` or `[]` for populated fields unless explicitly overridden.

## Plugins

- Paranoid plugin handles soft delete filtering and must respect aggregate first-stage constraints such as `$geoNear`.
- Strict reference plugin validates referenced documents and must resolve models through the active connection.
- Transform plugin centralizes common document transformation and should not break Mongo update operators.

Plugin checklist:

- Paranoid aggregate injection must not come before `$geoNear`.
- Strict reference checks must be connection-aware in multi-connection apps.
- Transform behavior must preserve update operators such as `$set`, `$inc`, `$push`, and `$addToSet`.
- Do not treat plugins as a replacement for app authorization or domain validation.

## Debug Output

Use `mongoDebug(collection, method, ...args)` when a Mongoose debug callback should be rendered as a Mongo shell-friendly command.

Debug output is for developer diagnostics. Do not log credentials or sensitive document payloads in production logs.
