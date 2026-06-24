---
name: joktec-adapter-skill
description: Use when wiring or using JokTec adapter packages @joktec/cacher, @joktec/mailer, @joktec/notifier, or @joktec/storage for cache, mail delivery, push notifications, object storage, config-driven clients, and app-neutral adapter services.
metadata:
  dependencies:
    - joktec-framework-skill
    - joktec-common-skill
---

# JokTec Adapter Skill

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
