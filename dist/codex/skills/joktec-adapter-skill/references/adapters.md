# Adapter Usage

## Runtime Pattern

Adapters are global Nest modules. Services own native client creation and expose package-specific operations.

## Package Notes

- Cacher: choose local, Redis, or Memcached stores based on runtime config.
- Mailer: centralize mail transport configuration in the service that owns outbound email.
- Notifier: keep push provider configuration outside app business logic.
- Storage: keep storage metadata and object operations behind the adapter service.
