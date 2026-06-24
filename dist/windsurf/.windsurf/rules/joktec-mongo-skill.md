# JokTec Mongo Skill

Use when working with @joktec/mongo in a consumer app, including MongoModule setup, Typegoose schema decorators, MongoRepo, MongoService, MongoHelper, plugins, ObjectId/query safety, soft delete, strict references, and cursor pagination.

Use this skill for MongoDB-backed resources that rely on JokTec's Mongoose/Typegoose wrapper.

## Rules

- Register app schema classes through `MongoModule.forRoot(...)`.
- Keep schema classes, app repositories, and app-specific queries in the consumer app.
- Extend `MongoRepo<T, ID>` for app repositories.
- Preserve `conId` when the app has multiple Mongo connections.
- Use schema-first decorators when a schema class should be reused as a DTO source.
- Treat ObjectId casting and regex behavior as safety-sensitive.

## References

- Read `references/repository.md` for `MongoService`, `MongoRepo`, query parsing, and cursor pagination.
- Read `references/schema-and-plugins.md` for decorators, paranoid soft delete, strict references, transform behavior, and debug output.

## Bundled References

### references/repository.md

# Mongo Repository Usage

## Module Setup

Register schemas with `MongoModule.forRoot({ conId, models: [...] })`. Use the same `conId` in app repositories when using non-default connections.

## Repository Pattern

Extend `MongoRepo` and pass the schema class to the base constructor. Services can then use `BaseService` from `@joktec/core`.

## Query Safety

- Root `id` can act as an API alias for `_id` in query conditions.
- ObjectId casting should be schema-aware and limited to `_id`, ObjectId paths, or explicitly configured paths.
- `$like`, `$begin`, and `$end` escape regex input by default.
- Do not rely on broad conversion when storing raw snapshots, maps, or nested subdocuments.

## Pagination

`MongoRepo.paginate` supports page, offset, and cursor responses. Cursor mode defaults to `_id`; custom `cursorKey` appends `_id` as a tie-breaker.

### references/schema-and-plugins.md

# Mongo Schema And Plugins

## Schema Decorators

Use `@Schema` and `@Prop` wrappers from `@joktec/mongo` for Typegoose schema metadata plus validation, transform, and Swagger metadata.

Avoid mutating shared option objects across multiple properties.

## Plugins

- Paranoid plugin handles soft delete filtering and must respect aggregate first-stage constraints such as `$geoNear`.
- Strict reference plugin validates referenced documents and must resolve models through the active connection.
- Transform plugin centralizes common document transformation and should not break Mongo update operators.

## Debug Output

Use `mongoDebug(collection, method, ...args)` when a Mongoose debug callback should be rendered as a Mongo shell-friendly command.
