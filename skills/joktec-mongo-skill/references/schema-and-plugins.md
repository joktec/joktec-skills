# Mongo Schema And Plugins

## Source Lookup

When blocked, inspect:

- `packages/databases/mongo/src/decorators/scheme.decorator.ts`
- `packages/databases/mongo/src/decorators/prop.decorator.ts`
- `packages/databases/mongo/src/decorators/props/*`
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
