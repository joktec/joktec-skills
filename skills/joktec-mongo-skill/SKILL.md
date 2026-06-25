---
name: joktec-mongo-skill
description: Use when working with @joktec/mongo in a consumer app, including MongoModule setup, Typegoose schema decorators, MongoRepo, MongoService, MongoHelper, plugins, ObjectId/query safety, soft delete, strict references, and cursor pagination.
metadata:
  dependencies:
    - joktec-framework-skill
    - joktec-common-skill
---

# JokTec Mongo Skill

Use this skill for MongoDB-backed resources that rely on JokTec's Mongoose/Typegoose wrapper.

## Rules

- Register app schema classes through `MongoModule.forRoot(...)`.
- Keep schema classes, app repositories, and app-specific queries in the consumer app.
- Extend `MongoRepo<T, ID>` for app repositories.
- Preserve `conId` when the app has multiple Mongo connections.
- Use schema-first decorators when a schema class should be reused as a DTO source; wrappers should reduce repeated Typegoose, validator, transformer, and Swagger stacks.
- Use `RefId<T>` for stored reference id fields and `PopulatedRef<T>` for populated virtual fields.
- Use `@Schema({ kind: 'embedded' })` for value objects without `_id` or timestamps.
- Use `@Schema({ kind: 'subdocument' })` for embedded documents that need their own `_id` and timestamps.
- Use `@Prop({ kind: 'virtual', mode: 'getter' })` for computed getters that need expose/Swagger metadata without persistence.
- Use `@Prop({ ref: () => Target, foreignField, localField })` for populate-one virtuals when inferred defaults are enough.
- Use `@Prop({ type: () => [Target], ref: () => Target, foreignField, localField })` for populate-array virtuals.
- Use `@Prop({ kind: 'map', type: Object })` for map/snapshot payloads that must keep their raw shape.
- Treat ObjectId casting and regex behavior as safety-sensitive.
- For real migrations, inspect `node_modules/@joktec/mongo` first, then installed README or GitHub package docs, then GitHub source before assuming APIs.

## References

- Read `references/repository.md` for `MongoService`, `MongoRepo`, query parsing, and cursor pagination.
- Read `references/schema-and-plugins.md` for decorators, paranoid soft delete, strict references, transform behavior, and debug output.
