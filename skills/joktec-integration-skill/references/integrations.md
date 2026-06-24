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
