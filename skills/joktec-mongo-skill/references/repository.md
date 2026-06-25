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

## Repository Pattern

Extend `MongoRepo` and pass the schema class to the base constructor. Services can then use `BaseService` from `@joktec/core`.

Repository checklist:

- Keep schema-specific query helpers in the app repository, not in controllers.
- Use repository methods for standard reads so query parsing, soft delete, populate, and pagination stay consistent.
- Pass transaction/session options through read-modify-write flows when the app uses transactions.
- Repository read paths should return schema class instances with normalized ObjectId/string values, including populated and deep-populated values.
- Code that needs raw Mongoose documents should use `MongoService.getModel(...)` or Typegoose/Mongoose APIs directly.

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
