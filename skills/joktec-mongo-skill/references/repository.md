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
