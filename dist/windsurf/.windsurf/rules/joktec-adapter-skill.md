# JokTec Adapter Skill

Use when wiring or using JokTec adapter packages @joktec/cacher, @joktec/mailer, @joktec/notifier, or @joktec/storage for cache, mail delivery, push notifications, object storage, config-driven clients, and app-neutral adapter services.

Use this skill for pluggable external capability adapters.

## Packages

- `@joktec/cacher`: cache stores.
- `@joktec/mailer`: mail delivery.
- `@joktec/notifier`: push notifications.
- `@joktec/storage`: object storage and file metadata helpers.

## Rules

- Keep adapter services app-neutral.
- Use validated config and `conId` where supported.
- Keep secrets and credentials in app config or runtime environment, never in code.
- Prefer adapter services over direct SDK usage in app services.
- If guidance is insufficient, read this skill's references and inspect `../joktec-framework` package source or GitHub fallback before assuming APIs.

## Reference

Read `references/adapters.md` for setup and package-specific notes.

## Bundled References

### references/adapters.md

# Adapter Usage

## Source Lookup

When blocked, inspect:

- `packages/adapters/README.md`
- `packages/adapters/AGENTS.md`
- `packages/adapters/<package>/README.md`
- `packages/adapters/<package>/src/index.ts`
- package module/config/service files under `src/`

## Runtime Pattern

Adapters are global Nest modules. Services own native client creation and expose package-specific operations.

Most adapters follow `AbstractClientService`: config is validated, native clients are created by the service, `conId` selects the connection, and shutdown/retry/debug behavior should remain package-owned.

## Package Notes

- Cacher: choose local, Redis, or Memcached stores based on runtime config.
- Mailer: centralize mail transport configuration in the service that owns outbound email.
- Notifier: keep push provider configuration outside app business logic.
- Storage: keep storage metadata and object operations behind the adapter service.

## Best Practices

- Import adapter modules in the application layer, then inject services into domain services.
- Keep provider credentials, endpoints, bucket names, SMTP secrets, and push credentials in runtime config.
- Keep business payload composition in the consuming app. The adapter should send/cache/store, not decide product semantics.
- Use `conId` for multiple providers or tenants instead of creating ad-hoc service instances.
- Normalize provider errors at the package/app boundary so controllers do not branch on SDK-specific messages.
- Mock SDK clients in unit tests; run live provider checks only in explicit integration or consumer harness tests.

## Anti-Patterns

- Do not put email template business rules inside `@joktec/mailer`.
- Do not hardcode S3 buckets, Redis URLs, SMTP credentials, or notification tokens in source.
- Do not bypass adapter services by importing provider SDK clients directly throughout the app.
- Do not assume every adapter has identical method names; read each package README/source before calling.
