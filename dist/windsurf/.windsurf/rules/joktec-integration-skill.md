# JokTec Integration Skill

Use when wiring or using JokTec integration packages @joktec/firebase or @joktec/gpt, including validated config, SDK client lifecycle, app-neutral integration services, credentials handling, and consumer app composition.

Use this skill for third-party integration packages.

## Packages

- `@joktec/firebase`: Firebase Admin SDK integration.
- `@joktec/gpt`: GPT/OpenAI-style client integration.

## Rules

- Keep credentials config-driven and never commit real credentials.
- Use package services instead of direct SDK initialization in app code.
- Preserve app-neutral service behavior; consumer apps own domain workflows.
- Verify current package README/source before relying on advanced provider features.
- If guidance is insufficient, read this skill's references and inspect `../joktec-framework` package source or GitHub fallback before assuming APIs.

## Reference

Read `references/integrations.md` for provider-specific notes.

## Bundled References

### references/integrations.md

# Integration Usage

## Source Lookup

When blocked, inspect:

- `packages/integrations/README.md`
- `packages/integrations/AGENTS.md`
- `packages/integrations/<package>/README.md`
- `packages/integrations/<package>/src/index.ts`
- package config/module/service files under `src/`

## Firebase

Use the integration module and service to initialize Firebase Admin clients from validated config. Keep credential files local or environment-provided.

Best practice:

- Keep service account JSON, private keys, and project credentials out of git.
- Prefer environment-specific config or ignored local credential files.
- Keep notification/user/storage/product semantics in the consumer app.
- Mock Firebase Admin SDK in package tests; use live credentials only in explicit integration environments.

## GPT

Use the integration package for reusable GPT client setup. Keep prompt/business policy in the consumer app, not in the generic package.

Best practice:

- Keep prompts, model choice policy, tool schemas, and product safety rules in the consumer app.
- Keep API keys in secret management or environment config.
- Verify current package completeness before relying on advanced APIs; `@joktec/gpt` may lag behind provider SDK changes.

## Anti-Patterns

- Do not commit real credential files.
- Do not encode product-specific prompts or notification logic into the reusable integration package.
- Do not assume provider SDK behavior without checking package source and provider docs when APIs are unstable.
