---
name: joktec-tool-skill
description: Use when wiring or using JokTec tool packages @joktec/http, @joktec/file, or @joktec/alert, including Axios-backed HTTP clients, file classification helpers, Slack-compatible alert webhooks, config-driven lifecycle, and app-neutral utility services.
---

# JokTec Tool Skill

Use this skill for reusable utility services.

## Packages

- `@joktec/http`: Axios-backed HTTP client wrapper.
- `@joktec/file`: file classification and local file helpers.
- `@joktec/alert`: alert delivery through Slack-compatible webhooks.

## Rules

- Keep tools app-neutral and reusable.
- Use config-driven clients instead of direct ad hoc setup in app code.
- Preserve retry, metrics, proxy, and upload behavior where the package exposes it.
- Keep alert tokens and webhook URLs in runtime config only.

## Reference

Read `references/tools.md` for package-specific usage notes.
