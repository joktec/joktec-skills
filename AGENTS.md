# JokTec Skills Agent Guide

This repository is the agent-skill distribution layer for projects that consume `@joktec/*` packages.

It is not the implementation source of truth. The implementation source of truth is `joktec-framework`.

## Read First

1. `README.md`
2. `skill-pack.json`
3. `skills/joktec-framework-skill/SKILL.md`
4. The focused `skills/*/SKILL.md` file for the package group being changed.
5. Referenced files under that skill's `references/`.
6. `scripts/validate-skills.mjs`
7. Adapter generators under `scripts/build-*.mjs`

## Source Of Truth

Always try to reference the local `joktec-framework` checkout first:

```text
/Users/user/Project/joktec/joktec-framework
```

Use local files such as:

- `AGENTS.md`
- `docs/agents/*`
- `packages/*/AGENTS.md`
- `packages/*/*/AGENTS.md`
- package README files
- package source code when docs are unclear

If the local `joktec-framework` checkout is unavailable, use the GitHub repository as fallback:

```text
https://github.com/joktec/joktec-framework
```

When using GitHub fallback, prefer stable package README files and current source over assumptions.

## Update Modes

There are two supported ways to update this repository.

### 1. From `joktec-framework`

Use this mode when the active context is the framework repository.

- Inspect implementation, package README files, and agent docs in `joktec-framework`.
- Update `joktec-skills` from that verified source.
- Keep skill content curated; do not copy entire framework docs blindly.
- Run validation and adapter generation in `joktec-skills`.

### 2. From `joktec-skills`

Use this mode when the active context is this skill repository.

- Resolve the local `joktec-framework` path first.
- If local source is missing, fall back to `https://github.com/joktec/joktec-framework`.
- Read the relevant framework docs/source before changing skills.
- Update canonical skill files under `skills/`.
- Regenerate adapter outputs under `dist/`.

## Repository Rules

- Canonical skill content lives under `skills/`.
- `SKILL.md` files must stay concise and route deeper detail to `references/`.
- `dist/` is generated output. Do not edit generated adapter files by hand.
- `adapters/` contains adapter notes and templates only.
- `scripts/` owns validation, source sync checks, and adapter generation.
- Do not add skills for testing, document sync, release, or commit workflows; this pack is only for using `@joktec/*` libraries.
- Do not document behavior that is not implemented in `joktec-framework`.
- Do not include secrets, credentials, private config, or real connection strings.

## Verification

Run these commands after changing skills or generators:

```bash
npm run build
npm run sync:check
npm run validate
```

`npm run sync:check` verifies expected local `joktec-framework` source files exist. It does not replace human review of the implementation truth.
