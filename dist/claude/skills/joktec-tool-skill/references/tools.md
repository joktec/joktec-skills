# Tool Usage

## Source Lookup

When blocked, inspect:

- `packages/tools/README.md`
- `packages/tools/AGENTS.md`
- `packages/tools/<package>/README.md`
- `packages/tools/<package>/src/index.ts`
- package config/module/service/helper files under `src/`

## HTTP

Use `@joktec/http` for Axios-backed requests, uploads, proxy agent support, retry config, and metrics where exposed.

Best practice:

- Use the package service for outbound HTTP so retry/proxy/metrics behavior stays centralized.
- Keep external endpoint URLs and credentials in runtime config.
- Be careful with ESM/CommonJS import changes in HTTP/Axios ecosystem packages.
- Test request behavior with mocks unless the test is an explicit consumer integration scenario.

## File

Use `@joktec/file` for shared file helpers and classification behavior instead of duplicating local utility code.

Best practice:

- Keep filesystem paths and temporary directories environment-specific.
- Validate upload/file inputs before passing them into business workflows.
- Use package helpers for MIME/classification behavior when consistency matters across services.

## Alert

Use `@joktec/alert` for Slack-compatible webhook alerts. Keep webhook URLs and credentials out of source control.

Best practice:

- Treat alert messages as operational notifications, not business workflows.
- Do not leak secrets, tokens, connection strings, or personal data into alert payloads.
- `@joktec/alert` is present but less complete than core database/client packages; inspect source before depending on advanced behavior.

## Anti-Patterns

- Do not scatter raw Axios instances across the app when `@joktec/http` should own shared behavior.
- Do not commit webhook URLs or proxy credentials.
- Do not use tool packages as hidden places for app business rules.
