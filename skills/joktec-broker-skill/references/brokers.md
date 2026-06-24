# Broker Usage

## Runtime Pattern

Broker services follow `AbstractClientService` lifecycle. Loader classes discover decorator metadata after module initialization. Apps define producers, consumers, and message semantics.

## Package Notes

- Kafka: check topic existence and broker advertised listeners in local development.
- RabbitMQ: use module options and decorators for exchanges, queues, and bindings.
- SQS: local ElasticMQ-style environments may require queues to exist before consumers start.
- Redcast: use Redis-backed list, stream, or pub/sub behavior when a lightweight broker is enough.
