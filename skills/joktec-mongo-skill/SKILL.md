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
- Use schema-first decorators when a schema class should be reused as a DTO source.
- Treat ObjectId casting and regex behavior as safety-sensitive.

## References

- Read `references/repository.md` for `MongoService`, `MongoRepo`, query parsing, and cursor pagination.
- Read `references/schema-and-plugins.md` for decorators, paranoid soft delete, strict references, transform behavior, and debug output.
