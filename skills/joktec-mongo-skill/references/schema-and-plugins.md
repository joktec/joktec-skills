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
