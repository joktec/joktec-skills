---
name: joktec-framework-skill
description: Use when working in a consumer project that uses @joktec/* packages and the agent needs to choose the right JokTec package skill, understand package boundaries, wire modules, or avoid mixing app logic into reusable JokTec infrastructure.
---

# JokTec Framework Skill

Start here when a task mentions JokTec generally, multiple `@joktec/*` packages, or a consumer app that needs framework wiring.

## Select The Focused Skill

- For `@joktec/core`, `@joktec/utils`, or `@joktec/cron`, use `joktec-common-skill`.
- For `@joktec/mongo`, use `joktec-mongo-skill`.
- For `@joktec/mysql`, use `joktec-mysql-skill`.
- For Kafka, RabbitMQ, SQS, or Redcast, use `joktec-broker-skill`.
- For cache, mail, notification, or storage adapters, use `joktec-adapter-skill`.
- For Elastic, Arango, or BigQuery, use `joktec-database-extended-skill`.
- For Firebase or GPT integrations, use `joktec-integration-skill`.
- For HTTP, file, or alert utilities, use `joktec-tool-skill`.

## Core Rules

- Treat `joktec-framework` code, package README files, and agent docs as source-of-truth.
- Keep consumer app business logic in the app; do not move it into `@joktec/*` packages.
- Prefer config-driven module setup and `conId` when a package supports multiple clients.
- Preserve NestJS module boundaries, dependency injection, lifecycle hooks, and exported package APIs.
- Do not invent behavior for unfinished or missing packages.
- If a focused skill is loaded without this entrypoint, still apply source-first lookup before assuming APIs.

## Reference

Read `references/framework-map.md` when the task needs package selection, dependency flow, or a quick map from requirement to package.
