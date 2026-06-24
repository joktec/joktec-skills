# Broker Usage

## Source Lookup

When blocked, inspect:

- `packages/brokers/README.md`
- `packages/brokers/AGENTS.md`
- `packages/brokers/<package>/README.md`
- `packages/brokers/<package>/src/index.ts`
- package decorators, loaders, config, and service files under `src/`

## Runtime Pattern

Broker services follow `AbstractClientService` lifecycle. Loader classes discover decorator metadata after module initialization. Apps define producers, consumers, and message semantics.

Use broker packages for transport wiring, not for business workflow ownership. The consuming app owns event names, payload contracts, idempotency, retry policy, dead-letter behavior, and handler semantics.

## Package Notes

- Kafka: check topic existence and broker advertised listeners in local development.
- RabbitMQ: use module options and decorators for exchanges, queues, and bindings.
- SQS: local ElasticMQ-style environments may require queues to exist before consumers start.
- Redcast: use Redis-backed list, stream, or pub/sub behavior when a lightweight broker is enough.

## Best Practices

- Start consumers only in processes that should own subscriptions.
- Keep producer and consumer payload DTOs versionable and explicit.
- Use config paths or module options for topic/queue names when supported.
- Make handlers idempotent; brokers may redeliver.
- Add observable effects for consumer tests rather than asserting log text.
- Keep broker health/preflight checks separate from business request handling.
- In local stacks, verify broker-specific infrastructure: Kafka topics, Rabbit exchanges/queues, SQS queues, Redis password/db.

## Anti-Patterns

- Do not hide domain workflows inside decorators or broker package services.
- Do not assume auto-create topic/queue behavior unless the package and local broker support it.
- Do not run the same consumer group/queue owner in every process by accident.
- Do not swallow message handling errors without retry/dead-letter visibility.
