---
name: joktec-broker-skill
description: Use when wiring or using JokTec broker packages @joktec/kafka, @joktec/rabbit, @joktec/sqs, or @joktec/redcast, including client config, producer decorators, consumer loaders, message handlers, auto-binding, and app-level broker flows.
metadata:
  dependencies:
    - joktec-framework-skill
    - joktec-common-skill
---

# JokTec Broker Skill

Use this skill for message broker packages.

## Packages

- `@joktec/kafka`: Kafka client, decorators, loaders, metrics.
- `@joktec/rabbit`: RabbitMQ client, decorators, auto-binding, metrics.
- `@joktec/sqs`: AWS SQS/SNS queue and topic wrapper.
- `@joktec/redcast`: Redis-backed broker behavior.

## Rules

- Keep message business semantics in the consumer app.
- Use broker decorators for transport wiring, not for domain policy.
- Preserve config-driven client selection and `conId` when available.
- Keep topic, queue, and routing names explicit in app configuration or decorators.

## Reference

Read `references/brokers.md` for setup and package-specific notes.
