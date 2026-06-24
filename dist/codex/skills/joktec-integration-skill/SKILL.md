---
name: joktec-integration-skill
description: Use when wiring or using JokTec integration packages @joktec/firebase or @joktec/gpt, including validated config, SDK client lifecycle, app-neutral integration services, credentials handling, and consumer app composition.
metadata:
  dependencies:
    - joktec-framework-skill
    - joktec-common-skill
---

# JokTec Integration Skill

Use this skill for third-party integration packages.

## Packages

- `@joktec/firebase`: Firebase Admin SDK integration.
- `@joktec/gpt`: GPT/OpenAI-style client integration.

## Rules

- Keep credentials config-driven and never commit real credentials.
- Use package services instead of direct SDK initialization in app code.
- Preserve app-neutral service behavior; consumer apps own domain workflows.
- Verify current package README/source before relying on advanced provider features.

## Reference

Read `references/integrations.md` for provider-specific notes.
